import { useState, useEffect } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  Clock,
  Edit,
  Plus,
  AlertCircle,
  Loader2,
  CheckCircle,
  X,
} from 'lucide-react'
import { getTimeEntries } from '@/api/memtime'
import { Pagination } from '@/components/Pagination'
import { formatDateTime } from '@/utils/date'
import type { TimeEntry } from '@/types/memtime'

const ITEMS_PER_PAGE = 10

type SearchParams = {
  page?: number
  success?: 'created' | 'updated'
  entryId?: string
}

export const Route = createFileRoute('/time-entries/')({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      page: Number(search?.page) || 1,
      success: search?.success as 'created' | 'updated' | undefined,
      entryId: search?.entryId as string | undefined,
    }
  },
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: async ({ deps: { page } }) => {
    const offset = ((page ?? 1) - 1) * ITEMS_PER_PAGE
    return getTimeEntries({ data: { limit: ITEMS_PER_PAGE, offset } })
  },
  pendingComponent: LoadingState,
  errorComponent: ErrorState,
  component: TimeEntriesPage,
})

function TimeEntriesPage() {
  const { page, success, entryId } = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const data = Route.useLoaderData()
  const [showSuccess, setShowSuccess] = useState(!!success)

  const entries = data?.data ?? []
  const total = data?.total ?? 0
  const currentPage = page ?? 1

  // Auto-dismiss success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setShowSuccess(false)
        navigate({ search: { page: currentPage }, replace: true })
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [success, currentPage, navigate])

  const handlePageChange = (newPage: number) => {
    navigate({
      search: { page: newPage },
    })
  }

  const dismissSuccess = () => {
    setShowSuccess(false)
    navigate({ search: { page: currentPage }, replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Success Message */}
        {showSuccess && success && (
          <div className="mb-6 flex items-center justify-between rounded-lg border border-green-700 bg-green-900/30 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <span className="text-green-300">
                {success === 'created'
                  ? `Time entry #${entryId} created successfully!`
                  : `Time entry #${entryId} updated successfully!`}
              </span>
            </div>
            <button
              onClick={dismissSuccess}
              className="text-green-400 hover:text-green-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Time Entries</h1>
            <p className="mt-2 text-slate-400">
              View and manage your time tracking records.
            </p>
          </div>
          <Link
            to="/time-entries/new"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            New Entry
          </Link>
        </div>

        {/* Content */}
        <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50">
          {entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="mb-4 h-12 w-12 text-slate-500" />
              <p className="text-lg text-slate-400">No time entries found</p>
              <p className="mt-2 text-sm text-slate-500">
                Create your first time entry to get started.
              </p>
              <Link
                to="/time-entries/new"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                Create Entry
              </Link>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700">
                  <thead className="bg-slate-800">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                      >
                        Task
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                      >
                        Comment
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                      >
                        Start
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                      >
                        End
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400"
                      >
                        Created At
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700 bg-slate-800/30">
                    {entries.map((entry: TimeEntry) => (
                      <tr
                        key={entry.id}
                        className="transition-colors hover:bg-slate-800/50"
                      >
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-200">
                          #{entry.id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-500" />
                            <span className="text-sm text-slate-300">
                              Task #{entry.taskId}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="max-w-xs truncate text-sm text-slate-300">
                            {entry.comment || (
                              <span className="italic text-slate-500">
                                No comment
                              </span>
                            )}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-400">
                          {formatDateTime(entry.start)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-400">
                          {formatDateTime(entry.end)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-400">
                          {formatDateTime(entry.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                          <Link
                            to="/time-entries/$id"
                            params={{ id: String(entry.id) }}
                            className="inline-flex items-center gap-1 text-blue-400 transition-colors hover:text-blue-300"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={currentPage}
                totalItems={total}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <div className="h-9 w-48 animate-pulse rounded bg-slate-700" />
            <div className="mt-2 h-5 w-72 animate-pulse rounded bg-slate-700" />
          </div>
          <div className="h-10 w-32 animate-pulse rounded-lg bg-slate-700" />
        </div>
        <div className="overflow-hidden rounded-lg border border-slate-700 bg-slate-800/50">
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-slate-400">Loading time entries...</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="rounded-xl border border-red-700 bg-red-900/30 p-8 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-400" />
          <h2 className="mb-2 text-xl font-semibold text-white">
            Failed to Load Time Entries
          </h2>
          <p className="mb-4 text-red-300">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
