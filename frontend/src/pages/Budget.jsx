import { useState, useEffect } from 'react'
import { Edit3, Check, X } from 'lucide-react'
import { budgetService } from '../services/api'

const fmt = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n)

export default function Budget() {
  const [budget, setBudget] = useState(null)
  const [editing, setEditing] = useState(false)
  const [newLimit, setNewLimit] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    try {
      const r = await budgetService.get()
      setBudget(r.data)
      setNewLimit(r.data.monthlyLimit.toString())
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!newLimit || parseFloat(newLimit) <= 0) return
    setSaving(true)
    try { await budgetService.update(parseFloat(newLimit)); setEditing(false); load() }
    catch (e) { console.error(e) }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const pct = budget.percentage || 0
  const pctColor = pct >= 90 ? '#ef4444' : pct >= 75 ? '#f59e0b' : '#10b981'
  const pctBg    = pct >= 90 ? 'bg-rose-500' : pct >= 75 ? 'bg-amber-400' : 'bg-emerald-500'

  const segments = [
    { label: 'Zorunlu Giderler', amount: budget.necessary || 0, color: '#3b82f6', emoji: '🏠',
      pct: budget.monthlyLimit > 0 ? Math.min(100, (budget.necessary / budget.monthlyLimit) * 100) : 0 },
    { label: 'Lüks Harcamalar',  amount: budget.luxury || 0,    color: '#f97316', emoji: '✨',
      pct: budget.monthlyLimit > 0 ? Math.min(100, (budget.luxury / budget.monthlyLimit) * 100) : 0 },
  ]

  const statusMsg = pct >= 90
    ? { msg: '🚨 Bütçenizin sonuna yaklaştınız! Harcamaları acil azaltın.', cls: 'bg-rose-500/10 border-rose-500/30 text-rose-300' }
    : pct >= 75
    ? { msg: '⚠️ Bütçenizin büyük kısmını kullandınız. Dikkatli devam edin.', cls: 'bg-amber-500/10 border-amber-500/30 text-amber-300' }
    : { msg: '✅ Bütçe durumunuz sağlıklı görünüyor. Tasarrufa devam!', cls: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' }

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl lg:text-3xl font-black text-white">Bütçe Yönetimi</h2>
        <p className="text-gray-400 text-xs lg:text-sm mt-1">Aylık harcama limitinizi takip edin ve düzenleyin</p>
      </div>

      {/* Main Card */}
      <div className="glass-card p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-gray-400 text-sm mb-1">Aylık Bütçe Limiti</p>
            {editing ? (
              <div className="flex items-center gap-2 mt-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₺</span>
                  <input id="input-budget-limit" type="number" value={newLimit}
                    onChange={e => setNewLimit(e.target.value)}
                    className="bg-gray-800 border border-purple-500 text-white rounded-xl pl-8 pr-4 py-2 text-xl font-bold w-44 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
                    autoFocus />
                </div>
                <button id="btn-save-budget" onClick={handleSave} disabled={saving}
                  className="p-2.5 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20 transition-all">
                  <Check size={16} />
                </button>
                <button id="btn-cancel-budget" onClick={() => setEditing(false)}
                  className="p-2.5 text-gray-400 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mt-1">
                <p className="text-3xl font-black text-white">{fmt(budget.monthlyLimit)}</p>
                <button id="btn-edit-budget" onClick={() => setEditing(true)}
                  className="p-1.5 text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-all">
                  <Edit3 size={14} />
                </button>
              </div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-gray-400 text-sm mb-1">Kullanılan</p>
            <p className="text-3xl lg:text-4xl font-black" style={{ color: pctColor }}>%{pct.toFixed(0)}</p>
          </div>
        </div>

        {/* Progress */}
        <div className="h-5 bg-gray-800 rounded-full overflow-hidden mb-2">
          <div className={`h-full ${pctBg} rounded-full transition-all duration-1000`}
               style={{ width: `${Math.min(100, pct)}%` }} />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Harcanan: <span className="text-white font-semibold">{fmt(budget.totalExpenses)}</span></span>
          <span className="text-gray-400">Kalan: <span className={`font-semibold ${budget.remaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{fmt(budget.remaining)}</span></span>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {segments.map(seg => (
          <div key={seg.label} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{seg.emoji}</span>
              <p className="text-white font-semibold text-sm">{seg.label}</p>
            </div>
            <p className="text-2xl font-black text-white mb-1">{fmt(seg.amount)}</p>
            <p className="text-gray-500 text-xs mb-3">Bütçenin %{seg.pct.toFixed(0)}'i</p>
            <div className="h-2 bg-gray-800 rounded-full">
              <div className="h-full rounded-full transition-all duration-700"
                   style={{ width: `${seg.pct}%`, backgroundColor: seg.color }} />
            </div>
          </div>
        ))}
      </div>

      {/* Status */}
      <div className={`rounded-2xl p-4 border font-medium text-sm ${statusMsg.cls}`}>
        {statusMsg.msg}
      </div>

      {/* 50/30/20 */}
      <div className="glass-card p-5">
        <h3 className="text-white font-bold mb-4">50 / 30 / 20 Kuralı Hedefi</h3>
        <div className="space-y-3">
          {[
            { label: 'İhtiyaçlar (%50)', target: budget.monthlyLimit * 0.5, color: '#3b82f6' },
            { label: 'İstekler (%30)',   target: budget.monthlyLimit * 0.3, color: '#f97316' },
            { label: 'Tasarruf (%20)',   target: budget.monthlyLimit * 0.2, color: '#10b981' },
          ].map(({ label, target, color }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{label}</span>
              <span className="font-semibold text-white">{fmt(target)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
