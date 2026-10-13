'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ArrowUp, Sparkles, Paperclip, Code2 } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  stagedPrompt?: string;
  onClearStagedPrompt?: () => void;
}

export function MessageInput({
  onSendMessage,
  isLoading,
  stagedPrompt,
  onClearStagedPrompt,
}: MessageInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus and populate when staged prompt changes
  useEffect(() => {
    if (stagedPrompt) {
      setInput(stagedPrompt);
      if (onClearStagedPrompt) onClearStagedPrompt();
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  }, [stagedPrompt, onClearStagedPrompt]);

  // Dynamic textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput('');
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

  const canSubmit = input.trim().length > 0 && !isLoading;

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-3 sm:pb-4">
      <div className="relative rounded-2xl bg-zinc-900/90 border border-zinc-800/90 shadow-xl shadow-black/40 backdrop-blur-xl focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all">
        {/* Text Input Field */}
        <div className="p-3 sm:p-3.5 pb-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={isLoading ? 'DevKit is synthesizing response...' : 'Type a message... (Enter to send, Shift+Enter for new line)'}
            className="w-full bg-transparent text-[13.5px] leading-relaxed text-zinc-100 placeholder:text-zinc-500 outline-none resize-none max-h-40 overflow-y-auto disabled:opacity-60"
          />
        </div>

        {/* Input Dock Toolbar */}
        <div className="px-3 pb-2.5 pt-1 flex items-center justify-between gap-2 border-t border-zinc-800/40 text-xs">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              DevKit AI v4.5
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-400 hidden sm:inline">
              {input.length > 0 ? `${input.length} chars` : 'Markdown supported'}
            </span>

            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={!canSubmit}
              className={`p-2 rounded-xl transition-all flex items-center justify-center ${
                canSubmit
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-950/40 hover:brightness-110 active:scale-95'
                  : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-2 pt-1.5 text-[11px] text-zinc-400">
        <span className="truncate">React State Enabled • Simulated Local Response</span>
        <span className="hidden sm:inline font-mono">↵ Send</span>
      </div>
    </div>
  );
}
