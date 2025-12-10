// Comment service API calls
import { apiClient } from "./api-client"
import { API_ENDPOINTS } from "./api-config"
import type { BinhLuanViewModel, ApiResponse } from "./types"

export async function getAllComments() {
  const response = await apiClient<ApiResponse<BinhLuanViewModel[]>>(API_ENDPOINTS.BINH_LUAN.BASE)
  return response.content
}

export async function getCommentsByRoom(roomId: number) {
  const response = await apiClient<ApiResponse<BinhLuanViewModel[]>>(API_ENDPOINTS.BINH_LUAN.BY_ROOM(roomId))
  return response.content
}

export async function createComment(commentData: Omit<BinhLuanViewModel, "id">) {
  const response = await apiClient<ApiResponse<BinhLuanViewModel>>(API_ENDPOINTS.BINH_LUAN.BASE, {
    method: "POST",
    body: JSON.stringify(commentData),
    requiresAuth: true,
  })
  return response.content
}

export async function updateComment(id: number, commentData: BinhLuanViewModel) {
  const response = await apiClient<ApiResponse<BinhLuanViewModel>>(API_ENDPOINTS.BINH_LUAN.BY_ID(id), {
    method: "PUT",
    body: JSON.stringify(commentData),
    requiresAuth: true,
  })
  return response.content
}

export async function deleteComment(id: number) {
  const response = await apiClient<ApiResponse<void>>(API_ENDPOINTS.BINH_LUAN.BY_ID(id), {
    method: "DELETE",
    requiresAuth: true,
  })
  return response.content
}
