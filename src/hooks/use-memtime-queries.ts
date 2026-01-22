import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getClients,
  getProjects,
  getTasks,
  getTimeEntries,
  getTimeEntry,
  createTimeEntry,
  updateTimeEntry,
  getAllTasks,
} from '@/api/memtime'
import { queryKeys } from '@/lib/query-client'
import type { CreateTimeEntryRequest, UpdateTimeEntryRequest } from '@/types/memtime'

// =============================================================================
// Clients
// =============================================================================

export function useClients(params: { limit?: number; offset?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.clients.list(params),
    queryFn: () => getClients({ data: params }),
  })
}

// =============================================================================
// Projects
// =============================================================================

export function useProjects(
  clientId: string | number,
  params: { limit?: number; offset?: number } = {},
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: queryKeys.projects.list(clientId, params),
    queryFn: () => getProjects({ data: { clientId, ...params } }),
    enabled: options.enabled ?? true,
  })
}

// =============================================================================
// Tasks
// =============================================================================

export function useTasks(
  projectId: string | number,
  params: { limit?: number; offset?: number } = {},
  options: { enabled?: boolean } = {},
) {
  return useQuery({
    queryKey: queryKeys.tasks.list(projectId, params),
    queryFn: () => getTasks({ data: { projectId, ...params } }),
    enabled: options.enabled ?? true,
  })
}

export function useAllTasks() {
  return useQuery({
    queryKey: queryKeys.tasks.allFlat,
    queryFn: () => getAllTasks(),
    // All tasks is expensive, cache longer
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

// =============================================================================
// Time Entries
// =============================================================================

export function useTimeEntries(params: { limit?: number; offset?: number } = {}) {
  return useQuery({
    queryKey: queryKeys.timeEntries.list(params),
    queryFn: () => getTimeEntries({ data: params }),
  })
}

export function useTimeEntry(id: string | number, options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: queryKeys.timeEntries.detail(id),
    queryFn: () => getTimeEntry({ data: { id } }),
    enabled: options.enabled ?? true,
  })
}

export function useCreateTimeEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateTimeEntryRequest) => createTimeEntry({ data }),
    onSuccess: () => {
      // Invalidate time entries list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.timeEntries.all })
    },
  })
}

export function useUpdateTimeEntry() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { id: string | number } & UpdateTimeEntryRequest) =>
      updateTimeEntry({ data }),
    onSuccess: (_, variables) => {
      // Invalidate both the list and the specific entry
      queryClient.invalidateQueries({ queryKey: queryKeys.timeEntries.all })
      queryClient.invalidateQueries({
        queryKey: queryKeys.timeEntries.detail(variables.id),
      })
    },
  })
}
