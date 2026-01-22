# API

Server-side API client for Memtime integration using TanStack Start server functions.

## Files

### `memtime.ts`

All API calls to the Memtime backend. Uses `createServerFn` to ensure:
- API key stays server-side (security)
- Consistent error handling
- Type-safe request/response flow

## Server Functions

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| `getClients` | GET | `/clients` | Fetch paginated clients |
| `getProjects` | GET | `/clients/:id/projects` | Fetch projects for a client |
| `getTasks` | GET | `/projects/:id/tasks` | Fetch tasks for a project |
| `getTimeEntries` | GET | `/time-entries` | Fetch paginated time entries |
| `getTimeEntry` | GET | `/time-entries/:id` | Fetch single time entry |
| `createTimeEntry` | POST | `/time-entries` | Create new time entry |
| `updateTimeEntry` | POST→PUT | `/time-entries/:id` | Update existing time entry |
| `getAllTasks` | GET | Multiple | Fetch all tasks with context |

## Configuration

API configuration is read from environment variables:
- `MEMTIME_API_KEY` - Bearer token for authentication

Base URL: `https://interview-api.memtime-demo.deno.net/api/v1`

## Usage

```typescript
import { getClients, createTimeEntry } from '@/api/memtime'

// In a route loader
const clients = await getClients({ data: { limit: 10, offset: 0 } })

// In a component action
const entry = await createTimeEntry({
  data: { taskId, comment, start, end }
})
```

## Error Handling

All functions throw errors with meaningful messages for:
- Network failures
- 4xx/5xx API responses
- Missing configuration

Errors should be caught and displayed to users appropriately.

## Rate Limiting

The API has a rate limit of 15 requests per 60 seconds. The hierarchy view uses lazy loading to minimize API calls.
