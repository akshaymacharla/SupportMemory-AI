import { useState, useEffect } from 'react'
import { Users, Plus, Building2, Crown, UsersRound, X } from 'lucide-react'
import { getCustomers, createCustomer } from '../services/api'

const INITIAL_CUSTOMERS = [
  { id: 'rahul-123', name: 'Rahul', email: 'rahul@acmetech.com', company: 'Acme Technologies', plan: 'Pro', teamSize: 20, createdAt: '2024-01-15' },
  { id: 'sarah-456', name: 'Sarah', email: 'sarah@techflow.com', company: 'TechFlow Inc', plan: 'Business', teamSize: 50, createdAt: '2024-02-20' },
]

export default function Customers() {
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', plan: 'Pro', teamSize: 10 })

  useEffect(() => {
    getCustomers().then(data => {
      if (data && data.length > 0) {
        setCustomers(data)
      }
    }).catch(err => console.log('Using baseline customers', err))
  }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    const newCustomer = {
      ...form,
      id: `${form.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      teamSize: parseInt(form.teamSize),
      createdAt: new Date().toISOString().split('T')[0],
    }
    try {
      await createCustomer(newCustomer)
    } catch (err) {
      console.log('Saved locally:', err)
    }
    setCustomers(prev => [...prev, newCustomer])
    setForm({ name: '', email: '', company: '', plan: 'Pro', teamSize: 10 })
    setShowForm(false)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Customers</h1>
          <p className="text-surface-200/50 text-sm">Manage customer profiles</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium hover:from-primary-400 hover:to-primary-500 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Add Customer Form */}
      {showForm && (
        <div className="glass-card p-6 mb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">New Customer</h3>
            <button onClick={() => setShowForm(false)} className="text-surface-200/40 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Name" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-surface-200/30 focus:outline-none focus:border-primary-500/40" />
            <input type="email" placeholder="Email" required value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-surface-200/30 focus:outline-none focus:border-primary-500/40" />
            <input type="text" placeholder="Company" required value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-surface-200/30 focus:outline-none focus:border-primary-500/40" />
            <select value={form.plan} onChange={e => setForm(p => ({ ...p, plan: e.target.value }))}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white focus:outline-none focus:border-primary-500/40">
              <option value="Free">Free</option>
              <option value="Pro">Pro</option>
              <option value="Business">Business</option>
              <option value="Enterprise">Enterprise</option>
            </select>
            <input type="number" placeholder="Team Size" value={form.teamSize} onChange={e => setForm(p => ({ ...p, teamSize: e.target.value }))}
              className="px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-sm text-white placeholder-surface-200/30 focus:outline-none focus:border-primary-500/40" />
            <button type="submit" className="px-4 py-2.5 rounded-xl bg-primary-600 text-white text-sm font-medium hover:bg-primary-500 transition-colors">
              Create Customer
            </button>
          </form>
        </div>
      )}

      {/* Customer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customers.map((customer, i) => (
          <div key={customer.id} className="glass-card glass-card-hover p-5 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-lg font-bold text-white shrink-0">
                {customer.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-white">{customer.name}</h3>
                <p className="text-xs text-surface-200/40 mb-3">{customer.email}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-surface-200/60">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span>{customer.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-surface-200/60">
                    <Crown className="w-3.5 h-3.5 shrink-0" />
                    <span className="px-2 py-0.5 rounded bg-primary-500/15 text-primary-300 font-medium">{customer.plan}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-surface-200/60">
                    <UsersRound className="w-3.5 h-3.5 shrink-0" />
                    <span>{customer.teamSize} employees</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
