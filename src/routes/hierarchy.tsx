import { useState, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, RefreshCw, AlertCircle } from 'lucide-react'

import { TreeNode, TreeNodeSkeleton } from '@/components/TreeNode'
import { Toast } from '@/components/Toast'
import { useClients, useProjects, useTasks } from '@/hooks/use-memtime-queries'
import { getProjects, getTasks } from '@/api/memtime'
import { copyToClipboard } from '@/utils/clipboard'
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination'
import { queryKeys } from '@/lib/query-client'
import type { Client, Project, Task, TreeNodeType } from '@/types/memtime'
import type { HierarchyState } from '@/types/hierarchy'

// =============================================================================
// Route Definition
// =============================================================================

export const Route = createFileRoute('/hierarchy')({
  component: HierarchyPage,
  pendingComponent: LoadingState,
  errorComponent: ErrorState,
})

// =============================================================================
// Main Component
// =============================================================================

function HierarchyPage() {
  const queryClient = useQueryClient()

  // Fetch initial clients with React Query (cached!)
  const {
    data: clientsData,
    isLoading: isLoadingClients,
    error: clientsError,
    refetch: refetchClients,
  } = useClients({ limit: DEFAULT_PAGE_SIZE, offset: 0 })

  // Local state for expanded tree data (beyond initial load)
  const [state, setState] = useState<HierarchyState>({
    clients: { items: [], total: 0, loaded: 0, hasMore: false },
    projects: {},
    tasks: {},
  })

  // Sync clients data from React Query to local state
  const clients = clientsData?.data ?? []
  const clientsTotal = clientsData?.total ?? 0
  const clientsHasMore = clients.length < clientsTotal

  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // ---------------------------------------------------------------------------
  // Refresh - Invalidate cache and refetch
  // ---------------------------------------------------------------------------
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      // Invalidate all hierarchy-related queries
      await queryClient.invalidateQueries({ queryKey: queryKeys.clients.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.projects.all })
      await queryClient.invalidateQueries({ queryKey: queryKeys.tasks.all })
      // Reset local state
      setState({
        clients: { items: [], total: 0, loaded: 0, hasMore: false },
        projects: {},
        tasks: {},
      })
      await refetchClients()
    } finally {
      setIsRefreshing(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Handle Task Click - Copy ID to Clipboard
  // ---------------------------------------------------------------------------
  const handleTaskClick = useCallback(async (taskId: string | number) => {
    try {
      await copyToClipboard(String(taskId))
      setToast(`Task ID ${taskId} copied to clipboard`)
    } catch {
      setError('Failed to copy to clipboard')
    }
  }, [])

  // ---------------------------------------------------------------------------
  // Load Projects for a Client (with caching)
  // ---------------------------------------------------------------------------
  const loadProjects = useCallback(
    async (clientId: string | number) => {
      try {
        setError(null)

        // Check cache first
        const cached = queryClient.getQueryData(
          queryKeys.projects.list(clientId, { limit: DEFAULT_PAGE_SIZE, offset: 0 }),
        )

        if (cached) {
          const response = cached as { data: Project[]; total: number }
          setState((prev) => ({
            ...prev,
            projects: {
              ...prev.projects,
              [clientId]: {
                items: response.data,
                total: response.total,
                loaded: response.data.length,
                hasMore: response.data.length < response.total,
              },
            },
          }))
          return
        }

        // Fetch and cache
        const response = await queryClient.fetchQuery({
          queryKey: queryKeys.projects.list(clientId, {
            limit: DEFAULT_PAGE_SIZE,
            offset: 0,
          }),
          queryFn: () =>
            getProjects({ data: { clientId, limit: DEFAULT_PAGE_SIZE, offset: 0 } }),
        })

        setState((prev) => ({
          ...prev,
          projects: {
            ...prev.projects,
            [clientId]: {
              items: response.data,
              total: response.total,
              loaded: response.data.length,
              hasMore: response.data.length < response.total,
            },
          },
        }))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load projects')
        throw err
      }
    },
    [queryClient],
  )

  // ---------------------------------------------------------------------------
  // Load Tasks for a Project (with caching)
  // ---------------------------------------------------------------------------
  const loadTasks = useCallback(
    async (projectId: string | number) => {
      try {
        setError(null)

        // Check cache first
        const cached = queryClient.getQueryData(
          queryKeys.tasks.list(projectId, { limit: DEFAULT_PAGE_SIZE, offset: 0 }),
        )

        if (cached) {
          const response = cached as { data: Task[]; total: number }
          setState((prev) => ({
            ...prev,
            tasks: {
              ...prev.tasks,
              [projectId]: {
                items: response.data,
                total: response.total,
                loaded: response.data.length,
                hasMore: response.data.length < response.total,
              },
            },
          }))
          return
        }

        // Fetch and cache
        const response = await queryClient.fetchQuery({
          queryKey: queryKeys.tasks.list(projectId, {
            limit: DEFAULT_PAGE_SIZE,
            offset: 0,
          }),
          queryFn: () =>
            getTasks({ data: { projectId, limit: DEFAULT_PAGE_SIZE, offset: 0 } }),
        })

        setState((prev) => ({
          ...prev,
          tasks: {
            ...prev.tasks,
            [projectId]: {
              items: response.data,
              total: response.total,
              loaded: response.data.length,
              hasMore: response.data.length < response.total,
            },
          },
        }))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load tasks')
        throw err
      }
    },
    [queryClient],
  )

  // ---------------------------------------------------------------------------
  // Handle Expand
  // ---------------------------------------------------------------------------
  const handleExpand = useCallback(
    async (id: string | number, type: TreeNodeType) => {
      if (type === 'client') {
        await loadProjects(id)
      } else if (type === 'project') {
        await loadTasks(id)
      }
    },
    [loadProjects, loadTasks],
  )

  // ---------------------------------------------------------------------------
  // Load More Items
  // ---------------------------------------------------------------------------
  const handleLoadMore = useCallback(
    async (id: string | number, type: TreeNodeType) => {
      try {
        setError(null)

        if (type === 'client') {
          // Load more clients
          const currentOffset = state.clients.loaded || clients.length
          const response = await queryClient.fetchQuery({
            queryKey: queryKeys.clients.list({
              limit: DEFAULT_PAGE_SIZE,
              offset: currentOffset,
            }),
            queryFn: () =>
              import('@/api/memtime').then((m) =>
                m.getClients({ data: { limit: DEFAULT_PAGE_SIZE, offset: currentOffset } }),
              ),
          })

          setState((prev) => ({
            ...prev,
            clients: {
              items: response.data,
              total: response.total,
              loaded: currentOffset + response.data.length,
              hasMore: currentOffset + response.data.length < response.total,
            },
          }))
        } else if (type === 'project') {
          const projectState = state.projects[id]
          if (!projectState) return

          const response = await queryClient.fetchQuery({
            queryKey: queryKeys.projects.list(id, {
              limit: DEFAULT_PAGE_SIZE,
              offset: projectState.loaded,
            }),
            queryFn: () =>
              getProjects({
                data: { clientId: id, limit: DEFAULT_PAGE_SIZE, offset: projectState.loaded },
              }),
          })

          setState((prev) => ({
            ...prev,
            projects: {
              ...prev.projects,
              [id]: {
                ...prev.projects[id],
                items: [...prev.projects[id].items, ...response.data],
                loaded: prev.projects[id].loaded + response.data.length,
                hasMore:
                  prev.projects[id].loaded + response.data.length < response.total,
              },
            },
          }))
        } else if (type === 'task') {
          const taskState = state.tasks[id]
          if (!taskState) return

          const response = await queryClient.fetchQuery({
            queryKey: queryKeys.tasks.list(id, {
              limit: DEFAULT_PAGE_SIZE,
              offset: taskState.loaded,
            }),
            queryFn: () =>
              getTasks({
                data: { projectId: id, limit: DEFAULT_PAGE_SIZE, offset: taskState.loaded },
              }),
          })

          setState((prev) => ({
            ...prev,
            tasks: {
              ...prev.tasks,
              [id]: {
                ...prev.tasks[id],
                items: [...prev.tasks[id].items, ...response.data],
                loaded: prev.tasks[id].loaded + response.data.length,
                hasMore:
                  prev.tasks[id].loaded + response.data.length < response.total,
              },
            },
          }))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load more items')
      }
    },
    [state, clients.length, queryClient],
  )

  // Combine initial clients with any additional loaded clients
  const allClients = state.clients.items.length > 0
    ? [...clients, ...state.clients.items]
    : clients

  const totalClients = state.clients.total || clientsTotal
  const hasMoreClients = state.clients.hasMore || clientsHasMore

  // ---------------------------------------------------------------------------
  // Loading State
  // ---------------------------------------------------------------------------
  if (isLoadingClients) {
    return <LoadingState />
  }

  // ---------------------------------------------------------------------------
  // Error State
  // ---------------------------------------------------------------------------
  if (clientsError) {
    return <ErrorState error={clientsError} />
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-white mb-2">
            Organization Hierarchy
          </h1>
          <p className="text-gray-400">
            Browse clients, projects, and tasks. Click to expand.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg flex items-center gap-3 text-red-300">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Tree Container */}
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 overflow-hidden">
          {/* Tree Header */}
          <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {totalClients} client{totalClients !== 1 ? 's' : ''} total
              <span className="ml-2 text-xs text-blue-400">(cached 5 min)</span>
            </span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {/* Tree Content */}
          <div className="p-2">
            {allClients.length === 0 ? (
              <div className="py-8 text-center text-gray-500">No clients found</div>
            ) : (
              <>
                {/* Client Nodes */}
                {(allClients as Client[]).map((client) => (
                  <TreeNode
                    key={client.id}
                    id={client.id}
                    name={client.name}
                    type="client"
                    depth={0}
                    hasMore={state.projects[client.id]?.hasMore ?? false}
                    totalCount={state.projects[client.id]?.total}
                    loadedCount={state.projects[client.id]?.loaded}
                    onExpand={handleExpand}
                    onLoadMore={(id) => handleLoadMore(id, 'project')}
                  >
                    {/* Project Nodes */}
                    {state.projects[client.id]?.items.map((project) => (
                      <TreeNode
                        key={project.id}
                        id={project.id}
                        name={(project as Project).name}
                        type="project"
                        depth={1}
                        hasMore={state.tasks[project.id]?.hasMore ?? false}
                        totalCount={state.tasks[project.id]?.total}
                        loadedCount={state.tasks[project.id]?.loaded}
                        onExpand={handleExpand}
                        onLoadMore={(id) => handleLoadMore(id, 'task')}
                      >
                        {/* Task Nodes */}
                        {state.tasks[project.id]?.items.map((task) => (
                          <TreeNode
                            key={task.id}
                            id={task.id}
                            name={(task as Task).name}
                            type="task"
                            depth={2}
                            hasMore={false}
                            onExpand={handleExpand}
                            onLoadMore={() => Promise.resolve()}
                            onTaskClick={handleTaskClick}
                          />
                        ))}
                      </TreeNode>
                    ))}
                  </TreeNode>
                ))}

                {/* Load More Clients */}
                {hasMoreClients && (
                  <LoadMoreButton
                    loaded={state.clients.loaded || clients.length}
                    total={totalClients}
                    onLoadMore={() => handleLoadMore('', 'client')}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  )
}

// =============================================================================
// Load More Button Component
// =============================================================================

function LoadMoreButton({
  loaded,
  total,
  onLoadMore,
}: {
  loaded: number
  total: number
  onLoadMore: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    try {
      await onLoadMore()
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-4 text-center">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="
          px-4 py-2 bg-blue-600 hover:bg-blue-700
          disabled:bg-blue-600/50 disabled:cursor-not-allowed
          text-white rounded-lg transition-colors
          flex items-center gap-2 mx-auto
        "
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Loading...
          </>
        ) : (
          <>
            Load more clients ({loaded} of {total})
          </>
        )}
      </button>
    </div>
  )
}

// =============================================================================
// Loading State
// =============================================================================

function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <div className="h-8 w-64 bg-gray-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-96 bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
          <TreeNodeSkeleton depth={0} />
          <TreeNodeSkeleton depth={0} />
          <TreeNodeSkeleton depth={0} />
          <TreeNodeSkeleton depth={0} />
          <TreeNodeSkeleton depth={0} />
        </div>
      </div>
    </div>
  )
}

// =============================================================================
// Error State
// =============================================================================

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-900/30 border border-red-700 rounded-xl p-8 text-center">
          <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Failed to Load Hierarchy
          </h2>
          <p className="text-red-300 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
