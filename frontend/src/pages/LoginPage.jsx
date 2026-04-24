import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, User, Lock, LogIn, UserPlus, ArrowRight, Mail, GraduationCap, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const SCHOOL_EMAIL_REGEX = /^[\w.+-]+@[\w.-]+\.(edu\.tr|edu)$/i

export default function LoginPage() {
  const { login, register } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const [tab, setTab] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [regForm, setRegForm] = useState({ displayName: '', username: '', email: '', password: '', confirmPass: '' })

  const setL = (k, v) => setLoginForm(p => ({ ...p, [k]: v }))
  const setR = (k, v) => setRegForm(p => ({ ...p, [k]: v }))

  const emailStatus = !regForm.email ? 'empty'
    : SCHOOL_EMAIL_REGEX.test(regForm.email) ? 'valid' : 'invalid'

  const passMatch = regForm.confirmPass
    ? regForm.password === regForm.confirmPass : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (tab === 'register') {
      if (emailStatus !== 'valid') { setError('Geçerli bir okul e-postası girin. (.edu.tr veya .edu)'); return }
      if (regForm.password !== regForm.confirmPass) { setError('Şifreler eşleşmiyor.'); return }
    }
    setLoading(true)
    try {
      if (tab === 'login') {
        await login(loginForm.username, loginForm.password)
      } else {
        await register(regForm.username, regForm.password, regForm.displayName || regForm.username, regForm.email)
      }
      navigate('/app/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || (tab === 'login' ? 'Kullanıcı adı veya şifre hatalı.' : 'Kayıt sırasında hata oluştu.'))
    } finally {
      setLoading(false)
    }
  }

  const switchTab = (t) => { setTab(t); setError('') }

  const bgStyle = isDark
    ? { background: 'linear-gradient(135deg, #0a0a0a 0%, #0a0a14 60%, #0a0a14 100%)' }
    : { background: 'linear-gradient(135deg, #F9FAFB 0%, #EEF2FF 50%, #F0F7FF 100%)' }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={bgStyle}>
      
      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #4F46E5, transparent 70%)' }} />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #A5B4FC, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-md animate-fade-in">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="relative group cursor-pointer" onClick={() => navigate('/')}>
            <div className="absolute -inset-1 bg-gradient-to-r from-[#4F46E5] to-[#A5B4FC] rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <img src="/logo-karanlik.png" alt="Akıllı Harçlık" className="relative w-20 h-20 rounded-3xl object-contain shadow-2xl mb-4 bg-white dark:bg-[#141414] p-1" />
          </div>
          <h1 className="text-3xl font-black text-[#111827] dark:text-[#EEF2FF] tracking-tight">Akıllı Harçlık</h1>
          <p className="text-sm font-medium text-[#6B7280] dark:text-[#A5B4FC] mt-1.5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Öğrenci Finans Koçu & Bütçe Takibi
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-[#141414]/80 backdrop-blur-xl border border-[#C7D2FE] dark:border-[#1a1a4a] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden transition-all">
          
          {/* Tabs */}
          <div className="flex p-2 gap-1 bg-[#EEF2FF]/30 dark:bg-black/20 m-4 rounded-2xl">
            {[
              { val: 'login',    label: 'Giriş Yap', Icon: LogIn },
              { val: 'register', label: 'Kayıt Ol',  Icon: UserPlus },
            ].map(({ val, label, Icon }) => (
              <button
                key={val}
                onClick={() => switchTab(val)}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                  tab === val
                    ? 'bg-white dark:bg-[#1e1e1e] text-[#4F46E5] shadow-sm scale-[1.02]'
                    : 'text-[#9CA3AF] dark:text-[#818CF8] hover:bg-white/50 dark:hover:bg-white/5'
                }`}
              >
                <Icon size={16} className={tab === val ? 'text-[#4F46E5]' : ''} />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-5">
            {/* Error Message */}
            {error && (
              <div className="animate-shake bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl px-4 py-3 flex items-start gap-3">
                <XCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* ── LOGIN FORM ── */}
            {tab === 'login' && (
              <div className="space-y-5 animate-slide-up">
                <div className="space-y-1.5">
                  <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-bold uppercase tracking-wider ml-1">Kullanıcı Adı</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0B8C4] group-focus-within:text-[#4F46E5] transition-colors">
                      <User size={18} />
                    </div>
                    <input
                      type="text"
                      value={loginForm.username}
                      onChange={e => setL('username', e.target.value.toLowerCase())}
                      placeholder="kullanici_adi"
                      className="input-field pl-12 h-12 text-base font-medium"
                      autoFocus
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-bold uppercase tracking-wider">Şifre</label>
                    <button type="button" className="text-[11px] font-bold text-[#4F46E5] hover:underline">Şifremi Unuttum</button>
                  </div>
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0B8C4] group-focus-within:text-[#4F46E5] transition-colors">
                      <Lock size={18} />
                    </div>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={e => setL('password', e.target.value)}
                      placeholder="••••••••"
                      className="input-field pl-12 pr-12 h-12 text-base font-medium"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B0B8C4] hover:text-[#4F46E5] transition-colors"
                    >
                      {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-1">
                  <input type="checkbox" id="remember" className="w-4 h-4 rounded border-[#C7D2FE] text-[#4F46E5] focus:ring-[#4F46E5]" />
                  <label htmlFor="remember" className="text-sm text-[#6B7280] dark:text-[#A5B4FC] cursor-pointer select-none font-medium">Beni hatırla</label>
                </div>
              </div>
            )}

            {/* ── REGISTER FORM ── */}
            {tab === 'register' && (
              <div className="space-y-4 animate-slide-up">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-bold uppercase tracking-wider ml-1">Ad Soyad</label>
                    <input
                      type="text"
                      value={regForm.displayName}
                      onChange={e => setR('displayName', e.target.value)}
                      placeholder="Can Yılmaz"
                      className="input-field h-11"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-bold uppercase tracking-wider ml-1">Kullanıcı Adı</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0B8C4] font-bold text-sm">@</span>
                      <input
                        type="text"
                        value={regForm.username}
                        onChange={e => setR('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                        placeholder="can_ylz"
                        className="input-field pl-8 h-11"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-bold uppercase tracking-wider ml-1 flex items-center gap-1.5">
                    Okul E-Postası
                    <span className="text-[10px] bg-[#EEF2FF] dark:bg-[#4F46E5]/20 text-[#4F46E5] px-1.5 py-0.5 rounded-md font-black">ZORUNLU</span>
                  </label>
                  <div className="relative group">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0B8C4] group-focus-within:text-[#4F46E5]" />
                    <input
                      type="email"
                      value={regForm.email}
                      onChange={e => setR('email', e.target.value)}
                      placeholder="ogrenci@edu.tr"
                      className={`input-field pl-12 pr-10 h-11 ${
                        emailStatus === 'valid' ? 'border-green-500 focus:border-green-500 focus:ring-green-500' :
                        emailStatus === 'invalid' ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                      }`}
                      required
                    />
                    {emailStatus === 'valid' && <CheckCircle size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" />}
                    {emailStatus === 'invalid' && <XCircle size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" />}
                  </div>
                  {emailStatus === 'invalid' && <p className="text-red-500 text-[11px] font-bold ml-1">! Lütfen .edu veya .edu.tr uzantılı mail kullanın</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-bold uppercase tracking-wider ml-1">Şifre</label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={regForm.password}
                      onChange={e => setR('password', e.target.value)}
                      placeholder="••••••••"
                      className="input-field h-11"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-bold uppercase tracking-wider ml-1">Onayla</label>
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={regForm.confirmPass}
                      onChange={e => setR('confirmPass', e.target.value)}
                      placeholder="••••••••"
                      className={`input-field h-11 ${passMatch === false ? 'border-red-500' : passMatch === true ? 'border-green-500' : ''}`}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (tab === 'register' && emailStatus !== 'valid')}
              className="w-full relative group h-14 mt-4 overflow-hidden rounded-2xl font-black text-white shadow-[0_10px_30px_rgba(79,70,229,0.3)] disabled:shadow-none transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#4F46E5] to-[#A5B4FC] group-hover:scale-105 transition-transform duration-500"></div>
              <div className="relative flex items-center justify-center gap-3">
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span className="text-lg tracking-wide">{tab === 'login' ? 'Giriş Yap' : 'Hesaba Katıl'}</span>
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          {/* Footer Info */}
          <div className="px-8 pb-8 flex flex-col items-center gap-4">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#C7D2FE] dark:via-[#1a1a4a] to-transparent"></div>
            <button
              onClick={() => navigate('/')}
              className="group flex items-center gap-2 text-sm font-bold text-[#6B7280] dark:text-[#A5B4FC] hover:text-[#4F46E5] transition-colors"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Ana sayfaya geri dön
            </button>
          </div>
        </div>

        {/* Legal Links */}
        <div className="mt-8 flex justify-center gap-6">
          <button className="text-[11px] font-bold text-[#9CA3AF] hover:text-[#4F46E5] uppercase tracking-widest transition-colors">Gizlilik Politikası</button>
          <button className="text-[11px] font-bold text-[#9CA3AF] hover:text-[#4F46E5] uppercase tracking-widest transition-colors">Kullanım Şartları</button>
        </div>
      </div>
    </div>
  )
}
