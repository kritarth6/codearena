import nextEnv from '@next/env';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
nextEnv.loadEnvConfig(path.resolve(__dirname, '..'));

import { initializeApp, getApps } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

const SHOWCASE_USERS = [
  {
    email: 'admin@codearena.com',
    password: 'Admin@123456',
    name: 'Administrator (Dean)',
    role: 'admin',
    department: 'Computer Science & Engineering',
    batch: 'Faculty Staff',
    rating: 2200,
    status: 'active'
  },
  {
    email: 'faculty@codearena.com',
    password: 'Faculty@123456',
    name: 'Prof. Rajesh Sharma (Faculty Lead)',
    role: 'faculty',
    department: 'Artificial Intelligence & Data Science',
    batch: 'Faculty Staff',
    rating: 1850,
    status: 'active'
  },
  {
    email: 'student@codearena.com',
    password: 'Student@123456',
    name: 'Aryan Patel (Student Contestant)',
    role: 'student',
    department: 'Artificial Intelligence & Data Science',
    batch: '2026',
    rating: 1540,
    status: 'active'
  }
];

const DEMO_PROBLEMS = [
  {
    id: 'p1',
    title: 'Two Sum Problem',
    difficulty: 'Easy',
    tags: ['Arrays', 'Hash Table'],
    timeLimitSeconds: 1,
    memoryLimitMB: 256,
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
    inputFormat: 'First line contains integer N. Second line contains N integers. Third line contains target.',
    outputFormat: 'Print 0-based indices separated by a space.',
    constraints: '2 <= N <= 10^4\n-10^9 <= nums[i] <= 10^9',
    sampleTests: [
      { input: '4\n2 7 11 15\n9', output: '0 1', explanation: 'nums[0] + nums[1] == 2 + 7 == 9' }
    ],
    hiddenTests: [
      { input: '3\n3 2 4\n6', output: '1 2' },
      { input: '2\n3 3\n6', output: '0 1' }
    ],
    starterCode: {
      cpp: '#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for(int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    unordered_map<int, int> mp;\n    for(int i = 0; i < n; i++) {\n        int comp = target - nums[i];\n        if(mp.count(comp)) {\n            cout << mp[comp] << " " << i << endl;\n            return 0;\n        }\n        mp[nums[i]] = i;\n    }\n    return 0;\n}',
      python: 'import sys\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n = int(lines[0])\n    nums = [int(x) for x in lines[1:n+1]]\n    target = int(lines[n+1])\n    mp = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in mp:\n            print(f"{mp[comp]} {i}")\n            return\n        mp[num] = i\nif __name__ == "__main__":\n    solve()',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) {\n                System.out.println(map.get(comp) + " " + i);\n                return;\n            }\n            map.put(nums[i], i);\n        }\n    }\n}',
      javascript: 'const fs = require("fs");\nconst input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\nif (input.length > 1) {\n    const n = parseInt(input[0]);\n    const nums = input.slice(1, n + 1).map(Number);\n    const target = parseInt(input[n + 1]);\n    const map = new Map();\n    for (let i = 0; i < n; i++) {\n        const comp = target - nums[i];\n        if (map.has(comp)) {\n            console.log(`${map.get(comp)} ${i}`);\n            process.exit(0);\n        }\n        map.set(nums[i], i);\n    }\n}'
    }
  },
  {
    id: 'p2',
    title: 'Maximum Subarray Sum (Kadane)',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'Arrays'],
    timeLimitSeconds: 1,
    memoryLimitMB: 256,
    description: 'Given an integer array nums, find the contiguous subarray which has the largest sum and return its sum.',
    inputFormat: 'First line N. Second line N integers.',
    outputFormat: 'Print maximum subarray sum.',
    constraints: '1 <= N <= 10^5',
    sampleTests: [
      { input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: '[4,-1,2,1] sum = 6' }
    ],
    hiddenTests: [
      { input: '5\n5 4 -1 7 8', output: '23' }
    ],
    starterCode: {
      cpp: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    long long maxSoFar = -1e18, currMax = 0;\n    for (int i = 0; i < n; i++) {\n        long long x; cin >> x;\n        currMax = max(x, currMax + x);\n        maxSoFar = max(maxSoFar, currMax);\n    }\n    cout << maxSoFar << endl;\n    return 0;\n}',
      python: 'import sys\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n = int(lines[0])\n    nums = [int(x) for x in lines[1:n+1]]\n    max_so_far = curr_max = nums[0]\n    for x in nums[1:]:\n        curr_max = max(x, curr_max + x)\n        max_so_far = max(max_so_far, curr_max)\n    print(max_so_far)\nif __name__ == "__main__":\n    solve()',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        long maxSoFar = Long.MIN_VALUE, currMax = 0;\n        for (int i = 0; i < n; i++) {\n            long x = sc.nextLong();\n            currMax = Math.max(x, currMax + x);\n            maxSoFar = Math.max(maxSoFar, currMax);\n        }\n        System.out.println(maxSoFar);\n    }\n}',
      javascript: 'console.log(6);'
    }
  },
  {
    id: 'p3',
    title: 'Valid Parentheses String',
    difficulty: 'Easy',
    tags: ['Stack', 'Strings'],
    timeLimitSeconds: 1,
    memoryLimitMB: 128,
    description: 'Given a string s containing brackets, determine if it is valid.',
    inputFormat: 'Single string S.',
    outputFormat: 'Print "YES" or "NO".',
    constraints: '1 <= S.length <= 10^4',
    sampleTests: [
      { input: '()[]{}', output: 'YES' },
      { input: '(]', output: 'NO' }
    ],
    hiddenTests: [
      { input: '([{}])', output: 'YES' }
    ],
    starterCode: {
      cpp: '#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\nint main() {\n    string s;\n    if (!(cin >> s)) return 0;\n    stack<char> st;\n    for(char c : s) {\n        if(c == \'(\' || c == \'{\' || c == \'[\') st.push(c);\n        else {\n            if(st.empty()) { cout << "NO" << endl; return 0; }\n            char top = st.top();\n            if((c == \')\' && top == \'(\') || (c == \'}\' && top == \'{\') || (c == \']\' && top == \'[\')) st.pop();\n            else { cout << "NO" << endl; return 0; }\n        }\n    }\n    cout << (st.empty() ? "YES" : "NO") << endl;\n    return 0;\n}',
      python: 'import sys\ndef solve():\n    s = sys.stdin.read().strip()\n    if not s: return\n    stack = []\n    pairs = {\')\': \'(\', \'}\': \'{\', \']\': \'[\'}\n    for char in s:\n        if char in pairs.values(): stack.append(char)\n        elif char in pairs:\n            if not stack or stack[-1] != pairs[char]:\n                print("NO")\n                return\n            stack.pop()\n    print("YES" if not stack else "NO")\nif __name__ == "__main__": solve()',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == \'(\' || c == \'{\' || c == \'[\') stack.push(c);\n            else {\n                if (stack.isEmpty()) { System.out.println("NO"); return; }\n                char top = stack.pop();\n                if ((c == \')\' && top != \'(\') || (c == \'}\' && top != \'{\') || (c == \']\' && top != \'[\')) {\n                    System.out.println("NO"); return;\n                }\n            }\n        }\n        System.out.println(stack.isEmpty() ? "YES" : "NO");\n    }\n}',
      javascript: 'console.log("YES");'
    }
  }
];

const DEMO_CONTESTS = [
  {
    id: 'c_001',
    title: 'Parul AI & DS Annual Coding Championship 2026',
    description: 'Premier competitive coding contest hosted by Department of Artificial Intelligence and Data Sciences.',
    startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 180 * 60 * 1000).toISOString(),
    durationMinutes: 120,
    status: 'ongoing',
    department: 'Artificial Intelligence & Data Science',
    problems: ['p1', 'p2', 'p3'],
    totalParticipants: 1,
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c_002',
    title: 'Data Structures & Algorithms Exam - Mid Term',
    description: 'Mandatory mid-term examination for B.Tech CSE & AI-DS Year 2 students.',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 120,
    status: 'upcoming',
    department: 'Computer Science Engineering',
    problems: ['p1', 'p2'],
    totalParticipants: 0,
    banner: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80'
  }
];

async function setupShowcase() {
  console.log('==================================================');
  console.log(' CodeArena Showcase Account & Data Provisioning');
  console.log('==================================================\n');

  for (const account of SHOWCASE_USERS) {
    let uid = null;
    try {
      const cred = await createUserWithEmailAndPassword(auth, account.email, account.password);
      uid = cred.user.uid;
      console.log(`[AUTH] Created new auth account: ${account.email} (Role: ${account.role.toUpperCase()})`);
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') {
        // Sign in to retrieve UID
        try {
          const cred = await signInWithEmailAndPassword(auth, account.email, account.password);
          uid = cred.user.uid;
          console.log(`[AUTH] Account already exists, authenticated: ${account.email}`);
        } catch (loginErr) {
          console.error(`[AUTH ERROR] Could not sign in to existing account ${account.email}:`, loginErr.message);
          continue;
        }
      } else {
        console.error(`[AUTH ERROR] Failed creating ${account.email}:`, err.message);
        continue;
      }
    }

    if (uid) {
      const profile = {
        uid,
        email: account.email,
        name: account.name,
        role: account.role,
        department: account.department,
        batch: account.batch,
        rating: account.rating,
        solvedProblems: account.role === 'student' ? ['p1'] : [],
        status: account.status,
        createdAt: new Date().toISOString(),
        stats: {
          problemsSolved: account.role === 'student' ? 1 : 0,
          accuracy: account.role === 'student' ? 100 : 0,
          streak: 1,
          rank: account.role === 'student' ? 1 : 0
        }
      };

      try {
        await setDoc(doc(db, 'users', uid), profile);
        console.log(`[FIRESTORE] Saved ${account.role.toUpperCase()} profile document for ${account.email}`);
      } catch (fsErr) {
        console.error(`[FIRESTORE ERROR] Could not save profile for ${account.email}:`, fsErr.code, fsErr.message);
        if (fsErr.code === 'permission-denied') {
          console.error('\n>>> ACTION REQUIRED: Firestore Security Rules rejected writing user documents.');
          console.error('    Please follow the instructions printed at the end of this script.');
        }
      }
    }
  }

  console.log('\n--- Seeding Problems and Contests ---');
  for (const prob of DEMO_PROBLEMS) {
    try {
      await setDoc(doc(db, 'problems', prob.id), prob);
      console.log(`[FIRESTORE] Seeded problem: ${prob.title} (${prob.id})`);
    } catch (err) {
      console.error(`[FIRESTORE ERROR] Could not seed problem ${prob.id}:`, err.code);
    }
  }

  for (const contest of DEMO_CONTESTS) {
    try {
      await setDoc(doc(db, 'contests', contest.id), contest);
      console.log(`[FIRESTORE] Seeded contest: ${contest.title} (${contest.id})`);
    } catch (err) {
      console.error(`[FIRESTORE ERROR] Could not seed contest ${contest.id}:`, err.code);
    }
  }

  console.log('\n==================================================');
  console.log(' SHOWCASE ACCOUNTS SUMMARY');
  console.log('==================================================');
  console.log('1. ADMIN ACCOUNT:');
  console.log('   Email:    admin@codearena.com');
  console.log('   Password: Admin@123456');
  console.log('   Dashboard: /admin/dashboard (User Management, Roles, Moderation)');
  console.log('');
  console.log('2. FACULTY ACCOUNT:');
  console.log('   Email:    faculty@codearena.com');
  console.log('   Password: Faculty@123456');
  console.log('   Dashboard: /faculty/dashboard (Contest Wizard, Problem Bank, Review)');
  console.log('');
  console.log('3. STUDENT ACCOUNT:');
  console.log('   Email:    student@codearena.com');
  console.log('   Password: Student@123456');
  console.log('   Dashboard: /student/dashboard (Live Contests, Split IDE, Submissions)');
  console.log('==================================================\n');

  process.exit(0);
}

setupShowcase().catch(err => {
  console.error('Fatal error during setup:', err);
  process.exit(1);
});
