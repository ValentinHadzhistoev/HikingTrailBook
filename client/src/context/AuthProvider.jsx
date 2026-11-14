import { useEffect, useState } from 'react'
import AuthContext from './AuthContext'
import * as authApi from '../api/auth'
import { AUTH_EXPIRED_EVENT } from '../api/requester'

function loadAuth() {
  try {
    return JSON.parse(localStorage.getItem('auth'))
  } catch {
    return null
  }
}

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState(loadAuth)

  useEffect(() => {
    const handleExpired = () => setAuth(null)

    window.addEventListener(AUTH_EXPIRED_EVENT, handleExpired)
    return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handleExpired)
  }, [])

  const saveAuth = (data) => {
    setAuth(data)
    localStorage.setItem('auth', JSON.stringify(data))
  }

  const clearAuth = () => {
    setAuth(null)
    localStorage.removeItem('auth')
  }

  const loginHandler = async (email, password) => {
    const result = await authApi.login(email, password)
    saveAuth(result)
  }

  const registerHandler = async (email, password) => {
    const result = await authApi.register(email, password)
    saveAuth(result)
  }

  const logoutHandler = async () => {
    try {
      await authApi.logout()
    } catch {
      // The session is cleared below whether or not the server still knew it
    } finally {
      clearAuth()
    }
  }

  const value = {
    userId: auth?._id,
    email: auth?.email,
    isAuthenticated: Boolean(auth?.accessToken),
    loginHandler,
    registerHandler,
    logoutHandler,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}