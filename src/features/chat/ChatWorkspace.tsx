'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Message, SuggestedPrompt } from './types';
import { WelcomeScreen } from './WelcomeScreen';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';

interface ChatWorkspaceProps {
  messages: Message[];
  isLoading: boolean;
  suggestedPrompts: SuggestedPrompt[];
  onSendMessage: (text: string) => void;
}

export function ChatWorkspace({
  messages,
  isLoading,
  suggestedPrompts,
  onSendMessage,
}: ChatWorkspaceProps) {
  const [stagedPrompt, setStagedPrompt] = useState<string>('');
  const bottomAnchorRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when messages update or loading state changes
  useEffect(() => {
    bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSelectSuggestedPrompt = (prompt: string) => {
    // Populate the input or send immediately
    setStagedPrompt(prompt);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-gradient-to-b from-transparent via-[#090b12]/60 to-[#07080d]">
      {/* Scrollable Conversation or Welcome View */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 space-y-2">
        {messages.length > 0 ? (
          <div className="max-w-4xl mx-auto w-full">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={bottomAnchorRef} />
          </div>
        ) : (
          <WelcomeScreen
            prompts={suggestedPrompts}
            onSelectPrompt={handleSelectSuggestedPrompt}
          />
        )}
      </div>

      {/* Responsive Message Input */}
      <MessageInput
        onSendMessage={onSendMessage}
        isLoading={isLoading}
        stagedPrompt={stagedPrompt}
        onClearStagedPrompt={() => setStagedPrompt('')}
      />
    </div>
  );
}
