'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '../../components/AppShell';
import { useAuth } from '../../components/AuthProvider';
import { Mail, Building2, Calendar, CheckCircle2, Flame, Award } from 'lucide-react';
import { RoleAvatar } from '../../components/RoleAvatar';

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh] text-indigo-400 font-mono text-sm animate-pulse">
          Loading profile details...
        </div>
      </AppShell>
    );
  }

  if (!user) return null;
  const profileUser = user;

  const solvedCount = profileUser.stats?.problemsSolved ?? profileUser.solvedProblems?.length ?? 0;
  const accuracy = profileUser.stats?.accuracy ?? 100;
  const streak = profileUser.stats?.streak ?? 0;
  const rating = profileUser.rating ?? 1500;

  let rankTitle = 'Specialist';
  if (rating >= 2100) rankTitle = 'Grandmaster';
  else if (rating >= 1900) rankTitle = 'Master';
  else if (rating >= 1700) rankTitle = 'Knight';
  else if (rating >= 1500) rankTitle = 'Specialist';
  else rankTitle = 'Pupil';

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <RoleAvatar role={profileUser.role} className="w-24 h-24" />

            <div className="text-center sm:text-left space-y-2 flex-1">
              <div className="flex items-center justify-center sm:justify-start gap-3">
                <h1 className="text-2xl font-extrabold text-slate-100">{profileUser.name}</h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 uppercase">
                  {profileUser.role}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{profileUser.email}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{profileUser.department}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Batch {profileUser.batch}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">ML Rating</span>
              <span className="text-3xl font-extrabold text-indigo-400 font-mono">{rating}</span>
              <span className="text-[11px] text-emerald-400 font-semibold block mt-1">{rankTitle} Rank</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <span className="text-2xl font-extrabold text-slate-100 block font-mono">
              {solvedCount}
            </span>
            <span className="text-xs text-slate-400 uppercase font-semibold">Problems Solved</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <Award className="w-8 h-8 text-indigo-400 mx-auto" />
            <span className="text-2xl font-extrabold text-slate-100 block font-mono">
              {accuracy}%
            </span>
            <span className="text-xs text-slate-400 uppercase font-semibold">Accuracy Rate</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-2">
            <Flame className="w-8 h-8 text-rose-400 mx-auto" />
            <span className="text-2xl font-extrabold text-slate-100 block font-mono">
              {streak} Days
            </span>
            <span className="text-xs text-slate-400 uppercase font-semibold">Active Streak</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
