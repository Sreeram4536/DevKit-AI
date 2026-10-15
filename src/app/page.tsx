'use client';

import React, { useState } from 'react';
import { useChat, ChatWorkspace } from '@/features/chat';
import { Sidebar, Header } from '@/components';

export default function Home() {
  const {
    conversations,
    currentConversationId,
    currentConversation,
    messages,
    isLoading,
    suggestedPrompts,
    sendMessage,
    startNewConversation,
    selectConversation,
    deleteConversation,
    togglePin,
  } = useChat();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const title = currentConversation ? currentConversation.title : 'New Conversation';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#08090e] text-zinc-100 font-sans">
      {/* Sidebar with conversation history */}
      <Sidebar
        conversations={conversations}
        activeId={currentConversationId}
        onSelectConversation={selectConversation}
        onNewChat={startNewConversation}
        onDeleteConversation={deleteConversation}
        onTogglePin={togglePin}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Chat Workspace */}
      <main className="flex-1 flex flex-col min-w-0 h-screen relative">
        <Header
          title={title}
          onToggleSidebar={() => {
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
              setIsMobileOpen(!isMobileOpen);
            } else {
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }
          }}
          onNewChat={startNewConversation}
        />

        <ChatWorkspace
          messages={messages}
          isLoading={isLoading}
          suggestedPrompts={suggestedPrompts}
          onSendMessage={sendMessage}
        />
      </main>
    </div>
  );
}
