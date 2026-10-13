export type Role = 'user' | 'assistant';

export interface CodeSnippet {
  language: string;
  code: string;
  filename?: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  codeSnippets?: CodeSnippet[];
  isStreaming?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  timestamp: number;
  messages: Message[];
  pinned?: boolean;
}

export interface SuggestedPrompt {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: string;
  icon: string;
}
