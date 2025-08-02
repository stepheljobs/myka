import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';

interface CalendarProps {
  year: number;
  month: number;
  calendarData: { [date: string]: boolean };
  onDateClick: (date: string) => void;
  onMonthChange: (year: number, month: number) => void;
}

export default function Calendar({ 
  year, 
  month, 
  calendarData, 
  onDateClick, 
  onMonthChange 
}: CalendarProps) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get the first day of the month and number of days
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = firstDay.getDay();

  // Generate calendar days
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      const hasEntry = calendarData[dateString];
      const isToday = dateString === todayString;

      days.push(
        <button
          key={day}
          onClick={() => onDateClick(dateString)}
          className={`
            h-12 w-full flex items-center justify-center relative
            hover:bg-accent transition-colors duration-200 rounded-md
            ${isToday ? 'bg-primary/10 font-bold' : ''}
            ${hasEntry ? 'ring-2 ring-green-200' : ''}
            ${hasEntry ? 'hover:ring-green-300' : ''}
          `}
          title={hasEntry ? `View entry for ${dateString}` : `No entry for ${dateString}`}
        >
          <span className={isToday ? 'text-primary' : ''}>
            {day}
          </span>
          {hasEntry && (
            <div className="absolute bottom-1 w-2 h-2 bg-green-500 rounded-full shadow-sm"></div>
          )}
        </button>
      );
    }

    return days;
  };

  const goToPreviousMonth = () => {
    if (month === 1) {
      onMonthChange(year - 1, 12);
    } else {
      onMonthChange(year, month - 1);
    }
  };

  const goToNextMonth = () => {
    if (month === 12) {
      onMonthChange(year + 1, 1);
    } else {
      onMonthChange(year, month + 1);
    }
  };

  const goToToday = () => {
    const today = new Date();
    onMonthChange(today.getFullYear(), today.getMonth() + 1);
    // Also trigger today's date click
    const todayString = today.toISOString().split('T')[0];
    onDateClick(todayString);
  };

  return (
    <Card>
      <CardHeader>
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <Button
            onClick={goToPreviousMonth}
            variant="outline"
            size="sm"
          >
            ←
          </Button>
          
          <CardTitle className="text-lg font-semibold">
            {monthNames[month - 1]} {year}
          </CardTitle>
          
          <Button
            onClick={goToNextMonth}
            variant="outline"
            size="sm"
          >
            →
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Today Button */}
        <div className="flex justify-center">
          <Button
            onClick={goToToday}
            variant="secondary"
            size="sm"
          >
            Today
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day Headers */}
          {dayNames.map(day => (
            <div key={day} className="h-8 flex items-center justify-center">
              <p className="text-xs font-medium text-muted-foreground">
                {day}
              </p>
            </div>
          ))}

          {/* Calendar Days */}
          {generateCalendarDays()}
        </div>

        {/* Legend */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Has Entry</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-muted-foreground">Today</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 