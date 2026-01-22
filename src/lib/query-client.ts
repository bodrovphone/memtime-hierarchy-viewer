import { QueryClient } from '@tanstack/react-query'

/**
 * Default cache times for TanStack Query
 * - staleTime: How long data is considered fresh (no refetch)
 * - gcTime: How long inactive data stays in cache
 */
const FIVE_MINUTES = 5 * 60 * 1000
const THIRTY_MINUTES = 30 * 60 * 1000

/**
 * Creates a new QueryClient with optimized caching for the Memtime API
 * Rate limit: 15 requests/60 seconds - caching helps avoid hitting limits
 */
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is fresh for 5 minutes - no refetch during this time
        staleTime: FIVE_MINUTES,
        // Keep inactive data in cache for 30 minutes
        gcTime: THIRTY_MINUTES,
        // Retry failed requests once
        retry: 1,
        // Don't refetch on window focus (reduces API calls)
        refetchOnWindowFocus: false,
      },
    },
  })
}

/**
 * Query keys factory for consistent cache key management
 */
export const queryKeys = {
  // Clients
  clients: {
    all: ['clients'] as const,
    list: (params: { limit?: number; offset?: number }) =>
      ['clients', 'list', params] as const,
  },

  // Projects
  projects: {
    all: ['projects'] as const,
    byClient: (clientId: string | number) =>
      ['projects', 'byClient', clientId] as const,
    list: (clientId: string | number, params: { limit?: number; offset?: number }) =>
      ['projects', 'byClient', clientId, 'list', params] as const,
  },

  // Tasks
  tasks: {
    all: ['tasks'] as const,
    byProject: (projectId: string | number) =>
      ['tasks', 'byProject', projectId] as const,
    list: (projectId: string | number, params: { limit?: number; offset?: number }) =>
      ['tasks', 'byProject', projectId, 'list', params] as const,
    allFlat: ['tasks', 'allFlat'] as const,
  },

  // Time Entries
  timeEntries: {
    all: ['timeEntries'] as const,
    list: (params: { limit?: number; offset?: number }) =>
      ['timeEntries', 'list', params] as const,
    detail: (id: string | number) => ['timeEntries', 'detail', id] as const,
  },
}
