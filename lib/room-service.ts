// Room service API calls
import { apiClient } from "./api-client"
import { API_ENDPOINTS } from "./api-config"
import type { PhongViewModel, ApiResponse, PaginationParams, PaginationResponse } from "./types"

export async function getAllRooms() {
  const response = await apiClient<ApiResponse<PhongViewModel[]>>(API_ENDPOINTS.PHONG.BASE)
  return response.content
}

export async function getRoomById(id: number) {
  const response = await apiClient<ApiResponse<PhongViewModel>>(API_ENDPOINTS.PHONG.BY_ID(id))
  return response.content
}

export async function getRoomsByLocation(maViTri: number) {
  const response = await apiClient<ApiResponse<PhongViewModel[]>>(
    `${API_ENDPOINTS.PHONG.BY_LOCATION}?maViTri=${maViTri}`,
  )
  return response.content
}

export async function searchRooms(params: PaginationParams) {
  const queryString = new URLSearchParams({
    pageIndex: String(params.pageIndex || 1),
    pageSize: String(params.pageSize || 10),
    keyword: params.keyword || "",
  }).toString()

  const response = await apiClient<ApiResponse<PaginationResponse<PhongViewModel>>>(
    `${API_ENDPOINTS.PHONG.PAGINATION}?${queryString}`,
  )
  return response.content
}

export async function createRoom(room: Omit<PhongViewModel, "id">) {
  const response = await apiClient<ApiResponse<PhongViewModel>>(API_ENDPOINTS.PHONG.BASE, {
    method: "POST",
    body: JSON.stringify(room),
    requiresAuth: true,
  })
  return response.content
}

export async function updateRoom(id: number, room: Partial<PhongViewModel>) {
  const response = await apiClient<ApiResponse<PhongViewModel>>(API_ENDPOINTS.PHONG.BY_ID(id), {
    method: "PUT",
    body: JSON.stringify(room),
    requiresAuth: true,
  })
  return response.content
}

export async function deleteRoom(id: number) {
  const response = await apiClient<ApiResponse<void>>(API_ENDPOINTS.PHONG.BY_ID(id), {
    method: "DELETE",
    requiresAuth: true,
  })
  return response.content
}

export async function uploadRoomImage(maPhong: number, file: File) {
  const formData = new FormData()
  formData.append("maPhong", String(maPhong))
  formData.append("formFile", file)

  const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null

  const response = await fetch(
    `https://airbnbnew.cybersoft.edu.vn${API_ENDPOINTS.PHONG.UPLOAD_IMAGE}?maPhong=${maPhong}`,
    {
      method: "POST",
      headers: {
        token: token || "",
        tokenCybersoft:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NyIsIkhldEhhblN0cmluZyI6IjI3LzAzLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3NDU2OTYwMDAwMCIsIm5iZiI6MTc0NzI0MjAwMCwiZXhwIjoxNzc0NzE3MjAwfQ.YJSCMUqM4JgIqsDiGq9fxRp3AOrIdxBO4t7xxj6K8dY",
      },
      body: formData,
    },
  )

  if (!response.ok) {
    throw new Error("Failed to upload room image")
  }

  return response.json()
}
