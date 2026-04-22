import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, BarChart3, Brain, Wallet, TrendingUp, LogOut, Settings, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { to: '/app/dashboard',    icon: LayoutDashboard, label: 'Dashboard',   id: 'nav-dashboard' },
  { to: '/app/transactions', icon: ArrowLeftRight,  label: 'İşlemler',    id: 'nav-transactions' },
  { to: '/app/analytics',    icon: BarChart3,        label: 'Analiz',      id: 'nav-analytics' },
  { to: '/app/coach',        icon: Brain,            label: 'Finans Koçu', id: 'nav-coach' },
  { to: '/app/budget',       icon: Wallet,           label: 'Bütçe',       id: 'nav-budget' },
]

const initials = (name = '') =>
  name.split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2) || 'K'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col h-screen border-r border-[#C7D2FE] dark:border-[#1a1a4a] bg-white dark:bg-[#0f0f0f]">

      {/* Logo */}
      <div className="p-6 border-b border-[#C7D2FE] dark:border-[#1a1a4a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
               style={{ background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' }}>
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#111827] dark:text-[#EEF2FF] leading-tight">Akıllı Harçlık</h1>
            <p className="text-xs font-medium text-[#4F46E5]">Finans Koçu</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, id }) => (
          <NavLink key={to} to={to} id={id}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'text-[#6B7280] dark:text-[#A5B4FC] hover:text-[#4F46E5] hover:bg-[#EEF2FF] dark:hover:bg-[#0f0f14]'
              }`
            }
            style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg, #4F46E5, #A5B4FC)' } : {}}>
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-white' : 'text-[#9CA3AF] dark:text-[#818CF8] group-hover:text-[#4F46E5]'} />
                {label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Dark Toggle */}
      <div className="px-3 pb-2">
        <button onClick={toggle} id="btn-theme-toggle"
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-[#6B7280] dark:text-[#A5B4FC] hover:bg-[#EEF2FF] dark:hover:bg-[#1a1a1a]">
          {isDark
            ? <><Sun size={16} className="text-[#22C55E]" /> Açık Mod</>
            : <><Moon size={16} /> Koyu Mod</>
          }
        </button>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-[#C7D2FE] dark:border-[#1a1a4a] space-y-1">
        <NavLink to="/app/profile" id="nav-profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group cursor-pointer ${
              isActive ? 'bg-[#EEF2FF] dark:bg-[#0f0f14]' : 'hover:bg-[#EEF2FF] dark:hover:bg-[#0f0f14]'
            }`
          }>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
               style={{ background: `linear-gradient(135deg, ${user?.avatarColor || '#4F46E5'}, ${(user?.avatarColor || '#4F46E5') + '99'})` }}>
            {initials(user?.displayName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#EEF2FF] truncate">{user?.displayName || 'Kullanıcı'}</p>
            <p className="text-xs text-[#9CA3AF] dark:text-[#818CF8] truncate">@{user?.username}</p>
          </div>
          <Settings size={14} className="text-[#B0B8C4] dark:text-[#1e1a4a] group-hover:text-[#4F46E5] transition-colors flex-shrink-0" />
        </NavLink>

        <button id="btn-logout" onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#6B7280] dark:text-[#A5B4FC] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-sm font-medium">
          <LogOut size={16} /> Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
