import { NextResponse } from 'next/server';
import { executeWithJudge0 } from '../../../lib/serverJudge0';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, language, input = '', expectedOutput = '' } = body;

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Source code is required.', verdict: 'Compilation Error', stdout: '', stderr: 'No code provided.' },
        { status: 400 }
      );
    }

    if (!language || typeof language !== 'string') {
      return NextResponse.json(
        { error: 'Language is required.', verdict: 'Compilation Error', stdout: '', stderr: 'No language specified.' },
        { status: 400 }
      );
    }

    const result = await executeWithJudge0({
      code,
      language,
      input,
      expectedOutput
    });

    return NextResponse.json(result);
  } catch (error: any) {
    const message = error.message || 'Execution failed';
    const isConfigError = message.includes('Judge0 code execution service is not configured');
    const isAuthError = message.includes('authentication failed');
    const isRateLimit = message.includes('rate limit');

    const status = isConfigError ? 503 : isAuthError ? 401 : isRateLimit ? 429 : 500;

    return NextResponse.json(
      {
        error: message,
        verdict: isConfigError ? 'Service Unavailable' : 'Execution Error',
        stdout: '',
        stderr: message,
        executionTimeMs: 0,
        memoryKB: 0
      },
      { status }
    );
  }
}
