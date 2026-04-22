import { useState } from 'react'
import { TrendingUp, Eye, EyeOff, User, Lock, UserPlus, LogIn, ArrowRight, Mail, GraduationCap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

// Okul mailleri kalıbı
const SCHOOL_EMAIL_REGEX = /^[\w.+-]+@[\w.-]+\.(edu\.tr|edu)$/i

export default function LoginPage() {
  const { login, register } = useAuth()
  const { isDark } = useTheme()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({
    username: '', password: '', displayName: '', email: '', confirmPass: ''
  })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const isSchoolEmail = (v) => SCHOOL_EMAIL_REGEX.test(v)
  const emailStatus = !form.email
    ? 'empty'
    : isSchoolEmail(form.email) ? 'valid' : 'invalid'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (tab === 'register') {
      if (!isSchoolEmail(form.email)) {
        setError('Geçerli bir okul e-postası girin. (.edu.tr veya .edu uzantılı)')
        return
      }
      if (form.password !== form.confirmPass) {
        setError('Şifreler eşleşmiyor.'); return
      }
    }

    setLoading(true)
    try {
      if (tab === 'login') {
        await login(form.username, form.password)
      } else {
        await register(form.username, form.password, form.displayName || form.username, form.email)
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Bir hata oluştu. Tekrar deneyin.')
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
      <div className="hidden lg:flex flex-col justify-center px-16 w-[45%] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #FF6B6B 0%, transparent 60%)' }} />

        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
            style={{ background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>
            <TrendingUp size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#2D2D2D] dark:text-[#FFF0E4]">Akıllı Harçlık</h1>
            <p className="text-sm font-medium text-[#FF6B6B]">Öğrenci Finans Koçu</p>
          </div>
        </div>

        <h2 className="text-4xl font-black text-[#2D2D2D] dark:text-[#FFF0E4] leading-tight mb-4">
          Finansını{' '}
          <span className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg,#FF6B6B,#4D96FF)' }}>
            akıllıca
          </span><br />yönet
        </h2>
        <p className="text-[#6B7280] dark:text-[#FFB3B3] text-lg mb-12 leading-relaxed">
          Okul mailinizle kaydolun, gelir–gider takibinizi başlatın ve finans koçundan kişisel tavsiyeler alın.
        </p>

        {/* Feature Bullets */}
        <div className="space-y-3">
          {[
            { icon: '🎓', title: 'Sadece Öğrencilere Özel', desc: 'Okul e-posta doğrulaması ile güvenli kayıt' },
            { icon: '📊', title: 'Gelişmiş Analizler',      desc: 'Harcama alışkanlıklarınızı grafiklerle görün' },
            { icon: '🧠', title: 'Finans Koçu',             desc: 'Yapay zeka destekli finansal tavsiyeler' },
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

      {/* ── Sağ Panel (Form) ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Mobil Logo */}
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
                { val: 'login',    label: 'Giriş Yap', Icon: LogIn },
                { val: 'register', label: 'Kayıt Ol',  Icon: UserPlus },
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

              {/* Ad Soyad (sadece kayıt) */}
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

              {/* Kullanıcı Adı */}
              <div>
                <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Kullanıcı Adı</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#5a1a1a]" />
                  <input id="input-username" type="text" value={form.username}
                    onChange={e => set('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="kullanici_adi" className="input-field pl-10" required />
                </div>
              </div>

              {/* Okul Maili (sadece kayıt) */}
              {tab === 'register' && (
                <div>
                  <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1.5 ">
                    <GraduationCap size={12} className="text-[#FF6B6B]" />
                    Okul E-Postası <span className="text-[#FF6B6B] font-bold">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#5a1a1a]" />
                    <input id="input-email" type="email" value={form.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="adiniz@universiteniz.edu.tr"
                      className={`input-field pl-10 pr-10 ${
                        emailStatus === 'valid'   ? 'border-green-400 focus:border-green-400' :
                        emailStatus === 'invalid' ? 'border-red-400 focus:border-red-400' : ''
                      }`}
                      required />
                    {/* Durum ikonları */}
                    {emailStatus === 'valid' && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500 text-sm">✓</span>
                    )}
                    {emailStatus === 'invalid' && (
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 text-sm">✗</span>
                    )}
                  </div>
                  {emailStatus === 'invalid' && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 flex items-center gap-1">
                      ⚠ Geçerli bir okul maili girin (.edu.tr veya .edu)
                    </p>
                  )}
                  {emailStatus === 'valid' && (
                    <p className="text-green-600 dark:text-green-400 text-xs mt-1.5 flex items-center gap-1">
                      ✓ Okul e-postası geçerli
                    </p>
                  )}
                  {/* Not banner */}
                  <div className="mt-2 flex items-start gap-2 p-2.5 rounded-xl bg-[#FFF0E4] dark:bg-[#1a0f0f] border border-[#FFDCC8] dark:border-[#4a1a1a]">
                    <GraduationCap size={14} className="text-[#FF6B6B] flex-shrink-0 mt-0.5" />
                    <p className="text-[#6B7280] dark:text-[#FFB3B3] text-xs leading-relaxed">
                      Bu uygulama yalnızca <span className="text-[#FF6B6B] font-semibold">öğrenci ve öğretim üyelerine</span> açıktır.
                      Lütfen kurumsal okul mailinizi kullanın.
                    </p>
                  </div>
                </div>
              )}

              {/* Şifre */}
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

              {/* Şifre Tekrar (sadece kayıt) */}
              {tab === 'register' && (
                <div>
                  <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Şifre Tekrar</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#5a1a1a]" />
                    <input id="input-confirmPass" type={showPass ? 'text' : 'password'} value={form.confirmPass}
                      onChange={e => set('confirmPass', e.target.value)}
                      placeholder="••••••" className="input-field pl-10" required />
                  </div>
                  {form.confirmPass && form.password !== form.confirmPass && (
                    <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">⚠ Şifreler eşleşmiyor</p>
                  )}
                </div>
              )}

              {/* Hata */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Submit */}
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
                <button onClick={() => setTab('register')} className="font-semibold text-[#FF6B6B] transition-colors">
                  Okul mailinle kayıt ol →
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
