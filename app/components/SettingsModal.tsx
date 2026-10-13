'use client';

import React, { useState } from 'react';
import { X, Check, Sliders, Keyboard, Sparkles, Moon, Sun } from 'lucide-react';
import { AIModel } from '../types/chat';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeModel: AIModel;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  activeModel,
  theme,
  onToggleTheme,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'parameters' | 'shortcuts'>('general');
  const [temperature, setTemperature] = useState(0.4);
  const [streamResponses, setStreamResponses] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0d1019] border border-zinc-800 shadow-2xl overflow-hidden text-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-sm text-white">DevKit Settings</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-zinc-800/80 px-4 pt-2 gap-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'general'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('parameters')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'parameters'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Model Parameters
          </button>
          <button
            onClick={() => setActiveTab('shortcuts')}
            className={`pb-2.5 transition-colors border-b-2 ${
              activeTab === 'shortcuts'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Shortcuts
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 space-y-4 text-xs">
          {activeTab === 'general' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div>
                  <div className="font-medium text-white">Appearance Theme</div>
                  <div className="text-[11px] text-zinc-400">
                    Switch between dark and light workspace theme
                  </div>
                </div>
                <button
                  onClick={onToggleTheme}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition-colors"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Dark Theme</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Light Theme</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div>
                  <div className="font-medium text-white">Streaming Output</div>
                  <div className="text-[11px] text-zinc-400">
                    Display tokens in real-time as they are synthesized
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={streamResponses}
                  onChange={(e) => setStreamResponses(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
                />
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="font-medium text-white mb-1">Active Model Engine</div>
                <div className="text-[11px] text-cyan-300 font-mono">
                  {activeModel.name} ({activeModel.provider})
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">
                  Context Window: {activeModel.contextWindow} • Speed: {activeModel.speed}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'parameters' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="font-medium text-white">Temperature</span>
                  <span className="font-mono text-cyan-400">{temperature.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                  <span>Deterministic (Precise Code)</span>
                  <span>Creative (Exploratory)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="font-medium text-white mb-1.5">Custom System Prompt</div>
                <textarea
                  rows={3}
                  defaultValue="You are DevKit AI, an expert software architect and senior staff engineer. Prioritize clean idiomatic patterns, production-grade security, and concise explanations."
                  className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 font-mono text-[11px] outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'shortcuts' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                <span className="text-zinc-300">New Conversation</span>
                <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[11px]">
                  Ctrl/⌘ + N
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                <span className="text-zinc-300">Toggle Sidebar</span>
                <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[11px]">
                  Ctrl/⌘ + B
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                <span className="text-zinc-300">Send Prompt</span>
                <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[11px]">
                  Enter ↵
                </kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                <span className="text-zinc-300">Multiline / Newline</span>
                <kbd className="px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[11px]">
                  Shift + Enter
                </kbd>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-zinc-950/80 border-t border-zinc-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-md transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
