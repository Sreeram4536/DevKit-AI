'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Conversation, Message, SuggestedPrompt } from './types';
import {
  INITIAL_CONVERSATIONS,
  SUGGESTED_PROMPTS,
  generateMockResponse,
} from './mockData';
import { sendChatMessage } from './api/chat.api';

export function useChat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingConversationIdRef = useRef<string | null>(null);
  const pendingPlaceholderIdRef = useRef<string | null>(null);

  // Helper to cancel any ongoing response and clean up its placeholder message
  const cancelPendingResponse = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    // if (timeoutRef.current) {
    //   clearTimeout(timeoutRef.current);
    //   timeoutRef.current = null;
    // }

    const pendingConvId = pendingConversationIdRef.current;
    const placeholderId = pendingPlaceholderIdRef.current;

    if (pendingConvId && placeholderId) {
      // Remove unfinished placeholder from the conversation
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== pendingConvId) return conv;
          return {
            ...conv,
            messages: conv.messages.filter((m) => m.id !== placeholderId),
          };
        })
      );
    }

    pendingConversationIdRef.current = null;
    pendingPlaceholderIdRef.current = null;
    setIsLoading(false);
  }, []);

  // Clean up any pending response timer on unmount
  useEffect(() => {
    return () => {
      // if (timeoutRef.current) {
      //   clearTimeout(timeoutRef.current);
      // }
      abortControllerRef.current?.abort();
    };
  }, []);

  const currentConversation = conversations.find((c) => c.id === currentConversationId) || null;
  const messages = currentConversation ? currentConversation.messages : [];

  // Start a new clean conversation — cancels any pending response so it doesn't leak
  const startNewConversation = useCallback(() => {
    if (isLoading) {
      cancelPendingResponse();
    }
    setCurrentConversationId(null);
  }, [isLoading, cancelPendingResponse]);

  // Select an existing conversation — cancel pending response if switching away
  const selectConversation = useCallback(
    (id: string) => {
      if (id !== currentConversationId && isLoading) {
        cancelPendingResponse();
      }
      setCurrentConversationId(id);
    },
    [currentConversationId, isLoading, cancelPendingResponse]
  );

  // Delete a conversation — cancels pending response only if it belongs to the deleted conversation
  const deleteConversation = useCallback((id: string) => {
    if (pendingConversationIdRef.current === id) {
      // if (timeoutRef.current) {
      //   clearTimeout(timeoutRef.current);
      //   timeoutRef.current = null;
      // }
      cancelPendingResponse();
      // pendingConversationIdRef.current = null;
      // pendingPlaceholderIdRef.current = null;
      // setIsLoading(false);
    }

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
  // const sendMessage = useCallback(
  //   (content: string) => {
  //     if (!content.trim() || isLoading) return;

  // const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  // const timestamp = Date.now();



  //     const placeholderAssistantMsg: Message = {
  //       id: `assistant-${timestamp + 1}`,
  //       role: 'assistant',
  //       content: '',
  //       timestamp: now,
  //       isStreaming: true,
  //     };

  //     let activeId = currentConversationId;
  //     setIsLoading(true);

  //     // Single atomic update: Append BOTH userMessage and placeholderAssistantMsg together
  //     if (!activeId) {
  //       const generatedTitle =
  //         content.trim().slice(0, 36) + (content.trim().length > 36 ? '...' : '');
  //       const newConversation: Conversation = {
  //         id: `conv-${timestamp}`,
  //         title: generatedTitle,
  //         updatedAt: 'Just now',
  //         timestamp,
  //         messages: [userMessage, placeholderAssistantMsg],
  //       };

  //       setConversations((prev) => [newConversation, ...prev]);
  //       setCurrentConversationId(newConversation.id);
  //       activeId = newConversation.id;
  //     } else {
  //       setConversations((prev) =>
  //         prev.map((conv) =>
  //           conv.id === activeId
  //             ? {
  //                 ...conv,
  //                 updatedAt: 'Just now',
  //                 messages: [...conv.messages, userMessage, placeholderAssistantMsg],
  //               }
  //             : conv
  //         )
  //       );
  //     }

  //     // Clear any pending response timer before scheduling new one
  //     if (timeoutRef.current) {
  //       clearTimeout(timeoutRef.current);
  //     }

  //     // Track the active conversation and placeholder message for potential cancellation
  //     pendingConversationIdRef.current = activeId;
  //     pendingPlaceholderIdRef.current = placeholderAssistantMsg.id;

  //     // Simulate network / AI response delay (1.2 seconds)
  //     timeoutRef.current = setTimeout(() => {
  //       const mockResult = generateMockResponse(content);

  //       // Only deliver if this response has not been cancelled or conversation deleted
  //       if (pendingConversationIdRef.current === activeId) {
  //         setConversations((prev) =>
  //           prev.map((conv) => {
  //             if (conv.id !== activeId) return conv;
  //             return {
  //               ...conv,
  //               messages: conv.messages.map((m) =>
  //                 m.id === placeholderAssistantMsg.id
  //                   ? {
  //                       ...m,
  //                       content: mockResult.content,
  //                       codeSnippets: mockResult.codeSnippets,
  //                       isStreaming: false,
  //                     }
  //                   : m
  //               ),
  //             };
  //           })
  //         );
  //       }

  //       pendingConversationIdRef.current = null;
  //       pendingPlaceholderIdRef.current = null;
  //       timeoutRef.current = null;
  //       setIsLoading(false);
  //     }, 1200);
  //   },
  //   [currentConversationId, isLoading]
  // );

  const sendMessage = useCallback(async (content: string) => {
    const prompt = content.trim()
    if (!prompt || isLoading) return;

    const timestamp = Date.now()
    const time = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const conversationId =
      currentConversationId ?? `conv-${timestamp}`;

    const userMessage: Message = {
      id: `user-${timestamp}`,
      role: 'user',
      content: prompt,
      timestamp: time,
    };

    const placeholder: Message = {
      id: `assistant-${timestamp + 1}`,
      role: 'assistant',
      content: '',
      timestamp: time,
      isStreaming: true,
    };

    if (!currentConversationId) {
      const conversation: Conversation = {
        id: conversationId,
        title: prompt.slice(0, 36) + (prompt.length > 36 ? '...' : ''),
        updatedAt: 'Just now',
        timestamp,
        messages: [userMessage, placeholder],
      };

      setConversations((prev) => [conversation, ...prev]);
      setCurrentConversationId(conversationId);
    } else {
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === conversationId
            ? {
              ...conversation,
              updatedAt: 'Just now',
              messages: [
                ...conversation.messages,
                userMessage,
                placeholder,
              ],
            }
            : conversation,
        ),
      );
    }

    const controller = new AbortController();

    abortControllerRef.current = controller;
    pendingConversationIdRef.current = conversationId;
    pendingPlaceholderIdRef.current = placeholder.id;
    setIsLoading(true);

    const isCurrentRequest = () =>
      pendingConversationIdRef.current === conversationId &&
      pendingPlaceholderIdRef.current === placeholder.id;

    const finishAssistantMessage = (answer: string) => {
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id !== conversationId
            ? conversation
            : {
              ...conversation,
              messages: conversation.messages.map((message) =>
                message.id === placeholder.id
                  ? {
                    ...message,
                    content: answer,
                    isStreaming: false,
                  }
                  : message,
              ),
            },
        ),
      );
    };

    void (async () => {
      try {
        const result = await sendChatMessage(prompt, {
          signal: controller.signal,
        });

        if (isCurrentRequest()) {
          finishAssistantMessage(result.geminiResponse);
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        if (isCurrentRequest()) {
          finishAssistantMessage(
            error instanceof Error
              ? error.message
              : 'Unable to get an AI response. Please try again.',
          );
        }
      } finally {
        if (isCurrentRequest()) {
          pendingConversationIdRef.current = null;
          pendingPlaceholderIdRef.current = null;
          abortControllerRef.current = null;
          setIsLoading(false);
        }
      }
    })();


  }, [currentConversationId, isLoading])
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
    cancelPendingResponse,
  };
}
