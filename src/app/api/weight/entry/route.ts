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
    const { weight, unit, date, notes } = body;

    if (!weight || !unit || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const entryId = await MorningRoutineService.logWeight({
      userId: currentUser.uid,
      weight: parseFloat(weight),
      unit,
      date: new Date(date),
      notes
    });

    return NextResponse.json({ success: true, entryId });
  } catch (error) {
    console.error('Error logging weight:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 