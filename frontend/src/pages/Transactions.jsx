import { useState, useEffect } from 'react'
import { Trash2, Plus, Search, Pencil } from 'lucide-react'
import { transactionService } from '../services/api'
import AddTransactionModal from '../components/AddTransactionModal'

const fmt     = (n) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(n)
const fmtDate = (d) => new Date(d).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })

const CAT_ICONS = {
  'Maaş':'💼','Freelance':'💻','Temettü':'📈','Kira Geliri':'💰','Burs':'🎓','Hediye':'🎁',
  'Kira':'🏠','Market':'🛒','Faturalar':'⚡','Ulaşım':'🚌','Eğlence':'🎬','Giyim':'👗',
  'Abonelikler':'📱','Sağlık':'🏥','Yemek':'🍔','Eğitim':'📚','Spor':'💪','Serbest Çalışma':'💻',
}

export default function Transactions() {
  const [txs, setTxs]         = useState([])
  const [filter, setFilter]   = useState('all')
  const [search, setSearch]   = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [editTx, setEditTx]   = useState(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try { const res = await transactionService.getAll(); setTxs(res.data) }
    catch (e) { console.error(e) }
    finally { setLoading(false) }
  }
  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Bu işlemi silmek istediğinizden emin misiniz?')) return
    try { await transactionService.delete(id); load() }
    catch (e) { console.error(e) }
  }

  const filtered = txs
    .filter(t => filter === 'all' ? true : t.type === filter)
    .filter(t => search ? (t.description + t.category).toLowerCase().includes(search.toLowerCase()) : true)

  return (
    <div className="p-4 lg:p-6 space-y-4 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl lg:text-3xl font-black text-[#111827] dark:text-[#EEF2FF]">İşlemler</h2>
          <p className="text-[#6B7280] dark:text-[#A5B4FC] text-xs lg:text-sm mt-1">{filtered.length} işlem listeleniyor</p>
        </div>
        <button id="btn-add-new" onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus size={16} /> Ekle
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex gap-1 bg-white dark:bg-[#141414] border border-[#C7D2FE] dark:border-[#1a1a4a] rounded-xl p-1">
          {[['all','Tümü'],['income','↑ Gelir'],['expense','↓ Gider']].map(([val, label]) => (
            <button key={val} id={`filter-${val}`} onClick={() => setFilter(val)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filter === val ? 'text-white shadow-md' : 'text-[#6B7280] dark:text-[#A5B4FC] hover:text-[#4F46E5]'
              }`}
              style={filter === val ? { background: 'linear-gradient(135deg,#4F46E5,#A5B4FC)' } : {}}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex-1 min-w-48 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#1e1a4a]" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Ara..." className="input-field pl-9" />
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#4F46E5] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-[#9CA3AF] dark:text-[#818CF8] text-sm">Hiç işlem bulunamadı</p>
          </div>
        ) : (
          <div className="divide-y divide-[#EEF2FF] dark:divide-[#1a1a1a]">
            {filtered.map(tx => (
              <div key={tx.id} id={`tx-${tx.id}`}
                className="flex items-center justify-between px-4 py-3 hover:bg-[#F5F5FF] dark:hover:bg-[#1a1a1a] transition-colors group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 lg:w-11 lg:h-11 rounded-xl lg:rounded-2xl flex items-center justify-center text-base lg:text-lg flex-shrink-0 ${
                    tx.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-900/30' : tx.subtype === 'luxury' ? 'bg-amber-100 dark:bg-amber-900/30' : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {CAT_ICONS[tx.category] || (tx.type === 'income' ? '💰' : '💳')}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[#111827] dark:text-[#EEF2FF] text-sm font-semibold truncate">{tx.description}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-[#9CA3AF] dark:text-[#818CF8] text-xs">{tx.category}</span>
                      {tx.subtype && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${
                          tx.subtype === 'luxury'
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                            : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        }`}>
                          {tx.subtype === 'luxury' ? 'Lüks' : 'Zorunlu'}
                        </span>
                      )}
                      <span className="text-[#9CA3AF] dark:text-[#818CF8] text-xs hidden sm:inline">{fmtDate(tx.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
                  <span className={`font-bold text-sm ${tx.type === 'income' ? 'text-[#4F46E5] dark:text-[#A5B4FC]' : 'text-red-500'}`}>
                    {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                  </span>
                  <button onClick={() => setEditTx(tx)} id={`edit-tx-${tx.id}`}
                    className="opacity-0 group-hover:opacity-100 text-[#B0B8C4] hover:text-[#4F46E5] transition-all p-1.5 rounded-lg hover:bg-[#EEF2FF] dark:hover:bg-[#1a1a1a]">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(tx.id)} id={`delete-tx-${tx.id}`}
                    className="opacity-0 group-hover:opacity-100 text-[#B0B8C4] hover:text-red-500 transition-all p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd  && <AddTransactionModal onClose={() => setShowAdd(false)} onSuccess={() => { setShowAdd(false); load() }} />}
      {editTx   && <AddTransactionModal editTx={editTx} onClose={() => setEditTx(null)} onSuccess={() => { setEditTx(null); load() }} />}
    </div>
  )
}
