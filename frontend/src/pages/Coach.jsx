import { useState, useEffect } from 'react'
import { coachService } from '../services/api'

const LEVEL_STYLES = {
  danger:  { bg:'bg-red-50 dark:bg-red-900/20',      border:'border-red-200 dark:border-red-800',     title:'text-red-700 dark:text-red-400' },
  warning: { bg:'bg-amber-50 dark:bg-amber-900/20',  border:'border-amber-200 dark:border-amber-800',  title:'text-amber-700 dark:text-amber-400' },
  success: { bg:'bg-[#FFF0E4] dark:bg-[#1a1a1a]',   border:'border-[#FFB3B3] dark:border-[#5a1a1a]',  title:'text-[#FF6B6B] dark:text-[#4D96FF]' },
  info:    { bg:'bg-blue-50 dark:bg-blue-900/20',    border:'border-blue-200 dark:border-blue-800',    title:'text-blue-700 dark:text-blue-400' },
  tip:     { bg:'bg-[#FFF0E4] dark:bg-[#1a1a1a]',   border:'border-[#FFDCC8] dark:border-[#4a1a1a]',  title:'text-[#FF6B6B] dark:text-[#4D96FF]' },
}
const GRADE_COLOR = { A:'text-[#FF6B6B] dark:text-[#4D96FF]', B:'text-blue-600 dark:text-blue-400', C:'text-amber-600 dark:text-amber-400', D:'text-orange-600 dark:text-orange-400', F:'text-red-600 dark:text-red-400' }
const fmt = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n)

export default function Coach() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const isDark = document.documentElement.classList.contains('dark')

  useEffect(() => {
    coachService.getAdvice()
      .then(r => setData(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-10 h-10 border-2 border-[#FF6B6B] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const R = 52, C = 2 * Math.PI * R
  const dash = C - (data.score / 100) * C
  const scoreColor = data.score >= 80 ? '#FF6B6B' : data.score >= 60 ? '#4D96FF' : data.score >= 40 ? '#FFD93D' : '#ef4444'
  const trackColor = isDark ? '#4a1a1a' : '#FFDCC8'
  const scorePanelBg = isDark ? '#1a1a1a' : '#FFF0E4'
  const scorePanelBorder = isDark ? '#5a1a1a' : '#FFB3B3'

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl lg:text-3xl font-black text-[#2D2D2D] dark:text-[#FFF0E4]">Finans Koçu 🧠</h2>
        <p className="text-[#6B7280] dark:text-[#FFB3B3] text-xs lg:text-sm mt-1">Kişisel finansal analiz ve tavsiyeler</p>
      </div>

      <div className="glass-card p-6" style={{ backgroundColor: scorePanelBg, borderColor: scorePanelBorder }}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="relative flex-shrink-0">
            <svg width="140" height="140" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={R} fill="none" stroke={trackColor} strokeWidth="10" />
              <circle cx="60" cy="60" r={R} fill="none" stroke={scoreColor} strokeWidth="10"
                strokeLinecap="round" strokeDasharray={C} strokeDashoffset={dash}
                style={{ transform:'rotate(-90deg)', transformOrigin:'50% 50%', transition:'stroke-dashoffset 1.2s ease' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-[#2D2D2D] dark:text-[#FFF0E4]">{data.score}</span>
              <span className="text-[#9CA3AF] dark:text-[#FF9999] text-xs">/ 100</span>
            </div>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="flex items-center gap-3">
              <span className="text-[#6B7280] dark:text-[#FFB3B3] text-sm">Finansal Notun:</span>
              <span className={`text-4xl lg:text-5xl font-black ${GRADE_COLOR[data.grade] || 'text-[#2D2D2D] dark:text-[#FFF0E4]'}`}>{data.grade}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {[
                ['Toplam Gelir',   fmt(data.totalIncome),  'text-[#FF6B6B] dark:text-[#4D96FF]'],
                ['Toplam Gider',   fmt(data.totalExpenses),'text-red-600 dark:text-red-400'],
                ['Net Tasarruf',   fmt(data.netSavings),   data.netSavings >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'],
                ['Tasarruf Oranı', `%${data.savingsRate}`, 'text-[#FF6B6B] dark:text-[#4D96FF]'],
                ['Lüks Harcama',   `%${data.luxuryRate}`,  'text-amber-600 dark:text-amber-400'],
                ['Bütçe Kullanım', `%${data.budgetUsage}`, data.budgetUsage > 90 ? 'text-red-600 dark:text-red-400' : 'text-[#FF6B6B] dark:text-[#4D96FF]'],
              ].map(([label, val, color]) => (
                <div key={label}>
                  <p className="text-[#9CA3AF] dark:text-[#FF9999] text-xs">{label}</p>
                  <p className={`font-bold text-sm ${color}`}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[#2D2D2D] dark:text-[#FFF0E4] font-bold text-lg">Koç Tavsiyeleri</h3>
        {data.advices.map((a, i) => {
          const s = LEVEL_STYLES[a.level] || LEVEL_STYLES.tip
          return (
            <div key={i} id={`advice-${i}`}
              className={`flex gap-4 p-4 rounded-2xl border ${s.bg} ${s.border} transition-all hover:scale-[1.01] animate-slide-up`}
              style={{ animationDelay: `${i * 60}ms` }}>
              <span className="text-2xl flex-shrink-0 mt-0.5">{a.icon}</span>
              <div>
                <p className={`font-bold text-sm ${s.title}`}>{a.title}</p>
                <p className="text-[#6B7280] dark:text-[#FFB3B3] text-sm mt-0.5 leading-relaxed">{a.message}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
