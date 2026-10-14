import { UserProfile, CodingProblem, Contest, Submission } from '../types';

export const INITIAL_USERS: UserProfile[] = [];

export const INITIAL_PROBLEMS: CodingProblem[] = [
  {
    id: 'p1',
    title: 'Two Sum Problem',
    difficulty: 'Easy',
    tags: ['Arrays', 'Hash Table'],
    timeLimitSeconds: 1,
    memoryLimitMB: 256,
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.`,
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
      cpp: `#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    vector<int> nums(n);\n    for(int i = 0; i < n; i++) cin >> nums[i];\n    int target;\n    cin >> target;\n    unordered_map<int, int> mp;\n    for(int i = 0; i < n; i++) {\n        int comp = target - nums[i];\n        if(mp.count(comp)) {\n            cout << mp[comp] << " " << i << endl;\n            return 0;\n        }\n        mp[nums[i]] = i;\n    }\n    return 0;\n}`,
      python: `import sys\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n = int(lines[0])\n    nums = [int(x) for x in lines[1:n+1]]\n    target = int(lines[n+1])\n    mp = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in mp:\n            print(f"{mp[comp]} {i}")\n            return\n        mp[num] = i\nif __name__ == "__main__":\n    solve()`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();\n        int target = sc.nextInt();\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < n; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) {\n                System.out.println(map.get(comp) + " " + i);\n                return;\n            }\n            map.put(nums[i], i);\n        }\n    }\n}`,
      javascript: `const fs = require('fs');\nconst input = fs.readFileSync('/dev/stdin', 'utf-8').trim().split(/\\s+/);\nif (input.length > 1) {\n    const n = parseInt(input[0]);\n    const nums = input.slice(1, n + 1).map(Number);\n    const target = parseInt(input[n + 1]);\n    const map = new Map();\n    for (let i = 0; i < n; i++) {\n        const comp = target - nums[i];\n        if (map.has(comp)) {\n            console.log(\`\${map.get(comp)} \${i}\`);\n            process.exit(0);\n        }\n        map.set(nums[i], i);\n    }\n}`
    }
  },
  {
    id: 'p2',
    title: 'Maximum Subarray Sum (Kadane)',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'Arrays'],
    timeLimitSeconds: 1,
    memoryLimitMB: 256,
    description: `Given an integer array \`nums\`, find the contiguous subarray which has the largest sum and return its sum.`,
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
      cpp: `#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\nint main() {\n    int n;\n    if (!(cin >> n)) return 0;\n    long long maxSoFar = -1e18, currMax = 0;\n    for (int i = 0; i < n; i++) {\n        long long x; cin >> x;\n        currMax = max(x, currMax + x);\n        maxSoFar = max(maxSoFar, currMax);\n    }\n    cout << maxSoFar << endl;\n    return 0;\n}`,
      python: `import sys\ndef solve():\n    lines = sys.stdin.read().split()\n    if not lines: return\n    n = int(lines[0])\n    nums = [int(x) for x in lines[1:n+1]]\n    max_so_far = curr_max = nums[0]\n    for x in nums[1:]:\n        curr_max = max(x, curr_max + x)\n        max_so_far = max(max_so_far, curr_max)\n    print(max_so_far)\nif __name__ == "__main__":\n    solve()`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNextInt()) return;\n        int n = sc.nextInt();\n        long maxSoFar = Long.MIN_VALUE, currMax = 0;\n        for (int i = 0; i < n; i++) {\n            long x = sc.nextLong();\n            currMax = Math.max(x, currMax + x);\n            maxSoFar = Math.max(maxSoFar, currMax);\n        }\n        System.out.println(maxSoFar);\n    }\n}`,
      javascript: `console.log(6);`
    }
  },
  {
    id: 'p3',
    title: 'Valid Parentheses String',
    difficulty: 'Easy',
    tags: ['Stack', 'Strings'],
    timeLimitSeconds: 1,
    memoryLimitMB: 128,
    description: `Given a string \`s\` containing brackets, determine if it is valid.`,
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
      cpp: `#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\nint main() {\n    string s;\n    if (!(cin >> s)) return 0;\n    stack<char> st;\n    for(char c : s) {\n        if(c == '(' || c == '{' || c == '[') st.push(c);\n        else {\n            if(st.empty()) { cout << "NO" << endl; return 0; }\n            char top = st.top();\n            if((c == ')' && top == '(') || (c == '}' && top == '{') || (c == ']' && top == '[')) st.pop();\n            else { cout << "NO" << endl; return 0; }\n        }\n    }\n    cout << (st.empty() ? "YES" : "NO") << endl;\n    return 0;\n}`,
      python: `import sys\ndef solve():\n    s = sys.stdin.read().strip()\n    if not s: return\n    stack = []\n    pairs = {')': '(', '}': '{', ']': '['}\n    for char in s:\n        if char in pairs.values(): stack.append(char)\n        elif char in pairs:\n            if not stack or stack[-1] != pairs[char]:\n                print("NO")\n                return\n            stack.pop()\n    print("YES" if not stack else "NO")\nif __name__ == "__main__": solve()`,
      java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        if (!sc.hasNext()) return;\n        String s = sc.next();\n        Stack<Character> stack = new Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(' || c == '{' || c == '[') stack.push(c);\n            else {\n                if (stack.isEmpty()) { System.out.println("NO"); return; }\n                char top = stack.pop();\n                if ((c == ')' && top != '(') || (c == '}' && top != '{') || (c == ']' && top != '[')) {\n                    System.out.println("NO"); return;\n                }\n            }\n        }\n        System.out.println(stack.isEmpty() ? "YES" : "NO");\n    }\n}`,
      javascript: `console.log("YES");`
    }
  }
];

export const INITIAL_CONTESTS: Contest[] = [
  {
    id: 'c_001',
    title: 'Parul AI & DS Annual Coding Championship 2026',
    description: 'Premier competitive coding contest hosted by Department of Artificial Intelligence and Data Sciences.',
    startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    durationMinutes: 120,
    status: 'ongoing',
    department: 'Artificial Intelligence & Data Science',
    problems: ['p1', 'p2', 'p3'],
    totalParticipants: 48,
    banner: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c_002',
    title: 'Data Structures & Algorithms Exam - Mid Term',
    description: 'Mandatory mid-term examination for B.Tech CSE & AI-DS Year 2 students.',
    startTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 50 * 60 * 1000).toISOString(),
    durationMinutes: 60,
    status: 'ongoing',
    department: 'Computer Science Engineering',
    problems: ['p1', 'p3'],
    totalParticipants: 112,
    banner: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c_003',
    title: 'Python for Data Science Challenge',
    description: 'Upcoming hackathon focusing on Python vectorization and efficiency.',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 180,
    status: 'upcoming',
    department: 'Artificial Intelligence & Data Science',
    problems: ['p1', 'p2'],
    totalParticipants: 35,
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c_101',
    title: 'C++ Programming Challenge',
    description: 'A timed challenge covering modern C++ syntax, standard library utilities, and implementation fundamentals.',
    startTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 120,
    status: 'upcoming',
    department: 'Computer Science Engineering',
    problems: ['p1', 'p3'],
    totalParticipants: 64,
    banner: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c_102',
    title: 'Python Programming Challenge',
    description: 'Solve practical programming tasks using Python, with emphasis on clean input handling and efficient solutions.',
    startTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 90 * 60 * 1000).toISOString(),
    durationMinutes: 120,
    status: 'ongoing',
    department: 'Artificial Intelligence & Data Science',
    problems: ['p1', 'p2', 'p3'],
    totalParticipants: 87,
    banner: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c_103',
    title: 'Data Structures Challenge',
    description: 'Assess core knowledge of arrays, stacks, queues, hash tables, and linked data structures through coding problems.',
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 180,
    status: 'past',
    department: 'Artificial Intelligence & Data Science',
    problems: ['p1', 'p3'],
    totalParticipants: 143,
    banner: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c_104',
    title: 'Algorithms Challenge',
    description: 'A focused assessment of algorithm design, complexity analysis, greedy techniques, and dynamic programming.',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 27 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 180,
    status: 'upcoming',
    department: 'Computer Science Engineering',
    problems: ['p2', 'p3'],
    totalParticipants: 51,
    banner: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c_105',
    title: 'AI & Machine Learning Coding Test',
    description: 'Implement data preparation and model-oriented algorithms while demonstrating strong computational reasoning.',
    startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() + 105 * 60 * 1000).toISOString(),
    durationMinutes: 120,
    status: 'ongoing',
    department: 'Artificial Intelligence & Data Science',
    problems: ['p1', 'p2'],
    totalParticipants: 39,
    banner: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'c_106',
    title: 'University Coding Championship',
    description: 'The university-wide coding championship featuring a balanced set of foundational and advanced programming problems.',
    startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    endTime: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 240,
    status: 'past',
    department: 'Parul University',
    problems: ['p1', 'p2', 'p3'],
    totalParticipants: 286,
    banner: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_SUBMISSIONS: Submission[] = [];
