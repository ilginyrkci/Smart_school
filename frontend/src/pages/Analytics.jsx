import { useState, useEffect } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  LineElement, PointElement, ArcElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import { reportService } from '../services/api'

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement,
  PointElement, ArcElement, Title, Tooltip, Legend, Filler
)

const fmt = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n)
const COLORS = ['#7c3aed','#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#f97316','#ec4899','#84cc16']

const chartBase = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#6b7280', font: { family: 'Inter', size: 12 }, padding: 16 } } },
  scales: {
    x: { grid: { color: '#1f2937', drawBorder: false }, ticks: { color: '#6b7280' } },
    y: { grid: { color: '#1f2937', drawBorder: false }, ticks: { color: '#6b7280' } },
  }
}

export default function Analytics() {
  const [cats, setCats]   = useState([])
  const [trend, setTrend] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([reportService.getCategories(), reportService.getMonthlyTrend()])
      .then(([c, t]) => { setCats(c.data); setTrend(t.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const donutData = {
    labels: cats.map(c => c.name),
    datasets: [{
      data: cats.map(c => c.amount),
      backgroundColor: COLORS.map(c => c + 'bb'),
      borderColor: COLORS,
      borderWidth: 2,
      hoverOffset: 8,
    }]
  }

  const barData = {
    labels: trend.map(t => t.month),
    datasets: [
      { label: 'Gelir', data: trend.map(t => t.income),
        backgroundColor: '#10b98140', borderColor: '#10b981', borderWidth: 2, borderRadius: 6, borderSkipped: false },
      { label: 'Gider', data: trend.map(t => t.expenses),
        backgroundColor: '#ef444440', borderColor: '#ef4444', borderWidth: 2, borderRadius: 6, borderSkipped: false },
    ]
  }

  const lineData = {
    labels: trend.map(t => t.month),
    datasets: [{
      label: 'Net Tasarruf',
      data: trend.map(t => t.income - t.expenses),
      borderColor: '#7c3aed', backgroundColor: '#7c3aed20',
      fill: true, tension: 0.4,
      pointBackgroundColor: '#7c3aed', pointBorderColor: '#fff',
      pointRadius: 5, pointHoverRadius: 7,
    }]
  }

  const totalCats = cats.reduce((s, c) => s + c.amount, 0)

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div>
        <h2 className="text-2xl lg:text-3xl font-black text-white">Finansal Analiz</h2>
        <p className="text-gray-400 text-xs lg:text-sm mt-1">Harcamalarınızı görselleştirin ve anlayın</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doughnut */}
        <div className="glass-card p-5">
          <h3 className="text-white font-bold mb-4">Kategori Dağılımı</h3>
          <div className="h-48 lg:h-56 flex items-center justify-center">
            {cats.length === 0
              ? <p className="text-gray-600">Henüz harcama verisi yok</p>
              : <Doughnut data={donutData} options={{
                  responsive: true, maintainAspectRatio: false, cutout: '65%',
                  plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af', font: { size: 10 }, padding: 8 } } }
                }} />
            }
          </div>
        </div>

        {/* Category Bars */}
        <div className="glass-card p-5">
          <h3 className="text-white font-bold mb-4">Harcama Kırılımı</h3>
          <div className="space-y-3 overflow-y-auto max-h-48 lg:max-h-56">
            {cats.slice(0, 7).map((cat, i) => {
              const pct = totalCats > 0 ? (cat.amount / totalCats) * 100 : 0
              return (
                <div key={cat.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      {cat.name}
                    </span>
                    <span className="text-gray-400">{fmt(cat.amount)} <span className="text-gray-600">%{pct.toFixed(0)}</span></span>
                  </div>
                  <div className="h-1.5 bg-gray-800 rounded-full">
                    <div className="h-full rounded-full transition-all duration-700"
                         style={{ width: `${pct}%`, backgroundColor: COLORS[i % COLORS.length] }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="glass-card p-5">
        <h3 className="text-white font-bold mb-4">Aylık Gelir / Gider Kıyasla</h3>
        <div className="h-56 lg:h-72">
          <Bar data={barData} options={chartBase} />
        </div>
      </div>

      {/* Line Chart */}
      <div className="glass-card p-5">
        <h3 className="text-white font-bold mb-4">Net Tasarruf Trendi</h3>
        <div className="h-48 lg:h-60">
          <Line data={lineData} options={chartBase} />
        </div>
      </div>
    </div>
  )
}
