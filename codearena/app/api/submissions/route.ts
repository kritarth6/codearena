import { NextResponse } from 'next/server';
import { executeWithJudge0, isJudge0Configured } from '../../../lib/serverJudge0';
import { dataService } from '../../../lib/services';
import { TestCase } from '../../../types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentId,
      studentName = 'Student',
      contestId,
      problemId,
      code,
      language,
      tabSwitches = 0
    } = body;

    if (!studentId) {
      return NextResponse.json({ error: 'Authentication required. Missing student ID.' }, { status: 401 });
    }

    if (!contestId || !problemId) {
      return NextResponse.json({ error: 'Contest ID and Problem ID are required.' }, { status: 400 });
    }

    if (!code || typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Source code cannot be empty.' }, { status: 400 });
    }

    if (!language || typeof language !== 'string') {
      return NextResponse.json({ error: 'Programming language must be specified.' }, { status: 400 });
    }

    // Retrieve problem and all test cases from the trusted data store
    const problem = await dataService.getProblemById(problemId);
    if (!problem) {
      return NextResponse.json({ error: `Problem with ID '${problemId}' not found.` }, { status: 404 });
    }

    const sampleTests: TestCase[] = problem.sampleTests || [];
    const hiddenTests: TestCase[] = problem.hiddenTests || [];
    const allTests: TestCase[] = [...sampleTests, ...hiddenTests];

    if (allTests.length === 0) {
      return NextResponse.json(
        { error: 'Problem has no test cases configured for automated grading.' },
        { status: 500 }
      );
    }

    // Check Judge0 configuration
    if (!isJudge0Configured()) {
      return NextResponse.json(
        {
          error:
            'Judge0 execution service is not configured on the server. ' +
            'Please configure JUDGE0_API_KEY and JUDGE0_API_HOST in your environment variables.',
          verdict: 'Service Unavailable'
        },
        { status: 503 }
      );
    }

    let passedCount = 0;
    let finalVerdict: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Compilation Error' | 'Evaluating...' = 'Accepted';
    let maxExecutionTimeMs = 0;
    let maxMemoryKB = 0;
    let compileError = '';

    for (let i = 0; i < allTests.length; i++) {
      const test = allTests[i];

      const execResult = await executeWithJudge0({
        code,
        language,
        input: test.input,
        expectedOutput: test.output,
        timeLimitSeconds: problem.timeLimitSeconds || 2,
        memoryLimitMB: problem.memoryLimitMB || 128
      });

      maxExecutionTimeMs = Math.max(maxExecutionTimeMs, execResult.executionTimeMs);
      maxMemoryKB = Math.max(maxMemoryKB, execResult.memoryKB);

      if (execResult.verdict === 'Compilation Error') {
        finalVerdict = 'Compilation Error';
        compileError = execResult.stderr;
        break; // Stop execution on compilation error
      }

      if (execResult.verdict === 'Accepted') {
        passedCount++;
      } else {
        if (finalVerdict === 'Accepted') {
          finalVerdict = execResult.verdict as any;
        }
      }
    }

    const totalCount = allTests.length;
    const score = finalVerdict === 'Accepted' ? 100 : Math.round((passedCount / totalCount) * 100);
    const passRatio = `${passedCount}/${totalCount}`;

    // Persist submission record in trusted backend
    const savedSubmission = await dataService.submitSolution({
      studentId,
      studentName,
      contestId,
      problemId,
      code,
      language,
      verdict: finalVerdict,
      score,
      passRatio,
      executionTimeMs: maxExecutionTimeMs,
      memoryKB: maxMemoryKB
    });

    // Hidden test case inputs and expected outputs are NEVER returned in the client response
    return NextResponse.json({
      submissionId: savedSubmission.id,
      verdict: finalVerdict,
      score,
      passRatio,
      passedCount,
      totalCount,
      executionTimeMs: maxExecutionTimeMs,
      memoryKB: maxMemoryKB,
      compileError: compileError || undefined,
      tabSwitches
    });
  } catch (error: any) {
    console.error('Submission grading error:', error);
    const isConfigError = error.message?.includes('Judge0 code execution service is not configured');
    return NextResponse.json(
      {
        error: error.message || 'Submission evaluation failed.',
        verdict: isConfigError ? 'Service Unavailable' : 'Evaluation Error'
      },
      { status: isConfigError ? 503 : 500 }
    );
  }
}
