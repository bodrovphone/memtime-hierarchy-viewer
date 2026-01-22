import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Header from './Header'

// Mock @tanstack/react-router
vi.mock('@tanstack/react-router', () => ({
  Link: ({
    to,
    children,
    className,
    activeProps,
    activeOptions,
    onClick,
  }: {
    to: string
    children: React.ReactNode
    className?: string
    activeProps?: object
    activeOptions?: object
    onClick?: () => void
  }) => (
    <a href={to} className={className} onClick={onClick}>
      {children}
    </a>
  ),
}))

describe('Header', () => {
  describe('rendering', () => {
    it('renders the logo text', () => {
      render(<Header />)
      expect(screen.getAllByText('Memtime Viewer').length).toBeGreaterThan(0)
    })

    it('renders menu button', () => {
      render(<Header />)
      expect(
        screen.getByRole('button', { name: /open menu/i }),
      ).toBeInTheDocument()
    })

    it('renders desktop navigation links', () => {
      render(<Header />)
      // Multiple "Home", "Hierarchy", "Time Entries" exist (desktop + sidebar)
      expect(screen.getAllByText('Home').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Hierarchy').length).toBeGreaterThanOrEqual(1)
      expect(screen.getAllByText('Time Entries').length).toBeGreaterThanOrEqual(
        1,
      )
    })

    it('renders correct navigation hrefs', () => {
      render(<Header />)
      // Multiple links exist (desktop nav + sidebar), check that correct hrefs exist
      const homeLinks = screen.getAllByRole('link', { name: /home/i })
      expect(homeLinks.some((link) => link.getAttribute('href') === '/')).toBe(
        true,
      )
      const hierarchyLinks = screen.getAllByRole('link', { name: /hierarchy/i })
      expect(
        hierarchyLinks.some(
          (link) => link.getAttribute('href') === '/hierarchy',
        ),
      ).toBe(true)
      const timeEntriesLinks = screen.getAllByRole('link', {
        name: /time entries/i,
      })
      expect(
        timeEntriesLinks.some(
          (link) => link.getAttribute('href') === '/time-entries',
        ),
      ).toBe(true)
    })
  })

  describe('mobile sidebar', () => {
    it('sidebar is initially closed', () => {
      render(<Header />)
      const sidebar = document.querySelector('aside')
      expect(sidebar).toHaveClass('-translate-x-full')
    })

    it('opens sidebar when menu button is clicked', async () => {
      const user = userEvent.setup()
      render(<Header />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      const sidebar = document.querySelector('aside')
      expect(sidebar).toHaveClass('translate-x-0')
    })

    it('closes sidebar when close button is clicked', async () => {
      const user = userEvent.setup()
      render(<Header />)

      // Open sidebar
      await user.click(screen.getByRole('button', { name: /open menu/i }))
      expect(document.querySelector('aside')).toHaveClass('translate-x-0')

      // Close sidebar
      await user.click(screen.getByRole('button', { name: /close menu/i }))
      expect(document.querySelector('aside')).toHaveClass('-translate-x-full')
    })

    it('closes sidebar when backdrop is clicked', async () => {
      const user = userEvent.setup()
      render(<Header />)

      // Open sidebar
      await user.click(screen.getByRole('button', { name: /open menu/i }))

      // Click backdrop
      const backdrop = document.querySelector('.bg-black\\/50')
      expect(backdrop).toBeInTheDocument()
      await user.click(backdrop!)

      expect(document.querySelector('aside')).toHaveClass('-translate-x-full')
    })

    it('shows backdrop when sidebar is open', async () => {
      const user = userEvent.setup()
      render(<Header />)

      // Backdrop should not exist initially
      expect(document.querySelector('.bg-black\\/50')).not.toBeInTheDocument()

      // Open sidebar
      await user.click(screen.getByRole('button', { name: /open menu/i }))

      // Backdrop should now exist
      expect(document.querySelector('.bg-black\\/50')).toBeInTheDocument()
    })

    it('renders mobile navigation links in sidebar', async () => {
      const user = userEvent.setup()
      render(<Header />)

      // Open sidebar
      await user.click(screen.getByRole('button', { name: /open menu/i }))

      // Sidebar should have navigation links (check sidebar is visible)
      const sidebar = document.querySelector('aside')
      expect(sidebar).toHaveClass('translate-x-0')
      // Check that Home link exists within the sidebar
      const sidebarNav = sidebar?.querySelector('nav')
      expect(sidebarNav).toBeInTheDocument()
    })

    it('closes sidebar when navigation link is clicked', async () => {
      const user = userEvent.setup()
      render(<Header />)

      // Open sidebar
      await user.click(screen.getByRole('button', { name: /open menu/i }))
      expect(document.querySelector('aside')).toHaveClass('translate-x-0')

      // Click a link in the sidebar (find link inside aside)
      const sidebarLinks = document
        .querySelector('aside')
        ?.querySelectorAll('a')
      expect(sidebarLinks).toBeDefined()
      await user.click(sidebarLinks![0])

      expect(document.querySelector('aside')).toHaveClass('-translate-x-full')
    })
  })

  describe('footer', () => {
    it('renders footer text in sidebar', async () => {
      const user = userEvent.setup()
      render(<Header />)

      await user.click(screen.getByRole('button', { name: /open menu/i }))

      expect(screen.getByText('Memtime Hierarchy Viewer')).toBeInTheDocument()
    })
  })
})
