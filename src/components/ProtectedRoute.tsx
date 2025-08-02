'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Typography from '@/components/ui/Typography';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireEmailVerification?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = '/login',
  requireEmailVerification = false 
}: ProtectedRouteProps) {
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!state.loading && !state.isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // If email verification is required and user email is not verified
    if (
      requireEmailVerification && 
      state.user && 
      !state.user.emailVerified && 
      !state.loading
    ) {
      router.push('/verify-email');
      return;
    }
  }, [state.loading, state.isAuthenticated, state.user, router, redirectTo, requireEmailVerification]);

  // Show loading state while checking authentication
  if (state.loading) {
    return (
      <div className="min-h-screen bg-brutal-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-brutal-orange border-brutal border-brutal-black shadow-brutal-md animate-pulse">
            <div className="w-full h-full flex items-center justify-center">
              <Typography variant="h3" weight="bold">
                🔐
              </Typography>
            </div>
          </div>
          <Typography variant="h4" weight="bold" className="mb-2">
            Checking Authentication
          </Typography>
          <Typography variant="body" className="text-brutal-gray">
            Please wait while we verify your session...
          </Typography>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!state.isAuthenticated) {
    return null;
  }

  // Show email verification required message
  if (requireEmailVerification && state.user && !state.user.emailVerified) {
    return null; // Will redirect to verify-email page
  }

  // Render protected content
  return <>{children}</>;
}