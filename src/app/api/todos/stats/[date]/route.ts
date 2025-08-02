import { NextRequest, NextResponse } from 'next/server';
import { todoService } from '@/lib/todo-service';
import { authService } from '@/lib/auth-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const user = authService.getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const date = new Date(params.date);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    const stats = await todoService.getTodoStats(user.uid, date);
    
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching todo stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todo statistics' },
      { status: 500 }
    );
  }
} 