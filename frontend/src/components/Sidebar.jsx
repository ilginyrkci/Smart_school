import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, BarChart3, Brain, Wallet, TrendingUp, LogOut, Settings, Sun, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { to: '/',             icon: LayoutDashboard, label: 'Dashboard',   id: 'nav-dashboard' },
  { to: '/transactions', icon: ArrowLeftRight,  label: 'İşlemler',    id: 'nav-transactions' },
  { to: '/analytics',   icon: BarChart3,        label: 'Analiz',      id: 'nav-analytics' },
  { to: '/coach',       icon: Brain,            label: 'Finans Koçu', id: 'nav-coach' },
  { to: '/budget',      icon: Wallet,           label: 'Bütçe',       id: 'nav-budget' },
]

const initials = (name = '') =>
  name.split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2) || 'K'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const { isDark, toggle } = useTheme()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col h-screen border-r border-[#FFDCC8] dark:border-[#4a1a1a] bg-white dark:bg-[#0f0f0f]">

      {/* Logo */}
      <div className="p-6 border-b border-[#FFDCC8] dark:border-[#4a1a1a]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
               style={{ background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' }}>
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#2D2D2D] dark:text-[#FFF0E4] leading-tight">Akıllı Harçlık</h1>
            <p className="text-xs font-medium text-[#FF6B6B] dark:text-[#4D96FF]">Finans Koçu</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, id }) => (
          <NavLink key={to} to={to} id={id} end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'text-[#6B7280] dark:text-[#FFB3B3] hover:text-[#FF6B6B] dark:hover:text-[#4D96FF] hover:bg-[#FFF0E4] dark:hover:bg-[#1a1a1a]'
              }`
            }
            style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg, #FF6B6B, #4D96FF)' } : {}}>
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-white' : 'text-[#9CA3AF] dark:text-[#FF9999] group-hover:text-[#FF6B6B] dark:group-hover:text-[#4D96FF]'} />
                {label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Dark mode toggle */}
      <div className="px-3 pb-2">
        <button onClick={toggle} id="btn-theme-toggle"
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
            text-[#6B7280] dark:text-[#FFB3B3] hover:bg-[#FFF0E4] dark:hover:bg-[#1a1a1a]">
          {isDark
            ? <><Sun size={16} className="text-[#FFD93D]" /> Açık Mod</>
            : <><Moon size={16} className="text-[#6B7280]" /> Koyu Mod</>
          }
        </button>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-[#FFDCC8] dark:border-[#4a1a1a] space-y-1">
        <NavLink to="/profile" id="nav-profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group cursor-pointer ${
              isActive ? 'bg-[#FFF0E4] dark:bg-[#1a1a1a]' : 'hover:bg-[#FFF0E4] dark:hover:bg-[#1a1a1a]'
            }`
          }>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
               style={{ background: `linear-gradient(135deg, ${user?.avatarColor || '#FF6B6B'}, ${(user?.avatarColor || '#FF6B6B') + '99'})` }}>
            {initials(user?.displayName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#2D2D2D] dark:text-[#FFF0E4] truncate">{user?.displayName || 'Kullanıcı'}</p>
            <p className="text-xs text-[#9CA3AF] dark:text-[#FF9999] truncate">@{user?.username}</p>
          </div>
          <Settings size={14} className="text-[#B0B8C4] dark:text-[#4D96FF] group-hover:text-[#FF6B6B] transition-colors flex-shrink-0" />
        </NavLink>

        <button id="btn-logout" onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#6B7280] dark:text-[#FFB3B3] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all text-sm font-medium">
          <LogOut size={16} />
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
