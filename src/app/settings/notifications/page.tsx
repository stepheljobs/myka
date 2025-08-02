'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/label';
import { notificationManager } from '@/lib/notification-manager';
import { useToast } from '@/hooks/use-toast';

interface NotificationTime {
  weightTracking: string;
  priorityReview: string;
  lunchLogging: string;
  dinnerLogging: string;
  waterReminder: string;
  eveningJournal: string;
}

interface NotificationSettings {
  enabled: boolean;
  times: NotificationTime;
  snoozeEnabled: boolean;
  snoozeDuration: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

const defaultTimes: NotificationTime = {
  weightTracking: '06:00',
  priorityReview: '06:30',
  lunchLogging: '12:00',
  dinnerLogging: '18:00',
  waterReminder: '21:00',
  eveningJournal: '22:00'
};

export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    times: defaultTimes,
    snoozeEnabled: true,
    snoozeDuration: 10,
    soundEnabled: true,
    vibrationEnabled: true
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // TODO: Load settings from user preferences
      // For now, use default settings
      setSettings({
        enabled: true,
        times: defaultTimes,
        snoozeEnabled: true,
        snoozeDuration: 10,
        soundEnabled: true,
        vibrationEnabled: true
      });
    } catch (error) {
      console.error('Error loading notification settings:', error);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      // Update notification manager with new settings
      await notificationManager.scheduleDailyNotifications();
      
      // TODO: Save settings to user preferences
      
      toast({
        title: 'Settings Saved',
        description: 'Your notification settings have been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTimeChange = (notificationType: keyof NotificationTime, time: string) => {
    setSettings(prev => ({
      ...prev,
      times: {
        ...prev.times,
        [notificationType]: time
      }
    }));
  };

  const handleToggle = (key: keyof NotificationSettings, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDurationChange = (value: number) => {
    setSettings(prev => ({
      ...prev,
      snoozeDuration: value
    }));
  };

  const testNotification = async (type: string) => {
    try {
      switch (type) {
        case 'weight-tracking':
          await notificationManager.showWeightReminder();
          break;
        case 'water-reminder':
          await notificationManager.showHydrationReminder();
          break;
        default:
          // Show a generic test notification
          if (notificationManager.isSupported()) {
            const registration = await navigator.serviceWorker.getRegistration();
            if (registration) {
              await registration.showNotification('Test Notification', {
                body: 'This is a test notification from your settings.',
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png'
              });
            }
          }
      }
      
      toast({
        title: 'Test Notification Sent',
        description: 'Check your device for the test notification.',
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test notification. Please check your notification permissions.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">Notification Settings</h1>
        <p className="text-muted-foreground">
          Configure your daily notification schedule and preferences.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications-enabled">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Turn on all scheduled notifications
              </p>
            </div>
            <Switch
              id="notifications-enabled"
              checked={settings.enabled}
              onCheckedChange={(checked) => handleToggle('enabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="sound-enabled">Sound</Label>
              <p className="text-sm text-muted-foreground">
                Play sound with notifications
              </p>
            </div>
            <Switch
              id="sound-enabled"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => handleToggle('soundEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="vibration-enabled">Vibration</Label>
              <p className="text-sm text-muted-foreground">
                Vibrate device for notifications
              </p>
            </div>
            <Switch
              id="vibration-enabled"
              checked={settings.vibrationEnabled}
              onCheckedChange={(checked) => handleToggle('vibrationEnabled', checked)}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notification Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weight-time">Weight Tracking</Label>
                <p className="text-sm text-muted-foreground">
                  Log your weight before water intake
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="weight-time"
                  type="time"
                  value={settings.times.weightTracking}
                  onChange={(e) => handleTimeChange('weightTracking', e.target.value)}
                  className="w-24"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testNotification('weight-tracking')}
                >
                  Test
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="priority-time">Priority Review</Label>
                <p className="text-sm text-muted-foreground">
                  Set your top 3 priorities for the day
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="priority-time"
                  type="time"
                  value={settings.times.priorityReview}
                  onChange={(e) => handleTimeChange('priorityReview', e.target.value)}
                  className="w-24"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testNotification('priority-review')}
                >
                  Test
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="lunch-time">Lunch Logging</Label>
                <p className="text-sm text-muted-foreground">
                  Log your lunch meal and nutrition
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="lunch-time"
                  type="time"
                  value={settings.times.lunchLogging}
                  onChange={(e) => handleTimeChange('lunchLogging', e.target.value)}
                  className="w-24"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testNotification('meal-logging')}
                >
                  Test
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dinner-time">Dinner Logging</Label>
                <p className="text-sm text-muted-foreground">
                  Log your dinner meal and nutrition
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="dinner-time"
                  type="time"
                  value={settings.times.dinnerLogging}
                  onChange={(e) => handleTimeChange('dinnerLogging', e.target.value)}
                  className="w-24"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testNotification('meal-logging')}
                >
                  Test
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="water-time">Water Reminder</Label>
                <p className="text-sm text-muted-foreground">
                  Final water intake check for the day
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="water-time"
                  type="time"
                  value={settings.times.waterReminder}
                  onChange={(e) => handleTimeChange('waterReminder', e.target.value)}
                  className="w-24"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testNotification('water-reminder')}
                >
                  Test
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="journal-time">Evening Journal</Label>
                <p className="text-sm text-muted-foreground">
                  Reflect on your day and plan tomorrow
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  id="journal-time"
                  type="time"
                  value={settings.times.eveningJournal}
                  onChange={(e) => handleTimeChange('eveningJournal', e.target.value)}
                  className="w-24"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testNotification('evening-journal')}
                >
                  Test
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Snooze Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="snooze-enabled">Enable Snooze</Label>
              <p className="text-sm text-muted-foreground">
                Allow snoozing notifications
              </p>
            </div>
            <Switch
              id="snooze-enabled"
              checked={settings.snoozeEnabled}
              onCheckedChange={(checked) => handleToggle('snoozeEnabled', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="snooze-duration">Snooze Duration (minutes)</Label>
              <p className="text-sm text-muted-foreground">
                How long to snooze notifications
              </p>
            </div>
            <Input
              id="snooze-duration"
              type="number"
              min="1"
              max="60"
              value={settings.snoozeDuration}
              onChange={(e) => handleDurationChange(parseInt(e.target.value) || 10)}
              className="w-20"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4">
        <Button onClick={saveSettings} disabled={loading} className="flex-1">
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
        <Button variant="outline" onClick={loadSettings}>
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
} 