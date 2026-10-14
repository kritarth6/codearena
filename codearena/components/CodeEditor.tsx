'use client';

import React, { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Code2, Settings, Copy, Check, ShieldAlert } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  language?: string;
  onLanguageChange?: (lang: string) => void;
  disableCopyPaste?: boolean;
  readOnly?: boolean;
  height?: string;
}

export function CodeEditor({ 
  value, 
  onChange, 
  language = 'cpp', 
  onLanguageChange,
  disableCopyPaste = false,
  readOnly = false,
  height = "100%"
}: CodeEditorProps) {
  const [fontSize, setFontSize] = useState(14);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (disableCopyPaste) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePastePrevent = (e: React.SyntheticEvent) => {
    if (disableCopyPaste) {
      e.preventDefault();
      alert('Copy/Paste is locked in exam environment!');
    }
  };

  const getMonacoLanguage = (lang: string) => {
    switch (lang) {
      case 'cpp': return 'cpp';
      case 'python': return 'python';
      case 'java': return 'java';
      case 'javascript': return 'javascript';
      default: return 'cpp';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Editor</span>
          </div>

          {onLanguageChange && (
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              disabled={readOnly}
              className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-mono font-medium"
            >
              <option value="cpp">C++ (GCC 9.2)</option>
              <option value="python">Python 3.8</option>
              <option value="java">Java 13</option>
              <option value="javascript">JavaScript (Node 12)</option>
            </select>
          )}

          {disableCopyPaste && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <ShieldAlert className="w-3 h-3" />
              Copy/Paste Lock Active
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
            <Settings className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value={12} className="bg-slate-900">12px</option>
              <option value={14} className="bg-slate-900">14px</option>
              <option value={16} className="bg-slate-900">16px</option>
              <option value={18} className="bg-slate-900">18px</option>
            </select>
          </div>

          {!disableCopyPaste && (
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
              title="Copy Code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
        </div>
      </div>

      <div 
        className="flex-1 relative w-full h-full min-h-[350px]"
        onPaste={handlePastePrevent}
        onCopy={handlePastePrevent}
        onContextMenu={handlePastePrevent}
      >
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={value}
          onChange={(val) => onChange(val || '')}
          theme="vs-dark"
          options={{
            fontSize: fontSize,
            fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            readOnly: readOnly,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            tabSize: 4,
            insertSpaces: true,
            padding: { top: 12, bottom: 12 },
            contextmenu: !disableCopyPaste,
          }}
          loading={
            <div className="flex items-center justify-center h-full bg-slate-950 text-slate-400 font-mono text-sm">
              Loading CodeArena Monaco IDE...
            </div>
          }
        />
      </div>
    </div>
  );
}
