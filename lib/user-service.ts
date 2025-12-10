// User service API calls
import { apiClient } from "./api-client"
import { API_ENDPOINTS } from "./api-config"
import type { ThongTinNguoiDung, CapNhatNguoiDung, ApiResponse } from "./types"

export async function getUserById(id: number) {
  const response = await apiClient<ApiResponse<ThongTinNguoiDung>>(API_ENDPOINTS.USERS.BY_ID(id), {
    requiresAuth: true,
  })
  return response.content
}

export async function updateUser(id: number, userData: CapNhatNguoiDung) {
  const response = await apiClient<ApiResponse<ThongTinNguoiDung>>(API_ENDPOINTS.USERS.BY_ID(id), {
    method: "PUT",
    body: JSON.stringify(userData),
    requiresAuth: true,
  })
  return response.content
}
