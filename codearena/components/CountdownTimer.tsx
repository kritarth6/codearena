'use client';

import React, { useState, useEffect } from 'react';
import { Timer, AlertCircle } from 'lucide-react';

interface CountdownTimerProps {
  initialMinutes?: number;
  initialSeconds?: number;
  endTime?: string;
  onTimeUp?: () => void;
  autoStart?: boolean;
}

export function CountdownTimer({ initialMinutes = 60, initialSeconds, endTime, onTimeUp, autoStart = true }: CountdownTimerProps) {
  const getRemainingSeconds = React.useCallback(() => {
    if (endTime) {
      const endTimestamp = new Date(endTime).getTime();
      if (!Number.isNaN(endTimestamp)) {
        return Math.max(0, Math.ceil((endTimestamp - Date.now()) / 1000));
      }
    }
    return initialSeconds ?? initialMinutes * 60;
  }, [endTime, initialSeconds, initialMinutes]);

  const [timeLeft, setTimeLeft] = useState(getRemainingSeconds);

  useEffect(() => {
    if (!autoStart) return;

    setTimeLeft(getRemainingSeconds());

    const interval = setInterval(() => {
      const remaining = getRemainingSeconds();
      setTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        onTimeUp?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [autoStart, getRemainingSeconds, onTimeUp]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  const isWarning = timeLeft <= 300;
  const isCritical = timeLeft <= 60;

  const formatUnit = (num: number) => String(num).padStart(2, '0');

  return (
    <div
      className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl font-mono text-lg font-bold shadow-lg transition-all ${
        isCritical
          ? 'bg-rose-950/80 text-rose-400 border border-rose-500/50 animate-bounce'
          : isWarning
          ? 'bg-amber-950/70 text-amber-300 border border-amber-500/40 glow-amber'
          : 'bg-slate-900/90 text-indigo-400 border border-indigo-500/30 glow-purple'
      }`}
    >
      {isCritical ? (
        <AlertCircle className="w-5 h-5 text-rose-400 animate-spin" />
      ) : (
        <Timer className="w-5 h-5 text-indigo-400" />
      )}
      <span>
        {hours > 0 && `${formatUnit(hours)}:`}
        {formatUnit(minutes)}:{formatUnit(seconds)}
      </span>
      {isWarning && (
        <span className="text-xs font-sans px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
          Ending Soon
        </span>
      )}
    </div>
  );
}
