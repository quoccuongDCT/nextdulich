// Type definitions for API models

export interface ThongTinNguoiDung {
  id: number
  name: string
  email: string
  password: string
  phone: string
  birthday: string
  gender: boolean
  role: string
  avatar?: string
}

export interface DangNhapView {
  email: string
  password: string
}

export interface AuthResponse {
  user: Omit<ThongTinNguoiDung, "password">
  token: string
}

export interface ViTriViewModel {
  id: number
  tenViTri: string
  tinhThanh: string
  quocGia: string
  hinhAnh: string
}

export interface PhongViewModel {
  id: number
  tenPhong: string
  khach: number
  phongNgu: number
  giuong: number
  phongTam: number
  moTa: string
  giaTien: number
  mayGiat: boolean
  banLa: boolean
  tivi: boolean
  dieuHoa: boolean
  wifi: boolean
  bep: boolean
  doXe: boolean
  hoBoi: boolean
  banUi: boolean
  maViTri: number
  hinhAnh: string
}

export interface DatPhongViewModel {
  id: number
  maPhong: number
  ngayDen: string
  ngayDi: string
  soLuongKhach: number
  maNguoiDung: number
}

export interface BinhLuanViewModel {
  id: number
  maPhong: number
  maNguoiBinhLuan: number
  ngayBinhLuan: string
  noiDung: string
  saoBinhLuan: number
}

export interface PaginationParams {
  pageIndex?: number
  pageSize?: number
  keyword?: string
}

export interface PaginationResponse<T> {
  data: T[]
  pageIndex: number
  pageSize: number
  totalRow: number
}

export interface ApiResponse<T> {
  statusCode: number
  content: T
  message?: string
  dateTime?: string
}
