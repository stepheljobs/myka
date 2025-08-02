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
    const { amount, date, time } = body;

    if (!amount || !date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const entryId = await MorningRoutineService.logWater({
      userId: currentUser.uid,
      amount: parseInt(amount),
      date: new Date(date),
      time: time ? new Date(time) : new Date()
    });

    return NextResponse.json({ success: true, entryId });
  } catch (error) {
    console.error('Error logging water:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 