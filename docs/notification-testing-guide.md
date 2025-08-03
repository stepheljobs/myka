# Notification Testing Guide for MYKA App

This guide will help you test notifications in your MYKA Progressive Web App on real mobile devices.

## 🚀 Quick Start

### Option 1: Use the Built-in Test Page
1. Open your app in a mobile browser
2. Navigate to `/notification-test`
3. Follow the on-screen instructions

### Option 2: Use the Settings Page
1. Go to Settings > Morning Routine
2. Scroll down to the "Test Notifications" section
3. Use the test buttons provided

### Option 3: Run the Test Script
```bash
npm run test:notifications
```

## 📱 Prerequisites

Before testing notifications, ensure you have:

- ✅ **Real Mobile Device**: Notifications work best on actual mobile devices
- ✅ **App Installation**: App must be installed on your device
- ✅ **HTTPS Connection**: Required for notifications (localhost works for development)
- ✅ **Browser Permissions**: Notifications must be allowed in browser settings
- ✅ **Service Worker**: Must be registered and active

## 🔔 Testing Different Notification Types

### 1. Immediate Test Notification
- **Purpose**: Basic functionality test
- **Behavior**: Shows instantly when triggered
- **Use Case**: Verify notification system is working

### 2. Morning Routine Notification
- **Purpose**: Test scheduled notifications
- **Behavior**: Scheduled for 1 minute from trigger
- **Use Case**: Test delayed notification functionality

### 3. Hydration Reminder
- **Purpose**: Test app-specific notifications
- **Behavior**: Shows water intake reminder
- **Use Case**: Test contextual notifications

### 4. Weight Reminder
- **Purpose**: Test progress tracking notifications
- **Behavior**: Shows weight logging reminder
- **Use Case**: Test different notification content

## 🔄 Testing Scenarios

### Scenario 1: App in Foreground
1. Open the app
2. Send a test notification
3. **Expected**: Notification appears in-app or as a banner

### Scenario 2: App in Background
1. Open the app
2. Minimize the app (don't close it)
3. Send a test notification
4. **Expected**: System notification appears

### Scenario 3: App Closed
1. Close the app completely
2. Send a test notification
3. **Expected**: System notification appears

### Scenario 4: Device Locked
1. Lock your device
2. Send a test notification
3. **Expected**: Notification appears on lock screen (if enabled)

## 📊 Monitoring and Debugging

### Check Test Results
The notification test page includes a results section that shows:
- ✅ Successful notifications
- ❌ Failed notifications
- ⏰ Timestamps
- 🔍 Error messages

### Browser Console
Open browser developer tools and check the console for:
- Service worker registration status
- Permission status
- Error messages
- Debug information

### Service Worker Status
Check if the service worker is properly registered:
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations);
});
```

## 🔧 Troubleshooting

### Notifications Not Appearing

#### 1. Check Browser Settings
- **Chrome**: Settings > Site Settings > Notifications
- **Safari**: Settings > Safari > Notifications
- **Firefox**: Settings > Privacy & Security > Permissions > Notifications

#### 2. Check Device Settings
- **iOS**: Settings > Notifications > Safari > Allow Notifications
- **Android**: Settings > Apps > Browser > Notifications

#### 3. Check HTTPS
- Notifications require HTTPS in production
- Use `localhost` for development testing
- Ensure no mixed content warnings

#### 4. Check Service Worker
- Open browser dev tools > Application > Service Workers
- Ensure service worker is registered and active
- Check for any errors in the service worker

### Common Error Messages

#### "Service Worker not registered"
- The service worker failed to register
- Check browser console for specific errors
- Ensure the service worker file exists at `/sw-morning-routine.js`

#### "Notifications are blocked"
- Browser or device settings are blocking notifications
- Follow the troubleshooting steps above

#### "Permission denied"
- User denied notification permission
- Reset permissions in browser settings
- Try requesting permission again

## 🧪 Advanced Testing

### Programmatic Testing
You can test notifications directly in the browser console:

```javascript
// Check permission status
console.log(Notification.permission);

// Request permission
Notification.requestPermission().then(permission => {
  console.log('Permission:', permission);
});

// Test immediate notification
new Notification('Test', { 
  body: 'Hello World!',
  icon: '/icons/icon-192x192.png'
});

// Check service worker
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations);
});
```

### Testing Notification Actions
The morning routine notifications include action buttons:
- **Log Weight**: Opens weight tracking page
- **Drink Water**: Opens water tracking page
- **Snooze**: Schedules notification for 10 minutes later

Test these actions by:
1. Sending a morning routine notification
2. Clicking the action buttons
3. Verifying the correct pages open

## 📱 Platform-Specific Notes

### iOS
- Notifications only work when the app is installed on your device
- Requires user interaction to request permission
- Limited to Safari browser
- May require enabling notifications in iOS Settings

### Android
- Works with Chrome, Firefox, and other Chromium-based browsers
- More flexible permission handling
- Better background notification support
- Can show notifications even when app is closed

### Desktop
- Limited testing value for mobile app
- Good for development and debugging
- May behave differently than mobile devices

## 🎯 Best Practices

### For Development
1. Test on real devices, not just simulators
2. Use different browsers (Chrome, Safari, Firefox)
3. Test both foreground and background scenarios
4. Monitor console for errors
5. Test with different network conditions

### For Production
1. Test on multiple device types and OS versions
2. Verify notifications work with app updates
3. Test notification actions thoroughly
4. Monitor notification delivery rates
5. Handle edge cases (no internet, app updates, etc.)

## 📝 Testing Checklist

Use this checklist to ensure comprehensive testing:

- [ ] App installed on device
- [ ] Notifications permission granted
- [ ] HTTPS connection (or localhost)
- [ ] Service worker registered
- [ ] Test immediate notification
- [ ] Test delayed notification
- [ ] Test with app in foreground
- [ ] Test with app in background
- [ ] Test with app closed
- [ ] Test notification actions
- [ ] Test on different browsers
- [ ] Test on different devices
- [ ] Check error logs
- [ ] Verify notification content
- [ ] Test notification timing

## 🆘 Getting Help

If you encounter issues:

1. **Check the browser console** for error messages
2. **Verify all prerequisites** are met
3. **Test on a different device/browser**
4. **Check the troubleshooting section** above
5. **Review the service worker code** in `/public/sw-morning-routine.js`
6. **Check the notification manager** in `/src/lib/notification-manager.ts`

## 🔗 Related Files

- `/src/app/notification-test/page.tsx` - Main test page
- `/src/app/settings/morning-routine/page.tsx` - Settings with test section
- `/src/lib/notification-manager.ts` - Notification management
- `/public/sw-morning-routine.js` - Service worker
- `/scripts/test-notifications.js` - Test script

---

**Happy Testing! 🧪✨** 