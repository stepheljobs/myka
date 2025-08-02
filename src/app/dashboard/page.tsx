'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Grid from '@/components/ui/Grid';
import Shape from '@/components/ui/Shapes';
import Link from 'next/link';
import { useInstallation } from '@/hooks/useInstallation';
import InstallPrompt from '@/components/InstallPrompt';
import IOSInstallInstructions from '@/components/IOSInstallInstructions';
import BottomNavigation from '@/components/BottomNavigation';
import JournalCard from '@/components/ui/JournalCard';
import DailiesCard from '@/components/ui/DailiesCard';
import { useState } from 'react';

function DashboardContent() {
  const { state, signOut } = useAuth();
  const { 
    canInstall, 
    isInstalled, 
    platform, 
    shouldShowPrompt, 
    showInstallPrompt 
  } = useInstallation();
  const [showInstallModal, setShowInstallModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-background border-b shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h3" weight="bold">
                MY Kaizen App
              </Typography>
            </div>
            <div className="flex items-center space-x-4">
              <Typography variant="body" className="text-muted-foreground hidden sm:block">
                {state.user?.email}
              </Typography>
              <Link href="/notification-test">
                <Button
                  variant="outline"
                  size="sm"
                >
                  🧪 Test Notifications
                </Button>
              </Link>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                disabled={state.loading}
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <Typography variant="h1" weight="bold" className="mb-2">
            {getGreeting()}!
          </Typography>
          <Typography variant="h4" color="muted" className="mb-6">
            Welcome back to your dashboard
          </Typography>

          {/* Email Verification Notice */}
          {state.user && !state.user.emailVerified && (
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-orange-100 border border-orange-300 rounded-lg flex items-center justify-center">
                    <Typography variant="h4" weight="bold">
                      ⚠️
                    </Typography>
                  </div>
                  <div className="flex-1">
                    <Typography variant="h5" weight="semibold" className="mb-1">
                      Email Verification Required
                    </Typography>
                    <Typography variant="body" color="muted" className="mb-3">
                      Please verify your email address to access all features.
                    </Typography>
                    <Button variant="default" size="sm">
                      Resend Verification Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <Grid cols={1} gap="lg" className="mb-8">
          {/* PWA Features Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">PWA Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted border rounded-lg">
                <div>
                  <Typography variant="body" weight="medium">
                    Offline Mode
                  </Typography>
                  <Typography variant="caption" color="muted">
                    Works without internet
                  </Typography>
                </div>
                <span className="text-green-600 text-xl">✅</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted border rounded-lg">
                <div>
                  <Typography variant="body" weight="medium">
                    Push Notifications
                  </Typography>
                  <Typography variant="caption" color="muted">
                    Stay updated
                  </Typography>
                </div>
                <span className="text-orange-600 text-xl">🔔</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted border rounded-lg">
                <div>
                  <Typography variant="body" weight="medium">
                    Home Screen Install
                  </Typography>
                  <Typography variant="caption" color="muted">
                    {isInstalled ? 'Already installed' : 'Add to home screen'}
                  </Typography>
                </div>
                <span className="text-blue-600 text-xl">
                  {isInstalled ? '✅' : '📱'}
                </span>
              </div>
              
              {!isInstalled && canInstall ? (
                <Button 
                  variant="secondary" 
                  size="default" 
                  className="w-full"
                  onClick={() => {
                    if (platform === 'android') {
                      showInstallPrompt();
                    } else {
                      setShowInstallModal(true);
                    }
                  }}
                >
                  Install PWA
                </Button>
              ) : isInstalled ? (
                <Button variant="default" size="default" className="w-full" disabled>
                  PWA Installed ✅
                </Button>
              ) : (
                <Button variant="outline" size="default" className="w-full" disabled>
                  Installation Not Available
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Morning Routine Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">🌅 Morning Routine</CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant="body" color="muted" className="mb-6">
              Start your day with healthy habits - track your weight and stay hydrated
            </Typography>
            
            <Grid cols={2} gap="md" className="mb-6">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Typography variant="h4" className="mb-2">🌅</Typography>
                  <Typography variant="h5" weight="semibold" className="mb-2">
                    Morning Routine
                  </Typography>
                  <Typography variant="caption" color="muted" className="mb-4">
                    Daily health tracking
                  </Typography>
                  <Link href="/dashboard/morning-routine">
                    <Button variant="default" size="sm" className="w-full">
                      Start Routine
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Typography variant="h4" className="mb-2">⚖️</Typography>
                  <Typography variant="h5" weight="semibold" className="mb-2">
                    Weight Tracking
                  </Typography>
                  <Typography variant="caption" color="muted" className="mb-4">
                    Monitor your progress
                  </Typography>
                  <Link href="/dashboard/weight">
                    <Button variant="outline" size="sm" className="w-full">
                      Track Weight
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </Grid>

            <Grid cols={2} gap="md">
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Typography variant="h4" className="mb-2">💧</Typography>
                  <Typography variant="h5" weight="semibold" className="mb-2">
                    Water Tracking
                  </Typography>
                  <Typography variant="caption" color="muted" className="mb-4">
                    Stay hydrated
                  </Typography>
                  <Link href="/dashboard/water">
                    <Button variant="outline" size="sm" className="w-full">
                      Track Water
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <JournalCard />
            </Grid>
          </CardContent>
        </Card>

        {/* Daily Tracking Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">📊 Daily Tracking</CardTitle>
          </CardHeader>
          <CardContent>
            <Typography variant="body" color="muted" className="mb-6">
              Monitor your daily health and wellness metrics
            </Typography>
            
            <Grid cols={1} gap="md">
              <DailiesCard />
            </Grid>
          </CardContent>
        </Card>

        {/* Settings Link */}
        <div className="text-center mb-8">
          <Link href="/settings/morning-routine">
            <Button variant="outline" size="default">
              ⚙️ Configure Morning Routine
            </Button>
          </Link>
        </div>

        {/* Action Cards */}
        <Grid cols={3} gap="md">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Typography variant="h4" className="mb-2">⚙️</Typography>
              <Typography variant="h5" weight="semibold" className="mb-2">
                Settings
              </Typography>
              <Typography variant="caption" color="muted" className="mb-4">
                Manage your preferences
              </Typography>
              <Link href="/settings/user">
                <Button variant="outline" size="sm" className="w-full">
                  Open Settings
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Typography variant="h4" className="mb-2">📊</Typography>
              <Typography variant="h5" weight="semibold" className="mb-2">
                Analytics
              </Typography>
              <Typography variant="caption" color="muted" className="mb-4">
                View your usage stats
              </Typography>
              <Button variant="outline" size="sm" className="w-full">
                View Stats
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <Typography variant="h4" className="mb-2">💬</Typography>
              <Typography variant="h5" weight="semibold" className="mb-2">
                Support
              </Typography>
              <Typography variant="caption" color="muted" className="mb-4">
                Get help and support
              </Typography>
              <Button variant="outline" size="sm" className="w-full">
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </div>

      {/* Installation Prompts */}
      {shouldShowPrompt && platform === 'android' && (
        <InstallPrompt />
      )}
      
      {shouldShowPrompt && platform === 'ios' && (
        <IOSInstallInstructions />
      )}

      {showInstallModal && platform === 'ios' && (
        <IOSInstallInstructions onClose={() => setShowInstallModal(false)} />
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}