/*
  # Initial Schema Setup for Gig Marketplace

  1. New Tables
    - profiles
      - Stores user profile information and preferences
      - Links to Supabase auth.users
    - gigs
      - Stores gig listings with location data
    - applications
      - Stores gig applications from seekers
    
  2. Security
    - Enable RLS on all tables
    - Add policies for appropriate access control
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  user_type TEXT NOT NULL CHECK (user_type IN ('seeker', 'seeking', 'admin')),
  full_name TEXT,
  max_distance NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create gigs table
CREATE TABLE gigs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location_name TEXT NOT NULL,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  payment_amount NUMERIC NOT NULL,
  payment_type TEXT NOT NULL CHECK (payment_type IN ('fixed', 'hourly')),
  created_by uuid REFERENCES profiles(id),
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'completed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create applications table
CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id uuid REFERENCES gigs(id),
  applicant_id uuid REFERENCES profiles(id),
  cover_letter TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(gig_id, applicant_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Gigs policies
CREATE POLICY "Gigs are viewable by everyone"
  ON gigs FOR SELECT
  USING (true);

CREATE POLICY "Seeking users can create gigs"
  ON gigs FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'seeking'
    )
  );

CREATE POLICY "Users can update own gigs"
  ON gigs FOR UPDATE
  USING (created_by = auth.uid());

-- Applications policies
CREATE POLICY "Users can view own applications"
  ON applications FOR SELECT
  USING (
    applicant_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM gigs
      WHERE gigs.id = applications.gig_id
      AND gigs.created_by = auth.uid()
    )
  );

CREATE POLICY "Seekers can create applications"
  ON applications FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND user_type = 'seeker'
    )
  );

CREATE POLICY "Users can update own applications"
  ON applications FOR UPDATE
  USING (applicant_id = auth.uid());