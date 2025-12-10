// API Configuration for Airbnb Application
export const API_BASE_URL = "https://airbnbnew.cybersoft.edu.vn"

export const TOKEN_CYBERSOFT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb3AiOiJCb290Y2FtcCA4NyIsIkhldEhhblN0cmluZyI6IjI3LzAzLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc3NDU2OTYwMDAwMCIsIm5iZiI6MTc0NzI0MjAwMCwiZXhwIjoxNzc0NzE3MjAwfQ.YJSCMUqM4JgIqsDiGq9fxRp3AOrIdxBO4t7xxj6K8dY"

/**
 * IMPORTANT SECURITY NOTES:
 *
 * 1. TOKEN REQUIREMENTS:
 *    - tokenCybersoft: Required for ALL API calls (system token)
 *    - token: Required only for specific authenticated operations (user JWT)
 *
 * 2. APIS THAT REQUIRE USER TOKEN (token):
 *    - POST /api/binh-luan
 *    - PUT /api/binh-luan/{id}
 *    - DELETE /api/binh-luan/{id}
 *    - POST /api/phong-thue
 *    - PUT /api/phong-thue/{id}
 *    - DELETE /api/phong-thue/{id}
 *    - POST /api/phong-thue/upload-hinh-phong
 *    - POST /api/users/upload-avatar
 *
 * 3. APIs THAT ONLY REQUIRE tokenCybersoft:
 *    - GET /api/phong-thue (get all rooms)
 *    - GET /api/users (get all users)
 *    - DELETE /api/users?id={id} (delete user - NO ROLE CHECK!)
 *    - POST /api/dat-phong (book room)
 *    - GET /api/vi-tri (get locations)
 *
 * 4. SECURITY LIMITATIONS:
 *    - Backend API does NOT implement role-based authorization
 *    - Anyone with tokenCybersoft can call admin operations (delete users, etc.)
 *    - Frontend implements UI-level role checking, but this is NOT secure
 *    - In production, backend MUST add role-based middleware
 *
 * 5. RECOMMENDED BACKEND IMPROVEMENTS:
 *    - Add role checking middleware for admin operations
 *    - Implement ownership verification (users can only edit their own data)
 *    - Add rate limiting per user
 *    - Validate all inputs server-side
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNUP: "/api/auth/signup",
    SIGNIN: "/api/auth/signin",
  },
  // User endpoints
  USERS: {
    BASE: "/api/users",
    BY_ID: (id: number) => `/api/users/${id}`,
    SEARCH: (name: string) => `/api/users/search/${name}`,
    PAGINATION: "/api/users/phan-trang-tim-kiem",
    UPLOAD_AVATAR: "/api/users/upload-avatar",
  },
  // Room endpoints
  PHONG: {
    BASE: "/api/phong-thue",
    BY_ID: (id: number) => `/api/phong-thue/${id}`,
    BY_LOCATION: "/api/phong-thue/lay-phong-theo-vi-tri",
    PAGINATION: "/api/phong-thue/phan-trang-tim-kiem",
    UPLOAD_IMAGE: "/api/phong-thue/upload-hinh-phong",
  },
  // Location endpoints
  VI_TRI: {
    BASE: "/api/vi-tri",
    BY_ID: (id: number) => `/api/vi-tri/${id}`,
    PAGINATION: "/api/vi-tri/phan-trang-tim-kiem",
  },
  // Booking endpoints
  DAT_PHONG: {
    BASE: "/api/dat-phong",
    BY_ID: (id: number) => `/api/dat-phong/${id}`,
    BY_USER: (userId: number) => `/api/dat-phong/lay-theo-nguoi-dung/${userId}`,
  },
  // Comment endpoints
  BINH_LUAN: {
    BASE: "/api/binh-luan",
    BY_ID: (id: number) => `/api/binh-luan/${id}`,
    BY_ROOM: (roomId: number) => `/api/binh-luan/lay-binh-luan-theo-phong/${roomId}`,
  },
} as const
