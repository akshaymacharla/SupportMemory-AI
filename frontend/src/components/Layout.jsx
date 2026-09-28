import { NavLink, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Brain,
  FlaskConical,
  Zap,
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/customers', icon: Users, label: 'Customers' },
  { to: '/memory', icon: Brain, label: 'Memory' },
  { to: '/demo', icon: FlaskConical, label: 'Demo' },
]

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-900">
      {/* Sidebar */}
      <aside className="w-64 flex flex-col border-r border-white/5 bg-surface-850">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center glow-primary">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">SupportMemory</h1>
              <p className="text-[10px] font-medium text-primary-400 uppercase tracking-widest">AI</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-500/15 text-primary-300 border border-primary-500/20'
                    : 'text-surface-200/60 hover:text-white hover:bg-white/5 border border-transparent'
                }`
              }
            >
              <Icon className="w-4.5 h-4.5 shrink-0" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-white/5">
          <div className="glass-card p-3 rounded-xl">
            <p className="text-[11px] font-medium text-primary-400 mb-1">Powered by</p>
            <p className="text-sm font-semibold text-white">Hindsight Memory</p>
            <p className="text-[10px] text-surface-200/50 mt-1">Agent memory that learns</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
