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
    try { const r = await budgetService.get(); setBudget(r.data); setNewLimit(r.data.monthlyLimit.toString()) }
    catch (e) { console.error(e) }
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
      <div className="w-10 h-10 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const pct = budget.percentage || 0
  const pctColor = pct >= 90 ? '#EF5350' : pct >= 75 ? '#f59e0b' : '#4F46E5'
  const pctBg    = pct >= 90 ? 'bg-red-500' : pct >= 75 ? 'bg-amber-400' : 'bg-[#4F46E5]'

  const segments = [
    { label: 'Zorunlu Giderler', amount: budget.necessary || 0, color: '#3b82f6', emoji: '🏠',
      pct: budget.monthlyLimit > 0 ? Math.min(100, (budget.necessary / budget.monthlyLimit) * 100) : 0 },
    { label: 'Lüks Harcamalar',  amount: budget.luxury || 0,    color: '#22C55E', emoji: '✨',
      pct: budget.monthlyLimit > 0 ? Math.min(100, (budget.luxury / budget.monthlyLimit) * 100) : 0 },
  ]

  const statusMsg = pct >= 90
    ? { msg: '🚨 Bütçenizin sonuna yaklaştınız! Harcamaları acil azaltın.', cls: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' }
    : pct >= 75
    ? { msg: '⚠️ Bütçenizin büyük kısmını kullandınız. Dikkatli devam edin.', cls: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400' }
    : { msg: '✅ Bütçe durumunuz sağlıklı görünüyor. Tasarrufa devam!', cls: 'bg-[#EEF2FF] dark:bg-[#1a1a1a] border-[#A5B4FC] dark:border-[#1e1a4a] text-[#4F46E5] dark:text-[#A5B4FC]' }

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl lg:text-3xl font-black text-[#111827] dark:text-[#EEF2FF]">Bütçe Yönetimi</h2>
        <p className="text-[#6B7280] dark:text-[#A5B4FC] text-xs lg:text-sm mt-1">Aylık harcama limitinizi takip edin ve düzenleyin</p>
      </div>

      <div className="glass-card p-5 lg:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[#6B7280] dark:text-[#A5B4FC] text-sm mb-1">Aylık Bütçe Limiti</p>
            {editing ? (
              <div className="flex items-center gap-2 mt-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280] dark:text-[#A5B4FC] text-sm">₺</span>
                  <input id="input-budget-limit" type="number" value={newLimit}
                    onChange={e => setNewLimit(e.target.value)}
                    className="bg-[#F9FAFB] dark:bg-[#141414] border border-[#4F46E5] text-[#111827] dark:text-[#EEF2FF] rounded-xl pl-8 pr-4 py-2 text-xl font-bold w-44 focus:outline-none"
                    autoFocus />
                </div>
                <button id="btn-save-budget" onClick={handleSave} disabled={saving}
                  className="p-2.5 text-[#4F46E5] bg-[#EEF2FF] dark:bg-[#1a1a1a] border border-[#A5B4FC] dark:border-[#1e1a4a] rounded-xl hover:bg-[#C7D2FE] dark:hover:bg-[#1a1a4a] transition-all">
                  <Check size={16} />
                </button>
                <button id="btn-cancel-budget" onClick={() => setEditing(false)}
                  className="p-2.5 text-[#6B7280] dark:text-[#A5B4FC] bg-[#F9FAFB] dark:bg-[#141414] border border-[#C7D2FE] dark:border-[#1a1a4a] rounded-xl hover:bg-[#EEF2FF] dark:hover:bg-[#1a1a1a] transition-all">
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 mt-1">
                <p className="text-3xl font-black text-[#111827] dark:text-[#EEF2FF]">{fmt(budget.monthlyLimit)}</p>
                <button id="btn-edit-budget" onClick={() => setEditing(true)}
                  className="p-1.5 text-[#9CA3AF] dark:text-[#818CF8] hover:text-[#4F46E5] hover:bg-[#EEF2FF] dark:hover:bg-[#1a1a1a] rounded-lg transition-all">
                  <Edit3 size={14} />
                </button>
              </div>
            )}
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-[#6B7280] dark:text-[#A5B4FC] text-sm mb-1">Kullanılan</p>
            <p className="text-3xl lg:text-4xl font-black" style={{ color: pctColor }}>%{pct.toFixed(0)}</p>
          </div>
        </div>

        <div className="h-5 bg-[#EEF2FF] dark:bg-[#1a1a1a] rounded-full overflow-hidden mb-2 border border-[#C7D2FE] dark:border-[#1a1a4a]">
          <div className={`h-full ${pctBg} rounded-full transition-all duration-1000`} style={{ width: `${Math.min(100, pct)}%` }} />
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#6B7280] dark:text-[#A5B4FC]">Harcanan: <span className="text-[#111827] dark:text-[#EEF2FF] font-semibold">{fmt(budget.totalExpenses)}</span></span>
          <span className="text-[#6B7280] dark:text-[#A5B4FC]">Kalan: <span className={`font-semibold ${budget.remaining >= 0 ? 'text-[#4F46E5] dark:text-[#A5B4FC]' : 'text-red-500'}`}>{fmt(budget.remaining)}</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {segments.map(seg => (
          <div key={seg.label} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{seg.emoji}</span>
              <p className="text-[#111827] dark:text-[#EEF2FF] font-semibold text-sm">{seg.label}</p>
            </div>
            <p className="text-2xl font-black text-[#111827] dark:text-[#EEF2FF] mb-1">{fmt(seg.amount)}</p>
            <p className="text-[#9CA3AF] dark:text-[#818CF8] text-xs mb-3">Bütçenin %{seg.pct.toFixed(0)}'i</p>
            <div className="h-2 bg-[#EEF2FF] dark:bg-[#1a1a1a] rounded-full border border-[#C7D2FE] dark:border-[#1a1a4a]">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${seg.pct}%`, backgroundColor: seg.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className={`rounded-2xl p-4 border font-medium text-sm ${statusMsg.cls}`}>{statusMsg.msg}</div>

      <div className="glass-card p-5">
        <h3 className="text-[#111827] dark:text-[#EEF2FF] font-bold mb-4">50 / 30 / 20 Kuralı Hedefi</h3>
        <div className="space-y-3">
          {[
            { label: 'İhtiyaçlar (%50)', target: budget.monthlyLimit * 0.5 },
            { label: 'İstekler (%30)',   target: budget.monthlyLimit * 0.3 },
            { label: 'Tasarruf (%20)',   target: budget.monthlyLimit * 0.2 },
          ].map(({ label, target }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-[#6B7280] dark:text-[#A5B4FC]">{label}</span>
              <span className="font-semibold text-[#111827] dark:text-[#EEF2FF]">{fmt(target)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
