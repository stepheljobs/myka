import { NextRequest, NextResponse } from 'next/server';
import { mealService } from '@/lib/meal-service';
import { auth } from '@/lib/firebase';
import { getAuth } from 'firebase/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const mealType = searchParams.get('mealType');
    
    const authInstance = getAuth();
    const user = authInstance.currentUser;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 });
    }

    let mealLogs;
    if (mealType) {
      mealLogs = await mealService.getMealLogsByType(user.uid, date, mealType as any);
    } else {
      mealLogs = await mealService.getMealLogsByDate(user.uid, date);
    }

    return NextResponse.json(mealLogs);
  } catch (error) {
    console.error('Error getting meal logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authInstance = getAuth();
    const user = authInstance.currentUser;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { date, mealType, foods, notes } = body;

    if (!date || !mealType || !foods || !Array.isArray(foods)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const mealLogId = await mealService.createMealLog({
      userId: user.uid,
      date,
      mealType,
      foods,
      notes
    });

    return NextResponse.json({ id: mealLogId }, { status: 201 });
  } catch (error) {
    console.error('Error creating meal log:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 