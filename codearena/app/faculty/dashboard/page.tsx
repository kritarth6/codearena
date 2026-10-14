'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../../components/AppShell';
import { useAuth } from '../../../components/AuthProvider';
import { StatCard } from '../../../components/StatCard';
import { ContestForm } from '../../../components/ContestForm';
import { ProblemForm } from '../../../components/ProblemForm';
import { UserNotRegisteredError } from '../../../components/UserNotRegisteredError';
import { PlusSquare, BookOpen, BarChart3, Plus, Users, UserCheck, Trophy, FileCheck2, Eye, Pencil, Activity } from 'lucide-react';
import { dataService } from '../../../lib/services';
import { Contest, CodingProblem, Submission, UserProfile } from '../../../types';
import { RoleAvatar } from '../../../components/RoleAvatar';

export default function FacultyDashboardPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'students' | 'contests' | 'problems' | 'analytics'>('students');
  const [contests, setContests] = useState<Contest[]>([]);
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  const [showContestForm, setShowContestForm] = useState(false);
  const [showProblemForm, setShowProblemForm] = useState(false);
  const [editingContest, setEditingContest] = useState<Contest | null>(null);

  const loadData = async () => {
    try {
      const cList = await dataService.getContests();
      const pList = await dataService.getProblems();
      const submissions = await dataService.getSubmissions();
      setContests(cList);
      setProblems(pList);
      setStudents((await dataService.getUsers()).filter((candidate) => candidate.role === 'student'));
      setSubmissions(submissions);
    } catch (err) {
      console.error("Failed to load faculty data:", err);
    }
  };

  useEffect(() => {
    if (user && (user.role === 'faculty' || user.role === 'admin')) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    const tab = new URLSearchParams(window.location.search).get('tab');
    if (tab === 'contests' || tab === 'problems' || tab === 'analytics' || tab === 'students') {
      setActiveTab(tab);
    }
  }, []);

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh] text-indigo-400 font-mono text-sm animate-pulse">
          Verifying faculty credentials...
        </div>
      </AppShell>
    );
  }

  if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
    return <UserNotRegisteredError roleRequired="faculty" />;
  }

  const handleCreateContest = async (contestData: any) => {
    if (contestData.id) await dataService.updateContest(contestData.id, contestData);
    else await dataService.createContest(contestData);
    setShowContestForm(false);
    setEditingContest(null);
    loadData();
  };

  const handleCreateProblem = async (problemData: any) => {
    await dataService.createProblem(problemData);
    setShowProblemForm(false);
    loadData();
  };

  const ongoingContests = contests.filter((contest) => contest.status === 'ongoing');
  const upcomingContests = contests.filter((contest) => contest.status === 'upcoming');
  const pastContests = contests.filter((contest) => contest.status === 'past');
  const participatingStudentIds = new Set(submissions.map((submission) => submission.studentId));
  const averageScore = submissions.length > 0
    ? submissions.reduce((sum, submission) => sum + submission.score, 0) / submissions.length
    : null;
  const selectedStudent = students.find((student) => student.uid === selectedStudentId) || null;
  const selectedStudentSubmissions = selectedStudent
    ? submissions.filter((submission) => submission.studentId === selectedStudent.uid)
    : [];
  const acceptedSubmissions = selectedStudentSubmissions.filter((submission) => submission.verdict === 'Accepted');

  const renderContestGroup = (title: string, group: Contest[]) => (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">{title}</h3>
        <span className="text-xs text-slate-500 font-mono">{group.length} contests</span>
      </div>
      {group.length === 0 ? (
        <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-500">No data available.</div>
      ) : (
        <div className="space-y-2">
          {group.map((contest) => (
            <div key={contest.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <h4 className="font-bold text-sm text-slate-100">{contest.title}</h4>
                <p className="text-xs text-slate-500 mt-1">{contest.department || 'All departments'} · {contest.problems.length} problems · {contest.durationSeconds ? `${contest.durationSeconds} seconds` : `${contest.durationMinutes} minutes`}</p>
              </div>
              <button
                onClick={() => setEditingContest(contest)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold border border-slate-700"
              >
                <Eye className="w-3.5 h-3.5" />
                View / Edit Details
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
              Faculty Portal · {user?.department || 'Department of AI & DS'}
            </div>
            <h1 className="text-2xl font-extrabold text-slate-100">
              Faculty Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Monitor student outcomes, manage assessments, and review contest performance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowProblemForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              New Problem
            </button>
            <button
              onClick={() => setShowContestForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-lg glow-purple transition-all"
            >
              <Plus className="w-4 h-4" />
              Create Contest
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            title="Total Students"
            value={students.length}
            subtitle="Registered student accounts"
            icon={Users}
            color="indigo"
          />
          <StatCard
            title="Active Students"
            value={students.filter((student) => student.status === 'active').length}
            subtitle="Currently active accounts"
            icon={UserCheck}
            color="emerald"
          />
          <StatCard
            title="Contest Participants"
            value={participatingStudentIds.size}
            subtitle="Students with submissions"
            icon={Trophy}
            color="amber"
          />
          <StatCard
            title="Average Score"
            value={averageScore === null ? 'No data' : `${averageScore.toFixed(1)}%`}
            subtitle={`${submissions.length} stored submissions`}
            icon={BarChart3}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            title="Ongoing Contests"
            value={ongoingContests.length}
            subtitle="Currently running assessments"
            icon={PlusSquare}
            color="emerald"
          />
          <StatCard
            title="Upcoming Contests"
            value={upcomingContests.length}
            subtitle="Scheduled assessments"
            icon={Activity}
            color="indigo"
          />
          <StatCard
            title="Completed Contests"
            value={pastContests.length}
            subtitle="Available historical contests"
            icon={FileCheck2}
            color="amber"
          />
        </div>

        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'students' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Students & Progress ({students.length})
          </button>

          <button
            onClick={() => setActiveTab('contests')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'contests'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <PlusSquare className="w-4 h-4" />
            Contest Management ({contests.length})
          </button>

          <button
            onClick={() => setActiveTab('problems')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'problems'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Problem Bank ({problems.length})
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'analytics'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Class Analytics
          </button>
        </div>

        {activeTab === 'students' && (
          <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
            <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <div className="p-5 border-b border-slate-800">
                <h2 className="text-lg font-bold text-slate-100">Student Performance</h2>
                <p className="text-xs text-slate-500 mt-1">Select a real student to inspect stored submissions and scores.</p>
              </div>
              {students.length === 0 ? (
                <div className="p-6 text-sm text-slate-500">No student data available.</div>
              ) : (
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono border-b border-slate-800">
                    <tr><th className="px-5 py-3">Student</th><th className="px-5 py-3">Submissions</th><th className="px-5 py-3">Accepted</th><th className="px-5 py-3 text-right">Action</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {students.map((student) => {
                      const studentSubmissions = submissions.filter((submission) => submission.studentId === student.uid);
                      return (
                        <tr key={student.uid} className={`hover:bg-slate-800/40 ${selectedStudentId === student.uid ? 'bg-indigo-950/40' : ''}`}>
                          <td className="px-5 py-4"><div className="flex items-center gap-3"><RoleAvatar role="student" className="w-8 h-8" /><div><span className="font-bold text-slate-100 block">{student.name}</span><span className="text-[10px] text-slate-500">{student.department} · {student.batch}</span></div></div></td>
                          <td className="px-5 py-4 font-mono">{studentSubmissions.length}</td>
                          <td className="px-5 py-4 font-mono text-emerald-400">{studentSubmissions.filter((submission) => submission.verdict === 'Accepted').length}</td>
                          <td className="px-5 py-4 text-right"><button onClick={() => setSelectedStudentId(student.uid)} className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-semibold"><Eye className="w-3.5 h-3.5" />View Progress</button></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <h2 className="text-lg font-bold text-slate-100">Student Progress</h2>
              {!selectedStudent ? (
                <p className="mt-3 text-sm text-slate-500">Select a student to view progress.</p>
              ) : (
                <div className="mt-5 space-y-5">
                  <div className="flex items-center gap-3"><RoleAvatar role="student" className="w-10 h-10" /><div><h3 className="font-bold text-slate-100">{selectedStudent.name}</h3><p className="text-xs text-slate-500">{selectedStudent.email}</p></div></div>
                  <div className="grid grid-cols-3 gap-2 text-center"><div className="p-3 rounded-xl bg-slate-950 border border-slate-800"><strong className="block text-xl text-indigo-400">{selectedStudentSubmissions.length}</strong><span className="text-[10px] text-slate-500 uppercase">Attempts</span></div><div className="p-3 rounded-xl bg-slate-950 border border-slate-800"><strong className="block text-xl text-emerald-400">{acceptedSubmissions.length}</strong><span className="text-[10px] text-slate-500 uppercase">Accepted</span></div><div className="p-3 rounded-xl bg-slate-950 border border-slate-800"><strong className="block text-xl text-amber-400">{selectedStudentSubmissions.length ? `${(selectedStudentSubmissions.reduce((sum, submission) => sum + submission.score, 0) / selectedStudentSubmissions.length).toFixed(1)}%` : 'No data'}</strong><span className="text-[10px] text-slate-500 uppercase">Avg Score</span></div></div>
                  {selectedStudentSubmissions.length === 0 ? <p className="text-sm text-slate-500">No submission data available.</p> : <div className="space-y-2">{selectedStudentSubmissions.map((submission) => <div key={submission.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800"><div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-200">{submission.contestId} · {submission.problemId}</span><span className={submission.verdict === 'Accepted' ? 'text-emerald-400' : 'text-rose-400'}>{submission.verdict}</span></div><div className="mt-1 text-[10px] text-slate-500">Score: {submission.score} · {new Date(submission.submittedAt).toLocaleString()}</div></div>)}</div>}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'contests' && (
          <div className="overflow-x-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
            <div className="p-6 space-y-7">
              <div><h2 className="text-lg font-bold text-slate-100">Contest Management</h2><p className="text-xs text-slate-500 mt-1">Review and update assessments by lifecycle status.</p></div>
              {renderContestGroup('Ongoing', ongoingContests)}
              {renderContestGroup('Upcoming', upcomingContests)}
              {renderContestGroup('Past', pastContests)}
            </div>
          </div>
        )}

        {activeTab === 'problems' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {problems.map((p) => (
              <div key={p.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 hover:border-indigo-500/30 transition-all">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-100 text-base">{p.title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    p.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : p.difficulty === 'Hard' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {p.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>

                <div className="flex items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-800">
                  <span>{p.sampleTests?.length || 1} Sample / {p.hiddenTests?.length || 2} Hidden Tests</span>
                  <span className="font-mono text-indigo-400">{p.tags?.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-100">Department Performance Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1"><span className="text-slate-300">Stored submissions</span><span className="text-indigo-400">{submissions.length}</span></div>
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden"><div className="h-full bg-indigo-500" style={{ width: submissions.length ? '100%' : '0%' }} /></div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-300">Accepted submissions</span>
                  <span className="text-amber-400">{submissions.filter((submission) => submission.verdict === 'Accepted').length}</span>
                </div>
                <div className="h-2 bg-slate-950 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500" style={{ width: submissions.length ? `${(acceptedSubmissions.length / submissions.length) * 100}%` : '0%' }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {showContestForm && (
          <ContestForm
            availableProblems={problems}
            onSubmit={handleCreateContest}
            onClose={() => setShowContestForm(false)}
          />
        )}

        {editingContest && (
          <ContestForm
            availableProblems={problems}
            contest={editingContest}
            onSubmit={handleCreateContest}
            onClose={() => setEditingContest(null)}
          />
        )}

        {showProblemForm && (
          <ProblemForm
            onSubmit={handleCreateProblem}
            onClose={() => setShowProblemForm(false)}
          />
        )}
      </div>
    </AppShell>
  );
}
