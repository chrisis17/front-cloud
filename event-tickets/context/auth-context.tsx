"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type User = {
  id: string
  username: string
  email: string
  token?: string
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    setLoading(true)
    setError(null)
    console.log(email, password)
    
    try {
      const response = await fetch("http://3.229.99.45:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      console.log(JSON.stringify({ email, password }))
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Error en el inicio de sesión")
      }
  
      // Si la respuesta es 200 pero no hay body, usamos los datos que el usuario ingresó
      const user: User = {
        id: "1", // o usa un valor dummy si necesitas un ID
        username: email.split("@")[0], // puedes personalizar esto si tienes un input de username separado
        email,
      }
  
      setUser(user)
      localStorage.setItem("user", JSON.stringify(user))
    } catch (err) {
      console.error("Login error:", err)
      setError(err instanceof Error ? err.message : "Error desconocido en el login")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    setLoading(true)
    setError(null)
    console.log("username", username)
    console.log("email", email)
    console.log("password", password)
    
    try {
      const response = await fetch("http://3.229.99.45:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ 
          username, 
          email, 
          password 
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Error en el registro: ${response.statusText}`)
      }

      const userData = await response.json()
      
      if (userData.id || userData.token) {
        const user: User = {
          id: userData.id || "generated-id", // Usar un valor por defecto si el backend no lo proporciona
          username,
          email,
          token: userData.token
        }
        setUser(user)
        console.log("user: ", user)
        localStorage.setItem("user", JSON.stringify(user))
      }
    } catch (err) {
      console.error("Registration error:", err)
      setError(err instanceof Error ? err.message : "Error desconocido en el registro")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout,
      loading,
      error 
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}