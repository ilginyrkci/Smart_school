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
        <div className="w-12 h-12 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-[#6B7280] dark:text-[#A5B4FC] text-sm">Yükleniyor...</p>
      </div>
    </div>
  )

  const savings = summary ? ((summary.totalIncome - summary.totalExpenses) / (summary.totalIncome || 1)) * 100 : 0
  const pct     = budget?.percentage || 0
  const pctBg   = pct >= 90 ? 'bg-red-500' : pct >= 75 ? 'bg-[#22C55E]' : 'bg-[#4F46E5]'

  const cards = [
    { id: 'stat-income',   title: 'Toplam Gelir',   val: fmt(summary?.totalIncome || 0),
      Icon: TrendingUp,   cls: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800', icon: 'text-emerald-600 dark:text-emerald-400' },
    { id: 'stat-expenses', title: 'Toplam Gider',   val: fmt(summary?.totalExpenses || 0),
      Icon: TrendingDown, cls: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800', icon: 'text-red-500 dark:text-red-400' },
    { id: 'stat-balance',  title: 'Net Bakiye',     val: fmt((summary?.totalIncome || 0) - (summary?.totalExpenses || 0)),
      Icon: DollarSign,   cls: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800', icon: 'text-blue-600 dark:text-blue-400' },
    { id: 'stat-savings',  title: 'Tasarruf Oranı', val: `%${savings.toFixed(1)}`,
      Icon: PiggyBank,    cls: 'bg-[#EEF2FF] dark:bg-[#1a1a1a] border-[#A5B4FC] dark:border-[#1e1a4a]', icon: 'text-[#4F46E5] dark:text-[#A5B4FC]' },
  ]

  return (
    <div className="p-4 lg:p-6 space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-[#111827] dark:text-[#EEF2FF]">Dashboard</h2>
          <p className="text-[#6B7280] dark:text-[#A5B4FC] text-xs lg:text-sm mt-1">{new Date().toLocaleDateString('tr-TR', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}</p>
        </div>
        <button id="btn-add-transaction" onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus size={16} /> Yeni İşlem
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ id, title, val, Icon, cls, icon }) => (
          <div key={id} id={id} className={`stat-card ${cls}`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[#6B7280] dark:text-[#818CF8] text-xs font-semibold uppercase tracking-wide">{title}</p>
              <Icon size={18} className={`${icon} opacity-80`} />
            </div>
            <p className="text-xl font-bold text-[#111827] dark:text-[#EEF2FF]">{val}</p>
          </div>
        ))}
      </div>

      {/* Budget Bar */}
      <div className="glass-card p-5 lg:p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-[#111827] dark:text-[#EEF2FF] font-bold">Aylık Bütçe</h3>
            <p className="text-[#9CA3AF] dark:text-[#818CF8] text-xs mt-0.5">Limit: {fmt(budget?.monthlyLimit || 0)}</p>
          </div>
          <div className="text-right">
            <span className={`text-2xl font-black ${pct >= 90 ? 'text-red-500' : pct >= 75 ? 'text-[#22C55E]' : 'text-[#4F46E5] dark:text-[#A5B4FC]'}`}>
              %{pct.toFixed(0)}
            </span>
            <p className="text-[#9CA3AF] dark:text-[#818CF8] text-xs">kullanıldı</p>
          </div>
        </div>
        <div className="h-3 bg-[#EEF2FF] dark:bg-[#1a1a1a] rounded-full overflow-hidden border border-[#C7D2FE] dark:border-[#1a1a4a]">
          <div className={`h-full ${pctBg} rounded-full transition-all duration-1000`}
               style={{ width: `${Math.min(100, pct)}%` }} />
        </div>
        <div className="flex justify-between text-xs text-[#9CA3AF] dark:text-[#818CF8] mt-2">
          <span>Harcanan: <span className="text-[#111827] dark:text-[#EEF2FF] font-medium">{fmt(budget?.totalExpenses || 0)}</span></span>
          <span>Kalan: <span className={budget?.remaining >= 0 ? 'text-[#4F46E5] dark:text-[#A5B4FC] font-medium' : 'text-red-500 font-medium'}>{fmt(budget?.remaining || 0)}</span></span>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card p-5 lg:p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#111827] dark:text-[#EEF2FF] font-bold">Son İşlemler</h3>
          <Link to="/app/transactions" className="text-[#4F46E5] dark:text-[#A5B4FC] hover:text-[#3730A3] text-xs flex items-center gap-1 transition-colors font-medium">
            Tümünü gör <ArrowRight size={12} />
          </Link>
        </div>
        <div className="space-y-1">
          {txs.length === 0 ? (
            <p className="text-[#B0B8C4] dark:text-[#1e1a4a] text-center py-6 text-sm">Henüz işlem yok. Yeni bir işlem ekleyin!</p>
          ) : txs.map(tx => (
            <div key={tx.id} className="flex items-center justify-between py-2.5 border-b border-[#EEF2FF] dark:border-[#1a1a1a] last:border-0 hover:bg-[#F5F5FF] dark:hover:bg-[#1a1a1a] rounded-lg px-2 -mx-2 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0 ${
                  tx.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30' : tx.subtype === 'luxury' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                  {CAT_ICONS[tx.category] || (tx.type === 'income' ? '💰' : '💳')}
                </div>
                <div>
                  <p className="text-[#111827] dark:text-[#EEF2FF] text-sm font-medium leading-tight">{tx.description}</p>
                  <p className="text-[#9CA3AF] dark:text-[#818CF8] text-xs mt-0.5">{tx.category} • {fmtDate(tx.date)}</p>
                </div>
              </div>
              <span className={`font-bold text-sm flex-shrink-0 ${tx.type === 'income' ? 'text-[#4F46E5] dark:text-[#A5B4FC]' : 'text-red-500'}`}>
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
