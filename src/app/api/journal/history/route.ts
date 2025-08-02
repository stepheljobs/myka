import { NextRequest, NextResponse } from 'next/server';
import { JournalService } from '../../../../lib/journal-service';
import { auth } from '../../../../lib/firebase';

const journalService = new JournalService();

export async function GET(request: NextRequest) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30');

    const entries = await journalService.getRecentEntries(currentUser.uid, limit);
    
    return NextResponse.json({ entries });
  } catch (error: any) {
    console.error('Journal history retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve journal history' },
      { status: 500 }
    );
  }
} 