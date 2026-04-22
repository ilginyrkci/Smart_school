import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, BarChart3, Brain, Wallet, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/',             icon: LayoutDashboard, label: 'Ana Sayfa' },
  { to: '/transactions', icon: ArrowLeftRight,  label: 'İşlemler'  },
  { to: '/analytics',   icon: BarChart3,        label: 'Analiz'    },
  { to: '/coach',       icon: Brain,            label: 'Koç'       },
  { to: '/budget',      icon: Wallet,           label: 'Bütçe'     },
]

export default function BottomNav() {
  const { logout } = useAuth()
  const navigate   = useNavigate()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-gray-800/60"
         style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #0f0f2a 100%)' }}>
      <div className="flex items-center justify-around h-16 px-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} end
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl transition-all min-w-0 flex-1 ${
                isActive ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'
              }`
            }>
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-xl transition-all ${isActive ? 'bg-purple-500/20' : ''}`}>
                  <Icon size={20} />
                </div>
                <span className="text-[10px] font-medium truncate">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
