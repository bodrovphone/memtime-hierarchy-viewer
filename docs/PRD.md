# Product Requirements Document (PRD)

## Memtime Hierarchy Viewer

**Version:** 1.0
**Last Updated:** January 2025
**Original Task:** [Technical Assessment](https://lustrous-beijinho-54fcf1.netlify.app/task.html)

---

## 1. Executive Summary

Build a production-ready time-tracking application that integrates with the Memtime API. The application enables users to view hierarchical organizational data (Clients → Projects → Tasks), browse time entries with pagination, and create/update time entries through an intuitive interface.

---

## 2. Problem Statement

Users need a clean, efficient interface to:

- Navigate hierarchical organizational structures (clients, projects, tasks)
- View and manage time entries with proper pagination
- Create and edit time entries with validation and error handling

The solution must handle API rate limiting gracefully and provide a seamless user experience.

---

## 3. Goals & Success Metrics

### Goals

- Deliver production-ready code suitable for paying customers
- Prioritize user experience and intuitive time entry workflows
- Handle API constraints (rate limiting) without degrading UX

### Success Metrics

- All three core features fully functional
- Graceful error handling for all API error states
- Responsive design working on desktop and mobile
- Clean, maintainable codebase

---

## 4. Target Users

Time-tracking application users who need to:

- Browse organizational hierarchy to understand project structures
- Review historical time entries
- Log new time entries against specific tasks
- Update existing time entry records

---

## 5. Features & Requirements

### 5.1 Feature 1: Hierarchical Data Display

**Description:** Tree-structured UI displaying Clients → Projects → Tasks hierarchy with lazy loading and pagination.

**User Stories:**

- As a user, I can view all clients in a collapsible tree structure
- As a user, I can expand a client to see its projects
- As a user, I can expand a project to see its tasks
- As a user, I can load more items at any level when pagination is available

**Functional Requirements:**
| ID | Requirement | Priority |
|----|-------------|----------|
| F1.1 | Display clients in expandable tree nodes | Must Have |
| F1.2 | Lazy-load projects when client is expanded | Must Have |
| F1.3 | Lazy-load tasks when project is expanded | Must Have |
| F1.4 | Support pagination with "Load More" at each level | Must Have |
| F1.5 | Show loading indicators during data fetch | Must Have |
| F1.6 | Handle empty states gracefully | Should Have |

**API Endpoints:**

- `GET /clients` - Retrieve all clients (supports `limit`, `offset`)
- `GET /clients/:id/projects` - Fetch projects for a client (supports `limit`, `offset`)
- `GET /projects/:id/tasks` - Fetch tasks for a project (supports `limit`, `offset`)

---

### 5.2 Feature 2: Time Entries List

**Description:** Paginated table view of time entries with navigation controls.

**User Stories:**

- As a user, I can view my time entries in a table format
- As a user, I can navigate between pages of time entries
- As a user, I can click on an entry to edit it
- As a user, I can create a new time entry from this view

**Functional Requirements:**
| ID | Requirement | Priority |
|----|-------------|----------|
| F2.1 | Display time entries in a table with columns: ID, Task ID, Comment, Start, End, Created At | Must Have |
| F2.2 | Implement pagination with Previous/Next navigation | Must Have |
| F2.3 | Persist pagination state in URL query parameters | Must Have |
| F2.4 | Format dates in human-readable format | Must Have |
| F2.5 | Provide edit link/button for each row | Must Have |
| F2.6 | Provide "Create New" action | Must Have |
| F2.7 | Show current page indicator | Should Have |

**API Endpoints:**

- `GET /time-entries` - Fetch time entries (supports `limit`, `offset`)

---

### 5.3 Feature 3: Time Entry Management (Create/Update)

**Description:** Forms for creating new time entries and editing existing ones.

**User Stories:**

- As a user, I can create a new time entry with task, comment, start time, and end time
- As a user, I can edit an existing time entry
- As a user, I see validation errors before submission
- As a user, I see meaningful error messages from the API

**Functional Requirements:**
| ID | Requirement | Priority |
|----|-------------|----------|
| F3.1 | Provide form with fields: Task ID (dropdown), Comment, Start, End | Must Have |
| F3.2 | Task dropdown populated from available tasks | Must Have |
| F3.3 | Use datetime-local inputs for Start/End fields | Must Have |
| F3.4 | Validate that End time is after Start time | Must Have |
| F3.5 | Validate all required fields before submission | Must Have |
| F3.6 | Show loading state during form submission | Must Have |
| F3.7 | Display API error messages (400, 404, etc.) | Must Have |
| F3.8 | Redirect to list view on successful save | Must Have |
| F3.9 | Pre-fill form with existing data in edit mode | Must Have |
| F3.10 | Handle 404 for non-existent time entry IDs | Must Have |

**API Endpoints:**

- `GET /time-entries/:id` - Fetch single time entry (for edit mode)
- `POST /time-entries` - Create new time entry
- `PUT /time-entries/:id` - Update existing time entry

**Request Payload:**

```json
{
  "taskId": "string (required)",
  "comment": "string (required)",
  "start": "ISO 8601 timestamp (required)",
  "end": "ISO 8601 timestamp (required)"
}
```

---

## 6. Technical Specifications

### 6.1 API Integration

| Property        | Value                                                |
| --------------- | ---------------------------------------------------- |
| Base URL        | `https://interview-api.memtime-demo.deno.net/api/v1` |
| Authentication  | Bearer token in `Authorization` header               |
| Rate Limit      | 15 requests per 60 seconds                           |
| Response Format | JSON                                                 |

### 6.2 Technology Stack

| Layer      | Technology                   |
| ---------- | ---------------------------- |
| Framework  | TanStack Start (React 19)    |
| Routing    | TanStack Router (file-based) |
| Styling    | Tailwind CSS v4              |
| Build Tool | Vite 7                       |
| Language   | TypeScript                   |
| Deployment | Netlify                      |

### 6.3 Architecture Decisions

**Server Functions for API Calls:**

- All Memtime API calls via `createServerFn` (TanStack Start)
- Benefits: API key hidden from client, server-side rate limit handling, type-safe data flow

**Route Structure:**

```
src/routes/
├── index.tsx              # Home page
├── hierarchy.tsx          # Hierarchical tree view
└── time-entries/
    ├── index.tsx          # Paginated list
    ├── new.tsx            # Create form
    └── $id.tsx            # Edit form (dynamic route)
```

---

## 7. Error Handling Requirements

| HTTP Status | User-Facing Behavior                                  |
| ----------- | ----------------------------------------------------- |
| 400         | Display validation errors from API response           |
| 404         | Display "Not found" message with navigation option    |
| 429         | Display rate limit message (consider retry countdown) |
| 5xx         | Display generic error with retry option               |

---

## 8. UI/UX Requirements

> **See also:** [Design Reference](./design-reference.md) for detailed visual specifications, color palette, and component patterns based on Memtime's product design.

### 8.1 Design Principles

- Visual consistency with Memtime's existing product aesthetic
- Navy header with blue interactive elements and green time entry accents
- Responsive design (mobile and desktop)
- Clear loading states for all async operations
- Intuitive navigation between features

### 8.2 Navigation

- Header with links to: Home, Hierarchy, Time Entries
- Breadcrumb-style context where appropriate

### 8.3 Accessibility

- Semantic HTML elements
- Keyboard navigable interfaces
- Clear focus indicators

### 8.4 Key Visual Elements

- **Color scheme:** Navy header, blue CTAs, green for time entries
- **Typography:** Clean sans-serif, clear hierarchy
- **Components:** Tree nodes with chevrons, duration badges, card-based layouts
- **Interactions:** Subtle hover states, blue selection borders

---

## 9. Out of Scope

The following are explicitly excluded from this version:

- User authentication/login system
- Time entry deletion
- Bulk operations on time entries
- Data export functionality
- Real-time updates/websockets
- Offline support
- Multi-language support

---

## 10. Dependencies & Constraints

### Dependencies

- Memtime API availability
- Valid API key

### Constraints

- Rate limit: 15 requests/60 seconds requires lazy loading strategy
- API key must remain server-side only (security)

---

## 11. Release Criteria

### Must Have (MVP)

- [ ] Hierarchical tree view with expand/collapse and lazy loading
- [ ] Time entries table with pagination
- [ ] Create time entry form with validation
- [ ] Edit time entry form with pre-population
- [ ] Error handling for all API states
- [ ] Responsive layout

### Should Have

- [ ] Loading skeletons/spinners
- [ ] Empty state designs
- [ ] Rate limit handling with user feedback

### Nice to Have

- [ ] Optimistic UI updates
- [ ] Keyboard shortcuts
- [ ] Unit tests for components

---

## 12. Appendix

### A. Related Documents

- [Implementation Plan](./implementation-plan.md)
- [Design Reference](./design-reference.md) - Visual specifications and component patterns
- [Original Task Requirements](https://lustrous-beijinho-54fcf1.netlify.app/task.html)

### B. API Response Examples

**Client Object:**

```json
{
  "id": "string",
  "name": "string",
  "createdAt": "ISO 8601 timestamp"
}
```

**Project Object:**

```json
{
  "id": "string",
  "name": "string",
  "clientId": "string",
  "createdAt": "ISO 8601 timestamp"
}
```

**Task Object:**

```json
{
  "id": "string",
  "name": "string",
  "projectId": "string",
  "createdAt": "ISO 8601 timestamp"
}
```

**Time Entry Object:**

```json
{
  "id": "string",
  "taskId": "string",
  "comment": "string",
  "start": "ISO 8601 timestamp",
  "end": "ISO 8601 timestamp",
  "createdAt": "ISO 8601 timestamp"
}
```

**Paginated Response:**

```json
{
  "data": [],
  "total": 100,
  "limit": 10,
  "offset": 0
}
```
