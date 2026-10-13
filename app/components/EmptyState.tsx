'use client';

import React from 'react';
import {
  Sparkles,
  Layers,
  Database,
  Palette,
  ShieldCheck,
  Terminal,
  Zap,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { PromptSuggestion } from '../types/chat';

interface EmptyStateProps {
  suggestions: PromptSuggestion[];
  onSelectSuggestion: (prompt: string) => void;
  activeModelName: string;
}

export function EmptyState({
  suggestions,
  onSelectSuggestion,
  activeModelName,
}: EmptyStateProps) {
  // Map icon string to Lucide component
  const getIcon = (name: string) => {
    switch (name) {
      case 'Layers':
        return <Layers className="w-5 h-5 text-cyan-400" />;
      case 'Database':
        return <Database className="w-5 h-5 text-indigo-400" />;
      case 'Palette':
        return <Palette className="w-5 h-5 text-pink-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
      default:
        return <Sparkles className="w-5 h-5 text-cyan-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-4 py-8 text-center select-none">
      {/* Glow Aura & Logo */}
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-indigo-500/20 rounded-full blur-2xl animate-pulse-glow" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-cyan-500/30 border border-white/20">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
      </div>

      {/* Main Headline */}
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
        What are we building today?
      </h1>
      <p className="text-sm text-zinc-400 max-w-lg mb-8 leading-relaxed">
        Connected to <span className="text-cyan-300 font-medium">{activeModelName}</span>.
        Generate robust architectures, optimize algorithms, or prototype full-stack components.
      </p>

      {/* Prompt Suggestion Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full text-left">
        {suggestions.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectSuggestion(item.prompt)}
            className="group relative p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-850/90 border border-zinc-800/80 hover:border-cyan-500/40 cursor-pointer transition-all duration-200 hover:shadow-lg hover:shadow-cyan-950/20 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <div className="p-2 rounded-xl bg-zinc-800/80 group-hover:bg-zinc-800 border border-zinc-700/60 transition-colors">
                  {getIcon(item.icon)}
                </div>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 group-hover:text-cyan-400 transition-colors">
                  {item.category}
                </span>
              </div>

              <h2 className="text-sm font-semibold text-zinc-100 group-hover:text-cyan-300 transition-colors mb-1">
                {item.title}
              </h2>
              <p className="text-xs text-zinc-400 leading-snug">
                {item.description}
              </p>
            </div>

            <div className="flex items-center gap-1 mt-4 text-[11px] font-medium text-cyan-400/80 group-hover:text-cyan-300 opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
              <span>Run prompt</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Quick Feature Highlights */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-6 border-t border-zinc-850 text-xs text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Real-time Code Canvas</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Full-stack Terminal Syntax</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          <span>Deep Reasoning Trace</span>
        </div>
      </div>
    </div>
  );
}
