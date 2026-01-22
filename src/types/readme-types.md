# Types

TypeScript type definitions for the application.

## Files

### `memtime.ts`

Type definitions for the Memtime API integration:

**Entity Types:**
- `Client` - Organization/company entity
- `Project` - Project belonging to a client
- `Task` - Task belonging to a project
- `TimeEntry` - Time record logged against a task

**API Types:**
- `PaginatedResponse<T>` - Generic wrapper for paginated API responses
- `ApiError` - Error response structure
- `CreateTimeEntryRequest` / `UpdateTimeEntryRequest` - Request payloads

**UI State Types:**
- `TreeNodeType` - Union type for hierarchy levels ('client' | 'project' | 'task')
- `TreeNodeData` - Data structure for tree view nodes
- `TreeState` - State management for the hierarchy tree

## Conventions

- All API timestamps are ISO 8601 strings
- Entity IDs are strings (UUIDs from the API)
- Request types mirror API payload requirements exactly
