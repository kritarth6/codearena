'use client';

import React, { useState } from 'react';
import { CodingProblem } from '../types';
import { BookOpen, Copy, Check, Info, FileText } from 'lucide-react';

export function ProblemStatement({ problem }: { problem: CodingProblem | null }) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!problem) {
    return (
      <div className="p-8 text-center text-slate-400">
        No problem selected.
      </div>
    );
  }

  const handleCopyInput = (inputStr: string, index: number) => {
    navigator.clipboard.writeText(inputStr);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getDifficultyBadge = (diff?: string) => {
    switch (diff?.toLowerCase()) {
      case 'easy':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Easy</span>;
      case 'medium':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">Medium</span>;
      case 'hard':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30">Hard</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300">{diff || 'Medium'}</span>;
    }
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-slate-900/60 border border-slate-800 rounded-xl space-y-6 text-slate-200">
      <div>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-slate-100 tracking-tight">
            {problem.title}
          </h2>
          {getDifficultyBadge(problem.difficulty)}
        </div>

        {problem.tags && problem.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            {problem.tags.map((tag, i) => (
              <span key={i} className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700/60">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-400 bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div>
          <span className="text-slate-500">Time Limit: </span>
          <span className="font-mono text-slate-300 font-semibold">{problem.timeLimitSeconds || 1}s</span>
        </div>
        <div>
          <span className="text-slate-500">Memory Limit: </span>
          <span className="font-mono text-slate-300 font-semibold">{problem.memoryLimitMB || 256} MB</span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          Problem Description
        </h3>
        <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 font-sans">
          {problem.description}
        </div>
      </div>

      {problem.inputFormat && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            Input Format
          </h3>
          <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
            {problem.inputFormat}
          </p>
        </div>
      )}

      {problem.outputFormat && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            Output Format
          </h3>
          <p className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono">
            {problem.outputFormat}
          </p>
        </div>
      )}

      {problem.constraints && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-400" />
            Constraints
          </h3>
          <pre className="text-xs text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono whitespace-pre-wrap">
            {problem.constraints}
          </pre>
        </div>
      )}

      {problem.sampleTests && problem.sampleTests.length > 0 && (
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
            Sample Test Cases
          </h3>

          {problem.sampleTests.map((test, index) => (
            <div key={index} className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-400">Example {index + 1}</span>
                <button
                  onClick={() => handleCopyInput(test.input, index)}
                  className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800 transition-colors"
                >
                  {copiedIdx === index ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy Input
                    </>
                  )}
                </button>
              </div>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Input</span>
                <pre className="mt-1 p-2.5 bg-slate-900 rounded-lg text-xs font-mono text-slate-200 overflow-x-auto border border-slate-800">
                  {test.input}
                </pre>
              </div>

              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-500 uppercase">Output</span>
                <pre className="mt-1 p-2.5 bg-slate-900 rounded-lg text-xs font-mono text-emerald-300 overflow-x-auto border border-slate-800">
                  {test.output}
                </pre>
              </div>

              {test.explanation && (
                <p className="mt-2 text-xs text-slate-400 italic">
                  Explanation: {test.explanation}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
