"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import { Search, Loader2, Trash2, Edit, Plus, AlertCircle, Eye } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getAllRooms, createRoom, updateRoom, deleteRoom } from "@/lib/admin-service"
import { getAllLocations } from "@/lib/location-service"
import type { PhongViewModel, ViTriViewModel } from "@/lib/types"

const ITEMS_PER_PAGE = 10

export default function AdminRoomsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [rooms, setRooms] = useState<PhongViewModel[]>([])
  const [locations, setLocations] = useState<ViTriViewModel[]>([])
  const [filteredRooms, setFilteredRooms] = useState<PhongViewModel[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<PhongViewModel | null>(null)
  const [formData, setFormData] = useState<PhongViewModel>({
    id: 0,
    tenPhong: "",
    khach: 1,
    phongNgu: 1,
    giuong: 1,
    phongTam: 1,
    moTa: "",
    giaTien: 0,
    mayGiat: false,
    banLa: false,
    tivi: false,
    dieuHoa: false,
    wifi: false,
    bep: false,
    doXe: false,
    hoBoi: false,
    banUi: false,
    maViTri: 1,
    hinhAnh: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchRooms = async () => {
    setIsLoading(true)
    try {
      const [roomsData, locationsData] = await Promise.all([getAllRooms(), getAllLocations()])
      setRooms(roomsData)
      setFilteredRooms(roomsData)
      setLocations(locationsData)
      setError("")
    } catch (error) {
      console.error("[v0] Error fetching data:", error)
      setError("Không thể tải danh sách phòng")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/")
      return
    }

    if (isAuthenticated && user?.role === "ADMIN") {
      fetchRooms()
    }
  }, [isAuthenticated, user, authLoading, router])

  useEffect(() => {
    if (searchQuery) {
      const filtered = rooms.filter((r) => r.tenPhong.toLowerCase().includes(searchQuery.toLowerCase()))
      setFilteredRooms(filtered)
    } else {
      setFilteredRooms(rooms)
    }
    setCurrentPage(1)
  }, [searchQuery, rooms])

  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentRooms = filteredRooms.slice(startIndex, endIndex)

  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages)
      }
    }
    return pages
  }

  const handleCreate = () => {
    setFormData({
      id: 0,
      tenPhong: "",
      khach: 1,
      phongNgu: 1,
      giuong: 1,
      phongTam: 1,
      moTa: "",
      giaTien: 0,
      mayGiat: false,
      banLa: false,
      tivi: false,
      dieuHoa: false,
      wifi: false,
      bep: false,
      doXe: false,
      hoBoi: false,
      banUi: false,
      maViTri: locations.length > 0 ? locations[0].id : 1,
      hinhAnh: "",
    })
    setShowCreateDialog(true)
  }

  const handleEdit = (room: PhongViewModel) => {
    setSelectedRoom(room)
    setFormData(room)
    setShowEditDialog(true)
  }

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createRoom(formData)
      await fetchRooms()
      setShowCreateDialog(false)
      setError("")
    } catch (err: any) {
      setError(err.message || "Không thể tạo phòng")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRoom) return

    setIsSubmitting(true)
    try {
      await updateRoom(selectedRoom.id, formData)
      await fetchRooms()
      setShowEditDialog(false)
      setError("")
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật phòng")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRoom = async () => {
    if (!selectedRoom) return

    setIsSubmitting(true)
    try {
      await deleteRoom(selectedRoom.id)
      await fetchRooms()
      setShowDeleteDialog(false)
      if (currentRooms.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      setError("")
    } catch (err: any) {
      setError(err.message || "Không thể xóa phòng")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex flex-1">
        <AdminSidebar />

        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Quản lý phòng</h1>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm phòng
            </Button>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm phòng..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentRooms.length > 0 ? (
              currentRooms.map((room) => (
                <Card key={room.id} className="overflow-hidden">
                  <div className="relative h-48 bg-muted">
                    <img
                      src={
                        room.hinhAnh ||
                        `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(room.tenPhong) || "/placeholder.svg"}`
                      }
                      alt={room.tenPhong}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">{room.tenPhong}</h3>
                    <p className="text-2xl font-bold text-primary mb-3">${room.giaTien} / đêm</p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent"
                        onClick={() => router.push(`/rooms/${room.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Xem
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(room)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive bg-transparent"
                        onClick={() => {
                          setSelectedRoom(room)
                          setShowDeleteDialog(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <p className="text-lg text-muted-foreground">Không tìm thấy phòng nào</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) setCurrentPage(currentPage - 1)
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>

                  {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(page as number)
                          }}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}

                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1)
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          <p className="text-sm text-muted-foreground mt-6">
            Tổng số: {filteredRooms.length} phòng | Trang {currentPage} / {totalPages}
          </p>
        </main>
      </div>

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm phòng mới</DialogTitle>
            <DialogDescription>Nhập thông tin phòng mới</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitCreate}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-tenPhong">Tên phòng</Label>
                  <Input
                    id="create-tenPhong"
                    value={formData.tenPhong}
                    onChange={(e) => setFormData({ ...formData, tenPhong: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-giaTien">Giá tiền ($)</Label>
                  <Input
                    id="create-giaTien"
                    type="number"
                    min="0"
                    value={formData.giaTien}
                    onChange={(e) => setFormData({ ...formData, giaTien: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="create-khach">Số khách</Label>
                  <Input
                    id="create-khach"
                    type="number"
                    min="1"
                    value={formData.khach}
                    onChange={(e) => setFormData({ ...formData, khach: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-phongNgu">Phòng ngủ</Label>
                  <Input
                    id="create-phongNgu"
                    type="number"
                    min="0"
                    value={formData.phongNgu}
                    onChange={(e) => setFormData({ ...formData, phongNgu: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-giuong">Giường</Label>
                  <Input
                    id="create-giuong"
                    type="number"
                    min="0"
                    value={formData.giuong}
                    onChange={(e) => setFormData({ ...formData, giuong: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="create-phongTam">Phòng tắm</Label>
                  <Input
                    id="create-phongTam"
                    type="number"
                    min="0"
                    value={formData.phongTam}
                    onChange={(e) => setFormData({ ...formData, phongTam: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-moTa">Mô tả</Label>
                <Textarea
                  id="create-moTa"
                  value={formData.moTa}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-maViTri">Địa điểm</Label>
                <select
                  id="create-maViTri"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.maViTri}
                  onChange={(e) => setFormData({ ...formData, maViTri: Number(e.target.value) })}
                  required
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.tenViTri}, {loc.tinhThanh}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="create-hinhAnh">URL hình ảnh</Label>
                <Input
                  id="create-hinhAnh"
                  type="url"
                  value={formData.hinhAnh}
                  onChange={(e) => setFormData({ ...formData, hinhAnh: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label>Tiện nghi</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: "mayGiat", label: "Máy giặt" },
                    { key: "banLa", label: "Bàn là" },
                    { key: "tivi", label: "Tivi" },
                    { key: "dieuHoa", label: "Điều hòa" },
                    { key: "wifi", label: "Wifi" },
                    { key: "bep", label: "Bếp" },
                    { key: "doXe", label: "Đỗ xe" },
                    { key: "hoBoi", label: "Hồ bơi" },
                    { key: "banUi", label: "Bàn ủi" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`create-${key}`}
                        checked={formData[key as keyof PhongViewModel] as boolean}
                        onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                      />
                      <Label htmlFor={`create-${key}`} className="cursor-pointer">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Tạo
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa phòng</DialogTitle>
            <DialogDescription>Cập nhật thông tin phòng</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitUpdate}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-tenPhong">Tên phòng</Label>
                  <Input
                    id="edit-tenPhong"
                    value={formData.tenPhong}
                    onChange={(e) => setFormData({ ...formData, tenPhong: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-giaTien">Giá tiền ($)</Label>
                  <Input
                    id="edit-giaTien"
                    type="number"
                    min="0"
                    value={formData.giaTien}
                    onChange={(e) => setFormData({ ...formData, giaTien: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-khach">Số khách</Label>
                  <Input
                    id="edit-khach"
                    type="number"
                    min="1"
                    value={formData.khach}
                    onChange={(e) => setFormData({ ...formData, khach: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phongNgu">Phòng ngủ</Label>
                  <Input
                    id="edit-phongNgu"
                    type="number"
                    min="0"
                    value={formData.phongNgu}
                    onChange={(e) => setFormData({ ...formData, phongNgu: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-giuong">Giường</Label>
                  <Input
                    id="edit-giuong"
                    type="number"
                    min="0"
                    value={formData.giuong}
                    onChange={(e) => setFormData({ ...formData, giuong: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-phongTam">Phòng tắm</Label>
                  <Input
                    id="edit-phongTam"
                    type="number"
                    min="0"
                    value={formData.phongTam}
                    onChange={(e) => setFormData({ ...formData, phongTam: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-moTa">Mô tả</Label>
                <Textarea
                  id="edit-moTa"
                  value={formData.moTa}
                  onChange={(e) => setFormData({ ...formData, moTa: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-maViTri">Địa điểm</Label>
                <select
                  id="edit-maViTri"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.maViTri}
                  onChange={(e) => setFormData({ ...formData, maViTri: Number(e.target.value) })}
                  required
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.tenViTri}, {loc.tinhThanh}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-hinhAnh">URL hình ảnh</Label>
                <Input
                  id="edit-hinhAnh"
                  type="url"
                  value={formData.hinhAnh}
                  onChange={(e) => setFormData({ ...formData, hinhAnh: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label>Tiện nghi</Label>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: "mayGiat", label: "Máy giặt" },
                    { key: "banLa", label: "Bàn là" },
                    { key: "tivi", label: "Tivi" },
                    { key: "dieuHoa", label: "Điều hòa" },
                    { key: "wifi", label: "Wifi" },
                    { key: "bep", label: "Bếp" },
                    { key: "doXe", label: "Đỗ xe" },
                    { key: "hoBoi", label: "Hồ bơi" },
                    { key: "banUi", label: "Bàn ủi" },
                  ].map(({ key, label }) => (
                    <div key={key} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-${key}`}
                        checked={formData[key as keyof PhongViewModel] as boolean}
                        onCheckedChange={(checked) => setFormData({ ...formData, [key]: checked })}
                      />
                      <Label htmlFor={`edit-${key}`} className="cursor-pointer">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setShowEditDialog(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Cập nhật
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa phòng <strong>{selectedRoom?.tenPhong}</strong>? Hành động này không thể hoàn
              tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteRoom} disabled={isSubmitting} className="bg-destructive">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
