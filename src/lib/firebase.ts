import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'demo-project.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'demo-project.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:123456789:web:abcdef123456',
};

// Initialize Firebase only if we have valid configuration or are in development
const hasValidConfig = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let app: any = null;
let auth: any = null;
let db: any = null;

if (hasValidConfig || process.env.NODE_ENV === 'development') {
  // Initialize Firebase
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  
  // Initialize Firebase Authentication and get a reference to the service
  auth = getAuth(app);
  
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(app);
} else {
  // Create mock objects for build time
  auth = {
    currentUser: null,
    onAuthStateChanged: () => () => {},
  };
  db = {};
}

// Export auth and db
export { auth, db };

// Connect to emulators in development
// if (process.env.NODE_ENV === 'development' && hasValidConfig && auth && db) {
//   // Only connect to emulators if not already connected
//   try {
//     // Check if auth emulator is already connected by trying to connect
//     // This will throw an error if already connected
//     connectAuthEmulator(auth, 'http://localhost:9099');
//   } catch (error) {
//     // Emulator already connected or connection failed
//     console.log('Auth emulator connection skipped:', error);
//   }
  
//   try {
//     // Check if firestore emulator is already connected
//     connectFirestoreEmulator(db, 'localhost', 8080);
//   } catch (error) {
//     // Emulator already connected or connection failed
//     console.log('Firestore emulator connection skipped:', error);
//   }
// }

export default app;