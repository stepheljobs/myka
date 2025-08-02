import { NextRequest, NextResponse } from 'next/server';
import { JournalHistoryService } from '../../../../../lib/journal-history-service';
import { auth } from '../../../../../lib/firebase';

const journalHistoryService = new JournalHistoryService();

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
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    const entry = await journalHistoryService.getEntryByDate(currentUser.uid, date);
    
    return NextResponse.json({ entry });
  } catch (error: any) {
    console.error('Journal entry retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve journal entry' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { date: string } }
) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { date } = params;
    const body = await request.json();
    const { wins, commitments } = body;

    if (!wins || !commitments) {
      return NextResponse.json(
        { error: 'Wins and commitments are required' },
        { status: 400 }
      );
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    await journalHistoryService.updateEntry(currentUser.uid, date, {
      wins,
      commitments,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Journal entry update error:', error);
    return NextResponse.json(
      { error: 'Failed to update journal entry' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    await journalHistoryService.deleteEntry(currentUser.uid, date);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Journal entry deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete journal entry' },
      { status: 500 }
    );
  }
} 