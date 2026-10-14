import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../.env.local');

console.log('--- Checking .env.local file ---');
if (!fs.existsSync(envPath)) {
  console.error('.env.local file not found at:', envPath);
  process.exit(1);
}

const rawContent = fs.readFileSync(envPath, 'utf8');
const lines = rawContent.split(/\r?\n/);
const parsedEnv = {};

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx !== -1) {
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    // Check quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    parsedEnv[key] = val;
  }
}

console.log('Parsed Keys from .env.local:');
for (const [k, v] of Object.entries(parsedEnv)) {
  if (k.includes('KEY')) {
    console.log(`  ${k}: ${v.slice(0, 8)}... (${v.length} chars)`);
  } else {
    console.log(`  ${k}: "${v}"`);
  }
}

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, collection, getDocs, setDoc, deleteDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: parsedEnv.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: parsedEnv.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: parsedEnv.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: parsedEnv.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: parsedEnv.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: parsedEnv.NEXT_PUBLIC_FIREBASE_APP_ID
};

console.log('\n--- Initializing Firebase App ---');
try {
  const app = initializeApp(firebaseConfig);
  console.log('Firebase App initialized successfully:', app.name);

  const auth = getAuth(app);
  console.log('Firebase Auth initialized.');

  const db = getFirestore(app);
  console.log('Firestore initialized.');

  // Test Firebase Auth API Key by attempting a dummy sign-in
  console.log('\n--- Testing Firebase Authentication API Key ---');
  try {
    await signInWithEmailAndPassword(auth, 'test_nonexistent_user@codearena.test', 'WrongPassword123!');
  } catch (authError) {
    console.log('Auth check code:', authError.code);
    console.log('Auth check message:', authError.message);
    if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
      console.log('>>> [SUCCESS] Firebase Auth API Key is valid and Auth service is responding!');
    } else if (authError.code === 'auth/api-key-not-valid.invalid-api-key' || authError.code === 'auth/invalid-api-key') {
      console.error('>>> [FAILED] Firebase API Key is invalid!');
    } else if (authError.code === 'auth/operation-not-allowed') {
      console.warn('>>> [WARNING] Email/Password provider is NOT enabled in Firebase Console!');
    } else {
      console.log('>>> Auth result note:', authError.code);
    }
  }

  // Test Firestore Connection
  console.log('\n--- Testing Firestore Database Connection ---');
  try {
    // Attempt to read from 'problems' or 'users'
    const testDoc = await getDoc(doc(db, 'problems', 'test_ping_doc'));
    console.log('Firestore read ping result: exists =', testDoc.exists());
    console.log('>>> [SUCCESS] Firestore is reachable and active!');
  } catch (fsError) {
    console.error('Firestore ping error code:', fsError.code);
    console.error('Firestore ping error message:', fsError.message);
    if (fsError.code === 'permission-denied') {
      console.log('>>> [INFO] Firestore is ACTIVE, but Security Rules rejected unauthenticated read.');
      console.log('    (This is expected if your firestore.rules require isAuthenticated())');
    } else if (fsError.code === 'not-found') {
      console.error('>>> [FAILED] Firestore database does not exist. You may need to click "Create Database" in Firebase Console.');
    } else {
      console.log('>>> Firestore error details:', fsError.code);
    }
  }

} catch (err) {
  console.error('Initialization error:', err);
}

process.exit(0);
