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
    <aside className="w-64 flex-shrink-0 flex flex-col h-screen border-r border-gray-800/50"
           style={{ background: 'linear-gradient(180deg, #0a0a1a 0%, #0f0f2a 100%)' }}>

      {/* Logo */}
      <div className="p-6 border-b border-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/40"
               style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)' }}>
            <TrendingUp size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white leading-tight">Akıllı Harçlık</h1>
            <p className="text-xs text-purple-400 font-medium">Finans Koçu</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label, id }) => (
          <NavLink key={to} to={to} id={id} end
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive ? 'text-white border border-purple-500/40 shadow-sm shadow-purple-500/10'
                         : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
            style={({ isActive }) => isActive ? { background: 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(99,102,241,0.15))' } : {}}
          >
            {({ isActive }) => (
              <>
                <Icon size={18} className={isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-gray-300'} />
                {label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-3 border-t border-gray-800/50 space-y-1">
        {/* Profile Link */}
        <NavLink to="/profile" id="nav-profile"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group cursor-pointer ${
              isActive ? 'bg-purple-500/10 text-white' : 'hover:bg-white/5'
            }`
          }>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-black text-white flex-shrink-0"
               style={{ background: `linear-gradient(135deg, ${user?.avatarColor || '#7c3aed'}, ${(user?.avatarColor || '#7c3aed') + '99'})` }}>
            {initials(user?.displayName)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.displayName || 'Kullanıcı'}</p>
            <p className="text-xs text-gray-500 truncate">@{user?.username}</p>
          </div>
          <Settings size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors flex-shrink-0" />
        </NavLink>

        {/* Logout */}
        <button id="btn-logout" onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all text-sm font-medium">
          <LogOut size={16} />
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
