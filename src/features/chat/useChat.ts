'use client';

import { useState, useRef, useCallback } from 'react';
import { Conversation, Message, SuggestedPrompt } from './types';
import {
  INITIAL_CONVERSATIONS,
  SUGGESTED_PROMPTS,
  generateMockResponse,
} from './mockData';

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>('conv-1');
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const currentConversation = conversations.find((c) => c.id === currentConversationId) || null;
  const messages = currentConversation ? currentConversation.messages : [];

  // Start a new clean conversation
  const startNewConversation = useCallback(() => {
    setCurrentConversationId(null);
  }, []);

  // Select an existing conversation
  const selectConversation = useCallback((id: string) => {
    setCurrentConversationId(id);
  }, []);

  // Delete a conversation
  const deleteConversation = useCallback((id: string) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (currentConversationId === id) {
        setCurrentConversationId(filtered.length > 0 ? filtered[0].id : null);
      }
      return filtered;
    });
  }, [currentConversationId]);

  // Toggle pin
  const togglePin = useCallback((id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  }, []);

  // Send a user message and trigger mock assistant response
  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      let activeId = currentConversationId;

      if (!activeId) {
        // Create a new conversation if on welcome screen
        const generatedTitle =
          content.trim().slice(0, 36) + (content.trim().length > 36 ? '...' : '');
        const newConversation: Conversation = {
          id: `conv-${Date.now()}`,
          title: generatedTitle,
          updatedAt: 'Just now',
          timestamp: Date.now(),
          messages: [userMessage],
        };

        setConversations((prev) => [newConversation, ...prev]);
        setCurrentConversationId(newConversation.id);
        activeId = newConversation.id;
      } else {
        // Append user message to existing conversation
        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeId
              ? {
                  ...conv,
                  updatedAt: 'Just now',
                  messages: [...conv.messages, userMessage],
                }
              : conv
          )
        );
      }

      // Display loading state with pending assistant message
      setIsLoading(true);

      const placeholderAssistantMsg: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isStreaming: true,
      };

      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === activeId
            ? {
                ...conv,
                messages: [...conv.messages, placeholderAssistantMsg],
              }
            : conv
        )
      );

      // Simulate network / AI response delay (1.2 seconds)
      timeoutRef.current = setTimeout(() => {
        const mockResult = generateMockResponse(content);

        setConversations((prev) =>
          prev.map((conv) =>
            conv.id === activeId
              ? {
                  ...conv,
                  messages: conv.messages.map((m) =>
                    m.id === placeholderAssistantMsg.id
                      ? {
                          ...m,
                          content: mockResult.content,
                          codeSnippets: mockResult.codeSnippets,
                          isStreaming: false,
                        }
                      : m
                  ),
                }
              : conv
          )
        );

        setIsLoading(false);
      }, 1200);
    },
    [currentConversationId, isLoading]
  );

  return {
    conversations,
    currentConversationId,
    currentConversation,
    messages,
    isLoading,
    suggestedPrompts: SUGGESTED_PROMPTS,
    sendMessage,
    startNewConversation,
    selectConversation,
    deleteConversation,
    togglePin,
  };
}
