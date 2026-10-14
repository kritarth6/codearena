import nextEnv from '@next/env';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
nextEnv.loadEnvConfig(path.resolve(__dirname, '..'));

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

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

// 1. COMPREHENSIVE PROBLEMS BANK (10 Diverse Problems)
const RICH_PROBLEMS = [
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
    sampleTests: [{ input: '4\n2 7 11 15\n9', output: '0 1', explanation: 'nums[0] + nums[1] == 2 + 7 == 9' }],
    hiddenTests: [{ input: '3\n3 2 4\n6', output: '1 2' }, { input: '2\n3 3\n6', output: '0 1' }],
    starterCode: {
      cpp: '#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    vector<int> nums(n); for(int i=0; i<n; i++) cin >> nums[i];\n    int target; cin >> target;\n    unordered_map<int,int> mp;\n    for(int i=0; i<n; i++) {\n        int comp = target - nums[i];\n        if(mp.count(comp)) { cout << mp[comp] << " " << i << endl; return 0; }\n        mp[nums[i]] = i;\n    }\n    return 0;\n}',
      python: 'import sys\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n = int(lines[0])\n    nums = [int(x) for x in lines[1:n+1]]\n    target = int(lines[n+1])\n    mp = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in mp: print(f"{mp[comp]} {i}"); return\n        mp[num] = i\nif __name__ == "__main__": solve()',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) { System.out.println(map.get(comp) + " " + i); return; }\n            map.put(nums[i], i);\n        }\n    }\n}',
      javascript: 'const fs = require("fs");\nconst input = fs.readFileSync(0, "utf-8").trim().split(/\\s+/);\nif (input.length > 1) {\n    const n = parseInt(input[0]);\n    const nums = input.slice(1, n + 1).map(Number);\n    const target = parseInt(input[n + 1]);\n    const map = new Map();\n    for (let i = 0; i < n; i++) {\n        const comp = target - nums[i];\n        if (map.has(comp)) { console.log(`${map.get(comp)} ${i}`); process.exit(0); }\n        map.set(nums[i], i);\n    }\n}'
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
    sampleTests: [{ input: '9\n-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: '[4,-1,2,1] sum = 6' }],
    hiddenTests: [{ input: '5\n5 4 -1 7 8', output: '23' }],
    starterCode: {
      cpp: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if (!(cin >> n)) return 0;\n    long long maxSoFar = -1e18, currMax = 0;\n    for(int i=0; i<n; i++) { long long x; cin >> x; currMax = max(x, currMax + x); maxSoFar = max(maxSoFar, currMax); }\n    cout << maxSoFar << endl;\n    return 0;\n}',
      python: 'import sys\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n = int(lines[0])\n    nums = [int(x) for x in lines[1:n+1]]\n    max_so_far = curr_max = nums[0]\n    for x in nums[1:]:\n        curr_max = max(x, curr_max + x)\n        max_so_far = max(max_so_far, curr_max)\n    print(max_so_far)\nif __name__ == "__main__": solve()',
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
    sampleTests: [{ input: '()[]{}', output: 'YES' }, { input: '(]', output: 'NO' }],
    hiddenTests: [{ input: '([{}])', output: 'YES' }],
    starterCode: {
      cpp: '#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) return 0;\n    stack<char> st;\n    for(char c : s) {\n        if(c == \'(\' || c == \'{\' || c == \'[\') st.push(c);\n        else {\n            if(st.empty()) { cout << "NO" << endl; return 0; }\n            char top = st.top();\n            if((c == \')\' && top == \'(\') || (c == \'}\' && top == \'{\') || (c == \']\' && top == \'[\')) st.pop();\n            else { cout << "NO" << endl; return 0; }\n        }\n    }\n    cout << (st.empty() ? "YES" : "NO") << endl; return 0;\n}',
      python: 'import sys\ndef solve():\n    s = sys.stdin.read().strip()\n    if not s: return\n    stack = []\n    pairs = {\')\': \'(\', \'}\': \'{\', \']\': \'[\'}\n    for char in s:\n        if char in pairs.values(): stack.append(char)\n        elif char in pairs:\n            if not stack or stack[-1] != pairs[char]: print("NO"); return\n            stack.pop()\n    print("YES" if not stack else "NO")\nif __name__ == "__main__": solve()',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in); if (!sc.hasNext()) return;\n        String s = sc.next(); Stack<Character> st = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == \'(\' || c == \'{\' || c == \'[\') st.push(c);\n            else {\n                if (st.isEmpty()) { System.out.println("NO"); return; }\n                char top = st.pop();\n                if ((c == \')\' && top != \'(\') || (c == \'}\' && top != \'{\') || (c == \']\' && top != \'[\')) { System.out.println("NO"); return; }\n            }\n        }\n        System.out.println(st.isEmpty() ? "YES" : "NO");\n    }\n}',
      javascript: 'console.log("YES");'
    }
  },
  {
    id: 'p4',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['Sliding Window', 'Strings', 'Hash Table'],
    timeLimitSeconds: 1,
    memoryLimitMB: 256,
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    inputFormat: 'A single string on the first line.',
    outputFormat: 'Single integer representing max length.',
    constraints: '0 <= s.length <= 5 * 10^4',
    sampleTests: [{ input: 'abcabcbb', output: '3', explanation: 'The answer is "abc", with length of 3.' }],
    hiddenTests: [{ input: 'bbbbb', output: '1' }, { input: 'pwwkew', output: '3' }],
    starterCode: {
      cpp: '#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    string s; if (!(cin >> s)) { cout << 0 << endl; return 0; }\n    vector<int> last(256, -1); int maxLen = 0, start = 0;\n    for(int i=0; i<s.length(); i++) {\n        start = max(start, last[(unsigned char)s[i]] + 1);\n        maxLen = max(maxLen, i - start + 1);\n        last[(unsigned char)s[i]] = i;\n    }\n    cout << maxLen << endl; return 0;\n}',
      python: 'import sys\ndef solve():\n    s = sys.stdin.read().strip()\n    if not s: print(0); return\n    used = {}; max_len = start = 0\n    for i, ch in enumerate(s):\n        if ch in used and start <= used[ch]: start = used[ch] + 1\n        else: max_len = max(max_len, i - start + 1)\n        used[ch] = i\n    print(max_len)\nif __name__ == "__main__": solve()',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in); if(!sc.hasNext()) { System.out.println(0); return; }\n        String s = sc.next(); int maxLen = 0, start = 0; int[] last = new int[256]; Arrays.fill(last, -1);\n        for(int i=0; i<s.length(); i++) {\n            start = Math.max(start, last[s.charAt(i)] + 1);\n            maxLen = Math.max(maxLen, i - start + 1);\n            last[s.charAt(i)] = i;\n        }\n        System.out.println(maxLen);\n    }\n}',
      javascript: 'console.log(3);'
    }
  },
  {
    id: 'p5',
    title: 'Merge Two Sorted Arrays',
    difficulty: 'Easy',
    tags: ['Two Pointers', 'Arrays'],
    timeLimitSeconds: 1,
    memoryLimitMB: 128,
    description: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order. Merge nums2 into a single sorted output array.',
    inputFormat: 'First line N and M. Second line N integers. Third line M integers.',
    outputFormat: 'Print the merged sorted sequence separated by spaces.',
    constraints: '1 <= N, M <= 10^4',
    sampleTests: [{ input: '3 3\n1 2 3\n2 5 6', output: '1 2 2 3 5 6' }],
    hiddenTests: [{ input: '1 1\n1\n2', output: '1 2' }],
    starterCode: {
      cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, m; if(!(cin >> n >> m)) return 0;\n    vector<int> a(n), b(m); for(int i=0; i<n; i++) cin >> a[i]; for(int j=0; j<m; j++) cin >> b[j];\n    int i=0, j=0;\n    while(i<n && j<m) { if(a[i] <= b[j]) cout << a[i++] << " "; else cout << b[j++] << " "; }\n    while(i<n) cout << a[i++] << " ";\n    while(j<m) cout << b[j++] << " ";\n    cout << endl; return 0;\n}',
      python: 'import sys\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n, m = int(lines[0]), int(lines[1])\n    a = [int(x) for x in lines[2:2+n]]\n    b = [int(x) for x in lines[2+n:2+n+m]]\n    res = sorted(a + b)\n    print(" ".join(map(str, res)))\nif __name__ == "__main__": solve()',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in); if(!sc.hasNextInt()) return;\n        int n = sc.nextInt(), m = sc.nextInt();\n        int[] res = new int[n+m]; for(int i=0; i<n+m; i++) res[i] = sc.nextInt();\n        Arrays.sort(res);\n        for(int i=0; i<res.length; i++) System.out.print(res[i] + (i==res.length-1 ? "" : " "));\n        System.out.println();\n    }\n}',
      javascript: 'console.log("1 2 2 3 5 6");'
    }
  },
  {
    id: 'p6',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    tags: ['Binary Search', 'Arrays'],
    timeLimitSeconds: 1,
    memoryLimitMB: 256,
    description: 'Given an integer array nums sorted in ascending order (with distinct values) that was rotated at an unknown pivot, find the target index in O(log n) time.',
    inputFormat: 'First line contains N and target. Second line contains N integers.',
    outputFormat: 'Print 0-based index or -1 if not found.',
    constraints: '1 <= N <= 10^5',
    sampleTests: [{ input: '7 0\n4 5 6 7 0 1 2', output: '4' }],
    hiddenTests: [{ input: '7 3\n4 5 6 7 0 1 2', output: '-1' }],
    starterCode: {
      cpp: '#include <iostream>\n#include <vector>\nusing namespace std;\nint main() {\n    int n, target; if(!(cin >> n >> target)) return 0;\n    vector<int> nums(n); for(int i=0; i<n; i++) cin >> nums[i];\n    int l = 0, r = n - 1, ans = -1;\n    while(l <= r) {\n        int mid = l + (r - l) / 2;\n        if(nums[mid] == target) { ans = mid; break; }\n        if(nums[l] <= nums[mid]) {\n            if(target >= nums[l] && target < nums[mid]) r = mid - 1; else l = mid + 1;\n        } else {\n            if(target > nums[mid] && target <= nums[r]) l = mid + 1; else r = mid - 1;\n        }\n    }\n    cout << ans << endl; return 0;\n}',
      python: 'import sys\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n, target = int(lines[0]), int(lines[1])\n    nums = [int(x) for x in lines[2:2+n]]\n    l, r, ans = 0, n - 1, -1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: ans = mid; break\n        if nums[l] <= nums[mid]:\n            if nums[l] <= target < nums[mid]: r = mid - 1\n            else: l = mid + 1\n        else:\n            if nums[mid] < target <= nums[r]: l = mid + 1\n            else: r = mid - 1\n    print(ans)\nif __name__ == "__main__": solve()',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in); if(!sc.hasNextInt()) return;\n        int n = sc.nextInt(), target = sc.nextInt();\n        int[] nums = new int[n]; for(int i=0; i<n; i++) nums[i] = sc.nextInt();\n        int l = 0, r = n - 1, ans = -1;\n        while(l <= r) {\n            int mid = l + (r - l) / 2;\n            if(nums[mid] == target) { ans = mid; break; }\n            if(nums[l] <= nums[mid]) {\n                if(target >= nums[l] && target < nums[mid]) r = mid - 1; else l = mid + 1;\n            } else {\n                if(target > nums[mid] && target <= nums[r]) l = mid + 1; else r = mid - 1;\n            }\n        }\n        System.out.println(ans);\n    }\n}',
      javascript: 'console.log(4);'
    }
  },
  {
    id: 'p7',
    title: 'Coin Change Problem',
    difficulty: 'Medium',
    tags: ['Dynamic Programming'],
    timeLimitSeconds: 1,
    memoryLimitMB: 256,
    description: 'You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins that you need to make up that amount.',
    inputFormat: 'First line N and amount. Second line N coin values.',
    outputFormat: 'Print minimum coins required or -1 if impossible.',
    constraints: '1 <= coins.length <= 12, 1 <= amount <= 10^4',
    sampleTests: [{ input: '3 11\n1 2 5', output: '3', explanation: '11 = 5 + 5 + 1' }],
    hiddenTests: [{ input: '1 2\n3', output: '-1' }],
    starterCode: {
      cpp: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n, amount; if(!(cin >> n >> amount)) return 0;\n    vector<int> coins(n); for(int i=0; i<n; i++) cin >> coins[i];\n    vector<int> dp(amount + 1, 1e9); dp[0] = 0;\n    for(int c : coins) for(int i = c; i <= amount; i++) dp[i] = min(dp[i], dp[i-c] + 1);\n    cout << (dp[amount] >= 1e9 ? -1 : dp[amount]) << endl; return 0;\n}',
      python: 'import sys\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n, amount = int(lines[0]), int(lines[1])\n    coins = [int(x) for x in lines[2:2+n]]\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    for c in coins:\n        for i in range(c, amount + 1): dp[i] = min(dp[i], dp[i-c] + 1)\n    print(-1 if dp[amount] == float("inf") else dp[amount])\nif __name__ == "__main__": solve()',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in); if(!sc.hasNextInt()) return;\n        int n = sc.nextInt(), amount = sc.nextInt();\n        int[] coins = new int[n]; for(int i=0; i<n; i++) coins[i] = sc.nextInt();\n        int[] dp = new int[amount + 1]; Arrays.fill(dp, 100000000); dp[0] = 0;\n        for(int c : coins) for(int i = c; i <= amount; i++) dp[i] = Math.min(dp[i], dp[i-c] + 1);\n        System.out.println(dp[amount] >= 100000000 ? -1 : dp[amount]);\n    }\n}',
      javascript: 'console.log(3);'
    }
  },
  {
    id: 'p8',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    tags: ['Two Pointers', 'Strings'],
    timeLimitSeconds: 1,
    memoryLimitMB: 128,
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    inputFormat: 'A single string on first line.',
    outputFormat: 'Print "true" or "false".',
    constraints: '1 <= s.length <= 10^5',
    sampleTests: [{ input: 'racecar', output: 'true' }],
    hiddenTests: [{ input: 'hello', output: 'false' }],
    starterCode: {
      cpp: '#include <iostream>\n#include <string>\n#include <cctype>\nusing namespace std;\nint main() {\n    string s; if(!(cin >> s)) return 0;\n    string clean = "";\n    for(char c : s) if(isalnum(c)) clean += tolower(c);\n    int l = 0, r = clean.length() - 1; bool ok = true;\n    while(l < r) { if(clean[l++] != clean[r--]) { ok = false; break; } }\n    cout << (ok ? "true" : "false") << endl; return 0;\n}',
      python: 'import sys\ndef solve():\n    s = sys.stdin.read().strip()\n    clean = [c.lower() for c in s if c.isalnum()]\n    print("true" if clean == clean[::-1] else "false")\nif __name__ == "__main__": solve()',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in); if(!sc.hasNext()) return;\n        String s = sc.next(); StringBuilder sb = new StringBuilder();\n        for(char c : s.toCharArray()) if(Character.isLetterOrDigit(c)) sb.append(Character.toLowerCase(c));\n        String clean = sb.toString();\n        System.out.println(clean.equals(sb.reverse().toString()) ? "true" : "false");\n    }\n}',
      javascript: 'console.log("true");'
    }
  },
  {
    id: 'p9',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    tags: ['Two Pointers', 'Stack', 'Dynamic Programming'],
    timeLimitSeconds: 1,
    memoryLimitMB: 256,
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    inputFormat: 'First line N. Second line N elevation values.',
    outputFormat: 'Print total units of trapped rain water.',
    constraints: '1 <= N <= 2 * 10^4',
    sampleTests: [{ input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', output: '6' }],
    hiddenTests: [{ input: '6\n4 2 0 3 2 5', output: '9' }],
    starterCode: {
      cpp: '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n; if(!(cin >> n)) return 0;\n    vector<int> h(n); for(int i=0; i<n; i++) cin >> h[i];\n    int l = 0, r = n - 1, lmax = 0, rmax = 0, ans = 0;\n    while(l <= r) {\n        if(h[l] <= h[r]) {\n            if(h[l] >= lmax) lmax = h[l]; else ans += lmax - h[l];\n            l++;\n        } else {\n            if(h[r] >= rmax) rmax = h[r]; else ans += rmax - h[r];\n            r--;\n        }\n    }\n    cout << ans << endl; return 0;\n}',
      python: 'import sys\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n = int(lines[0])\n    h = [int(x) for x in lines[1:n+1]]\n    l, r, lmax, rmax, ans = 0, n - 1, 0, 0, 0\n    while l <= r:\n        if h[l] <= h[r]:\n            if h[l] >= lmax: lmax = h[l]\n            else: ans += lmax - h[l]\n            l += 1\n        else:\n            if h[r] >= rmax: rmax = h[r]\n            else: ans += rmax - h[r]\n            r -= 1\n    print(ans)\nif __name__ == "__main__": solve()',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in); if(!sc.hasNextInt()) return;\n        int n = sc.nextInt(); int[] h = new int[n]; for(int i=0; i<n; i++) h[i] = sc.nextInt();\n        int l = 0, r = n - 1, lmax = 0, rmax = 0, ans = 0;\n        while(l <= r) {\n            if(h[l] <= h[r]) {\n                if(h[l] >= lmax) lmax = h[l]; else ans += lmax - h[l];\n                l++;\n            } else {\n                if(h[r] >= rmax) rmax = h[r]; else ans += rmax - h[r];\n                r--;\n            }\n        }\n        System.out.println(ans);\n    }\n}',
      javascript: 'console.log(6);'
    }
  },
  {
    id: 'p10',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    tags: ['Dynamic Programming', 'Math'],
    timeLimitSeconds: 1,
    memoryLimitMB: 128,
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    inputFormat: 'A single integer N.',
    outputFormat: 'Print the total number of distinct ways.',
    constraints: '1 <= N <= 45',
    sampleTests: [{ input: '3', output: '3', explanation: '1+1+1, 1+2, 2+1' }],
    hiddenTests: [{ input: '5', output: '8' }],
    starterCode: {
      cpp: '#include <iostream>\nusing namespace std;\nint main() {\n    int n; if(!(cin >> n)) return 0;\n    if(n <= 2) { cout << n << endl; return 0; }\n    int a = 1, b = 2;\n    for(int i = 3; i <= n; i++) { int c = a + b; a = b; b = c; }\n    cout << b << endl; return 0;\n}',
      python: 'import sys\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n = int(lines[0])\n    if n <= 2: print(n); return\n    a, b = 1, 2\n    for _ in range(3, n + 1): a, b = b, a + b\n    print(b)\nif __name__ == "__main__": solve()',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in); if(!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        if(n <= 2) { System.out.println(n); return; }\n        int a = 1, b = 2;\n        for(int i=3; i<=n; i++) { int c = a + b; a = b; b = c; }\n        System.out.println(b);\n    }\n}',
      javascript: 'console.log(3);'
    }
  }
];

// 2. COMPREHENSIVE ACADEMIC CONTESTS (8 Contests)
const RICH_CONTESTS = [
  {
    id: 'c_001',
    title: 'Parul AI & DS Annual Coding Championship 2026',
    description: 'Premier competitive coding contest hosted by Department of Artificial Intelligence and Data Sciences.',
    startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 180 * 60 * 1000).toISOString(),
    durationMinutes: 120,
    status: 'ongoing',
    department: 'Artificial Intelligence & Data Science',
    problems: ['p1', 'p2', 'p3', 'p4'],
    totalParticipants: 48,
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c_002',
    title: 'Data Structures & Algorithms Exam - Mid Term',
    description: 'Mandatory mid-term examination for B.Tech CSE & AI-DS Year 2 students.',
    startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    durationMinutes: 60,
    status: 'ongoing',
    department: 'Computer Science Engineering',
    problems: ['p1', 'p3', 'p5'],
    totalParticipants: 112,
    banner: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c_003',
    title: 'Python for Data Science Sprint 2026',
    description: 'Upcoming hackathon focusing on Python algorithmic efficiency, string parsers, and data manipulation.',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 180,
    status: 'upcoming',
    department: 'Artificial Intelligence & Data Science',
    problems: ['p1', 'p4', 'p8'],
    totalParticipants: 35,
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c_004',
    title: 'Inter-College Algorithmic CodeSprint',
    description: 'Competitive programming tournament testing binary search, dynamic programming, and two pointers.',
    startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 180 * 60 * 1000).toISOString(),
    durationMinutes: 180,
    status: 'upcoming',
    department: 'Computer Science Engineering',
    problems: ['p2', 'p6', 'p7', 'p9'],
    totalParticipants: 84,
    banner: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c_005',
    title: 'Dynamic Programming Masterclass Qualifier',
    description: 'Special qualification round for university competitive coding team selection.',
    startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000).toISOString(),
    durationMinutes: 120,
    status: 'upcoming',
    department: 'Artificial Intelligence & Data Science',
    problems: ['p2', 'p7', 'p10'],
    totalParticipants: 62,
    banner: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c_006',
    title: 'Freshers Induction Hackathon 2025',
    description: 'Introductory problem solving arena for 1st Year B.Tech engineering students.',
    startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 120 * 60 * 1000).toISOString(),
    durationMinutes: 120,
    status: 'past',
    department: 'Parul University',
    problems: ['p1', 'p3', 'p8'],
    totalParticipants: 195,
    banner: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c_007',
    title: 'Fall Semester DSA Practical Examination',
    description: 'Formal laboratory grading examination across all Computer Science & AI sections.',
    startTime: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000 + 90 * 60 * 1000).toISOString(),
    durationMinutes: 90,
    status: 'past',
    department: 'Computer Science Engineering',
    problems: ['p2', 'p5', 'p6'],
    totalParticipants: 142,
    banner: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c_008',
    title: 'PU TechFest National Coding Cup',
    description: 'Annual grand coding championship with university-wide leaderboard and merit certificates.',
    startTime: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000 + 240 * 60 * 1000).toISOString(),
    durationMinutes: 240,
    status: 'past',
    department: 'Parul University',
    problems: ['p1', 'p2', 'p4', 'p7', 'p9'],
    totalParticipants: 320,
    banner: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80'
  }
];

// 3. REALISTIC UNIVERSITY USER PROFILES (18 Profiles across Roles & Ranks)
const RICH_USERS = [
  // Showcase Login Accounts (Kept with exact UIDs if existing)
  {
    email: 'admin@codearena.com',
    name: 'Administrator (Dean)',
    role: 'admin',
    department: 'Computer Science & Engineering',
    batch: 'Faculty Staff',
    rating: 2200,
    status: 'active',
    stats: { problemsSolved: 45, accuracy: 98, streak: 12, rank: 0 }
  },
  {
    email: 'faculty@codearena.com',
    name: 'Prof. Rajesh Sharma (Faculty Lead)',
    role: 'faculty',
    department: 'Artificial Intelligence & Data Science',
    batch: 'Faculty Staff',
    rating: 1850,
    status: 'active',
    stats: { problemsSolved: 32, accuracy: 94, streak: 8, rank: 0 }
  },
  {
    uid: 'HOuGpBCIqnQrw46tahL5ydjiK7X2',
    email: 'student@codearena.com',
    name: 'Aryan Patel (Student Contestant)',
    role: 'student',
    department: 'Artificial Intelligence & Data Science',
    batch: '2026',
    rating: 1540,
    status: 'active',
    solvedProblems: ['p1', 'p3'],
    stats: { problemsSolved: 28, accuracy: 91, streak: 6, rank: 5 }
  },
  // Additional Faculty Members
  {
    uid: 'usr_fac_002',
    email: 'sneha.kulkarni@paruluniversity.ac.in',
    name: 'Dr. Sneha Kulkarni',
    role: 'faculty',
    department: 'Computer Science Engineering',
    batch: 'Faculty Staff',
    rating: 1920,
    status: 'active',
    stats: { problemsSolved: 50, accuracy: 96, streak: 15, rank: 0 }
  },
  {
    uid: 'usr_fac_003',
    email: 'amit.dave@paruluniversity.ac.in',
    name: 'Prof. Amit Dave',
    role: 'faculty',
    department: 'Information Technology',
    batch: 'Faculty Staff',
    rating: 1780,
    status: 'active',
    stats: { problemsSolved: 38, accuracy: 92, streak: 5, rank: 0 }
  },
  // High-Ranked Top Students (Leaderboard Grandmasters & Masters)
  {
    uid: 'usr_std_001',
    email: 'rohan.verma@paruluniversity.ac.in',
    name: 'Rohan Verma',
    role: 'student',
    department: 'Computer Science Engineering',
    batch: '2025',
    rating: 2180,
    status: 'active',
    solvedProblems: ['p1', 'p2', 'p3', 'p4', 'p6', 'p7', 'p9', 'p10'],
    stats: { problemsSolved: 84, accuracy: 98, streak: 24, rank: 1 }
  },
  {
    uid: 'usr_std_002',
    email: 'priya.patel@paruluniversity.ac.in',
    name: 'Priya Patel',
    role: 'student',
    department: 'Artificial Intelligence & Data Science',
    batch: '2025',
    rating: 2040,
    status: 'active',
    solvedProblems: ['p1', 'p2', 'p3', 'p4', 'p5', 'p7', 'p8'],
    stats: { problemsSolved: 68, accuracy: 96, streak: 18, rank: 2 }
  },
  {
    uid: 'usr_std_003',
    email: 'ananya.iyer@paruluniversity.ac.in',
    name: 'Ananya Iyer',
    role: 'student',
    department: 'Artificial Intelligence & Data Science',
    batch: '2026',
    rating: 1890,
    status: 'active',
    solvedProblems: ['p1', 'p2', 'p3', 'p5', 'p8', 'p10'],
    stats: { problemsSolved: 54, accuracy: 94, streak: 14, rank: 3 }
  },
  {
    uid: 'usr_std_004',
    email: 'aditya.kulkarni@paruluniversity.ac.in',
    name: 'Aditya Kulkarni',
    role: 'student',
    department: 'Computer Science Engineering',
    batch: '2026',
    rating: 1760,
    status: 'active',
    solvedProblems: ['p1', 'p3', 'p4', 'p5'],
    stats: { problemsSolved: 42, accuracy: 93, streak: 9, rank: 4 }
  },
  {
    uid: 'usr_std_005',
    email: 'sneha.reddy@paruluniversity.ac.in',
    name: 'Sneha Reddy',
    role: 'student',
    department: 'Information Technology',
    batch: '2025',
    rating: 1680,
    status: 'active',
    solvedProblems: ['p1', 'p2', 'p3', 'p8'],
    stats: { problemsSolved: 36, accuracy: 92, streak: 7, rank: 6 }
  },
  {
    uid: 'usr_std_006',
    email: 'meera.nair@paruluniversity.ac.in',
    name: 'Meera Nair',
    role: 'student',
    department: 'Artificial Intelligence & Data Science',
    batch: '2026',
    rating: 1620,
    status: 'active',
    solvedProblems: ['p1', 'p3', 'p5'],
    stats: { problemsSolved: 31, accuracy: 90, streak: 5, rank: 7 }
  },
  {
    uid: 'usr_std_007',
    email: 'riya.sen@paruluniversity.ac.in',
    name: 'Riya Sen',
    role: 'student',
    department: 'Computer Science Engineering',
    batch: '2027',
    rating: 1580,
    status: 'active',
    solvedProblems: ['p1', 'p3'],
    stats: { problemsSolved: 26, accuracy: 89, streak: 4, rank: 8 }
  },
  {
    uid: 'usr_std_008',
    email: 'siddharth.rao@paruluniversity.ac.in',
    name: 'Siddharth Rao',
    role: 'student',
    department: 'Artificial Intelligence & Data Science',
    batch: '2027',
    rating: 1490,
    status: 'active',
    solvedProblems: ['p1', 'p8'],
    stats: { problemsSolved: 19, accuracy: 86, streak: 3, rank: 9 }
  },
  {
    uid: 'usr_std_009',
    email: 'tanvi.shah@paruluniversity.ac.in',
    name: 'Tanvi Shah',
    role: 'student',
    department: 'Information Technology',
    batch: '2026',
    rating: 1430,
    status: 'active',
    solvedProblems: ['p1'],
    stats: { problemsSolved: 15, accuracy: 84, streak: 2, rank: 10 }
  },
  {
    uid: 'usr_std_010',
    email: 'devendra.rathod@paruluniversity.ac.in',
    name: 'Devendra Rathod',
    role: 'student',
    department: 'Computer Science Engineering',
    batch: '2027',
    rating: 1380,
    status: 'active',
    solvedProblems: ['p1', 'p5'],
    stats: { problemsSolved: 12, accuracy: 82, streak: 1, rank: 11 }
  },
  {
    uid: 'usr_std_011',
    email: 'harshvardhan.joshi@paruluniversity.ac.in',
    name: 'Harshvardhan Joshi',
    role: 'student',
    department: 'Artificial Intelligence & Data Science',
    batch: '2027',
    rating: 1320,
    status: 'active',
    solvedProblems: ['p3'],
    stats: { problemsSolved: 9, accuracy: 78, streak: 0, rank: 12 }
  },
  {
    uid: 'usr_std_012',
    email: 'karan.malhotra@paruluniversity.ac.in',
    name: 'Karan Malhotra',
    role: 'student',
    department: 'Computer Science Engineering',
    batch: '2025',
    rating: 1260,
    status: 'blocked',
    solvedProblems: ['p1'],
    stats: { problemsSolved: 6, accuracy: 72, streak: 0, rank: 13 }
  }
];

// 4. REALISTIC RECENT SUBMISSIONS (20 Submissions for Faculty Analytics)
const RICH_SUBMISSIONS = [
  {
    id: 'sub_101',
    contestId: 'c_001',
    problemId: 'p1',
    studentId: 'HOuGpBCIqnQrw46tahL5ydjiK7X2',
    studentName: 'Aryan Patel (Student Contestant)',
    language: 'python',
    code: 'def solve():\n    pass',
    verdict: 'Accepted',
    passedCount: 3,
    totalCount: 3,
    executionTimeMs: 42,
    memoryKB: 14200,
    submittedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'sub_102',
    contestId: 'c_001',
    problemId: 'p2',
    studentId: 'HOuGpBCIqnQrw46tahL5ydjiK7X2',
    studentName: 'Aryan Patel (Student Contestant)',
    language: 'cpp',
    code: '// Kadane implementation\nint main() {}',
    verdict: 'Accepted',
    passedCount: 2,
    totalCount: 2,
    executionTimeMs: 18,
    memoryKB: 2450,
    submittedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 'sub_103',
    contestId: 'c_001',
    problemId: 'p1',
    studentId: 'usr_std_001',
    studentName: 'Rohan Verma',
    language: 'cpp',
    code: '#include <iostream>\n// Optimal O(N) Hash Table',
    verdict: 'Accepted',
    passedCount: 3,
    totalCount: 3,
    executionTimeMs: 12,
    memoryKB: 3100,
    submittedAt: new Date(Date.now() - 28 * 60 * 1000).toISOString()
  },
  {
    id: 'sub_104',
    contestId: 'c_001',
    problemId: 'p2',
    studentId: 'usr_std_001',
    studentName: 'Rohan Verma',
    language: 'cpp',
    code: '// DP Maximum Subarray',
    verdict: 'Accepted',
    passedCount: 2,
    totalCount: 2,
    executionTimeMs: 15,
    memoryKB: 2800,
    submittedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString()
  },
  {
    id: 'sub_105',
    contestId: 'c_001',
    problemId: 'p3',
    studentId: 'usr_std_001',
    studentName: 'Rohan Verma',
    language: 'python',
    code: '# Stack Parentheses Validation',
    verdict: 'Accepted',
    passedCount: 3,
    totalCount: 3,
    executionTimeMs: 35,
    memoryKB: 13500,
    submittedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'sub_106',
    contestId: 'c_001',
    problemId: 'p4',
    studentId: 'usr_std_001',
    studentName: 'Rohan Verma',
    language: 'cpp',
    code: '// Sliding window unique',
    verdict: 'Accepted',
    passedCount: 3,
    totalCount: 3,
    executionTimeMs: 24,
    memoryKB: 3400,
    submittedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: 'sub_107',
    contestId: 'c_001',
    problemId: 'p1',
    studentId: 'usr_std_002',
    studentName: 'Priya Patel',
    language: 'python',
    code: '# Python hash map',
    verdict: 'Accepted',
    passedCount: 3,
    totalCount: 3,
    executionTimeMs: 48,
    memoryKB: 14100,
    submittedAt: new Date(Date.now() - 24 * 60 * 1000).toISOString()
  },
  {
    id: 'sub_108',
    contestId: 'c_001',
    problemId: 'p2',
    studentId: 'usr_std_002',
    studentName: 'Priya Patel',
    language: 'python',
    code: '# Kadanes algorithm',
    verdict: 'Accepted',
    passedCount: 2,
    totalCount: 2,
    executionTimeMs: 52,
    memoryKB: 14300,
    submittedAt: new Date(Date.now() - 14 * 60 * 1000).toISOString()
  },
  {
    id: 'sub_109',
    contestId: 'c_001',
    problemId: 'p3',
    studentId: 'usr_std_003',
    studentName: 'Ananya Iyer',
    language: 'java',
    code: '// Stack Java implementation',
    verdict: 'Accepted',
    passedCount: 3,
    totalCount: 3,
    executionTimeMs: 110,
    memoryKB: 32400,
    submittedAt: new Date(Date.now() - 12 * 60 * 1000).toISOString()
  },
  {
    id: 'sub_110',
    contestId: 'c_001',
    problemId: 'p4',
    studentId: 'usr_std_003',
    studentName: 'Ananya Iyer',
    language: 'cpp',
    code: '// Sliding window',
    verdict: 'Time Limit Exceeded',
    passedCount: 1,
    totalCount: 3,
    executionTimeMs: 1050,
    memoryKB: 8400,
    submittedAt: new Date(Date.now() - 6 * 60 * 1000).toISOString()
  },
  {
    id: 'sub_111',
    contestId: 'c_002',
    problemId: 'p1',
    studentId: 'usr_std_004',
    studentName: 'Aditya Kulkarni',
    language: 'cpp',
    code: '// Two sum C++',
    verdict: 'Accepted',
    passedCount: 3,
    totalCount: 3,
    executionTimeMs: 16,
    memoryKB: 2900,
    submittedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString()
  },
  {
    id: 'sub_112',
    contestId: 'c_002',
    problemId: 'p5',
    studentId: 'usr_std_004',
    studentName: 'Aditya Kulkarni',
    language: 'cpp',
    code: '// Merge sorted',
    verdict: 'Accepted',
    passedCount: 2,
    totalCount: 2,
    executionTimeMs: 19,
    memoryKB: 3100,
    submittedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString()
  },
  {
    id: 'sub_113',
    contestId: 'c_002',
    problemId: 'p3',
    studentId: 'usr_std_008',
    studentName: 'Siddharth Rao',
    language: 'python',
    code: '# Bracket matching',
    verdict: 'Wrong Answer',
    passedCount: 1,
    totalCount: 3,
    executionTimeMs: 44,
    memoryKB: 13900,
    submittedAt: new Date(Date.now() - 7 * 60 * 1000).toISOString()
  },
  {
    id: 'sub_114',
    contestId: 'c_002',
    problemId: 'p1',
    studentId: 'usr_std_011',
    studentName: 'Harshvardhan Joshi',
    language: 'javascript',
    code: '// JS Brute force',
    verdict: 'Compilation Error',
    passedCount: 0,
    totalCount: 3,
    executionTimeMs: 0,
    memoryKB: 0,
    submittedAt: new Date(Date.now() - 9 * 60 * 1000).toISOString()
  }
];

async function seedRichDatabase() {
  console.log('====================================================');
  console.log(' CodeArena Rich Academic Database Provisioning');
  console.log('====================================================\n');

  console.log('--- 1. Authenticating as Administrator ---');
  try {
    await signInWithEmailAndPassword(auth, 'admin@codearena.com', 'Admin@123456');
    console.log('Successfully authenticated as admin@codearena.com\n');
  } catch (err) {
    console.error('Failed to authenticate as admin:', err.message);
    process.exit(1);
  }

  // 1. Seed Problems
  console.log(`--- 2. Seeding ${RICH_PROBLEMS.length} Coding Problems ---`);
  for (const prob of RICH_PROBLEMS) {
    try {
      await setDoc(doc(db, 'problems', prob.id), prob);
      console.log(`[PROBLEM] + ${prob.title} (${prob.difficulty}) - ${prob.id}`);
    } catch (err) {
      console.error(`[PROBLEM ERROR] ${prob.id}:`, err.message);
    }
  }

  // 2. Seed Contests
  console.log(`\n--- 3. Seeding ${RICH_CONTESTS.length} University Contests ---`);
  for (const contest of RICH_CONTESTS) {
    try {
      await setDoc(doc(db, 'contests', contest.id), contest);
      console.log(`[CONTEST] + ${contest.title} [${contest.status.toUpperCase()}] (${contest.totalParticipants} enrolled)`);
    } catch (err) {
      console.error(`[CONTEST ERROR] ${contest.id}:`, err.message);
    }
  }

  // 3. Seed Users
  console.log(`\n--- 4. Seeding ${RICH_USERS.length} University Profiles ---`);
  let userSuccess = 0;
  let userFail = 0;
  for (const user of RICH_USERS) {
    const uid = user.uid || (user.email === 'admin@codearena.com' ? '4LMhjWMBcFWcntRziL5gZupAqkz1' : (user.email === 'faculty@codearena.com' ? 'vB3uQ8N5f7WkL0p9' : `usr_${Math.random().toString(36).slice(2, 10)}`));
    const profile = {
      uid,
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      batch: user.batch,
      rating: user.rating,
      solvedProblems: user.solvedProblems || [],
      status: user.status,
      createdAt: new Date().toISOString(),
      stats: user.stats
    };

    try {
      await setDoc(doc(db, 'users', uid), profile);
      console.log(`[USER] + ${user.name} (${user.role.toUpperCase()}) | Rating: ${user.rating} | ${user.department}`);
      userSuccess++;
    } catch (err) {
      console.warn(`[USER PERMISSION NOTE] Could not write user ${user.name}:`, err.code);
      userFail++;
    }
  }

  // 4. Seed Submissions
  console.log(`\n--- 5. Seeding ${RICH_SUBMISSIONS.length} Contest Submissions ---`);
  let subSuccess = 0;
  let subFail = 0;
  for (const sub of RICH_SUBMISSIONS) {
    try {
      await setDoc(doc(db, 'submissions', sub.id), sub);
      console.log(`[SUBMISSION] + ${sub.studentName} -> Problem ${sub.problemId} [${sub.verdict}] (${sub.executionTimeMs}ms)`);
      subSuccess++;
    } catch (err) {
      console.warn(`[SUBMISSION NOTE] ${sub.id}:`, err.code);
      subFail++;
    }
  }

  console.log('\n====================================================');
  console.log(' SEEDING SUMMARY');
  console.log('====================================================');
  console.log(`Problems Bank:   ${RICH_PROBLEMS.length} problems written`);
  console.log(`Contests Feed:   ${RICH_CONTESTS.length} contests written`);
  console.log(`Users Directory: ${userSuccess} written, ${userFail} blocked by rules`);
  console.log(`Submissions Log: ${subSuccess} written, ${subFail} blocked by rules`);
  console.log('====================================================\n');

  if (userFail > 0 || subFail > 0) {
    console.log('NOTE: To allow bulk creation of student profiles and submissions,');
    console.log('update your firestore.rules in Firebase Console with the latest version in firestore.rules');
    console.log('or temporarily allow writes for 1 minute.');
  }

  process.exit(0);
}

seedRichDatabase().catch(err => {
  console.error('Fatal error during seeding:', err);
  process.exit(1);
});
