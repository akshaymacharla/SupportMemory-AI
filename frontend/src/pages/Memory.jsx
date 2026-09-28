import { useState, useEffect } from 'react'
import {
  Brain,
  Database,
  Search,
  Activity,
  User,
  Building2,
  Calendar,
  Wrench,
  CheckCircle2,
  XCircle,
  RefreshCw,
} from 'lucide-react'
import { getMemories, getMemoryEvents } from '../services/api'

const MOCK_MEMORIES = [
  { text: 'Rahul works at Acme Technologies', type: 'world', entities: ['Rahul', 'Acme Technologies'] },
  { text: 'Acme Technologies is on the Pro plan with 20 employees', type: 'world', entities: ['Acme Technologies'] },
  { text: 'Rahul uses Google Calendar integration', type: 'world', entities: ['Rahul', 'Google Calendar'] },
  { text: 'Acme Technologies uses Google Workspace', type: 'world', entities: ['Acme Technologies', 'Google Workspace'] },
  { text: 'Rahul reported Google Calendar integration not working', type: 'experience', entities: ['Rahul', 'Google Calendar'] },
  { text: 'OAuth permissions were identified as the root cause of the Google Calendar issue', type: 'world', entities: ['OAuth', 'Google Calendar'] },
  { text: 'OAuth reauthorization resolved the Google Calendar integration issue', type: 'world', entities: ['OAuth', 'Google Calendar'] },
]

const MOCK_EVENTS = [
  { id: 1, type: 'RETAIN', summary: 'Customer profile: Rahul, Acme Technologies, Pro plan, 20 employees', timestamp: '2024-01-15T10:30:00Z', customer: 'Rahul' },
  { id: 2, type: 'RETAIN', summary: 'Uses Google Calendar integration', timestamp: '2024-01-15T10:31:00Z', customer: 'Rahul' },
  { id: 3, type: 'RETAIN', summary: 'Google Calendar integration reported as not working', timestamp: '2024-01-15T10:32:00Z', customer: 'Rahul' },
  { id: 4, type: 'RECALL', summary: 'Retrieved Rahul profile and Google Calendar context', timestamp: '2024-01-16T14:00:00Z', customer: 'Rahul' },
  { id: 5, type: 'RETAIN', summary: 'OAuth permissions identified as root cause', timestamp: '2024-01-16T14:05:00Z', customer: 'Rahul' },
  { id: 6, type: 'RETAIN', summary: 'OAuth reauthorization resolved the issue', timestamp: '2024-01-16T14:10:00Z', customer: 'Rahul' },
  { id: 7, type: 'RECALL', summary: 'Retrieved full history: Google Calendar, OAuth, previous solution', timestamp: '2024-01-17T09:00:00Z', customer: 'Rahul' },
]

const typeIcons = {
  world: { icon: Building2, color: 'text-blue-400 bg-blue-500/15 border-blue-500/20' },
  experience: { icon: Calendar, color: 'text-purple-400 bg-purple-500/15 border-purple-500/20' },
  observation: { icon: Brain, color: 'text-accent-400 bg-accent-500/15 border-accent-500/20' },
}

export default function Memory() {
  const [tab, setTab] = useState('memories')
  const [memories, setMemories] = useState(MOCK_MEMORIES)
  const [events, setEvents] = useState(MOCK_EVENTS)
  const [isLoading, setIsLoading] = useState(false)

  const fetchLiveMemories = async () => {
    setIsLoading(true)
    try {
      const liveMems = await getMemories('rahul-123')
      if (liveMems && liveMems.length > 0) {
        setMemories(liveMems.map(m => ({
          text: m.text || m.content,
          type: m.type || 'world',
          entities: m.entities || []
        })))
      }
      const liveEvents = await getMemoryEvents('rahul-123')
      if (liveEvents && liveEvents.length > 0) {
        setEvents(liveEvents.map(e => ({
          id: e.id,
          type: e.type,
          summary: e.summary,
          timestamp: e.timestamp,
          customer: e.customerId === 'rahul-123' ? 'Rahul' : e.customerId
        })))
      }
    } catch (e) {
      console.log('Using baseline memories', e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLiveMemories()
  }, [])

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Memory Dashboard</h1>
          <p className="text-surface-200/50 text-sm">Explore what SupportMemory AI has learned through Hindsight</p>
        </div>
        <button
          onClick={fetchLiveMemories}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-xs text-white transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Customer Context */}
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-lg font-bold text-white">R</div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-white">Rahul</h3>
            <p className="text-xs text-surface-200/40">Acme Technologies</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center"><p className="text-xl font-bold text-white">{memories.length}</p><p className="text-[10px] text-surface-200/40">Memories</p></div>
            <div className="text-center"><p className="text-xl font-bold text-white">{events.filter(e => e.type === 'RETAIN').length}</p><p className="text-[10px] text-surface-200/40">Retained</p></div>
            <div className="text-center"><p className="text-xl font-bold text-white">{events.filter(e => e.type === 'RECALL').length}</p><p className="text-[10px] text-surface-200/40">Recalled</p></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 bg-white/[0.03] rounded-xl w-fit border border-white/5">
        {[
          { id: 'memories', label: 'Stored Memories', icon: Database },
          { id: 'activity', label: 'Memory Activity', icon: Activity },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id ? 'bg-primary-500/20 text-primary-300 border border-primary-500/20' : 'text-surface-200/50 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'memories' ? (
        <div className="space-y-3">
          {memories.map((memory, i) => {
            const typeInfo = typeIcons[memory.type] || typeIcons.world
            const TypeIcon = typeInfo.icon
            return (
              <div key={i} className="glass-card p-4 animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${typeInfo.color}`}>
                    <TypeIcon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-surface-100">{memory.text}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${typeInfo.color}`}>{memory.type}</span>
                      {memory.entities?.map((e, j) => (
                        <span key={j} className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/5 text-surface-200/50 border border-white/10">{e}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, i) => (
            <div key={event.id} className="flex items-start gap-4 glass-card p-4 animate-fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
              <div className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                event.type === 'RETAIN' ? 'bg-accent-500/15 text-accent-400 border border-accent-500/20' : 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
              }`}>{event.type}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-surface-100">{event.summary}</p>
                <p className="text-xs text-surface-200/30 mt-1">
                  <span className="text-primary-400/60">{event.customer}</span> · {new Date(event.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
