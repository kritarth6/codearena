'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../components/AppShell';
import { useAuth } from '../../components/AuthProvider';
import { Trophy, Medal, Filter, Search, Award, Sparkles } from 'lucide-react';
import { dataService } from '../../lib/services';
import { UserProfile } from '../../types';
import { RoleAvatar } from '../../components/RoleAvatar';

export default function LeaderboardPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [batchFilter, setBatchFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchRankings() {
      try {
        const list = await dataService.getUsers();
        const sorted = list
          .filter((u) => u.role === 'student')
          .sort((a, b) => (b.rating || 1500) - (a.rating || 1500));
        setUsers(sorted);
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
      }
    }
    fetchRankings();
  }, []);

  const filteredUsers = users.filter((u) => {
    if (departmentFilter !== 'All' && u.department !== departmentFilter) return false;
    if (batchFilter !== 'All' && u.batch !== batchFilter) return false;
    if (searchQuery && !u.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold font-mono"><Trophy className="w-4 h-4" /></div>;
    if (rank === 2) return <div className="w-8 h-8 rounded-full bg-slate-300/20 text-slate-300 border border-slate-300/40 flex items-center justify-center font-bold font-mono"><Medal className="w-4 h-4" /></div>;
    if (rank === 3) return <div className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-600 border border-amber-700/40 flex items-center justify-center font-bold font-mono"><Award className="w-4 h-4" /></div>;
    return <span className="font-mono text-sm font-bold text-slate-400 w-8 text-center">#{rank}</span>;
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 p-8 border border-amber-500/20 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                ML Intelligent Ranking Engine
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                Global Competitive Leaderboard
              </h1>
              <p className="text-sm text-slate-300 mt-1 max-w-xl">
                Rankings updated dynamically after every contest evaluation based on accuracy, speed, and problem difficulty factors.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="px-5 py-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md text-center">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Top Student</span>
                <span className="text-lg font-extrabold text-amber-400 font-mono">
                  {users[0] ? `${users[0].name} (${users[0].rating || 1500})` : 'No students yet'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search student name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-xs rounded-xl pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-400 font-semibold">Department:</span>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-indigo-500"
              >
                <option value="All">All Departments</option>
                <option value="Artificial Intelligence & Data Science">AI & DS</option>
                <option value="Computer Science Engineering">CSE</option>
                <option value="Information Technology">IT</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Batch:</span>
              <select
                value={batchFilter}
                onChange={(e) => setBatchFilter(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 font-medium focus:outline-none focus:border-indigo-500 font-mono"
              >
                <option value="All">All Batches</option>
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Student</th>
                <th className="px-6 py-4">Department & Batch</th>
                <th className="px-6 py-4">Problems Solved</th>
                <th className="px-6 py-4">Accuracy</th>
                <th className="px-6 py-4 text-right">ML Rating</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredUsers.map((u, idx) => {
                const rank = idx + 1;
                const isCurrentUser = currentUser?.uid === u.uid;
                return (
                  <tr
                    key={u.uid}
                    className={`transition-colors ${
                      isCurrentUser ? 'bg-indigo-950/40 border-l-4 border-indigo-500' : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="px-6 py-4">{getRankBadge(rank)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <RoleAvatar role={u.role} />
                        <div>
                          <span className="font-bold text-slate-100 block">{u.name}</span>
                          {isCurrentUser && <span className="text-[10px] text-indigo-400 font-bold uppercase">(You)</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">
                      {u.department || 'AI & DS'} · <span className="font-mono text-slate-300">{u.batch}</span>
                    </td>
                    <td className="px-6 py-4 font-mono">{u.stats?.problemsSolved || u.solvedProblems?.length || 0} Solved</td>
                    <td className="px-6 py-4 font-mono text-emerald-400">{u.stats?.accuracy !== undefined ? u.stats.accuracy : 100}%</td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono font-extrabold text-indigo-400 text-sm">{u.rating || 1500}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
