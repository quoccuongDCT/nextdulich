// Admin service for management operations
import { apiClient } from "./api-client"
import { API_ENDPOINTS } from "./api-config"
import type {
  ThongTinNguoiDung,
  PhongViewModel,
  ViTriViewModel,
  DatPhongViewModel,
  BinhLuanViewModel,
  ApiResponse,
  PaginationParams,
  PaginationResponse,
} from "./types"

// ============ USERS ============sdfsd
export async function getAllUsers() {
  const response = await apiClient<ApiResponse<ThongTinNguoiDung[]>>(API_ENDPOINTS.USERS.BASE)
  return response.content
}

export async function searchUsers(params: PaginationParams) {
  const queryString = new URLSearchParams({
    pageIndex: String(params.pageIndex || 1),
    pageSize: String(params.pageSize || 10),
    keyword: params.keyword || "",
  }).toString()

  const response = await apiClient<ApiResponse<PaginationResponse<ThongTinNguoiDung>>>(
    `${API_ENDPOINTS.USERS.PAGINATION}?${queryString}`,
  )
  return response.content
}

export async function createUser(userData: ThongTinNguoiDung) {
  const response = await apiClient<ApiResponse<ThongTinNguoiDung>>(API_ENDPOINTS.USERS.BASE, {
    method: "POST",
    body: JSON.stringify(userData),
  })
  return response.content
}

export async function updateUser(id: number, userData: Partial<ThongTinNguoiDung>) {
  const response = await apiClient<ApiResponse<ThongTinNguoiDung>>(API_ENDPOINTS.USERS.BY_ID(id), {
    method: "PUT",
    body: JSON.stringify(userData),
  })
  return response.content
}

export async function deleteUser(id: number) {
  const response = await apiClient<ApiResponse<void>>(`${API_ENDPOINTS.USERS.BASE}?id=${id}`, {
    method: "DELETE",
  })
  return response.content
}

// ============ ROOMS ============
export async function getAllRooms() {
  const response = await apiClient<ApiResponse<PhongViewModel[]>>(API_ENDPOINTS.PHONG.BASE)
  return response.content
}

export async function createRoom(roomData: PhongViewModel) {
  const response = await apiClient<ApiResponse<PhongViewModel>>(API_ENDPOINTS.PHONG.BASE, {
    method: "POST",
    body: JSON.stringify(roomData),
    requiresAuth: true,
  })
  return response.content
}

export async function updateRoom(id: number, roomData: PhongViewModel) {
  const response = await apiClient<ApiResponse<PhongViewModel>>(API_ENDPOINTS.PHONG.BY_ID(id), {
    method: "PUT",
    body: JSON.stringify(roomData),
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

// ============ LOCATIONS ============
export async function getAllLocations() {
  const response = await apiClient<ApiResponse<ViTriViewModel[]>>(API_ENDPOINTS.VI_TRI.BASE)
  return response.content
}

// ============ BOOKINGS ============
export async function getAllBookings() {
  const response = await apiClient<ApiResponse<DatPhongViewModel[]>>(API_ENDPOINTS.DAT_PHONG.BASE)
  return response.content
}

export async function updateBooking(id: number, bookingData: DatPhongViewModel) {
  const response = await apiClient<ApiResponse<DatPhongViewModel>>(API_ENDPOINTS.DAT_PHONG.BY_ID(id), {
    method: "PUT",
    body: JSON.stringify(bookingData),
  })
  return response.content
}

export async function deleteBooking(id: number) {
  const response = await apiClient<ApiResponse<void>>(API_ENDPOINTS.DAT_PHONG.BY_ID(id), {
    method: "DELETE",
  })
  return response.content
}

// ============ COMMENTS ============
export async function getAllComments() {
  const response = await apiClient<ApiResponse<BinhLuanViewModel[]>>(API_ENDPOINTS.BINH_LUAN.BASE)
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
