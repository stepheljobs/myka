import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { MorningRoutineService } from '@/lib/morning-routine-service';

export async function GET(request: NextRequest) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = await MorningRoutineService.getRoutineConfig(currentUser.uid);
    return NextResponse.json({ config });
  } catch (error) {
    console.error('Error getting routine config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { wakeUpTime, enabled, tasks, notificationSettings } = body;

    let config = await MorningRoutineService.getRoutineConfig(currentUser.uid);
    
    if (config) {
      // Update existing config
      await MorningRoutineService.updateRoutineConfig(config.id, {
        wakeUpTime,
        enabled,
        tasks,
        notificationSettings
      });
    } else {
      // Create new config
      await MorningRoutineService.createRoutineConfig({
        userId: currentUser.uid,
        wakeUpTime,
        enabled,
        tasks: tasks || [],
        notificationSettings: notificationSettings || {
          enabled: true,
          sound: true,
          vibration: true,
          snoozeEnabled: true,
          snoozeDuration: 10
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating routine config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 