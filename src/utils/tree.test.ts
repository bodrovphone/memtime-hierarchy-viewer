import { describe, it, expect } from 'vitest'
import { getNodeLabel, calculateIndent, canNodeExpand } from './tree'

describe('tree utilities', () => {
  describe('getNodeLabel', () => {
    it('returns "Client" for client type', () => {
      expect(getNodeLabel('client')).toBe('Client')
    })

    it('returns "Project" for project type', () => {
      expect(getNodeLabel('project')).toBe('Project')
    })

    it('returns "Task" for task type', () => {
      expect(getNodeLabel('task')).toBe('Task')
    })
  })

  describe('calculateIndent', () => {
    it('returns 0 for depth 0', () => {
      expect(calculateIndent(0)).toBe(0)
    })

    it('returns 24 for depth 1 with default baseIndent', () => {
      expect(calculateIndent(1)).toBe(24)
    })

    it('returns 48 for depth 2 with default baseIndent', () => {
      expect(calculateIndent(2)).toBe(48)
    })

    it('uses custom baseIndent when provided', () => {
      expect(calculateIndent(2, 16)).toBe(32)
    })

    it('handles large depths correctly', () => {
      expect(calculateIndent(10)).toBe(240)
    })
  })

  describe('canNodeExpand', () => {
    it('returns true for client type', () => {
      expect(canNodeExpand('client')).toBe(true)
    })

    it('returns true for project type', () => {
      expect(canNodeExpand('project')).toBe(true)
    })

    it('returns false for task type', () => {
      expect(canNodeExpand('task')).toBe(false)
    })
  })
})
