// Location service API calls
import { apiClient } from "./api-client"
import { API_ENDPOINTS } from "./api-config"
import type { ViTriViewModel, ApiResponse, PaginationParams, PaginationResponse } from "./types"

export async function getAllLocations() {
  const response = await apiClient<ApiResponse<ViTriViewModel[]>>(API_ENDPOINTS.VI_TRI.BASE)
  return response.content
}

export async function getLocationById(id: number) {
  const response = await apiClient<ApiResponse<ViTriViewModel>>(API_ENDPOINTS.VI_TRI.BY_ID(id))
  return response.content
}

export async function searchLocations(params: PaginationParams) {
  const queryString = new URLSearchParams({
    pageIndex: String(params.pageIndex || 1),
    pageSize: String(params.pageSize || 10),
    keyword: params.keyword || "",
  }).toString()

  const response = await apiClient<ApiResponse<PaginationResponse<ViTriViewModel>>>(
    `${API_ENDPOINTS.VI_TRI.PAGINATION}?${queryString}`,
  )
  return response.content
}
