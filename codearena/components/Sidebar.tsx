'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserProfile } from '../types';
import { 
  Code2, 
  Home, 
  Trophy, 
  BarChart3, 
  User, 
  LogOut, 
  PlusSquare, 
  BookOpen, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { RoleAvatar } from './RoleAvatar';

interface SidebarProps {
  user: UserProfile | null;
  onLogout: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ user, onLogout, collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const role = user?.role || 'student';

  const studentNav = [
    { name: 'Dashboard', path: '/student/dashboard', icon: Home },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'My Profile', path: '/profile', icon: User },
  ];

  const facultyNav = [
    { name: 'Faculty Portal', path: '/faculty/dashboard', icon: GraduationCap },
    { name: 'Students & Progress', path: '/faculty/dashboard?tab=students', icon: Users },
    { name: 'Manage Contests', path: '/faculty/dashboard?tab=contests', icon: PlusSquare },
    { name: 'Problem Bank', path: '/faculty/dashboard?tab=problems', icon: BookOpen },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const adminNav = [
    { name: 'Admin Dashboard', path: '/admin/dashboard', icon: ShieldCheck },
    { name: 'User Management', path: '/admin/dashboard?tab=users', icon: Users },
    { name: 'Platform Analytics', path: '/admin/dashboard?tab=analytics', icon: BarChart3 },
    { name: 'Faculty Portal', path: '/faculty/dashboard', icon: GraduationCap },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
  ];

  const navItems = role === 'admin' ? adminNav : role === 'faculty' ? facultyNav : studentNav;

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-lg glow-purple shrink-0">
              <Code2 className="w-6 h-6" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-white via-slate-100 to-indigo-300 bg-clip-text text-transparent">
                  CODEARENA
                </span>
                <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-widest">
                  Parul AI & DS
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="p-3 space-y-1.5 mt-2">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.path || (item.path.includes('?') && pathname.startsWith(item.path.split('?')[0]));
            return (
              <Link
                key={idx}
                href={item.path}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl font-medium text-sm transition-all group ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg glow-purple font-semibold'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t border-slate-800 space-y-2">
        {!collapsed && user && (
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
            <RoleAvatar role={user.role} className="w-9 h-9" />
            <div className="overflow-hidden flex-1">
              <h4 className="text-xs font-bold text-slate-200 truncate">{user.name}</h4>
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider block">
                {user.role}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 border border-transparent transition-all"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
