import type { Client, Project, Task } from './memtime'

/**
 * State for a node level (clients, projects, or tasks)
 */
export interface NodeState {
  items: Array<Client | Project | Task>
  total: number
  loaded: number
  hasMore: boolean
}

/**
 * Complete hierarchy state for the tree view
 */
export interface HierarchyState {
  clients: NodeState
  projects: Record<string, NodeState> // keyed by clientId
  tasks: Record<string, NodeState> // keyed by projectId
}
