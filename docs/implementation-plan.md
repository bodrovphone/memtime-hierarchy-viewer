# Implementation Plan: Memtime Hierarchy Viewer

## Overview

Build a time-tracking application with three main features using the Memtime API:
1. Hierarchical tree view (Clients → Projects → Tasks)
2. Paginated time entries table
3. Time entry create/update form

**API Base URL:** `https://interview-api.memtime-demo.deno.net/api/v1`
**Auth:** Bearer token in Authorization header
**Rate Limit:** 15 requests per 60 seconds

---

## Architecture Decisions

### Data Fetching Strategy
Use **server functions** (`createServerFn`) for all API calls because:
- Hides API key from client (security)
- Handles rate limiting server-side
- Provides type-safe data flow
- Enables caching and error handling

### Route Structure
```
src/routes/
├── index.tsx              # Home/landing (modify existing)
├── hierarchy.tsx          # Task 1: Tree view
├── time-entries/
│   ├── index.tsx          # Task 2: Paginated table
│   └── $id.tsx            # Task 3: Edit form (dynamic route)
│   └── new.tsx            # Task 3: Create form
```

### Shared Code
```
src/
├── api/
│   └── memtime.ts         # API client with all endpoints
├── components/
│   ├── Header.tsx         # Update navigation
│   ├── TreeNode.tsx       # Expandable tree node
│   ├── Pagination.tsx     # Reusable pagination
│   └── TimeEntryForm.tsx  # Create/edit form
├── types/
│   └── memtime.ts         # TypeScript interfaces
```

---

## Task 1: Hierarchical Data Display

### Implementation
1. **Create `src/api/memtime.ts`** - API client with server functions:
   - `getClients(limit, offset)` → GET `/clients`
   - `getProjects(clientId, limit, offset)` → GET `/clients/:id/projects`
   - `getTasks(projectId, limit, offset)` → GET `/projects/:id/tasks`

2. **Create `src/types/memtime.ts`** - Type definitions:
   ```typescript
   interface Client { id: string; name: string; /* ... */ }
   interface Project { id: string; name: string; clientId: string; /* ... */ }
   interface Task { id: string; name: string; projectId: string; /* ... */ }
   interface PaginatedResponse<T> { data: T[]; total: number; limit: number; offset: number; }
   ```

3. **Create `src/components/TreeNode.tsx`**:
   - Expandable/collapsible node (use ChevronRight/ChevronDown pattern from Header)
   - Lazy-load children on expand (avoid rate limiting)
   - Show loading state during fetch
   - "Load more" button for pagination within each level

4. **Create `src/routes/hierarchy.tsx`**:
   - Initial load: fetch first page of clients
   - Tree structure with indentation
   - Each node: Client → Projects → Tasks
   - Pagination controls at each level

### UI Design
- Dark theme matching existing app
- Indented tree with expand/collapse icons
- Loading spinners for lazy-loaded children
- "Load more" buttons styled consistently

---

## Task 2: Time Entries List

### Implementation
1. **Add to `src/api/memtime.ts`**:
   - `getTimeEntries(limit, offset)` → GET `/time-entries`

2. **Create `src/components/Pagination.tsx`**:
   - Page navigation (Previous/Next)
   - Current page indicator
   - Items per page selector (optional)

3. **Create `src/routes/time-entries/index.tsx`**:
   - Table with columns: ID, Task ID, Comment, Start, End, Created At
   - URL-based pagination (`?page=1&limit=10`)
   - Use route search params for state
   - Link to edit form for each row

### UI Design
- Responsive table (horizontal scroll on mobile)
- Formatted dates (user-friendly display)
- Hover states on rows
- Edit button/link per row

---

## Task 3: Time Entry Management

### Implementation
1. **Add to `src/api/memtime.ts`**:
   - `createTimeEntry(data)` → POST `/time-entries`
   - `updateTimeEntry(id, data)` → PUT `/time-entries/:id`
   - `getTimeEntry(id)` → GET `/time-entries/:id`

2. **Create `src/components/TimeEntryForm.tsx`**:
   - Shared form for create/edit
   - Fields: Task ID (dropdown from hierarchy), Comment, Start, End
   - Date/time pickers for ISO 8601 timestamps
   - Validation before submit
   - Loading state during submission
   - Success/error message display

3. **Create `src/routes/time-entries/new.tsx`**:
   - Create mode form
   - Redirect to list on success

4. **Create `src/routes/time-entries/$id.tsx`**:
   - Edit mode form
   - Load existing entry data
   - Pre-fill form fields
   - Handle 404 errors

### Form Fields
- **Task ID**: Simple dropdown listing all tasks (fetch on form load)
- **Comment**: Textarea
- **Start/End**: DateTime inputs (native HTML datetime-local)
- **Validation**: Required fields, end > start

### Error Handling
- 400: Display validation errors from API
- 404: "Time entry not found" message
- Rate limit: Retry message with countdown

---

## File Changes Summary

### New Files
- `src/api/memtime.ts` - API client
- `src/types/memtime.ts` - TypeScript types
- `src/components/TreeNode.tsx` - Tree node component
- `src/components/Pagination.tsx` - Pagination component
- `src/components/TimeEntryForm.tsx` - Form component
- `src/routes/hierarchy.tsx` - Hierarchy page
- `src/routes/time-entries/index.tsx` - Time entries list
- `src/routes/time-entries/new.tsx` - Create form
- `src/routes/time-entries/$id.tsx` - Edit form

### Modified Files
- `src/components/Header.tsx` - Add navigation links
- `src/routes/index.tsx` - Update home page content

### Files to Delete (confirmed)
- `src/routes/demo/api.names.ts`
- `src/routes/demo/start.api-request.tsx`
- `src/routes/demo/start.server-funcs.tsx`
- `src/routes/demo/start.ssr.data-only.tsx`
- `src/routes/demo/start.ssr.full-ssr.tsx`
- `src/routes/demo/start.ssr.index.tsx`
- `src/routes/demo/start.ssr.spa-mode.tsx`
- `src/data/demo.punk-songs.ts`
- `src/routes/demo/` directory

---

## Environment Setup

Create `.env` file (already gitignored):
```
MEMTIME_API_KEY=t2On0w9hkjQNrfnKEaO7FhsVrfPLXZS2
```

Access in server functions via `process.env.MEMTIME_API_KEY`

---

## Verification Plan

1. **Hierarchy View**:
   - Expand/collapse clients, projects, tasks
   - Verify lazy loading works
   - Test "load more" pagination at each level
   - Check rate limiting doesn't break UX

2. **Time Entries Table**:
   - Navigate between pages
   - Verify URL updates with pagination params
   - Check date formatting

3. **Create/Edit Form**:
   - Create new entry → verify in list
   - Edit existing entry → verify changes
   - Test validation errors
   - Test 404 handling for invalid IDs

4. **Run commands**:
   - `npm run dev` - Development server
   - `npm run build` - Production build
   - `npm run test` - Run tests (add tests for components)
   - `npm run check` - Lint and format

---

## Implementation Order

1. Setup: Types, API client, environment
2. Task 1: Hierarchy (most complex, establishes patterns)
3. Task 2: Time entries table (uses pagination pattern)
4. Task 3: Forms (uses API client, links to table)
5. Polish: Error handling, loading states, responsiveness
6. Cleanup: Remove demo files, update home page
