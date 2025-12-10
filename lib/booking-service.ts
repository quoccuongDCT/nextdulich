// Booking service API calls
import { apiClient } from "./api-client"
import { API_ENDPOINTS } from "./api-config"
import type { DatPhongViewModel, ApiResponse } from "./types"

export async function getAllBookings() {
  const response = await apiClient<ApiResponse<DatPhongViewModel[]>>(API_ENDPOINTS.DAT_PHONG.BASE)
  return response.content
}

export async function getBookingById(id: number) {
  const response = await apiClient<ApiResponse<DatPhongViewModel>>(API_ENDPOINTS.DAT_PHONG.BY_ID(id))
  return response.content
}

export async function getBookingsByUser(userId: number) {
  const response = await apiClient<ApiResponse<DatPhongViewModel[]>>(API_ENDPOINTS.DAT_PHONG.BY_USER(userId))
  return response.content
}

export async function createBooking(bookingData: Omit<DatPhongViewModel, "id">) {
  const response = await apiClient<ApiResponse<DatPhongViewModel>>(API_ENDPOINTS.DAT_PHONG.BASE, {
    method: "POST",
    body: JSON.stringify(bookingData),
    requiresAuth: true,
  })
  return response.content
}

export async function updateBooking(id: number, bookingData: DatPhongViewModel) {
  const response = await apiClient<ApiResponse<DatPhongViewModel>>(API_ENDPOINTS.DAT_PHONG.BY_ID(id), {
    method: "PUT",
    body: JSON.stringify(bookingData),
    requiresAuth: true,
  })
  return response.content
}

export async function deleteBooking(id: number) {
  const response = await apiClient<ApiResponse<void>>(API_ENDPOINTS.DAT_PHONG.BY_ID(id), {
    method: "DELETE",
    requiresAuth: true,
  })
  return response.content
}
