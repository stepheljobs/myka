import { NextRequest, NextResponse } from 'next/server';
import { priorityService } from '@/lib/priority-service';
import { getAuth } from 'firebase/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const authInstance = getAuth();
    const user = authInstance.currentUser;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let priorities;
    if (date) {
      priorities = await priorityService.getPrioritiesByDate(user.uid, date);
    } else if (startDate && endDate) {
      priorities = await priorityService.getPrioritiesByDateRange(user.uid, startDate, endDate);
    } else {
      // Default to today's priorities
      const today = new Date().toISOString().split('T')[0];
      priorities = await priorityService.getPrioritiesByDate(user.uid, today);
    }

    return NextResponse.json(priorities);
  } catch (error) {
    console.error('Error getting priorities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authInstance = getAuth();
    const user = authInstance.currentUser;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, priority, date } = body;

    if (!title || !priority || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const priorityId = await priorityService.createPriority({
      userId: user.uid,
      title,
      description,
      priority,
      completed: false,
      date
    });

    return NextResponse.json({ id: priorityId }, { status: 201 });
  } catch (error) {
    console.error('Error creating priority:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 