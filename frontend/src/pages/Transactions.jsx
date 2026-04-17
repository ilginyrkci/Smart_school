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
    try {
      const res = await transactionService.getAll()
      setTxs(res.data)
    } catch (e) { console.error(e) }
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
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-3xl font-black text-white">İşlemler</h2>
          <p className="text-gray-400 text-sm mt-1">{filtered.length} işlem listeleniyor</p>
        </div>
        <button id="btn-add-new" onClick={() => setShowAdd(true)} className="btn-primary">
          <Plus size={16} /> Ekle
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3">
        {/* Filter Tabs */}
        <div className="flex gap-1 bg-gray-900/60 border border-gray-800/50 rounded-xl p-1">
          {[['all','Tümü'],['income','↑ Gelir'],['expense','↓ Gider']].map(([val, label]) => (
            <button key={val} id={`filter-${val}`} onClick={() => setFilter(val)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filter === val ? 'text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}
              style={filter === val ? { background: 'linear-gradient(135deg,#7c3aed,#6366f1)' } : {}}>
              {label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex-1 min-w-48 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Ara..." className="input-field pl-9" />
        </div>
      </div>

      {/* List */}
      <div className="glass-card overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-gray-500 text-sm">Hiç işlem bulunamadı</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800/40">
            {filtered.map(tx => (
              <div key={tx.id} id={`tx-${tx.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 ${
                    tx.type === 'income' ? 'bg-emerald-500/15' : tx.subtype === 'luxury' ? 'bg-orange-500/15' : 'bg-rose-500/15'
                  }`}>
                    {CAT_ICONS[tx.category] || (tx.type === 'income' ? '💰' : '💳')}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{tx.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-gray-500 text-xs">{tx.category}</span>
                      {tx.subtype && (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          tx.subtype === 'luxury' ? 'bg-orange-500/15 text-orange-400' : 'bg-blue-500/15 text-blue-400'
                        }`}>
                          {tx.subtype === 'luxury' ? 'Lüks' : 'Zorunlu'}
                        </span>
                      )}
                      <span className="text-gray-700 text-xs">•</span>
                      <span className="text-gray-500 text-xs">{fmtDate(tx.date)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`font-bold text-sm ${tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                  </span>
                  <button onClick={() => setEditTx(tx)} id={`edit-tx-${tx.id}`}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-violet-400 transition-all p-1.5 rounded-lg hover:bg-violet-500/10">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(tx.id)} id={`delete-tx-${tx.id}`}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-rose-400 transition-all p-1.5 rounded-lg hover:bg-rose-500/10">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAdd  && <AddTransactionModal onClose={() => setShowAdd(false)} onSuccess={() => { setShowAdd(false); load() }} />}
      {editTx  && <AddTransactionModal editTx={editTx} onClose={() => setEditTx(null)} onSuccess={() => { setEditTx(null); load() }} />}
    </div>
  )
}
