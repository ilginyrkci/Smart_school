import { useState, useEffect } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { reportService } from '../services/api'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler)

const fmt = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n)
const COLORS = ['#2E7D32','#66BB6A','#FFC107','#3b82f6','#ef4444','#8b5cf6','#06b6d4','#f97316','#ec4899','#84cc16']

const chartBase = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#546E7A', font: { family: 'Inter', size: 12 }, padding: 16 } } },
  scales: {
    x: { grid: { color: '#E8F5E9', drawBorder: false }, ticks: { color: '#78909C' } },
    y: { grid: { color: '#E8F5E9', drawBorder: false }, ticks: { color: '#78909C' } },
  }
}

const chartDark = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#A5D6A7', font: { family: 'Inter', size: 12 }, padding: 16 } } },
  scales: {
    x: { grid: { color: '#1a1a1a', drawBorder: false }, ticks: { color: '#81C784' } },
    y: { grid: { color: '#1a1a1a', drawBorder: false }, ticks: { color: '#81C784' } },
  }
}

export default function Analytics() {
  const [cats, setCats]   = useState([])
  const [trend, setTrend] = useState([])
  const [loading, setLoading] = useState(true)
  const isDark = document.documentElement.classList.contains('dark')

  useEffect(() => {
    Promise.all([reportService.getCategories(), reportService.getMonthlyTrend()])
      .then(([c, t]) => { setCats(c.data); setTrend(t.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-10 h-10 border-2 border-[#2E7D32] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const opts = isDark ? chartDark : chartBase

  const donutData = {
    labels: cats.map(c => c.name),
    datasets: [{ data: cats.map(c => c.amount), backgroundColor: COLORS.map(c => c + 'bb'), borderColor: COLORS, borderWidth: 2, hoverOffset: 8 }]
  }
  const barData = {
    labels: trend.map(t => t.month),
    datasets: [
      { label: 'Gelir', data: trend.map(t => t.income), backgroundColor: '#2E7D3240', borderColor: '#2E7D32', borderWidth: 2, borderRadius: 6, borderSkipped: false },
      { label: 'Gider', data: trend.map(t => t.expenses), backgroundColor: '#ef444440', borderColor: '#ef4444', borderWidth: 2, borderRadius: 6, borderSkipped: false },
    ]
  }
  const lineData = {
    labels: trend.map(t => t.month),
    datasets: [{ label: 'Net Tasarruf', data: trend.map(t => t.income - t.expenses), borderColor: '#2E7D32', backgroundColor: '#2E7D3220', fill: true, tension: 0.4, pointBackgroundColor: '#2E7D32', pointBorderColor: '#fff', pointRadius: 5, pointHoverRadius: 7 }]
  }
  const totalCats = cats.reduce((s, c) => s + c.amount, 0)

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl lg:text-3xl font-black text-[#263238] dark:text-[#E8F5E9]">Finansal Analiz</h2>
        <p className="text-[#546E7A] dark:text-[#A5D6A7] text-xs lg:text-sm mt-1">Harcamalarınızı görselleştirin ve anlayın</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="glass-card p-5">
          <h3 className="text-[#263238] dark:text-[#E8F5E9] font-bold mb-4">Kategori Dağılımı</h3>
          <div className="h-48 lg:h-56 flex items-center justify-center">
            {cats.length === 0
              ? <p className="text-[#90A4AE] dark:text-[#2a5a2a]">Henüz harcama verisi yok</p>
              : <Doughnut data={donutData} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%',
                  plugins: { legend: { position: 'bottom', labels: { color: isDark ? '#A5D6A7' : '#546E7A', font: { size: 10 }, padding: 8 } } } }} />
            }
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-[#263238] dark:text-[#E8F5E9] font-bold mb-4">Harcama Kırılımı</h3>
          <div className="space-y-3 overflow-y-auto max-h-48 lg:max-h-56">
            {cats.slice(0, 7).map((cat, i) => {
              const pct = totalCats > 0 ? (cat.amount / totalCats) * 100 : 0
              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#546E7A] dark:text-[#A5D6A7] flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      {cat.name}
                    </span>
                    <span className="text-[#263238] dark:text-[#E8F5E9]">{fmt(cat.amount)} <span className="text-[#90A4AE] dark:text-[#2a5a2a]">%{pct.toFixed(0)}</span></span>
                  </div>
                  <div className="h-1.5 bg-[#E8F5E9] dark:bg-[#1a1a1a] rounded-full border border-[#C8E6C9] dark:border-[#1e4a1e]">
                    <div className="h-full rounded-full transition-all duration-700"
                         style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-[#263238] dark:text-[#E8F5E9] font-bold mb-4">Aylık Gelir / Gider Karşılaştırması</h3>
        <div className="h-56 lg:h-72"><Bar data={barData} options={opts} /></div>
      </div>

      <div className="glass-card p-5">
        <h3 className="text-[#263238] dark:text-[#E8F5E9] font-bold mb-4">Net Tasarruf Trendi</h3>
        <div className="h-48 lg:h-60"><Line data={lineData} options={opts} /></div>
      </div>
    </div>
  )
}
