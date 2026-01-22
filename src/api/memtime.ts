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
      message = errorJson.message || message
    } catch {
      if (errorText) {
        message = errorText
      }
    }

    throw new Error(message)
  }

  return response.json()
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

    return handleResponse<PaginatedResponse<Client>>(response)
  })

// =============================================================================
// Projects API
// =============================================================================

export const getProjects = createServerFn({ method: 'GET' })
  .inputValidator((data: { clientId: string; limit?: number; offset?: number }) => data)
  .handler(async ({ data }): Promise<PaginatedResponse<Project>> => {
    const params = new URLSearchParams()
    if (data.limit) params.set('limit', data.limit.toString())
    if (data.offset) params.set('offset', data.offset.toString())

    const url = `${API_BASE_URL}/clients/${data.clientId}/projects${params.toString() ? `?${params}` : ''}`
    const response = await fetch(url, { headers: getHeaders() })

    return handleResponse<PaginatedResponse<Project>>(response)
  })

// =============================================================================
// Tasks API
// =============================================================================

export const getTasks = createServerFn({ method: 'GET' })
  .inputValidator((data: { projectId: string; limit?: number; offset?: number }) => data)
  .handler(async ({ data }): Promise<PaginatedResponse<Task>> => {
    const params = new URLSearchParams()
    if (data.limit) params.set('limit', data.limit.toString())
    if (data.offset) params.set('offset', data.offset.toString())

    const url = `${API_BASE_URL}/projects/${data.projectId}/tasks${params.toString() ? `?${params}` : ''}`
    const response = await fetch(url, { headers: getHeaders() })

    return handleResponse<PaginatedResponse<Task>>(response)
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

    return handleResponse<PaginatedResponse<TimeEntry>>(response)
  })

export const getTimeEntry = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
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
  .inputValidator((data: { id: string } & UpdateTimeEntryRequest) => data)
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
    const allTasks: Array<Task & { projectName: string; clientName: string }> = []

    // Fetch all clients
    const clientsResponse = await fetch(`${API_BASE_URL}/clients?limit=100`, {
      headers: getHeaders(),
    })
    const clients = await handleResponse<PaginatedResponse<Client>>(clientsResponse)

    // For each client, fetch projects
    for (const client of clients.data) {
      const projectsResponse = await fetch(
        `${API_BASE_URL}/clients/${client.id}/projects?limit=100`,
        { headers: getHeaders() },
      )
      const projects = await handleResponse<PaginatedResponse<Project>>(projectsResponse)

      // For each project, fetch tasks
      for (const project of projects.data) {
        const tasksResponse = await fetch(
          `${API_BASE_URL}/projects/${project.id}/tasks?limit=100`,
          { headers: getHeaders() },
        )
        const tasks = await handleResponse<PaginatedResponse<Task>>(tasksResponse)

        // Add tasks with context
        for (const task of tasks.data) {
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
