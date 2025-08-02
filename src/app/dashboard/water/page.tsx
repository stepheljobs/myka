'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Grid from '@/components/ui/Grid';
import Shape from '@/components/ui/Shapes';
import { useState } from 'react';
import { MorningRoutineService } from '@/lib/morning-routine-service';

function WaterTrackingContent() {
  const { state } = useAuth();
  const [customAmount, setCustomAmount] = useState('');

  const handleLogWater = async (amount: number) => {
    if (!state.user) return;
    try {
      const entryId = await MorningRoutineService.logWater({
        userId: state.user.uid,
        amount,
        date: new Date(),
        time: new Date(),
      });
      if (entryId) {
        // TODO: Add success notification
      }
    } catch (error) {
      console.error('Error logging water:', error);
    }
  };

  const handleCustomAmount = () => {
    const amount = parseInt(customAmount);
    if (amount > 0) {
      handleLogWater(amount);
      setCustomAmount('');
    }
  };

  return (
    <main className="min-h-screen bg-brutal-white">
      {/* Header */}
      <header className="bg-brutal-white border-b-brutal border-brutal-black shadow-brutal-sm">
        <div className="brutal-container py-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h3" weight="bold">
                Water Tracking
              </Typography>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="secondary" size="sm">
                View History
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="brutal-container py-brutal-lg">
        {/* Today's Progress */}
        <Card className="p-6 mb-brutal-lg">
          <Typography variant="h4" weight="bold" className="mb-4">
            Today&apos;s Hydration
          </Typography>
          
          <div className="text-center mb-6">
            <Typography variant="h1" weight="bold" className="mb-2">
              0 / 2000ml
            </Typography>
            <div className="w-full bg-brutal-light-gray border-brutal border-brutal-black h-6">
              <div className="bg-brutal-blue h-full transition-all duration-300" style={{ width: '0%' }}></div>
            </div>
            <Typography variant="caption" className="text-brutal-gray mt-2 block">
              0% complete
            </Typography>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <Typography variant="h5" weight="bold" className="mb-1">
                0
              </Typography>
              <Typography variant="caption" className="text-brutal-gray">
                Glasses (250ml)
              </Typography>
            </div>
            <div className="text-center">
              <Typography variant="h5" weight="bold" className="mb-1">
                0
              </Typography>
              <Typography variant="caption" className="text-brutal-gray">
                Bottles (500ml)
              </Typography>
            </div>
          </div>
        </Card>

        {/* Quick Add Buttons */}
        <Card className="p-6 mb-brutal-lg">
          <Typography variant="h4" weight="bold" className="mb-4">
            Quick Add
          </Typography>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleLogWater(250)}
              className="h-16"
            >
              <div className="text-center">
                <Typography variant="h4" className="mb-1">🥤</Typography>
                <Typography variant="caption">250ml</Typography>
              </div>
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleLogWater(500)}
              className="h-16"
            >
              <div className="text-center">
                <Typography variant="h4" className="mb-1">💧</Typography>
                <Typography variant="caption">500ml</Typography>
              </div>
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              onClick={() => handleLogWater(1000)}
              className="h-16"
            >
              <div className="text-center">
                <Typography variant="h4" className="mb-1">🚰</Typography>
                <Typography variant="caption">1L</Typography>
              </div>
            </Button>
          </div>
          
          <div className="flex space-x-2">
            <input
              type="number"
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="Custom amount (ml)"
              className="flex-1 px-3 py-2 border-brutal border-brutal-black bg-brutal-white focus:outline-none focus:ring-2 focus:ring-brutal-blue"
            />
            <Button
              variant="default"
              size="lg"
              onClick={handleCustomAmount}
              disabled={!customAmount || parseInt(customAmount) <= 0}
            >
              Add
            </Button>
          </div>
        </Card>

        {/* Statistics */}
        <Grid cols={3} gap="lg" className="mb-brutal-lg">
          <Card className="p-4">
            <div className="text-center">
              <Shape shape="circle" color="primary" className="w-12 h-12 mb-3 mx-auto">
                <Typography variant="h4" weight="bold" color="default">
                  💧
                </Typography>
              </Shape>
              <Typography variant="h3" weight="bold" className="mb-1">
                0
              </Typography>
              <Typography variant="caption" className="text-brutal-gray">
                Today&apos;s Intake
              </Typography>
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-center">
              <Shape shape="square" color="secondary" className="w-12 h-12 mb-3 mx-auto">
                <Typography variant="h4" weight="bold" color="default">
                  🎯
                </Typography>
              </Shape>
              <Typography variant="h3" weight="bold" className="mb-1">
                2000ml
              </Typography>
              <Typography variant="caption" className="text-brutal-gray">
                Daily Goal
              </Typography>
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-center">
              <Shape shape="triangle" color="accent" className="w-12 h-12 mb-3 mx-auto">
                <Typography variant="h4" weight="bold" color="default">
                  🔥
                </Typography>
              </Shape>
              <Typography variant="h3" weight="bold" className="mb-1">
                0
              </Typography>
              <Typography variant="caption" className="text-brutal-gray">
                Streak Days
              </Typography>
            </div>
          </Card>
        </Grid>

        {/* Hydration Tips */}
        <Card className="p-6 mb-brutal-lg">
          <Typography variant="h4" weight="bold" className="mb-4">
            💡 Hydration Tips
          </Typography>
          
          <div className="space-y-3">
            <div className="p-3 bg-brutal-light-gray border-brutal border-brutal-black">
              <Typography variant="body" weight="medium" className="mb-1">
                Start your day with water
              </Typography>
              <Typography variant="caption" className="text-brutal-gray">
                Drink a glass of water first thing in the morning to kickstart your hydration
              </Typography>
            </div>
            
            <div className="p-3 bg-brutal-light-gray border-brutal border-brutal-black">
              <Typography variant="body" weight="medium" className="mb-1">
                Set reminders
              </Typography>
              <Typography variant="caption" className="text-brutal-gray">
                Use notifications to remind yourself to drink water throughout the day
              </Typography>
            </div>
            
            <div className="p-3 bg-brutal-light-gray border-brutal border-brutal-black">
              <Typography variant="body" weight="medium" className="mb-1">
                Track your progress
              </Typography>
              <Typography variant="caption" className="text-brutal-gray">
                Monitor your daily intake to build consistent hydration habits
              </Typography>
            </div>
          </div>
        </Card>

        {/* Today's Entries */}
        <Card className="p-6">
          <Typography variant="h4" weight="bold" className="mb-4">
            Today&apos;s Entries
          </Typography>
          
          <div className="space-y-3">
            <div className="p-3 bg-brutal-light-gray border-brutal border-brutal-black">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body" weight="medium">
                    No entries yet
                  </Typography>
                  <Typography variant="caption" className="text-brutal-gray">
                    Start logging your water intake to track your hydration
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default function WaterTrackingPage() {
  return (
    <ProtectedRoute>
      <WaterTrackingContent />
    </ProtectedRoute>
  );
} 