import { useState } from 'react'
import { TrendingUp, Eye, EyeOff, User, Lock, UserPlus, LogIn, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, register } = useAuth()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ username: '', password: '', displayName: '', confirmPass: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (tab === 'register' && form.password !== form.confirmPass) {
      setError('Şifreler eşleşmiyor.'); return
    }
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(form.username, form.password)
      } else {
        await register(form.username, form.password, form.displayName || form.username)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Bir hata oluştu. Tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #F1F8E9 0%, #E8F5E9 60%, #C8E6C9 100%)' }}>

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #66BB6A 0%, transparent 60%)' }} />

        {/* Logo */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
            style={{ background: 'linear-gradient(135deg, #2E7D32, #66BB6A)' }}>
            <TrendingUp size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#263238]">Akıllı Harçlık</h1>
            <p className="text-sm font-medium" style={{ color: '#2E7D32' }}>Finans Koçu</p>
          </div>
        </div>

        <h2 className="text-4xl font-black text-[#263238] leading-tight mb-4">
          Paranızı <span className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg,#2E7D32,#66BB6A)' }}>akıllıca</span><br />
          yönetin
        </h2>
        <p className="text-[#546E7A] text-lg mb-12 leading-relaxed">
          Gelir ve giderlerinizi takip edin, finansal koçunuzdan kişiselleştirilmiş tavsiyeler alın.
        </p>

        <div className="space-y-4">
          {[
            { icon: '📊', title: 'Gelişmiş Analizler', desc: 'Harcama alışkanlıklarınızı grafiklerle görün' },
            { icon: '🧠', title: 'Finans Koçu', desc: 'Yapay zeka destekli finansal tavsiyeler' },
            { icon: '💰', title: 'Bütçe Takibi', desc: 'Aylık limitinizi belirleyin ve takip edin' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4 p-3 rounded-xl bg-white/60 border border-[#C8E6C9]">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-[#263238] text-sm font-semibold">{title}</p>
                <p className="text-[#546E7A] text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2E7D32, #66BB6A)' }}>
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="text-[#263238] font-bold text-lg">Akıllı Harçlık &amp; Finans Koçu</span>
          </div>

          <div className="bg-white border border-[#C8E6C9] rounded-3xl p-8 shadow-lg">
            {/* Tabs */}
            <div className="flex bg-[#F1F8E9] rounded-2xl p-1 mb-8 border border-[#C8E6C9]">
              {[
                { val: 'login', label: 'Giriş Yap', Icon: LogIn },
                { val: 'register', label: 'Kayıt Ol', Icon: UserPlus },
              ].map(({ val, label, Icon }) => (
                <button key={val} onClick={() => { setTab(val); setError('') }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    tab === val ? 'text-white shadow-md' : 'text-[#546E7A] hover:text-[#2E7D32]'
                  }`}
                  style={tab === val ? { background: 'linear-gradient(135deg,#2E7D32,#66BB6A)' } : {}}>
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <div>
                  <label className="text-[#546E7A] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Ad Soyad</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#90A4AE]" />
                    <input id="input-displayName" type="text" value={form.displayName}
                      onChange={e => set('displayName', e.target.value)}
                      placeholder="Adınız Soyadınız" className="input-field pl-10" />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[#546E7A] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Kullanıcı Adı</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#90A4AE]" />
                  <input id="input-username" type="text" value={form.username}
                    onChange={e => set('username', e.target.value)}
                    placeholder="kullanici_adi" className="input-field pl-10" required />
                </div>
              </div>

              <div>
                <label className="text-[#546E7A] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Şifre</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#90A4AE]" />
                  <input id="input-password" type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="••••••" className="input-field pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#90A4AE] hover:text-[#546E7A] transition-colors">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {tab === 'register' && (
                <div>
                  <label className="text-[#546E7A] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Şifre Tekrar</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#90A4AE]" />
                    <input id="input-confirmPass" type={showPass ? 'text' : 'password'} value={form.confirmPass}
                      onChange={e => set('confirmPass', e.target.value)}
                      placeholder="••••••" className="input-field pl-10" required />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button type="submit" id="btn-submit-auth" disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-bold disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg mt-2"
                style={{ background: 'linear-gradient(135deg, #2E7D32, #66BB6A)' }}>
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>{tab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'} <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            {tab === 'login' && (
              <p className="text-center text-[#78909C] text-xs mt-6">
                Hesabın yok mu?{' '}
                <button onClick={() => setTab('register')} className="font-semibold transition-colors" style={{ color: '#2E7D32' }}>
                  Kayıt ol
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
