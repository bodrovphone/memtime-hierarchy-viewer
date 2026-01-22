# Components

Reusable React components for the Memtime Viewer application.

## Components

| Component | File | Description |
|-----------|------|-------------|
| `Header` | `Header.tsx` | App header with navigation |
| `TreeNode` | `TreeNode.tsx` | Expandable tree node for hierarchy |
| `Pagination` | `Pagination.tsx` | Page navigation for lists |
| `TimeEntryForm` | `TimeEntryForm.tsx` | Create/edit form (pending) |

---

## `Header.tsx`

Global navigation header used in root layout.

**Features:**
- Desktop horizontal navigation
- Mobile hamburger menu with slide-out sidebar
- Active link highlighting
- Memtime branding with clock icon

**Usage:**
```tsx
// In __root.tsx
<Header />
```

**Navigation Links:**
- Home (`/`)
- Hierarchy (`/hierarchy`)
- Time Entries (`/time-entries`)

---

## `TreeNode.tsx`

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
| `children` | `ReactNode` | Nested TreeNode components |

**Features:**
- Lazy loading on expand
- Loading spinner during fetch
- Type-specific icons (Building2, FolderOpen, CheckSquare)
- Type badges (Client, Project, Task)
- Indentation based on depth

**Also exports:** `TreeNodeSkeleton` for loading states.

---

## `Pagination.tsx`

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

**Usage:**
```tsx
<Pagination
  currentPage={1}
  totalItems={100}
  itemsPerPage={10}
  onPageChange={(page) => navigate({ search: { page } })}
/>
```

---

## `TimeEntryForm.tsx` (pending)

Shared form component for creating and editing time entries.

**Planned Props:**
| Prop | Type | Description |
|------|------|-------------|
| `mode` | `'create' \| 'edit'` | Form mode |
| `initialData` | `TimeEntry` | Pre-fill values (edit mode) |
| `onSubmit` | `(data) => Promise<void>` | Form submission handler |

**Planned Features:**
- Task dropdown (fetched from API)
- DateTime pickers for start/end
- Comment textarea
- Validation (end > start)
- Loading state during submit
- Error display
