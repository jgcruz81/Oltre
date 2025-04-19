'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [userType, setUserType] = useState<'seeker' | 'seeking' | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const param = searchParams.get('type');
    if (param === 'seeker' || param === 'seeking') {
      setUserType(param);
    } else {
      toast({
        title: 'Invalid user type',
        description: 'Invalid access type.',
        variant: 'destructive',
      });
      router.replace('/');
    }
  }, [searchParams]);

  const handleAuth = async (isSignUp: boolean) => {
    try {
      setLoading(true);

      if (isSignUp && userType) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: ['onboard', userType],
            },
          },
        });

        if (signUpError) throw signUpError;

        const userId = signUpData.user?.id;

        if (userId) {
          const { error: insertError } = await supabase.from('profiles').insert([
            {
              id: userId,
              role: ['onboard', userType],
              full_name: '',
              address: '',
              company_name: '',
              business_type: '',
              latitude: null,
              longitude: null,
            },
          ]);

          if (insertError) throw insertError;
        }

        toast({
          title: 'Success!',
          description: 'Please check your email to verify your account.',
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        router.push('/dashboard'); // you’ll change this logic later to route based on profile.role
      }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary p-4">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          {userType ? `Join as ${userType}` : 'Welcome Back'}
        </h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Button
              className="w-full"
              onClick={() => handleAuth(!!userType)}
              disabled={loading}
            >
              {loading ? 'Loading...' : userType ? 'Sign Up' : 'Sign In'}
            </Button>

            {!userType && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleAuth(true)}
                disabled={loading}
              >
                Create Account
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
