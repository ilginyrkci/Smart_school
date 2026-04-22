import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Sidebar    from './components/Sidebar'
import BottomNav  from './components/BottomNav'
import Dashboard  from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Analytics  from './pages/Analytics'
import Coach      from './pages/Coach'
import Budget     from './pages/Budget'
import LoginPage  from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'

function AppLayout() {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#FFF7ED] dark:bg-[#0a0a0a]">
      <div className="text-center">
        <div className="w-14 h-14 border-2 border-[#FF6B6B] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-[#6B7280] dark:text-[#FFB3B3] text-sm">Yükleniyor...</p>
      </div>
    </div>
  )

  if (!user) return <LoginPage />

  return (
    <div className="flex h-screen bg-[#FFF7ED] dark:bg-[#0a0a0a] overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pb-16 lg:pb-0 bg-[#FFF7ED] dark:bg-[#0a0a0a]">
        <Routes>
          <Route path="/"             element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/analytics"    element={<Analytics />} />
          <Route path="/coach"        element={<Coach />} />
          <Route path="/budget"       element={<Budget />} />
          <Route path="/profile"      element={<ProfilePage />} />
          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}
