// API Client utility functions
import { API_BASE_URL, TOKEN_CYBERSOFT } from "./api-config"

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { requiresAuth = false, headers = {}, ...fetchOptions } = options

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    tokenCybersoft: TOKEN_CYBERSOFT,
  }

  if (requiresAuth) {
    const token = getAuthToken()
    if (token) {
      defaultHeaders["token"] = token
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(response.status, errorData.message || `API Error: ${response.status}`)
  }

  return response.json()
}

export function setAuthToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token)
  }
}

export function getAuthToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token")
  }
  return null
}

export function removeAuthToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token")
  }
}

export function setUserData(user: any): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("user_data", JSON.stringify(user))
  }
}

export function getUserData(): any | null {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("user_data")
    return data ? JSON.parse(data) : null
  }
  return null
}

export function removeUserData(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user_data")
  }
}
