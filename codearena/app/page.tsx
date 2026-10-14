'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'admin') router.push('/admin/dashboard');
        else if (user.role === 'faculty') router.push('/faculty/dashboard');
        else router.push('/student/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  return (
    <div className="h-screen w-screen bg-slate-950 flex items-center justify-center text-slate-400 font-mono text-sm">
      Loading CodeArena Platform...
    </div>
  );
}
