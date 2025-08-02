import { NextRequest, NextResponse } from 'next/server';
import { DailiesService } from '../../../../../lib/dailies-service';
import { auth } from '../../../../../lib/firebase';

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

    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    const dailiesService = new DailiesService(currentUser.uid);
    const entry = await dailiesService.getEntryByDate(date);
    
    return NextResponse.json({ entry });
  } catch (error: any) {
    console.error('Dailies date entry retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve daily entry for date' },
      { status: 500 }
    );
  }
} 