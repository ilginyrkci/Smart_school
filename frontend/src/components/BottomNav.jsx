import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, BarChart3, Brain, Wallet, Sun, Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const navItems = [
  { to: '/app/dashboard',    icon: LayoutDashboard, label: 'Ana Sayfa' },
  { to: '/app/transactions', icon: ArrowLeftRight,  label: 'İşlemler'  },
  { to: '/app/analytics',    icon: BarChart3,        label: 'Analiz'    },
  { to: '/app/coach',        icon: Brain,            label: 'Koç'       },
  { to: '/app/budget',       icon: Wallet,           label: 'Bütçe'     },
]

export default function BottomNav() {
  const { isDark, toggle } = useTheme()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[#C7D2FE] dark:border-[#1a1a4a] bg-white dark:bg-[#0f0f0f]">
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all min-w-0 flex-1 ${
                isActive
                  ? 'text-[#4F46E5] dark:text-[#A5B4FC]'
                  : 'text-[#9CA3AF] dark:text-[#818CF8] hover:text-[#4F46E5]'
              }`
            }>
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-[#EEF2FF] dark:bg-[#0f0f1a]' : ''}`}>
                  <Icon size={20} />
                </div>
                <span className="text-[10px] font-medium truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}

        <button onClick={toggle}
          className="flex flex-col items-center gap-0.5 px-2 py-1 min-w-0 flex-1 text-[#9CA3AF] dark:text-[#A5B4FC]">
          <div className="p-1.5 rounded-xl">
            {isDark ? <Sun size={20} className="text-[#22C55E]" /> : <Moon size={20} />}
          </div>
          <span className="text-[10px] font-medium">{isDark ? 'Açık' : 'Koyu'}</span>
        </button>
      </div>
    </nav>
  )
}
