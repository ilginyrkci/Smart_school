import { useState } from 'react'
import { X, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { transactionService } from '../services/api'

const CATEGORIES = {
  income:  ['Maaş', 'Freelance', 'Serbest Çalışma', 'Temettü', 'Kira Geliri', 'Burs', 'Hediye', 'Diğer'],
  expense: ['Kira', 'Market', 'Faturalar', 'Ulaşım', 'Eğlence', 'Giyim', 'Abonelikler', 'Sağlık', 'Yemek', 'Eğitim', 'Spor', 'Diğer'],
}

export default function AddTransactionModal({ onClose, onSuccess, editTx = null }) {
  const isEdit = editTx !== null
  const today  = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState(isEdit ? {
    type: editTx.type || 'expense', category: editTx.category || 'Market',
    amount: editTx.amount || '', description: editTx.description || '',
    date: editTx.date || today, subtype: editTx.subtype || 'necessary',
  } : { type: 'expense', category: 'Market', amount: '', description: '', date: today, subtype: 'necessary' })

  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
  const handleTypeChange = (type) => setForm(prev => ({ ...prev, type, category: CATEGORIES[type][0] }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.amount || parseFloat(form.amount) <= 0) { setError('Geçerli bir miktar girin'); return }
    if (!form.description.trim()) { setError('Açıklama zorunludur'); return }
    setLoading(true); setError('')
    try {
      if (isEdit) await transactionService.update(editTx.id, { ...form, amount: parseFloat(form.amount) })
      else await transactionService.create({ ...form, amount: parseFloat(form.amount) })
      onSuccess()
    } catch { setError(isEdit ? 'Güncelleme sırasında hata oluştu.' : 'İşlem eklenirken hata oluştu.') }
    finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 bg-[#2D2D2D]/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-[#141414] border border-[#FFDCC8] dark:border-[#4a1a1a] rounded-2xl w-full max-w-md shadow-2xl animate-slide-up">

        <div className="flex items-center justify-between p-6 border-b border-[#FFF0E4] dark:border-[#4a1a1a]">
          <h3 className="text-lg font-bold text-[#2D2D2D] dark:text-[#FFF0E4]">
            {isEdit ? '✏️ İşlemi Düzenle' : 'Yeni İşlem Ekle'}
          </h3>
          <button onClick={onClose} id="modal-close"
            className="text-[#9CA3AF] dark:text-[#FF9999] hover:text-[#2D2D2D] dark:hover:text-[#FFF0E4] p-1.5 rounded-lg hover:bg-[#FFF0E4] dark:hover:bg-[#1a1a1a] transition-all">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex gap-2 bg-[#FFF7ED] dark:bg-[#0a0a0a] rounded-xl p-1 border border-[#FFDCC8] dark:border-[#4a1a1a]">
            <button type="button" id="type-income" onClick={() => handleTypeChange('income')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                form.type === 'income' ? 'bg-[#FF6B6B] text-white shadow-md' : 'text-[#6B7280] dark:text-[#FFB3B3] hover:text-[#FF6B6B]'
              }`}>
              <ArrowUpCircle size={15} /> Gelir
            </button>
            <button type="button" id="type-expense" onClick={() => handleTypeChange('expense')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                form.type === 'expense' ? 'bg-red-500 text-white shadow-md' : 'text-[#6B7280] dark:text-[#FFB3B3] hover:text-red-500'
              }`}>
              <ArrowDownCircle size={15} /> Gider
            </button>
          </div>

          <div>
            <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wider mb-1.5 block">Kategori</label>
            <select id="input-category" value={form.category} onChange={e => set('category', e.target.value)} className="input-field">
              {CATEGORIES[form.type].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {form.type === 'expense' && (
            <div>
              <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wider mb-1.5 block">Harcama Tipi</label>
              <div className="flex gap-2">
                {[
                  { val: 'necessary', label: '🏠 Zorunlu', active: 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-400' },
                  { val: 'luxury',    label: '✨ Lüks',    active: 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400' },
                ].map(({ val, label, active }) => (
                  <button key={val} type="button" id={`subtype-${val}`} onClick={() => set('subtype', val)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      form.subtype === val ? active : 'border-[#FFDCC8] dark:border-[#4a1a1a] text-[#9CA3AF] dark:text-[#FF9999] hover:border-[#FFB3B3] dark:hover:border-[#5a1a1a]'
                    }`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wider mb-1.5 block">Miktar (₺)</label>
            <input id="input-amount" type="number" min="0" step="0.01" value={form.amount}
              onChange={e => set('amount', e.target.value)} placeholder="0.00" className="input-field" required />
          </div>

          <div>
            <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wider mb-1.5 block">Açıklama</label>
            <input id="input-description" type="text" value={form.description}
              onChange={e => set('description', e.target.value)} placeholder="İşlem açıklaması..." className="input-field" required />
          </div>

          <div>
            <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wider mb-1.5 block">Tarih</label>
            <input id="input-date" type="date" value={form.date} onChange={e => set('date', e.target.value)} className="input-field" />
          </div>

          {error && <p className="text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">{error}</p>}

          <button type="submit" id="btn-submit-transaction" disabled={loading}
            className="w-full disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-md mt-2"
            style={{ background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>
            {loading
              ? (isEdit ? 'Güncelleniyor...' : 'Ekleniyor...')
              : (isEdit ? '✓ Değişiklikleri Kaydet' : 'İşlemi Ekle ✓')}
          </button>
        </form>
      </div>
    </div>
  )
}
