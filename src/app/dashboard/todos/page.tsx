'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import BottomNavigation from '@/components/BottomNavigation';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import { useTodos } from '@/hooks/useTodos';
import TodoItem from './components/TodoItem';
import AddTodoModal from './components/AddTodoModal';

function TodosContent() {
  const { state } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo
  } = useTodos();

  const handleAddTodo = async (todoData: any) => {
    try {
      await addTodo(todoData);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  if (loading && todos.length === 0) {
    return (
      <div className="min-h-screen bg-brutal-white flex items-center justify-center">
        <Typography variant="h4">Loading todos...</Typography>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-brutal-white pb-20">
      {/* Header */}
      <header className="bg-brutal-white border-b-brutal border-brutal-black shadow-brutal-sm sticky top-0 z-40">
        <div className="brutal-container py-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h3" weight="bold">
                📝 Todo List
              </Typography>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              variant="default"
              size="sm"
            >
              + Add Todo
            </Button>
          </div>
        </div>
      </header>

      <div className="brutal-container py-brutal-lg">
        {/* Error Display */}
        {error && (
          <Card className="mb-brutal-lg bg-red-50">
            <Typography variant="body" className="text-brutal-red">
              Error: {error}
            </Typography>
          </Card>
        )}

        {/* All Todos */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h4" weight="bold">
              Todos ({todos.length})
            </Typography>
            {todos.length > 0 && (
              <Typography variant="caption" className="text-brutal-gray">
                {todos.filter(t => t.completed).length} completed
              </Typography>
            )}
          </div>
          
          {todos.length === 0 ? (
            <div className="text-center py-8">
              <Typography variant="h4" className="mb-2">📝</Typography>
              <Typography variant="h5" weight="bold" className="mb-2">
                No todos yet
              </Typography>
              <Typography variant="body" className="text-brutal-gray mb-4">
                Add your first todo to get started!
              </Typography>
              <Button
                onClick={() => setShowAddModal(true)}
                variant="default"
                size="lg"
              >
                Add Your First Todo
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onUpdate={updateTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Add Todo Modal */}
      {showAddModal && (
        <AddTodoModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTodo}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </main>
  );
}

export default function TodosPage() {
  return (
    <ProtectedRoute>
      <TodosContent />
    </ProtectedRoute>
  );
} 