'use client';

import { useState } from 'react';
import { CreateTodoRequest } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';

interface AddTodoModalProps {
  onClose: () => void;
  onSubmit: (todoData: CreateTodoRequest) => Promise<void>;
}

export default function AddTodoModal({ 
  onClose, 
  onSubmit
}: AddTodoModalProps) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ title: title.trim() });
      setTitle('');
    } catch (err) {
      setError('Failed to create todo. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h4" weight="bold">
            ✨ Add New Todo
          </Typography>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            ✕
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2">
              <Typography variant="body" weight="medium">
                Title *
              </Typography>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              disabled={loading}
              autoFocus
              className={error ? "border-red-500" : ""}
            />
          </div>
          {error && (
            <Typography variant="body" className="text-brutal-red">
              {error}
            </Typography>
          )}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              className="flex-1"
            >
              Create Todo
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
} 