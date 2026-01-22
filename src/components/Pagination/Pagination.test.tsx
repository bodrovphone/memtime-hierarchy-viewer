import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalItems: 50,
    itemsPerPage: 10,
    onPageChange: vi.fn(),
  }

  it('renders null when totalItems is 0', () => {
    const { container } = render(
      <Pagination {...defaultProps} totalItems={0} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('displays correct item range', () => {
    render(<Pagination {...defaultProps} />)
    // Check the "Showing X to Y of Z results" text
    expect(screen.getByText(/showing/i)).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
  })

  it('displays correct range on page 2', () => {
    render(<Pagination {...defaultProps} currentPage={2} />)
    expect(screen.getByText('11')).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
  })

  it('displays correct range on last page with partial items', () => {
    render(<Pagination {...defaultProps} currentPage={5} totalItems={45} />)
    // Should show 41-45 of 45
    expect(screen.getByText('41')).toBeInTheDocument()
    // 45 appears twice (end item and total), so use getAllByText
    expect(screen.getAllByText('45').length).toBeGreaterThanOrEqual(1)
  })

  it('disables Previous button on first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />)
    const prevButtons = screen.getAllByRole('button', { name: /previous/i })
    prevButtons.forEach((btn) => expect(btn).toBeDisabled())
  })

  it('disables Next button on last page', () => {
    render(<Pagination {...defaultProps} currentPage={5} />)
    const nextButtons = screen.getAllByRole('button', { name: /next/i })
    nextButtons.forEach((btn) => expect(btn).toBeDisabled())
  })

  it('enables Previous button on page > 1', () => {
    render(<Pagination {...defaultProps} currentPage={2} />)
    const prevButtons = screen.getAllByRole('button', { name: /previous/i })
    prevButtons.forEach((btn) => expect(btn).not.toBeDisabled())
  })

  it('enables Next button when not on last page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />)
    const nextButtons = screen.getAllByRole('button', { name: /next/i })
    nextButtons.forEach((btn) => expect(btn).not.toBeDisabled())
  })

  it('calls onPageChange with previous page when Previous is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(
      <Pagination
        {...defaultProps}
        currentPage={3}
        onPageChange={onPageChange}
      />,
    )

    const prevButtons = screen.getAllByRole('button', { name: /previous/i })
    await user.click(prevButtons[0])

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('calls onPageChange with next page when Next is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(
      <Pagination
        {...defaultProps}
        currentPage={2}
        onPageChange={onPageChange}
      />,
    )

    const nextButtons = screen.getAllByRole('button', { name: /next/i })
    await user.click(nextButtons[0])

    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange with specific page when page number is clicked', async () => {
    const user = userEvent.setup()
    const onPageChange = vi.fn()
    render(
      <Pagination
        {...defaultProps}
        currentPage={1}
        onPageChange={onPageChange}
      />,
    )

    // Click page 2 (page 3 may be hidden due to ellipsis logic)
    const page2Button = screen.getByRole('button', { name: '2' })
    await user.click(page2Button)

    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('highlights current page', () => {
    render(<Pagination {...defaultProps} currentPage={3} />)
    const page3Button = screen.getByRole('button', { name: '3' })
    expect(page3Button).toHaveClass('bg-blue-600')
  })

  it('shows ellipsis for many pages', () => {
    render(<Pagination {...defaultProps} currentPage={1} totalItems={200} />)
    // With 200 items at 10 per page = 20 pages
    // Should show ellipsis between first pages and last page
    const ellipses = screen.getAllByText('...')
    expect(ellipses.length).toBeGreaterThan(0)
  })

  it('calculates total pages correctly', () => {
    render(<Pagination {...defaultProps} totalItems={25} itemsPerPage={10} />)
    // 25 items / 10 per page = 3 pages
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '4' })).not.toBeInTheDocument()
  })
})
