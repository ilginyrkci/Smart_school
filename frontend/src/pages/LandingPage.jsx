import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp, Menu, X, ArrowRight, ChevronDown,
  Brain, BarChart3, Wallet, Shield, Users, Mail,
  MapPin, Phone, Star, GraduationCap, Sparkles,
  ChevronUp, Send, Bot, MessageCircle
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

// ── Chatbot Yanıt Motoru ──
const BOT_REPLIES = [
  { keys: ['merhaba','selam','hey','hi'],          reply: 'Merhaba! 👋 Akıllı Harçlık yardım botuyum. Sana nasıl yardımcı olabilirim?' },
  { keys: ['kayıt','kaydol','kayit','üye'],        reply: '🎓 Kayıt olmak için okul e-postan gerekiyor (.edu.tr veya .edu uzantılı). Sağ üstteki «Ücretsiz Başla» butonuna tıkla!' },
  { keys: ['mail','email','eposta','e-posta'],     reply: '📧 Yalnızca okul/üniversite e-postaları (.edu.tr veya .edu) kabul edilmektedir.' },
  { keys: ['giriş','giris','login','şifre'],       reply: '🔐 Giriş yapmak için «Giriş Yap» butonuna tıkla. Kullanıcı adın ve şifreni gir.' },
  { keys: ['ücret','ücretsiz','fiyat','para'],     reply: '✅ Akıllı Harçlık tamamen ücretsizdir! Hiçbir ücret talep etmiyoruz.' },
  { keys: ['özellik','neler','ne var','yapabilir'],reply: '⚡ Gelir-gider takibi, bütçe planlama, yapay zeka finans koçu, detaylı analizler ve çok daha fazlası!' },
  { keys: ['koç','coach','tavsiye','öneri'],       reply: '🧠 Finans Koçu, harcama alışkanlıklarını analiz ederek sana özel tasarruf tavsiyeleri sunar.' },
  { keys: ['bütçe','butce','limit'],               reply: '💰 Bütçe sayfasından aylık harcama limitini belirleyebilir, ne kadar harcadığını takip edebilirsin.' },
  { keys: ['analiz','grafik','rapor','istatistik'],reply: '📊 Analiz sayfasında gelir-gider grafiklerini ve harcama kategorilerini görebilirsin.' },
  { keys: ['iletişim','destek','yardım','sorun'],  reply: '📬 Sorun yaşıyorsan sayfanın İletişim bölümünden bize ulaşabilirsin.' },
  { keys: ['nasıl','nası','nasil'],                reply: '📖 Önce okul mailinle kayıt ol, sonra gelirlerini ve giderlerini gir. Yapay zeka koçun her şeyi analiz eder!' },
  { keys: ['güvenli','güvenlik','veri','gizli'],   reply: '🔒 Verilerın SSL ile şifrelenmiş sunucularda saklanır. Yalnızca sen erişebilirsin.' },
]

function getBotReply(msg) {
  const lower = msg.toLowerCase()
  for (const { keys, reply } of BOT_REPLIES) {
    if (keys.some(k => lower.includes(k))) return reply
  }
  return '🤔 Üzgünüm, bunu tam anlayamadım. «iletişim», «kayıt», «özellikler» veya «nasıl» diyerek daha fazla yardım alabilirsin!'
}

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
  const [menuOpen, setMenuOpen]       = useState(false)
  const [scrolled, setScrolled]       = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent]               = useState(false)

  // Chatbot state
  const [chatOpen, setChatOpen]   = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [messages, setMessages]   = useState([
    { from: 'bot', text: 'Merhaba! 👋 Ben Akıllı Harçlık yardım botuyum. Sana nasıl yardımcı olabilirim?' }
  ])
  const chatEndRef = useRef(null)

  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 40)
      setShowScrollTop(window.scrollY > 400)
    }
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!chatInput.trim()) return
    const userMsg = chatInput.trim()
    setChatInput('')
    setMessages(prev => [...prev, { from: 'user', text: userMsg }])
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: getBotReply(userMsg) }])
    }, 600)
  }

  const handleContact = (e) => {
    e.preventDefault()
    setSent(true)
    setContactForm({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  const features = [
    { icon: BarChart3, title: 'Gelir & Gider Takibi',    desc: 'Tüm finansal işlemlerini kategorize et, görselleştir ve analiz et.', color: '#4F46E5' },
    { icon: Brain,     title: 'Yapay Zeka Koçu',          desc: 'Harcama alışkanlıklarına göre kişiselleştirilmiş tavsiyeler al.', color: '#A5B4FC' },
    { icon: Wallet,    title: 'Bütçe Planlama',            desc: 'Aylık bütçe limiti belirle, limiti aşmadan önce uyarı al.', color: '#22C55E' },
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
    <div className={`min-h-screen bg-[#F9FAFB] dark:bg-[#0a0a0a] text-[#111827] dark:text-[#EEF2FF] ${isDark ? 'dark' : ''}`}>

      {/* ═══════════════════ NAVBAR ═══════════════════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-[#0f0f0f]/90 backdrop-blur-md border-b border-[#C7D2FE] dark:border-[#1a1a4a] shadow-sm'
          : 'bg-transparent'
      }`}>
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => scrollTo('home')} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}>
              <TrendingUp size={18} className="text-white" />
            </div>
            <span className="text-lg font-black text-[#111827] dark:text-[#EEF2FF]">Akıllı Harçlık</span>
          </button>

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <button onClick={() => scrollTo(href.slice(1))}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-[#6B7280] dark:text-[#A5B4FC] hover:text-[#4F46E5] hover:bg-[#EEF2FF] dark:hover:bg-[#0f0f14] transition-all">
                  {label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA + Dark Toggle */}
          <div className="hidden md:flex items-center gap-3">
            <button onClick={toggle}
              className="p-2 rounded-xl text-[#6B7280] dark:text-[#A5B4FC] hover:bg-[#EEF2FF] dark:hover:bg-[#1a1a1a] transition-all">
              {isDark ? <Sun size={18} className="text-[#22C55E]" /> : <Moon size={18} />}
            </button>
            <Link to="/login"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-[#4F46E5] border border-[#C7D2FE] dark:border-[#1a1a4a] hover:bg-[#EEF2FF] dark:hover:bg-[#0f0f14] transition-all">
              Giriş Yap
            </Link>
            <Link to="/login"
              className="px-4 py-2.5 rounded-xl text-sm font-bold text-white shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}>
              Ücretsiz Başla
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={toggle} className="p-2 text-[#6B7280] dark:text-[#A5B4FC]">
              {isDark ? <Sun size={18} className="text-[#22C55E]" /> : <Moon size={18} />}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-[#111827] dark:text-[#EEF2FF]">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white dark:bg-[#141414] border-t border-[#C7D2FE] dark:border-[#1a1a4a] px-6 py-4 space-y-1">
            {NAV_LINKS.map(({ label, href }) => (
              <button key={label} onClick={() => { scrollTo(href.slice(1)); setMenuOpen(false) }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-[#6B7280] dark:text-[#A5B4FC] hover:text-[#4F46E5] hover:bg-[#EEF2FF] dark:hover:bg-[#0f0f14] transition-all">
                {label}
              </button>
            ))}
            <div className="pt-3 flex gap-3 border-t border-[#C7D2FE] dark:border-[#1a1a4a]">
              <Link to="/login" className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold text-[#4F46E5] border border-[#C7D2FE] dark:border-[#1a1a4a]">Giriş Yap</Link>
              <Link to="/login" className="flex-1 text-center py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}>Kayıt Ol</Link>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section id="home" className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-16 relative overflow-hidden">
        {/* BG decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #4F46E5, transparent 70%)' }} />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #A5B4FC, transparent 70%)' }} />
        </div>

        <div className="relative max-w-4xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-white/10 border border-[#C7D2FE] dark:border-[#1a1a4a] backdrop-blur-sm mb-8 shadow-sm">
            <GraduationCap size={16} className="text-[#4F46E5]" />
            <span className="text-sm font-semibold text-[#6B7280] dark:text-[#A5B4FC]">Öğrencilere özel finansal koç</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Paranı{' '}
            <span className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #4F46E5 0%, #A5B4FC 100%)' }}>
              akıllıca
            </span>
            <br />yönet
          </h1>

          <p className="text-xl md:text-2xl text-[#6B7280] dark:text-[#A5B4FC] max-w-2xl mx-auto mb-10 leading-relaxed">
            Gelir–gider takipten bütçe yönetimine, yapay zeka destekli finansal koçluğa kadar
            öğrenciler için tasarlanmış eksiksiz finans platformu.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/login"
              className="px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all hover:shadow-2xl hover:-translate-y-1 flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}>
              Okul Mailinle Başla <ArrowRight size={20} />
            </Link>
            <Link to="/login"
              className="px-8 py-4 rounded-2xl text-[#111827] dark:text-[#EEF2FF] font-semibold text-lg bg-white/80 dark:bg-white/10 border border-[#C7D2FE] dark:border-[#1a1a4a] backdrop-blur-sm hover:shadow-lg transition-all">
              Hesabım var, giriş yap
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map(({ val, label }) => (
              <div key={label} className="bg-white/70 dark:bg-white/5 border border-[#C7D2FE] dark:border-[#1a1a4a] rounded-2xl p-4 backdrop-blur-sm">
                <p className="text-2xl font-black text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}>{val}</p>
                <p className="text-xs text-[#6B7280] dark:text-[#A5B4FC] mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Scroll hint */}
          <button onClick={() => scrollTo('features')}
            className="mt-12 flex flex-col items-center gap-1 text-[#B0B8C4] dark:text-[#1e1a4a] text-xs hover:text-[#4F46E5] transition-colors mx-auto">
            <span>Keşfet</span>
            <ChevronDown size={18} className="animate-bounce" />
          </button>
        </div>
      </section>

      {/* ═══════════════════ ÖZELLİKLER ═══════════════════ */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#EEF2FF] dark:bg-[#0f0f14] text-[#4F46E5] border border-[#C7D2FE] dark:border-[#1a1a4a] mb-4">
              ✦ Özellikler
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#111827] dark:text-[#EEF2FF] mb-4">
              İhtiyacın olan her şey
            </h2>
            <p className="text-[#6B7280] dark:text-[#A5B4FC] text-lg max-w-xl mx-auto">
              Finansal özgürlüğe giden yolda sana lazım olacak tüm araçlar tek platformda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title}
                className="group bg-white dark:bg-[#141414] border border-[#C7D2FE] dark:border-[#1a1a4a] rounded-3xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: color + '20' }}>
                  <Icon size={24} style={{ color }} />
                </div>
                <h3 className="text-lg font-bold text-[#111827] dark:text-[#EEF2FF] mb-2">{title}</h3>
                <p className="text-[#6B7280] dark:text-[#A5B4FC] text-sm leading-relaxed">{desc}</p>
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
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-900/20 text-[#A5B4FC] border border-blue-100 dark:border-blue-900/30 mb-4">
                ✦ Hakkımızda
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-[#111827] dark:text-[#EEF2FF] mb-6 leading-tight">
                Öğrenciler için{' '}
                <span className="text-transparent bg-clip-text"
                  style={{ backgroundImage: 'linear-gradient(135deg, #A5B4FC, #4F46E5)' }}>
                  öğrencilerden
                </span>
              </h2>
              <p className="text-[#6B7280] dark:text-[#A5B4FC] text-lg leading-relaxed mb-6">
                Akıllı Harçlık, üniversite öğrencilerinin finansal okuryazarlığını artırmak ve
                bütçe yönetimini kolaylaştırmak amacıyla öğrenciler tarafından geliştirilmiştir.
              </p>
              <p className="text-[#6B7280] dark:text-[#A5B4FC] text-lg leading-relaxed mb-8">
                Yapay zeka destekli finans koçumuz, harcama alışkanlıklarını analiz ederek
                sana özel tasarruf stratejileri önerir. Okul mailin sayesinde güvenli ve
                yalnızca öğrencilere açık bir ortamda çalışırsın.
              </p>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-3xl font-black text-[#4F46E5]">2024</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#818CF8]">Kuruluş Yılı</p>
                </div>
                <div className="w-px h-12 bg-[#C7D2FE] dark:bg-[#1a1a4a]" />
                <div className="text-center">
                  <p className="text-3xl font-black text-[#A5B4FC]">100%</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#818CF8]">Ücretsiz</p>
                </div>
                <div className="w-px h-12 bg-[#C7D2FE] dark:bg-[#1a1a4a]" />
                <div className="text-center">
                  <p className="text-3xl font-black text-[#22C55E]">7/24</p>
                  <p className="text-xs text-[#9CA3AF] dark:text-[#818CF8]">AI Destek</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {team.map(({ name, role, avatar, desc }) => (
                <div key={name}
                  className="flex items-center gap-5 bg-white dark:bg-[#141414] border border-[#C7D2FE] dark:border-[#1a1a4a] rounded-2xl p-5 hover:shadow-lg transition-all">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl bg-[#EEF2FF] dark:bg-[#0f0f14] flex-shrink-0">
                    {avatar}
                  </div>
                  <div>
                    <p className="text-[#111827] dark:text-[#EEF2FF] font-bold">{name}</p>
                    <p className="text-[#4F46E5] text-xs font-semibold">{role}</p>
                    <p className="text-[#6B7280] dark:text-[#A5B4FC] text-sm mt-0.5">{desc}</p>
                  </div>
                  <Star size={16} className="text-[#22C55E] flex-shrink-0 ml-auto" />
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
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#EEF2FF] dark:bg-[#0f0f14] text-[#4F46E5] border border-[#C7D2FE] dark:border-[#1a1a4a] mb-4">
              ✦ İletişim
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#111827] dark:text-[#EEF2FF] mb-4">
              Bize ulaş
            </h2>
            <p className="text-[#6B7280] dark:text-[#A5B4FC] text-lg max-w-xl mx-auto">
              Soruların mı var? Önerin mi var? Bize yaz, en kısa sürede geri dönelim.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Sol: İletişim Bilgileri */}
            <div className="space-y-6">
              {[
                { icon: Mail,    label: 'E-posta',    val: 'destek@akilliharçlik.edu.tr', color: '#4F46E5' },
                { icon: Phone,   label: 'Telefon',    val: '+90 (212) 555 01 23',          color: '#A5B4FC' },
                { icon: MapPin,  label: 'Adres',      val: 'Üniversite Kampüsü, Türkiye',  color: '#22C55E' },
                { icon: Users,   label: 'Topluluk',   val: '10.000+ aktif öğrenci',        color: '#66BB6A' },
              ].map(({ icon: Icon, label, val, color }) => (
                <div key={label} className="flex items-center gap-4 bg-white dark:bg-[#141414] border border-[#C7D2FE] dark:border-[#1a1a4a] rounded-2xl p-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: color + '20' }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-[#9CA3AF] dark:text-[#818CF8] text-xs font-semibold uppercase tracking-wide">{label}</p>
                    <p className="text-[#111827] dark:text-[#EEF2FF] font-semibold mt-0.5">{val}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sağ: Form */}
            <div className="bg-white dark:bg-[#141414] border border-[#C7D2FE] dark:border-[#1a1a4a] rounded-3xl p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full py-12 gap-4 text-center">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl bg-green-50 dark:bg-green-900/20">✉️</div>
                  <h3 className="text-xl font-black text-[#111827] dark:text-[#EEF2FF]">Mesajın iletildi!</h3>
                  <p className="text-[#6B7280] dark:text-[#A5B4FC] text-sm">En kısa sürede sana geri döneceğiz.</p>
                </div>
              ) : (
                <form onSubmit={handleContact} className="space-y-5">
                  <div>
                    <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Ad Soyad</label>
                    <input type="text" value={contactForm.name}
                      onChange={e => setContactForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Adınız Soyadınız" className="input-field" required />
                  </div>
                  <div>
                    <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-semibold uppercase tracking-wide mb-1.5 block">E-posta</label>
                    <input type="email" value={contactForm.email}
                      onChange={e => setContactForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="email@example.com" className="input-field" required />
                  </div>
                  <div>
                    <label className="text-[#6B7280] dark:text-[#A5B4FC] text-xs font-semibold uppercase tracking-wide mb-1.5 block">Mesajın</label>
                    <textarea value={contactForm.message}
                      onChange={e => setContactForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="Soru, öneri veya geri bildiriminizi yazın..."
                      rows={4}
                      className="input-field resize-none" required />
                  </div>
                  <button type="submit"
                    className="w-full py-3.5 rounded-xl text-white font-bold text-base shadow-lg flex items-center justify-center gap-2 transition-all hover:shadow-xl hover:-translate-y-0.5"
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}>
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
        <div className="max-w-4xl mx-auto text-center bg-white dark:bg-[#141414] border border-[#C7D2FE] dark:border-[#1a1a4a] rounded-3xl p-12 shadow-xl">
          <h2 className="text-4xl font-black text-[#111827] dark:text-[#EEF2FF] mb-4">
            Hemen başlamaya hazır mısın?
          </h2>
          <p className="text-[#6B7280] dark:text-[#A5B4FC] text-lg mb-8">
            Okul mailinle saniyeler içinde ücretsiz hesap oluştur.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login"
              className="px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}>
              Ücretsiz Başla <ArrowRight size={20} />
            </Link>
            <Link to="/login"
              className="px-8 py-4 rounded-2xl text-[#4F46E5] font-semibold border border-[#C7D2FE] dark:border-[#1a1a4a] hover:bg-[#EEF2FF] dark:hover:bg-[#0f0f14] transition-all text-lg">
              Giriş Yap
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer className="border-t border-[#C7D2FE] dark:border-[#1a1a4a] bg-white/50 dark:bg-[#0f0f0f] py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}>
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="font-black text-[#111827] dark:text-[#EEF2FF]">Akıllı Harçlık</span>
          </div>

          <div className="flex items-center gap-6">
            {NAV_LINKS.map(({ label, href }) => (
              <button key={label} onClick={() => scrollTo(href.slice(1))}
                className="text-sm text-[#9CA3AF] dark:text-[#818CF8] hover:text-[#4F46E5] transition-colors">
                {label}
              </button>
            ))}
          </div>

          <p className="text-sm text-[#B0B8C4] dark:text-[#1e1a4a]">
            © 2024 Akıllı Harçlık. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>

      {/* ═══════════════════ SCROLL TO TOP ═══════════════════ */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-40 w-12 h-12 rounded-2xl text-white shadow-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
          showScrollTop ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}
        aria-label="Yukarı çık">
        <ChevronUp size={22} />
      </button>

      {/* ═══════════════════ CHATBOT ═══════════════════ */}
      {/* Chat paneli */}
      <div className={`fixed bottom-24 right-6 z-50 w-80 transition-all duration-300 ${
        chatOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-6 pointer-events-none'
      }`}>
        <div className="bg-white dark:bg-[#141414] border border-[#C7D2FE] dark:border-[#1a1a4a] rounded-3xl shadow-2xl overflow-hidden flex flex-col" style={{ height: '420px' }}>

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#C7D2FE] dark:border-[#1a1a4a]"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}>
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Bot size={18} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold text-sm">Akıllı Asistan</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                <span className="text-white/70 text-xs">Çevrimiçi</span>
              </div>
            </div>
            <button onClick={() => setChatOpen(false)} className="text-white/80 hover:text-white transition-colors p-1">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.from === 'bot' && (
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center mr-2 flex-shrink-0 mt-0.5"
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}>
                    <Bot size={13} className="text-white" />
                  </div>
                )}
                <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.from === 'user'
                    ? 'text-white rounded-br-sm'
                    : 'bg-[#EEF2FF] dark:bg-[#0f0f14] text-[#111827] dark:text-[#EEF2FF] border border-[#C7D2FE] dark:border-[#1a1a4a] rounded-bl-sm'
                }`}
                  style={msg.from === 'user' ? { background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' } : {}}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick replies */}
          <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
            {['Nasıl kayıt olabilirim?', 'Ücretsiz mi?', 'Özellikler neler?'].map(q => (
              <button key={q} onClick={() => { setChatInput(q); setTimeout(() => sendMessage, 0); setMessages(prev => [...prev, { from: 'user', text: q }, { from: 'bot', text: getBotReply(q) }]) }}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#EEF2FF] dark:bg-[#0f0f14] text-[#4F46E5] border border-[#C7D2FE] dark:border-[#1a1a4a] hover:bg-[#C7D2FE] transition-all">
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="px-3 pb-3">
            <div className="flex gap-2 bg-[#F9FAFB] dark:bg-[#0a0a0a] border border-[#C7D2FE] dark:border-[#1a1a4a] rounded-2xl p-1.5">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Bir şeyler yaz..."
                className="flex-1 bg-transparent text-sm text-[#111827] dark:text-[#EEF2FF] placeholder-[#B0B8C4] outline-none px-2" />
              <button onClick={sendMessage}
                disabled={!chatInput.trim()}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white disabled:opacity-40 transition-all hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}>
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat butonu */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="fixed bottom-6 right-20 z-50 w-14 h-14 rounded-2xl text-white shadow-xl flex items-center justify-center transition-all hover:-translate-y-1 hover:shadow-2xl"
        style={{ background: 'linear-gradient(135deg, #A5B4FC, #4F46E5)' }}
        aria-label="Sohbet botu">
        {chatOpen
          ? <X size={22} />
          : <>
              <MessageCircle size={24} />
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-white animate-pulse" />
            </>}
      </button>
    </div>
  )
}
