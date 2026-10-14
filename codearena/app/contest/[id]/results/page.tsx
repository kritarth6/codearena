'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '../../../../components/AppShell';
import { useAuth } from '../../../../components/AuthProvider';
import { Trophy, ShieldCheck, ShieldAlert, ArrowRight, Home, Sparkles } from 'lucide-react';
import { calculateNewRating, RatingResult } from '../../../../lib/mlRating';
import { dataService } from '../../../../lib/services';
import { Contest, Submission } from '../../../../types';

export default function ContestResultsPage() {
  const params = useParams();
  const contestId = (params?.id as string) || 'c_001';
  const router = useRouter();
  const { user, loading } = useAuth();

  const [contest, setContest] = useState<Contest | null>(null);
  const [ratingData, setRatingData] = useState<RatingResult | null>(null);
  const [contestScore, setContestScore] = useState(0);
  const [solvedCount, setSolvedCount] = useState(0);
  const [totalProblemsCount, setTotalProblemsCount] = useState(0);
  const [tabSwitches, setTabSwitches] = useState(0);
  const [calculating, setCalculating] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function initResults() {
      if (!user) return;
      setCalculating(true);

      const cData = await dataService.getContestById(contestId);
      setContest(cData);

      // Get student's real submissions for this contest
      const allSubmissions = await dataService.getSubmissions();
      const contestSubmissions = allSubmissions.filter(
        (s) => s.contestId === contestId && s.studentId === user.uid
      );

      const totalProblems = cData?.problems?.length || 1;
      setTotalProblemsCount(totalProblems);

      // Count unique problems solved by the student
      const acceptedProblemIds = new Set(
        contestSubmissions.filter((s) => s.verdict === 'Accepted').map((s) => s.problemId)
      );
      const solved = acceptedProblemIds.size;
      setSolvedCount(solved);

      const scoreAchieved = Math.round((solved / totalProblems) * 100);
      setContestScore(scoreAchieved);

      // Read real proctoring data from session
      let recordedSwitches = 0;
      if (typeof window !== 'undefined') {
        const stored = sessionStorage.getItem(`codearena_contest_${contestId}_tabSwitches`);
        recordedSwitches = stored ? parseInt(stored, 10) : 0;
      }
      setTabSwitches(recordedSwitches);

      // Calculate rating delta based on actual contest performance
      const contestDuration = cData?.durationMinutes || 120;
      const estimatedTimeSpent = Math.max(10, Math.min(contestDuration, Math.round(contestDuration * 0.4)));

      const oldRating = user.rating || 1500;
      const ratingDetails = calculateNewRating({
        oldRating,
        contestScore: scoreAchieved,
        timeSpentMinutes: estimatedTimeSpent,
        totalDurationMinutes: contestDuration
      });

      // Update student rating in the database
      await dataService.updateStudentRating(
        user.uid,
        scoreAchieved,
        estimatedTimeSpent,
        contestDuration
      );

      setRatingData(ratingDetails);
      setCalculating(false);
    }

    if (user) {
      initResults();
    }
  }, [contestId, user]);

  if (loading || calculating) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh] text-indigo-400 font-mono text-sm animate-pulse">
          Computing verified contest outcomes and ML rating updates...
        </div>
      </AppShell>
    );
  }

  if (!user) return null;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-indigo-950 p-8 border border-emerald-500/30 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center mb-4 glow-emerald">
            <Trophy className="w-8 h-8" />
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Contest Assessment Completed!
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            {contest?.title || 'Competitive Coding Contest'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-xl mx-auto mt-6">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold uppercase block">Score Achieved</span>
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                {contestScore} / 100
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold uppercase block">Problems Solved</span>
              <span className="text-3xl font-extrabold text-indigo-400 font-mono">
                {solvedCount} / {totalProblemsCount}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <span className="text-xs text-slate-400 font-semibold uppercase block">Pass Ratio</span>
              <span className="text-3xl font-extrabold text-amber-400 font-mono">
                {totalProblemsCount > 0 ? `${Math.round((solvedCount / totalProblemsCount) * 100)}%` : '0%'}
              </span>
            </div>
          </div>
        </div>

        {ratingData && (
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                <span>ML Rating Engine Updates</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                Tier: {ratingData.tier}
              </span>
            </div>

            <div className="flex items-center justify-around p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase block">Previous Rating</span>
                <span className="text-2xl font-bold text-slate-300 font-mono">{ratingData.oldRating}</span>
              </div>

              <div className={`${ratingData.delta >= 0 ? 'text-emerald-400' : 'text-rose-400'} font-bold text-xl font-mono`}>
                {ratingData.delta >= 0 ? `+${ratingData.delta}` : ratingData.delta} Rating
              </div>

              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase block">New ML Rating</span>
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">{ratingData.newRating}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs text-slate-400 text-center pt-2">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className="block text-slate-200 font-bold">{ratingData.accuracyPercentage}%</span>
                Accuracy Factor
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className="block text-slate-200 font-bold">+{ratingData.timeEfficiencyBonusPercentage}%</span>
                Efficiency Bonus
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60">
                <span className="block text-slate-200 font-bold">{ratingData.performanceIndex}</span>
                Performance Index
              </div>
            </div>
          </div>
        )}

        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${
              tabSwitches === 0
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
            }`}>
              {tabSwitches === 0 ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm">Anti-Cheating Proctoring Audit</h4>
              <p className="text-xs text-slate-400">
                {tabSwitches === 0
                  ? 'Zero tab switches detected during active exam session.'
                  : `${tabSwitches} window/tab switch events recorded by proctoring engine.`}
              </p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
            tabSwitches === 0
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            {tabSwitches === 0 ? 'PASSED' : 'FLAGGED FOR REVIEW'}
          </span>
        </div>

        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            onClick={() => router.push('/student/dashboard')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all border border-slate-700"
          >
            <Home className="w-4 h-4" />
            Back to Dashboard
          </button>
          <button
            onClick={() => router.push('/leaderboard')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg glow-purple transition-all"
          >
            View Global Leaderboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
