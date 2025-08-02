import { NextRequest, NextResponse } from 'next/server';
import { DailiesService } from '../../../../lib/dailies-service';
import { auth } from '../../../../lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate parameters are required' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validate date range
    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json(
        { error: 'startDate must be before or equal to endDate' },
        { status: 400 }
      );
    }

    const dailiesService = new DailiesService(currentUser.uid);
    const trends = await dailiesService.getDailyTrends(startDate, endDate);
    
    return NextResponse.json({ trends });
  } catch (error: any) {
    console.error('Dailies trends retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve daily trends' },
      { status: 500 }
    );
  }
} 