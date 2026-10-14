# CodeArena — Online Coding Contest & Examination Platform

CodeArena is an enterprise-grade competitive coding and examination platform built for university students and academic institutions with Next.js 14, React 18, TypeScript, Tailwind CSS, Firebase Authentication, Cloud Firestore, and Judge0 code execution.

---

## 🌟 Key Architecture & Capabilities

- **Role-Based Portals**:
  - **Student Portal**: Live contests, real-time code editor, problem browser, submissions history, and performance stats.
  - **Faculty Portal**: Contest authoring & scheduling wizard, problem bank with sample & hidden test cases, class analytics, and student submission review.
  - **Admin Governance**: Centralized user directory, role assignment/elevation (Student, Faculty, Admin), and account moderation (block/unblock).
- **Split-Screen Contest IDE**:
  - LeetCode-style 50/50 responsive split screen with problem descriptions, input/output constraints, starter templates, and multi-language support (C++, Python, Java, JavaScript).
  - Monaco Code Editor with full indentation and syntax highlighting.
  - Anti-cheating proctoring with tab-switch detection, automated audit logging, and full-screen enforcement options.
- **Genuine Judge0 Evaluation Engine**:
  - Server-side sandbox compilation and multi-case automated judging.
  - Evaluates both sample tests and confidential hidden test cases on the backend.
  - Zero simulated outputs in production; immediate real verdicts: `Accepted`, `Wrong Answer`, `Time Limit Exceeded`, `Compilation Error`, `Runtime Error`.
- **Intelligent ML Rating**:
  - Real-time rating adjustments after contest submissions based on score accuracy, speed efficiency, and difficulty weighting.
  - Dynamic competitive tiers: Pupil, Specialist, Knight, Master, Grandmaster.

---

## 🚀 Setup & Local Development

### 1. Prerequisites
- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **npm**: v9+

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Configure your credentials in `.env.local`:
```env
# ------------------------------------------
# Firebase Client Configuration (Public)
# ------------------------------------------
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# ------------------------------------------
# Judge0 Code Execution Configuration (Server-Only)
# ------------------------------------------
JUDGE0_API_KEY=your_rapidapi_judge0_key
JUDGE0_API_HOST=judge0-ce.p.rapidapi.com
```

### 4. Firebase Setup & Security Rules
1. In the **Firebase Console**, enable **Email/Password** under Authentication > Sign-in method.
2. Under **Firestore Database**, create a database and deploy `firestore.rules`:
   ```bash
   firebase deploy --only firestore:rules
   ```
3. To initialize demo coding problems and contests in Firestore, run:
   ```bash
   npm run seed
   ```

### 5. Demo & Presentation Accounts

For academic showcases, faculty presentations, or testing each portal's role-based features:

| Role | Email | Password | Target Dashboard |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@codearena.com` | `Admin@123456` | `/admin/dashboard` |
| **Faculty** | `faculty@codearena.com` | `Faculty@123456` | `/faculty/dashboard` |
| **Student** | `student@codearena.com` | `Student@123456` | `/student/dashboard` |

### 6. Available CLI Commands
```bash
# Start local development server
npm run dev

# Verify live Firebase connection & credentials
npm run verify

# Run automated test suite (17/17 passing)
npm test

# Build production bundle
npm run build

# Provision showcase accounts & sample contests
npm run setup:demo
```

---

## 🔒 Security Architecture

1. **Authentication & Public Registration**:
   - Accounts are managed through Firebase Authentication with email and password.
   - Public registration strictly assigns the `student` role. Self-assignment of `faculty` or `admin` roles is prohibited.
   - Privileged roles (`faculty`, `admin`) can only be provisioned by authorized administrators via the Admin Dashboard.
2. **Backend Grading & Secret Isolation**:
   - Code execution requests are proxied strictly through Next.js server API routes (`/api/execute` and `/api/submissions`).
   - `JUDGE0_API_KEY` is server-only and never bundled into client-side JavaScript.
   - Hidden test case inputs and expected outputs are never returned to the browser.
3. **Database Rules & Data Integrity**:
   - Firestore Security Rules enforce document-level ownership and role verification.
   - Duplicate accepted submissions cannot repeatedly increment student solved problem counts.

---

## 🚢 Production Deployment (Vercel)

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Import the project into [Vercel](https://vercel.com):
   - **Framework Preset**: Next.js
   - **Root Directory**: `codearena` (or `./`)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
3. In Vercel Project Settings > **Environment Variables**, add:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`
   - `JUDGE0_API_KEY`
   - `JUDGE0_API_HOST`
4. In **Firebase Console > Authentication > Settings > Authorized domains**, add your Vercel deployment domain (e.g. `your-codearena.vercel.app`).
5. Click **Deploy**.
