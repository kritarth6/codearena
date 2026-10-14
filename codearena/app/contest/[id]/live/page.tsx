'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../components/AuthProvider';
import { CountdownTimer } from '../../../../components/CountdownTimer';
import { ProblemStatement } from '../../../../components/ProblemStatement';
import { CodeEditor } from '../../../../components/CodeEditor';
import { VerdictBadge } from '../../../../components/VerdictBadge';
import { Play, Send, ShieldAlert, Maximize2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { dataService } from '../../../../lib/services';
import { executeCodeServerSide } from '../../../../lib/judge0';
import { Contest, CodingProblem } from '../../../../types';

export default function ContestLivePage() {
  const params = useParams();
  const contestId = (params?.id as string) || 'c_001';
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [contest, setContest] = useState<Contest | null>(null);
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const [language, setLanguage] = useState('cpp');

  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [evaluating, setEvaluating] = useState(false);
  const [verdictMap, setVerdictMap] = useState<Record<string, string>>({});
  const [testOutput, setTestOutput] = useState<any>(null);

  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showCheatingWarning, setShowCheatingWarning] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function loadContestData() {
      const contestData = await dataService.getContestById(contestId);
      setContest(contestData || { id: contestId, title: 'Parul AI & DS Annual Coding Championship 2026', description: '', startTime: '', endTime: '', durationMinutes: 120, status: 'ongoing', problems: [] });

      const allProblems = await dataService.getProblems();
      const problemList = contestData?.problems
        ? allProblems.filter((p) => contestData.problems.includes(p.id))
        : allProblems.slice(0, 3);

      setProblems(problemList);

      const initialCode: Record<string, string> = {};
      problemList.forEach((p) => {
        initialCode[p.id] = p.starterCode?.cpp || `#include <iostream>\nusing namespace std;\n\nint main() {\n    return 0;\n}`;
      });
      setCodeMap(initialCode);
    }
    loadContestData();
  }, [contestId]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setTabSwitchCount((prev) => {
          setShowCheatingWarning(true);
          return prev + 1;
        });
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const activeProblem = problems[activeProblemIdx] || null;
  const currentCode = activeProblem ? (codeMap[activeProblem.id] || '') : '';

  const handleCodeChange = (newCode: string) => {
    if (!activeProblem) return;
    setCodeMap((prev) => ({ ...prev, [activeProblem.id]: newCode }));
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (!activeProblem) return;
    const starter = (activeProblem.starterCode as any)?.[newLang] || '';
    if (starter) {
      setCodeMap((prev) => ({ ...prev, [activeProblem.id]: starter }));
    }
  };

  // Run Test Case calling Next.js server-side API Route `/api/execute`
  const handleRunCode = async () => {
    if (!activeProblem) return;
    setEvaluating(true);
    setTestOutput(null);
    setVerdictMap((prev) => ({ ...prev, [activeProblem.id]: 'Running...' }));

    try {
      const res = await executeCodeServerSide({
        code: currentCode,
        language,
        input: activeProblem.sampleTests?.[0]?.input || '',
        expectedOutput: activeProblem.sampleTests?.[0]?.output || ''
      });

      setVerdictMap((prev) => ({ ...prev, [activeProblem.id]: res.verdict }));
      setTestOutput(res);
    } catch (err: any) {
      setVerdictMap((prev) => ({ ...prev, [activeProblem.id]: 'Compilation Error' }));
      setTestOutput({ stderr: err.message });
    } finally {
      setEvaluating(false);
    }
  };

  const handleSubmitProblem = async () => {
    if (!activeProblem || !user) {
      alert('Please sign in before submitting a solution.');
      return;
    }
    setEvaluating(true);
    setVerdictMap((prev) => ({ ...prev, [activeProblem.id]: 'Evaluating...' }));

    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.uid,
          studentName: user.name,
          contestId,
          problemId: activeProblem.id,
          code: currentCode,
          language,
          tabSwitches: tabSwitchCount
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Submission evaluation failed.');
      }

      setVerdictMap((prev) => ({ ...prev, [activeProblem.id]: data.verdict }));
      setTestOutput({
        verdict: data.verdict,
        stdout: `Passed ${data.passRatio} test cases (Score: ${data.score}%)`,
        stderr: data.compileError || '',
        executionTimeMs: data.executionTimeMs,
        memoryKB: data.memoryKB
      });
    } catch (err: any) {
      setVerdictMap((prev) => ({ ...prev, [activeProblem.id]: 'Execution Error' }));
      setTestOutput({ stderr: err.message || 'Evaluation error.' });
      alert("Submission error: " + (err.message || 'Error occurred'));
    } finally {
      setEvaluating(false);
    }
  };

  const handleCompleteContest = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`codearena_contest_${contestId}_tabSwitches`, String(tabSwitchCount));
    }
    router.push(`/contest/${contestId}/results`);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans fixed inset-0 z-50">
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (confirm('Leave live exam environment? Progress will be saved.')) {
                handleCompleteContest();
              }
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-bold text-slate-100 line-clamp-1">{contest?.title}</h1>
            <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono">
              <span>Question {activeProblemIdx + 1} of {problems.length}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <CountdownTimer
            initialMinutes={contest?.durationMinutes || 90}
            initialSeconds={contest?.durationSeconds}
            endTime={contest?.endTime}
            onTimeUp={handleCompleteContest}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleFullscreen}
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Exam'}
          </button>

          <button
            onClick={handleCompleteContest}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-bold text-xs shadow-lg glow-emerald transition-all"
          >
            Finish Contest
          </button>
        </div>
      </header>

      {showCheatingWarning && (
        <div className="bg-amber-950/95 border-b border-amber-500/40 px-6 py-2 flex items-center justify-between text-xs text-amber-200 animate-pulse shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Warning: Tab Switch Detected ({tabSwitchCount} times).</strong> Anti-cheating proctoring logs all window switches.
            </span>
          </div>
          <button
            onClick={() => setShowCheatingWarning(false)}
            className="underline text-amber-400 hover:text-white font-semibold"
          >
            Acknowledge
          </button>
        </div>
      )}

      <div className="bg-slate-950 px-6 py-2 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto shrink-0">
        {problems.map((prob, idx) => {
          const verdict = verdictMap[prob.id];
          return (
            <button
              key={prob.id}
              onClick={() => {
                setActiveProblemIdx(idx);
                setTestOutput(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all border ${
                activeProblemIdx === idx
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span>Q{idx + 1}. {prob.title}</span>
              {verdict === 'Accepted' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Split Screen 50% Left | 50% Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 min-h-0 overflow-hidden bg-slate-950">
        <div className="h-full min-h-0 overflow-hidden">
          <ProblemStatement problem={activeProblem} />
        </div>

        <div className="h-full min-h-0 flex flex-col gap-3 overflow-hidden">
          <div className="flex-1 min-h-0 relative">
            <CodeEditor
              value={currentCode}
              onChange={handleCodeChange}
              language={language}
              onLanguageChange={handleLanguageChange}
              disableCopyPaste={true}
            />
          </div>

          <div className="h-44 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shrink-0">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Execution Output (Server-side API Proxy)</span>
                {activeProblem && verdictMap[activeProblem.id] && (
                  <VerdictBadge verdict={verdictMap[activeProblem.id]} />
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={evaluating}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-all disabled:opacity-50"
                >
                  <Play className="w-3.5 h-3.5 text-indigo-400 fill-current" />
                  Run Test
                </button>
                <button
                  onClick={handleSubmitProblem}
                  disabled={evaluating}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md glow-purple transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  Submit Code
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mt-2 font-mono text-xs text-slate-300">
              {evaluating ? (
                <div className="flex items-center justify-center h-full text-indigo-400 animate-pulse">
                  Compiling & executing via Next.js API route...
                </div>
              ) : testOutput ? (
                <div className="space-y-1">
                  {testOutput.stdout && (
                    <div className="text-emerald-400">
                      <strong>stdout:</strong>
                      <pre className="mt-0.5 whitespace-pre-wrap">{testOutput.stdout}</pre>
                    </div>
                  )}
                  {testOutput.stderr && (
                    <div className="text-rose-400">
                      <strong>stderr:</strong>
                      <pre className="mt-0.5 whitespace-pre-wrap">{testOutput.stderr}</pre>
                    </div>
                  )}
                  {testOutput.executionTimeMs !== undefined && (
                    <div className="text-[11px] text-slate-500 pt-1">
                      Time: {testOutput.executionTimeMs}ms | Memory: {testOutput.memoryKB || 3200}KB
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-slate-500 text-center pt-4 italic font-sans text-xs">
                  Click &quot;Run Test&quot; or &quot;Submit Code&quot; to evaluate solution.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
