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
    const period = searchParams.get('period') as '7d' | '14d' | '30d' | '90d';
    const startDateParam = searchParams.get('startDate');

    if (!period || !['7d', '14d', '30d', '90d'].includes(period)) {
      return NextResponse.json({ error: 'Invalid period parameter. Must be 7d, 14d, 30d, or 90d' }, { status: 400 });
    }

    let startDate: Date | undefined;
    if (startDateParam) {
      startDate = new Date(startDateParam);
      if (isNaN(startDate.getTime())) {
        return NextResponse.json({ error: 'Invalid startDate format' }, { status: 400 });
      }
    }

    const trendData = await MorningRoutineService.getWeightTrend(
      currentUser.uid,
      period,
      startDate
    );

    return NextResponse.json({ 
      success: true, 
      data: trendData
    });
  } catch (error) {
    console.error('Error getting weight trend:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 