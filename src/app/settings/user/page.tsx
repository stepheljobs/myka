'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Grid from '@/components/ui/Grid';
import Link from 'next/link';
import { useState } from 'react';

function UserSettingsContent() {
  const { state, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(state.user?.displayName || '');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // TODO: Implement profile update logic
      console.log('Saving profile:', { displayName });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  return (
    <main className="min-h-screen bg-brutal-white">
      {/* Header */}
      <header className="bg-brutal-white border-b-brutal border-brutal-black shadow-brutal-sm">
        <div className="brutal-container py-6">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h3" weight="bold">
                User Settings
              </Typography>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="brutal-container py-8 space-y-8">
        {/* Email Verification Notice */}
        {state.user && !state.user.emailVerified && (
          <Card className="border-brutal border-brutal-black shadow-brutal-md bg-brutal-orange/10">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-brutal-orange border-brutal border-brutal-black shadow-brutal-sm flex items-center justify-center rounded-lg">
                  <Typography variant="h4" weight="bold">
                    ⚠️
                  </Typography>
                </div>
                <div className="flex-1">
                  <Typography variant="h5" weight="bold" className="mb-2">
                    Email Verification Required
                  </Typography>
                  <Typography variant="body" className="text-brutal-gray mb-4">
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

        <Grid cols={2} gap="lg">
          {/* User Profile Card */}
          <Card className="border-brutal border-brutal-black shadow-brutal-lg">
            <CardHeader className="pb-4">
              <CardTitle>
                <Typography variant="h4" weight="bold">
                  Your Profile
                </Typography>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Typography variant="caption" className="text-brutal-gray">
                  Email Address
                </Typography>
                <Typography variant="body" weight="medium" className="p-3 bg-brutal-gray/10 rounded-lg border border-brutal-gray/20">
                  {state.user?.email}
                </Typography>
              </div>
              
              <div className="space-y-2">
                <Typography variant="caption" className="text-brutal-gray">
                  Display Name
                </Typography>
                {isEditing ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-3 py-2 border-brutal border-brutal-black bg-brutal-white focus:outline-none focus:ring-2 focus:ring-brutal-blue rounded-lg"
                    placeholder="Enter display name"
                  />
                ) : (
                  <Typography variant="body" weight="medium" className="p-3 bg-brutal-gray/10 rounded-lg border border-brutal-gray/20">
                    {state.user?.displayName || 'Not set'}
                  </Typography>
                )}
              </div>
              
              <div className="space-y-2">
                <Typography variant="caption" className="text-brutal-gray">
                  Email Verified
                </Typography>
                <div className="flex items-center space-x-2 p-3 bg-brutal-gray/10 rounded-lg border border-brutal-gray/20">
                  <Typography variant="body" weight="medium">
                    {state.user?.emailVerified ? 'Yes' : 'No'}
                  </Typography>
                  {state.user?.emailVerified ? (
                    <span className="text-brutal-green">✅</span>
                  ) : (
                    <span className="text-brutal-red">❌</span>
                  )}
                </div>
              </div>
              
              <div className="pt-4">
                {isEditing ? (
                  <div className="flex space-x-3">
                    <Button 
                      variant="default" 
                      size="default" 
                      onClick={handleSaveProfile}
                      className="flex-1"
                    >
                      Save Changes
                    </Button>
                    <Button 
                      variant="secondary" 
                      size="default" 
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(state.user?.displayName || '');
                      }}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="secondary" 
                    size="default" 
                    className="w-full"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Actions Card */}
          <Card className="border-brutal border-brutal-black shadow-brutal-lg">
            <CardHeader className="pb-4">
              <CardTitle>
                <Typography variant="h4" weight="bold">
                  Account Actions
                </Typography>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Typography variant="body" weight="medium">
                  Change Password
                </Typography>
                <Typography variant="caption" className="text-brutal-gray block">
                  Update your account password
                </Typography>
                <Button variant="secondary" size="sm" className="w-full">
                  Change Password
                </Button>
              </div>
              
              <div className="space-y-3">
                <Typography variant="body" weight="medium">
                  Delete Account
                </Typography>
                <Typography variant="caption" className="text-brutal-gray block">
                  Permanently delete your account and data
                </Typography>
                <Button variant="destructive" size="sm" className="w-full">
                  Delete Account
                </Button>
              </div>
              
              <div className="pt-6 border-t border-brutal-gray/30">
                <Button 
                  variant="secondary" 
                  size="default" 
                  className="w-full"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </Grid>

        {/* Settings Navigation */}
        <Card className="border-brutal border-brutal-black shadow-brutal-lg">
          <CardHeader className="pb-6">
            <CardTitle>
              <Typography variant="h4" weight="bold">
                Settings
              </Typography>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={2} gap="lg">
              <Link href="/settings/morning-routine">
                <Card className="border-brutal border-brutal-black shadow-brutal-md hover:shadow-brutal-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6 text-center">
                    <Typography variant="h4" className="mb-3">🌅</Typography>
                    <Typography variant="h5" weight="bold" className="mb-2">
                      Morning Routine
                    </Typography>
                    <Typography variant="caption" className="text-brutal-gray">
                      Configure your morning routine settings
                    </Typography>
                  </CardContent>
                </Card>
              </Link>

              <Card className="border-brutal border-brutal-black shadow-brutal-md hover:shadow-brutal-lg transition-shadow cursor-pointer h-full">
                <CardContent className="p-6 text-center">
                  <Typography variant="h4" className="mb-3">🔔</Typography>
                  <Typography variant="h5" weight="bold" className="mb-2">
                    Notifications
                  </Typography>
                  <Typography variant="caption" className="text-brutal-gray">
                    Manage notification preferences
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

export default function UserSettingsPage() {
  return (
    <ProtectedRoute>
      <UserSettingsContent />
    </ProtectedRoute>
  );
} 