import { useState } from 'react'
import { User, Mail, Lock, Save, Eye, EyeOff, ArrowLeft, Palette, CheckCircle, AlertCircle, AtSign } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/api'

const COLORS = [
  { label: 'Mor',     val: '#7c3aed' },
  { label: 'Mavi',    val: '#3b82f6' },
  { label: 'Yeşil',   val: '#10b981' },
  { label: 'Kırmızı', val: '#ef4444' },
  { label: 'Turuncu', val: '#f97316' },
  { label: 'Pembe',   val: '#ec4899' },
  { label: 'Cyan',    val: '#06b6d4' },
  { label: 'Sarı',    val: '#eab308' },
]

const initials = (name = '') =>
  name.split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2) || 'K'

export default function Profile() {
  const { user, updateUser } = useAuth()

  const [tab, setTab]       = useState('profile') // 'profile' | 'username' | 'password'
  const [success, setSuccess] = useState('')
  const [error, setError]   = useState('')
  const [saving, setSaving] = useState(false)
  const [showOld, setShowOld] = useState(false)
  const [showNew, setShowNew] = useState(false)

  const [profileForm, setProfileForm] = useState({
    displayName: user?.displayName || '',
    email:       user?.email       || '',
    avatarColor: user?.avatarColor || '#7c3aed',
  })

  const [newUsername, setNewUsername] = useState('')
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' })

  const switchTab = (t) => { setTab(t); setError(''); setSuccess('') }

  const notify = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccess('') }
    else { setSuccess(msg); setError(''); setTimeout(() => setSuccess(''), 4000) }
  }

  // --- Profil Kaydet ---
  const handleProfileSave = async (e) => {
    e.preventDefault()
    setSaving(true); setError(''); setSuccess('')
    try {
      const res = await authService.updateProfile(profileForm)
      updateUser(res.data)
      notify('Profil başarıyla güncellendi!')
    } catch (err) {
      notify(err.response?.data?.error || 'Bir hata oluştu.', true)
    } finally { setSaving(false) }
  }

  // --- Kullanıcı Adı Değiştir ---
  const handleUsernameChange = async (e) => {
    e.preventDefault()
    if (!newUsername.trim()) { notify('Yeni kullanıcı adı girin.', true); return }
    setSaving(true); setError(''); setSuccess('')
    try {
      const res = await authService.changeUsername(newUsername.trim())
      updateUser(res.data)
      setNewUsername('')
      notify('Kullanıcı adı başarıyla değiştirildi!')
    } catch (err) {
      notify(err.response?.data?.error || 'Bir hata oluştu.', true)
    } finally { setSaving(false) }
  }

  // --- Şifre Değiştir ---
  const handlePasswordSave = async (e) => {
    e.preventDefault()
    if (passForm.newPassword !== passForm.confirmPassword) { notify('Yeni şifreler eşleşmiyor.', true); return }
    setSaving(true); setError(''); setSuccess('')
    try {
      await authService.changePassword(passForm.oldPassword, passForm.newPassword)
      notify('Şifre başarıyla değiştirildi!')
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      notify(err.response?.data?.error || 'Bir hata oluştu.', true)
    } finally { setSaving(false) }
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/" className="p-2 text-gray-500 hover:text-white hover:bg-gray-800 rounded-xl transition-all">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h2 className="text-3xl font-black text-white">Profil Ayarları</h2>
          <p className="text-gray-400 text-sm mt-1">Hesap bilgilerinizi düzenleyin</p>
        </div>
      </div>

      {/* Avatar Card */}
      <div className="glass-card p-6 flex items-center gap-6">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-3xl font-black text-white shadow-xl flex-shrink-0"
             style={{
               background: `linear-gradient(135deg, ${profileForm.avatarColor}, ${profileForm.avatarColor}99)`,
               boxShadow:  `0 12px 24px ${profileForm.avatarColor}40`,
             }}>
          {initials(profileForm.displayName || user?.displayName)}
        </div>
        <div>
          <p className="text-white font-bold text-xl">{profileForm.displayName || user?.displayName}</p>
          <p className="text-gray-400 text-sm">@{user?.username}</p>
          <p className="text-gray-600 text-xs mt-1">
            Üyelik: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '—'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900/60 border border-gray-800/50 rounded-xl p-1 w-fit flex-wrap">
        {[
          ['profile',  '👤 Profil'],
          ['username', '🔤 Kullanıcı Adı'],
          ['password', '🔒 Şifre'],
        ].map(([val, label]) => (
          <button key={val} onClick={() => switchTab(val)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === val ? 'text-white shadow-md' : 'text-gray-400 hover:text-white'
            }`}
            style={tab === val ? { background: 'linear-gradient(135deg,#7c3aed,#6366f1)' } : {}}>
            {label}
          </button>
        ))}
      </div>

      {/* Bildirimler */}
      {success && (
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3">
          <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
          <p className="text-emerald-300 text-sm">{success}</p>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/30 rounded-xl px-4 py-3">
          <AlertCircle size={16} className="text-rose-400 flex-shrink-0" />
          <p className="text-rose-400 text-sm">{error}</p>
        </div>
      )}

      {/* ─── Tab: Profil ─── */}
      {tab === 'profile' && (
        <form onSubmit={handleProfileSave} className="glass-card p-6 space-y-5">
          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5 block">Ad Soyad</label>
            <div className="relative">
              <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input id="input-profile-name" type="text" value={profileForm.displayName}
                onChange={e => setProfileForm(p => ({ ...p, displayName: e.target.value }))}
                placeholder="Adınız Soyadınız" className="input-field pl-10" />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5 block">E-posta</label>
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input id="input-profile-email" type="email" value={profileForm.email}
                onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                placeholder="email@example.com" className="input-field pl-10" />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-2">
              <Palette size={12} /> Avatar Rengi
            </label>
            <div className="flex flex-wrap gap-3 mt-2">
              {COLORS.map(({ val, label }) => (
                <button key={val} type="button" title={label}
                  onClick={() => setProfileForm(p => ({ ...p, avatarColor: val }))}
                  className={`w-9 h-9 rounded-xl transition-all hover:scale-110 ${
                    profileForm.avatarColor === val ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : ''
                  }`}
                  style={{ background: `linear-gradient(135deg, ${val}, ${val}88)` }} />
              ))}
            </div>
          </div>

          <button type="submit" id="btn-save-profile" disabled={saving}
            className="btn-primary disabled:opacity-50 py-3 w-full justify-center">
            {saving
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><Save size={15} /> Değişiklikleri Kaydet</>}
          </button>
        </form>
      )}

      {/* ─── Tab: Kullanıcı Adı ─── */}
      {tab === 'username' && (
        <form onSubmit={handleUsernameChange} className="glass-card p-6 space-y-5">
          {/* Mevcut kullanıcı adı */}
          <div className="p-4 bg-gray-800/60 rounded-2xl">
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide mb-1">Mevcut Kullanıcı Adı</p>
            <p className="text-white font-bold text-lg">@{user?.username}</p>
          </div>

          {/* Bilgi notu */}
          <div className="flex items-start gap-3 p-4 bg-blue-500/8 border border-blue-500/20 rounded-2xl">
            <AlertCircle size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-blue-300 text-sm leading-relaxed">
              Sadece küçük harf, rakam ve alt çizgi (<span className="font-mono text-blue-200">_</span>) kullanabilirsiniz. Min. 3, max. 30 karakter.
            </p>
          </div>

          <div>
            <label className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5 block">
              Yeni Kullanıcı Adı
            </label>
            <div className="relative">
              <AtSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                id="input-new-username"
                type="text"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="yeni_kullanici_adi"
                className="input-field pl-10 font-mono"
                maxLength={30}
              />
            </div>
            {newUsername && (
              <p className={`text-xs mt-1.5 flex items-center gap-1 ${newUsername.length >= 3 ? 'text-emerald-500' : 'text-gray-500'}`}>
                {newUsername.length >= 3 ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
                {newUsername.length}/30 karakter{newUsername.length < 3 && ' (min. 3)'}
              </p>
            )}
          </div>

          <button type="submit" id="btn-change-username"
            disabled={saving || newUsername.length < 3}
            className="btn-primary disabled:opacity-50 py-3 w-full justify-center">
            {saving
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><AtSign size={15} /> Kullanıcı Adını Değiştir</>}
          </button>
        </form>
      )}

      {/* ─── Tab: Şifre ─── */}
      {tab === 'password' && (
        <form onSubmit={handlePasswordSave} className="glass-card p-6 space-y-5">
          {[
            { id:'input-old-pass',     key:'oldPassword',     label:'Mevcut Şifre',      show:showOld, toggle:()=>setShowOld(!showOld) },
            { id:'input-new-pass',     key:'newPassword',     label:'Yeni Şifre',         show:showNew, toggle:()=>setShowNew(!showNew) },
            { id:'input-confirm-pass', key:'confirmPassword', label:'Yeni Şifre Tekrar',  show:showNew, toggle:()=>setShowNew(!showNew) },
          ].map(({ id, key, label, show, toggle }) => (
            <div key={key}>
              <label className="text-gray-400 text-xs font-semibold uppercase tracking-wide mb-1.5 block">{label}</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id={id} type={show ? 'text' : 'password'}
                  value={passForm[key]}
                  onChange={e => setPassForm(p => ({ ...p, [key]: e.target.value }))}
                  placeholder="••••••" className="input-field pl-10 pr-10" required />
                <button type="button" onClick={toggle}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}

          <button type="submit" id="btn-save-password" disabled={saving}
            className="btn-primary disabled:opacity-50 py-3 w-full justify-center">
            {saving
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <><Lock size={15} /> Şifreyi Değiştir</>}
          </button>
        </form>
      )}
    </div>
  )
}
