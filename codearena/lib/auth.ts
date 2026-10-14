import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserProfile, UserRole } from '../types';
import { auth, db, isFirebaseConfigured } from './firebase';
import { dataService } from './services';

const normalizeEmail = (email: string) => email.trim().toLowerCase();

export interface RegistrationInput {
  name: string;
  email: string;
  password: string;
  department: string;
  batch: string;
  // Public registration is restricted to 'student'. Any role provided is ignored.
  role?: UserRole;
}

export async function registerUser(input: RegistrationInput): Promise<UserProfile> {
  const name = input.name.trim();
  const email = normalizeEmail(input.email);
  const password = input.password;

  if (!name || !email || !password || !input.department || !input.batch) {
    throw new Error('Please complete all required fields.');
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.');
  }
  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  // Security Requirement: Public registration is strictly restricted to 'student'.
  // Users cannot self-assign faculty or admin roles.
  const assignedRole: UserRole = 'student';

  if (isFirebaseConfigured() && auth && db) {
    // 1. Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const profile: UserProfile = {
      uid,
      email,
      name,
      role: assignedRole,
      department: input.department,
      batch: input.batch,
      rating: 1500,
      solvedProblems: [],
      status: 'active',
      createdAt: new Date().toISOString(),
      stats: {
        problemsSolved: 0,
        accuracy: 100,
        streak: 0,
        rank: 99
      }
    };

    // 2. Persist profile to Firestore users/{uid}
    await setDoc(doc(db, 'users', uid), profile);
    return profile;
  }

  // Fallback ONLY in local development when Firebase variables are not set
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Firebase is not configured in this production environment. Please provide NEXT_PUBLIC_FIREBASE_* credentials.'
    );
  }

  console.warn(
    '[Auth DEV Fallback] Registering user locally because Firebase credentials are not set in .env.local'
  );
  const devProfile: UserProfile = {
    uid: `user_${Date.now()}`,
    email,
    name,
    role: assignedRole,
    department: input.department,
    batch: input.batch,
    rating: 1500,
    solvedProblems: [],
    status: 'active',
    createdAt: new Date().toISOString(),
    stats: { problemsSolved: 0, accuracy: 100, streak: 0, rank: 99 }
  };
  await dataService.addUser(devProfile);
  await dataService.setCurrentUser(devProfile);
  return devProfile;
}

export async function authenticateUser(emailInput: string, password: string): Promise<UserProfile> {
  const email = normalizeEmail(emailInput);
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  if (isFirebaseConfigured() && auth && db) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userDocRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userDocRef);

    if (!userSnap.exists()) {
      // If profile document is missing in Firestore, create basic student profile
      const newProfile: UserProfile = {
        uid,
        email,
        name: userCredential.user.displayName || email.split('@')[0],
        role: 'student',
        department: 'Artificial Intelligence & Data Science',
        batch: '2025',
        rating: 1500,
        solvedProblems: [],
        status: 'active',
        createdAt: new Date().toISOString(),
        stats: { problemsSolved: 0, accuracy: 100, streak: 0 }
      };
      await setDoc(userDocRef, newProfile);
      return newProfile;
    }

    const profile = userSnap.data() as UserProfile;

    if (profile.status === 'blocked') {
      await signOut(auth);
      throw new Error('This account has been blocked or suspended by an administrator.');
    }

    return profile;
  }

  // Fallback ONLY in development
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'Firebase Authentication is not configured in production. Please set NEXT_PUBLIC_FIREBASE_* variables.'
    );
  }

  console.warn('[Auth DEV Fallback] Authenticating locally because Firebase is not configured.');
  const users = await dataService.getUsers();
  const found = users.find((u) => normalizeEmail(u.email) === email);
  if (!found) {
    throw new Error('User not found. In local dev mode without Firebase, please register first.');
  }
  if (found.status === 'blocked') {
    throw new Error('This account is blocked.');
  }
  await dataService.setCurrentUser(found);
  return found;
}

export async function logoutUser(): Promise<void> {
  if (auth) {
    await signOut(auth);
  }
  await dataService.setCurrentUser(null);
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  if (isFirebaseConfigured() && db) {
    const userSnap = await getDoc(doc(db, 'users', uid));
    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  }
  const users = await dataService.getUsers();
  return users.find((u) => u.uid === uid) || null;
}
