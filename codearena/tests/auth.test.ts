import { test, describe } from 'node:test';
import assert from 'node:assert';
import { registerUser, authenticateUser } from '../lib/auth';
import { dataService } from '../lib/services';
import { UserRole } from '../types';

describe('Authentication & Authorization Suite', () => {
  test('public registration strictly forces role to student even if another role is provided', async () => {
    const student = await registerUser({
      name: 'Test Student',
      email: `student_${Date.now()}@paruluniversity.ac.in`,
      password: 'password123',
      department: 'Artificial Intelligence & Data Science',
      batch: '2025',
      role: 'admin' as UserRole // Attempting privilege escalation
    });

    // The assigned role must remain 'student'
    assert.strictEqual(student.role, 'student', 'Role must be student and not elevated');
    assert.strictEqual(student.status, 'active');
    assert.strictEqual((student as any).passwordHash, undefined, 'Password hash must never be stored in profile');
    assert.strictEqual((student as any).password, undefined, 'Raw password must never be stored in profile');
  });

  test('registration fails when required fields are missing', async () => {
    await assert.rejects(
      async () => {
        await registerUser({
          name: '',
          email: 'missing@parul.ac.in',
          password: 'pass',
          department: 'AI & DS',
          batch: '2025'
        });
      },
      { message: 'Please complete all required fields.' }
    );
  });

  test('registration fails with invalid email format', async () => {
    await assert.rejects(
      async () => {
        await registerUser({
          name: 'Invalid Email User',
          email: 'not-an-email',
          password: 'password123',
          department: 'AI & DS',
          batch: '2025'
        });
      },
      { message: 'Please enter a valid email address.' }
    );
  });

  test('registration fails with password shorter than 6 characters', async () => {
    await assert.rejects(
      async () => {
        await registerUser({
          name: 'Short Password User',
          email: 'valid@paruluniversity.ac.in',
          password: '123',
          department: 'AI & DS',
          batch: '2025'
        });
      },
      { message: 'Password must be at least 6 characters long.' }
    );
  });

  test('blocked user cannot authenticate', async () => {
    const email = `blocked_${Date.now()}@paruluniversity.ac.in`;
    const user = await registerUser({
      name: 'Blocked Student',
      email,
      password: 'password123',
      department: 'AI & DS',
      batch: '2025'
    });

    // Admin blocks account
    await dataService.updateUserRoleOrStatus(user.uid, { status: 'blocked' });

    await assert.rejects(
      async () => {
        await authenticateUser(email, 'password123');
      },
      (err: any) => {
        return err.message.includes('blocked');
      }
    );
  });
});
