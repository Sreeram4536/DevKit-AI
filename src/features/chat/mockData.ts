import { SuggestedPrompt, Conversation, Message } from './types';

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: 'prompt-1',
    title: 'Next.js 16 Server Actions',
    description: 'Implement optimistic UI updates with React 19',
    prompt: 'How do I implement optimistic updates with Server Actions and useOptimistic in Next.js 16?',
    category: 'Architecture',
    icon: 'Layers',
  },
  {
    id: 'prompt-2',
    title: 'PostgreSQL Query Optimization',
    description: 'Design composite indexes and analyze slow queries',
    prompt: 'Explain how to design composite indexes for high-throughput tables in PostgreSQL with explain analyze.',
    category: 'Database',
    icon: 'Database',
  },
  {
    id: 'prompt-3',
    title: 'Glassmorphic Tailwind UI',
    description: 'Create modern dark cards with subtle borders & glow',
    prompt: 'Generate modern dark mode glassmorphism card styles using Tailwind CSS with subtle border glows.',
    category: 'Frontend',
    icon: 'Palette',
  },
  {
    id: 'prompt-4',
    title: 'Secure JWT Authentication',
    description: 'Configure HttpOnly cookie rotation & refresh tokens',
    prompt: 'What is the best practice for implementing silent token rotation with HttpOnly secure cookies in Next.js?',
    category: 'Security',
    icon: 'ShieldCheck',
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Next.js 16 Server Actions & Optimistic State',
    updatedAt: 'Just now',
    timestamp: Date.now() - 1000 * 60 * 10,
    pinned: true,
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'How do I implement optimistic updates with Server Actions and useOptimistic in Next.js 16?',
        timestamp: '10:15 AM',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `In Next.js 16 and React 19, the \`useOptimistic\` hook provides zero-latency UI updates while executing Server Actions in the background.

### Core Architecture:
1. **Canonical State**: The state passed from Server Components as props.
2. **Optimistic Layer**: \`useOptimistic\` wraps your state and calculates the immediate view.
3. **Transition Boundary**: Execute mutations inside \`startTransition\` so React can rollback if the network rejects.

Here is the implementation:`,
        timestamp: '10:16 AM',
        codeSnippets: [
          {
            language: 'typescript',
            filename: 'components/task-list.tsx',
            code: `'use client';

import { useOptimistic, useTransition } from 'react';
import { toggleTaskCompletion } from '@/app/actions/tasks';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export function TaskList({ initialTasks }: { initialTasks: Task[] }) {
  const [isPending, startTransition] = useTransition();

  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    initialTasks,
    (state, taskId: string) =>
      state.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
  );

  const handleToggle = (taskId: string) => {
    startTransition(async () => {
      setOptimisticTasks(taskId);
      await toggleTaskCompletion(taskId);
    });
  };

  return (
    <ul className="space-y-2">
      {optimisticTasks.map((task) => (
        <li
          key={task.id}
          onClick={() => handleToggle(task.id)}
          className="cursor-pointer p-3 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-between"
        >
          <span className={task.completed ? 'line-through text-zinc-500' : 'text-zinc-200'}>
            {task.title}
          </span>
          <span className="text-xs text-cyan-400">{task.completed ? 'Done' : 'Pending'}</span>
        </li>
      ))}
    </ul>
  );
}`,
          },
        ],
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Tailwind Glassmorphic Design System',
    updatedAt: '2 hours ago',
    timestamp: Date.now() - 1000 * 60 * 120,
    pinned: false,
    messages: [
      {
        id: 'msg-3',
        role: 'user',
        content: 'Generate modern dark mode glassmorphism card styles using Tailwind CSS with subtle border glows.',
        timestamp: '08:30 AM',
      },
      {
        id: 'msg-4',
        role: 'assistant',
        content: `Here are the modern glassmorphic classes for dark developer UIs using deep void backdrops and translucent borders.`,
        timestamp: '08:31 AM',
        codeSnippets: [
          {
            language: 'html',
            filename: 'card-component.tsx',
            code: `<div className="relative rounded-2xl bg-zinc-900/60 p-6 backdrop-blur-xl border border-white/[0.08] shadow-2xl hover:border-cyan-500/30 transition-all">
  <div className="absolute -top-12 -left-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
  <h3 className="text-lg font-semibold text-white">Glassmorphism Card</h3>
  <p className="text-sm text-zinc-400 mt-2">Layered backdrop blur with 1px border highlight.</p>
</div>`,
          },
        ],
      },
    ],
  },
];

export function generateMockResponse(prompt: string): {
  content: string;
  codeSnippets?: { language: string; code: string; filename?: string }[];
} {
  const query = prompt.toLowerCase();

  if (query.includes('next') || query.includes('react') || query.includes('component')) {
    return {
      content: `Here is the architectural pattern for your React & Next.js query. React 19 introduces optimized server-client handshakes with zero hydration waterfalls.

### Best Practices:
- Keep client boundaries at interactive leaf nodes.
- Utilize Server Actions with strict Zod validation.
- Return structured status indicators from transitions.`,
      codeSnippets: [
        {
          language: 'typescript',
          filename: 'actions/submit.ts',
          code: `'use server';

export async function submitData(formData: FormData) {
  const rawTitle = formData.get('title') as string;
  if (!rawTitle) {
    return { success: false, error: 'Title is required' };
  }

  // Persist record
  return { success: true, timestamp: Date.now() };
}`,
        },
      ],
    };
  }

  if (query.includes('database') || query.includes('postgres') || query.includes('sql') || query.includes('index')) {
    return {
      content: `When tuning database performance for high traffic workloads:

### Key Strategies:
1. **Compound Indexes**: Place highest-selectivity columns first in multi-column indexes.
2. **Covering Indexes (\`INCLUDE\`)**: Add queried projections to the index leaf to eliminate table heap reads.
3. **Partitioning**: Partition time-series data by monthly range to drop partitions instantaneously without vacuum storms.`,
      codeSnippets: [
        {
          language: 'sql',
          filename: 'migrations/index.sql',
          code: `CREATE INDEX CONCURRENTLY idx_users_org_created 
ON users (org_id, created_at DESC) 
INCLUDE (email, status);`,
        },
      ],
    };
  }

  if (query.includes('jwt') || query.includes('auth') || query.includes('token') || query.includes('cookie')) {
    return {
      content: `For secure authentication in modern web applications:

### Security Directives:
- Store session tokens in **HttpOnly, Secure, SameSite=Lax** cookies.
- Maintain short token lifetimes (e.g., 15 minutes for access tokens, 7 days for rotating refresh tokens).
- Invalidate token families upon detecting reused refresh tokens.`,
      codeSnippets: [
        {
          language: 'typescript',
          filename: 'lib/auth.ts',
          code: `import { cookies } from 'next/headers';

export async function setAuthCookies(accessToken: string, refreshToken: string) {
  const cookieStore = await cookies();
  
  cookieStore.set('access_token', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 15, // 15 mins
    path: '/',
  });
}`,
        },
      ],
    };
  }

  // Default response
  return {
    content: `I've analyzed your prompt: **"${prompt}"**.

### Overview & Recommendations:
1. **Modular Architecture**: Separate state management from presentation layers.
2. **Type Safety**: Enforce explicit contracts across API boundaries.
3. **Optimized Rendering**: Prevent redundant reconciliation passes using memoization where necessary.

Here is a clean implementation example:`,
    codeSnippets: [
      {
        language: 'typescript',
        filename: 'utils/handler.ts',
        code: `export function processRequest<T>(payload: T): { success: boolean; data: T } {
  console.log('Processing request payload...', payload);
  return {
    success: true,
    data: payload,
  };
}`,
      },
    ],
  };
}
