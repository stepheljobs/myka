'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { state, sendPasswordResetEmail, clearError } = useAuth();
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
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
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
    setIsLoading(true);

    try {
      await sendPasswordResetEmail(email);
      setShowSuccessMessage(true);
    } catch (error) {
      // Error is handled by the auth context and will appear in state.error
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (value: string) => {
    setEmail(value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: undefined }));
    }
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
      clearError();
    }
  };

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(email);
    } catch (error) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  // Show success message after email is sent
  if (showSuccessMessage) {
    return (
      <main className="min-h-screen bg-brutal-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Typography variant="h1" weight="bold" className="mb-2">
              Check Your Email
            </Typography>
            <Typography variant="body" className="text-brutal-gray">
              Password reset instructions sent
            </Typography>
          </div>

          <Card className="p-6">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-brutal-yellow border-brutal border-brutal-black shadow-brutal-md flex items-center justify-center">
                <Typography variant="h2" weight="bold">
                  🔑
                </Typography>
              </div>

              <div>
                <Typography variant="h4" weight="bold" className="mb-2">
                  Reset Email Sent
                </Typography>
                <Typography variant="body" className="text-brutal-gray mb-4">
                  We&apos;ve sent password reset instructions to {email}. Click the link in the email to reset your password.
                </Typography>
                <Typography variant="caption" className="text-brutal-gray">
                  Don&apos;t see the email? Check your spam folder.
                </Typography>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Resend Reset Email
                </Button>

                <Link href="/login">
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                  >
                    Back to Sign In
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

  return (
    <main className="min-h-screen bg-brutal-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Typography variant="h1" weight="bold" className="mb-2">
            Reset Password
          </Typography>
          <Typography variant="body" className="text-brutal-gray">
            Enter your email to receive reset instructions
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
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter your email address"
                disabled={isLoading}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <Typography variant="caption" className="text-red-500 mt-1">
                  {errors.email}
                </Typography>
              )}
              <Typography variant="caption" className="text-brutal-gray mt-1">
                We&apos;ll send password reset instructions to this email
              </Typography>
            </div>

            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Instructions'}
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Typography variant="body" className="text-brutal-gray mb-3">
                Remember your password?
              </Typography>
              <Link href="/login">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Back to Sign In
                </Button>
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