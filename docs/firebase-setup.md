# Firebase Setup Guide

## Prerequisites

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password provider
3. Create a Firestore database

## Configuration Steps

### 1. Get Firebase Configuration

1. Go to Project Settings in Firebase Console
2. Scroll down to "Your apps" section
3. Click on the web app icon or create a new web app
4. Copy the configuration object

### 2. Set Environment Variables

Create a `.env.local` file in the project root with your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Enable Authentication

1. Go to Authentication > Sign-in method in Firebase Console
2. Enable "Email/Password" provider
3. Optionally enable "Email link (passwordless sign-in)"

### 4. Set up Firestore Security Rules

1. Go to Firestore Database > Rules in Firebase Console
2. Replace the default rules with the content from `firestore.rules`
3. Publish the rules

### 5. Deploy Security Rules (Optional)

If you want to deploy rules via Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore
firebase deploy --only firestore:rules
```

## Development with Emulators (Optional)

For local development, you can use Firebase emulators:

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize emulators: `firebase init emulators`
3. Start emulators: `firebase emulators:start`
4. The app will automatically connect to emulators in development mode

## Security Rules Explanation

The `firestore.rules` file implements the following security:

- **Users Collection**: Users can only read/write their own user document
- **User Data Collection**: Users can only access data where they are the owner
- **App Data Collection**: Users can only access app data they created
- **Public Collection**: All authenticated users can read, no writes allowed

## Testing

Run the authentication service tests:

```bash
npm test src/lib/__tests__/auth-service.test.ts
```

## Troubleshooting

### Common Issues

1. **"Firebase: Error (auth/configuration-not-found)"**
   - Check that all environment variables are set correctly
   - Ensure the Firebase project is properly configured

2. **"Firebase: Error (auth/network-request-failed)"**
   - Check internet connection
   - Verify Firebase project is active

3. **"Permission denied" errors in Firestore**
   - Verify security rules are deployed
   - Check that user is authenticated
   - Ensure user is accessing their own data

### Debug Mode

To enable Firebase debug logging, add to your environment:

```env
NEXT_PUBLIC_FIREBASE_DEBUG=true
```