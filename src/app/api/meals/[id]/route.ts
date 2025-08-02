import { NextRequest, NextResponse } from 'next/server';
import { mealService } from '@/lib/meal-service';
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

    const mealLog = await mealService.getMealLog(params.id);
    
    if (!mealLog) {
      return NextResponse.json({ error: 'Meal log not found' }, { status: 404 });
    }

    if (mealLog.userId !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(mealLog);
  } catch (error) {
    console.error('Error getting meal log:', error);
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

    const mealLog = await mealService.getMealLog(params.id);
    
    if (!mealLog) {
      return NextResponse.json({ error: 'Meal log not found' }, { status: 404 });
    }

    if (mealLog.userId !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { mealType, foods, notes } = body;

    await mealService.updateMealLog(params.id, {
      mealType,
      foods,
      notes
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating meal log:', error);
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

    const mealLog = await mealService.getMealLog(params.id);
    
    if (!mealLog) {
      return NextResponse.json({ error: 'Meal log not found' }, { status: 404 });
    }

    if (mealLog.userId !== user.uid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await mealService.deleteMealLog(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting meal log:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 