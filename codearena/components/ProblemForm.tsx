'use client';

import React, { useState } from 'react';
import { X, Plus, Trash2, Code } from 'lucide-react';
import { TestCase } from '../types';

interface ProblemFormProps {
  onSubmit: (problemData: any) => void;
  onClose: () => void;
}

export function ProblemForm({ onSubmit, onClose }: ProblemFormProps) {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [tags, setTags] = useState('Arrays, Algorithms');
  const [description, setDescription] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [constraints, setConstraints] = useState('1 <= N <= 10^5');

  const [sampleTests, setSampleTests] = useState<TestCase[]>([
    { input: '4\n2 7 11 15\n9', output: '0 1', explanation: 'Sample explanation' }
  ]);
  const [hiddenTests, setHiddenTests] = useState<TestCase[]>([
    { input: '2\n3 3\n6', output: '0 1' }
  ]);

  const addSampleTest = () => {
    setSampleTests([...sampleTests, { input: '', output: '', explanation: '' }]);
  };

  const removeSampleTest = (index: number) => {
    setSampleTests(sampleTests.filter((_, i) => i !== index));
  };

  const addHiddenTest = () => {
    setHiddenTests([...hiddenTests, { input: '', output: '' }]);
  };

  const removeHiddenTest = (index: number) => {
    setHiddenTests(hiddenTests.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter a problem title');
    if (!description.trim()) return alert('Please enter problem description');

    onSubmit({
      title,
      difficulty,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      description,
      inputFormat,
      outputFormat,
      constraints,
      sampleTests,
      hiddenTests
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Code className="w-6 h-6 text-indigo-400" />
          Add New Problem to Bank
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Create a coding challenge complete with sample and hidden evaluation test cases.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Problem Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Reverse Words in String"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Difficulty *
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              placeholder="Arrays, Dynamic Programming, Strings"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Problem Description *
            </label>
            <textarea
              rows={4}
              required
              placeholder="State the problem clearly..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Input Format
              </label>
              <input
                type="text"
                placeholder="First line N, second line array"
                value={inputFormat}
                onChange={(e) => setInputFormat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Output Format
              </label>
              <input
                type="text"
                placeholder="Print space separated indices"
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Constraints
            </label>
            <input
              type="text"
              placeholder="1 <= N <= 10^5"
              value={constraints}
              onChange={(e) => setConstraints(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Sample Test Cases (Visible to Students)
              </label>
              <button
                type="button"
                onClick={addSampleTest}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <Plus className="w-3.5 h-3.5" /> Add Sample Test
              </button>
            </div>

            {sampleTests.map((test, index) => (
              <div key={index} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeSampleTest(index)}
                  className="absolute top-3 right-3 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Sample Input</span>
                    <textarea
                      rows={2}
                      value={test.input}
                      onChange={(e) => {
                        const copy = [...sampleTests];
                        copy[index].input = e.target.value;
                        setSampleTests(copy);
                      }}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Sample Output</span>
                    <textarea
                      rows={2}
                      value={test.output}
                      onChange={(e) => {
                        const copy = [...sampleTests];
                        copy[index].output = e.target.value;
                        setSampleTests(copy);
                      }}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-emerald-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Hidden Test Cases (Used for Automated Grading)
              </label>
              <button
                type="button"
                onClick={addHiddenTest}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                <Plus className="w-3.5 h-3.5" /> Add Hidden Test
              </button>
            </div>

            {hiddenTests.map((test, index) => (
              <div key={index} className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 relative">
                <button
                  type="button"
                  onClick={() => removeHiddenTest(index)}
                  className="absolute top-3 right-3 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Hidden Input</span>
                    <textarea
                      rows={2}
                      value={test.input}
                      onChange={(e) => {
                        const copy = [...hiddenTests];
                        copy[index].input = e.target.value;
                        setHiddenTests(copy);
                      }}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-slate-200"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">Expected Output</span>
                    <textarea
                      rows={2}
                      value={test.output}
                      onChange={(e) => {
                        const copy = [...hiddenTests];
                        copy[index].output = e.target.value;
                        setHiddenTests(copy);
                      }}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs font-mono text-emerald-300"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-lg glow-purple transition-all"
            >
              Save Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
