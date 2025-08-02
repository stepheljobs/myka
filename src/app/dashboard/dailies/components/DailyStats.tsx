'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import { TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';
import { DailyStats as DailyStatsType } from '@/types';

interface DailyStatsProps {
  stats: DailyStatsType;
  className?: string;
}

export default function DailyStats({ stats, className = '' }: DailyStatsProps) {
  const getCompletionColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-blue-600';
    if (rate >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCompletionIcon = (rate: number) => {
    if (rate >= 80) return <TrendingUp size={16} className="text-green-600" />;
    if (rate >= 60) return <TrendingUp size={16} className="text-blue-600" />;
    if (rate >= 40) return <Minus size={16} className="text-orange-600" />;
    return <TrendingDown size={16} className="text-red-600" />;
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">📊 Daily Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Completion Rate */}
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Target size={20} className="text-blue-600 mr-2" />
              <Typography variant="h6" weight="medium">
                Completion Rate
              </Typography>
            </div>
            <div className="flex items-center justify-center space-x-2">
              {getCompletionIcon(stats.completionRate)}
              <Typography 
                variant="h4" 
                weight="bold" 
                className={getCompletionColor(stats.completionRate)}
              >
                {stats.completionRate}%
              </Typography>
            </div>
            <Typography variant="caption" color="muted">
              {stats.hasEntry ? 'Entry completed' : 'No entry today'}
            </Typography>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
} 