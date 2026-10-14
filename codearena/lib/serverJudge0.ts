import { Judge0ExecutionResult } from '../types';

export const ALLOWED_LANGUAGES = ['cpp', 'python', 'java', 'javascript'] as const;
export type AllowedLanguage = (typeof ALLOWED_LANGUAGES)[number];

export const JUDGE0_LANGUAGE_IDS: Record<AllowedLanguage, number> = {
  cpp: 54,        // C++ (GCC 9.2.0)
  python: 71,     // Python (3.8.1)
  java: 62,       // Java (OpenJDK 13.0.1)
  javascript: 63  // JavaScript (Node.js 12.14.0)
};

export const MAX_CODE_SIZE_BYTES = 64 * 1024;    // 64 KB
export const MAX_INPUT_SIZE_BYTES = 32 * 1024;   // 32 KB

export function isJudge0Configured(): boolean {
  const key = process.env.JUDGE0_API_KEY;
  return Boolean(key && key !== 'your_rapidapi_judge0_key' && key.trim().length > 0);
}

export function normalizeOutput(str: string): string {
  if (!str) return '';
  return str
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
}

export interface ExecutionOptions {
  code: string;
  language: string;
  input?: string;
  expectedOutput?: string;
  timeLimitSeconds?: number;
  memoryLimitMB?: number;
}

export async function executeWithJudge0({
  code,
  language,
  input = '',
  expectedOutput = '',
  timeLimitSeconds = 2,
  memoryLimitMB = 128
}: ExecutionOptions): Promise<Judge0ExecutionResult> {
  const cleanCode = code ? code.trim() : '';
  const cleanInput = input ?? '';

  if (!cleanCode) {
    throw new Error('Source code cannot be empty.');
  }

  if (Buffer.byteLength(cleanCode, 'utf8') > MAX_CODE_SIZE_BYTES) {
    throw new Error(`Source code exceeds maximum size limit of ${MAX_CODE_SIZE_BYTES / 1024} KB.`);
  }

  if (Buffer.byteLength(cleanInput, 'utf8') > MAX_INPUT_SIZE_BYTES) {
    throw new Error(`Input exceeds maximum size limit of ${MAX_INPUT_SIZE_BYTES / 1024} KB.`);
  }

  const normalizedLang = language.toLowerCase() as AllowedLanguage;
  if (!ALLOWED_LANGUAGES.includes(normalizedLang)) {
    throw new Error(`Language '${language}' is not supported. Supported: ${ALLOWED_LANGUAGES.join(', ')}`);
  }

  const languageId = JUDGE0_LANGUAGE_IDS[normalizedLang];

  const apiKey = process.env.JUDGE0_API_KEY;
  const apiHost = process.env.JUDGE0_API_HOST || 'judge0-ce.p.rapidapi.com';

  if (!apiKey || apiKey === 'your_rapidapi_judge0_key') {
    throw new Error(
      'Judge0 code execution service is not configured. Please set the JUDGE0_API_KEY environment variable on the server.'
    );
  }

  const url = `https://${apiHost}/submissions?base64_encoded=false&wait=true`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-RapidAPI-Key': apiKey,
    'X-RapidAPI-Host': apiHost
  };

  const payload: any = {
    source_code: cleanCode,
    language_id: languageId,
    stdin: cleanInput,
    cpu_time_limit: Math.min(Math.max(timeLimitSeconds, 1), 5),
    memory_limit: Math.min(Math.max(memoryLimitMB * 1024, 32000), 256000)
  };

  if (expectedOutput) {
    payload.expected_output = expectedOutput;
  }

  let res: Response;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);
  } catch (err: any) {
    if (err.name === 'AbortError') {
      throw new Error('Judge0 request timed out after 12 seconds.');
    }
    throw new Error(`Network error connecting to Judge0: ${err.message || 'Connection failed'}`);
  }

  if (res.status === 401 || res.status === 403) {
    throw new Error('Judge0 authentication failed. Please verify JUDGE0_API_KEY.');
  }

  if (res.status === 429) {
    throw new Error('Judge0 execution rate limit reached. Please wait a few moments.');
  }

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Judge0 API error (${res.status}): ${errorText.slice(0, 200)}`);
  }

  let data = await res.json();

  // If Judge0 queued the job asynchronously (status.id <= 2 is In Queue or Processing)
  if (data.token && data.status && data.status.id <= 2) {
    const token = data.token;
    const pollUrl = `https://${apiHost}/submissions/${token}?base64_encoded=false`;

    for (let attempt = 0; attempt < 6; attempt++) {
      await new Promise((r) => setTimeout(r, 1000));
      const pollRes = await fetch(pollUrl, { headers });
      if (pollRes.ok) {
        data = await pollRes.json();
        if (data.status && data.status.id > 2) {
          break;
        }
      }
    }
  }

  const rawStdout = data.stdout || '';
  const rawStderr = data.stderr || '';
  const compileOutput = data.compile_output || '';
  const statusId = data.status?.id;
  const statusDesc = data.status?.description || 'Unknown';

  let verdict: string;
  let stderr = rawStderr;

  if (statusId === 3) {
    // Check output against expected output if provided
    if (expectedOutput) {
      const actualNorm = normalizeOutput(rawStdout);
      const expectedNorm = normalizeOutput(expectedOutput);
      if (actualNorm === expectedNorm) {
        verdict = 'Accepted';
      } else {
        verdict = 'Wrong Answer';
      }
    } else {
      verdict = 'Accepted';
    }
  } else if (statusId === 4) {
    verdict = 'Wrong Answer';
  } else if (statusId === 5) {
    verdict = 'Time Limit Exceeded';
  } else if (statusId === 6) {
    verdict = 'Compilation Error';
    stderr = compileOutput || rawStderr || 'Compilation failed.';
  } else if (statusId >= 7 && statusId <= 12) {
    verdict = 'Runtime Error';
    stderr = rawStderr || `Runtime error: ${statusDesc}`;
  } else {
    verdict = statusDesc.includes('Time')
      ? 'Time Limit Exceeded'
      : statusDesc.includes('Compilation')
      ? 'Compilation Error'
      : statusDesc.includes('Wrong')
      ? 'Wrong Answer'
      : statusDesc || 'Evaluation Error';
  }

  const executionTimeMs = data.time ? Math.round(parseFloat(data.time) * 1000) : 0;
  const memoryKB = data.memory ? Math.round(Number(data.memory)) : 0;

  return {
    verdict,
    stdout: rawStdout,
    stderr,
    executionTimeMs,
    memoryKB
  };
}
