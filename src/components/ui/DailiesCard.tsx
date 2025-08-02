'use client';

import { useDailies } from '@/hooks/useDailies';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import Link from 'next/link';
import { Calendar, CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DailiesCard() {
  const { useTodayEntry, useDailyStats } = useDailies();
  
  const { data: todayEntry, isLoading: loadingEntry } = useTodayEntry();
  const { data: stats } = useDailyStats(new Date().toISOString().split('T')[0]);

  const getCompletionRate = () => {
    if (!todayEntry) return 0;
    
    const totalMetrics = 9; // Total number of metrics
    const completedMetrics = [
      todayEntry.sleepQuality > 0,
      todayEntry.workoutCompleted !== undefined,
      todayEntry.steps > 0,
      todayEntry.stressLevel > 0,
      todayEntry.fatigueLevel > 0,
      todayEntry.hungerLevel > 0,
      todayEntry.goalReviewCompleted !== undefined,
      todayEntry.tomorrowPlanningCompleted !== undefined,
      todayEntry.weight !== undefined
    ].filter(Boolean).length;
    
    return Math.round((completedMetrics / totalMetrics) * 100);
  };

  const getStatusIcon = () => {
    if (loadingEntry) return <Circle size={20} className="text-muted-foreground animate-pulse" />;
    if (!todayEntry) return <Circle size={20} className="text-orange-500" />;
    
    const completionRate = getCompletionRate();
    if (completionRate === 100) return <CheckCircle size={20} className="text-green-500" />;
    if (completionRate > 50) return <CheckCircle size={20} className="text-blue-500" />;
    return <Circle size={20} className="text-orange-500" />;
  };

  const getStatusText = () => {
    if (loadingEntry) return 'Loading...';
    if (!todayEntry) return 'No entry today';
    
    const completionRate = getCompletionRate();
    if (completionRate === 100) return 'Complete!';
    if (completionRate > 50) return `${completionRate}% complete`;
    return `${completionRate}% complete`;
  };

  const getStatusColor = () => {
    if (loadingEntry) return 'text-muted-foreground';
    if (!todayEntry) return 'text-orange-500';
    
    const completionRate = getCompletionRate();
    if (completionRate === 100) return 'text-green-500';
    if (completionRate > 50) return 'text-blue-500';
    return 'text-orange-500';
  };

  return (
    <Card className="h-full">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center mb-2">
          <Calendar size={24} className="mr-2" />
          {getStatusIcon()}
        </div>
        
        <CardTitle className="text-xl font-semibold mb-2">
          Daily Tracking
        </CardTitle>
        
        <p className="text-sm text-muted-foreground mb-4">
          Track your daily metrics
        </p>
        
        <div className="mb-4">
          <p className={cn("font-medium", getStatusColor())}>
            {getStatusText()}
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <Link href="/dashboard/dailies" className="block">
          <Button variant="default" size="sm" className="w-full">
            {todayEntry ? 'Update Entry' : 'Log Dailies'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
} 