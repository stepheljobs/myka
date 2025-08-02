import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { useJournal } from '../../hooks/useJournal';

export default function JournalCard() {
  const { todayEntry, loading } = useJournal();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-lg font-semibold">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  const hasEntryToday = !!todayEntry;

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            📝 Daily Journal
          </CardTitle>
          <div className={`w-3 h-3 rounded-full ${hasEntryToday ? 'bg-green-500' : 'bg-gray-300'}`} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              Today&apos;s Entry
            </p>
            <p className={`text-sm ${hasEntryToday ? 'text-green-600' : 'text-muted-foreground'}`}>
              {hasEntryToday ? 'Completed' : 'Not started'}
            </p>
          </div>
        </div>
        
        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground mb-2">
            {hasEntryToday ? 'Tap to view/edit today&apos;s entry' : 'Tap to start today&apos;s journal'}
          </p>
          <Link href="/dashboard/journal/history" className="text-primary hover:text-primary/80 text-sm">
            View History →
          </Link>
        </div>
        
        <Link href="/dashboard/journal" className="block">
          <Button variant="default" className="w-full">
            {hasEntryToday ? 'View/Edit Entry' : 'Start Journal'}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
} 