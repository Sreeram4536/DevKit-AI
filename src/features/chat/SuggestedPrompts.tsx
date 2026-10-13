'use client';

import React from 'react';
import { Layers, Database, Palette, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { SuggestedPrompt } from './types';

interface SuggestedPromptsProps {
  prompts: SuggestedPrompt[];
  onSelectPrompt: (prompt: string) => void;
}

export function SuggestedPrompts({ prompts, onSelectPrompt }: SuggestedPromptsProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Layers':
        return <Layers className="w-4 h-4 text-cyan-400" />;
      case 'Database':
        return <Database className="w-4 h-4 text-indigo-400" />;
      case 'Palette':
        return <Palette className="w-4 h-4 text-pink-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
      {prompts.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelectPrompt(item.prompt)}
          className="group text-left p-3.5 rounded-xl bg-zinc-900/60 hover:bg-zinc-850/80 border border-zinc-800/80 hover:border-cyan-500/40 transition-all duration-200 flex flex-col justify-between hover:shadow-lg hover:shadow-cyan-950/20 active:scale-[0.99]"
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-lg bg-zinc-800/90 border border-zinc-700/50">
                {getIcon(item.icon)}
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-500 group-hover:text-cyan-400 transition-colors">
                {item.category}
              </span>
            </div>
            <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-cyan-300 transition-colors">
              {item.title}
            </h4>
            <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">
              {item.description}
            </p>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-medium text-cyan-400/80 group-hover:text-cyan-300 mt-3 transition-colors">
            <span>Use prompt</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      ))}
    </div>
  );
}
