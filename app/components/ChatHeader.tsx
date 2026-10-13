'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  PanelLeft,
  ChevronDown,
  Sparkles,
  Share2,
  Download,
  Trash2,
  Check,
  Brain,
  Globe,
  Zap,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { AIModel, Conversation } from '../types/chat';

interface ChatHeaderProps {
  conversation: Conversation | null;
  activeModel: AIModel;
  availableModels: AIModel[];
  onSelectModel: (model: AIModel) => void;
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
  onShare: () => void;
  onExport: () => void;
  onClear: () => void;
  isDeepThinkEnabled: boolean;
  isWebSearchEnabled: boolean;
  onToggleDeepThink: () => void;
  onToggleWebSearch: () => void;
}

export function ChatHeader({
  conversation,
  activeModel,
  availableModels,
  onSelectModel,
  onToggleSidebar,
  isSidebarCollapsed,
  onShare,
  onExport,
  onClear,
  isDeepThinkEnabled,
  isWebSearchEnabled,
  onToggleDeepThink,
  onToggleWebSearch,
}: ChatHeaderProps) {
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setModelDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl px-4 flex items-center justify-between gap-3 sticky top-0 z-30 select-none">
      {/* Left Area: Toggle & Title / Model Selector */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/70 transition-colors"
          title="Toggle sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        {/* Model Selector Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 hover:bg-zinc-800/90 border border-zinc-800/90 hover:border-zinc-700 transition-all text-xs font-medium text-zinc-200"
          >
            <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${activeModel.accentColor}`} />
            <span className="font-semibold text-white tracking-tight">{activeModel.name}</span>
            <span className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-normal">
              {activeModel.badge}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${
                modelDropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {modelDropdownOpen && (
            <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0e111a] border border-zinc-800/90 shadow-2xl shadow-black/80 p-2 z-50">
              <div className="px-3 py-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center justify-between border-b border-zinc-800/60 pb-2 mb-1">
                <span>Select Architecture</span>
                <span className="text-[10px] text-zinc-500 lowercase">256k max context</span>
              </div>

              <div className="space-y-1">
                {availableModels.map((model) => {
                  const isSelected = model.id === activeModel.id;
                  return (
                    <div
                      key={model.id}
                      onClick={() => {
                        onSelectModel(model);
                        setModelDropdownOpen(false);
                      }}
                      className={`flex flex-col gap-1 p-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-cyan-500/10 border border-cyan-500/30 text-white'
                          : 'hover:bg-zinc-800/60 text-zinc-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${model.accentColor}`}
                          />
                          <span className="font-medium text-sm text-white">{model.name}</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded">
                            {model.provider}
                          </span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                      </div>

                      <p className="text-[11px] text-zinc-400 leading-snug pl-4">
                        {model.description}
                      </p>

                      <div className="flex items-center gap-3 pl-4 pt-1 text-[10px] text-zinc-500 font-mono">
                        <span>Speed: {model.speed}</span>
                        <span>•</span>
                        <span>Context: {model.contextWindow}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Conversation Title */}
        <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-zinc-800 text-xs text-zinc-400 truncate max-w-sm">
          <span className="truncate text-zinc-300 font-medium">
            {conversation ? conversation.title : 'New Workspace Session'}
          </span>
        </div>
      </div>

      {/* Right Area: Mode Toggles & Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Deep Reasoning Toggle Badge */}
        <button
          onClick={onToggleDeepThink}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            isDeepThinkEnabled
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-950'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 bg-zinc-900/60 border border-zinc-800/60'
          }`}
          title="Toggle Deep Reasoning Chain"
        >
          <Brain className={`w-3.5 h-3.5 ${isDeepThinkEnabled ? 'text-purple-400' : ''}`} />
          <span className="hidden md:inline">Deep Think</span>
        </button>

        {/* Web Search Toggle Badge */}
        <button
          onClick={onToggleWebSearch}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
            isWebSearchEnabled
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-950'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 bg-zinc-900/60 border border-zinc-800/60'
          }`}
          title="Toggle Live Web Grounding"
        >
          <Globe className={`w-3.5 h-3.5 ${isWebSearchEnabled ? 'text-emerald-400' : ''}`} />
          <span className="hidden md:inline">Web Search</span>
        </button>

        <div className="w-px h-5 bg-zinc-800 mx-1 hidden sm:block" />

        {/* Share Button */}
        <button
          onClick={onShare}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 border border-transparent hover:border-zinc-700/60 transition-colors"
          title="Share conversation"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Export Button */}
        <button
          onClick={onExport}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-100 hover:bg-zinc-850 border border-transparent hover:border-zinc-700/60 transition-colors"
          title="Export chat as Markdown"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Clear Chat */}
        {conversation && conversation.messages.length > 0 && (
          <button
            onClick={onClear}
            className="p-2 rounded-xl text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-colors"
            title="Clear conversation messages"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </header>
  );
}
