'use client';

import React, { useState } from 'react';
import { CodingProblem, Contest } from '../types';
import { X, Calendar, Clock, BookOpen, Plus, Check } from 'lucide-react';

interface ContestFormProps {
  availableProblems: CodingProblem[];
  onSubmit: (contestData: any) => void;
  onClose: () => void;
  contest?: Contest | null;
}

const toLocalDateTime = (isoString: string) => {
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

export function ContestForm({ availableProblems = [], onSubmit, onClose, contest }: ContestFormProps) {
  const [title, setTitle] = useState(contest?.title || '');
  const [description, setDescription] = useState(contest?.description || '');
  const [startTime, setStartTime] = useState(contest ? toLocalDateTime(contest.startTime) : new Date().toISOString().slice(0, 16));
  const [durationUnit, setDurationUnit] = useState<'minutes' | 'seconds'>(contest?.durationSeconds ? 'seconds' : 'minutes');
  const [durationValue, setDurationValue] = useState(contest?.durationSeconds || contest?.durationMinutes || 120);
  const [selectedProblems, setSelectedProblems] = useState<string[]>(contest?.problems || []);
  const [department, setDepartment] = useState(contest?.department || 'Artificial Intelligence & Data Science');

  const toggleProblemSelect = (probId: string) => {
    if (selectedProblems.includes(probId)) {
      setSelectedProblems(selectedProblems.filter((id) => id !== probId));
    } else {
      setSelectedProblems([...selectedProblems, probId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a contest title');
      return;
    }
    if (selectedProblems.length === 0) {
      alert('Please select at least one problem for the contest');
      return;
    }

    const start = new Date(startTime);
    const durationMilliseconds = durationUnit === 'seconds' ? durationValue * 1000 : durationValue * 60 * 1000;

    onSubmit({
      id: contest?.id,
      title,
      description,
      startTime: start.toISOString(),
      endTime: new Date(start.getTime() + durationMilliseconds).toISOString(),
      durationMinutes: durationUnit === 'minutes' ? Number(durationValue) : Number(durationValue) / 60,
      durationSeconds: durationUnit === 'seconds' ? Number(durationValue) : undefined,
      department,
      problems: selectedProblems
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Plus className="w-6 h-6 text-indigo-400" />
          {contest ? 'Edit Coding Contest' : 'Create New Coding Contest'}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Schedule an examination or contest for students at Parul University.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Contest Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. AI & DS Mid-Term Coding Exam 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Contest instructions, rules, and topics covered..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                Start Time *
              </label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Duration *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={durationUnit === 'seconds' ? 86400 : 300}
                  required
                  value={durationValue}
                  onChange={(e) => setDurationValue(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                />
                <select
                  value={durationUnit}
                  onChange={(e) => setDurationUnit(e.target.value as 'minutes' | 'seconds')}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="minutes">Minutes</option>
                  <option value="seconds">Seconds</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Target Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            >
              <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
              <option value="Computer Science Engineering">Computer Science Engineering</option>
              <option value="Information Technology">Information Technology</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              Select Problems from Bank ({selectedProblems.length} selected)
            </label>

            <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
              {availableProblems.map((prob) => {
                const isSelected = selectedProblems.includes(prob.id);
                return (
                  <div
                    key={prob.id}
                    onClick={() => toggleProblemSelect(prob.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-600/20 border-indigo-500 text-slate-100'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <span className="font-semibold text-xs block">{prob.title}</span>
                      <span className="text-[10px] text-slate-400">{prob.tags?.join(', ')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {prob.difficulty}
                      </span>
                      <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700'}`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
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
              {contest ? 'Save Contest' : 'Publish Contest'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
