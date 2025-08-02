'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import { TrendingUp, TrendingDown, Minus, Activity, Target, Calendar } from 'lucide-react';
import { DailyTrends as DailyTrendsType } from '@/types';

interface DailyTrendsProps {
  trends: DailyTrendsType;
  className?: string;
}

export default function DailyTrends({ trends, className = '' }: DailyTrendsProps) {
  const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp size={16} className="text-green-600" />;
      case 'declining':
        return <TrendingDown size={16} className="text-red-600" />;
      case 'stable':
        return <Minus size={16} className="text-gray-600" />;
    }
  };

  const getTrendColor = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      case 'stable':
        return 'text-gray-600';
    }
  };

  const getRatingDescription = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Good';
    if (rating >= 2.5) return 'Fair';
    if (rating >= 1.5) return 'Poor';
    return 'Very Poor';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">📈 Trend Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sleep Quality Trends */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Activity size={20} className="text-blue-600" />
                <Typography variant="h6" weight="medium">
                  Sleep Quality
                </Typography>
              </div>
              <div className="flex items-center space-x-2">
                {getTrendIcon(trends.sleepQuality.trend)}
                <Typography 
                  variant="body" 
                  weight="medium" 
                  className={getTrendColor(trends.sleepQuality.trend)}
                >
                  {trends.sleepQuality.trend}
                </Typography>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="caption" color="muted">
                  Average Rating
                </Typography>
                <Typography variant="h4" weight="bold" className="text-blue-600">
                  {trends.sleepQuality.average.toFixed(1)}/5
                </Typography>
                <Typography variant="caption" color="muted">
                  {getRatingDescription(trends.sleepQuality.average)}
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="muted">
                  Trend
                </Typography>
                <Typography variant="body" weight="medium" className={getTrendColor(trends.sleepQuality.trend)}>
                  {trends.sleepQuality.trend === 'improving' ? 'Getting Better' : 
                   trends.sleepQuality.trend === 'declining' ? 'Getting Worse' : 'Stable'}
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workout Frequency */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Target size={20} className="text-green-600" />
                <Typography variant="h6" weight="medium">
                  Workout Frequency
                </Typography>
              </div>
              <Typography variant="body" weight="medium" className="text-green-600">
                {trends.workoutFrequency.percentage}% success
              </Typography>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="caption" color="muted">
                  Success Rate
                </Typography>
                <Typography variant="h4" weight="bold" className="text-green-600">
                  {trends.workoutFrequency.percentage}%
                </Typography>
                <Typography variant="caption" color="muted">
                  of days worked out
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="muted">
                  Current Streak
                </Typography>
                <Typography variant="h4" weight="bold" className="text-orange-600">
                  {trends.workoutFrequency.streak}
                </Typography>
                <Typography variant="caption" color="muted">
                  {trends.workoutFrequency.streak === 1 ? 'day' : 'days'} in a row
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Steps Analysis */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Activity size={20} className="text-purple-600" />
                <Typography variant="h6" weight="medium">
                  Daily Steps
                </Typography>
              </div>
              <div className="flex items-center space-x-2">
                {trends.steps.goalMet ? (
                  <Target size={16} className="text-green-600" />
                ) : (
                  <Target size={16} className="text-red-600" />
                )}
                <Typography 
                  variant="body" 
                  weight="medium" 
                  className={trends.steps.goalMet ? 'text-green-600' : 'text-red-600'}
                >
                  {trends.steps.goalMet ? 'Goal Met' : 'Goal Not Met'}
                </Typography>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="caption" color="muted">
                  Average Steps
                </Typography>
                <Typography variant="h4" weight="bold" className="text-purple-600">
                  {Math.round(trends.steps.average).toLocaleString()}
                </Typography>
                <Typography variant="caption" color="muted">
                  per day
                </Typography>
              </div>
              <div>
                <Typography variant="caption" color="muted">
                  Total Steps
                </Typography>
                <Typography variant="h4" weight="bold" className="text-blue-600">
                  {trends.steps.total.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="muted">
                  in period
                </Typography>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stress, Fatigue, Hunger Levels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stress Level */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="h6" weight="medium" className="text-red-600">
                  Stress Level
                </Typography>
                {getTrendIcon(trends.stressLevel.trend)}
              </div>
              <Typography variant="h3" weight="bold" className="text-red-600">
                {trends.stressLevel.average.toFixed(1)}/5
              </Typography>
              <Typography variant="caption" color="muted">
                {getRatingDescription(trends.stressLevel.average)}
              </Typography>
            </CardContent>
          </Card>

          {/* Fatigue Level */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="h6" weight="medium" className="text-orange-600">
                  Fatigue Level
                </Typography>
                {getTrendIcon(trends.fatigueLevel.trend)}
              </div>
              <Typography variant="h3" weight="bold" className="text-orange-600">
                {trends.fatigueLevel.average.toFixed(1)}/5
              </Typography>
              <Typography variant="caption" color="muted">
                {getRatingDescription(trends.fatigueLevel.average)}
              </Typography>
            </CardContent>
          </Card>

          {/* Hunger Level */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Typography variant="h6" weight="medium" className="text-yellow-600">
                  Hunger Level
                </Typography>
                {getTrendIcon(trends.hungerLevel.trend)}
              </div>
              <Typography variant="h3" weight="bold" className="text-yellow-600">
                {trends.hungerLevel.average.toFixed(1)}/5
              </Typography>
              <Typography variant="caption" color="muted">
                {getRatingDescription(trends.hungerLevel.average)}
              </Typography>
            </CardContent>
          </Card>
        </div>

        {/* Goal Review & Planning */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Goal Review */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Target size={20} className="text-blue-600" />
                  <Typography variant="h6" weight="medium">
                    Goal Review
                  </Typography>
                </div>
                <Typography variant="body" weight="medium" className="text-blue-600">
                  {trends.goalReviewFrequency.percentage}% success
                </Typography>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="caption" color="muted">
                    Success Rate
                  </Typography>
                  <Typography variant="h4" weight="bold" className="text-blue-600">
                    {trends.goalReviewFrequency.percentage}%
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" color="muted">
                    Current Streak
                  </Typography>
                  <Typography variant="h4" weight="bold" className="text-orange-600">
                    {trends.goalReviewFrequency.streak}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tomorrow Planning */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Calendar size={20} className="text-green-600" />
                  <Typography variant="h6" weight="medium">
                    Tomorrow Planning
                  </Typography>
                </div>
                <Typography variant="body" weight="medium" className="text-green-600">
                  {trends.planningFrequency.percentage}% success
                </Typography>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="caption" color="muted">
                    Success Rate
                  </Typography>
                  <Typography variant="h4" weight="bold" className="text-green-600">
                    {trends.planningFrequency.percentage}%
                  </Typography>
                </div>
                <div>
                  <Typography variant="caption" color="muted">
                    Current Streak
                  </Typography>
                  <Typography variant="h4" weight="bold" className="text-orange-600">
                    {trends.planningFrequency.streak}
                  </Typography>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
} 