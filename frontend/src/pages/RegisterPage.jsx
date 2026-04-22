import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TrendingUp, Eye, EyeOff, User, Lock, UserPlus, ArrowRight, Mail, GraduationCap, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const SCHOOL_EMAIL_REGEX = /^[\w.+-]+@[\w.-]+\.(edu\.tr|edu)$/i

export default function RegisterPage() {
  const { register } = useAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    displayName: '', username: '', email: '', password: '', confirmPass: ''
  })
  const [showPass, setShowPass]   = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const emailStatus = !form.email ? 'empty'
    : SCHOOL_EMAIL_REGEX.test(form.email) ? 'valid' : 'invalid'

  const passMatch = form.confirmPass
    ? form.password === form.confirmPass
    : null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (emailStatus !== 'valid') {
      setError('Geçerli bir okul e-postası girin. (.edu.tr veya .edu uzantılı)'); return
    }
    if (form.password !== form.confirmPass) {
      setError('Şifreler eşleşmiyor.'); return
    }
    setLoading(true)
    try {
      await register(form.username, form.password, form.displayName || form.username, form.email)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Kayıt sırasında hata oluştu. Tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  const bgStyle = isDark
    ? { background: 'linear-gradient(135deg, #0a0a0a 0%, #0a0a14 60%, #0a0a14 100%)' }
    : { background: 'linear-gradient(135deg, #F9FAFB 0%, #F0F7FF 60%, #EEF2FF 100%)' }

  return (
    <div className="min-h-screen flex" style={bgStyle}>

      {/* ── Sol Panel ── */}
      <div className="hidden lg:flex flex-col justify-center px-16 w-[48%] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle at 70% 50%, #A5B4FC 0%, transparent 55%)' }} />

        <div className="flex items-center gap-4 mb-12">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}>
            <TrendingUp size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-[#111827] dark:text-[#EEF2FF]">Akıllı Harçlık</h1>
            <p className="text-sm font-semibold text-[#A5B4FC]">Öğrenci Finans Koçu</p>
          </div>
        </div>

        <h2 className="text-5xl font-black text-[#111827] dark:text-[#EEF2FF] leading-tight mb-5">
          Aramıza<br />
          <span className="text-transparent bg-clip-text"
            style={{ backgroundImage: 'linear-gradient(135deg,#A5B4FC,#4F46E5)' }}>
            katıl!
          </span>
        </h2>
        <p className="text-[#6B7280] dark:text-[#A5B4FC] text-lg leading-relaxed mb-10">
          Okul e-postanla ücretsiz kayıt ol ve finansal özgürlüğüne doğru ilk adımı at.
        </p>

        {/* Adımlar */}
        <div className="space-y-3">
          {[
            { step: '01', title: 'Okul mailinle kayıt ol', desc: 'Kurumsal .edu.tr veya .edu mailin gerekli' },
            { step: '02', title: 'İlk işlemini ekle',      desc: 'Gelir ve giderlerini kaydetmeye başla' },
            { step: '03', title: 'Koçunla tanış',          desc: 'Kişisel finansal analiz ve tavsiyeler al' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="flex items-center gap-4 p-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-[#C7D2FE] dark:border-[#1a1a4a]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #A5B4FC, #4F46E5)' }}>
                {step}
              </div>
              <div>
                <p className="text-[#111827] dark:text-[#EEF2FF] text-sm font-bold">{title}</p>
                <p className="text-[#6B7280] dark:text-[#A5B4FC] text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sağ Panel (Form) ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Mobil Logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-3xl flex items-center justify-center shadow-xl mb-3"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}>
              <TrendingUp size={30} className="text-white" />
            </div>
            <h1 className="text-2xl font-black text-[#111827] dark:text-[#EEF2FF]">Akıllı Harçlık</h1>
          </div>

          {/* Card */}
          <div className="bg-white dark:bg-[#141414] border border-[#C7D2FE] dark:border-[#1a1a4a] rounded-3xl p-8 shadow-2xl">

            {/* Başlık */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full px-3 py-1.5 mb-4">
                <UserPlus size={13} className="text-[#A5B4FC]" />
                <span className="text-xs font-semibold text-[#A5B4FC]">Yeni Hesap</span>
              </div>
              <h2 className="text-2xl font-black text-[#111827] dark:text-[#EEF2FF]">Hesap oluştur</h2>
              <p className="text-[#6B7280] dark:text-[#A5B4FC] text-sm mt-1">Okul mailinle ücretsiz kaydol</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Ad Soyad */}
              <div>
                <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Ad Soyad</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#251a5a]" />
                  <input id="input-displayName" type="text" value={form.displayName}
                    onChange={e => set('displayName', e.target.value)}
                    placeholder="Adınız Soyadınız" className="input-field pl-10" autoFocus />
                </div>
              </div>

              {/* Kullanıcı Adı */}
              <div>
                <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Kullanıcı Adı</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#251a5a] text-sm font-bold select-none">@</span>
                  <input id="input-username" type="text" value={form.username}
                    onChange={e => set('username', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    placeholder="kullanici_adi" className="input-field pl-8" maxLength={30} required />
                </div>
                <p className="text-[#B0B8C4] dark:text-[#251a5a] text-xs mt-1">Küçük harf, rakam ve _ kullanabilirsiniz</p>
              </div>

              {/* Okul E-Postası */}
              <div>
                <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-semibold uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
                  <GraduationCap size={12} className="text-[#A5B4FC]" />
                  Okul E-Postası <span className="text-[#4F46E5] font-bold normal-case">*zorunlu</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#251a5a]" />
                  <input id="input-email" type="email" value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="adi.soyadi@universite.edu.tr"
                    className={`input-field pl-10 pr-9 transition-all ${
                      emailStatus === 'valid'   ? 'border-green-400 focus:ring-green-400/30' :
                      emailStatus === 'invalid' ? 'border-red-400 focus:ring-red-400/30' : ''
                    }`}
                    required />
                  {emailStatus === 'valid'   && <CheckCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />}
                  {emailStatus === 'invalid' && <XCircle     size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400" />}
                </div>
                {emailStatus === 'valid' && <p className="text-green-600 dark:text-green-400 text-xs mt-1.5 flex items-center gap-1"><CheckCircle size={11} /> Okul e-postası onaylandı</p>}
                {emailStatus === 'invalid' && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5 flex items-center gap-1"><XCircle size={11} /> .edu.tr veya .edu uzantılı bir mail girin</p>}

                {/* Info banner */}
                <div className="mt-2 flex items-start gap-2 p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30">
                  <GraduationCap size={13} className="text-[#A5B4FC] flex-shrink-0 mt-0.5" />
                  <p className="text-[#6B7280] dark:text-[#A5B4FC] text-xs leading-relaxed">
                    Bu uygulama yalnızca <span className="text-[#A5B4FC] font-semibold">öğrenci ve öğretim üyelerine</span> açıktır.
                  </p>
                </div>
              </div>

              {/* Şifre */}
              <div>
                <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Şifre</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#251a5a]" />
                  <input id="input-password" type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => set('password', e.target.value)}
                    placeholder="En az 6 karakter" className="input-field pl-10 pr-10" required />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B0B8C4] hover:text-[#6B7280] transition-colors">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Şifre Tekrar */}
              <div>
                <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Şifre Tekrar</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0B8C4] dark:text-[#251a5a]" />
                  <input id="input-confirmPass" type={showPass ? 'text' : 'password'} value={form.confirmPass}
                    onChange={e => set('confirmPass', e.target.value)}
                    placeholder="••••••" className={`input-field pl-10 pr-9 ${
                      passMatch === true ? 'border-green-400' : passMatch === false ? 'border-red-400' : ''
                    }`} required />
                  {passMatch === true  && <CheckCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500" />}
                  {passMatch === false && <XCircle     size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-400" />}
                </div>
                {passMatch === false && <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">Şifreler eşleşmiyor</p>}
              </div>

              {/* Hata */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl px-4 py-3">
                  <p className="text-red-600 dark:text-red-400 text-sm">⚠ {error}</p>
                </div>
              )}

              {/* Submit */}
              <button type="submit" id="btn-register" disabled={loading || emailStatus !== 'valid'}
                className="w-full py-3.5 rounded-xl text-white font-bold text-base disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg mt-2"
                style={{ background: 'linear-gradient(135deg, #A5B4FC, #4F46E5)' }}>
                {loading
                  ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <>Hesap Oluştur <ArrowRight size={18} /></>}
              </button>
            </form>

            {/* Giriş Yap Linki */}
            <div className="mt-6 pt-6 border-t border-[#C7D2FE] dark:border-[#1a1a4a] text-center">
              <p className="text-[#9CA3AF] dark:text-[#818CF8] text-sm">
                Zaten hesabın var mı?{' '}
                <Link to="/login" className="font-bold text-[#4F46E5] hover:text-[#3730A3] transition-colors">
                  Giriş yap →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
