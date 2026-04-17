import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('finans_token')
    const stored = localStorage.getItem('finans_user')
    if (token && stored) {
      try { setUser(JSON.parse(stored)) } catch { clearAuth() }
    }
    setLoading(false)
  }, [])

  const saveAuth = (token, userData) => {
    localStorage.setItem('finans_token', token)
    localStorage.setItem('finans_user', JSON.stringify(userData))
    setUser(userData)
  }

  const clearAuth = () => {
    localStorage.removeItem('finans_token')
    localStorage.removeItem('finans_user')
    setUser(null)
  }

  const login = async (username, password) => {
    const res = await authService.login(username, password)
    saveAuth(res.data.token, res.data.user)
    return res.data
  }

  const register = async (username, password, displayName) => {
    const res = await authService.register(username, password, displayName)
    saveAuth(res.data.token, res.data.user)
    return res.data
  }

  const logout = async () => {
    try { await authService.logout() } catch {}
    clearAuth()
  }

  const updateUser = (updatedUser) => {
    localStorage.setItem('finans_user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
