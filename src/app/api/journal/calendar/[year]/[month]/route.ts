import { NextRequest, NextResponse } from 'next/server';
import { JournalHistoryService } from '../../../../../../lib/journal-history-service';
import { auth } from '../../../../../../lib/firebase';

const journalHistoryService = new JournalHistoryService();

export async function GET(
  request: NextRequest,
  { params }: { params: { year: string; month: string } }
) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { year, month } = params;
    
    // Validate year and month
    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    
    if (isNaN(yearNum) || isNaN(monthNum) || monthNum < 1 || monthNum > 12) {
      return NextResponse.json(
        { error: 'Invalid year or month' },
        { status: 400 }
      );
    }

    const calendarData = await journalHistoryService.getCalendarData(currentUser.uid, yearNum, monthNum);
    
    return NextResponse.json({ calendarData });
  } catch (error: any) {
    console.error('Calendar data retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve calendar data' },
      { status: 500 }
    );
  }
} 