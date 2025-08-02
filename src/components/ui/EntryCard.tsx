import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { JournalHistoryEntry } from '../../types';

interface EntryCardProps {
  entry: JournalHistoryEntry;
  onEdit?: (entry: JournalHistoryEntry) => void;
  onDelete?: (date: string) => void;
}

export default function EntryCard({ entry, onEdit, onDelete }: EntryCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(entry);
    }
  };

  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this entry?')) {
      onDelete(entry.date);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        {/* Date Header */}
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {formatDate(entry.date)}
          </CardTitle>
          <div className="flex space-x-2">
            {onEdit && (
              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Wins Section */}
        <div>
          <h5 className="mb-2 flex items-center text-green-700 font-medium">
            🙌 Wins
          </h5>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {entry.winsPreview || entry.wins}
          </p>
        </div>

        {/* Commitments Section */}
        <div>
          <h5 className="mb-2 flex items-center text-blue-700 font-medium">
            🤔 Commitments
          </h5>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {entry.commitmentsPreview || entry.commitments}
          </p>
        </div>

        {/* View Full Entry Link */}
        <div className="flex justify-end">
          <Link href={`/dashboard/journal/${entry.date}`}>
            <Button variant="default" size="sm">
              View Full Entry
            </Button>
          </Link>
        </div>

        {/* Timestamp */}
        <div className="pt-3 border-t">
          <p className="text-xs text-muted-foreground">
            Last updated: {new Date(entry.updatedAt).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 