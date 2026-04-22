import { NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, BarChart3, Brain, Wallet, TrendingUp, LogOut, Settings } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

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
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col h-screen border-r border-[#C8E6C9] bg-white">

      {/* Logo */}
      <div className="p-6 border-b border-[#C8E6C9]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
               style={{ background: 'linear-gradient(135deg, #2E7D32, #66BB6A)' }}>
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-[#263238] leading-tight">Akıllı Harçlık</h1>
            <p className="text-xs font-medium" style={{ color: '#2E7D32' }}>Finans Koçu</p>
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
                  : 'text-[#546E7A] hover:text-[#2E7D32] hover:bg-[#E8F5E9]'
              }`
            }
            style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg, #2E7D32, #66BB6A)' } : {}}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-white' : 'text-[#78909C] group-hover:text-[#2E7D32]'} />
                {label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-70" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-[#C8E6C9] space-y-1">
        <NavLink to="/profile" id="nav-profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group cursor-pointer ${
              isActive ? 'bg-[#E8F5E9]' : 'hover:bg-[#E8F5E9]'
            }`
          }>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
               style={{ background: `linear-gradient(135deg, ${user?.avatarColor || '#2E7D32'}, ${(user?.avatarColor || '#2E7D32') + '99'})` }}>
            {initials(user?.displayName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#263238] truncate">{user?.displayName || 'Kullanıcı'}</p>
            <p className="text-xs text-[#78909C] truncate">@{user?.username}</p>
          </div>
          <Settings size={14} className="text-[#90A4AE] group-hover:text-[#2E7D32] transition-colors flex-shrink-0" />
        </NavLink>

        <button id="btn-logout" onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#546E7A] hover:text-rose-600 hover:bg-rose-50 transition-all text-sm font-medium">
          <LogOut size={16} />
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
