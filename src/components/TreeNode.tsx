import { useState, useCallback } from 'react'
import {
  ChevronRight,
  ChevronDown,
  Building2,
  FolderOpen,
  CheckSquare,
  Loader2,
} from 'lucide-react'
import type { TreeNodeType } from '@/types/memtime'
import { getNodeLabel, calculateIndent, canNodeExpand } from '@/utils/tree'

// =============================================================================
// Types
// =============================================================================

export interface TreeNodeProps {
  id: string | number
  name: string
  type: TreeNodeType
  depth: number
  hasMore: boolean
  totalCount?: number
  loadedCount?: number
  onExpand: (id: string | number, type: TreeNodeType) => Promise<void>
  onLoadMore: (id: string | number, type: TreeNodeType) => Promise<void>
  children?: React.ReactNode
}

// =============================================================================
// Icon Helper (returns JSX, stays in component)
// =============================================================================

function getNodeIcon(type: TreeNodeType) {
  switch (type) {
    case 'client':
      return <Building2 size={18} className="text-blue-400" />
    case 'project':
      return <FolderOpen size={18} className="text-amber-400" />
    case 'task':
      return <CheckSquare size={18} className="text-green-400" />
  }
}

// =============================================================================
// TreeNode Component
// =============================================================================

export function TreeNode({
  id,
  name,
  type,
  depth,
  hasMore,
  totalCount,
  loadedCount,
  onExpand,
  onLoadMore,
  children,
}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasLoaded, setHasLoaded] = useState(false)

  const canExpand = canNodeExpand(type)
  const indentPx = calculateIndent(depth)

  const handleToggle = useCallback(async () => {
    if (!canExpand) return

    if (!hasLoaded) {
      setIsLoading(true)
      try {
        await onExpand(id, type)
        setHasLoaded(true)
        setIsExpanded(true)
      } catch (error) {
        console.error('Failed to expand node:', error)
      } finally {
        setIsLoading(false)
      }
    } else {
      setIsExpanded(!isExpanded)
    }
  }, [canExpand, hasLoaded, isExpanded, id, type, onExpand])

  const handleLoadMore = useCallback(async () => {
    setIsLoadingMore(true)
    try {
      await onLoadMore(id, type)
    } catch (error) {
      console.error('Failed to load more:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [id, type, onLoadMore])

  return (
    <div className="select-none">
      {/* Node Row */}
      <div
        className={`
          flex items-center gap-2 py-2 px-3 rounded-lg
          hover:bg-gray-800/50 transition-colors cursor-pointer
          ${isExpanded ? 'bg-gray-800/30' : ''}
        `}
        style={{ paddingLeft: `${indentPx + 12}px` }}
        onClick={handleToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggle()
          }
        }}
      >
        {/* Expand/Collapse Icon */}
        <div className="w-5 h-5 flex items-center justify-center">
          {isLoading ? (
            <Loader2 size={16} className="animate-spin text-gray-400" />
          ) : canExpand ? (
            isExpanded ? (
              <ChevronDown size={16} className="text-gray-400" />
            ) : (
              <ChevronRight size={16} className="text-gray-400" />
            )
          ) : (
            <span className="w-4" />
          )}
        </div>

        {/* Type Icon */}
        {getNodeIcon(type)}

        {/* Name */}
        <span className="flex-1 text-gray-100 font-medium truncate">
          {name}
        </span>

        {/* Type Badge with ID for tasks */}
        <span className="text-xs text-gray-500 px-2 py-0.5 bg-gray-800 rounded">
          {getNodeLabel(type)}
          {type === 'task' && ` #${id}`}
        </span>

        {/* Count Badge (if has children) */}
        {totalCount !== undefined && totalCount > 0 && (
          <span className="text-xs text-blue-400 px-2 py-0.5 bg-blue-900/30 rounded">
            {totalCount}
          </span>
        )}
      </div>

      {/* Children */}
      {isExpanded && children && (
        <div className="relative">
          {/* Vertical connector line */}
          <div
            className="absolute top-0 bottom-0 w-px bg-gray-700"
            style={{ left: `${indentPx + 22}px` }}
          />
          {children}

          {/* Load More Button */}
          {hasMore && loadedCount !== undefined && totalCount !== undefined && (
            <div className="py-2" style={{ paddingLeft: `${indentPx + 48}px` }}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleLoadMore()
                }}
                disabled={isLoadingMore}
                className="
                  text-sm text-blue-400 hover:text-blue-300
                  disabled:text-gray-500 disabled:cursor-not-allowed
                  flex items-center gap-2 transition-colors
                "
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load more ({loadedCount} of {totalCount})
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// =============================================================================
// Loading Skeleton
// =============================================================================

export function TreeNodeSkeleton({ depth = 0 }: { depth?: number }) {
  const indentPx = calculateIndent(depth)

  return (
    <div
      className="flex items-center gap-2 py-2 px-3 animate-pulse"
      style={{ paddingLeft: `${indentPx + 12}px` }}
    >
      <div className="w-5 h-5 bg-gray-700 rounded" />
      <div className="w-5 h-5 bg-gray-700 rounded" />
      <div className="flex-1 h-4 bg-gray-700 rounded max-w-48" />
      <div className="w-16 h-5 bg-gray-700 rounded" />
    </div>
  )
}
