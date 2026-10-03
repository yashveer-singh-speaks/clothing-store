/**
 * Firebase Adapter & Configuration Boundary (Section 1 & Section 26)
 * Connects to Firebase Authentication, Firestore, and Cloud Storage when merchant credentials
 * are configured in `.env.local`. Automatically provides a deterministic local fallback
 * via `src/lib/db.ts` (`data.json`) when running in local/offline evaluation mode.
 */

export interface FirebaseConfigStatus {
  configured: boolean;
  projectId: string | null;
  authDomain: string | null;
  storageBucket: string | null;
  region: string;
  mode: 'firebase_cloud' | 'local_transactional_ledger';
}

export function getFirebaseConfigStatus(): FirebaseConfigStatus {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const configured = Boolean(apiKey && projectId && apiKey !== 'your_api_key_here');

  return {
    configured,
    projectId: projectId || 'karigar-india-store-local',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || null,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || null,
    region: process.env.FIREBASE_REGION || 'asia-south1 (Mumbai)',
    mode: configured ? 'firebase_cloud' : 'local_transactional_ledger',
  };
}

export const firebaseClientConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
};
