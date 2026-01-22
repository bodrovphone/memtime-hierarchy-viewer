# Memtime Hierarchy Viewer

**Live Demo:** https://euphonious-dolphin-7d500c.netlify.app/

A time-tracking application built with TanStack Start that integrates with the Memtime API.

## Features

- **Hierarchy View** (`/hierarchy`) - Browse Clients → Projects → Tasks in an expandable tree with lazy loading and pagination
- **Time Entries** (`/time-entries`) - Paginated table of time tracking records with duration display
- **Create/Edit** (`/time-entries/new`, `/time-entries/:id`) - Forms for managing time entries

## Tech Stack

- **Framework:** TanStack Start (React 19, TanStack Router)
- **Data fetching:** TanStack Query v5 (React Query)
- **Styling:** Tailwind CSS v4
- **Build:** Vite 7
- **Language:** TypeScript
- **Deployment:** Netlify

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```
MEMTIME_API_KEY=your_api_key_here
```

### 3. Run development server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Commands

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start development server       |
| `npm run build`         | Build for production           |
| `npm run test`          | Run Vitest tests               |
| `npm run test:watch`    | Run tests in watch mode        |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint`          | Run ESLint                     |
| `npm run format`        | Run Prettier                   |
| `npm run check`         | Format + lint fix              |

## Project Structure

```
src/
├── api/          # Server functions for Memtime API
├── components/   # Reusable UI components
├── constants/    # Shared constants (pagination, etc.)
├── routes/       # File-based routing (TanStack Router)
├── types/        # TypeScript interfaces
├── utils/        # Utility functions (date, clipboard, tree)
└── test/         # Test setup and utilities
```

Each folder contains a `readme-{folder}.md` with detailed documentation.

## Testing

The project uses Vitest with React Testing Library for unit tests. Tests are co-located with source files using the `*.test.tsx` pattern.

```bash
npm run test           # Run all tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Run tests with coverage report
```

### Coverage

| File                | Statements | Branches | Functions | Lines    |
| ------------------- | ---------- | -------- | --------- | -------- |
| `utils/date.ts`     | 100%       | 100%     | 100%      | 100%     |
| `utils/tree.ts`     | 100%       | 100%     | 100%      | 100%     |
| `utils/clipboard.ts`| 100%       | 100%     | 100%      | 100%     |
| `Pagination.tsx`    | 100%       | 100%     | 66%       | 100%     |
| `Header.tsx`        | 100%       | 100%     | 71%       | 100%     |
| `TimeEntryForm.tsx` | 100%       | 90%      | 100%      | 100%     |
| `TreeNode.tsx`      | 100%       | 94%      | 100%      | 100%     |
| `Toast.tsx`         | 100%       | 100%     | 100%      | 100%     |
| **Overall**         | **75%**    | **90%**  | **74%**   | **75%**  |

**Target:** 50%+ statement coverage ✓

## Architecture & Data Flow

### TanStack Query integration

- A single `QueryClient` is created per request in `src/lib/query-client.ts` and provided via `QueryClientProvider` in the root route (`src/routes/__root.tsx`).
- All Memtime API access is encapsulated in server functions (`src/api/memtime.ts`) created with `createServerFn`, which handle authentication and error mapping.
- UI components and routes consume these server functions exclusively through typed React Query hooks in `src/hooks/use-memtime-queries.ts`:
  - `useClients`, `useProjects`, `useTasks`, `useAllTasks`
  - `useTimeEntries`, `useTimeEntry`, `useCreateTimeEntry`, `useUpdateTimeEntry`
- Query keys are centralized in `queryKeys` (also in `src/lib/query-client.ts`) for consistent cache invalidation and pagination.
- Default caching is tuned for the Memtime API rate limits: 5 min `staleTime`, 30 min `gcTime`, 1 retry, and `refetchOnWindowFocus: false`.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER INTERFACE                                  │
├─────────────────┬─────────────────────┬─────────────────────────────────────┤
│   /hierarchy    │    /time-entries    │    /time-entries/new | /$id         │
│   (Tree View)   │    (Table View)     │    (Create/Edit Form)               │
└────────┬────────┴──────────┬──────────┴──────────────┬──────────────────────┘
         │                   │                         │
         ▼                   ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TANSTACK ROUTER                                      │
│  • File-based routing          • URL search params for pagination            │
│  • Route loaders               • Success state via query params              │
└────────┬────────────────────────┬────────────────────┬──────────────────────┘
         │                        │                    │
         ▼                        ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SERVER FUNCTIONS (createServerFn)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ getClients   │  │getTimeEntries│  │createTimeEntry│  │getTimeEntry  │     │
│  │ getProjects  │  │              │  │updateTimeEntry│  │              │     │
│  │ getTasks     │  │              │  │              │  │              │     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘     │
│         │                 │                 │                 │              │
│         └─────────────────┴─────────────────┴─────────────────┘              │
│                                    │                                         │
│                    ┌───────────────┴───────────────┐                         │
│                    │  API Key (server-side only)   │                         │
│                    │  Bearer Token Authentication  │                         │
│                    └───────────────┬───────────────┘                         │
└────────────────────────────────────┼────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MEMTIME API                                        │
│                                                                              │
│  Base URL: https://interview-api.memtime-demo.deno.net/api/v1               │
│  Rate Limit: 15 requests / 60 seconds                                        │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  /clients   │  │  /projects  │  │   /tasks    │  │/time-entries│         │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Summary

1. **User navigates** to a route (e.g., `/hierarchy`)
2. **Route loader** calls server function before render
3. **Server function** adds auth header, calls Memtime API
4. **API response** flows back through server function (keeps API key hidden)
5. **Component renders** with loaded data
6. **User actions** (expand node, paginate, submit form) trigger new server function calls

## Documentation

- [Product Requirements (PRD)](./docs/PRD.md)
- [Implementation Plan](./docs/implementation-plan.md)
- [Design Reference](./docs/design-reference.md)
- [API Documentation](./docs/api-v1-documentation.md)

## API

This app uses the Memtime Interview API:

- **Base URL:** `https://interview-api.memtime-demo.deno.net/api/v1`
- **Auth:** Bearer token
- **Rate Limit:** 15 requests per 60 seconds

See [API Documentation](./docs/api-v1-documentation.md) for endpoint details.
