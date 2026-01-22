import { createFileRoute } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { TimeEntryForm } from '@/components/TimeEntryForm'
import { useCreateTimeEntry } from '@/hooks/use-memtime-queries'

export const Route = createFileRoute('/time-entries/new')({
  component: NewTimeEntryPage,
})

function NewTimeEntryPage() {
  const createMutation = useCreateTimeEntry()

  const handleSubmit = async (data: {
    taskId: number
    comment: string
    start: string
    end: string
  }) => {
    const result = await createMutation.mutateAsync(data)
    return result
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100">
              New Time Entry
            </h1>
          </div>
          <p className="text-slate-400">
            Record your work by creating a new time entry.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
          <TimeEntryForm mode="create" onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}
