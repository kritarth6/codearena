'use client';

import React from 'react';
import useRouter from 'next/navigation';
import Link from 'next/link';
import { Contest } from '../types';
import { Trophy, Clock, Users, Calendar, Play } from 'lucide-react';

export function ContestCard({ contest, onStart }: { contest: Contest; onStart?: (id: string) => void }) {
  const isOngoing = contest.status === 'ongoing';
  const isUpcoming = contest.status === 'upcoming';
  const isPast = contest.status === 'past';

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between">
      <div 
        className="h-32 w-full bg-cover bg-center relative"
        style={{ backgroundImage: `url(${contest.banner || 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80'})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        
        <div className="absolute top-3 left-3">
          {isOngoing && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow-md animate-pulse">
              <span className="w-2 h-2 rounded-full bg-slate-950" />
              LIVE CONTEST
            </span>
          )}
          {isUpcoming && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 backdrop-blur-md">
              UPCOMING
            </span>
          )}
          {isPast && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
              ENDED
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-950/80 text-slate-300 border border-slate-700 backdrop-blur-md">
            {contest.department || 'Parul AI & DS'}
          </span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1">
            {contest.title}
          </h3>
          <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {contest.description}
          </p>
        </div>

        <div className="mt-5 space-y-2 border-t border-slate-800/80 pt-4 text-xs text-slate-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>Start Time</span>
            </div>
            <span className="font-mono text-slate-200">{formatDate(contest.startTime)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Duration</span>
            </div>
            <span className="font-mono text-slate-200">
              {contest.durationSeconds ? `${contest.durationSeconds} Seconds` : `${contest.durationMinutes} Minutes`}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Participants</span>
            </div>
            <span className="font-mono text-slate-200">{contest.totalParticipants || 0} Registered</span>
          </div>
        </div>

        <div className="mt-5">
          {isOngoing && (
            <Link
              href={`/contest/${contest.id}/live`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg glow-purple transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Contest
            </Link>
          )}

          {isUpcoming && (
            <button
              onClick={() => alert('Contest unlocks at the scheduled start time!')}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all border border-slate-700"
            >
              Scheduled / Reminder Set
            </button>
          )}

          {isPast && (
            <Link
              href={`/contest/${contest.id}/results`}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 font-semibold text-sm transition-all border border-slate-800"
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              View Leaderboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
