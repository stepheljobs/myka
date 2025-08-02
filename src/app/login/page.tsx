'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const { state, signIn, clearError } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated) {
      router.push('/dashboard');
    }
  }, [state.isAuthenticated, router]);

  // Clear errors when component mounts or auth error changes
  useEffect(() => {
    if (state.error) {
      setErrors(prev => ({ ...prev, general: state.error || undefined }));
    }
  }, [state.error]);

  const validateForm = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setErrors({});
    clearError();

    try {
      await signIn(email, password);
      // Redirect will happen via useEffect when state.isAuthenticated becomes true
    } catch (error) {
      // Error is handled by the auth context and will appear in state.error
    }
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    if (field === 'email') {
      setEmail(value);
      if (errors.email) {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    } else {
      setPassword(value);
      if (errors.password) {
        setErrors(prev => ({ ...prev, password: undefined }));
      }
    }
    
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
      clearError();
    }
  };

  return (
    <main className="min-h-screen bg-brutal-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Typography variant="h1" weight="bold" className="mb-2">
            Welcome Back
          </Typography>
          <Typography variant="body" className="text-brutal-gray">
            Sign in to your account to continue
          </Typography>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="p-4 border-brutal border-brutal-red bg-brutal-red bg-opacity-10">
                <Typography variant="body" className="text-brutal-red font-brutal-medium">
                  {errors.general}
                </Typography>
              </div>
            )}

            <div>
              <label className="block mb-2">
                <Typography variant="body" weight="medium">
                  Email Address
                </Typography>
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                disabled={state.loading}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <Typography variant="caption" className="text-red-500 mt-1">
                  {errors.email}
                </Typography>
              )}
            </div>

            <div>
              <label className="block mb-2">
                <Typography variant="body" weight="medium">
                  Password
                </Typography>
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                disabled={state.loading}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <Typography variant="caption" className="text-red-500 mt-1">
                  {errors.password}
                </Typography>
              )}
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full"
              disabled={state.loading}
            >
              {state.loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Link 
                href="/reset-password"
                className="text-brutal-base font-brutal-medium text-brutal-black hover:text-brutal-orange transition-colors duration-200 underline decoration-2 underline-offset-4"
              >
                Forgot your password?
              </Link>
            </div>

            <div className="border-t-brutal border-brutal-black pt-4">
              <Typography variant="body" className="text-center text-brutal-gray mb-3">
                Don&apos;t have an account?
              </Typography>
              <Link href="/register">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <div className="text-center mt-6">
          <Link 
            href="/"
            className="text-brutal-sm font-brutal-medium text-brutal-gray hover:text-brutal-black transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}