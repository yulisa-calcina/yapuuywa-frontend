import { createContext, useContext, useState, useCallback } from 'react'
import apiClient from '../api/axiosConfig'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const login = useCallback(async (dni, password) => {
    setLoading(true)
    setError(null)
    try {
      const res = await apiClient.post('/login', { dni, password })
      const { access_token, user: userData } = res.data
      localStorage.setItem('token', access_token)
      setToken(access_token)
      setUser(userData)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'DNI o contraseña incorrectos'
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try { await apiClient.post('/logout') } catch (_) {}
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, logout, isAuth: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
