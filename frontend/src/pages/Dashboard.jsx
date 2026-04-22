import { useState, useEffect } from 'react'
import { Plus, TrendingUp, TrendingDown, DollarSign, PiggyBank, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { reportService, budgetService, transactionService } from '../services/api'
import AddTransactionModal from '../components/AddTransactionModal'

const fmt = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n)
const fmtDate = (d) => new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })

const CAT_ICONS = {
  'Maaş':'💼','Freelance':'💻','Temettü':'📈','Kira':'🏠','Market':'🛒','Faturalar':'⚡',
  'Ulaşım':'🚌','Eğlence':'🎬','Giyim':'👗','Abonelikler':'📱','Sağlık':'🏥','Yemek':'🍔',
  'Eğitim':'📚','Spor':'💪','Serbest Çalışma':'💻','Burs':'🎓','Hediye':'🎁',
}

export default function Dashboard() {
  const [summary, setSummary]   = useState(null)
  const [budget, setBudget]     = useState(null)
  const [txs, setTxs]           = useState([])
  const [showAdd, setShowAdd]   = useState(false)
  const [loading, setLoading]   = useState(true)

  const load = async () => {
    try {
      const [s, b, t] = await Promise.all([
        reportService.getSummary(),
        budgetService.get(),
        transactionService.getAll(),
      ])
      setSummary(s.data); setBudget(b.data); setTxs(t.data.slice(0, 6))
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-gray-400 text-sm">Yükleniyor...</p>
      </div>
    </div>
  )

  const savings = summary ? ((summary.totalIncome - summary.totalExpenses) / (summary.totalIncome || 1)) * 100 : 0
  const pct     = budget?.percentage || 0
  const pctColor = pct >= 90 ? 'bg-rose-500' : pct >= 75 ? 'bg-amber-400' : 'bg-emerald-500'

  const cards = [
    { id: 'stat-income',   title: 'Toplam Gelir',   val: fmt(summary?.totalIncome || 0),
      Icon: TrendingUp,  grad: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/20', icon: 'text-emerald-400' },
    { id: 'stat-expenses', title: 'Toplam Gider',   val: fmt(summary?.totalExpenses || 0),
      Icon: TrendingDown, grad: 'from-rose-500/20 to-rose-600/5',     border: 'border-rose-500/20',    icon: 'text-rose-400' },
    { id: 'stat-balance',  title: 'Net Bakiye',     val: fmt((summary?.totalIncome || 0) - (summary?.totalExpenses || 0)),
      Icon: DollarSign,  grad: (summary?.netBalance ?? 0) >= 0 ? 'from-blue-500/20 to-blue-600/5' : 'from-red-500/20 to-red-600/5',
      border: 'border-blue-500/20', icon: (summary?.netBalance ?? 0) >= 0 ? 'text-blue-400' : 'text-red-400' },
    { id: 'stat-savings',  title: 'Tasarruf Oranı', val: `%${savings.toFixed(1)}`,
      Icon: PiggyBank,   grad: 'from-purple-500/20 to-violet-600/5',   border: 'border-purple-500/20',  icon: 'text-purple-400' },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-white">Dashboard</h2>
          <p className="text-gray-400 text-xs lg:text-sm mt-1">{new Date().toLocaleDateString('tr-TR', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
        </div>
        <button id="btn-add-transaction" onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus size={16} /> Yeni İşlem
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ id, title, val, Icon, grad, border, icon }) => (
          <div key={id} id={id} className={`stat-card bg-gradient-to-br ${grad} border ${border}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">{title}</p>
              <Icon size={18} className={`${icon} opacity-80`} />
            </div>
            <p className="text-xl font-bold text-white">{val}</p>
          </div>
        ))}
      </div>

      {/* Budget Bar */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-white font-bold">Aylık Bütçe</h3>
            <p className="text-gray-500 text-xs mt-0.5">Limit: {fmt(budget?.monthlyLimit || 0)}</p>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-black ${pct >= 90 ? 'text-rose-400' : pct >= 75 ? 'text-amber-400' : 'text-emerald-400'}`}>
              %{pct.toFixed(0)}
            </span>
            <p className="text-gray-500 text-xs">kullanıldı</p>
          </div>
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
          <div className={`h-full ${pctColor} rounded-full transition-all duration-1000`}
               style={{ width: `${Math.min(100, pct)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Harcanan: <span className="text-gray-300">{fmt(budget?.totalExpenses || 0)}</span></span>
          <span>Kalan: <span className={budget?.remaining >= 0 ? 'text-emerald-400' : 'text-rose-400'}>{fmt(budget?.remaining || 0)}</span></span>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white font-bold">Son İşlemler</h3>
          <Link to="/transactions" className="text-purple-400 hover:text-purple-300 text-xs flex items-center gap-1 transition-colors">
            Tümünü gör <ArrowRight size={12} />
          </Link>
        </div>
        <div className="space-y-1">
          {txs.length === 0 ? (
            <p className="text-gray-600 text-center py-6 text-sm">Henüz işlem yok. Yeni bir işlem ekleyin!</p>
          ) : txs.map(tx => (
            <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-gray-800/40 last:border-0 hover:bg-white/2 rounded-lg px-2 -mx-2 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${
                  tx.type === 'income' ? 'bg-emerald-500/15' : tx.subtype === 'luxury' ? 'bg-orange-500/15' : 'bg-rose-500/15'
                }`}>
                  {CAT_ICONS[tx.category] || (tx.type === 'income' ? '💰' : '💳')}
                </div>
                <div>
                  <p className="text-white text-sm font-medium leading-tight">{tx.description}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{tx.category} • {fmtDate(tx.date)}</p>
                </div>
              </div>
              <span className={`font-bold text-sm flex-shrink-0 ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showAdd && <AddTransactionModal onClose={() => setShowAdd(false)} onSuccess={() => { setShowAdd(false); load() }} />}
    </div>
  )
}
