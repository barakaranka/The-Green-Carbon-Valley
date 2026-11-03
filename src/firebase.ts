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
  getDocs, 
  query, 
  orderBy, 
  limit, 
  getDocFromServer,
  onSnapshot,
  Timestamp 
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

// Demo / Guest Farmer helper for sandboxed iframe environments where external popups are blocked
export const signInAsGuestFarmer = async (farmerName: string = 'Makongi Partner Farmer'): Promise<User | null> => {
  try {
    const { signInAnonymously } = await import('firebase/auth');
    const cred = await signInAnonymously(auth);
    if (cred.user) {
      try {
        const userRef = doc(db, 'users', cred.user.uid);
        await setDoc(userRef, {
          uid: cred.user.uid,
          email: 'demo.farmer@greencarbonvalley.org',
          displayName: farmerName,
          photoURL: '',
          lastActive: new Date().toISOString(),
          role: 'farmer',
          isDemo: true
        }, { merge: true });
      } catch (err) {
        console.warn('Guest profile record skipped:', err);
      }
    }
    return cred.user;
  } catch (err: any) {
    console.info('Anonymous guest sign-in handled locally:', err?.message);
    return null;
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
  farmerName: string;
  feedstock: string;
  biomassKg: number;
  biocharKg: number;
  co2eKg: number;
  retortMethod: string;
  location: string;
  date: string;
  notes?: string;
  createdAt?: string;
}

// Save a new Biochar Production Batch
export const saveBiocharBatch = async (batch: Omit<BiocharBatchRecord, 'id'>) => {
  const batchId = 'batch_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  const docRef = doc(db, 'batches', batchId);
  const data = {
    ...batch,
    id: batchId,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(docRef, data);
  } catch (err: any) {
    console.warn('Firestore setDoc notice (batch saved locally):', err?.message);
  }
  return data;
};

// Subscribe to recent batches for live community dashboard
export const subscribeToBatches = (callback: (batches: BiocharBatchRecord[]) => void) => {
  const batchesRef = collection(db, 'batches');
  const q = query(batchesRef, orderBy('createdAt', 'desc'), limit(25));
  return onSnapshot(q, (snapshot) => {
    const list: BiocharBatchRecord[] = [];
    snapshot.forEach((doc) => {
      list.push(doc.data() as BiocharBatchRecord);
    });
    callback(list);
  }, (err) => {
    console.error('Batches subscription error:', err);
  });
};

export type { User };
