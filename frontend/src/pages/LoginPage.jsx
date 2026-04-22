import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Eye, EyeOff, User, Lock, LogIn, UserPlus, ArrowRight, Mail, GraduationCap, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const SCHOOL_EMAIL_REGEX = /^[\w.+-]+@[\w.-]+\.(edu\.tr|edu)$/i

export default function LoginPage() {
  const { login, register } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const [tab, setTab]           = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [regForm, setRegForm]     = useState({ displayName: '', username: '', email: '', password: '', confirmPass: '' })

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

      {/* BG deco */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #4F46E5, transparent 70%)' }} />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #A5B4FC, transparent 70%)' }} />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl mb-4"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}>
            <TrendingUp size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-[#111827] dark:text-[#EEF2FF]">Akıllı Harçlık</h1>
          <p className="text-sm font-semibold text-[#4F46E5] mt-1">Öğrenci Finans Koçu</p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-[#141414] border border-[#C7D2FE] dark:border-[#1a1a4a] rounded-3xl shadow-2xl overflow-hidden">

          {/* Tabs */}
          <div className="flex border-b border-[#C7D2FE] dark:border-[#1a1a4a]">
            {[
              { val: 'login',    label: 'Giriş Yap', Icon: LogIn    },
              { val: 'register', label: 'Kayıt Ol',  Icon: UserPlus },
            ].map(({ val, label, Icon }) => (
              <button key={val} onClick={() => switchTab(val)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-bold transition-all ${
                  tab === val
                    ? 'text-[#4F46E5] border-b-2 border-[#4F46E5] bg-[#EEF2FF]/50 dark:bg-[#0f0f1a]/50'
                    : 'text-[#9CA3AF] dark:text-[#818CF8] hover:text-[#4F46E5]'
                }`}>
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-7 space-y-4">

            {/* ── GİRİŞ FORMU ── */}
            {tab === 'login' && (
              <>
                <div>
                  <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Kullanıcı Adı</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#251a5a]" />
                    <input id="input-username" type="text" value={loginForm.username}
                      onChange={e => setL('username', e.target.value.toLowerCase())}
                      placeholder="kullanici_adi" className="input-field pl-10" autoFocus required />
                  </div>
                </div>
                <div>
                  <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Şifre</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#251a5a]" />
                    <input id="input-password" type={showPass ? 'text' : 'password'} value={loginForm.password}
                      onChange={e => setL('password', e.target.value)}
                      placeholder="••••••" className="input-field pl-10 pr-10" required />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B8C4] hover:text-[#6B7280] transition-colors">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* ── KAYIT FORMU ── */}
            {tab === 'register' && (
              <>
                <div>
                  <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Ad Soyad</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#251a5a]" />
                    <input id="input-displayName" type="text" value={regForm.displayName}
                      onChange={e => setR('displayName', e.target.value)}
                      placeholder="Adınız Soyadınız" className="input-field pl-10" autoFocus />
                  </div>
                </div>

                <div>
                  <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Kullanıcı Adı</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] text-sm font-bold">@</span>
                    <input id="input-reg-username" type="text" value={regForm.username}
                      onChange={e => setR('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="kullanici_adi" className="input-field pl-8" maxLength={30} required />
                  </div>
                </div>

                <div>
                  <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                    <GraduationCap size={12} className="text-[#A5B4FC]" />
                    Okul E-Postası <span className="text-[#4F46E5] font-bold normal-case text-xs">*zorunlu</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#251a5a]" />
                    <input id="input-email" type="email" value={regForm.email}
                      onChange={e => setR('email', e.target.value)}
                      placeholder="adi@universite.edu.tr"
                      className={`input-field pl-10 pr-9 ${
                        emailStatus === 'valid'   ? 'border-green-400' :
                        emailStatus === 'invalid' ? 'border-red-400'   : ''
                      }`} required />
                    {emailStatus === 'valid'   && <CheckCircle size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />}
                    {emailStatus === 'invalid' && <XCircle     size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400" />}
                  </div>
                  {emailStatus === 'invalid' && <p className="text-red-500 text-xs mt-1.5">⚠ .edu.tr veya .edu uzantılı okul maili girin</p>}
                  {emailStatus === 'valid'   && <p className="text-green-600 dark:text-green-400 text-xs mt-1.5">✓ Okul e-postası onaylandı</p>}
                  <p className="text-[#B0B8C4] dark:text-[#251a5a] text-xs mt-1.5 flex items-center gap-1">
                    <GraduationCap size={11} className="text-[#A5B4FC]" />
                    Yalnızca öğrenci ve öğretim üyelerine açıktır
                  </p>
                </div>

                <div>
                  <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Şifre</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#251a5a]" />
                    <input id="input-reg-password" type={showPass ? 'text' : 'password'} value={regForm.password}
                      onChange={e => setR('password', e.target.value)}
                      placeholder="En az 6 karakter" className="input-field pl-10 pr-10" required />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B8C4] hover:text-[#6B7280] transition-colors">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Şifre Tekrar</label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#251a5a]" />
                    <input id="input-confirmPass" type={showPass ? 'text' : 'password'} value={regForm.confirmPass}
                      onChange={e => setR('confirmPass', e.target.value)}
                      placeholder="••••••" className={`input-field pl-10 pr-9 ${
                        passMatch === true ? 'border-green-400' : passMatch === false ? 'border-red-400' : ''
                      }`} required />
                    {passMatch === true  && <CheckCircle size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />}
                    {passMatch === false && <XCircle     size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400" />}
                  </div>
                  {passMatch === false && <p className="text-red-500 text-xs mt-1.5">Şifreler eşleşmiyor</p>}
                </div>
              </>
            )}

            {/* Hata */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                <p className="text-red-600 dark:text-red-400 text-sm">⚠ {error}</p>
              </div>
            )}

            {/* Submit */}
            <button type="submit" id="btn-submit" disabled={loading || (tab === 'register' && emailStatus !== 'valid')}
              className="w-full py-3.5 rounded-xl text-white font-bold text-base disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg mt-2 transition-all hover:shadow-xl hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}>
              {loading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <>{tab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'} <ArrowRight size={18} /></>
              }
            </button>
          </form>
        </div>

        {/* Geri dön */}
        <p className="text-center text-sm text-[#9CA3AF] dark:text-[#818CF8] mt-5">
          ← <button onClick={() => navigate('/')} className="font-semibold text-[#4F46E5] hover:underline transition-colors">
            Ana sayfaya dön
          </button>
        </p>
      </div>
    </div>
  )
}
