import { createFileRoute, Link } from '@tanstack/react-router'
import { Loader2, AlertCircle, Edit } from 'lucide-react'
import { TimeEntryForm } from '@/components/TimeEntryForm'
import { useTimeEntry, useUpdateTimeEntry } from '@/hooks/use-memtime-queries'

export const Route = createFileRoute('/time-entries/$id')({
  pendingComponent: LoadingState,
  component: EditTimeEntryPage,
})

function EditTimeEntryPage() {
  const { id } = Route.useParams()
  const { data: timeEntry, isLoading, error } = useTimeEntry(id)

  const updateMutation = useUpdateTimeEntry()

  const handleSubmit = async (data: {
    taskId: number
    comment: string
    start: string
    end: string
  }) => {
    const result = await updateMutation.mutateAsync({ id, ...data })
    return result
  }

  if (isLoading) {
    return <LoadingState />
  }

  if (error instanceof Error) {
    return <ErrorState error={error} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-600">
              <Edit className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-100">
              Edit Time Entry
            </h1>
          </div>
          <p className="text-slate-400">
            Update the details of time entry #{id}.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6">
          <TimeEntryForm
            mode="edit"
            initialData={timeEntry}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8">
          <div className="mb-2 h-10 w-64 animate-pulse rounded bg-slate-700" />
          <div className="h-4 w-96 animate-pulse rounded bg-slate-700" />
        </div>
        <div className="flex items-center justify-center rounded-xl border border-slate-700 bg-slate-800/50 p-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-3 text-slate-400">Loading time entry...</span>
        </div>
      </div>
    </div>
  )
}

function ErrorState({ error }: { error: Error }) {
  const isNotFound =
    error.message.includes('not found') || error.message.includes('404')

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-xl border border-red-700 bg-red-900/30 p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h2 className="mb-2 text-xl font-semibold text-white">
            {isNotFound ? 'Time Entry Not Found' : 'Failed to Load'}
          </h2>
          <p className="mb-4 text-red-300">{error.message}</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/time-entries"
              className="rounded-lg bg-slate-600 px-4 py-2 text-white transition-colors hover:bg-slate-500"
            >
              Back to List
            </Link>
            {!isNotFound && (
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
