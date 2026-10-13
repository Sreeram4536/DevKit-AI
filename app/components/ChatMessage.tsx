'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  User,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCw,
  ChevronDown,
  Brain,
  Code2,
  FileCode,
  Paperclip,
} from 'lucide-react';
import { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
  onRegenerate?: () => void;
}

export function ChatMessage({ message, onRegenerate }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [copiedCodeIndex, setCopiedCodeIndex] = useState<number | null>(null);
  const [thinkingExpanded, setThinkingExpanded] = useState(false);
  const [feedback, setFeedback] = useState<'liked' | 'disliked' | null>(null);

  const handleCopyText = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIndex(index);
    setTimeout(() => setCopiedCodeIndex(null), 2000);
  };

  // Helper to format text with bold, inline code, and lists
  const renderFormattedText = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Heading 3
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-base font-semibold text-zinc-100 mt-4 mb-2 tracking-tight">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Heading 2
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-lg font-semibold text-zinc-50 mt-5 mb-2.5 tracking-tight">
            {line.replace('## ', '')}
          </h2>
        );
      }
      // Bullet list
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemContent = line.trim().substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-zinc-300 my-1 text-[13.5px] leading-relaxed">
            {renderInlineMarkdown(itemContent)}
          </li>
        );
      }
      // Numbered list
      if (/^\d+\.\s/.test(line.trim())) {
        const itemContent = line.trim().replace(/^\d+\.\s/, '');
        return (
          <div key={idx} className="flex gap-2 text-zinc-300 my-1 text-[13.5px] leading-relaxed pl-1">
            <span className="text-cyan-400 font-mono font-medium shrink-0">
              {line.trim().match(/^\d+\./)?.[0]}
            </span>
            <span>{renderInlineMarkdown(itemContent)}</span>
          </div>
        );
      }
      // Blank line
      if (line.trim() === '') {
        return <div key={idx} className="h-2" />;
      }
      // Regular paragraph
      return (
        <p key={idx} className="text-zinc-300 text-[13.5px] leading-relaxed my-1">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  // Inline formatting: **bold** and `code`
  const renderInlineMarkdown = (content: string) => {
    const parts = content.split(/(\*\*.*?\*\*|`.*?`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-semibold text-zinc-100">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={i}
            className="px-1.5 py-0.5 rounded bg-zinc-800/90 text-cyan-300 font-mono text-xs border border-zinc-700/60"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-6 group">
        <div className="flex items-start gap-3 max-w-[85%] sm:max-w-[75%] flex-row-reverse">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md">
            AC
          </div>

          <div className="flex flex-col items-end">
            <div className="relative px-4 py-3 rounded-2xl rounded-tr-sm bg-gradient-to-br from-cyan-950/60 via-zinc-900 to-zinc-900 border border-cyan-500/30 text-zinc-100 shadow-md">
              <p className="text-[13.5px] leading-relaxed whitespace-pre-wrap">{message.content}</p>

              {/* Attachments if any */}
              {message.attachments && message.attachments.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-cyan-500/20 flex flex-wrap gap-2">
                  {message.attachments.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-950/60 border border-cyan-500/20 text-xs text-cyan-300"
                    >
                      <Paperclip className="w-3 h-3" />
                      <span className="font-mono text-[11px]">{file.name}</span>
                      <span className="text-[10px] text-zinc-400">({file.size})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-1 px-1 text-[11px] text-zinc-400">
              <span>{message.timestamp}</span>
              <button
                onClick={handleCopyText}
                className="opacity-0 group-hover:opacity-100 hover:text-zinc-200 transition-opacity p-0.5"
                title="Copy text"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Assistant Message
  return (
    <div className="flex items-start gap-3.5 mb-8 group max-w-4xl">
      {/* AI Avatar */}
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-cyan-500/20 mt-1">
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        {/* Header: Model & Timestamp */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-zinc-200 tracking-tight">
            {message.model || 'DevKit AI'}
          </span>
          <span className="text-[10px] px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded font-medium">
            Assistant
          </span>
          <span className="text-[11px] text-zinc-400">• {message.timestamp}</span>
        </div>

        {/* Collapsible Thinking Process */}
        {message.thinkingProcess && (
          <div className="mb-3.5 rounded-xl border border-purple-500/25 bg-purple-950/15 overflow-hidden">
            <button
              onClick={() => setThinkingExpanded(!thinkingExpanded)}
              className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-purple-300 hover:bg-purple-900/20 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>
                  Thought Process {message.thinkingTime ? `(${message.thinkingTime})` : ''}
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-purple-400 transition-transform ${
                  thinkingExpanded ? 'rotate-180' : ''
                }`}
              />
            </button>

            {thinkingExpanded && (
              <div className="px-3 pb-3 pt-1 text-xs text-purple-200/80 font-mono leading-relaxed border-t border-purple-500/20 whitespace-pre-wrap">
                {message.thinkingProcess}
              </div>
            )}
          </div>
        )}

        {/* Message Content */}
        <div className="text-zinc-200">
          {renderFormattedText(message.content)}

          {/* Render Code Snippets */}
          {message.codeSnippets && message.codeSnippets.length > 0 && (
            <div className="my-3 space-y-3">
              {message.codeSnippets.map((snippet, idx) => {
                const isCodeCopied = copiedCodeIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-zinc-800/90 bg-[#090b10] overflow-hidden shadow-lg shadow-black/40"
                  >
                    {/* Code Header Bar */}
                    <div className="flex items-center justify-between px-3.5 py-2 bg-zinc-900/80 border-b border-zinc-800/80 text-xs font-mono text-zinc-400">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-zinc-300 font-medium">
                          {snippet.filename || snippet.language}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(snippet.code, idx)}
                        className="flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 hover:text-white transition-colors"
                      >
                        {isCodeCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400 font-sans">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="font-sans">Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Code Content */}
                    <div className="p-4 overflow-x-auto font-mono text-[13px] leading-relaxed text-zinc-200 bg-zinc-950/80">
                      <pre>
                        <code>{snippet.code}</code>
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Streaming Animation Pulse */}
          {message.isStreaming && (
            <div className="flex items-center gap-1.5 py-2 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse delay-150" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse delay-300" />
              <span className="text-xs text-zinc-400 ml-1 font-mono">Synthesizing solution...</span>
            </div>
          )}
        </div>

        {/* Message Actions Footer */}
        <div className="flex items-center gap-1 mt-3 text-zinc-500">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 text-xs transition-colors"
            title="Copy message"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={() => setFeedback(feedback === 'liked' ? null : 'liked')}
            className={`p-1.5 rounded-lg hover:bg-zinc-800 transition-colors ${
              feedback === 'liked' ? 'text-cyan-400 bg-cyan-500/10' : 'hover:text-zinc-200'
            }`}
            title="Good response"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setFeedback(feedback === 'disliked' ? null : 'disliked')}
            className={`p-1.5 rounded-lg hover:bg-zinc-800 transition-colors ${
              feedback === 'disliked' ? 'text-red-400 bg-red-500/10' : 'hover:text-zinc-200'
            }`}
            title="Poor response"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>

          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 text-xs transition-colors ml-1"
              title="Regenerate response"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span className="text-[11px]">Retry</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
