import { NextRequest, NextResponse } from 'next/server';
import { scheduledNotificationsService } from '@/lib/scheduled-notifications-service';
import { getAuth } from 'firebase/auth';

export async function GET(request: NextRequest) {
  try {
    const authInstance = getAuth();
    const user = authInstance.currentUser;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await scheduledNotificationsService.getScheduledNotifications(user.uid);

    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
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
    const { time, title, body: notificationBody, type, actions, enabled, snoozeEnabled, snoozeDuration } = body;

    if (!time || !title || !notificationBody || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const notificationId = await scheduledNotificationsService.createScheduledNotification({
      userId: user.uid,
      time,
      title,
      body: notificationBody,
      type,
      actions: actions || [],
      enabled: enabled !== undefined ? enabled : true,
      snoozeEnabled: snoozeEnabled !== undefined ? snoozeEnabled : true,
      snoozeDuration: snoozeDuration || 10
    });

    return NextResponse.json({ id: notificationId }, { status: 201 });
  } catch (error) {
    console.error('Error creating scheduled notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 