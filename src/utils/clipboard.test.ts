import { describe, it, expect, vi, beforeEach } from 'vitest'
import { copyToClipboard } from './clipboard'

describe('clipboard utilities', () => {
  describe('copyToClipboard', () => {
    beforeEach(() => {
      vi.restoreAllMocks()
    })

    it('uses navigator.clipboard when available', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText },
      })
      Object.defineProperty(window, 'isSecureContext', { value: true })

      await copyToClipboard('test text')

      expect(writeText).toHaveBeenCalledWith('test text')
    })

    it('falls back to execCommand when clipboard API unavailable', async () => {
      // Remove clipboard API
      Object.assign(navigator, { clipboard: undefined })

      const execCommand = vi.fn()
      document.execCommand = execCommand

      await copyToClipboard('fallback text')

      expect(execCommand).toHaveBeenCalledWith('copy')
    })

    it('handles different text values', async () => {
      const writeText = vi.fn().mockResolvedValue(undefined)
      Object.assign(navigator, {
        clipboard: { writeText },
      })
      Object.defineProperty(window, 'isSecureContext', { value: true })

      await copyToClipboard('12345')
      expect(writeText).toHaveBeenCalledWith('12345')

      await copyToClipboard('')
      expect(writeText).toHaveBeenCalledWith('')
    })
  })
})
