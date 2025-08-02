import { NextRequest, NextResponse } from 'next/server';
import { todoService } from '@/lib/todo-service';
import { authService } from '@/lib/auth-service';
import { CreateTodoRequest } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const user = authService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const todos = await todoService.getTodosForUser(user.uid);
    return NextResponse.json({ todos });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = authService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body: CreateTodoRequest = await request.json();
    if (!body.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    const todo = await todoService.createTodo(user.uid, body);
    return NextResponse.json({ todo }, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
} 