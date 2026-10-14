'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '../../../components/AppShell';
import { useAuth } from '../../../components/AuthProvider';
import { StatCard } from '../../../components/StatCard';
import { ContestCard } from '../../../components/ContestCard';
import { LoadingSkeleton, EmptyState } from '../../../components/States';
import { CheckCircle2, Flame, Trophy, Target, Sparkles, ArrowRight } from 'lucide-react';
import { dataService } from '../../../lib/services';
import { Contest } from '../../../types';

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadData() {
      try {
        const list = await dataService.getContests();
        setContests(list);
      } catch (err) {
        console.error("Failed to load dashboard contests:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (authLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh] text-indigo-400 font-mono text-sm animate-pulse">
          Loading student portal...
        </div>
      </AppShell>
    );
  }

  if (!user) {
    return null;
  }

  const ongoingContests = contests.filter((c) => c.status === 'ongoing');
  const upcomingContests = contests.filter((c) => c.status === 'upcoming');

  const solvedCount = user.stats?.problemsSolved ?? user.solvedProblems?.length ?? 0;
  const accuracy = user.stats?.accuracy ?? 100;
  const rating = user.rating ?? 1500;
  const streak = user.stats?.streak ?? 0;

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 p-8 border border-indigo-500/20 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                Student Portal · B.Tech {user?.department || 'AI & DS'}
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Welcome back, {user?.name || 'Student'}!
              </h1>
              <p className="mt-2 text-sm text-slate-300 max-w-xl leading-relaxed">
                Track your algorithmic rating, participate in live department exams, and hone your programming skills.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium block uppercase tracking-wider">ML Rating</span>
                <span className="text-2xl font-extrabold text-indigo-400 font-mono">{rating}</span>
              </div>
              <div className="p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
                <Trophy className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Problems Solved"
            value={solvedCount}
            subtitle="Total accepted submissions"
            icon={CheckCircle2}
            color="emerald"
          />
          <StatCard
            title="Accuracy Rate"
            value={`${accuracy}%`}
            subtitle="Test case pass ratio"
            icon={Target}
            color="indigo"
          />
          <StatCard
            title="Current Rating"
            value={rating}
            subtitle="ML Algorithmic Rank"
            icon={Trophy}
            color="amber"
          />
          <StatCard
            title="Daily Streak"
            value={`${streak} Days`}
            subtitle="Active practice streak"
            icon={Flame}
            color="rose"
          />
        </div>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-xl font-bold text-slate-100">Live Ongoing Contests & Exams</h2>
            </div>
            <span className="text-xs text-slate-400 font-mono">{ongoingContests.length} Active</span>
          </div>

          {loading ? (
            <LoadingSkeleton count={2} />
          ) : ongoingContests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ongoingContests.map((c) => (
                <ContestCard key={c.id} contest={c} />
              ))}
            </div>
          ) : (
            <EmptyState title="No Live Contests Right Now" description="Check the upcoming schedule below for future exams." />
          )}
        </section>

        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-100">Upcoming Contests</h2>
            <button
              onClick={() => router.push('/leaderboard')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              View Global Standings <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <LoadingSkeleton count={2} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingContests.map((c) => (
                <ContestCard key={c.id} contest={c} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
