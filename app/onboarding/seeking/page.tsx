'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase/client';

const businessTypes = [
  'Landscaping',
  'Plumbing',
  'HVAC',
  'Electrical',
  'Carpentry',
  'Painting',
  'Cleaning',
  'Other',
];

export default function SeekingOnboardingPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    businessType: '',
    address: '',
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Save profile data in the database
      const { error } = await supabase.from('profiles').upsert([
        {
          full_name: formData.fullName,
          company_name: formData.companyName,
          business_type: formData.businessType,
          address: formData.address,
          bio: formData.bio,
          role: 'seeking',
        },
      ]);

      if (error) throw error;

      // Once profile is saved, authenticate the user
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: 'user@example.com',  // Replace with actual email stored or input
        password: 'password',  // Replace with actual password input
      });

      if (authError) throw authError;

      toast({
        title: 'Success!',
        description: 'Profile has been created and you are logged in.',
      });

      // Redirect to seeking dashboard
      router.push('/seeking-dashboard');
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Enter your company name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type</Label>
            <Select
              value={formData.businessType}
              onValueChange={(value) => setFormData({ ...formData, businessType: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                {businessTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter your address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Short Bio</Label>
            <Input
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Complete Profile'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
