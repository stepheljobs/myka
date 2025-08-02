'use client';

import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Grid from '@/components/ui/Grid';
import { useState, useEffect } from 'react';
import { notificationManager } from '@/lib/notification-manager';

function MorningRoutineSettingsContent() {
  const { state } = useAuth();
  const [wakeUpTime, setWakeUpTime] = useState('06:00');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [snoozeEnabled, setSnoozeEnabled] = useState(true);
  const [snoozeDuration, setSnoozeDuration] = useState(10);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isTestingNotification, setIsTestingNotification] = useState(false);

  useEffect(() => {
    // Check notification permission status
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Initialize notification manager
    notificationManager.initialize();
  }, []);

  const handleRequestNotificationPermission = async () => {
    const permission = await notificationManager.requestPermission();
    setNotificationPermission(permission);
  };

  const handleTestNotification = async (type: 'morning' | 'hydration' | 'weight') => {
    setIsTestingNotification(true);
    try {
      switch (type) {
        case 'morning':
          await notificationManager.scheduleMorningNotification('00:01'); // Schedule for 1 minute from now
          break;
        case 'hydration':
          await notificationManager.showHydrationReminder();
          break;
        case 'weight':
          await notificationManager.showWeightReminder();
          break;
      }
    } catch (error) {
      console.error('Error testing notification:', error);
    } finally {
      setIsTestingNotification(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/morning-routine/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wakeUpTime,
          enabled: notificationsEnabled,
          tasks: [
            {
              id: 'weight-tracking',
              type: 'weight',
              title: 'Log Weight',
              description: 'Track your daily weight',
              icon: '⚖️',
              enabled: true,
              order: 1,
            },
            {
              id: 'water-intake',
              type: 'water',
              title: 'Drink Water',
              description: 'Stay hydrated',
              icon: '💧',
              enabled: true,
              order: 2,
            },
          ],
          notificationSettings: {
            enabled: notificationsEnabled,
            sound: soundEnabled,
            vibration: vibrationEnabled,
            snoozeEnabled,
            snoozeDuration,
          },
        }),
      });

      if (response.ok) {
        // Schedule notification if enabled
        if (notificationsEnabled && notificationPermission === 'granted') {
          await notificationManager.scheduleMorningNotification(wakeUpTime);
        }
        
        // TODO: Add success notification
        console.log('Settings saved successfully');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <main className="min-h-screen bg-brutal-white">
      {/* Header */}
      <header className="bg-brutal-white border-b-brutal border-brutal-black shadow-brutal-sm">
        <div className="brutal-container py-4">
          <div className="flex items-center justify-between">
            <div>
              <Typography variant="h3" weight="bold">
                Morning Routine Settings
              </Typography>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="default" size="sm" onClick={handleSaveSettings}>
                Save Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="brutal-container py-brutal-lg">
        {/* Notification Permission */}
        {notificationPermission !== 'granted' && (
          <Card className="p-6 mb-brutal-lg">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="h5" weight="bold" className="mb-2">
                  🔔 Enable Notifications
                </Typography>
                <Typography variant="body" className="text-brutal-gray">
                  Allow notifications to receive morning routine reminders
                </Typography>
              </div>
              <Button
                variant="secondary"
                size="lg"
                onClick={handleRequestNotificationPermission}
              >
                Enable Notifications
              </Button>
            </div>
          </Card>
        )}

        {/* Wake Up Time */}
        <Card className="p-6 mb-brutal-lg">
          <Typography variant="h4" weight="bold" className="mb-4">
            ⏰ Wake Up Time
          </Typography>
          
          <div className="space-y-4">
            <div>
              <Typography variant="body" weight="medium" className="mb-2">
                When do you want to receive your morning notification?
              </Typography>
              <input
                type="time"
                value={wakeUpTime}
                onChange={(e) => setWakeUpTime(e.target.value)}
                className="px-3 py-2 border-brutal border-brutal-black bg-brutal-white focus:outline-none focus:ring-2 focus:ring-brutal-blue"
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 mb-brutal-lg">
          <Typography variant="h4" weight="bold" className="mb-4">
            🔔 Notification Settings
          </Typography>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-brutal-light-gray border-brutal border-brutal-black">
              <div>
                <Typography variant="body" weight="medium">
                  Enable Morning Notifications
                </Typography>
                <Typography variant="caption" className="text-brutal-gray">
                  Receive daily morning routine reminders
                </Typography>
              </div>
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
                className="w-5 h-5 border-brutal border-brutal-black"
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-brutal-light-gray border-brutal border-brutal-black">
              <div>
                <Typography variant="body" weight="medium">
                  Sound Notifications
                </Typography>
                <Typography variant="caption" className="text-brutal-gray">
                  Play sound when notification arrives
                </Typography>
              </div>
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                disabled={!notificationsEnabled}
                className="w-5 h-5 border-brutal border-brutal-black"
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-brutal-light-gray border-brutal border-brutal-black">
              <div>
                <Typography variant="body" weight="medium">
                  Vibration
                </Typography>
                <Typography variant="caption" className="text-brutal-gray">
                  Vibrate device when notification arrives
                </Typography>
              </div>
              <input
                type="checkbox"
                checked={vibrationEnabled}
                onChange={(e) => setVibrationEnabled(e.target.checked)}
                disabled={!notificationsEnabled}
                className="w-5 h-5 border-brutal border-brutal-black"
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-brutal-light-gray border-brutal border-brutal-black">
              <div>
                <Typography variant="body" weight="medium">
                  Snooze Notifications
                </Typography>
                <Typography variant="caption" className="text-brutal-gray">
                  Allow snoozing notifications
                </Typography>
              </div>
              <input
                type="checkbox"
                checked={snoozeEnabled}
                onChange={(e) => setSnoozeEnabled(e.target.checked)}
                disabled={!notificationsEnabled}
                className="w-5 h-5 border-brutal border-brutal-black"
              />
            </div>
            
            {snoozeEnabled && (
              <div className="p-3 bg-brutal-light-gray border-brutal border-brutal-black">
                <Typography variant="body" weight="medium" className="mb-2">
                  Snooze Duration (minutes)
                </Typography>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={snoozeDuration}
                  onChange={(e) => setSnoozeDuration(parseInt(e.target.value))}
                  className="px-3 py-2 border-brutal border-brutal-black bg-brutal-white focus:outline-none focus:ring-2 focus:ring-brutal-blue"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Test Notifications Section */}
        <Card className="p-6 mb-brutal-lg">
          <Typography variant="h4" weight="bold" className="mb-4">
            🧪 Test Notifications
          </Typography>
          
          <Typography variant="body" className="mb-4 text-brutal-gray">
            Test how notifications will appear on your device. Make sure to allow notifications when prompted.
          </Typography>

          {notificationPermission === 'default' && (
            <div className="mb-4 p-3 bg-brutal-yellow-50 border-brutal border-brutal-yellow">
              <Typography variant="body" weight="medium" className="mb-2">
                ⚠️ Notification Permission Required
              </Typography>
              <Typography variant="caption" className="text-brutal-gray">
                You need to grant notification permission to test notifications.
              </Typography>
              <Button 
                variant="default" 
                size="sm" 
                onClick={handleRequestNotificationPermission}
                className="mt-2"
              >
                Grant Permission
              </Button>
            </div>
          )}

          {notificationPermission === 'denied' && (
            <div className="mb-4 p-3 bg-brutal-red-50 border-brutal border-brutal-red">
              <Typography variant="body" weight="medium" className="mb-2">
                ❌ Notifications Blocked
              </Typography>
              <Typography variant="caption" className="text-brutal-gray">
                Notifications are blocked. Please enable them in your browser settings.
              </Typography>
            </div>
          )}

          {notificationPermission === 'granted' && (
            <div className="space-y-3">
              <Typography variant="body" weight="medium" className="mb-3">
                Click any button below to test notifications:
              </Typography>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button
                  variant="default"
                  onClick={() => handleTestNotification('morning')}
                  disabled={isTestingNotification}
                  className="flex flex-col items-center p-4"
                >
                  <span className="text-2xl mb-1">🌅</span>
                  <span>Morning Routine</span>
                  <Typography variant="caption" className="text-brutal-gray-300">
                    (1 min delay)
                  </Typography>
                </Button>
                
                <Button
                  variant="secondary"
                  onClick={() => handleTestNotification('hydration')}
                  disabled={isTestingNotification}
                  className="flex flex-col items-center p-4"
                >
                  <span className="text-2xl mb-1">💧</span>
                  <span>Hydration Reminder</span>
                  <Typography variant="caption" className="text-brutal-gray-300">
                    (Immediate)
                  </Typography>
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => handleTestNotification('weight')}
                  disabled={isTestingNotification}
                  className="flex flex-col items-center p-4"
                >
                  <span className="text-2xl mb-1">⚖️</span>
                  <span>Weight Reminder</span>
                  <Typography variant="caption" className="text-brutal-gray-300">
                    (Immediate)
                  </Typography>
                </Button>
              </div>

              {isTestingNotification && (
                <div className="text-center p-3 bg-brutal-blue-50 border-brutal border-brutal-blue">
                  <Typography variant="body" className="text-brutal-blue">
                    🔄 Testing notification...
                  </Typography>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Routine Tasks */}
        <Card className="p-6 mb-brutal-lg">
          <Typography variant="h4" weight="bold" className="mb-4">
            📋 Routine Tasks
          </Typography>
          
          <div className="space-y-3">
            <div className="p-3 bg-brutal-light-gray border-brutal border-brutal-black">
              <div className="flex items-center space-x-3">
                <Typography variant="h4">⚖️</Typography>
                <div className="flex-1">
                  <Typography variant="body" weight="medium">
                    Log Weight
                  </Typography>
                  <Typography variant="caption" className="text-brutal-gray">
                    Track your daily weight
                  </Typography>
                </div>
                <span className="text-brutal-green">✅ Enabled</span>
              </div>
            </div>
            
            <div className="p-3 bg-brutal-light-gray border-brutal border-brutal-black">
              <div className="flex items-center space-x-3">
                <Typography variant="h4">💧</Typography>
                <div className="flex-1">
                  <Typography variant="body" weight="medium">
                    Drink Water
                  </Typography>
                  <Typography variant="caption" className="text-brutal-gray">
                    Stay hydrated
                  </Typography>
                </div>
                <span className="text-brutal-green">✅ Enabled</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="text-center">
          <Button
            variant="default"
            size="lg"
            onClick={handleSaveSettings}
            className="px-8"
          >
            Save Settings
          </Button>
        </div>
      </div>
    </main>
  );
}

export default function MorningRoutineSettingsPage() {
  return (
    <ProtectedRoute>
      <MorningRoutineSettingsContent />
    </ProtectedRoute>
  );
} 