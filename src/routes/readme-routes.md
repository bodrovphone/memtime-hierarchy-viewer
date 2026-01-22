# Routes

File-based routing using TanStack Router. Each file in `routes/` maps to a URL path.

## Route Structure

| File | URL | Description |
|------|-----|-------------|
| `__root.tsx` | — | Root layout with Header, wraps all pages |
| `index.tsx` | `/` | Home page with feature cards |
| `hierarchy.tsx` | `/hierarchy` | Organization tree view (Task 1) |
| `time-entries/index.tsx` | `/time-entries` | Time entries table (Task 2) |
| `time-entries/new.tsx` | `/time-entries/new` | Create time entry form (Task 3) |
| `time-entries/$id.tsx` | `/time-entries/:id` | Edit time entry form (Task 3) |

## Route Features

### `__root.tsx`
- Provides consistent layout across all pages
- Includes Header component with navigation
- Sets up TanStack Router devtools

### `index.tsx`
- Landing page for Memtime Viewer
- Feature cards linking to main sections
- Hero section with app branding

### `hierarchy.tsx`
- Displays Clients → Projects → Tasks tree
- Lazy loads children on expand (respects rate limits)
- "Load more" pagination at each level
- Uses `getClients`, `getProjects`, `getTasks` server functions

### `time-entries/index.tsx`
- Paginated table of time entries
- URL-based pagination via search params (`?page=1`)
- Shows duration, formatted dates, edit links
- Uses `getTimeEntries` server function

### `time-entries/new.tsx`
- Form to create new time entry
- Loads all tasks via `getAllTasks` for dropdown
- Task dropdown shows full path (Client → Project → Task)
- Redirects to list on success

### `time-entries/$id.tsx`
- Form to edit existing time entry
- Pre-fills with current values from `getTimeEntry`
- Parallel loading of tasks and entry data
- 404 handling for invalid IDs
- Uses `updateTimeEntry` server function

## Patterns

### Data Loading
Routes use TanStack Router's `loader` function with server functions:
```typescript
export const Route = createFileRoute('/hierarchy')({
  loader: async () => {
    return getClients({ data: { limit: 10, offset: 0 } })
  },
  component: HierarchyPage,
})
```

### Search Params (Pagination)
```typescript
export const Route = createFileRoute('/time-entries/')({
  validateSearch: (search) => ({
    page: Number(search?.page) || 1,
  }),
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: async ({ deps: { page } }) => {
    const offset = (page - 1) * 10
    return getTimeEntries({ data: { limit: 10, offset } })
  },
})
```
