'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Grid from '@/components/ui/Grid';
import Shape from '@/components/ui/Shapes';
import { useState } from 'react';
import { format } from 'date-fns';
import { MorningRoutineService } from '@/lib/morning-routine-service';
import Link from 'next/link';

function MorningRoutineContent() {
  const { state } = useAuth();
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [showWeightForm, setShowWeightForm] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleLogWeight = async () => {
    if (!weight || !state.user) return;
    try {
      const entryId = await MorningRoutineService.logWeight({
        userId: state.user.uid,
        weight: parseFloat(weight),
        unit: weightUnit,
        date: new Date(),
      });
      if (entryId) {
        setWeight('');
        setShowWeightForm(false);
        // TODO: Add success notification
      }
    } catch (error) {
      console.error('Error logging weight:', error);
    }
  };

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

  return (
    <main className="min-h-screen bg-brutal-white">
      {/* Header */}
      <header className="bg-brutal-white border-b-brutal border-brutal-black shadow-brutal-sm">
        <div className="brutal-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">
                  ← Back
                </Button>
              </Link>
              <Typography variant="h3" weight="bold">
                Morning Routine
              </Typography>
            </div>
            <div className="flex items-center space-x-4">
              <Typography variant="body" className="text-brutal-gray hidden sm:block">
                {format(new Date(), 'EEEE, MMMM d')}
              </Typography>
            </div>
          </div>
        </div>
      </header>

      <div className="brutal-container py-brutal-lg">
        {/* Welcome Section */}
        <div className="mb-brutal-lg">
          <Typography variant="h1" weight="bold" className="mb-2">
            {getGreeting()}!
          </Typography>
          <Typography variant="h4" className="text-brutal-gray mb-6">
            Let&apos;s start your day with healthy habits
          </Typography>
        </div>

        {/* Quick Actions */}
        <Grid cols={2} gap="lg" className="mb-brutal-lg">
          {/* Weight Tracking Card */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h4" weight="bold">
                ⚖️ Weight Tracking
              </Typography>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowWeightForm(!showWeightForm)}
              >
                {showWeightForm ? 'Cancel' : 'Log Weight'}
              </Button>
            </div>
            
            {showWeightForm ? (
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter weight"
                    className="flex-1 px-3 py-2 border-brutal border-brutal-black bg-brutal-white focus:outline-none focus:ring-2 focus:ring-brutal-blue"
                  />
                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value as 'kg' | 'lbs')}
                    className="px-3 py-2 border-brutal border-brutal-black bg-brutal-white focus:outline-none focus:ring-2 focus:ring-brutal-blue"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
                <Button
                  variant="default"
                  size="lg"
                  className="w-full"
                  onClick={handleLogWeight}
                  disabled={!weight}
                >
                  Save Weight
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <Typography variant="h3" weight="bold" className="mb-2">
                  --
                </Typography>
                <Typography variant="caption" className="text-brutal-gray">
                  No weight logged today
                </Typography>
              </div>
            )}
          </Card>

          {/* Water Tracking Card */}
          <Card className="p-6">
            <Typography variant="h4" weight="bold" className="mb-4">
              💧 Water Intake
            </Typography>
            
            <div className="text-center mb-4">
              <Typography variant="h3" weight="bold" className="mb-2">
                0 / 2000ml
              </Typography>
              <div className="w-full bg-brutal-light-gray border-brutal border-brutal-black h-4">
                <div className="bg-brutal-blue h-full" style={{ width: '0%' }}></div>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleLogWater(250)}
              >
                +250ml
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleLogWater(500)}
              >
                +500ml
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleLogWater(1000)}
              >
                +1L
              </Button>
            </div>
          </Card>
        </Grid>

        {/* Progress Overview */}
        <Card className="p-6 mb-brutal-lg">
          <Typography variant="h4" weight="bold" className="mb-4">
            Today&apos;s Progress
          </Typography>
          
          <Grid cols={3} gap="md">
            <div className="text-center">
              <Shape shape="circle" color="primary" className="w-12 h-12 mb-3 mx-auto">
                <Typography variant="h4" weight="bold" color="default">
                  ⚖️
                </Typography>
              </Shape>
              <Typography variant="h5" weight="bold" className="mb-1">
                Weight
              </Typography>
              <Typography variant="caption" className="text-brutal-gray">
                Not logged
              </Typography>
            </div>
            
            <div className="text-center">
              <Shape shape="circle" color="secondary" className="w-12 h-12 mb-3 mx-auto">
                <Typography variant="h4" weight="bold" color="default">
                  💧
                </Typography>
              </Shape>
              <Typography variant="h5" weight="bold" className="mb-1">
                Water
              </Typography>
              <Typography variant="caption" className="text-brutal-gray">
                0% complete
              </Typography>
            </div>
            
            <div className="text-center">
              <Shape shape="circle" color="accent" className="w-12 h-12 mb-3 mx-auto">
                <Typography variant="h4" weight="bold" color="default">
                  🔥
                </Typography>
              </Shape>
              <Typography variant="h5" weight="bold" className="mb-1">
                Streak
              </Typography>
              <Typography variant="caption" className="text-brutal-gray">
                0 days
              </Typography>
            </div>
          </Grid>
        </Card>

        {/* Quick Stats */}
        <Grid cols={2} gap="lg">
          <Card className="p-6">
            <div className="text-center">
              <Typography variant="h4" className="mb-2">📊</Typography>
              <Typography variant="h5" weight="bold" className="mb-2">
                Weight History
              </Typography>
              <Typography variant="caption" className="text-brutal-gray mb-4">
                View your progress over time
              </Typography>
              <Button variant="secondary" size="sm" className="w-full">
                View History
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <div className="text-center">
              <Typography variant="h4" className="mb-2">⚙️</Typography>
              <Typography variant="h5" weight="bold" className="mb-2">
                Settings
              </Typography>
              <Typography variant="caption" className="text-brutal-gray mb-4">
                Customize your routine
              </Typography>
              <Button variant="secondary" size="sm" className="w-full">
                Configure
              </Button>
            </div>
          </Card>
        </Grid>
      </div>
    </main>
  );
}

export default function MorningRoutinePage() {
  return (
    <ProtectedRoute>
      <MorningRoutineContent />
    </ProtectedRoute>
  );
} 