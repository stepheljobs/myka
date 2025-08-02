'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Priority } from '@/types';

export default function PriorityManagementPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [newPriority, setNewPriority] = useState({ title: '', description: '', priority: 1 as 1 | 2 | 3 });
  const [editingPriority, setEditingPriority] = useState<Priority | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPriorities();
  }, [selectedDate]);

  const loadPriorities = async () => {
    try {
      const response = await fetch(`/api/priorities?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setPriorities(data);
      }
    } catch (error) {
      console.error('Error loading priorities:', error);
    }
  };

  const createPriority = async () => {
    if (!newPriority.title.trim()) {
      toast({
        title: 'Missing Title',
        description: 'Please enter a title for your priority.',
        variant: 'destructive',
      });
      return;
    }

    // Check if priority number is already taken
    const existingPriority = priorities.find(p => p.priority === newPriority.priority);
    if (existingPriority) {
      toast({
        title: 'Priority Number Taken',
        description: `Priority ${newPriority.priority} is already assigned. Please choose a different number.`,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/priorities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newPriority.title,
          description: newPriority.description,
          priority: newPriority.priority,
          date: selectedDate
        }),
      });

      if (response.ok) {
        toast({
          title: 'Priority Created',
          description: 'Your priority has been created successfully.',
        });
        
        // Reset form
        setNewPriority({ title: '', description: '', priority: 1 });
        loadPriorities();
      } else {
        throw new Error('Failed to create priority');
      }
    } catch (error) {
      console.error('Error creating priority:', error);
      toast({
        title: 'Error',
        description: 'Failed to create priority. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updatePriority = async (priority: Priority) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/priorities/${priority.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: priority.title,
          description: priority.description,
          priority: priority.priority,
          completed: priority.completed
        }),
      });

      if (response.ok) {
        toast({
          title: 'Priority Updated',
          description: 'Your priority has been updated successfully.',
        });
        setEditingPriority(null);
        loadPriorities();
      } else {
        throw new Error('Failed to update priority');
      }
    } catch (error) {
      console.error('Error updating priority:', error);
      toast({
        title: 'Error',
        description: 'Failed to update priority. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deletePriority = async (priorityId: string) => {
    if (!confirm('Are you sure you want to delete this priority?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/priorities/${priorityId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: 'Priority Deleted',
          description: 'Your priority has been deleted successfully.',
        });
        loadPriorities();
      } else {
        throw new Error('Failed to delete priority');
      }
    } catch (error) {
      console.error('Error deleting priority:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete priority. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePriorityCompletion = async (priorityId: string) => {
    try {
      const response = await fetch(`/api/priorities/${priorityId}/toggle`, {
        method: 'POST',
      });

      if (response.ok) {
        loadPriorities();
      } else {
        throw new Error('Failed to toggle priority completion');
      }
    } catch (error) {
      console.error('Error toggling priority completion:', error);
      toast({
        title: 'Error',
        description: 'Failed to update priority completion. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'text-red-600 bg-red-50 border-red-200';
      case 2: return 'text-orange-600 bg-orange-50 border-orange-200';
      case 3: return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCompletionRate = () => {
    if (priorities.length === 0) return 0;
    const completed = priorities.filter(p => p.completed).length;
    return Math.round((completed / priorities.length) * 100);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Priority Management</h1>
        <p className="text-muted-foreground">
          Set and track your top 3 priorities for each day.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Priority Creation */}
        <Card>
          <CardHeader>
            <CardTitle>Add New Priority</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="priority-number">Priority Number (1-3)</Label>
              <Input
                id="priority-number"
                type="number"
                min="1"
                max="3"
                value={newPriority.priority}
                onChange={(e) => setNewPriority(prev => ({ ...prev, priority: parseInt(e.target.value) as 1 | 2 | 3 }))}
              />
            </div>

            <div>
              <Label htmlFor="priority-title">Title</Label>
              <Input
                id="priority-title"
                placeholder="Enter priority title..."
                value={newPriority.title}
                onChange={(e) => setNewPriority(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="priority-description">Description (Optional)</Label>
              <Textarea
                id="priority-description"
                placeholder="Enter priority description..."
                value={newPriority.description}
                onChange={(e) => setNewPriority(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <Button onClick={createPriority} disabled={loading} className="w-full">
              {loading ? 'Creating...' : 'Create Priority'}
            </Button>
          </CardContent>
        </Card>

        {/* Priority List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today&apos;s Priorities</CardTitle>
              <div className="text-sm text-muted-foreground">
                {getCompletionRate()}% Complete
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {priorities.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No priorities set for today. Add your top 3 priorities to get started.
              </p>
            ) : (
              <div className="space-y-4">
                {priorities
                  .sort((a, b) => a.priority - b.priority)
                  .map((priority) => (
                    <div
                      key={priority.id}
                      className={`border rounded-md p-4 ${getPriorityColor(priority.priority)} ${
                        priority.completed ? 'opacity-60' : ''
                      }`}
                    >
                      {editingPriority?.id === priority.id ? (
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold">#{priority.priority}</span>
                            <Input
                              value={editingPriority.title}
                              onChange={(e) => setEditingPriority(prev => prev ? { ...prev, title: e.target.value } : null)}
                              className="flex-1"
                            />
                          </div>
                          <Textarea
                            value={editingPriority.description || ''}
                            onChange={(e) => setEditingPriority(prev => prev ? { ...prev, description: e.target.value } : null)}
                            placeholder="Description..."
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updatePriority(editingPriority)}
                              disabled={loading}
                            >
                              {loading ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingPriority(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3 flex-1">
                              <Checkbox
                                checked={priority.completed}
                                onCheckedChange={() => togglePriorityCompletion(priority.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold">#{priority.priority}</span>
                                  <h3 className={`font-semibold ${priority.completed ? 'line-through' : ''}`}>
                                    {priority.title}
                                  </h3>
                                </div>
                                {priority.description && (
                                  <p className={`text-sm mt-1 ${priority.completed ? 'line-through' : ''}`}>
                                    {priority.description}
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingPriority(priority)}
                              >
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deletePriority(priority.id)}
                              >
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Summary */}
      {priorities.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Progress Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{priorities.length}</div>
                <div className="text-sm text-muted-foreground">Total Priorities</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {priorities.filter(p => p.completed).length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {getCompletionRate()}%
                </div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 