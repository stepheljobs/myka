import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { MorningRoutineService } from '@/lib/morning-routine-service';

export async function GET(request: NextRequest) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const enhancedStats = await MorningRoutineService.getEnhancedWeightStats(
      currentUser.uid
    );

    return NextResponse.json({ 
      success: true, 
      data: enhancedStats
    });
  } catch (error) {
    console.error('Error getting enhanced weight stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 