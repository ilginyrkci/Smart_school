import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, BarChart3, Brain, Wallet, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { to: '/',             icon: LayoutDashboard, label: 'Ana Sayfa' },
  { to: '/transactions', icon: ArrowLeftRight,  label: 'İşlemler'  },
  { to: '/analytics',   icon: BarChart3,        label: 'Analiz'    },
  { to: '/coach',       icon: Brain,            label: 'Koç'       },
  { to: '/budget',      icon: Wallet,           label: 'Bütçe'     },
]

export default function BottomNav() {
  const { isDark, toggle } = useTheme()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#C8E6C9] dark:border-[#2d4a2d] bg-white dark:bg-[#152015]">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all min-w-0 flex-1 ${
                isActive
                  ? 'text-[#2E7D32] dark:text-[#66BB6A]'
                  : 'text-[#78909C] dark:text-[#81C784] hover:text-[#2E7D32] dark:hover:text-[#66BB6A]'
              }`
            }>
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#E8F5E9] dark:bg-[#1f3a1f]' : ''}`}>
                  <Icon size={20} />
                </div>
                <span className="text-[10px] font-medium truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Theme toggle */}
        <button onClick={toggle}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all min-w-0 flex-1 text-[#78909C] dark:text-[#A5D6A7]">
          <div className="p-1.5 rounded-xl">
            {isDark ? <Sun size={20} className="text-[#FFC107]" /> : <Moon size={20} />}
          </div>
          <span className="text-[10px] font-medium">{isDark ? 'Açık' : 'Koyu'}</span>
        </button>
      </div>
    </nav>
  )
}
