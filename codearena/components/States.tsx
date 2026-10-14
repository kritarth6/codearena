'use client';

import React from 'react';
import { Inbox, AlertCircle, RefreshCw, LucideIcon } from 'lucide-react';

export function LoadingSkeleton({ count = 3, className = "" }: { count?: number; className?: string }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-2xl bg-slate-900 border border-slate-800 p-6">
          <div className="h-5 bg-slate-800 rounded w-1/3 mb-4" />
          <div className="h-4 bg-slate-800/60 rounded w-3/4 mb-2" />
          <div className="h-4 bg-slate-800/40 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  title = "No data found",
  description = "There are no records to display at this time.",
  icon: Icon = Inbox,
  actionText,
  onAction
}: {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800 border-dashed">
      <div className="p-4 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-100">{title}</h3>
      <p className="mt-1 text-sm text-slate-400 max-w-md">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-all shadow-md"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export function ErrorCard({ message = "An error occurred while loading data.", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 flex items-start gap-4">
      <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
      <div className="flex-1">
        <h4 className="font-semibold text-rose-200">Execution Error</h4>
        <p className="mt-1 text-sm text-rose-300/80">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-rose-300 hover:text-white underline"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Try again
          </button>
        )}
      </div>
    </div>
  );
}
