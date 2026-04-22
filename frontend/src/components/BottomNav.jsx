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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#FFDCC8] dark:border-[#4a1a1a] bg-white dark:bg-[#0f0f0f]">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all min-w-0 flex-1 ${
                isActive
                  ? 'text-[#FF6B6B] dark:text-[#4D96FF]'
                  : 'text-[#9CA3AF] dark:text-[#FF9999] hover:text-[#FF6B6B] dark:hover:text-[#4D96FF]'
              }`
            }>
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#FFF0E4] dark:bg-[#1a1a1a]' : ''}`}>
                  <Icon size={20} />
                </div>
                <span className="text-[10px] font-medium truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        {/* Theme toggle */}
        <button onClick={toggle}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all min-w-0 flex-1 text-[#9CA3AF] dark:text-[#FFB3B3]">
          <div className="p-1.5 rounded-xl">
            {isDark ? <Sun size={20} className="text-[#FFD93D]" /> : <Moon size={20} />}
          </div>
          <span className="text-[10px] font-medium">{isDark ? 'Açık' : 'Koyu'}</span>
        </button>
      </div>
    </nav>
  )
}
