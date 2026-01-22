import { useState } from 'react'
import { useNavigate, Link } from '@tanstack/react-router'
import {
  Loader2,
  AlertCircle,
  Clock,
  ExternalLink,
  Calendar,
} from 'lucide-react'
import type { TimeEntry } from '@/types/memtime'
import {
  toDateTimeLocal,
  toISOString,
  formatDuration,
  isValidDateRange,
} from '@/utils/date'

interface TimeEntryFormProps {
  mode: 'create' | 'edit'
  initialData?: TimeEntry
  onSubmit: (data: {
    taskId: number
    comment: string
    start: string
    end: string
  }) => Promise<TimeEntry>
}

export function TimeEntryForm({
  mode,
  initialData,
  onSubmit,
}: TimeEntryFormProps) {
  const navigate = useNavigate()

  const [taskId, setTaskId] = useState<string>(
    initialData?.taskId?.toString() ?? '',
  )
  const [comment, setComment] = useState(initialData?.comment ?? '')
  const [start, setStart] = useState(
    initialData?.start ? toDateTimeLocal(initialData.start) : '',
  )
  const [end, setEnd] = useState(
    initialData?.end ? toDateTimeLocal(initialData.end) : '',
  )

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!taskId) {
      setError('Please select a task')
      return
    }
    if (!comment.trim()) {
      setError('Please enter a comment')
      return
    }
    if (!start) {
      setError('Please select a start time')
      return
    }
    if (!end) {
      setError('Please select an end time')
      return
    }

    if (!isValidDateRange(start, end)) {
      setError('End time must be after start time')
      return
    }

    setIsSubmitting(true)
    try {
      const result = await onSubmit({
        taskId: parseInt(taskId, 10),
        comment: comment.trim(),
        start: toISOString(start),
        end: toISOString(end),
      })
      navigate({
        to: '/time-entries',
        search: {
          success: mode === 'create' ? 'created' : 'updated',
          entryId: String(result.id),
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save time entry')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-red-700 bg-red-900/30 p-4 text-red-300">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Task ID */}
      <div>
        <label
          htmlFor="taskId"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Task ID <span className="text-red-400">*</span>
        </label>
        <input
          type="number"
          id="taskId"
          value={taskId}
          onChange={(e) => setTaskId(e.target.value)}
          placeholder="Enter task ID"
          min="1"
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isSubmitting}
        />
        <p className="mt-2 text-sm text-slate-500">
          Find task IDs in the{' '}
          <Link
            to="/hierarchy"
            className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300"
          >
            Hierarchy view
            <ExternalLink className="h-3 w-3" />
          </Link>
        </p>
      </div>

      {/* Comment */}
      <div>
        <label
          htmlFor="comment"
          className="mb-2 block text-sm font-medium text-slate-300"
        >
          Comment <span className="text-red-400">*</span>
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder="What did you work on?"
          className="w-full resize-none rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          disabled={isSubmitting}
        />
      </div>

      {/* Date/Time Fields */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="start"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Start Time <span className="text-red-400">*</span>
          </label>
          <div
            className="relative cursor-pointer"
            onClick={() => document.getElementById('start')?.showPicker?.()}
          >
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
            <input
              type="datetime-local"
              id="start"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="w-full cursor-pointer rounded-lg border border-slate-600 bg-slate-800 py-3 pl-11 pr-4 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 [&::-webkit-calendar-picker-indicator]:hidden"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="end"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            End Time <span className="text-red-400">*</span>
          </label>
          <div
            className="relative cursor-pointer"
            onClick={() => document.getElementById('end')?.showPicker?.()}
          >
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400" />
            <input
              type="datetime-local"
              id="end"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="w-full cursor-pointer rounded-lg border border-slate-600 bg-slate-800 py-3 pl-11 pr-4 text-slate-100 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 [&::-webkit-calendar-picker-indicator]:hidden"
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Duration Preview */}
      {start && end && isValidDateRange(start, end) && (
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Clock className="h-4 w-4" />
          <span>Duration: {formatDuration(start, end)}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>{mode === 'create' ? 'Create Entry' : 'Save Changes'}</>
          )}
        </button>
        <button
          type="button"
          onClick={() => navigate({ to: '/time-entries' })}
          disabled={isSubmitting}
          className="rounded-lg px-6 py-2.5 font-medium text-slate-400 transition-colors hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
