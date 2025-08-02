import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { MorningRoutineService } from '@/lib/morning-routine-service';

export async function POST(request: NextRequest) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { taskId, date } = body;

    if (!taskId || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await MorningRoutineService.markTaskCompleted(currentUser.uid, date, taskId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error marking task completed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 