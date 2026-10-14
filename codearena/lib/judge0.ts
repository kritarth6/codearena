import { Judge0ExecutionResult } from '../types';

export const executeCodeServerSide = async ({
  code,
  language,
  input = '',
  expectedOutput = ''
}: {
  code: string;
  language: string;
  input?: string;
  expectedOutput?: string;
}): Promise<Judge0ExecutionResult> => {
  const res = await fetch('/api/execute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      language,
      input,
      expectedOutput
    })
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const errorMsg = data?.error || data?.stderr || `Execution failed with status ${res.status}`;
    throw new Error(errorMsg);
  }

  return {
    verdict: data.verdict || 'Evaluation Complete',
    stdout: data.stdout || '',
    stderr: data.stderr || '',
    executionTimeMs: data.executionTimeMs || 0,
    memoryKB: data.memoryKB || 0
  };
};
