// Custom hook for authentication
"use client"

import { useState, useEffect } from "react"
import { getUserData, getAuthToken } from "@/lib/api-client"

export function useAuth() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const userData = getUserData()
    const token = getAuthToken()

    if (userData && token) {
      setUser(userData)
    }

    setIsLoading(false)
  }, [])

  const isAuthenticated = !!user

  return { user, isAuthenticated, isLoading }
}
