'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Priority } from '@/types';
import BottomNavigation from '@/components/BottomNavigation';

export default function CharacterDevelopmentPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [priorities, setPriorities] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Simple todo inputs
  const [todo1, setTodo1] = useState('');
  const [todo2, setTodo2] = useState('');
  const [todo3, setTodo3] = useState('');

  useEffect(() => {
    loadPriorities();
  }, [selectedDate]);

  const loadPriorities = async () => {
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const response = await fetch(`/api/priorities?date=${dateString}`);
      if (response.ok) {
        const data = await response.json();
        setPriorities(data);
        
        // Populate the input fields with existing data
        const sortedData = data.sort((a: Priority, b: Priority) => a.priority - b.priority);
        setTodo1(sortedData[0]?.title || '');
        setTodo2(sortedData[1]?.title || '');
        setTodo3(sortedData[2]?.title || '');
      }
    } catch (error) {
      console.error('Error loading character development tasks:', error);
    }
  };

  const saveTodos = async () => {
    setLoading(true);
    try {
      const dateString = selectedDate.toISOString().split('T')[0];
      const todos = [todo1, todo2, todo3].filter(todo => todo.trim() !== '');
      
      // Clear existing todos for this date
      for (const priority of priorities) {
        await fetch(`/api/priorities/${priority.id}`, {
          method: 'DELETE',
        });
      }

      // Create new todos
      for (let i = 0; i < todos.length; i++) {
        await fetch('/api/priorities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: todos[i],
            description: '',
            priority: i + 1,
            date: dateString
          }),
        });
      }

      toast({
        title: 'Saved',
        description: 'Your character development actions have been saved.',
      });
      
      loadPriorities();
    } catch (error) {
      console.error('Error saving actions:', error);
      toast({
        title: 'Error',
        description: 'Failed to save actions. Please try again.',
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
        throw new Error('Failed to toggle action completion');
      }
    } catch (error) {
      console.error('Error toggling action completion:', error);
      toast({
        title: 'Error',
        description: 'Failed to update action completion. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(selectedDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  const getCompletionRate = () => {
    if (priorities.length === 0) return 0;
    const completed = priorities.filter(p => p.completed).length;
    return Math.round((completed / priorities.length) * 100);
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6 max-w-2xl pb-24">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Daily Priorities</h1>
          <p className="text-muted-foreground text-lg">
            What 2 to 3 things will you do today that would bring you closer to your 2.0 character?
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            {/* Date Navigation */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('prev')}
              >
                ←
              </Button>
              <Input
                type="date"
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="w-40 text-center"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateDate('next')}
              >
                →
              </Button>
            </div>

            {/* Todo Rows */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={priorities.find(p => p.priority === 1)?.completed || false}
                  onCheckedChange={() => {
                    const priority = priorities.find(p => p.priority === 1);
                    if (priority) {
                      togglePriorityCompletion(priority.id);
                    }
                  }}
                  className="w-5 h-5"
                />
                <Input
                  placeholder="What will you do today for your character development?"
                  value={todo1}
                  onChange={(e) => setTodo1(e.target.value)}
                  className="flex-1"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={priorities.find(p => p.priority === 2)?.completed || false}
                  onCheckedChange={() => {
                    const priority = priorities.find(p => p.priority === 2);
                    if (priority) {
                      togglePriorityCompletion(priority.id);
                    }
                  }}
                  className="w-5 h-5"
                />
                <Input
                  placeholder="What will you do today for your character development?"
                  value={todo2}
                  onChange={(e) => setTodo2(e.target.value)}
                  className="flex-1"
                />
              </div>
              
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={priorities.find(p => p.priority === 3)?.completed || false}
                  onCheckedChange={() => {
                    const priority = priorities.find(p => p.priority === 3);
                    if (priority) {
                      togglePriorityCompletion(priority.id);
                    }
                  }}
                  className="w-5 h-5"
                />
                <Input
                  placeholder="What will you do today for your character development?"
                  value={todo3}
                  onChange={(e) => setTodo3(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <Button onClick={saveTodos} disabled={loading} className="w-full mt-6">
              {loading ? 'Saving...' : 'Save Actions'}
            </Button>

            {/* Progress */}
            {priorities.length > 0 && (
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {getCompletionRate()}% Complete
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <BottomNavigation />
    </>
  );
} 