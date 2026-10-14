'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../../components/AppShell';
import { useAuth } from '../../../components/AuthProvider';
import { StatCard } from '../../../components/StatCard';
import { UserNotRegisteredError } from '../../../components/UserNotRegisteredError';
import { Users, ShieldCheck, UserCheck, Server, RefreshCw } from 'lucide-react';
import { dataService } from '../../../lib/services';
import { UserProfile, UserRole } from '../../../types';
import { RoleAvatar } from '../../../components/RoleAvatar';

export default function AdminDashboardPage() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);

  const loadUsers = async () => {
    try {
      const list = await dataService.getUsers();
      setUsers(list);
    } catch (err) {
      console.error("Failed to load admin users:", err);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      loadUsers();
    }
  }, [user]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh] text-indigo-400 font-mono text-sm animate-pulse">
          Verifying administrative authorization...
        </div>
      </AppShell>
    );
  }

  if (!user || user.role !== 'admin') {
    return <UserNotRegisteredError roleRequired="admin" />;
  }

  const handleStatusToggle = async (uid: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'blocked' : 'active';
    await dataService.updateUserRoleOrStatus(uid, { status: nextStatus as any });
    loadUsers();
  };

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    await dataService.updateUserRoleOrStatus(uid, { role: newRole });
    loadUsers();
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              System Administration
            </div>
            <h1 className="text-2xl font-extrabold text-slate-100">
              User Management & System Governance
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage user authorization, approve/block accounts, and configure institutional access policies.
            </p>
          </div>

          <button
            onClick={loadUsers}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Registry
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Total Platform Users"
            value={users.length}
            subtitle="Registered across departments"
            icon={Users}
            color="indigo"
          />
          <StatCard
            title="Active Accounts"
            value={users.filter((u) => u.status === 'active').length}
            subtitle="Authorized users"
            icon={UserCheck}
            color="emerald"
          />
          <StatCard
            title="System Health"
            value="99.9% Uptime"
            subtitle="Judge0 & Firestore Sync OK"
            icon={Server}
            color="amber"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-100">Registered Users Directory</h2>

          <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Department / Batch</th>
                  <th className="px-6 py-4">Account Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {users.map((u) => (
                  <tr key={u.uid} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <RoleAvatar role={u.role} />
                        <span className="font-bold text-slate-100">{u.name}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-slate-300">{u.email}</td>

                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.uid, e.target.value as UserRole)}
                        className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1 font-semibold focus:outline-none focus:border-indigo-500"
                      >
                        <option value="student">student</option>
                        <option value="faculty">faculty</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>

                    <td className="px-6 py-4 text-slate-400">
                      {u.department} ({u.batch})
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase ${
                          u.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleStatusToggle(u.uid, u.status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          u.status === 'active'
                            ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                            : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        {u.status === 'active' ? 'Block Account' : 'Approve Account'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
