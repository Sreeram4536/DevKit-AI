'use client';

import React, { useState } from 'react';
import { X, Copy, Check, Share2, Globe, Lock } from 'lucide-react';
import { Conversation } from '../types/chat';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversation: Conversation | null;
}

export function ShareModal({ isOpen, onClose, conversation }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [includeSystemInfo, setIncludeSystemInfo] = useState(true);

  if (!isOpen || !conversation) return null;

  const shareUrl = `https://devkit.ai/share/${conversation.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md select-none">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0d1019] border border-zinc-800 shadow-2xl overflow-hidden text-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/80">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-sm text-white">Share Conversation</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <div className="text-zinc-400 mb-1">Chat Title</div>
            <div className="font-medium text-white text-sm bg-zinc-900/80 p-2.5 rounded-xl border border-zinc-800/80 truncate">
              {conversation.title}
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">
              Contains {conversation.messages.length} messages • Model: {conversation.model}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <div>
                <div className="font-medium text-white">Public link access</div>
                <div className="text-[11px] text-zinc-400">Anyone with this link can view the thread</div>
              </div>
            </div>
          </div>

          {/* Copy Link Input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 bg-zinc-950 rounded-xl border border-zinc-800 text-zinc-300 font-mono text-[11px] outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition-all shadow-md shrink-0"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-zinc-950/80 border-t border-zinc-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
