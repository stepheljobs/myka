'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import Typography from '@/components/ui/Typography';
import Link from 'next/link';
import NoSSR from '@/components/NoSSR';
import { notificationManager } from '@/lib/notification-manager';

export default function NotificationTestPage() {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState<'checking' | 'registered' | 'failed'>('checking');

  useEffect(() => {
    // Check notification permission status
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    // Initialize notification manager and check service worker
    const initializeNotifications = async () => {
      try {
        await notificationManager.initialize();
        setServiceWorkerStatus('registered');
      } catch (error) {
        console.error('Service Worker initialization failed:', error);
        setServiceWorkerStatus('failed');
      }
    };

    initializeNotifications();
  }, []);

  const handleRequestPermission = async () => {
    const permission = await notificationManager.requestPermission();
    setNotificationPermission(permission);
    addTestResult(`Permission request result: ${permission}`);
  };

  const handleTestNotification = async (type: 'morning' | 'hydration' | 'weight' | 'immediate') => {
    setIsTesting(true);
    try {
      switch (type) {
        case 'morning':
          await notificationManager.scheduleMorningNotification('00:01'); // 1 minute from now
          addTestResult('✅ Morning routine notification scheduled for 1 minute from now');
          break;
        case 'hydration':
          await notificationManager.showHydrationReminder();
          addTestResult('✅ Hydration reminder notification sent');
          break;
        case 'weight':
          await notificationManager.showWeightReminder();
          addTestResult('✅ Weight reminder notification sent');
          break;
        case 'immediate':
          // Test immediate notification
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification('Test Notification 🧪', {
              body: 'This is an immediate test notification',
              icon: '/icons/icon-192x192.png',
              badge: '/icons/icon-72x72.png',
              data: {
                type: 'test',
                timestamp: new Date().toISOString()
              }
            });
            addTestResult('✅ Immediate test notification sent');
          }
          break;
      }
    } catch (error) {
      console.error('Error testing notification:', error);
      addTestResult(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const addTestResult = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setTestResults(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)]);
  };

  const clearTestResults = () => {
    setTestResults([]);
  };

  return (
    <NoSSR fallback={
      <main className="min-h-screen bg-brutal-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-20">
            <Typography variant="h1" weight="bold" className="mb-4">
              🧪 Notification Testing
            </Typography>
            <Typography variant="body" className="text-brutal-gray">
              Loading...
            </Typography>
          </div>
        </div>
      </main>
    }>
      <main className="min-h-screen bg-brutal-white p-4">
        <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center mb-4 text-brutal-blue hover:underline">
            ← Back to Dashboard
          </Link>
          <Typography variant="h1" weight="bold" className="mb-2">
            🧪 Notification Testing
          </Typography>
          <Typography variant="body" className="text-brutal-gray">
            Test all notification types and see how they appear on your device
          </Typography>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-4">
            <Typography variant="h5" weight="bold" className="mb-2">
              🔔 Permission Status
            </Typography>
            <div className={`inline-flex items-center px-2 py-1 rounded text-sm ${
              notificationPermission === 'granted' ? 'bg-green-100 text-green-800' :
              notificationPermission === 'denied' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {notificationPermission === 'granted' ? '✅ Granted' :
               notificationPermission === 'denied' ? '❌ Denied' :
               '⚠️ Default'}
            </div>
          </Card>

          <Card className="p-4">
            <Typography variant="h5" weight="bold" className="mb-2">
              🔧 Service Worker
            </Typography>
            <div className={`inline-flex items-center px-2 py-1 rounded text-sm ${
              serviceWorkerStatus === 'registered' ? 'bg-green-100 text-green-800' :
              serviceWorkerStatus === 'failed' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {serviceWorkerStatus === 'registered' ? '✅ Registered' :
               serviceWorkerStatus === 'failed' ? '❌ Failed' :
               '🔄 Checking...'}
            </div>
          </Card>

          <Card className="p-4">
            <Typography variant="h5" weight="bold" className="mb-2">
              📱 Device Support
            </Typography>
            <div className={`inline-flex items-center px-2 py-1 rounded text-sm ${
              notificationManager?.isSupported() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {notificationManager?.isSupported() ? '✅ Supported' : '❌ Not Supported'}
            </div>
          </Card>
        </div>

        {/* Permission Request */}
        {notificationPermission === 'default' && (
          <Card className="p-6 mb-8 bg-yellow-50 border-brutal border-brutal-yellow">
            <Typography variant="h4" weight="bold" className="mb-4">
              ⚠️ Notification Permission Required
            </Typography>
            <Typography variant="body" className="mb-4">
              To test notifications, you need to grant permission. Click the button below to request permission.
            </Typography>
            <Button 
              variant="default" 
              size="lg" 
              onClick={handleRequestPermission}
            >
              Grant Notification Permission
            </Button>
          </Card>
        )}

        {notificationPermission === 'denied' && (
          <Card className="p-6 mb-8 bg-red-50 border-brutal border-brutal-red">
            <Typography variant="h4" weight="bold" className="mb-4">
              ❌ Notifications Blocked
            </Typography>
            <Typography variant="body" className="mb-4">
              Notifications are blocked by your browser. To test notifications:
            </Typography>
            <ul className="list-disc list-inside mb-4 space-y-2">
              <li>Click the lock/info icon in your browser&apos;s address bar</li>
              <li>Change notification permission from &quot;Block&quot; to &quot;Allow&quot;</li>
              <li>Refresh this page</li>
            </ul>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </Button>
          </Card>
        )}

        {/* Test Buttons */}
        {notificationPermission === 'granted' && (
          <Card className="p-6 mb-8">
            <Typography variant="h4" weight="bold" className="mb-4">
              🚀 Test Notifications
            </Typography>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                variant="default"
                onClick={() => handleTestNotification('immediate')}
                disabled={isTesting}
                className="flex flex-col items-center p-6 h-32"
              >
                <span className="text-3xl mb-2">🧪</span>
                <span className="font-medium">Immediate Test</span>
                <Typography variant="caption" className="text-brutal-gray-300">
                  Instant notification
                </Typography>
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => handleTestNotification('morning')}
                disabled={isTesting}
                className="flex flex-col items-center p-6 h-32"
              >
                <span className="text-3xl mb-2">🌅</span>
                <span className="font-medium">Morning Routine</span>
                <Typography variant="caption" className="text-brutal-gray-300">
                  1 minute delay
                </Typography>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleTestNotification('hydration')}
                disabled={isTesting}
                className="flex flex-col items-center p-6 h-32"
              >
                <span className="text-3xl mb-2">💧</span>
                <span className="font-medium">Hydration</span>
                <Typography variant="caption" className="text-brutal-gray-300">
                  Water reminder
                </Typography>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleTestNotification('weight')}
                disabled={isTesting}
                className="flex flex-col items-center p-6 h-32"
              >
                <span className="text-3xl mb-2">⚖️</span>
                <span className="font-medium">Weight</span>
                <Typography variant="caption" className="text-brutal-gray-300">
                  Progress tracking
                </Typography>
              </Button>
            </div>

            {isTesting && (
              <div className="mt-4 text-center p-3 bg-brutal-blue-50 border-brutal border-brutal-blue">
                <Typography variant="body" className="text-brutal-blue">
                  🔄 Sending notification...
                </Typography>
              </div>
            )}
          </Card>
        )}

        {/* Test Results */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="h4" weight="bold">
              📊 Test Results
            </Typography>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearTestResults}
              disabled={testResults.length === 0}
            >
              Clear Results
            </Button>
          </div>
          
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-brutal-gray">
              <Typography variant="body">
                No test results yet. Try sending a notification above!
              </Typography>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="p-2 bg-brutal-light-gray border-brutal border-brutal-black">
                  <Typography variant="caption" className="font-mono">
                    {result}
                  </Typography>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Instructions */}
        <Card className="p-6 mt-8 bg-blue-50 border-brutal border-brutal-blue">
          <Typography variant="h4" weight="bold" className="mb-4">
            📋 Testing Instructions
          </Typography>
          <div className="space-y-3">
            <div>
              <Typography variant="body" weight="medium" className="mb-1">
                For Best Results:
              </Typography>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Test on a real mobile device (not desktop browser)</li>
                <li>Make sure the app is installed on your device</li>
                <li>Allow notifications when prompted</li>
                <li>Try different notification types to see various behaviors</li>
                <li>Test with the app in background/foreground</li>
              </ul>
            </div>
            <div>
              <Typography variant="body" weight="medium" className="mb-1">
                Troubleshooting:
              </Typography>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>If notifications don&apos;t appear, check browser settings</li>
                <li>On iOS, notifications only work when the app is installed</li>
                <li>Some browsers require HTTPS for notifications</li>
                <li>Check the browser console for error messages</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </main>
    </NoSSR>
  );
} 