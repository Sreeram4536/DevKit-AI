import { AIModel, Conversation, PromptSuggestion } from '../types/chat';

export const AVAILABLE_MODELS: AIModel[] = [
  {
    id: 'devkit-ultra',
    name: 'DevKit Ultra 4.5',
    provider: 'DevKit Intelligence',
    badge: 'Pro Default',
    description: 'Premier coding engine tuned for full-stack architectures, debugging, and systems design.',
    speed: 'Fast (~95 t/s)',
    intelligence: '99.2%',
    contextWindow: '256k tokens',
    accentColor: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'claude-3-7-sonnet',
    name: 'Claude 3.7 Sonnet',
    provider: 'Anthropic',
    badge: 'Hybrid Think',
    description: 'Superior reasoning and nuanced architectural decisions with hybrid chain-of-thought.',
    speed: 'Moderate (~65 t/s)',
    intelligence: '99.5%',
    contextWindow: '200k tokens',
    accentColor: 'from-amber-500 to-orange-600',
  },
  {
    id: 'deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'DeepSeek',
    badge: 'Reasoning',
    description: 'Deep mathematical proofs, low-level algorithms, and edge-case bug hunting.',
    speed: 'Thorough (~45 t/s)',
    intelligence: '98.9%',
    contextWindow: '128k tokens',
    accentColor: 'from-purple-500 to-indigo-600',
  },
  {
    id: 'gpt-4-5',
    name: 'GPT-4.5 Preview',
    provider: 'OpenAI',
    badge: 'Flagship',
    description: 'Broad knowledge synthesis, documentation generation, and rapid prototyping.',
    speed: 'Fast (~80 t/s)',
    intelligence: '99.1%',
    contextWindow: '128k tokens',
    accentColor: 'from-emerald-500 to-teal-600',
  },
];

export const PROMPT_SUGGESTIONS: PromptSuggestion[] = [
  {
    id: 'sug-1',
    title: 'Architect Next.js 16 App',
    category: 'Full-stack System',
    description: 'Server Actions, Turbopack, and optimistic UI transitions',
    prompt: 'Design a high-performance Next.js 16 App Router architecture using React Server Components, Server Actions with validation (Zod), and optimistic UI updates for real-time collaborative state.',
    icon: 'Layers',
  },
  {
    id: 'sug-2',
    title: 'Optimize Database & Cache',
    category: 'Backend & Performance',
    description: 'PostgreSQL indexes, connection pooling, and Redis tier',
    prompt: 'Review this high-throughput SQL query schema. Recommend compound indexes, explain analyze bottlenecks, and design a Redis stale-while-revalidate cache layer.',
    icon: 'Database',
  },
  {
    id: 'sug-3',
    title: 'Build Glassmorphism Design System',
    category: 'UI/UX & Frontend',
    description: 'Tailwind CSS v4 design tokens and micro-interactions',
    prompt: 'Generate an executive dashboard component with Tailwind CSS v4 featuring dark glassmorphic cards, glowing border gradients, animated metrics, and responsive sidebar layout.',
    icon: 'Palette',
  },
  {
    id: 'sug-4',
    title: 'Secure JWT Auth with Refresh Rotation',
    category: 'Security & Auth',
    description: 'HttpOnly cookie rotation and CSRF defense',
    prompt: 'Implement an end-to-end token rotation strategy using HttpOnly secure cookies, silent refresh handling, and token blacklisting in Node.js/TypeScript.',
    icon: 'ShieldCheck',
  },
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    title: 'Next.js 16 Server Components Architecture',
    updatedAt: '12 mins ago',
    timestamp: Date.now() - 1000 * 60 * 12,
    timeGroup: 'Today',
    pinned: true,
    model: 'devkit-ultra',
    messages: [
      {
        id: 'm1-1',
        role: 'user',
        content: 'How should I structure Server Actions and optimistic updates in Next.js 16 when building a real-time Kanban board?',
        timestamp: '10:24 AM',
      },
      {
        id: 'm1-2',
        role: 'assistant',
        content: `When building high-fidelity interactive applications in Next.js 16, the optimal pattern marries **Server Components** for zero-bundle-size initial payload with React 19's \`useOptimistic\` hook and Server Actions.

### Recommended Architectural Layers:
1. **Action Layer (\`actions/kanban.ts\`)**: Strict validation with Zod and \`revalidateTag\` cache invalidation.
2. **State Layer (\`components/KanbanBoard.tsx\`)**: Client component utilizing \`useOptimistic\` to immediately swap column items without waiting for the network roundtrip.
3. **Data Fetching Layer**: Server component wrapping the boundary with async parallel data streaming.

Here is the production-ready implementation:`,
        timestamp: '10:25 AM',
        model: 'DevKit Ultra 4.5',
        thinkingTime: '2.8s',
        thinkingProcess: 'Analyzing Next.js 16 App Router conventions and React 19 useOptimistic APIs. The user needs both server resilience and instant UI updates. Writing structured TypeScript code with type-safety and error rollback.',
        codeSnippets: [
          {
            language: 'typescript',
            filename: 'components/kanban-board.tsx',
            code: `'use client';

import { useOptimistic, useTransition } from 'react';
import { updateCardPosition } from '@/actions/kanban';

interface Card {
  id: string;
  title: string;
  columnId: 'todo' | 'in_progress' | 'done';
}

export function KanbanBoard({ initialCards }: { initialCards: Card[] }) {
  const [isPending, startTransition] = useTransition();

  const [optimisticCards, setOptimisticCards] = useOptimistic(
    initialCards,
    (state, update: { cardId: string; nextColumn: Card['columnId'] }) =>
      state.map((card) =>
        card.id === update.cardId ? { ...card, columnId: update.nextColumn } : card
      )
  );

  const handleMove = (cardId: string, nextColumn: Card['columnId']) => {
    startTransition(async () => {
      setOptimisticCards({ cardId, nextColumn });
      const result = await updateCardPosition(cardId, nextColumn);
      if (!result.success) {
        console.error('Failed to persist position, rollback state active.');
      }
    });
  };

  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {/* Column boards render optimisticCards with silky 60fps drag and drop */}
    </div>
  );
}`,
          },
        ],
      },
      {
        id: 'm1-3',
        role: 'user',
        content: 'What happens if the network fails midway through the move? How does useOptimistic revert?',
        timestamp: '10:28 AM',
      },
      {
        id: 'm1-4',
        role: 'assistant',
        content: `React 19's \`useOptimistic\` automatically manages the rollback cycle because the optimistic value is derived directly from the canonical state (\`initialCards\`).

If an error is thrown inside \`startTransition\`:
- The transition completes in an error state.
- React immediately discards the optimistic reduction and cleanly re-renders using the canonical props received from the server.
- No manual rollback imperative code is necessary!

For toast notifications, you can catch the rejection and surface a brief toast:
\`\`\`tsx
try {
  await updateCardPosition(cardId, nextColumn);
} catch (err) {
  toast.error("Could not sync changes to cloud. Reverting card.");
}
\`\`\``,
        timestamp: '10:29 AM',
        model: 'DevKit Ultra 4.5',
      },
    ],
  },
  {
    id: 'conv-2',
    title: 'Glassmorphism Design Tokens & CSS Variables',
    updatedAt: '2 hours ago',
    timestamp: Date.now() - 1000 * 60 * 120,
    timeGroup: 'Today',
    pinned: true,
    model: 'claude-3-7-sonnet',
    messages: [
      {
        id: 'm2-1',
        role: 'user',
        content: 'Can you give me sleek dark mode glassmorphism token definitions for a modern developer IDE UI?',
        timestamp: '08:45 AM',
      },
      {
        id: 'm2-2',
        role: 'assistant',
        content: `Here is a curated palette of semantic CSS tokens designed specifically for sleek developer tool interfaces. They combine deep void backgrounds (\`#0a0b10\`) with translucent borders and layered backdrop blur.`,
        timestamp: '08:46 AM',
        model: 'Claude 3.7 Sonnet',
        thinkingTime: '3.4s',
        thinkingProcess: 'Formulating multi-layer CSS glassmorphic tokens. Ensuring high contrast ratios (WCAG AA/AAA compliant) while preserving the ethereal aesthetic with subtle 1px border glows and ambient gradients.',
        codeSnippets: [
          {
            language: 'css',
            filename: 'styles/glassmorphism.css',
            code: `:root {
  --surface-ground: #07090e;
  --surface-panel: rgba(15, 18, 28, 0.72);
  --surface-glass-active: rgba(30, 35, 54, 0.85);
  
  --border-subtle: rgba(255, 255, 255, 0.06);
  --border-accent: rgba(6, 182, 212, 0.35);
  --glow-cyan: 0 0 25px -5px rgba(6, 182, 212, 0.25);
  
  --backdrop-blur: blur(20px);
}

.glass-card {
  background: var(--surface-panel);
  border: 1px solid var(--border-subtle);
  backdrop-filter: var(--backdrop-blur);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: var(--glow-cyan);
}`,
          },
        ],
      },
    ],
  },
  {
    id: 'conv-3',
    title: 'PostgreSQL Multi-tenant Partitioning',
    updatedAt: 'Yesterday',
    timestamp: Date.now() - 1000 * 60 * 60 * 26,
    timeGroup: 'Yesterday',
    pinned: false,
    model: 'deepseek-r1',
    messages: [
      {
        id: 'm3-1',
        role: 'user',
        content: 'We have 250M rows in our audit logs table. Should we use declarative table partitioning by range or list by tenant_id?',
        timestamp: 'Yesterday 4:15 PM',
      },
      {
        id: 'm3-2',
        role: 'assistant',
        content: `For audit logs with 250M+ rows, **range partitioning by date** (e.g., monthly) with a composite index on \`(tenant_id, created_at DESC)\` is vastly superior to list partitioning by tenant.

### Why Date Range Wins:
1. **Data lifecycle retention**: Dropping or archiving an old month is an instantaneous \`DROP TABLE audit_logs_2025_01\` (metadata-only zero disk IO) rather than millions of expensive row deletes that bloat WAL and trigger autovacuum storms.
2. **Partition count explosion**: List partitioning by tenant fails if you onboard hundreds of thousands of tenants (exceeding PostgreSQL catalog cache limits).`,
        timestamp: 'Yesterday 4:17 PM',
        model: 'DeepSeek R1',
        thinkingTime: '4.9s',
        thinkingProcess: 'Analyzing storage engine internals, partition pruning in Postgres 15+, and disk vacuum mechanics for multi-hundred million row OLTP tables.',
      },
    ],
  },
  {
    id: 'conv-4',
    title: 'FastAPI Microservice Async Pool Tuning',
    updatedAt: '3 days ago',
    timestamp: Date.now() - 1000 * 60 * 60 * 74,
    timeGroup: 'Previous 7 Days',
    pinned: false,
    model: 'gpt-4-5',
    messages: [
      {
        id: 'm4-1',
        role: 'user',
        content: 'How do I optimize async SQLAlchemy connection pools under high concurrency spikes with Uvicorn?',
        timestamp: '3 days ago',
      },
      {
        id: 'm4-2',
        role: 'assistant',
        content: `When tuning SQLAlchemy \`AsyncEngine\` behind Uvicorn workers, you must calculate total connections:
\`Total DB Conns = (Uvicorn Workers) × (pool_size + max_overflow)\`.

Configure the pool with \`pool_pre_ping=True\` and keep \`pool_recycle\` around 1800 seconds to avoid silent firewall TCP drops.`,
        timestamp: '3 days ago',
        model: 'GPT-4.5 Preview',
      },
    ],
  },
  {
    id: 'conv-5',
    title: 'Docker Multi-stage Builds for Turborepo',
    updatedAt: '5 days ago',
    timestamp: Date.now() - 1000 * 60 * 60 * 120,
    timeGroup: 'Previous 7 Days',
    pinned: false,
    model: 'devkit-ultra',
    messages: [
      {
        id: 'm5-1',
        role: 'user',
        content: 'How do I generate an ultra-lean 80MB Docker image for a specific Next.js app inside a large monorepo?',
        timestamp: '5 days ago',
      },
      {
        id: 'm5-2',
        role: 'assistant',
        content: `Use Turborepo's \`turbo prune --scope=web --docker\` command to produce a stripped-down lockfile and dependency subset before executing the container build.`,
        timestamp: '5 days ago',
        model: 'DevKit Ultra 4.5',
      },
    ],
  },
];
