import { NextRequest, NextResponse } from 'next/server';
import { priorityService } from '@/lib/priority-service';
import { getAuth } from 'firebase/auth';

export async function GET(
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

    return NextResponse.json(priority);
  } catch (error) {
    console.error('Error getting priority:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
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

    const body = await request.json();
    const { title, description, priority: priorityNumber, completed } = body;

    await priorityService.updatePriority(params.id, {
      title,
      description,
      priority: priorityNumber,
      completed
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating priority:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
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

    await priorityService.deletePriority(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting priority:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 