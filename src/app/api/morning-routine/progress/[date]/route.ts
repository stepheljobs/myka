import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { MorningRoutineService } from '@/lib/morning-routine-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date } = params;
    const progress = await MorningRoutineService.getDailyProgress(currentUser.uid, date);
    
    return NextResponse.json({ progress });
  } catch (error) {
    console.error('Error getting daily progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 