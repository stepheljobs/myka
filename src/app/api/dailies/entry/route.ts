import { NextRequest, NextResponse } from 'next/server';
import { DailiesService } from '../../../../lib/dailies-service';
import { auth } from '../../../../lib/firebase';
import { CreateDailyEntryRequest } from '../../../../types';

export async function POST(request: NextRequest) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      sleepQuality,
      weight,
      workoutCompleted,
      steps,
      stressLevel,
      fatigueLevel,
      hungerLevel,
      goalReviewCompleted,
      tomorrowPlanningCompleted,
      notes
    } = body as CreateDailyEntryRequest;

    // Validate required fields
    if (sleepQuality === undefined || workoutCompleted === undefined || 
        steps === undefined || stressLevel === undefined || 
        fatigueLevel === undefined || hungerLevel === undefined ||
        goalReviewCompleted === undefined || tomorrowPlanningCompleted === undefined) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Validate rating scales (1-5)
    if (sleepQuality < 1 || sleepQuality > 5 || 
        stressLevel < 1 || stressLevel > 5 ||
        fatigueLevel < 1 || fatigueLevel > 5 ||
        hungerLevel < 1 || hungerLevel > 5) {
      return NextResponse.json(
        { error: 'Rating values must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate steps is positive
    if (steps < 0) {
      return NextResponse.json(
        { error: 'Steps must be a positive number' },
        { status: 400 }
      );
    }

    const dailiesService = new DailiesService(currentUser.uid);
    const entry = await dailiesService.createOrUpdateTodayEntry({
      sleepQuality,
      weight,
      workoutCompleted,
      steps,
      stressLevel,
      fatigueLevel,
      hungerLevel,
      goalReviewCompleted,
      tomorrowPlanningCompleted,
      notes
    });

    return NextResponse.json({ entry, success: true });
  } catch (error: any) {
    console.error('Dailies entry creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create daily entry' },
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

    const dailiesService = new DailiesService(currentUser.uid);
    const entry = await dailiesService.getTodayEntry();
    
    return NextResponse.json({ entry });
  } catch (error: any) {
    console.error('Dailies entry retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve daily entry' },
      { status: 500 }
    );
  }
} 