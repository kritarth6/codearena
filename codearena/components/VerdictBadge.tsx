'use client';

import React from 'react';
import { CheckCircle2, XCircle, Clock, AlertTriangle, Loader2 } from 'lucide-react';

export function VerdictBadge({ verdict, className = "" }: { verdict: string; className?: string }) {
  if (verdict === 'Running...' || verdict === 'Evaluating...') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 animate-pulse ${className}`}>
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        {verdict}
      </span>
    );
  }

  if (verdict === 'Accepted') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 glow-emerald ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        Accepted
      </span>
    );
  }

  if (verdict === 'Wrong Answer') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 ${className}`}>
        <XCircle className="w-3.5 h-3.5 text-rose-400" />
        Wrong Answer
      </span>
    );
  }

  if (verdict === 'Time Limit Exceeded') {
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 ${className}`}>
        <Clock className="w-3.5 h-3.5 text-amber-400" />
        Time Limit Exceeded
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/30 ${className}`}>
      <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
      {verdict || 'Compilation Error'}
    </span>
  );
}
