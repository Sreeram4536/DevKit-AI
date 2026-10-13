'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Search,
  Pin,
  Trash2,
  Edit2,
  Check,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sun,
  Moon,
  Sparkles,
  ChevronDown,
  ExternalLink,
  Laptop,
} from 'lucide-react';
import { Conversation, TimeGroup } from '../types/chat';

interface SidebarProps {
  conversations: Conversation[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onTogglePin: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  onOpenSettings: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function Sidebar({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onTogglePin,
  onRenameConversation,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
  onOpenSettings,
  theme,
  onToggleTheme,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filteredConversations = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pinnedConversations = filteredConversations.filter((c) => c.pinned);
  const unpinnedConversations = filteredConversations.filter((c) => !c.pinned);

  // Group by time
  const groups: TimeGroup[] = ['Today', 'Yesterday', 'Previous 7 Days', 'Older'];
  const groupedData: Record<TimeGroup, Conversation[]> = {
    Pinned: pinnedConversations,
    Today: unpinnedConversations.filter((c) => c.timeGroup === 'Today'),
    Yesterday: unpinnedConversations.filter((c) => c.timeGroup === 'Yesterday'),
    'Previous 7 Days': unpinnedConversations.filter(
      (c) => c.timeGroup === 'Previous 7 Days'
    ),
    Older: unpinnedConversations.filter((c) => c.timeGroup === 'Older'),
  };

  const handleStartRename = (e: React.MouseEvent, c: Conversation) => {
    e.stopPropagation();
    setEditingId(c.id);
    setEditTitle(c.title);
  };

  const handleSaveRename = (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  const handleCancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const renderConversationItem = (conv: Conversation) => {
    const isActive = activeId === conv.id;
    const isEditing = editingId === conv.id;

    return (
      <div
        key={conv.id}
        onClick={() => {
          if (!isEditing) {
            onSelectConversation(conv.id);
            onCloseMobile();
          }
        }}
        className={`group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm cursor-pointer transition-all duration-150 ${
          isActive
            ? 'bg-cyan-500/10 text-cyan-200 border border-cyan-500/25 shadow-sm shadow-cyan-950/40'
            : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60 border border-transparent'
        }`}
      >
        <MessageSquare
          className={`w-4 h-4 shrink-0 transition-colors ${
            isActive ? 'text-cyan-400' : 'text-zinc-500 group-hover:text-zinc-300'
          }`}
        />

        {isEditing ? (
          <div
            className="flex items-center gap-1.5 flex-1 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveRename(e, conv.id);
                if (e.key === 'Escape') setEditingId(null);
              }}
              autoFocus
              className="flex-1 bg-zinc-950/90 text-xs px-2 py-1 rounded border border-cyan-500/50 outline-none text-zinc-100"
            />
            <button
              onClick={(e) => handleSaveRename(e, conv.id)}
              className="p-1 hover:bg-zinc-800 rounded text-emerald-400"
              title="Save"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleCancelRename}
              className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <>
            <span className="truncate flex-1 font-normal tracking-tight text-[13px]">
              {conv.title}
            </span>

            {/* Hover Actions */}
            <div
              className={`flex items-center gap-0.5 shrink-0 transition-opacity ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(conv.id);
                }}
                className={`p-1 rounded hover:bg-zinc-700/60 transition-colors ${
                  conv.pinned ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
                title={conv.pinned ? 'Unpin chat' : 'Pin chat'}
              >
                <Pin className={`w-3.5 h-3.5 ${conv.pinned ? 'fill-amber-400/20' : ''}`} />
              </button>

              <button
                onClick={(e) => handleStartRename(e, conv)}
                className="p-1 rounded hover:bg-zinc-700/60 text-zinc-400 hover:text-zinc-200 transition-colors"
                title="Rename chat"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conv.id);
                }}
                className="p-1 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors"
                title="Delete chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  // Mini rail sidebar for desktop collapsed state
  if (isCollapsed) {
    return (
      <aside className="hidden md:flex flex-col items-center justify-between w-16 h-screen border-r border-zinc-800/80 bg-zinc-950/95 py-4 z-30 select-none">
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Brand Icon */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>

          {/* Toggle button */}
          <button
            onClick={onToggleCollapse}
            className="p-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800/70 transition-colors"
            title="Expand sidebar (Ctrl + B)"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="p-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 transition-all shadow-sm"
            title="New Chat"
          >
            <Plus className="w-5 h-5" />
          </button>

          <div className="w-8 h-px bg-zinc-800 my-1" />

          {/* Quick chat bubbles */}
          <div className="flex flex-col items-center gap-2 overflow-y-auto max-h-[50vh] px-2 py-1">
            {conversations.slice(0, 5).map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs transition-colors ${
                  activeId === conv.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                }`}
                title={conv.title}
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        {/* Bottom items */}
        <div className="flex flex-col items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/70"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-semibold text-white shadow-md">
            AD
          </div>
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
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col w-72 md:w-80 h-screen bg-[#0b0d14] border-r border-zinc-800/70 transition-transform duration-200 ease-in-out select-none ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-zinc-800/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm tracking-tight text-white">DevKit AI</span>
                <span className="px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-md">
                  Studio
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">Engineering Workspace</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onToggleCollapse}
              className="hidden md:flex p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
            <button
              onClick={onCloseMobile}
              className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Button: New Chat */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewChat();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs tracking-wide shadow-md shadow-cyan-900/30 transition-all group"
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

        {/* Search Bar */}
        <div className="px-3 pb-2">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 absolute left-3 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-8 pr-7 py-1.5 bg-zinc-900/80 hover:bg-zinc-900 focus:bg-zinc-900 text-xs text-zinc-200 placeholder:text-zinc-500 rounded-lg border border-zinc-800/80 focus:border-cyan-500/50 outline-none transition-all"
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

        {/* Conversation List Groups */}
        <div className="flex-1 overflow-y-auto px-2 space-y-4 py-2">
          {/* Pinned Group */}
          {pinnedConversations.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-amber-400/90">
                <Pin className="w-3 h-3 fill-amber-400/30" />
                <span>Pinned</span>
              </div>
              <div className="space-y-0.5">
                {pinnedConversations.map(renderConversationItem)}
              </div>
            </div>
          )}

          {/* Chronological Groups */}
          {groups.map((group) => {
            const items = groupedData[group];
            if (items.length === 0) return null;

            return (
              <div key={group} className="space-y-1">
                <div className="px-3 py-1 text-[11px] font-semibold tracking-wider uppercase text-zinc-500">
                  {group}
                </div>
                <div className="space-y-0.5">
                  {items.map(renderConversationItem)}
                </div>
              </div>
            );
          })}

          {filteredConversations.length === 0 && (
            <div className="py-8 text-center text-xs text-zinc-500">
              No conversations found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </div>

        {/* Sidebar Footer User Area */}
        <div className="p-3 border-t border-zinc-800/80 bg-zinc-950/60">
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-zinc-900/50 border border-zinc-800/50">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow">
                  AC
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-zinc-950 rounded-full" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium text-zinc-200 truncate">Alex Chen</span>
                  <span className="px-1 py-0.2 text-[9px] bg-cyan-500/20 text-cyan-300 rounded font-semibold">
                    PRO
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 truncate">devkit@engineer.io</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onToggleTheme}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
                title={`Toggle ${theme === 'dark' ? 'Light' : 'Dark'} theme`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5" />
                ) : (
                  <Moon className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                onClick={onOpenSettings}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
                title="Settings & Preferences"
              >
                <Settings className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
