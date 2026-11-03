import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  signOut, 
  GoogleAuthProvider, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  query, 
  orderBy, 
  limit, 
  getDocFromServer,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firestore (with named database if provided)
export const db = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test connectivity as per Firebase skill guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing.');
    }
  }
}
testConnection();

// Auth concurrency lock & status
let isSigningIn = false;

// Safe Google Sign-In with mutex lock and graceful popup rejection handling
export const signInWithGoogle = async (): Promise<User | null> => {
  if (isSigningIn) {
    console.info('Google sign-in already in progress, ignoring duplicate trigger.');
    return auth.currentUser;
  }

  isSigningIn = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Upsert user profile document
    if (result.user) {
      try {
        const userRef = doc(db, 'users', result.user.uid);
        await setDoc(userRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName || 'Farmer / Partner',
          photoURL: result.user.photoURL || '',
          lastActive: new Date().toISOString(),
          role: 'farmer'
        }, { merge: true });
      } catch (profileErr) {
        console.warn('User profile sync skipped:', profileErr);
      }
    }
    return result.user;
  } catch (err: any) {
    const code = err?.code || '';
    // Gracefully handle standard browser / user actions in iframe previews
    if (
      code === 'auth/popup-closed-by-user' ||
      code === 'auth/cancelled-popup-request' ||
      code === 'auth/popup-blocked'
    ) {
      console.info(`Google sign-in popup dismissed or cancelled (${code}). Handled cleanly without app interruption.`);
      return auth.currentUser || null;
    }
    console.warn('Google sign-in notice:', err?.message || err);
    return auth.currentUser || null;
  } finally {
    isSigningIn = false;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.warn('Sign-out warning:', err);
  }
};

export interface BiocharBatchRecord {
  id: string;
  userId: string;
  /** Group name or first name, shown publicly with consent. */
  farmerName: string;
  /** Feedstock id from content.ts (older records may hold free text). */
  feedstock: string;
  /** Dry leftovers in, kg. */
  biomassKg: number;
  /** Biochar out, kg, weighed. */
  biocharKg: number;
  /** Estimated CO2 kept in the soil, kg (from content.ts factors). */
  co2eKg: number;
  /** Kiln used. */
  retortMethod: string;
  /** Village or ward. */
  location: string;
  date: string;
  notes?: string;
  consentPublic?: boolean;
  createdAt?: string;
}

/** Saves a batch. Throws if it could not be saved, so the page can say so. */
export const saveBiocharBatch = async (batch: Omit<BiocharBatchRecord, 'id' | 'createdAt'>) => {
  const batchId = 'batch_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const data: BiocharBatchRecord = { ...batch, id: batchId, createdAt: new Date().toISOString() };
  await setDoc(doc(db, 'batches', batchId), data);
  return data;
};

/** Live list of the most recent batches. onError is called if the log can't be read. */
export const subscribeToBatches = (
  callback: (batches: BiocharBatchRecord[], fromCache: boolean) => void,
  onError?: (err: unknown) => void,
) => {
  const q = query(collection(db, 'batches'), orderBy('createdAt', 'desc'), limit(100));
  return onSnapshot(
    q,
    (snapshot) =>
      callback(
        snapshot.docs.map((d) => d.data() as BiocharBatchRecord),
        snapshot.metadata.fromCache,
      ),
    (err) => {
      console.error('Batches subscription error:', err);
      onError?.(err);
    },
  );
};

export type { User };
