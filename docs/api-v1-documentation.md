# Memtime API V1 Documentation

> **Source:** [Original HTML Documentation](https://lustrous-beijinho-54fcf1.netlify.app/api_v1_documentation.html)

## Overview

RESTful API for managing clients, projects, tasks, and time entries.

**Base URL:** `https://interview-api.memtime-demo.deno.net/api/v1`

---

## Authentication

### Bearer Token

All requests require an API key in the Authorization header:

```
Authorization: Bearer <API_KEY>
```

### Rate Limiting

| Property | Value |
|----------|-------|
| Window | 60 seconds |
| Limit | 15 requests per window |
| Key | Based on API key |

---

## Data Types

### Client

```json
{
  "id": 1,
  "name": "Client Name",
  "description": "Client description",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Project

```json
{
  "id": 1,
  "clientId": 1,
  "name": "Project Name",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Task

```json
{
  "id": 1,
  "parent": 0,
  "name": "Task Name",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

> **Note:** `parent` is the parent task ID. `0` indicates a root-level task.

### TimeEntry

```json
{
  "id": 1,
  "taskId": 1,
  "userId": "<API_KEY>",
  "comment": "Worked on feature development",
  "start": "2024-01-15T09:00:00.000Z",
  "end": "2024-01-15T17:00:00.000Z",
  "createdAt": "2024-01-15T17:05:00.000Z",
  "updatedAt": "2024-01-15T17:05:00.000Z"
}
```

---

## Pagination

All list endpoints support pagination:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | 10 | Maximum results to return |
| `offset` | number | 0 | Number of results to skip |
| `sortBy` | string | — | Field name to sort by |
| `order` | string | asc | Sort order: `asc` or `desc` |

**Example:**
```
GET /api/v1/clients?limit=20&offset=0&sortBy=name&order=asc
```

---

## Endpoints

### Clients

#### Get All Clients

```http
GET /api/v1/clients
```

Returns a paginated list of all clients.

**Query Parameters:** `limit`, `offset`, `sortBy`, `order`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "name": "Acme Corp",
    "description": "Leading supplier",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

#### Get Client by ID

```http
GET /api/v1/clients/:id
```

Retrieves a specific client by ID.

**Path Parameters:**
- `id` (required): Client ID

**Response:** `200 OK` - Client object

**Error:** `404 Not Found`
```json
{
  "error": "Client not found"
}
```

---

### Projects

#### Get Projects of a Client

```http
GET /api/v1/clients/:id/projects
```

Retrieves all projects belonging to a specific client.

**Path Parameters:**
- `id` (required): Client ID

**Query Parameters:** `limit`, `offset`, `sortBy`, `order`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "clientId": 1,
    "name": "Website Redesign",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

#### Get Project by ID

```http
GET /api/v1/projects/:id
```

Retrieves a specific project by ID.

**Path Parameters:**
- `id` (required): Project ID

**Response:** `200 OK` - Project object

**Error:** `404 Not Found`
```json
{
  "error": "Project not found"
}
```

---

### Tasks

#### Get Tasks of a Project

```http
GET /api/v1/projects/:id/tasks
```

Retrieves all tasks belonging to a specific project.

**Path Parameters:**
- `id` (required): Project ID

**Query Parameters:** `limit`, `offset`, `sortBy`, `order`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "parent": 0,
    "name": "Design mockups",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

---

#### Get Task by ID

```http
GET /api/v1/tasks/:id
```

Retrieves a specific task by ID.

**Path Parameters:**
- `id` (required): Task ID

**Response:** `200 OK` - Task object

**Error:** `404 Not Found`
```json
{
  "error": "Task not found"
}
```

---

### Time Entries

#### Get My Time Entries

```http
GET /api/v1/time-entries
```

Retrieves all time entries for the authenticated user.

**Query Parameters:** `limit`, `offset`, `sortBy`, `order`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "taskId": 1,
    "userId": "<API_KEY>",
    "comment": "Worked on feature development",
    "start": "2024-01-15T09:00:00.000Z",
    "end": "2024-01-15T17:00:00.000Z",
    "createdAt": "2024-01-15T17:05:00.000Z",
    "updatedAt": "2024-01-15T17:05:00.000Z"
  }
]
```

**Error:** `404 Not Found`
```json
{
  "error": "Unknown user"
}
```

---

#### Get Time Entry by ID

```http
GET /api/v1/time-entries/:id
```

Retrieves a specific time entry by ID. Only returns entries belonging to the authenticated user.

**Path Parameters:**
- `id` (required): Time Entry ID

**Response:** `200 OK` - TimeEntry object

**Error:** `404 Not Found`
```json
{
  "error": "Time entry not found"
}
```

---

#### Create Time Entry

```http
POST /api/v1/time-entries
```

Creates a new time entry for the authenticated user.

**Request Body:**
```json
{
  "taskId": 1,
  "comment": "Worked on feature development",
  "start": "2024-01-15T09:00:00Z",
  "end": "2024-01-15T17:00:00Z"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `taskId` | number | Yes | Task ID to associate |
| `comment` | string | Yes | Description of work |
| `start` | string | Yes | Start time (ISO 8601) |
| `end` | string | Yes | End time (ISO 8601) |

**Response:** `201 Created` - TimeEntry object

**Error:** `400 Bad Request`
```json
{
  "error": "Invalid JSON body"
}
```

---

#### Update Time Entry

```http
PUT /api/v1/time-entries/:id
```

Updates an existing time entry.

**Path Parameters:**
- `id` (required): Time Entry ID

**Request Body:** Same as Create

**Response:** `200 OK` - Updated TimeEntry object

**Errors:**
- `400 Bad Request` - Invalid request body
- `404 Not Found` - Time entry not found

---

#### Delete Time Entry

```http
DELETE /api/v1/time-entries/:id
```

Deletes a time entry.

**Path Parameters:**
- `id` (required): Time Entry ID

**Response:** `200 OK`
```json
{
  "message": "Time entry deleted successfully"
}
```

**Error:** `404 Not Found`
```json
{
  "error": "Time entry not found"
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Description |
|------|-------------|
| `200` | Successful request |
| `201` | Resource created successfully |
| `400` | Invalid request (bad JSON, missing fields) |
| `401` | Missing or invalid authentication |
| `404` | Resource not found |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

### Error Response Format

All errors return JSON with an `error` field:

```json
{
  "error": "Error description message"
}
```

---

## Request Headers

### Required

```
Authorization: Bearer <API_KEY>
```

### For POST/PUT Requests

```
Content-Type: application/json
```

---

## Health Check

```http
GET /health
```

Simple health check endpoint (no authentication required).

**Response:** `200 OK`
```
I'm alive!
```
