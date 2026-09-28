import { useState, useRef, useEffect } from 'react'
import {
  Send,
  Brain,
  User,
  Bot,
  Loader2,
  CheckCircle2,
  Search,
  Database,
  Sparkles,
  AlertCircle,
  ChevronDown,
} from 'lucide-react'
import { sendMessage } from '../services/api'

const DEMO_CUSTOMERS = [
  { id: 'rahul-123', name: 'Rahul', company: 'Acme Technologies', plan: 'Pro', teamSize: 20 },
  { id: 'sarah-456', name: 'Sarah', company: 'TechFlow Inc', plan: 'Business', teamSize: 50 },
]

const MEMORY_STATES = {
  idle: null,
  recalling: { icon: Search, text: 'Recalling memory...', color: 'text-primary-400' },
  found: { icon: CheckCircle2, text: 'Memory found', color: 'text-accent-400' },
  generating: { icon: Sparkles, text: 'Generating response...', color: 'text-primary-400' },
  retaining: { icon: Database, text: 'Retaining memory...', color: 'text-warning-400' },
  saved: { icon: CheckCircle2, text: 'Memory saved', color: 'text-accent-400' },
  error: { icon: AlertCircle, text: 'Memory unavailable', color: 'text-danger-400' },
}

export default function Chat() {
  const [selectedCustomer, setSelectedCustomer] = useState(DEMO_CUSTOMERS[0])
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [memoryState, setMemoryState] = useState('idle')
  const [recalledMemories, setRecalledMemories] = useState([])
  const [showMemoryPanel, setShowMemoryPanel] = useState(true)
  const [customerDropdown, setCustomerDropdown] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const simulateMemoryStates = async () => {
    setMemoryState('recalling')
    await new Promise(r => setTimeout(r, 800))
    setMemoryState('found')
    await new Promise(r => setTimeout(r, 400))
    setMemoryState('generating')
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = { role: 'user', content: input.trim(), timestamp: new Date().toISOString() }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      await simulateMemoryStates()

      const response = await sendMessage(selectedCustomer.id, userMessage.content, true)

      setMemoryState('retaining')
      await new Promise(r => setTimeout(r, 500))
      setMemoryState('saved')

      const aiMessage = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        memoryUsed: response.memoryUsed,
        memoriesRecalled: response.memoriesRecalled || [],
      }

      setMessages(prev => [...prev, aiMessage])
      setRecalledMemories(response.memoriesRecalled || [])

      setTimeout(() => setMemoryState('idle'), 2000)
    } catch (error) {
      setMemoryState('error')
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I\'m experiencing technical difficulties. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true,
      }])
      setTimeout(() => setMemoryState('idle'), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  const memState = MEMORY_STATES[memoryState]

  return (
    <div className="flex h-full">
      {/* Left Panel — Customer Profile */}
      <div className="w-72 border-r border-white/5 bg-surface-850 flex flex-col">
        <div className="p-4 border-b border-white/5">
          <p className="text-[10px] font-bold text-surface-200/40 uppercase tracking-widest mb-3">Customer</p>

          {/* Customer Selector */}
          <div className="relative">
            <button
              onClick={() => setCustomerDropdown(!customerDropdown)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-primary-500/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xs font-bold text-white">
                  {selectedCustomer.name[0]}
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-white">{selectedCustomer.name}</p>
                  <p className="text-[10px] text-surface-200/40">{selectedCustomer.company}</p>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-surface-200/40" />
            </button>

            {customerDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 glass-card p-1 z-20 border border-white/10">
                {DEMO_CUSTOMERS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => { setSelectedCustomer(c); setCustomerDropdown(false); setMessages([]); setRecalledMemories([]); }}
                    className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-xs font-bold text-white">
                      {c.name[0]}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{c.name}</p>
                      <p className="text-[10px] text-surface-200/40">{c.company}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Customer Details */}
        <div className="p-4 space-y-3 flex-1">
          <DetailRow label="Company" value={selectedCustomer.company} />
          <DetailRow label="Plan" value={selectedCustomer.plan} badge />
          <DetailRow label="Team Size" value={`${selectedCustomer.teamSize} employees`} />
          <DetailRow label="Customer ID" value={selectedCustomer.id} mono />
        </div>

        {/* Memory State Indicator */}
        {memState && (
          <div className="p-4 border-t border-white/5">
            <div className={`flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/[0.03] ${memState.color}`}>
              <memState.icon className="w-4 h-4 shrink-0 memory-pulse" />
              <span className="text-xs font-medium">{memState.text}</span>
            </div>
          </div>
        )}
      </div>

      {/* Center — Chat */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Support Chat</h2>
            <p className="text-xs text-surface-200/40">Chat with {selectedCustomer.name} from {selectedCustomer.company}</p>
          </div>
          <button
            onClick={() => setShowMemoryPanel(!showMemoryPanel)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              showMemoryPanel
                ? 'bg-primary-500/15 text-primary-400 border border-primary-500/20'
                : 'bg-white/5 text-surface-200/50 border border-white/10 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            Memory Inspector
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto px-6 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 border border-primary-500/15 flex items-center justify-center mb-4">
                <Bot className="w-8 h-8 text-primary-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Start a conversation</h3>
              <p className="text-sm text-surface-200/40 max-w-md">
                Send a message as {selectedCustomer.name}. The AI will remember useful information
                and use it in future interactions.
              </p>
              <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-lg">
                {[
                  "My name is Rahul. I work at Acme Technologies. We have around 20 employees and we're using the Pro plan. Our Google Calendar integration isn't working.",
                  "My Google Calendar is still not working.",
                  "The previous solution didn't work. The actual problem was OAuth permissions.",
                  "My calendar is broken again.",
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="px-3 py-2 rounded-xl text-xs text-surface-200/60 bg-white/[0.03] border border-white/5 hover:border-primary-500/30 hover:text-white transition-all text-left"
                  >
                    {suggestion.substring(0, 60)}{suggestion.length > 60 ? '...' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 animate-fade-in ${msg.role === 'user' ? 'justify-end' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`max-w-[70%] ${
                msg.role === 'user'
                  ? 'bg-primary-600/20 border border-primary-500/20 rounded-2xl rounded-br-md px-4 py-3'
                  : `${msg.isError ? 'bg-danger-500/10 border border-danger-500/20' : 'bg-white/[0.04] border border-white/5'} rounded-2xl rounded-bl-md px-4 py-3`
              }`}>
                <p className="text-sm text-surface-100 leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                {msg.memoryUsed && (
                  <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-white/5">
                    <Brain className="w-3 h-3 text-accent-400" />
                    <span className="text-[10px] text-accent-400 font-medium">Memory-enhanced response</span>
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-lg bg-surface-700 flex items-center justify-center shrink-0 mt-1">
                  <User className="w-4 h-4 text-surface-200/60" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-3 animate-fade-in">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/[0.04] border border-white/5 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-primary-400 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-primary-400 typing-dot" />
                  <div className="w-2 h-2 rounded-full bg-primary-400 typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-white/5">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-center gap-3"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Message as ${selectedCustomer.name}...`}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-surface-200/30 focus:outline-none focus:border-primary-500/40 focus:ring-1 focus:ring-primary-500/20 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-11 h-11 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 flex items-center justify-center text-white hover:from-primary-400 hover:to-primary-500 transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
            >
              {isLoading ? <Loader2 className="w-4.5 h-4.5 animate-spin" /> : <Send className="w-4.5 h-4.5" />}
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel — Memory Inspector */}
      {showMemoryPanel && (
        <div className="w-72 border-l border-white/5 bg-surface-850 flex flex-col animate-slide-in-right">
          <div className="p-4 border-b border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <Brain className="w-4 h-4 text-primary-400" />
              <h3 className="text-sm font-semibold text-white">Memory Inspector</h3>
            </div>
            <p className="text-[10px] text-surface-200/40">Real-time Hindsight memory activity</p>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3">
            {recalledMemories.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="w-8 h-8 text-surface-200/20 mx-auto mb-2" />
                <p className="text-xs text-surface-200/30">No memories recalled yet</p>
                <p className="text-[10px] text-surface-200/20 mt-1">Send a message to see memory in action</p>
              </div>
            ) : (
              <>
                <p className="text-[10px] font-bold text-surface-200/40 uppercase tracking-widest">Relevant Memories</p>
                {recalledMemories.map((memory, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white/[0.03] border border-primary-500/10 animate-fade-in"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <CheckCircle2 className="w-3 h-3 text-accent-400" />
                      <span className="text-[10px] font-medium text-accent-400">Recalled</span>
                    </div>
                    <p className="text-xs text-surface-100 leading-relaxed">{memory.text || memory}</p>
                    {memory.type && (
                      <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[9px] font-medium bg-primary-500/10 text-primary-300 border border-primary-500/15">
                        {memory.type}
                      </span>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function DetailRow({ label, value, badge, mono }) {
  return (
    <div>
      <p className="text-[10px] font-medium text-surface-200/30 uppercase tracking-wider mb-1">{label}</p>
      {badge ? (
        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary-500/15 text-primary-300 border border-primary-500/20">
          {value}
        </span>
      ) : (
        <p className={`text-sm ${mono ? 'font-mono text-surface-200/40 text-xs' : 'text-white'}`}>{value}</p>
      )}
    </div>
  )
}
