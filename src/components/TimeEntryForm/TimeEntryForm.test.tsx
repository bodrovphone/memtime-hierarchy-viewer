import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TimeEntryForm } from './TimeEntryForm'

// Mock @tanstack/react-router
const mockNavigate = vi.fn()
vi.mock('@tanstack/react-router', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ to, children }: { to: string; children: React.ReactNode }) => (
    <a href={to}>{children}</a>
  ),
}))

describe('TimeEntryForm', () => {
  const mockOnSubmit = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockOnSubmit.mockResolvedValue({ id: 123 })
  })

  const renderForm = (props = {}) => {
    return render(
      <TimeEntryForm mode="create" onSubmit={mockOnSubmit} {...props} />,
    )
  }

  describe('rendering', () => {
    it('renders all form fields', () => {
      renderForm()

      expect(screen.getByLabelText(/task id/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/comment/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/start time/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/end time/i)).toBeInTheDocument()
    })

    it('renders Create Entry button in create mode', () => {
      renderForm({ mode: 'create' })
      expect(
        screen.getByRole('button', { name: /create entry/i }),
      ).toBeInTheDocument()
    })

    it('renders Save Changes button in edit mode', () => {
      renderForm({ mode: 'edit' })
      expect(
        screen.getByRole('button', { name: /save changes/i }),
      ).toBeInTheDocument()
    })

    it('renders Cancel button', () => {
      renderForm()
      expect(
        screen.getByRole('button', { name: /cancel/i }),
      ).toBeInTheDocument()
    })

    it('renders link to hierarchy view', () => {
      renderForm()
      expect(screen.getByText(/hierarchy view/i)).toBeInTheDocument()
    })
  })

  describe('initial data', () => {
    it('pre-fills form with initial data in edit mode', () => {
      const initialData = {
        id: 1,
        taskId: 42,
        comment: 'Test comment',
        start: '2024-01-15T09:00:00.000Z',
        end: '2024-01-15T10:30:00.000Z',
        createdAt: '2024-01-15T08:00:00.000Z',
        userId: 1,
      }

      renderForm({ mode: 'edit', initialData })

      expect(screen.getByLabelText(/task id/i)).toHaveValue(42)
      expect(screen.getByLabelText(/comment/i)).toHaveValue('Test comment')
    })
  })

  describe('validation', () => {
    it('shows error when task ID is empty', async () => {
      const user = userEvent.setup()
      renderForm()

      await user.click(screen.getByRole('button', { name: /create entry/i }))

      expect(screen.getByText(/please select a task/i)).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('shows error when comment is empty', async () => {
      const user = userEvent.setup()
      renderForm()

      await user.type(screen.getByLabelText(/task id/i), '42')
      await user.click(screen.getByRole('button', { name: /create entry/i }))

      expect(screen.getByText(/please enter a comment/i)).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('shows error when start time is empty', async () => {
      const user = userEvent.setup()
      renderForm()

      await user.type(screen.getByLabelText(/task id/i), '42')
      await user.type(screen.getByLabelText(/comment/i), 'Test comment')
      await user.click(screen.getByRole('button', { name: /create entry/i }))

      expect(
        screen.getByText(/please select a start time/i),
      ).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('shows error when end time is empty', async () => {
      const user = userEvent.setup()
      renderForm()

      await user.type(screen.getByLabelText(/task id/i), '42')
      await user.type(screen.getByLabelText(/comment/i), 'Test comment')
      // Set start time
      const startInput = screen.getByLabelText(/start time/i)
      await user.clear(startInput)
      await user.type(startInput, '2024-01-15T09:00')
      await user.click(screen.getByRole('button', { name: /create entry/i }))

      expect(screen.getByText(/please select an end time/i)).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })

    it('shows error when end time is before start time', async () => {
      const user = userEvent.setup()
      renderForm()

      await user.type(screen.getByLabelText(/task id/i), '42')
      await user.type(screen.getByLabelText(/comment/i), 'Test comment')

      const startInput = screen.getByLabelText(/start time/i)
      const endInput = screen.getByLabelText(/end time/i)

      await user.clear(startInput)
      await user.type(startInput, '2024-01-15T10:00')
      await user.clear(endInput)
      await user.type(endInput, '2024-01-15T09:00')

      await user.click(screen.getByRole('button', { name: /create entry/i }))

      expect(
        screen.getByText(/end time must be after start time/i),
      ).toBeInTheDocument()
      expect(mockOnSubmit).not.toHaveBeenCalled()
    })
  })

  describe('submission', () => {
    it('submits form with valid data', async () => {
      const user = userEvent.setup()
      renderForm()

      await user.type(screen.getByLabelText(/task id/i), '42')
      await user.type(screen.getByLabelText(/comment/i), 'Test comment')

      const startInput = screen.getByLabelText(/start time/i)
      const endInput = screen.getByLabelText(/end time/i)

      await user.clear(startInput)
      await user.type(startInput, '2024-01-15T09:00')
      await user.clear(endInput)
      await user.type(endInput, '2024-01-15T10:30')

      await user.click(screen.getByRole('button', { name: /create entry/i }))

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          taskId: 42,
          comment: 'Test comment',
          start: expect.stringMatching(/2024-01-15/),
          end: expect.stringMatching(/2024-01-15/),
        })
      })
    })

    it('navigates to time-entries on successful submit', async () => {
      const user = userEvent.setup()
      renderForm()

      await user.type(screen.getByLabelText(/task id/i), '42')
      await user.type(screen.getByLabelText(/comment/i), 'Test comment')

      const startInput = screen.getByLabelText(/start time/i)
      const endInput = screen.getByLabelText(/end time/i)

      await user.clear(startInput)
      await user.type(startInput, '2024-01-15T09:00')
      await user.clear(endInput)
      await user.type(endInput, '2024-01-15T10:30')

      await user.click(screen.getByRole('button', { name: /create entry/i }))

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({
          to: '/time-entries',
          search: { success: 'created', entryId: '123' },
        })
      })
    })

    it('shows loading state during submission', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve({ id: 1 }), 100)),
      )
      renderForm()

      await user.type(screen.getByLabelText(/task id/i), '42')
      await user.type(screen.getByLabelText(/comment/i), 'Test comment')

      const startInput = screen.getByLabelText(/start time/i)
      const endInput = screen.getByLabelText(/end time/i)

      await user.clear(startInput)
      await user.type(startInput, '2024-01-15T09:00')
      await user.clear(endInput)
      await user.type(endInput, '2024-01-15T10:30')

      await user.click(screen.getByRole('button', { name: /create entry/i }))

      expect(screen.getByText(/saving/i)).toBeInTheDocument()
    })

    it('shows error message on submission failure', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockRejectedValue(new Error('Network error'))
      renderForm()

      await user.type(screen.getByLabelText(/task id/i), '42')
      await user.type(screen.getByLabelText(/comment/i), 'Test comment')

      const startInput = screen.getByLabelText(/start time/i)
      const endInput = screen.getByLabelText(/end time/i)

      await user.clear(startInput)
      await user.type(startInput, '2024-01-15T09:00')
      await user.clear(endInput)
      await user.type(endInput, '2024-01-15T10:30')

      await user.click(screen.getByRole('button', { name: /create entry/i }))

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument()
      })
    })

    it('disables form fields during submission', async () => {
      const user = userEvent.setup()
      mockOnSubmit.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve({ id: 1 }), 100)),
      )
      renderForm()

      await user.type(screen.getByLabelText(/task id/i), '42')
      await user.type(screen.getByLabelText(/comment/i), 'Test comment')

      const startInput = screen.getByLabelText(/start time/i)
      const endInput = screen.getByLabelText(/end time/i)

      await user.clear(startInput)
      await user.type(startInput, '2024-01-15T09:00')
      await user.clear(endInput)
      await user.type(endInput, '2024-01-15T10:30')

      await user.click(screen.getByRole('button', { name: /create entry/i }))

      expect(screen.getByLabelText(/task id/i)).toBeDisabled()
      expect(screen.getByLabelText(/comment/i)).toBeDisabled()
    })
  })

  describe('duration preview', () => {
    it('shows duration when start and end are valid', async () => {
      const user = userEvent.setup()
      renderForm()

      const startInput = screen.getByLabelText(/start time/i)
      const endInput = screen.getByLabelText(/end time/i)

      await user.clear(startInput)
      await user.type(startInput, '2024-01-15T09:00')
      await user.clear(endInput)
      await user.type(endInput, '2024-01-15T10:30')

      expect(screen.getByText(/duration/i)).toBeInTheDocument()
      expect(screen.getByText(/1h 30m/)).toBeInTheDocument()
    })

    it('does not show duration when end is before start', async () => {
      const user = userEvent.setup()
      renderForm()

      const startInput = screen.getByLabelText(/start time/i)
      const endInput = screen.getByLabelText(/end time/i)

      await user.clear(startInput)
      await user.type(startInput, '2024-01-15T10:00')
      await user.clear(endInput)
      await user.type(endInput, '2024-01-15T09:00')

      expect(screen.queryByText(/duration/i)).not.toBeInTheDocument()
    })
  })

  describe('cancel button', () => {
    it('navigates to time-entries when cancel is clicked', async () => {
      const user = userEvent.setup()
      renderForm()

      await user.click(screen.getByRole('button', { name: /cancel/i }))

      expect(mockNavigate).toHaveBeenCalledWith({ to: '/time-entries' })
    })
  })
})
