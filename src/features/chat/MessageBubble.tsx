'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, FileCode, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Message } from './types';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const [copiedText, setCopiedText] = useState(false);
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const handleCopyText = () => {
    navigator.clipboard.writeText(message.content);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Helper to format markdown text
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      if (line.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-sm font-semibold text-zinc-100 mt-3 mb-1.5 tracking-tight">
            {line.replace('### ', '')}
          </h3>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-base font-semibold text-zinc-50 mt-4 mb-2 tracking-tight">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={idx} className="ml-4 list-disc text-zinc-300 my-0.5 text-[13px] leading-relaxed">
            {renderInlineMarkdown(line.trim().substring(2))}
          </li>
        );
      }
      if (/^\d+\.\s/.test(line.trim())) {
        return (
          <div key={idx} className="flex gap-2 text-zinc-300 my-0.5 text-[13px] leading-relaxed pl-1">
            <span className="text-cyan-400 font-mono text-xs shrink-0">
              {line.trim().match(/^\d+\./)?.[0]}
            </span>
            <span>{renderInlineMarkdown(line.trim().replace(/^\d+\.\s/, ''))}</span>
          </div>
        );
      }
      if (line.trim() === '') {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-zinc-300 text-[13px] leading-relaxed my-0.5">
          {renderInlineMarkdown(line)}
        </p>
      );
    });
  };

  const renderInlineMarkdown = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
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
            className="px-1.5 py-0.5 rounded bg-zinc-800 text-cyan-300 font-mono text-[11px] border border-zinc-700/60"
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
      <div className="flex justify-end mb-5 group">
        <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%] flex-row-reverse">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-md">
            U
          </div>
          <div className="flex flex-col items-end">
            <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm bg-gradient-to-br from-cyan-950/70 via-zinc-900 to-zinc-900 border border-cyan-500/30 text-zinc-100 text-[13.5px] leading-relaxed shadow-sm whitespace-pre-wrap">
              {message.content}
            </div>
            <div className="flex items-center gap-2 mt-1 px-1 text-[10px] text-zinc-400">
              <span>{message.timestamp}</span>
              <button
                onClick={handleCopyText}
                className="opacity-0 group-hover:opacity-100 hover:text-zinc-200 transition-opacity"
                title="Copy message"
              >
                {copiedText ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 mb-6 group max-w-4xl">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-cyan-500/20 mt-1">
        <Sparkles className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-semibold text-zinc-200">DevKit AI</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-zinc-800 text-zinc-400 rounded font-medium">
            Assistant
          </span>
          <span className="text-[10px] text-zinc-400">• {message.timestamp}</span>
        </div>

        <div className="text-zinc-200">
          {renderFormattedContent(message.content)}

          {/* Render Code Snippets */}
          {message.codeSnippets && message.codeSnippets.length > 0 && (
            <div className="my-3 space-y-2.5">
              {message.codeSnippets.map((snippet, idx) => {
                const isCopied = copiedCodeIdx === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-zinc-800 bg-[#090b10] overflow-hidden shadow-lg"
                  >
                    <div className="flex items-center justify-between px-3 py-1.5 bg-zinc-900/90 border-b border-zinc-800 text-xs font-mono text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-zinc-300 text-[11px]">
                          {snippet.filename || snippet.language}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyCode(snippet.code, idx)}
                        className="flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="p-3.5 overflow-x-auto font-mono text-xs leading-relaxed text-zinc-200 bg-zinc-950/90">
                      <pre>
                        <code>{snippet.code}</code>
                      </pre>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Loading / Streaming Pulse */}
          {message.isStreaming && (
            <div className="flex items-center gap-1.5 py-2 text-cyan-400">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse delay-150" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse delay-300" />
              <span className="text-xs text-zinc-400 ml-1 font-mono">Synthesizing response...</span>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-1 mt-2 text-zinc-500">
          <button
            onClick={handleCopyText}
            className="flex items-center gap-1 px-2 py-1 rounded hover:bg-zinc-800 hover:text-zinc-200 text-xs transition-colors"
            title="Copy response"
          >
            {copiedText ? (
              <Check className="w-3 h-3 text-emerald-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
            <span className="text-[11px]">{copiedText ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
