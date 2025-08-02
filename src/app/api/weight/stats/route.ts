import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { MorningRoutineService } from '@/lib/morning-routine-service';

export async function GET(request: NextRequest) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await MorningRoutineService.getWeightStats(currentUser.uid);
    
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error getting weight stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 