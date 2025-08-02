'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { Card, CardContent } from '@/components/ui/Card';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  hasEntry?: boolean;
  className?: string;
}

export default function DateNavigator({ 
  selectedDate, 
  onDateChange, 
  hasEntry = false,
  className = '' 
}: DateNavigatorProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const goToToday = () => {
    onDateChange(new Date());
  };

  const goToYesterday = () => {
    const yesterday = new Date(selectedDate);
    yesterday.setDate(yesterday.getDate() - 1);
    onDateChange(yesterday);
  };

  const goToPreviousDay = () => {
    const previousDay = new Date(selectedDate);
    previousDay.setDate(previousDay.getDate() - 1);
    onDateChange(previousDay);
  };

  const goToNextDay = () => {
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);
    onDateChange(nextDay);
  };

  const handleDatePickerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value);
    onDateChange(newDate);
    setShowDatePicker(false);
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isFuture = selectedDate > new Date();

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Navigation Arrows */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousDay}
              disabled={isFuture}
            >
              <ChevronLeft size={16} />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextDay}
              disabled={isFuture}
            >
              <ChevronRight size={16} />
            </Button>
          </div>

          {/* Date Display and Picker */}
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              size="sm"
            >
              <Calendar size={16} className="mr-2" />
              {formatDate(selectedDate)}
            </Button>

          </div>

        </div>
      </CardContent>
    </Card>
  );
} 