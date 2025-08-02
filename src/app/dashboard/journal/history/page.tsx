'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useJournalHistory } from '../../../../hooks/useJournalHistory';
import { Card } from '../../../../components/ui/Card';
import Typography from '../../../../components/ui/Typography';
import { Button } from '../../../../components/ui/Button';
import EntryCard from '../../../../components/ui/EntryCard';
import BottomNavigation from '../../../../components/BottomNavigation';
import Breadcrumb from '../../../../components/ui/Breadcrumb';
import Link from 'next/link';

export default function JournalHistoryPage() {
  const router = useRouter();
  const {
    entries,
    loading,
    error,
    hasMore,
    loadMore,
    deleteEntry,
  } = useJournalHistory();

  const handleDeleteEntry = async (date: string) => {
    try {
      await deleteEntry(date);
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  if (loading && entries.length === 0) {
    return (
      <main className="min-h-screen bg-brutal-white pb-20">
        <div className="p-4 max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <Typography variant="body" className="text-gray-600">
                Loading your journal history...
              </Typography>
            </div>
          </div>
        </div>
        <BottomNavigation />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-brutal-white pb-20">
      <div className="p-4 max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Journal', href: '/dashboard/journal' },
            { label: 'History', isActive: true },
          ]}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Typography variant="h1" className="mb-2">
              Journal History 📚
            </Typography>
            <Typography variant="body" className="text-gray-600">
              Browse and reflect on your past entries
            </Typography>
          </div>
          <div className="flex space-x-2">
            <Link href="/dashboard/journal">
              <Button variant="default">
                Write Today&apos;s Entry
              </Button>
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {/* {error && (
          <Card className="mb-6 p-4 bg-red-50 border-red-200">
            <Typography variant="body" className="text-red-600">
              Error: {error}
            </Typography>
          </Card>
        )} */}

        {/* Journal Entries List */}
        <div className="space-y-4">
          {entries.length === 0 ? (
            <Card className="p-8 text-center">
              <Typography variant="h3" className="mb-4 text-gray-500">
                No journal entries yet
              </Typography>
              <Typography variant="body" className="mb-6 text-gray-600">
                Start your journaling journey by writing your first entry!
              </Typography>
              <Link href="/dashboard/journal">
                <Button variant="default">
                  Write Your First Entry
                </Button>
              </Link>
            </Card>
          ) : (
            <>
              {entries.map((entry) => (
                <EntryCard
                  key={entry.id}
                  entry={entry}
                  onDelete={handleDeleteEntry}
                />
              ))}
              
              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-6">
                  <Button
                    onClick={loadMore}
                    variant="secondary"
                    
                  >
                    {loading ? 'Loading...' : 'Load More Entries'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
} 