import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { MorningRoutineService } from '@/lib/morning-routine-service';

export async function GET(request: NextRequest) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30');

    const history = await MorningRoutineService.getWeightHistory(currentUser.uid, limit);
    
    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error getting weight history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 