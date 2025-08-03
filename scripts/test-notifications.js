#!/usr/bin/env node

/**
 * Notification Testing Script
 * 
 * This script helps test notifications in your MYKA app.
 * Run this script to get testing instructions and simulate different scenarios.
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log(`
🧪 MYKA Notification Testing Guide
=====================================

This guide will help you test notifications in your mobile app.

📱 STEP 1: Setup Your Testing Environment
----------------------------------------
1. Make sure your app is running on a real mobile device
2. Install the app on your device
3. Grant notification permissions when prompted
4. Ensure you're using HTTPS (required for notifications)

🔔 STEP 2: Test Different Notification Types
-------------------------------------------
1. Open your app and navigate to: /notification-test
2. Or go to Settings > Morning Routine and use the test section
3. Test these notification types:

   a) Immediate Test Notification
      - Shows instantly
      - Good for basic functionality testing
   
   b) Morning Routine Notification
      - Scheduled for 1 minute from now
      - Tests delayed notifications
   
   c) Hydration Reminder
      - Water intake reminder
      - Tests app-specific notifications
   
   d) Weight Reminder
      - Progress tracking reminder
      - Tests different notification content

🔄 STEP 3: Test Different Scenarios
-----------------------------------
1. App in Foreground:
   - Send notification while app is open
   - Should show in-app notification

2. App in Background:
   - Send notification, then minimize app
   - Should show system notification

3. App Closed:
   - Close app completely, then send notification
   - Should show system notification

4. Device Locked:
   - Lock device, then send notification
   - Should show on lock screen (if enabled)

📊 STEP 4: Check Results
-------------------------
- Monitor the test results section in the app
- Check browser console for any errors
- Verify notifications appear as expected
- Test notification actions (if implemented)

🔧 STEP 5: Troubleshooting
---------------------------
If notifications don't work:

1. Check Browser Settings:
   - Go to browser settings > Site Settings > Notifications
   - Ensure your site is allowed

2. Check Device Settings:
   - iOS: Settings > Notifications > Safari > Allow Notifications
   - Android: Settings > Apps > Browser > Notifications

3. Check HTTPS:
   - Notifications require HTTPS in production
   - Use localhost for development testing

4. Check Service Worker:
   - Open browser dev tools > Application > Service Workers
   - Ensure service worker is registered and active

5. Check Console Errors:
   - Open browser dev tools > Console
   - Look for any error messages

🚀 Quick Test Commands
-----------------------
You can also test notifications programmatically:

1. Open browser console and run:
   \`\`\`javascript
   // Test immediate notification
   new Notification('Test', { body: 'Hello World!' });
   
   // Check permission status
   console.log(Notification.permission);
   
   // Request permission
   Notification.requestPermission();
   \`\`\`

2. Test service worker:
   \`\`\`javascript
   // Check if service worker is registered
   navigator.serviceWorker.getRegistrations().then(registrations => {
     console.log('Service Workers:', registrations);
   });
   \`\`\`

📝 Testing Checklist
--------------------
□ App installed on device
□ Notifications permission granted
□ HTTPS connection (or localhost)
□ Service worker registered
□ Test immediate notification
□ Test delayed notification
□ Test with app in background
□ Test with app closed
□ Test notification actions
□ Check error logs

Need help? Check the browser console for detailed error messages.
`);

rl.question('\nPress Enter to exit...', () => {
  rl.close();
}); 