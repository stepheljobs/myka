'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';

interface DateNavigatorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  className?: string;
}

export default function DateNavigator({ 
  selectedDate, 
  onDateChange, 
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

  const goToTomorrow = () => {
    const tomorrow = new Date(selectedDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    onDateChange(tomorrow);
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

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {/* Navigation Arrows */}
      <div className="flex items-center space-x-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={goToPreviousDay}
        >
          ←
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={goToNextDay}
        >
          →
        </Button>
      </div>

      {/* Date Display and Picker */}
      <div className="flex items-center space-x-2">
        <Button
          variant="default"
          size="sm"
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          {formatDate(selectedDate)}
        </Button>

        {showDatePicker && (
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={handleDatePickerChange}
            className="px-3 py-2 border-2 border-brutal-black bg-brutal-white focus:outline-none focus:ring-2 focus:ring-brutal-blue"
          />
        )}
      </div>

      {/* Quick Navigation */}
      <div className="flex items-center space-x-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={goToYesterday}
        >
          Yesterday
        </Button>
        
        <Button
          variant={isToday ? "default" : "secondary"}
          size="sm"
          onClick={goToToday}
        >
          Today
        </Button>
        
        <Button
          variant="secondary"
          size="sm"
          onClick={goToTomorrow}
        >
          Tomorrow
        </Button>
      </div>
    </div>
  );
} 