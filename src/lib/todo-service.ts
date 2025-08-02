import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { 
  TodoItem, 
  TodoDocument, 
  TodoStats, 
  CreateTodoRequest, 
  UpdateTodoRequest 
} from '@/types';

export class TodoService {
  private todosCollection = collection(db, 'todos');
  private statsCollection = collection(db, 'todo_stats');

  /**
   * Get todos for a specific date (now just all todos for user, sorted by createdAt desc)
   */
  async getTodosForUser(userId: string): Promise<TodoItem[]> {
    try {
      const q = query(
        this.todosCollection,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const todos: TodoItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as TodoDocument;
        todos.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
        });
      });
      return todos;
    } catch (error) {
      console.error('Error getting todos:', error);
      throw new Error('Failed to fetch todos');
    }
  }

  /**
   * Create a new todo
   */
  async createTodo(userId: string, todoData: CreateTodoRequest): Promise<TodoItem> {
    try {
      const todoDoc: Omit<TodoDocument, 'id'> = {
        userId,
        title: todoData.title,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const docRef = await addDoc(this.todosCollection, todoDoc);
      return {
        ...todoDoc,
        id: docRef.id
      };
    } catch (error) {
      console.error('Error creating todo:', error);
      throw new Error('Failed to create todo');
    }
  }

  /**
   * Update an existing todo
   */
  async updateTodo(id: string, updates: UpdateTodoRequest): Promise<TodoItem> {
    try {
      const todoRef = doc(this.todosCollection, id);
      const todoDoc = await getDoc(todoRef);
      if (!todoDoc.exists()) {
        throw new Error('Todo not found');
      }
      const updateData = {
        ...updates,
        updatedAt: new Date()
      };
      await updateDoc(todoRef, updateData);
      const updatedDoc = await getDoc(todoRef);
      const data = updatedDoc.data() as TodoDocument;
      return {
        ...data,
        id: updatedDoc.id,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
      };
    } catch (error) {
      console.error('Error updating todo:', error);
      throw new Error('Failed to update todo');
    }
  }

  /**
   * Delete a todo
   */
  async deleteTodo(id: string): Promise<void> {
    try {
      const todoRef = doc(this.todosCollection, id);
      await deleteDoc(todoRef);
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw new Error('Failed to delete todo');
    }
  }

  /**
   * Toggle todo completion status
   */
  async toggleTodo(id: string): Promise<TodoItem> {
    try {
      const todoRef = doc(this.todosCollection, id);
      const todoDoc = await getDoc(todoRef);
      if (!todoDoc.exists()) {
        throw new Error('Todo not found');
      }
      const data = todoDoc.data() as TodoDocument;
      const newCompletedStatus = !data.completed;
      await updateDoc(todoRef, {
        completed: newCompletedStatus,
        updatedAt: new Date()
      });
      return {
        ...data,
        id: todoDoc.id,
        completed: newCompletedStatus,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
        updatedAt: new Date()
      };
    } catch (error) {
      console.error('Error toggling todo:', error);
      throw new Error('Failed to toggle todo');
    }
  }

  /**
   * Get todo statistics for a specific date
   */
  async getTodoStats(userId: string, date: Date): Promise<TodoStats> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const q = query(
        this.todosCollection,
        where('userId', '==', userId),
        where('createdAt', '>=', startOfDay),
        where('createdAt', '<=', endOfDay)
      );
      
      const querySnapshot = await getDocs(q);
      const todos: TodoItem[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as TodoDocument;
        todos.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : data.createdAt,
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : data.updatedAt
        });
      });

      const totalTodos = todos.length;
      const completedTodos = todos.filter(todo => todo.completed).length;
      const completionRate = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

      return {
        id: `${userId}-${date.toISOString().split('T')[0]}`,
        userId,
        date: date.toISOString().split('T')[0],
        totalTodos,
        completedTodos,
        completionRate: Math.round(completionRate * 100) / 100
      };
    } catch (error) {
      console.error('Error getting todo stats:', error);
      throw new Error('Failed to fetch todo statistics');
    }
  }
}

export const todoService = new TodoService(); 