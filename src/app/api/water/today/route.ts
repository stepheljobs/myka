import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { MorningRoutineService } from '@/lib/morning-routine-service';

export async function GET(request: NextRequest) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const todayEntries = await MorningRoutineService.getTodayWaterIntake(currentUser.uid);
    const stats = await MorningRoutineService.getWaterStats(currentUser.uid);
    
    return NextResponse.json({ 
      todayEntries,
      stats
    });
  } catch (error) {
    console.error('Error getting today water intake:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 