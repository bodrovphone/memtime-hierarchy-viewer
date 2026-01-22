import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Home,
  Menu,
  X,
  Network,
  Clock,
} from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinkClass = `
    flex items-center gap-3 p-3 rounded-lg
    hover:bg-gray-800 transition-colors mb-1
  `

  const navLinkActiveClass = `
    flex items-center gap-3 p-3 rounded-lg
    bg-blue-600 hover:bg-blue-700 transition-colors mb-1
  `

  return (
    <>
      <header className="px-4 py-3 flex items-center justify-between bg-slate-900 text-white shadow-lg border-b border-slate-800">
        <div className="flex items-center">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
          <Link to="/" className="ml-3 flex items-center gap-2">
            <Clock size={24} className="text-blue-400" />
            <span className="text-lg font-semibold">Memtime Viewer</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/"
            className="px-3 py-2 text-sm rounded-lg hover:bg-slate-800 transition-colors"
            activeProps={{ className: 'px-3 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors' }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/hierarchy"
            className="px-3 py-2 text-sm rounded-lg hover:bg-slate-800 transition-colors"
            activeProps={{ className: 'px-3 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors' }}
          >
            Hierarchy
          </Link>
          <Link
            to="/time-entries"
            className="px-3 py-2 text-sm rounded-lg hover:bg-slate-800 transition-colors"
            activeProps={{ className: 'px-3 py-2 text-sm rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors' }}
          >
            Time Entries
          </Link>
        </nav>
      </header>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-72 bg-slate-900 text-white
          shadow-2xl z-50 transform transition-transform duration-300 ease-in-out
          flex flex-col border-r border-slate-800
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock size={24} className="text-blue-400" />
            <span className="text-lg font-semibold">Memtime Viewer</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={navLinkClass}
            activeProps={{ className: navLinkActiveClass }}
            activeOptions={{ exact: true }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          <Link
            to="/hierarchy"
            onClick={() => setIsOpen(false)}
            className={navLinkClass}
            activeProps={{ className: navLinkActiveClass }}
          >
            <Network size={20} />
            <span className="font-medium">Hierarchy</span>
          </Link>

          <Link
            to="/time-entries"
            onClick={() => setIsOpen(false)}
            className={navLinkClass}
            activeProps={{ className: navLinkActiveClass }}
          >
            <Clock size={20} />
            <span className="font-medium">Time Entries</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
          Memtime Hierarchy Viewer
        </div>
      </aside>
    </>
  )
}
