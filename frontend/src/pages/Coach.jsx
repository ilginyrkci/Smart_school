import { useState, useEffect } from 'react'
import { coachService } from '../services/api'

const LEVEL_STYLES = {
  danger:  { bg:'bg-rose-500/10',    border:'border-rose-500/30',    title:'text-rose-300',    bar:'bg-rose-500' },
  warning: { bg:'bg-amber-500/10',   border:'border-amber-500/30',   title:'text-amber-300',   bar:'bg-amber-400' },
  success: { bg:'bg-emerald-500/10', border:'border-emerald-500/30', title:'text-emerald-300', bar:'bg-emerald-500' },
  info:    { bg:'bg-blue-500/10',    border:'border-blue-500/30',    title:'text-blue-300',    bar:'bg-blue-500' },
  tip:     { bg:'bg-purple-500/10',  border:'border-purple-500/30',  title:'text-purple-300',  bar:'bg-purple-500' },
}
const GRADE_COLOR = { A:'text-emerald-400', B:'text-blue-400', C:'text-amber-400', D:'text-orange-400', F:'text-rose-500' }
const fmt = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n)

export default function Coach() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    coachService.getAdvice()
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const R = 52, C = 2 * Math.PI * R
  const dash = C - (data.score / 100) * C
  const scoreColor = data.score >= 80 ? '#10b981' : data.score >= 60 ? '#3b82f6' : data.score >= 40 ? '#f59e0b' : '#ef4444'

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-black text-white">Finans Koçu 🧠</h2>
        <p className="text-gray-400 text-sm mt-1">Kişiselleştirilmiş finansal analiz ve tavsiyeler</p>
      </div>

      {/* Score panel */}
      <div className="glass-card p-6" style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.1), rgba(99,102,241,0.05))' }}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Circle */}
          <div className="relative flex-shrink-0">
            <svg width="140" height="140" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={R} fill="none" stroke="#1f2937" strokeWidth="10" />
              <circle cx="60" cy="60" r={R} fill="none" stroke={scoreColor} strokeWidth="10"
                strokeLinecap="round" strokeDasharray={C} strokeDashoffset={dash}
                style={{ transform:'rotate(-90deg)', transformOrigin:'50% 50%', transition:'stroke-dashoffset 1.2s ease' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{data.score}</span>
              <span className="text-gray-500 text-xs">/ 100</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 space-y-5">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 text-sm">Finansal Notun:</span>
              <span className={`text-5xl font-black ${GRADE_COLOR[data.grade] || 'text-white'}`}>{data.grade}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {[
                ['Toplam Gelir',   fmt(data.totalIncome),  'text-emerald-400'],
                ['Toplam Gider',   fmt(data.totalExpenses),'text-rose-400'],
                ['Net Tasarruf',   fmt(data.netSavings),   data.netSavings >= 0 ? 'text-blue-400' : 'text-rose-400'],
                ['Tasarruf Oranı', `%${data.savingsRate}`, 'text-purple-400'],
                ['Lüks Harcama',   `%${data.luxuryRate}`,  'text-amber-400'],
                ['Bütçe Kullanım', `%${data.budgetUsage}`, data.budgetUsage > 90 ? 'text-rose-400' : 'text-emerald-400'],
              ].map(([label, val, color]) => (
                <div key={label}>
                  <p className="text-gray-500 text-xs">{label}</p>
                  <p className={`font-bold text-sm ${color}`}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advices */}
      <div className="space-y-3">
        <h3 className="text-white font-bold text-lg">Koç Tavsiyeleri</h3>
        {data.advices.map((a, i) => {
          const s = LEVEL_STYLES[a.level] || LEVEL_STYLES.tip
          return (
            <div key={i} id={`advice-${i}`}
              className={`flex gap-4 p-4 rounded-2xl border ${s.bg} ${s.border} transition-all hover:scale-[1.01] animate-slide-up`}
              style={{ animationDelay: `${i * 60}ms` }}>
              <span className="text-2xl flex-shrink-0 mt-0.5">{a.icon}</span>
              <div>
                <p className={`font-bold text-sm ${s.title}`}>{a.title}</p>
                <p className="text-gray-400 text-sm mt-0.5 leading-relaxed">{a.message}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
