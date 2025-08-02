'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useJournalHistory } from '../../../../hooks/useJournalHistory';
import { Card } from '../../../../components/ui/Card';
import Typography from '../../../../components/ui/Typography';
import { Button } from '../../../../components/ui/Button';
import BottomNavigation from '../../../../components/BottomNavigation';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import Link from 'next/link';

export default function JournalEntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const date = params.date as string;
  
  const { getEntryByDate, updateEntry, deleteEntry } = useJournalHistory();
  
  const [entry, setEntry] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [wins, setWins] = useState('');
  const [commitments, setCommitments] = useState('');
  const [saving, setSaving] = useState(false);

  // Load entry data
  useEffect(() => {
    const loadEntry = async () => {
      try {
        setLoading(true);
        setError(null);
        const entryData = await getEntryByDate(date);
        
        if (!entryData) {
          setError('Entry not found');
          return;
        }
        
        setEntry(entryData);
        setWins(entryData.wins);
        setCommitments(entryData.commitments);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (date) {
      loadEntry();
    }
  }, [date, getEntryByDate]);

  // Handle browser back button
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditing) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isEditing]);



  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSave = async () => {
    if (!wins.trim() || !commitments.trim()) {
      alert('Please fill in both wins and commitments');
      return;
    }

    try {
      setSaving(true);
      await updateEntry(date, {
        wins: wins.trim(),
        commitments: commitments.trim(),
      });
      
      // Update local entry data
      setEntry({
        ...entry,
        wins: wins.trim(),
        commitments: commitments.trim(),
        updatedAt: new Date(),
      });
      
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update entry:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      try {
        await deleteEntry(date);
        router.push('/dashboard/journal/history');
      } catch (err) {
        console.error('Failed to delete entry:', err);
      }
    }
  };

  const goToPreviousDay = useCallback(() => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() - 1);
    const prevDate = currentDate.toISOString().split('T')[0];
    router.push(`/dashboard/journal/${prevDate}`);
  }, [date, router]);

  const goToNextDay = useCallback(() => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);
    const nextDate = currentDate.toISOString().split('T')[0];
    router.push(`/dashboard/journal/${nextDate}`);
  }, [date, router]);

  const goToToday = useCallback(() => {
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    router.push(`/dashboard/journal/${todayString}`);
  }, [router]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditing) return; // Don't handle keyboard nav when editing
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          goToPreviousDay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNextDay();
          break;
        case 'Home':
          e.preventDefault();
          goToToday();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditing, goToNextDay, goToPreviousDay, goToToday]);

  if (loading) {
    return (
      <main className="min-h-screen bg-brutal-white pb-20">
        <div className="p-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <Typography variant="body" className="text-gray-600">
                Loading entry...
              </Typography>
            </div>
          </div>
        </div>
        <BottomNavigation />
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-brutal-white pb-20">
        <div className="p-4 max-w-4xl mx-auto">
          <Card className="p-6 text-center">
            <Typography variant="h3" className="mb-4 text-red-600">
              Entry Not Found
            </Typography>
            <Typography variant="body" className="mb-6 text-gray-600">
              {error}
            </Typography>
            <Link href="/dashboard/journal/history">
              <Button variant="default">
                Back to History
              </Button>
            </Link>
          </Card>
        </div>
        <BottomNavigation />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brutal-white pb-20">
      <div className="p-4 max-w-4xl mx-auto">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Journal', href: '/dashboard/journal' },
            { label: 'History', href: '/dashboard/journal/history' },
            { label: formatDate(date), isActive: true },
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Typography variant="h1" className="mb-2">
              Journal Entry 📝
            </Typography>
            <Typography variant="h3" className="text-gray-600">
              {formatDate(date)}
            </Typography>
          </div>
          <div className="flex space-x-2">
            <Link href="/dashboard/journal/history">
              <Button variant="secondary">
                Back to History
              </Button>
            </Link>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="default"
              >
                Edit Entry
              </Button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <Button
            onClick={goToPreviousDay}
            variant="secondary"
            size="sm"
          >
            ← Previous Day
          </Button>
          
          <div className="flex space-x-2">
            <Button
              onClick={goToToday}
              variant="secondary"
              size="sm"
            >
              Today
            </Button>
          </div>
          
          <Button
            onClick={goToNextDay}
            variant="secondary"
            size="sm"
          >
            Next Day →
          </Button>
        </div>

        {/* Navigation Hints */}
        <Card className="mb-6 p-3 bg-blue-50 border-blue-200">
          <Typography variant="caption" className="text-blue-700 text-center">
            💡 Tip: Use arrow keys (← →) to navigate between days, or press &apos;Home&apos; to jump to today
          </Typography>
        </Card>

        {/* Entry Content */}
        <Card className="p-6">
          {isEditing ? (
            <div className="space-y-6">
              {/* Wins Section */}
              <div>
                <Typography variant="h2" className="mb-3 flex items-center">
                  🙌 Write 3-5 wins you&apos;ve had today
                </Typography>
                <textarea
                  value={wins}
                  onChange={(e) => setWins(e.target.value)}
                  placeholder="e.g., Completed my morning workout, finished a work project, helped a friend..."
                  className={`w-full h-32 p-3 border-2 rounded-lg resize-none focus:outline-none ${
                    saving 
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  disabled={saving}
                />
              </div>

              {/* Commitments Section */}
              <div>
                <Typography variant="h2" className="mb-3 flex items-center">
                  🤔 Write 2-3 things that you commit to doing to make tomorrow better than today
                </Typography>
                <textarea
                  value={commitments}
                  onChange={(e) => setCommitments(e.target.value)}
                  placeholder="e.g., Drink more water, go to bed earlier, practice gratitude..."
                  className={`w-full h-32 p-3 border-2 rounded-lg resize-none focus:outline-none ${
                    saving 
                      ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
                      : 'border-gray-300 focus:border-blue-500'
                  }`}
                  disabled={saving}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between">
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="secondary"
                  disabled={saving}
                >
                  Cancel
                </Button>
                <div className="flex space-x-2">
                  <Button
                    onClick={handleDelete}
                    variant="secondary"
                    className="text-red-600 hover:bg-red-50"
                    disabled={saving}
                  >
                    Delete Entry
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={saving || !wins.trim() || !commitments.trim()}
                    
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Wins Section */}
              <div>
                <Typography variant="h2" className="mb-3 flex items-center">
                  🙌 Wins
                </Typography>
                <Typography variant="body" className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {entry.wins}
                </Typography>
              </div>

              {/* Commitments Section */}
              <div>
                <Typography variant="h2" className="mb-3 flex items-center">
                  🤔 Commitments
                </Typography>
                <Typography variant="body" className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {entry.commitments}
                </Typography>
              </div>

              {/* Timestamp */}
              <div className="pt-4 border-t border-gray-200">
                <Typography variant="caption" className="text-gray-500">
                  Last updated: {new Date(entry.updatedAt).toLocaleString()}
                </Typography>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
} 