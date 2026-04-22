import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
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
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="text-center">
        <div className="w-14 h-14 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-400 text-sm">Yükleniyor...</p>
      </div>
    </div>
  )

  if (!user) return <LoginPage />

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar — sadece lg+ ekranlarda */}
      <Sidebar />

      {/* Ana içerik */}
      <main className="flex-1 overflow-y-auto pb-16 lg:pb-0"
            style={{ background: 'radial-gradient(ellipse at top left, #1a0533 0%, #080812 50%)' }}>
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

      {/* Alt nav — sadece mobil */}
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  )
}
