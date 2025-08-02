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
    const startDateParam = searchParams.get('startDate');
    const endDateParam = searchParams.get('endDate');

    if (!startDateParam || !endDateParam) {
      return NextResponse.json({ error: 'Missing startDate or endDate parameters' }, { status: 400 });
    }

    const startDate = new Date(startDateParam);
    const endDate = new Date(endDateParam);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }

    if (startDate > endDate) {
      return NextResponse.json({ error: 'startDate must be before endDate' }, { status: 400 });
    }

    const summary = await MorningRoutineService.getDailyWeightSummary(
      currentUser.uid,
      startDate,
      endDate
    );

    return NextResponse.json({ 
      success: true, 
      data: {
        period: `${Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))}d`,
        summary
      }
    });
  } catch (error) {
    console.error('Error getting daily weight summary:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 