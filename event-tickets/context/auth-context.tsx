"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  name: string
  email: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  // Check for saved user on initial load
  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Failed to parse saved user", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Esta es una implementación simulada - en una app real, llamarías a tu API
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Validación simulada - en una app real, esto sería manejado por tu backend
        if (email === "usuario@ejemplo.com" && password === "contraseña") {
          const user = {
            id: "1",
            name: "Usuario Demo",
            email: "usuario@ejemplo.com",
          }
          setUser(user)
          localStorage.setItem("user", JSON.stringify(user))
          resolve()
        } else {
          reject(new Error("Credenciales inválidas"))
        }
      }, 500)
    })
  }

  const register = async (name: string, email: string, password: string) => {
    // This is a mock implementation - in a real app, you would call your API
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        // In a real app, this would create a new user in your database
        const user = {
          id: "1",
          name,
          email,
        }
        // We don't log in the user automatically after registration
        // They need to login with their credentials
        resolve()
      }, 500)
    })
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
