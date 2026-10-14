import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  runTransaction
} from 'firebase/firestore';
import { UserProfile, Contest, CodingProblem, Submission, UserRole } from '../types';
import { INITIAL_CONTESTS, INITIAL_PROBLEMS } from './mockData';
import { calculateNewRating } from './mlRating';
import { db, isFirebaseConfigured } from './firebase';

const STORAGE_KEYS = {
  USERS: 'codearena_users',
  CONTESTS: 'codearena_contests',
  PROBLEMS: 'codearena_problems',
  SUBMISSIONS: 'codearena_submissions',
  CURRENT_USER: 'codearena_current_user'
};

const inMemoryCache = new Map<string, any>();

const getStored = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') {
    return inMemoryCache.has(key) ? inMemoryCache.get(key) : fallback;
  }
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = <T>(key: string, val: T): void => {
  if (typeof window === 'undefined') {
    inMemoryCache.set(key, val);
    return;
  }
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage error:', e);
  }
};

const getContestStatus = (contest: Contest): Contest['status'] => {
  const now = Date.now();
  const start = new Date(contest.startTime).getTime();
  const end = new Date(contest.endTime).getTime();

  if (now < start) return 'upcoming';
  if (now < end) return 'ongoing';
  return 'past';
};

export const dataService = {
  // Current Session User
  async getCurrentUser(): Promise<UserProfile | null> {
    if (typeof window === 'undefined') return null;
    return getStored<UserProfile | null>(STORAGE_KEYS.CURRENT_USER, null);
  },

  async setCurrentUser(user: UserProfile | null): Promise<void> {
    setStored(STORAGE_KEYS.CURRENT_USER, user);
  },

  // Users Directory & Management
  async getUsers(): Promise<UserProfile[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'users'));
        return snap.docs.map((d) => d.data() as UserProfile);
      } catch (err) {
        console.error('Error fetching users from Firestore:', err);
      }
    }
    return getStored<UserProfile[]>(STORAGE_KEYS.USERS, []);
  },

  async addUser(user: UserProfile): Promise<UserProfile> {
    if (isFirebaseConfigured() && db) {
      await setDoc(doc(db, 'users', user.uid), user);
      return user;
    }
    const users = await this.getUsers();
    users.push(user);
    setStored(STORAGE_KEYS.USERS, users);
    return user;
  },

  async updateUserRoleOrStatus(
    uid: string,
    updates: Partial<UserProfile>
  ): Promise<UserProfile | null> {
    if (isFirebaseConfigured() && db) {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, updates);
      const updatedSnap = await getDoc(userRef);
      return updatedSnap.exists() ? (updatedSnap.data() as UserProfile) : null;
    }

    const users = await this.getUsers();
    const idx = users.findIndex((u) => u.uid === uid);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      setStored(STORAGE_KEYS.USERS, users);
      return users[idx];
    }
    return null;
  },

  // Contests
  async getContests(): Promise<Contest[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'contests'));
        if (!snap.empty) {
          return snap.docs.map((d) => {
            const data = d.data() as Contest;
            return { ...data, status: getContestStatus(data) };
          });
        }

        // Initialize Firestore with default academic contests if collection is completely empty
        const initialWithStatus = INITIAL_CONTESTS.map((c) => ({
          ...c,
          status: getContestStatus(c)
        }));
        for (const contest of initialWithStatus) {
          await setDoc(doc(db, 'contests', contest.id), contest);
        }
        return initialWithStatus;
      } catch (err) {
        console.error('Error fetching contests from Firestore:', err);
      }
    }

    // Local Development Fallback
    const contests = getStored<Contest[]>(STORAGE_KEYS.CONTESTS, INITIAL_CONTESTS);
    const updated = contests.map((c) => ({ ...c, status: getContestStatus(c) }));
    setStored(STORAGE_KEYS.CONTESTS, updated);
    return updated;
  },

  async getContestById(id: string): Promise<Contest | null> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDoc(doc(db, 'contests', id));
        if (snap.exists()) {
          const data = snap.data() as Contest;
          return { ...data, status: getContestStatus(data) };
        }
      } catch (err) {
        console.error('Error getting contest by ID:', err);
      }
    }
    const list = await this.getContests();
    return list.find((c) => c.id === id) || null;
  },

  async createContest(data: Partial<Contest>): Promise<Contest> {
    const startTime = data.startTime || new Date().toISOString();
    const endTime = data.endTime || new Date(Date.now() + 7200000).toISOString();
    const newContest: Contest = {
      id: 'c_' + Date.now(),
      title: data.title || 'Untitled Contest',
      description: data.description || '',
      startTime,
      endTime,
      durationMinutes: data.durationMinutes || 120,
      durationSeconds: data.durationSeconds,
      status: getContestStatus({ startTime, endTime } as Contest),
      department: data.department || 'Artificial Intelligence & Data Science',
      problems: data.problems || [],
      totalParticipants: 0,
      banner:
        data.banner ||
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'
    };

    if (isFirebaseConfigured() && db) {
      await setDoc(doc(db, 'contests', newContest.id), newContest);
      return newContest;
    }

    const list = await this.getContests();
    list.unshift(newContest);
    setStored(STORAGE_KEYS.CONTESTS, list);
    return newContest;
  },

  async updateContest(id: string, updates: Partial<Contest>): Promise<Contest | null> {
    if (isFirebaseConfigured() && db) {
      const contestRef = doc(db, 'contests', id);
      await updateDoc(contestRef, updates);
      const snap = await getDoc(contestRef);
      if (snap.exists()) {
        const data = snap.data() as Contest;
        return { ...data, status: getContestStatus(data) };
      }
      return null;
    }

    const list = await this.getContests();
    const index = list.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const current = list[index];
    const updated = {
      ...current,
      ...updates,
      id: current.id,
      status: getContestStatus({ ...current, ...updates })
    };
    list[index] = updated;
    setStored(STORAGE_KEYS.CONTESTS, list);
    return updated;
  },

  // Problems Bank
  async getProblems(): Promise<CodingProblem[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'problems'));
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as CodingProblem);
        }

        // Initialize Firestore with default problems if collection is empty
        for (const prob of INITIAL_PROBLEMS) {
          await setDoc(doc(db, 'problems', prob.id), prob);
        }
        return INITIAL_PROBLEMS;
      } catch (err) {
        console.error('Error fetching problems from Firestore:', err);
      }
    }

    return getStored<CodingProblem[]>(STORAGE_KEYS.PROBLEMS, INITIAL_PROBLEMS);
  },

  async getProblemById(id: string): Promise<CodingProblem | null> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDoc(doc(db, 'problems', id));
        if (snap.exists()) {
          return snap.data() as CodingProblem;
        }
      } catch (err) {
        console.error('Error getting problem by ID:', err);
      }
    }
    const list = await this.getProblems();
    return list.find((p) => p.id === id) || null;
  },

  async createProblem(data: Partial<CodingProblem>): Promise<CodingProblem> {
    const newProblem: CodingProblem = {
      id: 'p_' + Date.now(),
      title: data.title || 'New Problem',
      difficulty: data.difficulty || 'Medium',
      tags: data.tags || ['Arrays'],
      description: data.description || '',
      inputFormat: data.inputFormat || '',
      outputFormat: data.outputFormat || '',
      constraints: data.constraints || '',
      sampleTests: data.sampleTests || [],
      hiddenTests: data.hiddenTests || [],
      starterCode: data.starterCode || {
        cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    return 0;\n}',
        python: 'def solve(): pass\nif __name__ == "__main__": solve()',
        java: 'public class Solution { public static void main(String[] args) {} }',
        javascript: 'console.log("Hello");'
      }
    };

    if (isFirebaseConfigured() && db) {
      await setDoc(doc(db, 'problems', newProblem.id), newProblem);
      return newProblem;
    }

    const list = await this.getProblems();
    list.unshift(newProblem);
    setStored(STORAGE_KEYS.PROBLEMS, list);
    return newProblem;
  },

  // Submissions & Grading Ledger
  async getSubmissions(): Promise<Submission[]> {
    if (isFirebaseConfigured() && db) {
      try {
        const snap = await getDocs(collection(db, 'submissions'));
        return snap.docs.map((d) => d.data() as Submission);
      } catch (err) {
        console.error('Error getting submissions from Firestore:', err);
      }
    }
    return getStored<Submission[]>(STORAGE_KEYS.SUBMISSIONS, []);
  },

  async submitSolution(sub: Omit<Submission, 'id' | 'submittedAt'>): Promise<Submission> {
    const newSub: Submission = {
      ...sub,
      id: 'sub_' + Date.now(),
      submittedAt: new Date().toISOString()
    };

    if (isFirebaseConfigured() && db) {
      await setDoc(doc(db, 'submissions', newSub.id), newSub);

      // Prevent duplicate accepted submissions from repeatedly incrementing solved counts
      if (newSub.verdict === 'Accepted') {
        const userRef = doc(db, 'users', newSub.studentId);
        try {
          await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data() as UserProfile;
              const solved = Array.isArray(userData.solvedProblems) ? [...userData.solvedProblems] : [];
              if (!solved.includes(newSub.problemId)) {
                solved.push(newSub.problemId);
                const currentStats = userData.stats || { problemsSolved: 0, accuracy: 100, streak: 0 };
                transaction.update(userRef, {
                  solvedProblems: solved,
                  'stats.problemsSolved': solved.length,
                  'stats.totalSubmissions': (currentStats.totalSubmissions || 0) + 1
                });
              } else {
                const currentStats = userData.stats || { problemsSolved: 0, accuracy: 100, streak: 0 };
                transaction.update(userRef, {
                  'stats.totalSubmissions': (currentStats.totalSubmissions || 0) + 1
                });
              }
            }
          });
        } catch (err) {
          console.error('Error updating user solved problems in transaction:', err);
        }
      }

      return newSub;
    }

    // Local Storage fallback for dev
    const list = await this.getSubmissions();
    list.unshift(newSub);
    setStored(STORAGE_KEYS.SUBMISSIONS, list);

    if (sub.verdict === 'Accepted') {
      const users = await this.getUsers();
      const idx = users.findIndex((u) => u.uid === sub.studentId);
      if (idx !== -1) {
        if (!users[idx].solvedProblems.includes(sub.problemId)) {
          users[idx].solvedProblems.push(sub.problemId);
          if (users[idx].stats) {
            users[idx].stats.problemsSolved = users[idx].solvedProblems.length;
          }
          setStored(STORAGE_KEYS.USERS, users);
        }
      }
    }

    return newSub;
  },

  async updateStudentRating(
    studentId: string,
    contestScore: number,
    timeSpentMinutes: number,
    totalDurationMinutes: number
  ) {
    if (isFirebaseConfigured() && db) {
      const userRef = doc(db, 'users', studentId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data() as UserProfile;
        const oldRating = userData.rating || 1500;
        const { newRating, delta } = calculateNewRating({
          oldRating,
          contestScore,
          timeSpentMinutes,
          totalDurationMinutes
        });

        await updateDoc(userRef, { rating: newRating });
        return { oldRating, newRating, delta };
      }
    }

    const users = await this.getUsers();
    const idx = users.findIndex((u) => u.uid === studentId);
    if (idx !== -1) {
      const oldRating = users[idx].rating || 1500;
      const { newRating, delta } = calculateNewRating({
        oldRating,
        contestScore,
        timeSpentMinutes,
        totalDurationMinutes
      });

      users[idx].rating = newRating;
      setStored(STORAGE_KEYS.USERS, users);
      return { oldRating, newRating, delta };
    }

    return { oldRating: 1500, newRating: 1500, delta: 0 };
  }
};
