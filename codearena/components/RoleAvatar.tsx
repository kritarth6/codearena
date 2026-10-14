'use client';

import React from 'react';
import { GraduationCap, ShieldCheck, UserRound } from 'lucide-react';
import { UserRole } from '../types';

export function RoleAvatar({ role, className = 'w-8 h-8' }: { role: UserRole; className?: string }) {
  const Icon = role === 'faculty' ? GraduationCap : role === 'admin' ? ShieldCheck : UserRound;
  const color = role === 'faculty' ? 'text-emerald-400 bg-emerald-500/10' : role === 'admin' ? 'text-rose-400 bg-rose-500/10' : 'text-indigo-400 bg-indigo-500/10';

  return (
    <span className={`${className} ${color} inline-flex items-center justify-center rounded-full border border-slate-700`} aria-hidden="true">
      <Icon className="w-1/2 h-1/2" />
    </span>
  );
}
