'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import Typography from '@/components/ui/Typography';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [errors, setErrors] = useState<{ 
    email?: string; 
    password?: string; 
    confirmPassword?: string; 
    general?: string 
  }>({});
  
  const { state, signUp, sendEmailVerification, clearError } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (state.isAuthenticated && !showVerificationMessage) {
      router.push('/dashboard');
    }
  }, [state.isAuthenticated, router, showVerificationMessage]);

  // Clear errors when component mounts or auth error changes
  useEffect(() => {
    if (state.error) {
      setErrors(prev => ({ ...prev, general: state.error || undefined }));
    }
  }, [state.error]);

  const validateForm = (): boolean => {
    const newErrors: { 
      email?: string; 
      password?: string; 
      confirmPassword?: string; 
    } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      await signUp(email, password);
      setShowVerificationMessage(true);
    } catch (error) {
      // Error is handled by the auth context and will appear in state.error
    }
  };

  const handleResendVerification = async () => {
    try {
      await sendEmailVerification();
      // Show success message or update UI
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  const handleInputChange = (field: 'email' | 'password' | 'confirmPassword', value: string) => {
    if (field === 'email') {
      setEmail(value);
      if (errors.email) {
        setErrors(prev => ({ ...prev, email: undefined }));
      }
    } else if (field === 'password') {
      setPassword(value);
      if (errors.password) {
        setErrors(prev => ({ ...prev, password: undefined }));
      }
      // Also clear confirm password error if passwords now match
      if (confirmPassword && value === confirmPassword && errors.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
      }
    } else {
      setConfirmPassword(value);
      if (errors.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
      }
    }
    
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: undefined }));
      clearError();
    }
  };

  // Show verification message after successful registration
  if (showVerificationMessage) {
    return (
      <main className="min-h-screen bg-brutal-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Typography variant="h1" weight="bold" className="mb-2">
              Check Your Email
            </Typography>
            <Typography variant="body" className="text-brutal-gray">
              We&apos;ve sent a verification link to your email
            </Typography>
          </div>

          <Card className="p-6">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-brutal-green border-brutal border-brutal-black shadow-brutal-md flex items-center justify-center">
                <Typography variant="h2" weight="bold">
                  ✉️
                </Typography>
              </div>

              <div>
                <Typography variant="h4" weight="bold" className="mb-2">
                  Verification Email Sent
                </Typography>
                <Typography variant="body" className="text-brutal-gray mb-4">
                  Please check your email ({email}) and click the verification link to activate your account.
                </Typography>
                <Typography variant="caption" className="text-brutal-gray">
                  Don&apos;t see the email? Check your spam folder.
                </Typography>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleResendVerification}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Resend Verification Email
                </Button>

                <Link href="/login">
                  <Button
                    variant="default"
                    size="lg"
                    className="w-full"
                  >
                    Continue to Sign In
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
            Create Account
          </Typography>
          <Typography variant="body" className="text-brutal-gray">
            Join us and start your journey
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
                placeholder="Create a strong password"
                disabled={state.loading}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <Typography variant="caption" className="text-red-500 mt-1">
                  {errors.password}
                </Typography>
              )}
              <Typography variant="caption" className="text-brutal-gray mt-1">
                Must contain uppercase, lowercase, and number
              </Typography>
            </div>

            <div>
              <label className="block mb-2">
                <Typography variant="body" weight="medium">
                  Confirm Password
                </Typography>
              </label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your password"
                disabled={state.loading}
                className={errors.confirmPassword ? "border-red-500" : ""}
              />
              {errors.confirmPassword && (
                <Typography variant="caption" className="text-red-500 mt-1">
                  {errors.confirmPassword}
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
              {state.loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6">
            <div className="border-t-brutal border-brutal-black pt-4">
              <Typography variant="body" className="text-center text-brutal-gray mb-3">
                Already have an account?
              </Typography>
              <Link href="/login">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full"
                >
                  Sign In
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