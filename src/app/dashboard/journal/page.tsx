'use client';

import React, { useState } from 'react';
import { useJournal } from '../../../hooks/useJournal';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import Typography from '../../../components/ui/Typography';
import { Input } from '../../../components/ui/Input';
import Grid from '../../../components/ui/Grid';
import BottomNavigation from '../../../components/BottomNavigation';
import Link from 'next/link';

export default function JournalPage() {
  const { todayEntry, loading, error, saveEntry } = useJournal();
  const [wins, setWins] = useState(todayEntry?.wins || '');
  const [commitments, setCommitments] = useState(todayEntry?.commitments || '');
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Update form when entry loads
  React.useEffect(() => {
    if (todayEntry) {
      setWins(todayEntry.wins);
      setCommitments(todayEntry.commitments);
    }
  }, [todayEntry]);

  const handleSave = async () => {
    if (!wins.trim() || !commitments.trim()) {
      alert('Please fill in both wins and commitments');
      return;
    }

    try {
      setSaving(true);
      setShowSuccess(false);
      await saveEntry({
        wins: wins.trim(),
        commitments: commitments.trim(),
      });
      
      // Show success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide after 3 seconds
    } catch (err) {
      console.error('Failed to save entry:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4">
        <Typography variant="h1" className="mb-6">Loading...</Typography>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-brutal-white pb-20">
      <div className="p-4 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Typography variant="h1">
            Daily Journal 📝
          </Typography>
          <Link href="/dashboard/journal/history">
            <Button variant="secondary">
              View History
            </Button>
          </Link>
        </div>

      {error && (
        <Card className="mb-6 p-4 bg-red-50 border-red-200">
          <Typography variant="body" className="text-red-600">
            Error: {error}
          </Typography>
        </Card>
      )}

      {showSuccess && (
        <Card className="mb-6 p-4 bg-green-50 border-green-200">
          <Typography variant="body" className="text-green-600 flex items-center">
            <span className="mr-2">✅</span>
            {todayEntry ? 'Journal entry updated successfully!' : 'Journal entry saved successfully!'}
          </Typography>
        </Card>
      )}

      {/* Journal Entry Form */}
      <Card className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <Typography variant="body" className="text-gray-600">
                Loading your journal...
              </Typography>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
          {/* Wins Section */}
          <div>
            <Typography variant="h2" className="mb-3 flex items-center">
              🙌 Write 3-5 wins you&apos;ve had today
            </Typography>
            <Typography variant="body" className="mb-3 text-gray-600">
              It can be fitness-related or outside fitness, it&apos;s up to you!
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
            <Typography variant="caption" className="text-gray-500 mt-1">
              {wins.length} characters
            </Typography>
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
            <Typography variant="caption" className="text-gray-500 mt-1">
              {commitments.length} characters
            </Typography>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={saving || !wins.trim() || !commitments.trim()}
              className="px-8 py-3"
              
            >
              {saving ? 'Saving...' : todayEntry ? 'Update Entry' : 'Save Entry'}
            </Button>
          </div>
        </div>
        )}
      </Card>

      {/* Tips */}
      <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
        <Typography variant="h3" className="mb-2 text-blue-800">
          💡 Journaling Tips
        </Typography>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>• Be specific about your wins - what exactly did you accomplish?</li>
          <li>• Make your commitments actionable and realistic</li>
          <li>• Reflect on both big achievements and small victories</li>
          <li>• Focus on progress, not perfection</li>
        </ul>
      </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
} 