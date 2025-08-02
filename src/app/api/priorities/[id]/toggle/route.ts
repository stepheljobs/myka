import { NextRequest, NextResponse } from 'next/server';
import { priorityService } from '@/lib/priority-service';
import { getAuth } from 'firebase/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authInstance = getAuth();
    const user = authInstance.currentUser;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const priority = await priorityService.getPriority(params.id);
    
    if (!priority) {
      return NextResponse.json({ error: 'Priority not found' }, { status: 404 });
    }

    if (priority.userId !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await priorityService.togglePriorityCompletion(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling priority completion:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 