'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  ArrowUp,
  Square,
  Paperclip,
  Brain,
  Globe,
  Sparkles,
  X,
  Code2,
} from 'lucide-react';
import { Attachment } from '../types/chat';

interface ChatInputProps {
  onSendMessage: (text: string, attachments?: Attachment[]) => void;
  isStreaming: boolean;
  onStopStreaming: () => void;
  isDeepThinkEnabled: boolean;
  isWebSearchEnabled: boolean;
  onToggleDeepThink: () => void;
  onToggleWebSearch: () => void;
  externalPrompt?: string;
  onClearExternalPrompt?: () => void;
}

export function ChatInput({
  onSendMessage,
  isStreaming,
  onStopStreaming,
  isDeepThinkEnabled,
  isWebSearchEnabled,
  onToggleDeepThink,
  onToggleWebSearch,
  externalPrompt,
  onClearExternalPrompt,
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync external prompt when user clicks a prompt suggestion card
  useEffect(() => {
    if (externalPrompt) {
      setInput(externalPrompt);
      if (onClearExternalPrompt) onClearExternalPrompt();
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [externalPrompt, onClearExternalPrompt]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSubmit = () => {
    if (isStreaming) {
      onStopStreaming();
      return;
    }

    if (!input.trim() && attachments.length === 0) return;

    onSendMessage(input.trim(), attachments);
    setInput('');
    setAttachments([]);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSimulateAttach = () => {
    // Offer quick code/file context attachment
    const sampleFiles: Attachment[] = [
      { name: 'schema.prisma', size: '4.2 KB', type: 'application/prisma' },
      { name: 'next.config.ts', size: '1.8 KB', type: 'text/typescript' },
      { name: 'kanban-board.tsx', size: '8.6 KB', type: 'text/typescript-react' },
    ];
    const randomFile = sampleFiles[Math.floor(Math.random() * sampleFiles.length)];
    if (!attachments.some((a) => a.name === randomFile.name)) {
      setAttachments([...attachments, randomFile]);
    }
  };

  const handleRemoveAttachment = (name: string) => {
    setAttachments(attachments.filter((a) => a.name !== name));
  };

  const hasContent = input.trim().length > 0 || attachments.length > 0;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-4">
      <div className="relative rounded-2xl bg-zinc-900/90 border border-zinc-800/90 shadow-xl shadow-black/50 backdrop-blur-xl focus-within:border-cyan-500/40 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
        {/* Attached Files Chips */}
        {attachments.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 p-3 pb-0 border-b border-zinc-800/60">
            {attachments.map((file) => (
              <div
                key={file.name}
                className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-800/80 border border-zinc-700/60 text-xs text-cyan-300"
              >
                <Paperclip className="w-3 h-3 text-cyan-400" />
                <span className="font-mono text-[11px]">{file.name}</span>
                <span className="text-[10px] text-zinc-400">({file.size})</span>
                <button
                  onClick={() => handleRemoveAttachment(file.name)}
                  className="p-0.5 rounded hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Text Input Area */}
        <div className="p-3">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask DevKit to build, explain, refactor, or debug code... (Shift+Enter for new line)"
            className="w-full bg-transparent text-[13.5px] leading-relaxed text-zinc-100 placeholder:text-zinc-500 outline-none resize-none max-h-48 overflow-y-auto"
          />
        </div>

        {/* Action Toolbar Dock */}
        <div className="px-3 pb-3 flex items-center justify-between gap-2 border-t border-zinc-800/50 pt-2 text-xs">
          {/* Left tools: Mode Toggles & Attach */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={onToggleDeepThink}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                isDeepThinkEnabled
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
              title="Toggle Deep Reasoning Chain"
            >
              <Brain className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reasoning</span>
            </button>

            <button
              type="button"
              onClick={onToggleWebSearch}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                isWebSearchEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
              title="Search the web for current libraries & docs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Web</span>
            </button>

            <button
              type="button"
              onClick={handleSimulateAttach}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60 transition-colors"
              title="Attach code snippet or file"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Attach</span>
            </button>
          </div>

          {/* Right tools: Token counter & Send Button */}
          <div className="flex items-center gap-2">
            <span className="hidden md:inline text-[11px] text-zinc-400 font-mono">
              {input.length > 0 ? `${input.length} chars` : 'Markdown supported'}
            </span>

            {isStreaming ? (
              <button
                type="button"
                onClick={onStopStreaming}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 transition-colors text-xs font-medium shadow-sm"
                title="Stop response generation"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!hasContent}
                className={`p-2 rounded-xl transition-all ${
                  hasContent
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-900/40 hover:brightness-110 active:scale-95'
                    : 'bg-zinc-800/80 text-zinc-500 cursor-not-allowed'
                }`}
                title="Send message (Enter)"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-2 pt-2 text-[11px] text-zinc-400">
        <span>DevKit AI may produce inaccurate code. Verify before deploying.</span>
        <span className="hidden sm:inline font-mono">Press ↵ to send</span>
      </div>
    </div>
  );
}
