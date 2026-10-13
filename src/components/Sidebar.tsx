'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Pin,
  Trash2,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Check,
} from 'lucide-react';
import { Conversation } from '../features/chat/types';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onTogglePin: (id: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onTogglePin,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinned = filtered.filter((c) => c.pinned);
  const unpinned = filtered.filter((c) => !c.pinned);

  const renderItem = (conv: Conversation) => {
    const isActive = activeId === conv.id;
    return (
      <div
        key={conv.id}
        onClick={() => {
          onSelectConversation(conv.id);
          onCloseMobile();
        }}
        className={`group relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all duration-150 ${
          isActive
            ? 'bg-cyan-500/15 text-cyan-200 border border-cyan-500/30 shadow-sm shadow-cyan-950/40'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60 border border-transparent'
        }`}
      >
        <MessageSquare
          className={`w-3.5 h-3.5 shrink-0 transition-colors ${
            isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-300'
          }`}
        />
        <span className="truncate flex-1 font-medium tracking-tight">
          {conv.title}
        </span>

        {/* Action icons */}
        <div
          className={`flex items-center gap-1 shrink-0 ${
            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onTogglePin(conv.id)}
            className={`p-1 rounded hover:bg-zinc-700/60 transition-colors ${
              conv.pinned ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
            title={conv.pinned ? 'Unpin' : 'Pin'}
          >
            <Pin className={`w-3 h-3 ${conv.pinned ? 'fill-amber-400/20' : ''}`} />
          </button>
          <button
            onClick={() => onDeleteConversation(conv.id)}
            className="p-1 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
            title="Delete conversation"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    );
  };

  // Collapsed Rail (desktop)
  if (isCollapsed) {
    return (
      <aside className="hidden md:flex flex-col items-center justify-between w-16 h-screen border-r border-zinc-800 bg-[#090b10] py-4 select-none z-30">
        <div className="flex flex-col items-center gap-4 w-full">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Sparkles className="w-4 h-4 text-white" />
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/70 transition-colors"
            title="Expand sidebar"
          >
            <PanelLeftOpen className="w-4 h-4" />
          </button>

          <button
            onClick={onNewChat}
            className="p-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 transition-all"
            title="New Chat"
          >
            <Plus className="w-4 h-4" />
          </button>

          <div className="w-8 h-px bg-zinc-800 my-1" />

          <div className="flex flex-col items-center gap-2 overflow-y-auto max-h-[50vh] px-1">
            {conversations.slice(0, 5).map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectConversation(c.id)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${
                  activeId === c.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-zinc-400 hover:bg-zinc-800'
                }`}
                title={c.title}
              >
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white shadow">
          AC
        </div>
      </aside>
    );
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-72 md:w-80 h-screen bg-[#0a0c13] border-r border-zinc-800/80 transition-transform duration-200 select-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-zinc-800/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-white">DevKit AI</span>
                <span className="px-1.5 py-0.2 text-[9px] uppercase font-bold tracking-wider bg-cyan-500/20 text-cyan-300 rounded">
                  Studio
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Coding Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-md shadow-cyan-950/40 transition-all group"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
              <span>New Conversation</span>
            </div>
            <kbd className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded border border-white/10 text-cyan-100 font-mono">
              ⌘N
            </kbd>
          </button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter chats..."
              className="w-full pl-8 pr-7 py-1.5 bg-zinc-900/80 text-xs text-zinc-200 placeholder:text-zinc-500 rounded-lg border border-zinc-800 focus:border-cyan-500/50 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 p-0.5 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-3">
          {pinned.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-amber-400/90">
                <Pin className="w-3 h-3 fill-amber-400/20" />
                <span>Pinned</span>
              </div>
              <div className="space-y-0.5">{pinned.map(renderItem)}</div>
            </div>
          )}

          <div className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-semibold tracking-wider uppercase text-zinc-400">
              Recent Conversations
            </div>
            <div className="space-y-0.5">{unpinned.map(renderItem)}</div>
          </div>

          {filtered.length === 0 && (
            <div className="py-6 text-center text-xs text-zinc-500">
              No conversations found.
            </div>
          )}
        </div>

        {/* User Footer */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/70">
          <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-900/60 border border-zinc-800/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow">
                AC
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium text-zinc-200 truncate">Alex Chen</div>
                <div className="text-[10px] text-zinc-400 truncate">devkit@engineer.io</div>
              </div>
            </div>
            <span className="px-1.5 py-0.2 text-[9px] bg-cyan-500/20 text-cyan-300 rounded font-semibold">
              PRO
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
