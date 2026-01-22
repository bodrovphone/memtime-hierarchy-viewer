import { describe, it, expect } from 'vitest'
import {
  toDateTimeLocal,
  toISOString,
  formatDateTime,
  formatDuration,
  isValidDateRange,
} from './date'

describe('date utilities', () => {
  describe('toDateTimeLocal', () => {
    it('converts ISO string to datetime-local format', () => {
      // Note: This test depends on local timezone
      const result = toDateTimeLocal('2024-01-15T14:30:00.000Z')
      // Should be in format YYYY-MM-DDTHH:mm
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)
    })

    it('pads single-digit months and days with zeros', () => {
      const result = toDateTimeLocal('2024-01-05T09:05:00.000Z')
      expect(result).toMatch(/^\d{4}-0\d-0\d/)
    })
  })

  describe('toISOString', () => {
    it('converts datetime-local to ISO string', () => {
      const result = toISOString('2024-01-15T09:30')
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/)
    })

    it('preserves the date components', () => {
      const result = toISOString('2024-06-20T14:45')
      expect(result).toContain('2024')
    })
  })

  describe('formatDateTime', () => {
    it('formats date for display', () => {
      // Create a date in a way that works regardless of timezone
      const date = new Date(2024, 0, 15, 9, 30) // Jan 15, 2024, 9:30 AM local
      const result = formatDateTime(date.toISOString())

      expect(result).toContain('Jan')
      expect(result).toContain('15')
      expect(result).toContain('2024')
    })

    it('includes time component', () => {
      const date = new Date(2024, 0, 15, 14, 30)
      const result = formatDateTime(date.toISOString())

      // Should contain hour and minute
      expect(result).toMatch(/\d{1,2}:\d{2}/)
    })

    it('uses 12-hour format with AM/PM', () => {
      const morningDate = new Date(2024, 0, 15, 9, 0)
      const morningResult = formatDateTime(morningDate.toISOString())
      expect(morningResult).toMatch(/AM|PM/)
    })
  })

  describe('formatDuration', () => {
    it('formats hours and minutes', () => {
      const start = '2024-01-15T09:00:00.000Z'
      const end = '2024-01-15T10:30:00.000Z'
      expect(formatDuration(start, end)).toBe('1h 30m')
    })

    it('formats only minutes when less than an hour', () => {
      const start = '2024-01-15T09:00:00.000Z'
      const end = '2024-01-15T09:45:00.000Z'
      expect(formatDuration(start, end)).toBe('45m')
    })

    it('handles multiple hours', () => {
      const start = '2024-01-15T09:00:00.000Z'
      const end = '2024-01-15T14:15:00.000Z'
      expect(formatDuration(start, end)).toBe('5h 15m')
    })

    it('returns 0m for invalid range', () => {
      const start = '2024-01-15T10:00:00.000Z'
      const end = '2024-01-15T09:00:00.000Z'
      expect(formatDuration(start, end)).toBe('0m')
    })

    it('returns 0m for equal times', () => {
      const time = '2024-01-15T09:00:00.000Z'
      expect(formatDuration(time, time)).toBe('0m')
    })

    it('handles exact hours', () => {
      const start = '2024-01-15T09:00:00.000Z'
      const end = '2024-01-15T12:00:00.000Z'
      expect(formatDuration(start, end)).toBe('3h 0m')
    })
  })

  describe('isValidDateRange', () => {
    it('returns true when end is after start', () => {
      const start = '2024-01-15T09:00:00.000Z'
      const end = '2024-01-15T10:00:00.000Z'
      expect(isValidDateRange(start, end)).toBe(true)
    })

    it('returns false when end is before start', () => {
      const start = '2024-01-15T10:00:00.000Z'
      const end = '2024-01-15T09:00:00.000Z'
      expect(isValidDateRange(start, end)).toBe(false)
    })

    it('returns false when end equals start', () => {
      const time = '2024-01-15T09:00:00.000Z'
      expect(isValidDateRange(time, time)).toBe(false)
    })

    it('handles dates across different days', () => {
      const start = '2024-01-15T23:00:00.000Z'
      const end = '2024-01-16T01:00:00.000Z'
      expect(isValidDateRange(start, end)).toBe(true)
    })
  })
})
