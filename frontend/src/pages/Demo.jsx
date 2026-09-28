import { useState } from 'react'
import {
  FlaskConical,
  Brain,
  BrainCog,
  Send,
  Loader2,
  Bot,
  RotateCcw,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Clock,
  AlertCircle,
} from 'lucide-react'
import { sendMessage, resetDemo } from '../services/api'

const TIMELINE_STEPS = [
  { step: 1, title: 'Customer Introduction', description: 'Agent learns customer profile', query: "My name is Rahul. I work at Acme Technologies. We have around 20 employees and we're using the Pro plan. Our Google Calendar integration isn't working.", learned: ['Customer: Rahul', 'Company: Acme Technologies', 'Plan: Pro', 'Team: 20', 'Uses Google Calendar', 'Calendar issue reported'] },
  { step: 2, title: 'Follow-up Issue', description: 'Agent recalls previous context', query: "My Google Calendar is still not working.", learned: ['Ongoing Calendar issue'] },
  { step: 3, title: 'Root Cause Identified', description: 'Agent learns the real problem', query: "The previous solution didn't work. The actual problem was OAuth permissions.", learned: ['Previous solution failed', 'Root cause: OAuth permissions'] },
  { step: 4, title: 'Issue Recurs', description: 'Agent uses full history', query: "My calendar is broken again.", learned: ['Pattern: recurring Calendar issue'] },
]

export default function Demo() {
  const [activeStep, setActiveStep] = useState(0)
  const [withMemoryResponse, setWithMemoryResponse] = useState('')
  const [withoutMemoryResponse, setWithoutMemoryResponse] = useState('')
  const [isLoadingWith, setIsLoadingWith] = useState(false)
  const [isLoadingWithout, setIsLoadingWithout] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [completedSteps, setCompletedSteps] = useState(new Set())
  const [demoCustomerId, setDemoCustomerId] = useState('demo-rahul')
  const [resetStatus, setResetStatus] = useState(null) // { type: 'loading' | 'success' | 'error', message: string }

  const runStep = async (stepIndex) => {
    if (isResetting) return
    const step = TIMELINE_STEPS[stepIndex]
    setActiveStep(stepIndex)
    setWithMemoryResponse('')
    setWithoutMemoryResponse('')

    // Run WITHOUT memory
    setIsLoadingWithout(true)
    try {
      const noMemResult = await sendMessage(demoCustomerId, step.query, false)
      setWithoutMemoryResponse(noMemResult.message)
    } catch (e) {
      setWithoutMemoryResponse('Error: Could not generate response without memory.')
    }
    setIsLoadingWithout(false)

    // Run WITH memory
    setIsLoadingWith(true)
    try {
      const memResult = await sendMessage(demoCustomerId, step.query, true)
      setWithMemoryResponse(memResult.message)
    } catch (e) {
      setWithMemoryResponse('Error: Could not generate response with memory.')
    }
    setIsLoadingWith(false)

    setCompletedSteps(prev => new Set([...prev, stepIndex]))
  }

  const handleReset = async () => {
    setIsResetting(true)
    setResetStatus({ type: 'loading', message: 'Resetting demo...' })
    try {
      const res = await resetDemo(demoCustomerId)
      if (res && res.demoCustomerId) {
        setDemoCustomerId(res.demoCustomerId)
      }
      setCompletedSteps(new Set())
      setActiveStep(0)
      setWithMemoryResponse('')
      setWithoutMemoryResponse('')
      setResetStatus({ type: 'success', message: 'Demo reset successfully' })
      setTimeout(() => setResetStatus(null), 4000)
    } catch (e) {
      console.error('Reset failed:', e)
      setResetStatus({ type: 'error', message: 'Failed to reset demo: ' + (e.message || 'Server error') })
      setTimeout(() => setResetStatus(null), 5000)
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Demo: Before vs After</h1>
          <p className="text-surface-200/50 text-sm max-w-2xl">
            See the difference Hindsight memory makes. Run each step to watch the agent learn and improve over time.
          </p>
        </div>
        <button
          onClick={handleReset}
          disabled={isResetting || isLoadingWith || isLoadingWithout}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-danger-500/15 text-danger-400 border border-danger-500/20 text-sm font-medium hover:bg-danger-500/25 transition-all disabled:opacity-50"
        >
          <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
          {isResetting ? 'Resetting...' : 'Reset Demo'}
        </button>
      </div>

      {/* Reset Feedback Notification */}
      {resetStatus && (
        <div className={`p-4 mb-6 rounded-xl border flex items-center justify-between animate-fade-in ${
          resetStatus.type === 'loading'
            ? 'bg-primary-500/10 border-primary-500/20 text-primary-300'
            : resetStatus.type === 'success'
            ? 'bg-accent-500/10 border-accent-500/20 text-accent-400'
            : 'bg-danger-500/10 border-danger-500/20 text-danger-400'
        }`}>
          <div className="flex items-center gap-3">
            {resetStatus.type === 'loading' && <Loader2 className="w-5 h-5 animate-spin text-primary-400" />}
            {resetStatus.type === 'success' && <CheckCircle2 className="w-5 h-5 text-accent-400" />}
            {resetStatus.type === 'error' && <AlertCircle className="w-5 h-5 text-danger-400" />}
            <div>
              <p className="text-sm font-semibold">{resetStatus.message}</p>
              {resetStatus.type === 'success' && (
                <p className="text-xs text-surface-200/60 mt-0.5">Timeline returned to Step 1. Hindsight memory isolated for fresh demo run.</p>
              )}
            </div>
          </div>
          {resetStatus.type === 'success' && (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-accent-500/15 border border-accent-500/25">
              Fresh Session: {demoCustomerId.substring(0, 18)}
            </span>
          )}
        </div>
      )}

      {/* Learning Timeline */}
      <div className="glass-card p-6 mb-8">
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-4 h-4 text-primary-400" />
          <h2 className="text-base font-semibold text-white">Learning Timeline</h2>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2">
          {TIMELINE_STEPS.map((step, i) => {
            const isCompleted = completedSteps.has(i)
            const isActive = activeStep === i
            return (
              <button
                key={i}
                onClick={() => runStep(i)}
                disabled={isLoadingWith || isLoadingWithout}
                className={`flex-shrink-0 w-56 p-4 rounded-xl border transition-all text-left ${
                  isActive
                    ? 'bg-primary-500/15 border-primary-500/30 ring-1 ring-primary-500/20'
                    : isCompleted
                    ? 'bg-accent-500/5 border-accent-500/20 hover:border-accent-500/30'
                    : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                } disabled:opacity-50`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCompleted ? 'bg-accent-500 text-white' : isActive ? 'bg-primary-500 text-white' : 'bg-surface-700 text-surface-200/50'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.step}
                  </div>
                  <span className="text-xs font-semibold text-white">{step.title}</span>
                </div>
                <p className="text-[11px] text-surface-200/40 mb-2">{step.description}</p>
                {isCompleted && (
                  <div className="flex flex-wrap gap-1">
                    {step.learned.slice(0, 3).map((l, j) => (
                      <span key={j} className="px-1.5 py-0.5 rounded text-[9px] bg-accent-500/10 text-accent-400 border border-accent-500/15">{l}</span>
                    ))}
                    {step.learned.length > 3 && <span className="text-[9px] text-surface-200/30">+{step.learned.length - 3} more</span>}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Before / After Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* WITHOUT Memory */}
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2 bg-danger-500/5">
            <XCircle className="w-4 h-4 text-danger-400" />
            <h3 className="text-sm font-semibold text-danger-400">WITHOUT Memory</h3>
          </div>
          <div className="p-5">
            <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-[10px] font-bold text-surface-200/30 uppercase tracking-wider mb-1">User Message</p>
              <p className="text-sm text-surface-200/60">{TIMELINE_STEPS[activeStep]?.query || 'Select a step'}</p>
            </div>
            <div className="min-h-[120px]">
              {isLoadingWithout ? (
                <div className="flex items-center gap-2 text-surface-200/40">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Generating without memory...</span>
                </div>
              ) : withoutMemoryResponse ? (
                <div className="p-3 rounded-xl bg-danger-500/5 border border-danger-500/10">
                  <p className="text-sm text-surface-100 leading-relaxed whitespace-pre-wrap">{withoutMemoryResponse}</p>
                </div>
              ) : (
                <p className="text-sm text-surface-200/20 italic">Click a timeline step to compare</p>
              )}
            </div>
          </div>
        </div>

        {/* WITH Hindsight */}
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-3 border-b border-white/5 flex items-center gap-2 bg-accent-500/5">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <h3 className="text-sm font-semibold text-accent-400">WITH Hindsight Memory</h3>
          </div>
          <div className="p-5">
            <div className="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
              <p className="text-[10px] font-bold text-surface-200/30 uppercase tracking-wider mb-1">User Message</p>
              <p className="text-sm text-surface-200/60">{TIMELINE_STEPS[activeStep]?.query || 'Select a step'}</p>
            </div>
            <div className="min-h-[120px]">
              {isLoadingWith ? (
                <div className="flex items-center gap-2 text-primary-400">
                  <Brain className="w-4 h-4 memory-pulse" />
                  <span className="text-sm">Recalling memory & generating...</span>
                </div>
              ) : withMemoryResponse ? (
                <div className="p-3 rounded-xl bg-accent-500/5 border border-accent-500/10">
                  <p className="text-sm text-surface-100 leading-relaxed whitespace-pre-wrap">{withMemoryResponse}</p>
                  <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-accent-500/10">
                    <Brain className="w-3 h-3 text-accent-400" />
                    <span className="text-[10px] text-accent-400 font-medium">Hindsight-enhanced response</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-surface-200/20 italic">Click a timeline step to compare</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
