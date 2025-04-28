// services/auth.tsx
"use client"

import { onAuthStateChanged, User, signOut } from "firebase/auth"
import { auth } from "@/firebase/clientApp"
import { useState, useEffect, useContext, createContext } from "react"

const AuthContext = createContext<{
  user: User | null
  loading: boolean
  logout: () => Promise<void>
}>({
  user: null,
  loading: true,
  logout: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
