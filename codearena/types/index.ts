export type UserRole = 'student' | 'faculty' | 'admin';

export interface UserStats {
  problemsSolved: number;
  totalSubmissions?: number;
  accuracy: number;
  streak: number;
  rank?: number;
  contestsCreated?: number;
  problemsCreated?: number;
  totalUsersManaged?: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  department: string;
  batch: string;
  rating: number;
  solvedProblems: string[];
  status: 'active' | 'blocked';
  avatar?: string;
  createdAt?: string;
  stats?: UserStats;
}

export interface TestCase {
  input: string;
  output: string;
  explanation?: string;
}

export interface StarterCode {
  cpp?: string;
  python?: string;
  java?: string;
  javascript?: string;
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  timeLimitSeconds?: number;
  memoryLimitMB?: number;
  description: string;
  inputFormat?: string;
  outputFormat?: string;
  constraints?: string;
  sampleTests: TestCase[];
  hiddenTests: TestCase[];
  starterCode?: StarterCode;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
  durationSeconds?: number;
  status: 'upcoming' | 'ongoing' | 'past';
  department?: string;
  problems: string[];
  totalParticipants?: number;
  banner?: string;
}

export interface Submission {
  id: string;
  studentId: string;
  studentName?: string;
  contestId: string;
  problemId: string;
  code: string;
  language: string;
  verdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error' | 'Evaluating...';
  score: number;
  passRatio?: string;
  executionTimeMs?: number;
  memoryKB?: number;
  submittedAt: string;
}

export interface Judge0ExecutionRequest {
  code: string;
  language: string;
  input?: string;
  expectedOutput?: string;
}

export interface Judge0ExecutionResult {
  verdict: string;
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  memoryKB: number;
}

export interface ContestSubmissionRequest {
  contestId: string;
  problemId: string;
  code: string;
  language: string;
  tabSwitches?: number;
}

export interface ContestSubmissionResponse {
  submissionId: string;
  verdict: string;
  score: number;
  passedCount: number;
  totalCount: number;
  executionTimeMs: number;
  memoryKB: number;
  compileError?: string;
  ratingUpdate?: {
    oldRating: number;
    newRating: number;
    delta: number;
  };
}
