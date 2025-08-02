'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Grid from '@/components/ui/Grid';
import BottomNavigation from '@/components/BottomNavigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useDailies } from '@/hooks/useDailies';
import { DailyEntry } from '@/types';
import { Calendar, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

function DailiesHistoryContent() {
  const { state } = useAuth();
  const { useRecentEntries } = useDailies();
  
  const [entries, setEntries] = useState<DailyEntry[]>([]);
  const [filteredEntries, setFilteredEntries] = useState<DailyEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(10);
  const [selectedDateRange, setSelectedDateRange] = useState({
    start: '',
    end: ''
  });

  const { data: recentEntries, isLoading } = useRecentEntries(100);

  useEffect(() => {
    if (recentEntries) {
      setEntries(recentEntries);
      setFilteredEntries(recentEntries);
    }
  }, [recentEntries]);

  useEffect(() => {
    let filtered = entries;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(entry => 
        entry.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.date.includes(searchQuery)
      );
    }

    // Apply date range filter
    if (selectedDateRange.start && selectedDateRange.end) {
      filtered = filtered.filter(entry => 
        entry.date >= selectedDateRange.start && entry.date <= selectedDateRange.end
      );
    }

    setFilteredEntries(filtered);
    setCurrentPage(1);
  }, [entries, searchQuery, selectedDateRange]);

  const getCompletionRate = (entry: DailyEntry) => {
    const totalMetrics = 9;
    const completedMetrics = [
      entry.sleepQuality > 0,
      entry.workoutCompleted !== undefined,
      entry.steps > 0,
      entry.stressLevel > 0,
      entry.fatigueLevel > 0,
      entry.hungerLevel > 0,
      entry.goalReviewCompleted !== undefined,
      entry.tomorrowPlanningCompleted !== undefined,
      entry.weight !== undefined
    ].filter(Boolean).length;
    
    return Math.round((completedMetrics / totalMetrics) * 100);
  };

  const getRatingDescription = (rating: number) => {
    if (rating >= 4.5) return 'Excellent';
    if (rating >= 3.5) return 'Good';
    if (rating >= 2.5) return 'Fair';
    if (rating >= 1.5) return 'Poor';
    return 'Very Poor';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const paginatedEntries = filteredEntries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage
  );

  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedDateRange({ start: '', end: '' });
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-background border-b shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard/dailies">
                <Button variant="outline" size="sm">
                  ← Back to Dailies
                </Button>
              </Link>
              <Typography variant="h3" weight="bold">
                📅 Daily History
              </Typography>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">🔍 Search & Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Search */}
              <div>
                <Typography variant="body" weight="medium" className="mb-2">
                  Search Notes
                </Typography>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search in notes..."
                    className="w-full pl-10 pr-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Date Range Start */}
              <div>
                <Typography variant="body" weight="medium" className="mb-2">
                  Start Date
                </Typography>
                <input
                  type="date"
                  value={selectedDateRange.start}
                  onChange={(e) => setSelectedDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Date Range End */}
              <div>
                <Typography variant="body" weight="medium" className="mb-2">
                  End Date
                </Typography>
                <input
                  type="date"
                  value={selectedDateRange.end}
                  onChange={(e) => setSelectedDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Typography variant="body" color="muted">
                {filteredEntries.length} entries found
              </Typography>
              <Button onClick={clearFilters} variant="outline" size="sm">
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Entries List */}
        {isLoading ? (
          <Card className="text-center">
            <CardContent className="p-6">
              <Typography variant="h6">Loading entries...</Typography>
            </CardContent>
          </Card>
        ) : paginatedEntries.length === 0 ? (
          <Card className="text-center">
            <CardContent className="p-6">
              <Typography variant="h6" color="muted">
                No entries found
              </Typography>
              <Typography variant="body" color="muted" className="mt-2">
                {filteredEntries.length === 0 && entries.length > 0 
                  ? 'Try adjusting your filters' 
                  : 'Start logging your daily metrics to see them here'
                }
              </Typography>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {paginatedEntries.map((entry) => (
              <Card key={entry.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-600 border-2 border-blue-700 rounded-lg shadow-sm flex items-center justify-center">
                        <Calendar size={24} className="text-white" />
                      </div>
                      <div>
                        <Typography variant="h6" weight="bold">
                          {formatDate(entry.date)}
                        </Typography>
                        <Typography variant="caption" color="muted">
                          {getCompletionRate(entry)}% complete
                        </Typography>
                      </div>
                    </div>
                    <Link href={`/dashboard/dailies/${entry.date}`}>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Sleep Quality */}
                    <div className="text-center">
                      <Typography variant="caption" color="muted">
                        Sleep Quality
                      </Typography>
                      <Typography variant="h6" weight="bold" className="text-blue-600">
                        {entry.sleepQuality}/5
                      </Typography>
                      <Typography variant="caption" color="muted">
                        {getRatingDescription(entry.sleepQuality)}
                      </Typography>
                    </div>

                    {/* Workout */}
                    <div className="text-center">
                      <Typography variant="caption" color="muted">
                        Workout
                      </Typography>
                      <Typography variant="h6" weight="bold" className={entry.workoutCompleted ? 'text-green-600' : 'text-red-600'}>
                        {entry.workoutCompleted ? '✓' : '✗'}
                      </Typography>
                      <Typography variant="caption" color="muted">
                        {entry.workoutCompleted ? 'Completed' : 'Skipped'}
                      </Typography>
                    </div>

                    {/* Steps */}
                    <div className="text-center">
                      <Typography variant="caption" color="muted">
                        Steps
                      </Typography>
                      <Typography variant="h6" weight="bold" className="text-purple-600">
                        {entry.steps.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="muted">
                        steps
                      </Typography>
                    </div>

                    {/* Stress Level */}
                    <div className="text-center">
                      <Typography variant="caption" color="muted">
                        Stress Level
                      </Typography>
                      <Typography variant="h6" weight="bold" className="text-red-600">
                        {entry.stressLevel}/5
                      </Typography>
                      <Typography variant="caption" color="muted">
                        {getRatingDescription(entry.stressLevel)}
                      </Typography>
                    </div>
                  </div>

                  {entry.notes && (
                    <div className="mt-4 p-3 bg-muted border-l-4 border-blue-600 rounded-r-md">
                      <Typography variant="body" className="italic">
                        &quot;{entry.notes}&quot;
                      </Typography>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Typography variant="body" color="muted">
                  Page {currentPage} of {totalPages}
                </Typography>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight size={16} />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}

export default function DailiesHistoryPage() {
  return (
    <ProtectedRoute>
      <DailiesHistoryContent />
    </ProtectedRoute>
  );
} 