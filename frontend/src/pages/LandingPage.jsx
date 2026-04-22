import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, Menu, X, ArrowRight, ChevronDown,
  Brain, BarChart3, Wallet, Shield, Users, Mail,
  MapPin, Phone, Star, GraduationCap, Sparkles
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Ana Sayfa',  href: '#home' },
  { label: 'Özellikler', href: '#features' },
  { label: 'Hakkımızda', href: '#about' },
  { label: 'İletişim',   href: '#contact' },
]

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function LandingPage() {
  const { isDark, toggle } = useTheme()
  const [menuOpen, setMenuOpen]     = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent]             = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleContact = (e) => {
    e.preventDefault()
    setSent(true)
    setContactForm({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  const features = [
    { icon: BarChart3, title: 'Gelir & Gider Takibi',    desc: 'Tüm finansal işlemlerini kategorize et, görselleştir ve analiz et.', color: '#FF6B6B' },
    { icon: Brain,     title: 'Yapay Zeka Koçu',          desc: 'Harcama alışkanlıklarına göre kişiselleştirilmiş tavsiyeler al.', color: '#4D96FF' },
    { icon: Wallet,    title: 'Bütçe Planlama',            desc: 'Aylık bütçe limiti belirle, limiti aşmadan önce uyarı al.', color: '#FFD93D' },
    { icon: Shield,    title: 'Güvenli & Özel',            desc: 'Verilerın yalnızca sana ait. Okul maili ile güvenli erişim.', color: '#66BB6A' },
    { icon: GraduationCap, title: 'Sadece Öğrencilere',   desc: 'Kurumsal .edu.tr / .edu mail adresiyle kayıt ol.', color: '#A78BFA' },
    { icon: Sparkles,  title: 'Ücretsiz & Kolay',          desc: 'Sıfır ücret, sıfır karmaşa. Saniyeler içinde başla.', color: '#F97316' },
  ]

  const team = [
    { name: 'Finans Koçu AI', role: 'Yapay Zeka Asistanı', avatar: '🤖', desc: '7/24 finansal tavsiye ve analiz' },
    { name: 'Güvenli Altyapı', role: 'Okul Maili Doğrulama', avatar: '🔐', desc: 'Yalnızca öğrenci ve öğretim üyeleri' },
    { name: 'Anlık Raporlar', role: 'Finansal Analiz',       avatar: '📊', desc: 'Grafikler ve trend analizleri' },
  ]

  const stats = [
    { val: '10K+',  label: 'Kayıtlı Öğrenci' },
    { val: '50K+',  label: 'İşlem Kaydı' },
    { val: '%94',   label: 'Memnuniyet Oranı' },
    { val: '200+',  label: 'Okul & Üniversite' },
  ]

  return (
    <div className={`min-h-screen bg-[#FFF7ED] dark:bg-[#0a0a0a] text-[#2D2D2D] dark:text-[#FFF0E4] ${isDark ? 'dark' : ''}`}>

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-[#0f0f0f]/90 backdrop-blur-md border-b border-[#FFDCC8] dark:border-[#4a1a1a] shadow-sm'
          : 'bg-transparent'
      }`}>
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollTo('home')} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="text-lg font-black text-[#2D2D2D] dark:text-[#FFF0E4]">Akıllı Harçlık</span>
          </button>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <button onClick={() => scrollTo(href.slice(1))}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[#6B7280] dark:text-[#FFB3B3] hover:text-[#FF6B6B] hover:bg-[#FFF0E4] dark:hover:bg-[#1a0f0f] transition-all">
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA + Dark Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggle}
              className="p-2 rounded-xl text-[#6B7280] dark:text-[#FFB3B3] hover:bg-[#FFF0E4] dark:hover:bg-[#1a1a1a] transition-all">
              {isDark ? <Sun size={18} className="text-[#FFD93D]" /> : <Moon size={18} />}
            </button>
            <Link to="/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[#FF6B6B] border border-[#FFDCC8] dark:border-[#4a1a1a] hover:bg-[#FFF0E4] dark:hover:bg-[#1a0f0f] transition-all">
              Giriş Yap
            </Link>
            <Link to="/login"
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>
              Ücretsiz Başla
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggle} className="p-2 text-[#6B7280] dark:text-[#FFB3B3]">
              {isDark ? <Sun size={18} className="text-[#FFD93D]" /> : <Moon size={18} />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-[#2D2D2D] dark:text-[#FFF0E4]">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-[#141414] border-t border-[#FFDCC8] dark:border-[#4a1a1a] px-6 py-4 space-y-1">
            {NAV_LINKS.map(({ label, href }) => (
              <button key={label} onClick={() => { scrollTo(href.slice(1)); setMenuOpen(false) }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#6B7280] dark:text-[#FFB3B3] hover:text-[#FF6B6B] hover:bg-[#FFF0E4] dark:hover:bg-[#1a0f0f] transition-all">
                {label}
              </button>
            ))}
            <div className="pt-3 flex gap-3 border-t border-[#FFDCC8] dark:border-[#4a1a1a]">
              <Link to="/login" className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-[#FF6B6B] border border-[#FFDCC8] dark:border-[#4a1a1a]">Giriş Yap</Link>
              <Link to="/login" className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>Kayıt Ol</Link>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 relative overflow-hidden">
        {/* BG decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #FF6B6B, transparent 70%)' }} />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #4D96FF, transparent 70%)' }} />
        </div>

        <div className="relative max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/10 border border-[#FFDCC8] dark:border-[#4a1a1a] backdrop-blur-sm mb-8 shadow-sm">
            <GraduationCap size={16} className="text-[#FF6B6B]" />
            <span className="text-sm font-semibold text-[#6B7280] dark:text-[#FFB3B3]">Öğrencilere özel finansal koç</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Paranı{' '}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #FF6B6B 0%, #4D96FF 100%)' }}>
              akıllıca
            </span>
            <br />yönet
          </h1>

          <p className="text-xl md:text-2xl text-[#6B7280] dark:text-[#FFB3B3] max-w-2xl mx-auto mb-10 leading-relaxed">
            Gelir–gider takipten bütçe yönetimine, yapay zeka destekli finansal koçluğa kadar
            öğrenciler için tasarlanmış eksiksiz finans platformu.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/login"
              className="px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>
              Okul Mailinle Başla <ArrowRight size={20} />
            </Link>
            <Link to="/login"
              className="px-8 py-4 rounded-2xl text-[#2D2D2D] dark:text-[#FFF0E4] font-semibold text-lg bg-white/80 dark:bg-white/10 border border-[#FFDCC8] dark:border-[#4a1a1a] backdrop-blur-sm hover:shadow-lg transition-all">
              Hesabım var, giriş yap
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map(({ val, label }) => (
              <div key={label} className="bg-white/70 dark:bg-white/5 border border-[#FFDCC8] dark:border-[#4a1a1a] rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-2xl font-black text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>{val}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#FFB3B3] mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <button onClick={() => scrollTo('features')}
            className="mt-12 flex flex-col items-center gap-1 text-[#B0B8C4] dark:text-[#5a1a1a] text-xs hover:text-[#FF6B6B] transition-colors mx-auto">
            <span>Keşfet</span>
            <ChevronDown size={18} className="animate-bounce" />
          </button>
        </div>
      </section>

      {/* ═══════════════════ ÖZELLİKLER ═══════════════════ */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#FFF0E4] dark:bg-[#1a0f0f] text-[#FF6B6B] border border-[#FFDCC8] dark:border-[#4a1a1a] mb-4">
              ✦ Özellikler
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2D2D2D] dark:text-[#FFF0E4] mb-4">
              İhtiyacın olan her şey
            </h2>
            <p className="text-[#6B7280] dark:text-[#FFB3B3] text-lg max-w-xl mx-auto">
              Finansal özgürlüğe giden yolda sana lazım olacak tüm araçlar tek platformda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title}
                className="group bg-white dark:bg-[#141414] border border-[#FFDCC8] dark:border-[#4a1a1a] rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: color + '20' }}>
                  <Icon size={24} style={{ color }} />
                </div>
                <h3 className="text-lg font-bold text-[#2D2D2D] dark:text-[#FFF0E4] mb-2">{title}</h3>
                <p className="text-[#6B7280] dark:text-[#FFB3B3] text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ HAKKIMIZDA ═══════════════════ */}
      <section id="about" className="py-24 px-6 bg-white/50 dark:bg-[#0f0f0f]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-[#4D96FF] border border-blue-100 dark:border-blue-900/30 mb-4">
                ✦ Hakkımızda
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-[#2D2D2D] dark:text-[#FFF0E4] mb-6 leading-tight">
                Öğrenciler için{' '}
                <span className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #4D96FF, #FF6B6B)' }}>
                  öğrencilerden
                </span>
              </h2>
              <p className="text-[#6B7280] dark:text-[#FFB3B3] text-lg leading-relaxed mb-6">
                Akıllı Harçlık, üniversite öğrencilerinin finansal okuryazarlığını artırmak ve
                bütçe yönetimini kolaylaştırmak amacıyla öğrenciler tarafından geliştirilmiştir.
              </p>
              <p className="text-[#6B7280] dark:text-[#FFB3B3] text-lg leading-relaxed mb-8">
                Yapay zeka destekli finans koçumuz, harcama alışkanlıklarını analiz ederek
                sana özel tasarruf stratejileri önerir. Okul mailin sayesinde güvenli ve
                yalnızca öğrencilere açık bir ortamda çalışırsın.
              </p>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-3xl font-black text-[#FF6B6B]">2024</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#FF9999]">Kuruluş Yılı</p>
                </div>
                <div className="w-px h-12 bg-[#FFDCC8] dark:bg-[#4a1a1a]" />
                <div className="text-center">
                  <p className="text-3xl font-black text-[#4D96FF]">100%</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#FF9999]">Ücretsiz</p>
                </div>
                <div className="w-px h-12 bg-[#FFDCC8] dark:bg-[#4a1a1a]" />
                <div className="text-center">
                  <p className="text-3xl font-black text-[#FFD93D]">7/24</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#FF9999]">AI Destek</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {team.map(({ name, role, avatar, desc }) => (
                <div key={name}
                  className="flex items-center gap-5 bg-white dark:bg-[#141414] border border-[#FFDCC8] dark:border-[#4a1a1a] rounded-2xl p-5 hover:shadow-lg transition-all">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-[#FFF0E4] dark:bg-[#1a0f0f] flex-shrink-0">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-[#2D2D2D] dark:text-[#FFF0E4] font-bold">{name}</p>
                    <p className="text-[#FF6B6B] text-xs font-semibold">{role}</p>
                    <p className="text-[#6B7280] dark:text-[#FFB3B3] text-sm mt-0.5">{desc}</p>
                  </div>
                  <Star size={16} className="text-[#FFD93D] flex-shrink-0 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ İLETİŞİM ═══════════════════ */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#FFF0E4] dark:bg-[#1a0f0f] text-[#FF6B6B] border border-[#FFDCC8] dark:border-[#4a1a1a] mb-4">
              ✦ İletişim
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#2D2D2D] dark:text-[#FFF0E4] mb-4">
              Bize ulaş
            </h2>
            <p className="text-[#6B7280] dark:text-[#FFB3B3] text-lg max-w-xl mx-auto">
              Soruların mı var? Önerin mi var? Bize yaz, en kısa sürede geri dönelim.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Sol: İletişim Bilgileri */}
            <div className="space-y-6">
              {[
                { icon: Mail,    label: 'E-posta',    val: 'destek@akilliharçlik.edu.tr', color: '#FF6B6B' },
                { icon: Phone,   label: 'Telefon',    val: '+90 (212) 555 01 23',          color: '#4D96FF' },
                { icon: MapPin,  label: 'Adres',      val: 'Üniversite Kampüsü, Türkiye',  color: '#FFD93D' },
                { icon: Users,   label: 'Topluluk',   val: '10.000+ aktif öğrenci',        color: '#66BB6A' },
              ].map(({ icon: Icon, label, val, color }) => (
                <div key={label} className="flex items-center gap-4 bg-white dark:bg-[#141414] border border-[#FFDCC8] dark:border-[#4a1a1a] rounded-2xl p-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: color + '20' }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] dark:text-[#FF9999] text-xs font-semibold uppercase tracking-wide">{label}</p>
                    <p className="text-[#2D2D2D] dark:text-[#FFF0E4] font-semibold mt-0.5">{val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sağ: Form */}
            <div className="bg-white dark:bg-[#141414] border border-[#FFDCC8] dark:border-[#4a1a1a] rounded-3xl p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full py-12 gap-4 text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl bg-green-50 dark:bg-green-900/20">✉️</div>
                  <h3 className="text-xl font-black text-[#2D2D2D] dark:text-[#FFF0E4]">Mesajın iletildi!</h3>
                  <p className="text-[#6B7280] dark:text-[#FFB3B3] text-sm">En kısa sürede sana geri döneceğiz.</p>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-5">
                  <div>
                    <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Ad Soyad</label>
                    <input type="text" value={contactForm.name}
                      onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Adınız Soyadınız" className="input-field" required />
                  </div>
                  <div>
                    <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wide mb-1.5 block">E-posta</label>
                    <input type="email" value={contactForm.email}
                      onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="email@example.com" className="input-field" required />
                  </div>
                  <div>
                    <label className="text-[#6B7280] dark:text-[#FFB3B3] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Mesajın</label>
                    <textarea value={contactForm.message}
                      onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Soru, öneri veya geri bildiriminizi yazın..."
                      rows={4}
                      className="input-field resize-none" required />
                  </div>
                  <button type="submit"
                    className="w-full py-3.5 rounded-xl text-white font-bold text-base shadow-lg flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>
                    Mesaj Gönder <ArrowRight size={18} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ CTA BANNER ═══════════════════ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center bg-white dark:bg-[#141414] border border-[#FFDCC8] dark:border-[#4a1a1a] rounded-3xl p-12 shadow-xl">
          <h2 className="text-4xl font-black text-[#2D2D2D] dark:text-[#FFF0E4] mb-4">
            Hemen başlamaya hazır mısın?
          </h2>
          <p className="text-[#6B7280] dark:text-[#FFB3B3] text-lg mb-8">
            Okul mailinle saniyeler içinde ücretsiz hesap oluştur.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login"
              className="px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>
              Ücretsiz Başla <ArrowRight size={20} />
            </Link>
            <Link to="/login"
              className="px-8 py-4 rounded-2xl text-[#FF6B6B] font-semibold border border-[#FFDCC8] dark:border-[#4a1a1a] hover:bg-[#FFF0E4] dark:hover:bg-[#1a0f0f] transition-all text-lg">
              Giriş Yap
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-[#FFDCC8] dark:border-[#4a1a1a] bg-white/50 dark:bg-[#0f0f0f] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="font-black text-[#2D2D2D] dark:text-[#FFF0E4]">Akıllı Harçlık</span>
          </div>

          <div className="flex items-center gap-6">
            {NAV_LINKS.map(({ label, href }) => (
              <button key={label} onClick={() => scrollTo(href.slice(1))}
                className="text-sm text-[#9CA3AF] dark:text-[#FF9999] hover:text-[#FF6B6B] transition-colors">
                {label}
              </button>
            ))}
          </div>

          <p className="text-sm text-[#B0B8C4] dark:text-[#5a1a1a]">
            © 2024 Akıllı Harçlık. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>
    </div>
  )
}
