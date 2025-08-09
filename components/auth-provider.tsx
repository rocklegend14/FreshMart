"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface AuthContextType {
  isAuthenticated: boolean
  user: { email: string; name: string; role?: string } | null
  token: string | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string; role?: string } | null>(null)
  const [token, setToken] = useState<string | null>(null)

  // Load auth state from localStorage on initial render
  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Failed to parse user from localStorage:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // Make real API call to login
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData);
        return false;
      }

      const data = await response.json();
      
      // Store token and user info
      const newToken = data.token;
      const userData = {
        email,
        name: data.user?.name || email.split('@')[0],
        role: data.user?.role || 'CUSTOMER'
      };
      
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      // Make real API call to register
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration failed:', errorData);
        return false;
      }

      const data = await response.json();
      
      // Registration successful, auto login
      setToken(data.token);
      setUser({ email, name, role: 'CUSTOMER' });
      setIsAuthenticated(true);
      
      // Save to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify({ email, name, role: 'CUSTOMER' }));
      
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        register,
        logout,
      }}
    >
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
