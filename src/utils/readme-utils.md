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

### `tree.ts`

Utilities for the hierarchy tree view component.

| Function                        | Description                                  |
| ------------------------------- | -------------------------------------------- |
| `getNodeLabel(type)`            | Returns human-readable label for node type   |
| `calculateIndent(depth, base?)` | Calculates indentation pixels for tree depth |
| `canNodeExpand(type)`           | Checks if a node type can have children      |

### `clipboard.ts`

Clipboard utilities with fallback support.

| Function              | Description                                        |
| --------------------- | -------------------------------------------------- |
| `copyToClipboard(text)` | Copies text to clipboard (with legacy fallback)  |

## Usage Examples

### Date utilities

```tsx
import { formatDateTime, formatDuration, isValidDateRange } from '@/utils/date'

formatDateTime('2024-01-15T14:30:00.000Z')
// → "Jan 15, 2024, 2:30 PM"

formatDuration('2024-01-15T09:00:00Z', '2024-01-15T10:30:00Z')
// → "1h 30m"

isValidDateRange(start, end)
// → true if end > start
```

### Tree utilities

```tsx
import { getNodeLabel, calculateIndent, canNodeExpand } from '@/utils/tree'

getNodeLabel('client')
// → "Client"

calculateIndent(2)
// → 48 (pixels)

canNodeExpand('task')
// → false (tasks are leaf nodes)
```

## Testing

All utility functions have 100% test coverage:

- `date.test.ts` - 17 tests
- `tree.test.ts` - 11 tests
- `clipboard.test.ts` - 3 tests
