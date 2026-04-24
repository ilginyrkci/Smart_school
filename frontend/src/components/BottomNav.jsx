import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, BarChart3, Brain, Wallet, Sun, Moon, UserCircle, LogOut } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/app/dashboard',    icon: LayoutDashboard, label: 'Ana Sayfa' },
  { to: '/app/transactions', icon: ArrowLeftRight,  label: 'İşlemler'  },
  { to: '/app/analytics',    icon: BarChart3,        label: 'Analiz'    },
  { to: '/app/coach',        icon: Brain,            label: 'Koç'       },
  { to: '/app/budget',       icon: Wallet,           label: 'Bütçe'     },
]

const initials = (name = '') =>
  name.split(' ').map(n => n[0] || '').join('').toUpperCase().slice(0, 2) || 'K'

export default function BottomNav() {
  const { isDark, toggle } = useTheme()
  const { user, logout }   = useAuth()
  const navigate           = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/', { replace: true })
  }

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#C7D2FE] dark:border-[#1a1a4a] bg-white dark:bg-[#0f0f0f]">
        <div className="flex items-center justify-around h-16 px-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-1 py-1 rounded-xl transition-all min-w-0 flex-1 ${
                  isActive
                    ? 'text-[#4F46E5] dark:text-[#A5B4FC]'
                    : 'text-[#9CA3AF] dark:text-[#818CF8] hover:text-[#4F46E5]'
                }`
              }>
              {({ isActive }) => (
                <>
                  <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#EEF2FF] dark:bg-[#0f0f14]' : ''}`}>
                    <Icon size={19} />
                  </div>
                  <span className="text-[9px] font-medium truncate">{label}</span>
                </>
              )}
            </NavLink>
          ))}

          {/* Profil butonu */}
          <NavLink to="/app/profile"
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-1 py-1 rounded-xl transition-all min-w-0 flex-1 ${
                isActive
                  ? 'text-[#4F46E5] dark:text-[#A5B4FC]'
                  : 'text-[#9CA3AF] dark:text-[#818CF8] hover:text-[#4F46E5]'
              }`
            }>
            {({ isActive }) => (
              <>
                <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-[#EEF2FF] dark:bg-[#0f0f14]' : ''}`}>
                  {user?.avatarColor ? (
                    <div className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[8px] font-black text-white"
                      style={{ background: `linear-gradient(135deg, ${user.avatarColor}, ${user.avatarColor}99)` }}>
                      {initials(user?.displayName)}
                    </div>
                  ) : (
                    <UserCircle size={19} />
                  )}
                </div>
                <span className="text-[9px] font-medium truncate">Profil</span>
              </>
            )}
          </NavLink>
        </div>
      </nav>

      {/* Mobil kullanıcı hızlı menü - sağ üst köşe */}
      <div className="lg:hidden fixed top-3 right-3 z-50 flex items-center gap-2">
        <button onClick={toggle}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/90 dark:bg-[#141414]/90 border border-[#C7D2FE] dark:border-[#1a1a4a] shadow-sm backdrop-blur-sm text-[#6B7280] dark:text-[#A5B4FC] transition-all hover:bg-[#EEF2FF] dark:hover:bg-[#1a1a1a]">
          {isDark ? <Sun size={16} className="text-[#22C55E]" /> : <Moon size={16} />}
        </button>
        <button onClick={handleLogout}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/90 dark:bg-[#141414]/90 border border-[#C7D2FE] dark:border-[#1a1a4a] shadow-sm backdrop-blur-sm text-[#9CA3AF] dark:text-[#818CF8] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all">
          <LogOut size={15} />
        </button>
      </div>
    </>
  )
}
