export type Role = 'user' | 'assistant' | 'system';

export interface CodeSnippet {
  language: string;
  filename?: string;
  code: string;
}

export interface Attachment {
  name: string;
  size: string;
  type: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: string;
  model?: string;
  thinkingProcess?: string;
  thinkingTime?: string;
  attachments?: Attachment[];
  codeSnippets?: CodeSnippet[];
  isStreaming?: boolean;
}

export type TimeGroup = 'Pinned' | 'Today' | 'Yesterday' | 'Previous 7 Days' | 'Older';

export interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
  timestamp: number;
  timeGroup: TimeGroup;
  pinned: boolean;
  messages: Message[];
  model: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: string;
  badge: string;
  description: string;
  speed: string;
  intelligence: string;
  contextWindow: string;
  accentColor: string;
}

export interface PromptSuggestion {
  id: string;
  title: string;
  category: string;
  description: string;
  prompt: string;
  icon: string;
}
