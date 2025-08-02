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

    const dateParam = params.date;
    if (!dateParam) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateParam)) {
      return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD' }, { status: 400 });
    }

    const date = new Date(dateParam);
    if (isNaN(date.getTime())) {
      return NextResponse.json({ error: 'Invalid date' }, { status: 400 });
    }

    const weightEntry = await MorningRoutineService.getWeightForDate(
      currentUser.uid,
      date
    );

    return NextResponse.json({ 
      success: true, 
      data: weightEntry
    });
  } catch (error) {
    console.error('Error getting weight for date:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 