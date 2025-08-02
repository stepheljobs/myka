import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { MorningRoutineService } from '@/lib/morning-routine-service';

export async function GET(request: NextRequest) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const today = new Date();
    const weightEntry = await MorningRoutineService.getWeightForDate(
      currentUser.uid,
      today
    );

    return NextResponse.json({ 
      success: true, 
      data: weightEntry
    });
  } catch (error) {
    console.error('Error getting today\'s weight:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 