import { useState } from 'react'
import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { transactionService } from '../services/api'

const CATEGORIES = {
  income:  ['Maaş', 'Freelance', 'Serbest Çalışma', 'Temettü', 'Kira Geliri', 'Burs', 'Hediye', 'Diğer'],
  expense: ['Kira', 'Market', 'Faturalar', 'Ulaşım', 'Eğlence', 'Giyim', 'Abonelikler', 'Sağlık', 'Yemek', 'Eğitim', 'Spor', 'Diğer'],
}

// editTx geçilirse düzenleme modu aktif olur
export default function AddTransactionModal({ onClose, onSuccess, editTx = null }) {
  const isEdit = editTx !== null
  const today  = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState(isEdit ? {
    type:        editTx.type        || 'expense',
    category:    editTx.category    || 'Market',
    amount:      editTx.amount      || '',
    description: editTx.description || '',
    date:        editTx.date        || today,
    subtype:     editTx.subtype     || 'necessary',
  } : {
    type: 'expense', category: 'Market', amount: '',
    description: '', date: today, subtype: 'necessary',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleTypeChange = (type) => {
    setForm(prev => ({ ...prev, type, category: CATEGORIES[type][0] }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || parseFloat(form.amount) <= 0) { setError('Geçerli bir miktar girin'); return }
    if (!form.description.trim())                      { setError('Açıklama zorunludur'); return }
    setLoading(true); setError('')
    try {
      if (isEdit) {
        await transactionService.update(editTx.id, { ...form, amount: parseFloat(form.amount) })
      } else {
        await transactionService.create({ ...form, amount: parseFloat(form.amount) })
      }
      onSuccess()
    } catch {
      setError(isEdit ? 'Güncelleme sırasında hata oluştu.' : 'İşlem eklenirken hata oluştu. Backend çalışıyor mu?')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">

        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <h3 className="text-lg font-bold text-white">
            {isEdit ? '✏️ İşlemi Düzenle' : 'Yeni İşlem Ekle'}
          </h3>
          <button onClick={onClose} id="modal-close" className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-gray-800 transition-all">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">

          {/* Type */}
          <div className="flex gap-2 bg-gray-800/80 rounded-xl p-1">
            <button type="button" id="type-income" onClick={() => handleTypeChange('income')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                form.type === 'income' ? 'bg-emerald-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}>
              <ArrowUpCircle size={15} /> Gelir
            </button>
            <button type="button" id="type-expense" onClick={() => handleTypeChange('expense')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                form.type === 'expense' ? 'bg-rose-500 text-white shadow-md' : 'text-gray-400 hover:text-white'
              }`}>
              <ArrowDownCircle size={15} /> Gider
            </button>
          </div>

          {/* Category */}
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Kategori</label>
            <select id="input-category" value={form.category} onChange={e => set('category', e.target.value)} className="input-field">
              {CATEGORIES[form.type].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Subtype (expense only) */}
          {form.type === 'expense' && (
            <div>
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Harcama Tipi</label>
              <div className="flex gap-2">
                {[
                  { val: 'necessary', label: '🏠 Zorunlu', active: 'bg-blue-500/20 border-blue-500/60 text-blue-300' },
                  { val: 'luxury',    label: '✨ Lüks',    active: 'bg-orange-500/20 border-orange-500/60 text-orange-300' },
                ].map(({ val, label, active }) => (
                  <button key={val} type="button" id={`subtype-${val}`}
                    onClick={() => set('subtype', val)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      form.subtype === val ? active : 'border-gray-700 text-gray-500 hover:border-gray-600 hover:text-gray-300'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Miktar (₺)</label>
            <input id="input-amount" type="number" min="0" step="0.01" value={form.amount}
              onChange={e => set('amount', e.target.value)} placeholder="0.00" className="input-field" required />
          </div>

          {/* Description */}
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Açıklama</label>
            <input id="input-description" type="text" value={form.description}
              onChange={e => set('description', e.target.value)} placeholder="İşlem açıklaması..." className="input-field" required />
          </div>

          {/* Date */}
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1.5 block">Tarih</label>
            <input id="input-date" type="date" value={form.date} onChange={e => set('date', e.target.value)} className="input-field" />
          </div>

          {error && <p className="text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" id="btn-submit-transaction" disabled={loading}
            className="w-full disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20 mt-2"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}>
            {loading
              ? (isEdit ? 'Güncelleniyor...' : 'Ekleniyor...')
              : (isEdit ? '✓ Değişiklikleri Kaydet' : 'İşlemi Ekle ✓')}
          </button>
        </form>
      </div>
    </div>
  )
}
