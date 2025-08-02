'use client';

import { useState } from 'react';
import { TodoItem as TodoItemType } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Typography from '@/components/ui/Typography';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (id: string) => Promise<any>;
  onUpdate: (id: string, updates: any) => Promise<any>;
  onDelete: (id: string) => Promise<void>;
}

export default function TodoItem({ 
  todo, 
  onToggle, 
  onUpdate, 
  onDelete
}: TodoItemProps) {
  const [loading, setLoading] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    try {
      await onToggle(todo.id);
    } catch (error) {
      console.error('Error toggling todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this todo?')) return;
    setLoading(true);
    try {
      await onDelete(todo.id);
    } catch (error) {
      console.error('Error deleting todo:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      className={`p-4 transition-all duration-200 ${
        todo.completed 
          ? 'opacity-75 bg-brutal-light-gray' 
          : ''
      }`}
    >
      <div className="flex items-center space-x-3">
        {/* Checkbox */}
        <button
          onClick={handleToggle}
          disabled={loading}
          className={`flex-shrink-0 w-6 h-6 border-2 border-brutal-black transition-all duration-200 ${
            todo.completed 
              ? 'bg-brutal-green border-brutal-green' 
              : 'bg-brutal-white hover:bg-brutal-light-gray'
          } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {todo.completed && (
            <span className="flex items-center justify-center text-brutal-white text-sm">
              ✓
            </span>
          )}
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <Typography 
            variant="body" 
            weight="medium"
            className={`mb-1 ${
              todo.completed ? 'line-through text-brutal-gray' : ''
            }`}
          >
            {todo.title}
          </Typography>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 ml-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowActions(!showActions)}
            disabled={loading}
          >
            ⋯
          </Button>
        </div>

        {/* Action Menu */}
        {showActions && (
          <div className="ml-2 flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
} 