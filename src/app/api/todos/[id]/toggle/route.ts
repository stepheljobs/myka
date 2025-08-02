import { NextRequest, NextResponse } from 'next/server';
import { todoService } from '@/lib/todo-service';
import { authService } from '@/lib/auth-service';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = authService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const todo = await todoService.toggleTodo(params.id);
    
    return NextResponse.json({ todo });
  } catch (error) {
    console.error('Error toggling todo:', error);
    return NextResponse.json(
      { error: 'Failed to toggle todo' },
      { status: 500 }
    );
  }
} 