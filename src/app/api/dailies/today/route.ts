import { NextRequest, NextResponse } from 'next/server';
import { DailiesService } from '../../../../lib/dailies-service';
import { auth } from '../../../../lib/firebase';

export async function GET(request: NextRequest) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dailiesService = new DailiesService(currentUser.uid);
    const entry = await dailiesService.getTodayEntry();
    
    return NextResponse.json({ entry });
  } catch (error: any) {
    console.error('Dailies today entry retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve today\'s daily entry' },
      { status: 500 }
    );
  }
} 