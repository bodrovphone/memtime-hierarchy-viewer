// Memtime API Types
// API Documentation: https://lustrous-beijinho-54fcf1.netlify.app/task.html

// =============================================================================
// Base Entity Types
// =============================================================================

export interface Client {
  id: number
  name: string
  description: string
  status: string
  createdAt: string // ISO 8601 timestamp
  updatedAt: string // ISO 8601 timestamp
}

export interface Project {
  id: number
  clientId: number
  name: string
  status: string
  createdAt: string // ISO 8601 timestamp
  updatedAt: string // ISO 8601 timestamp
}

export interface Task {
  id: number
  parent: number // Parent task ID (0 = root level task)
  name: string
  status: string
  createdAt: string // ISO 8601 timestamp
  updatedAt: string // ISO 8601 timestamp
}

export interface TimeEntry {
  id: number
  taskId: number
  userId: string // API key of the user
  comment: string
  start: string // ISO 8601 timestamp
  end: string // ISO 8601 timestamp
  createdAt: string // ISO 8601 timestamp
  updatedAt: string // ISO 8601 timestamp
}

// =============================================================================
// API Response Types
// =============================================================================

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
}

export interface ApiError {
  message: string
  statusCode: number
}

// =============================================================================
// Request Types
// =============================================================================

export interface PaginationParams {
  limit?: number
  offset?: number
}

export interface CreateTimeEntryRequest {
  taskId: number
  comment: string
  start: string // ISO 8601 timestamp
  end: string // ISO 8601 timestamp
}

export interface UpdateTimeEntryRequest {
  taskId: number
  comment: string
  start: string // ISO 8601 timestamp
  end: string // ISO 8601 timestamp
}

// =============================================================================
// UI State Types
// =============================================================================

export type TreeNodeType = 'client' | 'project' | 'task'

export interface TreeNodeData {
  id: string
  name: string
  type: TreeNodeType
  parentId?: string
  hasChildren: boolean
  childrenLoaded: boolean
  children: TreeNodeData[]
  total?: number // Total count for pagination
}

export interface TreeState {
  nodes: TreeNodeData[]
  expandedIds: Set<string>
  loadingIds: Set<string>
}
