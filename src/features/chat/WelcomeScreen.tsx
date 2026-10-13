'use client';

import React from 'react';
import { Sparkles, Terminal, Cpu, Zap } from 'lucide-react';
import { SuggestedPrompt } from './types';
import { SuggestedPrompts } from './SuggestedPrompts';

interface WelcomeScreenProps {
  prompts: SuggestedPrompt[];
  onSelectPrompt: (prompt: string) => void;
}

export function WelcomeScreen({ prompts, onSelectPrompt }: WelcomeScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 text-center select-none max-w-4xl mx-auto w-full">
      {/* Visual Aura Branding */}
      <div className="relative mb-5">
        <div className="absolute -inset-3 bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-indigo-500/20 rounded-full blur-xl animate-pulse" />
        <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-white/20">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
        What would you like to build today?
      </h2>
      <p className="text-xs sm:text-sm text-zinc-400 max-w-md mb-6 leading-relaxed">
        Choose a prompt below or ask any question to inspect architecture, debug code, or design modern interfaces.
      </p>

      {/* Suggested Prompts Grid */}
      <SuggestedPrompts prompts={prompts} onSelectPrompt={onSelectPrompt} />

      {/* Capabilities Footer */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-6 border-t border-zinc-800/80 text-[11px] text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Interactive Mock Responses
        </span>
        <span className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          Clean Code Snippets
        </span>
        <span className="flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-purple-400" />
          Pure React State
        </span>
      </div>
    </div>
  );
}
