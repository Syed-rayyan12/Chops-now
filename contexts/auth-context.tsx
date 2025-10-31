"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

export interface User {
  id: string
  name: string
  email: string
  phone: string
  profilePicture?: string
  addresses: Address[]
  paymentMethods: PaymentMethod[]
  createdAt: string
}

export interface Address {
  id: string
  label: string
  address: string
  details?: string
  isDefault: boolean
}

export interface PaymentMethod {
  id: string
  type: "card" | "digital"
  label: string
  details: string
  isDefault: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  signup: (name: string, email: string, phone: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => void
  addAddress: (address: Omit<Address, "id">) => void
  updateAddress: (id: string, updates: Partial<Address>) => void
  removeAddress: (id: string) => void
  addPaymentMethod: (method: Omit<PaymentMethod, "id">) => void
  removePaymentMethod: (id: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "chop-now-user"

// Mock users for demo
const MOCK_USERS = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    password: "password123",
    addresses: [
      {
        id: "addr-1",
        label: "Home",
        address: "123 Main Street, Apt 4B, Downtown",
        details: "Ring doorbell twice",
        isDefault: true,
      },
      {
        id: "addr-2",
        label: "Work",
        address: "456 Business Ave, Suite 200, Business District",
        details: "Leave with reception",
        isDefault: false,
      },
    ],
    paymentMethods: [
      {
        id: "pm-1",
        type: "card" as const,
        label: "Visa ending in 1234",
        details: "**** **** **** 1234",
        isDefault: true,
      },
    ],
    createdAt: "2024-01-15T10:00:00Z",
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEY)
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (!isLoading) {
      try {
        if (user) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch (error) {
        console.error("Error saving user to localStorage:", error)
      }
    }
  }, [user, isLoading])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const mockUser = MOCK_USERS.find((u) => u.email === email && u.password === password)

    if (mockUser) {
      const { password: _, ...userWithoutPassword } = mockUser
      setUser(userWithoutPassword as User)
      return true
    }

    return false
  }

  const signup = async (name: string, email: string, phone: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = MOCK_USERS.find((u) => u.email === email)
    if (existingUser) {
      return false
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      addresses: [],
      paymentMethods: [],
      createdAt: new Date().toISOString(),
    }

    // Add to mock users (in real app, this would be sent to backend)
    MOCK_USERS.push({ ...newUser, password } as any)

    setUser(newUser)
    return true
  }

  const logout = () => {
    setUser(null)
  }

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates })
    }
  }

  const addAddress = (address: Omit<Address, "id">) => {
    if (user) {
      const newAddress: Address = {
        ...address,
        id: `addr-${Date.now()}`,
      }

      // If this is the first address or marked as default, make it default
      if (user.addresses.length === 0 || address.isDefault) {
        user.addresses.forEach((addr) => (addr.isDefault = false))
        newAddress.isDefault = true
      }

      setUser({
        ...user,
        addresses: [...user.addresses, newAddress],
      })
    }
  }

  const updateAddress = (id: string, updates: Partial<Address>) => {
    if (user) {
      const updatedAddresses = user.addresses.map((addr) => {
        if (addr.id === id) {
          const updated = { ...addr, ...updates }
          // If setting as default, unset others
          if (updates.isDefault) {
            user.addresses.forEach((a) => (a.isDefault = false))
          }
          return updated
        }
        return addr
      })

      setUser({ ...user, addresses: updatedAddresses })
    }
  }

  const removeAddress = (id: string) => {
    if (user) {
      const filteredAddresses = user.addresses.filter((addr) => addr.id !== id)

      // If we removed the default address, make the first one default
      if (filteredAddresses.length > 0 && !filteredAddresses.some((addr) => addr.isDefault)) {
        filteredAddresses[0].isDefault = true
      }

      setUser({ ...user, addresses: filteredAddresses })
    }
  }

  const addPaymentMethod = (method: Omit<PaymentMethod, "id">) => {
    if (user) {
      const newMethod: PaymentMethod = {
        ...method,
        id: `pm-${Date.now()}`,
      }

      // If this is the first payment method or marked as default, make it default
      if (user.paymentMethods.length === 0 || method.isDefault) {
        user.paymentMethods.forEach((pm) => (pm.isDefault = false))
        newMethod.isDefault = true
      }

      setUser({
        ...user,
        paymentMethods: [...user.paymentMethods, newMethod],
      })
    }
  }

  const removePaymentMethod = (id: string) => {
    if (user) {
      const filteredMethods = user.paymentMethods.filter((pm) => pm.id !== id)

      // If we removed the default payment method, make the first one default
      if (filteredMethods.length > 0 && !filteredMethods.some((pm) => pm.isDefault)) {
        filteredMethods[0].isDefault = true
      }

      setUser({ ...user, paymentMethods: filteredMethods })
    }
  }

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    addAddress,
    updateAddress,
    removeAddress,
    addPaymentMethod,
    removePaymentMethod,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
