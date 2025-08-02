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

function WeightTrackingContent() {
  const { state } = useAuth();
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [notes, setNotes] = useState('');

  const handleLogWeight = async () => {
    if (!weight || !state.user) return;
    try {
      const entryId = await MorningRoutineService.logWeight({
        userId: state.user.uid,
        weight: parseFloat(weight),
        unit: weightUnit,
        date: new Date(),
        notes: notes.trim() || undefined,
      });
      if (entryId) {
        setWeight('');
        setNotes('');
        // TODO: Add success notification
      }
    } catch (error) {
      console.error('Error logging weight:', error);
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
                Weight Tracking
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
        {/* Quick Log Weight */}
        <Card className="p-6 mb-brutal-lg">
          <Typography variant="h4" weight="bold" className="mb-4">
            Log Today&apos;s Weight
          </Typography>
          
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
            
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="w-full px-3 py-2 border-brutal border-brutal-black bg-brutal-white focus:outline-none focus:ring-2 focus:ring-brutal-blue"
            />
            
            <Button
              variant="default"
              size="lg"
              className="w-full"
              onClick={handleLogWeight}
              disabled={!weight}
            >
              Save Weight Entry
            </Button>
          </div>
        </Card>

        {/* Statistics */}
        <Grid cols={4} gap="lg" className="mb-brutal-lg">
          <Card className="p-4">
            <div className="text-center">
              <Shape shape="circle" color="primary" className="w-12 h-12 mb-3 mx-auto">
                <Typography variant="h4" weight="bold" color="default">
                  ⚖️
                </Typography>
              </Shape>
              <Typography variant="h3" weight="bold" className="mb-1">
                --
              </Typography>
              <Typography variant="caption" className="text-brutal-gray">
                Current Weight
              </Typography>
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-center">
              <Shape shape="square" color="secondary" className="w-12 h-12 mb-3 mx-auto">
                <Typography variant="h4" weight="bold" color="default">
                  📈
                </Typography>
              </Shape>
              <Typography variant="h3" weight="bold" className="mb-1">
                --
              </Typography>
              <Typography variant="caption" className="text-brutal-gray">
                Total Change
              </Typography>
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-center">
              <Shape shape="triangle" color="accent" className="w-12 h-12 mb-3 mx-auto">
                <Typography variant="h4" weight="bold" color="default">
                  📊
                </Typography>
              </Shape>
              <Typography variant="h3" weight="bold" className="mb-1">
                --
              </Typography>
              <Typography variant="caption" className="text-brutal-gray">
                Weekly Change
              </Typography>
            </div>
          </Card>

          <Card className="p-4">
            <div className="text-center">
              <Shape shape="rectangle" color="destructive" className="w-12 h-12 mb-3 mx-auto">
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

        {/* Weight History Chart */}
        <Card className="p-6 mb-brutal-lg">
          <Typography variant="h4" weight="bold" className="mb-4">
            Weight History
          </Typography>
          
          <div className="h-64 bg-brutal-light-gray border-brutal border-brutal-black flex items-center justify-center">
            <Typography variant="body" className="text-brutal-gray">
              Chart will be displayed here
            </Typography>
          </div>
        </Card>

        {/* Recent Entries */}
        <Card className="p-6">
          <Typography variant="h4" weight="bold" className="mb-4">
            Recent Entries
          </Typography>
          
          <div className="space-y-3">
            <div className="p-3 bg-brutal-light-gray border-brutal border-brutal-black">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body" weight="medium">
                    No entries yet
                  </Typography>
                  <Typography variant="caption" className="text-brutal-gray">
                    Start logging your weight to see your progress
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

export default function WeightTrackingPage() {
  return (
    <ProtectedRoute>
      <WeightTrackingContent />
    </ProtectedRoute>
  );
} 