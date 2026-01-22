import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TreeNode, TreeNodeSkeleton } from './TreeNode'

describe('TreeNode', () => {
  const defaultProps = {
    id: 1,
    name: 'Test Node',
    type: 'client' as const,
    depth: 0,
    hasMore: false,
    onExpand: vi.fn().mockResolvedValue(undefined),
    onLoadMore: vi.fn().mockResolvedValue(undefined),
  }

  it('renders node name', () => {
    render(<TreeNode {...defaultProps} />)
    expect(screen.getByText('Test Node')).toBeInTheDocument()
  })

  it('renders Client badge for client type', () => {
    render(<TreeNode {...defaultProps} type="client" />)
    expect(screen.getByText('Client')).toBeInTheDocument()
  })

  it('renders Project badge for project type', () => {
    render(<TreeNode {...defaultProps} type="project" />)
    expect(screen.getByText('Project')).toBeInTheDocument()
  })

  it('renders Task badge with ID for task type', () => {
    render(<TreeNode {...defaultProps} type="task" id={42} />)
    expect(screen.getByText('Task #42')).toBeInTheDocument()
  })

  it('renders count badge when totalCount is provided', () => {
    render(<TreeNode {...defaultProps} totalCount={5} />)
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('does not render count badge when totalCount is 0', () => {
    render(<TreeNode {...defaultProps} totalCount={0} />)
    expect(screen.queryByText('0')).not.toBeInTheDocument()
  })

  it('shows expand icon for clients', () => {
    const { container } = render(<TreeNode {...defaultProps} type="client" />)
    // ChevronRight SVG should be present
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('shows expand icon for projects', () => {
    const { container } = render(<TreeNode {...defaultProps} type="project" />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('does not show expand icon for tasks', () => {
    const { container } = render(<TreeNode {...defaultProps} type="task" />)
    // Should have type icon but no chevron
    const chevrons = container.querySelectorAll('[class*="chevron"]')
    expect(chevrons.length).toBe(0)
  })

  it('calls onExpand when clicking expandable node', async () => {
    const user = userEvent.setup()
    const onExpand = vi.fn().mockResolvedValue(undefined)
    render(<TreeNode {...defaultProps} type="client" onExpand={onExpand} />)

    await user.click(screen.getByRole('button'))
    expect(onExpand).toHaveBeenCalledWith(1, 'client')
  })

  it('does not call onExpand when clicking task node', async () => {
    const user = userEvent.setup()
    const onExpand = vi.fn().mockResolvedValue(undefined)
    render(<TreeNode {...defaultProps} type="task" onExpand={onExpand} />)

    await user.click(screen.getByRole('button'))
    expect(onExpand).not.toHaveBeenCalled()
  })

  it('shows loading state while expanding', async () => {
    const user = userEvent.setup()
    const onExpand = vi.fn(
      () => new Promise((resolve) => setTimeout(resolve, 100)),
    )
    render(<TreeNode {...defaultProps} type="client" onExpand={onExpand} />)

    await user.click(screen.getByRole('button'))

    // Loading spinner should appear (Loader2 component)
    await waitFor(() => {
      const loader = document.querySelector('.animate-spin')
      expect(loader).toBeInTheDocument()
    })
  })

  it('renders children when expanded', async () => {
    const user = userEvent.setup()
    const onExpand = vi.fn().mockResolvedValue(undefined)
    render(
      <TreeNode {...defaultProps} type="client" onExpand={onExpand}>
        <div>Child Content</div>
      </TreeNode>,
    )

    await user.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText('Child Content')).toBeInTheDocument()
    })
  })

  it('toggles expansion on subsequent clicks', async () => {
    const user = userEvent.setup()
    const onExpand = vi.fn().mockResolvedValue(undefined)
    render(
      <TreeNode {...defaultProps} type="client" onExpand={onExpand}>
        <div>Child Content</div>
      </TreeNode>,
    )

    // First click - expand
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByText('Child Content')).toBeInTheDocument()
    })

    // Second click - collapse
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.queryByText('Child Content')).not.toBeInTheDocument()
    })

    // Third click - expand again (should not call onExpand again)
    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByText('Child Content')).toBeInTheDocument()
    })

    // onExpand should only be called once (on first expand)
    expect(onExpand).toHaveBeenCalledTimes(1)
  })

  it('shows Load more button when hasMore is true', async () => {
    const user = userEvent.setup()
    const onExpand = vi.fn().mockResolvedValue(undefined)
    render(
      <TreeNode
        {...defaultProps}
        type="client"
        hasMore={true}
        loadedCount={5}
        totalCount={10}
        onExpand={onExpand}
      >
        <div>Child</div>
      </TreeNode>,
    )

    await user.click(screen.getByRole('button'))

    await waitFor(() => {
      expect(screen.getByText(/Load more/)).toBeInTheDocument()
      expect(screen.getByText(/5 of 10/)).toBeInTheDocument()
    })
  })

  it('calls onLoadMore when Load more button is clicked', async () => {
    const user = userEvent.setup()
    const onExpand = vi.fn().mockResolvedValue(undefined)
    const onLoadMore = vi.fn().mockResolvedValue(undefined)
    render(
      <TreeNode
        {...defaultProps}
        type="client"
        hasMore={true}
        loadedCount={5}
        totalCount={10}
        onExpand={onExpand}
        onLoadMore={onLoadMore}
      >
        <div>Child</div>
      </TreeNode>,
    )

    await user.click(screen.getByRole('button'))
    await waitFor(() => {
      expect(screen.getByText(/Load more/)).toBeInTheDocument()
    })

    await user.click(screen.getByText(/Load more/))
    expect(onLoadMore).toHaveBeenCalledWith(1, 'client')
  })

  it('handles keyboard navigation with Enter key', async () => {
    const user = userEvent.setup()
    const onExpand = vi.fn().mockResolvedValue(undefined)
    render(<TreeNode {...defaultProps} type="client" onExpand={onExpand} />)

    const button = screen.getByRole('button')
    button.focus()
    await user.keyboard('{Enter}')

    expect(onExpand).toHaveBeenCalled()
  })

  it('handles keyboard navigation with Space key', async () => {
    const user = userEvent.setup()
    const onExpand = vi.fn().mockResolvedValue(undefined)
    render(<TreeNode {...defaultProps} type="client" onExpand={onExpand} />)

    const button = screen.getByRole('button')
    button.focus()
    await user.keyboard(' ')

    expect(onExpand).toHaveBeenCalled()
  })

  it('applies correct indentation based on depth', () => {
    const { container } = render(<TreeNode {...defaultProps} depth={2} />)
    const nodeRow = container.querySelector('[style*="padding-left"]')
    // depth=2 means 2*24 + 12 = 60px
    expect(nodeRow).toHaveStyle({ paddingLeft: '60px' })
  })
})

describe('TreeNodeSkeleton', () => {
  it('renders skeleton with default depth', () => {
    const { container } = render(<TreeNodeSkeleton />)
    const skeleton = container.querySelector('[style*="padding-left"]')
    expect(skeleton).toHaveStyle({ paddingLeft: '12px' })
  })

  it('renders skeleton with specified depth', () => {
    const { container } = render(<TreeNodeSkeleton depth={2} />)
    const skeleton = container.querySelector('[style*="padding-left"]')
    // depth=2 means 2*24 + 12 = 60px
    expect(skeleton).toHaveStyle({ paddingLeft: '60px' })
  })

  it('has animation class', () => {
    const { container } = render(<TreeNodeSkeleton />)
    const skeleton = container.querySelector('.animate-pulse')
    expect(skeleton).toBeInTheDocument()
  })
})
