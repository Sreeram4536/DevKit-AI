'use client';

import React from 'react';
import { PanelLeft, Sparkles, Plus, Cpu } from 'lucide-react';

interface HeaderProps {
  title: string;
  onToggleSidebar: () => void;
  onNewChat: () => void;
}

export function Header({ title, onToggleSidebar, onNewChat }: HeaderProps) {
  return (
    <header className="h-14 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl px-4 flex items-center justify-between gap-3 sticky top-0 z-20 select-none">
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/70 transition-colors"
          title="Toggle sidebar"
        >
          <PanelLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <h1 className="text-xs sm:text-sm font-semibold text-zinc-200 truncate">
            {title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span>DevKit Ultra 4.5</span>
        </div>

        <button
          onClick={onNewChat}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-200 transition-colors"
          title="Start new chat"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>
      </div>
    </header>
  );
}
