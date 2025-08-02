'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Grid from '@/components/ui/Grid';
import BottomNavigation from '@/components/BottomNavigation';
import { useState, useEffect } from 'react';
import { useDailies } from '@/hooks/useDailies';
import { CreateDailyEntryRequest } from '@/types';
import { Check, X, Star, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import DateNavigator from './components/DateNavigator';
import DailyStats from './components/DailyStats';
import DailyTrends from './components/DailyTrends';

function DailiesContent() {
  const { state } = useAuth();
  const { useTodayEntry, useEntryByDate, useCreateOrUpdateTodayEntry, useDailyStats, useDailyTrends } = useDailies();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dateString = selectedDate.toISOString().split('T')[0];
  
  const { data: todayEntry, isLoading: loadingEntry } = useTodayEntry();
  const { data: selectedEntry, isLoading: loadingSelectedEntry } = useEntryByDate(dateString);
  const { data: stats } = useDailyStats(dateString);
  const { data: trends } = useDailyTrends(
    new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    dateString
  );
  const createOrUpdateMutation = useCreateOrUpdateTodayEntry();

  const [formData, setFormData] = useState<CreateDailyEntryRequest>({
    sleepQuality: 0,
    weight: undefined,
    workoutCompleted: false,
    steps: 0,
    stressLevel: 0,
    fatigueLevel: 0,
    hungerLevel: 0,
    goalReviewCompleted: false,
    tomorrowPlanningCompleted: false,
    notes: ''
  });

  // Initialize form data when entry loads
  useEffect(() => {
    const entry = selectedDate.toDateString() === new Date().toDateString() ? todayEntry : selectedEntry;
    if (entry) {
      setFormData({
        sleepQuality: entry.sleepQuality,
        weight: entry.weight,
        workoutCompleted: entry.workoutCompleted,
        steps: entry.steps,
        stressLevel: entry.stressLevel,
        fatigueLevel: entry.fatigueLevel,
        hungerLevel: entry.hungerLevel,
        goalReviewCompleted: entry.goalReviewCompleted,
        tomorrowPlanningCompleted: entry.tomorrowPlanningCompleted,
        notes: entry.notes || ''
      });
    } else {
      // Reset form data for dates without entries
      setFormData({
        sleepQuality: 0,
        weight: undefined,
        workoutCompleted: false,
        steps: 0,
        stressLevel: 0,
        fatigueLevel: 0,
        hungerLevel: 0,
        goalReviewCompleted: false,
        tomorrowPlanningCompleted: false,
        notes: ''
      });
    }
  }, [todayEntry, selectedEntry, selectedDate]);

  const handleInputChange = (field: keyof CreateDailyEntryRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await createOrUpdateMutation.mutateAsync(formData);
    } catch (error) {
      console.error('Error saving daily entry:', error);
    }
  };

  const getRatingDescription = (rating: number, type: string): string => {
    const descriptions = {
      sleepQuality: ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
      stressLevel: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'],
      fatigueLevel: ['Very Low', 'Low', 'Moderate', 'High', 'Very High'],
      hungerLevel: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
    };
    
    return descriptions[type as keyof typeof descriptions]?.[rating - 1] || '';
  };

  const renderRatingInput = (
    label: string, 
    value: number, 
    field: keyof CreateDailyEntryRequest,
    type: string
  ) => (
    <div className="space-y-2">
      <Typography variant="body" weight="medium">
        {label}
      </Typography>
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => handleInputChange(field, rating)}
            className={`w-8 h-8 rounded-full border-2 border-border flex items-center justify-center transition-all ${
              value >= rating 
                ? 'bg-primary text-primary-foreground' 
                : 'bg-background hover:bg-accent'
            }`}
          >
            <Star size={16} fill={value >= rating ? 'currentColor' : 'none'} />
          </button>
        ))}
      </div>
      {value > 0 && (
        <Typography variant="caption" color="muted">
          {getRatingDescription(value, type)}
        </Typography>
      )}
    </div>
  );

  const renderCheckbox = (
    label: string, 
    checked: boolean, 
    field: keyof CreateDailyEntryRequest
  ) => (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        onClick={() => handleInputChange(field, !checked)}
        className={`w-6 h-6 border-2 border-border flex items-center justify-center transition-all rounded ${
          checked ? 'bg-green-600' : 'bg-background'
        }`}
      >
        {checked && <Check size={16} className="text-white" />}
      </button>
      <Typography variant="body" weight="medium">
        {label}
      </Typography>
    </div>
  );

  const renderNumberInput = (
    label: string, 
    value: number, 
    field: keyof CreateDailyEntryRequest,
    placeholder?: string
  ) => (
    <div className="space-y-2">
      <Typography variant="body" weight="medium">
        {label}
      </Typography>
      <input
        type="number"
        value={value || ''}
        onChange={(e) => handleInputChange(field, parseInt(e.target.value) || 0)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        min="0"
      />
    </div>
  );

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-background border-b shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h3" weight="bold">
                📊 Daily Tracking
              </Typography>
            </div>
            <div className="flex items-center space-x-4">
              <Typography variant="body" color="muted">
                {new Date().toLocaleDateString()}
              </Typography>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Navigator */}
        <DateNavigator
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
          hasEntry={!!(selectedDate.toDateString() === new Date().toDateString() ? todayEntry : selectedEntry)}
          className="mb-6"
        />

        {/* Statistics and Trends */}
        <Grid cols={1} gap="lg" className="mb-6">
          {stats && <DailyStats stats={stats} />}
          {trends && <DailyTrends trends={trends} />}
        </Grid>

        {/* Daily Entry Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">
              📝 {selectedDate.toDateString() === new Date().toDateString() ? "Today's" : `${selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}'s`} Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Sleep Quality */}
            <Card>
              <CardContent className="p-4">
                {renderRatingInput('How well did you sleep last night?', formData.sleepQuality, 'sleepQuality', 'sleepQuality')}
              </CardContent>
            </Card>

            {/* Weight */}
            <Card>
              <CardContent className="p-4">
                {renderNumberInput('How much did you weigh this morning? (kg)', formData.weight || 0, 'weight', 'Enter weight')}
              </CardContent>
            </Card>

            {/* Workout */}
            <Card>
              <CardContent className="p-4">
                {renderCheckbox('Did you workout today?', formData.workoutCompleted, 'workoutCompleted')}
              </CardContent>
            </Card>

            {/* Steps */}
            <Card>
              <CardContent className="p-4">
                {renderNumberInput('How many steps did you complete today?', formData.steps, 'steps', 'Enter steps')}
              </CardContent>
            </Card>

            {/* Stress Level */}
            <Card>
              <CardContent className="p-4">
                {renderRatingInput('How stressed were you today?', formData.stressLevel, 'stressLevel', 'stressLevel')}
              </CardContent>
            </Card>

            {/* Fatigue Level */}
            <Card>
              <CardContent className="p-4">
                {renderRatingInput('How fatigued were you today?', formData.fatigueLevel, 'fatigueLevel', 'fatigueLevel')}
              </CardContent>
            </Card>

            {/* Hunger Level */}
            <Card>
              <CardContent className="p-4">
                {renderRatingInput('How hungry were you today?', formData.hungerLevel, 'hungerLevel', 'hungerLevel')}
              </CardContent>
            </Card>

            {/* Goal Review */}
            <Card>
              <CardContent className="p-4">
                {renderCheckbox('Did you review your goals and vision?', formData.goalReviewCompleted, 'goalReviewCompleted')}
              </CardContent>
            </Card>

            {/* Tomorrow Planning */}
            <Card>
              <CardContent className="p-4">
                {renderCheckbox('Did you plan for tomorrow?', formData.tomorrowPlanningCompleted, 'tomorrowPlanningCompleted')}
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Typography variant="body" weight="medium">
                    Additional Notes
                  </Typography>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional thoughts or observations..."
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="mt-8">
          <Button
            onClick={handleSave}
            variant="default"
            size="default"
            className="w-full"
            disabled={createOrUpdateMutation.isPending || loadingEntry}
          >
            {createOrUpdateMutation.isPending ? 'Saving...' : (todayEntry ? 'Update Entry' : 'Save Entry')}
          </Button>
        </div>

        {/* Quick Actions */}
        <Grid cols={2} gap="md" className="mb-6 mt-6">
          <Button variant="outline" size="default" className="w-full" onClick={() => window.location.href = '/dashboard/dailies/history'}>
            📅 History
          </Button>
          <Button variant="outline" size="default" className="w-full" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            📊 View Stats
          </Button>
        </Grid>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}

export default function DailiesPage() {
  return (
    <ProtectedRoute>
      <DailiesContent />
    </ProtectedRoute>
  );
} 