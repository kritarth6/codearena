'use client';

import React from 'react';
import { ShieldAlert, UserPlus, LogIn } from 'lucide-react';
import Link from 'next/link';

export function UserNotRegisteredError({ roleRequired = 'faculty' }: { roleRequired?: string }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center mb-6">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-slate-100">Access Restricted</h2>
        <p className="mt-3 text-sm text-slate-400 leading-relaxed">
          You need <span className="font-semibold text-amber-400 uppercase">{roleRequired}</span> privileges to view this page. Please sign in with an authorized account or register.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/login"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all shadow-lg glow-purple"
          >
            <LogIn className="w-4 h-4" />
            Sign In with Authorized Account
          </Link>
          <Link
            href="/register"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-all border border-slate-700"
          >
            <UserPlus className="w-4 h-4" />
            Create New Account
          </Link>
        </div>
      </div>
    </div>
  );
}
