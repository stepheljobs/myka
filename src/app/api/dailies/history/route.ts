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
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 30;

    // Validate limit
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Limit must be a number between 1 and 100' },
        { status: 400 }
      );
    }

    const dailiesService = new DailiesService(currentUser.uid);
    const entries = await dailiesService.getRecentEntries(limit);
    
    return NextResponse.json({ entries });
  } catch (error: any) {
    console.error('Dailies history retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve daily history' },
      { status: 500 }
    );
  }
} 