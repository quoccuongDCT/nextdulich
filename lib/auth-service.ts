// Authentication service
import { apiClient, setAuthToken, removeAuthToken, setUserData, removeUserData } from "./api-client"
import { API_ENDPOINTS } from "./api-config"
import type { DangNhapView, ThongTinNguoiDung, ApiResponse } from "./types"

export async function signIn(credentials: DangNhapView) {
  const response = await apiClient<ApiResponse<any>>(API_ENDPOINTS.AUTH.SIGNIN, {
    method: "POST",
    body: JSON.stringify(credentials),
  })

  if (response.content && response.content.token) {
    setAuthToken(response.content.token)
    setUserData(response.content.user)
  }

  return response.content
}

export async function signUp(userData: Omit<ThongTinNguoiDung, "id">) {
  const response = await apiClient<ApiResponse<any>>(API_ENDPOINTS.AUTH.SIGNUP, {
    method: "POST",
    body: JSON.stringify(userData),
  })

  return response.content
}

export function signOut() {
  removeAuthToken()
  removeUserData()
}
