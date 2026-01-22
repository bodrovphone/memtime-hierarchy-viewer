import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toast } from './Toast'

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the message', () => {
    render(<Toast message="Test message" onClose={() => {}} />)
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('calls onClose after duration', async () => {
    const onClose = vi.fn()
    render(<Toast message="Test" duration={3000} onClose={onClose} />)

    expect(onClose).not.toHaveBeenCalled()

    // Fast-forward past the duration
    await act(async () => {
      vi.advanceTimersByTime(3000)
    })

    // Fast-forward past the fade out animation
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose when close button is clicked', async () => {
    vi.useRealTimers() // Use real timers for user interaction
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Toast message="Test" onClose={onClose} />)

    const closeButton = screen.getByRole('button')
    await user.click(closeButton)

    // Wait for fade out animation
    await new Promise((resolve) => setTimeout(resolve, 350))

    expect(onClose).toHaveBeenCalled()
  })

  it('renders with check circle icon', () => {
    const { container } = render(<Toast message="Success" onClose={() => {}} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('uses default duration of 3000ms', async () => {
    const onClose = vi.fn()
    render(<Toast message="Test" onClose={onClose} />)

    // Should not close before 3000ms
    await act(async () => {
      vi.advanceTimersByTime(2999)
    })
    expect(onClose).not.toHaveBeenCalled()

    // Should close at 3000ms + fade animation
    await act(async () => {
      vi.advanceTimersByTime(301)
    })
    expect(onClose).toHaveBeenCalled()
  })

  it('allows custom duration', async () => {
    const onClose = vi.fn()
    render(<Toast message="Test" duration={1000} onClose={onClose} />)

    await act(async () => {
      vi.advanceTimersByTime(1000)
    })
    await act(async () => {
      vi.advanceTimersByTime(300)
    })

    expect(onClose).toHaveBeenCalled()
  })
})
