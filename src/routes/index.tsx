import { createFileRoute, Link } from '@tanstack/react-router'
import { Clock, Building2, FolderOpen, Timer, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero Section */}
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10"></div>
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Clock className="w-16 h-16 text-blue-400" />
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Memtime{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Viewer
              </span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-4">
            Time tracking made simple
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            Browse your organization hierarchy, view time entries, and manage
            your work records with ease.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/hierarchy"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              View Hierarchy
            </Link>
            <Link
              to="/time-entries"
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Timer className="w-5 h-5" />
              Time Entries
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-white text-center mb-12">
          Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Building2 className="w-10 h-10 text-blue-400" />}
            title="Organization Hierarchy"
            description="Browse clients, projects, and tasks in an expandable tree view with lazy loading."
            link="/hierarchy"
          />
          <FeatureCard
            icon={<FolderOpen className="w-10 h-10 text-green-400" />}
            title="Time Entries"
            description="View all your time tracking records in a paginated table with sorting."
            link="/time-entries"
          />
          <FeatureCard
            icon={<Timer className="w-10 h-10 text-purple-400" />}
            title="Track Time"
            description="Create and edit time entries with an intuitive form interface."
            link="/time-entries/new"
          />
        </div>
      </section>

      {/* Quick Stats */}
      <section className="py-12 px-6 border-t border-slate-700/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            Built with TanStack Start, React 19, and Tailwind CSS
          </p>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  link,
}: {
  icon: React.ReactNode
  title: string
  description: string
  link: string
}) {
  return (
    <Link
      to={link}
      className="group bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed mb-4">{description}</p>
      <span className="text-blue-400 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
        Explore <ArrowRight className="w-4 h-4" />
      </span>
    </Link>
  )
}
