import { test, describe } from 'node:test';
import assert from 'node:assert';
import {
  ALLOWED_LANGUAGES,
  JUDGE0_LANGUAGE_IDS,
  normalizeOutput,
  executeWithJudge0,
  isJudge0Configured
} from '../lib/serverJudge0';

describe('Judge0 Code Execution & Validation Suite', () => {
  test('allowed languages and their Judge0 language IDs are strictly defined', () => {
    assert.deepStrictEqual(ALLOWED_LANGUAGES, ['cpp', 'python', 'java', 'javascript']);
    assert.strictEqual(JUDGE0_LANGUAGE_IDS.cpp, 54);
    assert.strictEqual(JUDGE0_LANGUAGE_IDS.python, 71);
    assert.strictEqual(JUDGE0_LANGUAGE_IDS.java, 62);
    assert.strictEqual(JUDGE0_LANGUAGE_IDS.javascript, 63);
  });

  test('normalizeOutput strips Windows carriage returns and trailing whitespace', () => {
    const raw = '0 1 \r\n';
    const normalized = normalizeOutput(raw);
    assert.strictEqual(normalized, '0 1');

    const multiLine = '10\r\n20   \r\n\r\n';
    assert.strictEqual(normalizeOutput(multiLine), '10\n20');
  });

  test('execution rejects empty source code', async () => {
    await assert.rejects(
      async () => {
        await executeWithJudge0({
          code: '   ',
          language: 'python'
        });
      },
      { message: 'Source code cannot be empty.' }
    );
  });

  test('execution rejects unsupported programming languages', async () => {
    await assert.rejects(
      async () => {
        await executeWithJudge0({
          code: 'puts "hello"',
          language: 'ruby'
        });
      },
      (err: any) => err.message.includes('not supported')
    );
  });

  test('execution rejects oversized source code exceeding 64 KB', async () => {
    const hugeCode = 'a'.repeat(65 * 1024);
    await assert.rejects(
      async () => {
        await executeWithJudge0({
          code: hugeCode,
          language: 'python'
        });
      },
      (err: any) => err.message.includes('exceeds maximum size limit')
    );
  });

  test('execution fails cleanly with clear error when Judge0 is unconfigured rather than fabricating fake stdout', async () => {
    // When JUDGE0_API_KEY is not set or placeholder
    const originalKey = process.env.JUDGE0_API_KEY;
    try {
      delete process.env.JUDGE0_API_KEY;
      assert.strictEqual(isJudge0Configured(), false);

      await assert.rejects(
        async () => {
          await executeWithJudge0({
            code: 'print("hello")',
            language: 'python'
          });
        },
        (err: any) => err.message.includes('Judge0 code execution service is not configured')
      );
    } finally {
      if (originalKey) process.env.JUDGE0_API_KEY = originalKey;
    }
  });
});
