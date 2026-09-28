import { useState, useEffect } from 'react'
import {
  Users,
  MessageSquare,
  Brain,
  ArrowUpRight,
  Activity,
  Database,
  Search,
  Sparkles,
} from 'lucide-react'
import { getDashboardStats, getMemoryEvents } from '../services/api'

const MOCK_STATS = {
  totalCustomers: 3,
  totalConversations: 12,
  memoriesRetained: 24,
  memoriesRecalled: 18,
  memoryEnhancedChats: 8,
}

const MOCK_ACTIVITY = [
  { id: 1, type: 'RETAIN', summary: 'Customer uses Google Calendar integration', customer: 'Rahul', time: '2 min ago' },
  { id: 2, type: 'RECALL', summary: 'Retrieved previous Google Calendar context', customer: 'Rahul', time: '5 min ago' },
  { id: 3, type: 'RETAIN', summary: 'OAuth permissions caused the previous issue', customer: 'Rahul', time: '12 min ago' },
  { id: 4, type: 'RETAIN', summary: 'Company Acme Technologies, Pro plan, 20 employees', customer: 'Rahul', time: '15 min ago' },
]

function StatCard({ icon: Icon, label, value, trend, color }) {
  const colorMap = {
    primary: 'from-primary-500/20 to-primary-600/10 border-primary-500/20 text-primary-400',
    accent: 'from-accent-500/20 to-accent-600/10 border-accent-500/20 text-accent-400',
    warning: 'from-warning-400/20 to-warning-500/10 border-warning-400/20 text-warning-400',
    blue: 'from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400',
  }

  return (
    <div className={`glass-card glass-card-hover p-5 transition-all duration-300`}>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorMap[color]} border flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {trend && (
          <span className="flex items-center gap-1 text-xs font-medium text-accent-400">
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-surface-200/50">{label}</p>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(MOCK_STATS)
  const [activity, setActivity] = useState(MOCK_ACTIVITY)

  useEffect(() => {
    getDashboardStats()
      .then((data) => {
        if (data) setStats(data)
      })
      .catch((err) => console.log('Using default dashboard stats', err))

    getMemoryEvents()
      .then((events) => {
        if (events && events.length > 0) {
          setActivity(
            events.map((e) => ({
              id: e.id,
              type: e.type,
              summary: e.summary,
              customer: e.customerId === 'rahul-123' ? 'Rahul' : e.customerId,
              time: new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }))
          )
        }
      })
      .catch((err) => console.log('Using default activity', err))
  }, [])

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-surface-200/50 text-sm">
          Monitor your AI support agent's memory and performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Users}
          label="Total Customers"
          value={stats.totalCustomers}
          color="primary"
        />
        <StatCard
          icon={MessageSquare}
          label="Conversations"
          value={stats.totalConversations}
          trend="+3 today"
          color="blue"
        />
        <StatCard
          icon={Database}
          label="Memories Retained"
          value={stats.memoriesRetained}
          trend="+6 today"
          color="accent"
        />
        <StatCard
          icon={Search}
          label="Memories Recalled"
          value={stats.memoriesRecalled}
          color="warning"
        />
      </div>

      {/* Memory Highlight Banner */}
      <div className="glass-card p-6 mb-8 relative overflow-hidden border border-primary-500/20">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="flex items-center gap-4 relative">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-1">
              Hindsight Memory Engine Active
            </h3>
            <p className="text-sm text-surface-200/60 max-w-2xl">
              SupportMemory AI continuously extracts entities, preferences, and resolution patterns
              across customer interactions. Long-term memory enables zero-repetition support.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary-400" />
            <h2 className="text-lg font-semibold text-white">Recent Memory Activity</h2>
          </div>
          <span className="text-xs text-surface-200/40">Live Hindsight stream</span>
        </div>

        <div className="glass-card divide-y divide-white/5 overflow-hidden">
          {activity.map((item) => (
            <div
              key={item.id}
              className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${
                    item.type === 'RETAIN'
                      ? 'bg-accent-500/15 text-accent-400 border border-accent-500/20'
                      : 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                  }`}
                >
                  {item.type}
                </span>
                <span className="text-sm text-surface-100">{item.summary}</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-surface-200/40">
                <span className="text-primary-400/80 font-medium">{item.customer}</span>
                <span>{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
