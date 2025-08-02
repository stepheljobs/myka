import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { TodoService } from '@/lib/todo-service';
import { TodoItem, CreateTodoRequest, UpdateTodoRequest } from '@/types';

export function useTodos() {
  const { state } = useAuth();
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = state.user?.uid;

  // Load all todos for the user
  const loadTodos = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const todoService = new TodoService();
      const todosData = await todoService.getTodosForUser(userId);
      setTodos(todosData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load todos');
      console.error('Error loading todos:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Create a new todo
  const addTodo = useCallback(async (todoData: CreateTodoRequest) => {
    if (!userId) throw new Error('User not authenticated');
    setLoading(true);
    setError(null);
    try {
      const todoService = new TodoService();
      const newTodo = await todoService.createTodo(userId, todoData);
      setTodos(prev => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
      console.error('Error creating todo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Update an existing todo
  const updateTodo = useCallback(async (id: string, updates: UpdateTodoRequest) => {
    if (!userId) throw new Error('User not authenticated');
    setLoading(true);
    setError(null);
    try {
      const todoService = new TodoService();
      const updatedTodo = await todoService.updateTodo(id, updates);
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
      return updatedTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
      console.error('Error updating todo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Delete a todo
  const deleteTodo = useCallback(async (id: string) => {
    if (!userId) throw new Error('User not authenticated');
    setLoading(true);
    setError(null);
    try {
      const todoService = new TodoService();
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
      console.error('Error deleting todo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Toggle todo completion status
  const toggleTodo = useCallback(async (id: string) => {
    if (!userId) throw new Error('User not authenticated');
    setLoading(true);
    setError(null);
    try {
      const todoService = new TodoService();
      const updatedTodo = await todoService.toggleTodo(id);
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
      return updatedTodo;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle todo');
      console.error('Error toggling todo:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    refresh: loadTodos
  };
} 