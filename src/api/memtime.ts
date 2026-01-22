import { createServerFn } from '@tanstack/react-start'
import type {
  Client,
  Project,
  Task,
  TimeEntry,
  PaginatedResponse,
  CreateTimeEntryRequest,
  UpdateTimeEntryRequest,
} from '@/types/memtime'

// =============================================================================
// Configuration
// =============================================================================

const API_BASE_URL = 'https://interview-api.memtime-demo.deno.net/api/v1'

function getApiKey(): string {
  const apiKey = process.env.MEMTIME_API_KEY
  if (!apiKey) {
    throw new Error('MEMTIME_API_KEY environment variable is not set')
  }
  return apiKey
}

function getHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${getApiKey()}`,
    'Content-Type': 'application/json',
  }
}

// =============================================================================
// Error Handling
// =============================================================================

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text()
    let message = `API Error: ${response.status}`

    try {
      const errorJson = JSON.parse(errorText)
      message = errorJson.error || errorJson.message || message
    } catch {
      if (errorText) {
        message = errorText
      }
    }

    throw new Error(message)
  }

  return (await response.json()) as T
}

// =============================================================================
// Clients API
// =============================================================================

export const getClients = createServerFn({ method: 'GET' })
  .inputValidator((data: { limit?: number; offset?: number }) => data)
  .handler(async ({ data }): Promise<PaginatedResponse<Client>> => {
    const params = new URLSearchParams()
    if (data.limit) params.set('limit', data.limit.toString())
    if (data.offset) params.set('offset', data.offset.toString())

    const url = `${API_BASE_URL}/clients${params.toString() ? `?${params}` : ''}`
    const response = await fetch(url, { headers: getHeaders() })

    // API returns plain array, wrap it in paginated response
    // Since API doesn't provide total count, we estimate:
    // - If returned items equals limit, there may be more
    // - Total is set to offset + items + 1 (to trigger hasMore check)
    const items = await handleResponse<Client[]>(response)
    const limit = data.limit ?? 10
    const offset = data.offset ?? 0
    const hasMore = items.length === limit
    return {
      data: items,
      total: hasMore ? offset + items.length + 1 : offset + items.length,
      limit,
      offset,
    }
  })

// =============================================================================
// Projects API
// =============================================================================

export const getProjects = createServerFn({ method: 'GET' })
  .inputValidator(
    (data: { clientId: string | number; limit?: number; offset?: number }) =>
      data,
  )
  .handler(async ({ data }): Promise<PaginatedResponse<Project>> => {
    const params = new URLSearchParams()
    if (data.limit) params.set('limit', data.limit.toString())
    if (data.offset) params.set('offset', data.offset.toString())

    const url = `${API_BASE_URL}/clients/${data.clientId}/projects${params.toString() ? `?${params}` : ''}`
    const response = await fetch(url, { headers: getHeaders() })

    const items = await handleResponse<Project[]>(response)
    const limit = data.limit ?? 10
    const offset = data.offset ?? 0
    const hasMore = items.length === limit
    return {
      data: items,
      total: hasMore ? offset + items.length + 1 : offset + items.length,
      limit,
      offset,
    }
  })

// =============================================================================
// Tasks API
// =============================================================================

export const getTasks = createServerFn({ method: 'GET' })
  .inputValidator(
    (data: { projectId: string | number; limit?: number; offset?: number }) =>
      data,
  )
  .handler(async ({ data }): Promise<PaginatedResponse<Task>> => {
    const params = new URLSearchParams()
    if (data.limit) params.set('limit', data.limit.toString())
    if (data.offset) params.set('offset', data.offset.toString())

    const url = `${API_BASE_URL}/projects/${data.projectId}/tasks${params.toString() ? `?${params}` : ''}`
    const response = await fetch(url, { headers: getHeaders() })

    const items = await handleResponse<Task[]>(response)
    const limit = data.limit ?? 10
    const offset = data.offset ?? 0
    const hasMore = items.length === limit
    return {
      data: items,
      total: hasMore ? offset + items.length + 1 : offset + items.length,
      limit,
      offset,
    }
  })

// =============================================================================
// Time Entries API
// =============================================================================

export const getTimeEntries = createServerFn({ method: 'GET' })
  .inputValidator((data: { limit?: number; offset?: number }) => data)
  .handler(async ({ data }): Promise<PaginatedResponse<TimeEntry>> => {
    const params = new URLSearchParams()
    if (data.limit) params.set('limit', data.limit.toString())
    if (data.offset) params.set('offset', data.offset.toString())

    const url = `${API_BASE_URL}/time-entries${params.toString() ? `?${params}` : ''}`
    const response = await fetch(url, { headers: getHeaders() })

    const items = await handleResponse<TimeEntry[]>(response)
    const limit = data.limit ?? 10
    const offset = data.offset ?? 0
    const hasMore = items.length === limit
    return {
      data: items,
      total: hasMore ? offset + items.length + 1 : offset + items.length,
      limit,
      offset,
    }
  })

export const getTimeEntry = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string | number }) => data)
  .handler(async ({ data }): Promise<TimeEntry> => {
    const url = `${API_BASE_URL}/time-entries/${data.id}`
    const response = await fetch(url, { headers: getHeaders() })

    return handleResponse<TimeEntry>(response)
  })

export const createTimeEntry = createServerFn({ method: 'POST' })
  .inputValidator((data: CreateTimeEntryRequest) => data)
  .handler(async ({ data }): Promise<TimeEntry> => {
    const url = `${API_BASE_URL}/time-entries`
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    })

    return handleResponse<TimeEntry>(response)
  })

export const updateTimeEntry = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { id: string | number } & UpdateTimeEntryRequest) => data,
  )
  .handler(async ({ data }): Promise<TimeEntry> => {
    const { id, ...body } = data
    const url = `${API_BASE_URL}/time-entries/${id}`
    const response = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    })

    return handleResponse<TimeEntry>(response)
  })

// =============================================================================
// Utility: Fetch all tasks (for dropdown in forms)
// =============================================================================

export const getAllTasks = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<Task & { projectName: string; clientName: string }>> => {
    const allTasks: Array<Task & { projectName: string; clientName: string }> =
      []

    // Fetch all clients (API returns plain arrays)
    const clientsResponse = await fetch(`${API_BASE_URL}/clients?limit=100`, {
      headers: getHeaders(),
    })
    const clients = await handleResponse<Client[]>(clientsResponse)

    // For each client, fetch projects
    for (const client of clients) {
      const projectsResponse = await fetch(
        `${API_BASE_URL}/clients/${client.id}/projects?limit=100`,
        { headers: getHeaders() },
      )
      const projects = await handleResponse<Project[]>(projectsResponse)

      // For each project, fetch tasks
      for (const project of projects) {
        const tasksResponse = await fetch(
          `${API_BASE_URL}/projects/${project.id}/tasks?limit=100`,
          { headers: getHeaders() },
        )
        const tasks = await handleResponse<Task[]>(tasksResponse)

        // Add tasks with context
        for (const task of tasks) {
          allTasks.push({
            ...task,
            projectName: project.name,
            clientName: client.name,
          })
        }
      }
    }

    return allTasks
  },
)
