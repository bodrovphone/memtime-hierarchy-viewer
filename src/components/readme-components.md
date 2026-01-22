# Components

Reusable React components for the Memtime Viewer application.

## Structure

Each component is organized in its own folder with:

- `ComponentName.tsx` - The component implementation
- `ComponentName.test.tsx` - Unit tests
- `index.ts` - Barrel file for exports

```
src/components/
├── Header/
├── Pagination/
├── TimeEntryForm/
├── Toast/
├── TreeNode/
├── index.ts          # Main barrel file
└── readme-components.md
```

## Imports

```tsx
// Import from component folder
import { Header } from '@/components/Header'
import { TreeNode } from '@/components/TreeNode'

// Or import from main barrel file
import { Header, TreeNode, Pagination } from '@/components'
```

---

## Components

| Component       | Description                        |
| --------------- | ---------------------------------- |
| `Header`        | App header with navigation         |
| `TreeNode`      | Expandable tree node for hierarchy |
| `Pagination`    | Page navigation for lists          |
| `TimeEntryForm` | Create/edit form for time entries  |
| `Toast`         | Toast notification for feedback    |

---

## `Header`

Global navigation header used in root layout.

**Features:**

- Desktop horizontal navigation
- Mobile hamburger menu with slide-out sidebar
- Active link highlighting
- Memtime branding with clock icon

**Navigation Links:**

- Home (`/`)
- Hierarchy (`/hierarchy`)
- Time Entries (`/time-entries`)

---

## `TreeNode`

Expandable/collapsible node for displaying hierarchical data.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `id` | `string \| number` | Unique identifier |
| `name` | `string` | Display name |
| `type` | `'client' \| 'project' \| 'task'` | Node type (determines icon) |
| `depth` | `number` | Nesting level (0, 1, 2) |
| `hasMore` | `boolean` | Shows "Load more" button |
| `totalCount` | `number` | Total items (for display) |
| `loadedCount` | `number` | Loaded items (for display) |
| `onExpand` | `(id, type) => Promise<void>` | Called when node expands |
| `onLoadMore` | `(id) => Promise<void>` | Called for pagination |
| `onTaskClick` | `(id) => void` | Called when task is clicked |
| `children` | `ReactNode` | Nested TreeNode components |

**Features:**

- Lazy loading on expand
- Loading spinner during fetch
- Type-specific icons (Building2, FolderOpen, CheckSquare)
- Type badges with Task ID display
- Click to copy task ID
- Indentation based on depth

**Also exports:** `TreeNodeSkeleton` for loading states.

---

## `Pagination`

Reusable pagination component for tables and lists.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `currentPage` | `number` | Active page (1-indexed) |
| `totalItems` | `number` | Total item count |
| `itemsPerPage` | `number` | Items per page |
| `onPageChange` | `(page: number) => void` | Page change handler |

**Features:**

- Previous/Next buttons
- Page number buttons with ellipsis
- "Showing X to Y of Z results" text
- Responsive (simplified on mobile)
- Disabled states at boundaries

---

## `TimeEntryForm`

Shared form component for creating and editing time entries.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `mode` | `'create' \| 'edit'` | Form mode |
| `initialData` | `TimeEntry` | Pre-fill values (edit mode) |
| `onSubmit` | `(data) => Promise<TimeEntry>` | Form submission handler |

**Features:**

- Task ID input with link to hierarchy
- DateTime pickers for start/end
- Comment textarea
- Real-time duration preview
- Validation (required fields, end > start)
- Loading state during submit
- Error display with dismiss
- Success redirect with toast

---

## `Toast`

Toast notification component for user feedback.

**Props:**
| Prop | Type | Description |
|------|------|-------------|
| `message` | `string` | Message to display |
| `duration` | `number` | Auto-dismiss time in ms (default: 3000) |
| `onClose` | `() => void` | Called when toast closes |

**Features:**

- Auto-dismiss after duration
- Manual close button
- Fade in/out animation
- Fixed position (bottom-right)
