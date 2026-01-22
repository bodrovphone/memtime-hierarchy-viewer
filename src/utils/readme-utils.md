# Utils

Utility functions used throughout the application.

## Contents

### `date.ts`

Date formatting and conversion utilities for time entry management.

| Function                       | Description                                                    |
| ------------------------------ | -------------------------------------------------------------- |
| `toDateTimeLocal(isoString)`   | Converts ISO 8601 string to `datetime-local` input format      |
| `toISOString(dateTimeLocal)`   | Converts `datetime-local` value back to ISO 8601               |
| `formatDateTime(isoString)`    | Formats date for table display (e.g., "Jan 15, 2024, 9:00 AM") |
| `formatDuration(start, end)`   | Calculates and formats duration (e.g., "1h 30m")               |
| `isValidDateRange(start, end)` | Validates that end date is after start date                    |

## Usage Example

```tsx
import { formatDateTime, formatDuration, isValidDateRange } from '@/utils/date'

// Format for display
formatDateTime('2024-01-15T14:30:00.000Z')
// → "Jan 15, 2024, 2:30 PM"

// Calculate duration
formatDuration('2024-01-15T09:00:00Z', '2024-01-15T10:30:00Z')
// → "1h 30m"

// Validate date range
isValidDateRange(start, end)
// → true if end > start
```

## Testing

All utility functions have 100% test coverage in `date.test.ts`.
