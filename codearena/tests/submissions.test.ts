import { test, describe } from 'node:test';
import assert from 'node:assert';
import { dataService } from '../lib/services';
import { registerUser } from '../lib/auth';

describe('Submission Workflow & Data Persistence Suite', () => {
  test('submitting an accepted solution adds the problem to solvedProblems', async () => {
    const student = await registerUser({
      name: 'Solver Student',
      email: `solver_${Date.now()}@paruluniversity.ac.in`,
      password: 'password123',
      department: 'Computer Science Engineering',
      batch: '2025'
    });

    const sub1 = await dataService.submitSolution({
      studentId: student.uid,
      studentName: student.name,
      contestId: 'c_001',
      problemId: 'p1',
      code: 'int main(){}',
      language: 'cpp',
      verdict: 'Accepted',
      score: 100,
      passRatio: '3/3',
      executionTimeMs: 15,
      memoryKB: 2400
    });

    assert.strictEqual(sub1.verdict, 'Accepted');

    const users = await dataService.getUsers();
    const updatedStudent = users.find((u) => u.uid === student.uid);
    assert.ok(updatedStudent?.solvedProblems.includes('p1'), 'p1 should be in solvedProblems');
    assert.strictEqual(updatedStudent?.stats?.problemsSolved, 1);
  });

  test('submitting a duplicate accepted solution does not increment problemsSolved twice', async () => {
    const student = await registerUser({
      name: 'Duplicate Solver',
      email: `dupe_${Date.now()}@paruluniversity.ac.in`,
      password: 'password123',
      department: 'Information Technology',
      batch: '2025'
    });

    // First accepted submission for p2
    await dataService.submitSolution({
      studentId: student.uid,
      studentName: student.name,
      contestId: 'c_001',
      problemId: 'p2',
      code: 'code v1',
      language: 'python',
      verdict: 'Accepted',
      score: 100,
      passRatio: '2/2',
      executionTimeMs: 20,
      memoryKB: 2500
    });

    // Second accepted submission for the SAME problem p2
    await dataService.submitSolution({
      studentId: student.uid,
      studentName: student.name,
      contestId: 'c_001',
      problemId: 'p2',
      code: 'code v2',
      language: 'python',
      verdict: 'Accepted',
      score: 100,
      passRatio: '2/2',
      executionTimeMs: 18,
      memoryKB: 2500
    });

    const users = await dataService.getUsers();
    const updatedStudent = users.find((u) => u.uid === student.uid);

    // Filter duplicates
    const p2Occurrences = updatedStudent?.solvedProblems.filter((id) => id === 'p2');
    assert.strictEqual(p2Occurrences?.length, 1, 'Problem ID should appear exactly once');
    assert.strictEqual(updatedStudent?.stats?.problemsSolved, 1, 'Problems solved count must remain 1');
  });

  test('contest status dynamically reflects current time boundaries', async () => {
    const pastContest = await dataService.createContest({
      title: 'Historical Contest',
      startTime: new Date(Date.now() - 3600000).toISOString(),
      endTime: new Date(Date.now() - 1800000).toISOString(),
      durationMinutes: 30
    });
    assert.strictEqual(pastContest.status, 'past');

    const ongoingContest = await dataService.createContest({
      title: 'Current Live Contest',
      startTime: new Date(Date.now() - 1800000).toISOString(),
      endTime: new Date(Date.now() + 1800000).toISOString(),
      durationMinutes: 60
    });
    assert.strictEqual(ongoingContest.status, 'ongoing');

    const upcomingContest = await dataService.createContest({
      title: 'Future Contest',
      startTime: new Date(Date.now() + 3600000).toISOString(),
      endTime: new Date(Date.now() + 7200000).toISOString(),
      durationMinutes: 60
    });
    assert.strictEqual(upcomingContest.status, 'upcoming');
  });
});
