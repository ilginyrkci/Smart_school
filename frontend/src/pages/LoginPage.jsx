import { useState } from 'react'
import { TrendingUp, Eye, EyeOff, User, Lock, UserPlus, LogIn, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function LoginPage() {
  const { login, register } = useAuth()
  const { isDark } = useTheme()
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

  const bgStyle = isDark
    ? { background: 'linear-gradient(135deg, #0a0a0a 0%, #0f0f0f 60%, #141414 100%)' }
    : { background: 'linear-gradient(135deg, #FFF7ED 0%, #FFF0E4 60%, #FFDCC8 100%)' }

  return (
    <div className="min-h-screen flex" style={bgStyle}>

      {/* Left Panel */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #4D96FF 0%, transparent 60%)' }} />

        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
            style={{ background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>
            <TrendingUp size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#2D2D2D] dark:text-[#FFF0E4]">Akıllı Harçlık</h1>
            <p className="text-sm font-medium text-[#FF6B6B] dark:text-[#4D96FF]">Finans Koçu</p>
          </div>
        </div>

        <h2 className="text-4xl font-black text-[#2D2D2D] dark:text-[#FFF0E4] leading-tight mb-4">
          Paranızı <span className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg,#FF6B6B,#4D96FF)' }}>akıllıca</span><br />
          yönetin
        </h2>
        <p className="text-[#6B7280] dark:text-[#FFB3B3] text-lg mb-12 leading-relaxed">
          Gelir ve giderlerinizi takip edin, finansal koçunuzdan kişiselleştirilmiş tavsiyeler alın.
        </p>

        <div className="space-y-4">
          {[
            { icon: '📊', title: 'Gelişmiş Analizler', desc: 'Harcama alışkanlıklarınızı grafiklerle görün' },
            { icon: '🧠', title: 'Finans Koçu', desc: 'Yapay zeka destekli finansal tavsiyeler' },
            { icon: '💰', title: 'Bütçe Takibi', desc: 'Aylık limitinizi belirleyin ve takip edin' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex items-center gap-4 p-3 rounded-xl bg-white/60 dark:bg-[#141414]/60 border border-[#FFDCC8] dark:border-[#4a1a1a]">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-[#2D2D2D] dark:text-[#FFF0E4] text-sm font-semibold">{title}</p>
                <p className="text-[#6B7280] dark:text-[#FFB3B3] text-xs">{desc}</p>
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
              style={{ background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>
              <TrendingUp size={20} className="text-white" />
            </div>
            <span className="text-[#2D2D2D] dark:text-[#FFF0E4] font-bold text-lg">Akıllı Harçlık</span>
          </div>

          <div className="bg-white dark:bg-[#141414] border border-[#FFDCC8] dark:border-[#4a1a1a] rounded-3xl p-8 shadow-lg">
            {/* Tabs */}
            <div className="flex bg-[#FFF7ED] dark:bg-[#0a0a0a] rounded-2xl p-1 mb-8 border border-[#FFDCC8] dark:border-[#4a1a1a]">
              {[
                { val: 'login', label: 'Giriş Yap', Icon: LogIn },
                { val: 'register', label: 'Kayıt Ol', Icon: UserPlus },
              ].map(({ val, label, Icon }) => (
                <button key={val} onClick={() => { setTab(val); setError('') }}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    tab === val ? 'text-white shadow-md' : 'text-[#6B7280] dark:text-[#FFB3B3] hover:text-[#FF6B6B]'
                  }`}
                  style={tab === val ? { background: 'linear-gradient(135deg,#FF6B6B,#4D96FF)' } : {}}>
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'register' && (
                <div>
                  <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Ad Soyad</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#5a1a1a]" />
                    <input id="input-displayName" type="text" value={form.displayName}
                      onChange={e => set('displayName', e.target.value)}
                      placeholder="Adınız Soyadınız" className="input-field pl-10" />
                  </div>
                </div>
              )}

              <div>
                <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Kullanıcı Adı</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#5a1a1a]" />
                  <input id="input-username" type="text" value={form.username}
                    onChange={e => set('username', e.target.value)}
                    placeholder="kullanici_adi" className="input-field pl-10" required />
                </div>
              </div>

              <div>
                <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Şifre</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#5a1a1a]" />
                  <input id="input-password" type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="••••••" className="input-field pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#5a1a1a] hover:text-[#6B7280] transition-colors">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {tab === 'register' && (
                <div>
                  <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Şifre Tekrar</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#5a1a1a]" />
                    <input id="input-confirmPass" type={showPass ? 'text' : 'password'} value={form.confirmPass}
                      onChange={e => set('confirmPass', e.target.value)}
                      placeholder="••••••" className="input-field pl-10" required />
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              <button type="submit" id="btn-submit-auth" disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-bold disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg mt-2"
                style={{ background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>
                {loading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <>{tab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'} <ArrowRight size={16} /></>
                }
              </button>
            </form>

            {tab === 'login' && (
              <p className="text-center text-[#9CA3AF] dark:text-[#FF9999] text-xs mt-6">
                Hesabın yok mu?{' '}
                <button onClick={() => setTab('register')} className="font-semibold text-[#FF6B6B] dark:text-[#4D96FF] transition-colors">
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
