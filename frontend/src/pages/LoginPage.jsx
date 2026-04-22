import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrendingUp, Eye, EyeOff, User, Lock, LogIn, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function LoginPage() {
  const { login } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const [form, setForm]         = useState({ username: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Kullanıcı adı veya şifre hatalı.')
    } finally {
      setLoading(false)
    }
  }

  const bgStyle = isDark
    ? { background: 'linear-gradient(135deg, #0a0a0a 0%, #140a0a 60%, #1a0f0f 100%)' }
    : { background: 'linear-gradient(135deg, #FFF7ED 0%, #FFF0E4 60%, #FFDCC8 100%)' }

  return (
    <div className="min-h-screen flex" style={bgStyle}>

      {/* ── Sol Panel ── */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-[48%] relative overflow-hidden">
        <div className="absolute inset-0 opacity-25 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #FF6B6B 0%, transparent 55%)' }} />

        <div className="flex items-center gap-4 mb-14">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
            style={{ background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>
            <TrendingUp size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#2D2D2D] dark:text-[#FFF0E4]">Akıllı Harçlık</h1>
            <p className="text-sm font-semibold text-[#FF6B6B]">Öğrenci Finans Koçu</p>
          </div>
        </div>

        <h2 className="text-5xl font-black text-[#2D2D2D] dark:text-[#FFF0E4] leading-tight mb-5">
          Tekrar<br />
          <span className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg,#FF6B6B,#4D96FF)' }}>
            hoş geldin!
          </span>
        </h2>
        <p className="text-[#6B7280] dark:text-[#FFB3B3] text-lg leading-relaxed mb-12">
          Hesabına giriş yap ve finansal durumunun kontrolünü ele al.
        </p>

        <div className="space-y-4">
          {[
            { icon: '📊', title: 'Gelir & Gider Takibi',  desc: 'Tüm işlemlerini tek yerden yönet' },
            { icon: '🧠', title: 'Finans Koçu',            desc: 'Kişiselleştirilmiş tasarruf tavsiyeleri' },
            { icon: '💰', title: 'Bütçe Planlama',         desc: 'Aylık limitini belirle, harca takibinde kal' },
          ].map(({ icon, title, desc }) => (
            <div key={title}
              className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-[#FFDCC8] dark:border-[#4a1a1a] backdrop-blur-sm">
              <span className="text-2xl">{icon}</span>
              <div>
                <p className="text-[#2D2D2D] dark:text-[#FFF0E4] text-sm font-bold">{title}</p>
                <p className="text-[#6B7280] dark:text-[#FFB3B3] text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sağ Panel (Form) ── */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* Mobil Logo */}
          <div className="lg:hidden flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl mb-3"
              style={{ background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>
              <TrendingUp size={30} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-[#2D2D2D] dark:text-[#FFF0E4]">Akıllı Harçlık</h1>
            <p className="text-sm font-semibold text-[#FF6B6B] mt-1">Öğrenci Finans Koçu</p>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-[#141414] border border-[#FFDCC8] dark:border-[#4a1a1a] rounded-3xl p-8 shadow-2xl">

            {/* Başlık */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 bg-[#FFF0E4] dark:bg-[#1a0f0f] border border-[#FFDCC8] dark:border-[#4a1a1a] rounded-full px-3 py-1.5 mb-4">
                <LogIn size={13} className="text-[#FF6B6B]" />
                <span className="text-xs font-semibold text-[#FF6B6B]">Giriş Yap</span>
              </div>
              <h2 className="text-2xl font-black text-[#2D2D2D] dark:text-[#FFF0E4]">Hesabına giriş yap</h2>
              <p className="text-[#6B7280] dark:text-[#FFB3B3] text-sm mt-1">Kullanıcı adın ve şifreni gir</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wide mb-1.5 block">
                  Kullanıcı Adı
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#5a1a1a]" />
                  <input id="input-username" type="text" value={form.username}
                    onChange={e => set('username', e.target.value.toLowerCase())}
                    placeholder="kullanici_adi" className="input-field pl-10"
                    autoFocus required />
                </div>
              </div>

              <div>
                <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wide mb-1.5 block">
                  Şifre
                </label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#5a1a1a]" />
                  <input id="input-password" type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="••••••" className="input-field pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B8C4] hover:text-[#6B7280] dark:hover:text-[#FFB3B3] transition-colors">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">⚠ {error}</p>
                </div>
              )}

              <button type="submit" id="btn-login" disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-bold text-base disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg"
                style={{ background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>
                {loading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <>Giriş Yap <ArrowRight size={18} /></>}
              </button>
            </form>

            {/* Kayıt Ol Linki */}
            <div className="mt-6 pt-6 border-t border-[#FFDCC8] dark:border-[#4a1a1a] text-center">
              <p className="text-[#9CA3AF] dark:text-[#FF9999] text-sm">
                Hesabın yok mu?{' '}
                <Link to="/register" className="font-bold text-[#FF6B6B] hover:text-[#CC4444] transition-colors">
                  Okul mailinle kayıt ol →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
