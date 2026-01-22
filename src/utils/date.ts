/**
 * Converts an ISO 8601 date string to the format required by datetime-local inputs
 * @param isoString - ISO 8601 date string (e.g., "2024-01-15T09:00:00.000Z")
 * @returns String in format "YYYY-MM-DDTHH:mm" in local time
 */
export function toDateTimeLocal(isoString: string): string {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Converts a datetime-local input value to ISO 8601 string
 * @param dateTimeLocal - String in format "YYYY-MM-DDTHH:mm"
 * @returns ISO 8601 date string
 */
export function toISOString(dateTimeLocal: string): string {
  return new Date(dateTimeLocal).toISOString()
}

/**
 * Formats a date string for display in tables/lists
 * @param isoString - ISO 8601 date string
 * @returns Formatted string like "Jan 15, 2024, 9:00 AM"
 */
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Calculates duration between two dates and formats it
 * @param start - Start date string
 * @param end - End date string
 * @returns Formatted duration string like "1h 30m" or "45m"
 */
export function formatDuration(start: string, end: string): string {
  const diffMs = new Date(end).getTime() - new Date(start).getTime()
  if (diffMs <= 0) return '0m'

  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}

/**
 * Validates that end date is after start date
 * @param start - Start date string
 * @param end - End date string
 * @returns true if end is after start
 */
export function isValidDateRange(start: string, end: string): boolean {
  return new Date(end) > new Date(start)
}
