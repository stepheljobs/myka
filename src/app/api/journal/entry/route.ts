import { NextRequest, NextResponse } from 'next/server';
import { JournalService } from '../../../../lib/journal-service';
import { auth } from '../../../../lib/firebase';

const journalService = new JournalService();

export async function POST(request: NextRequest) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { wins, commitments } = body;

    if (!wins || !commitments) {
      return NextResponse.json(
        { error: 'Wins and commitments are required' },
        { status: 400 }
      );
    }

    const entryId = await journalService.createOrUpdateTodayEntry(currentUser.uid, {
      wins,
      commitments,
    });

    return NextResponse.json({ id: entryId, success: true });
  } catch (error: any) {
    console.error('Journal entry creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create journal entry' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entry = await journalService.getTodayEntry(currentUser.uid);
    
    return NextResponse.json({ entry });
  } catch (error: any) {
    console.error('Journal entry retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve journal entry' },
      { status: 500 }
    );
  }
} 