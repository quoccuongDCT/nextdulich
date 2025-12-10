"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
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
import { Search, Loader2, Trash2, Edit, Plus, AlertCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getAllUsers, deleteUser, createUser, updateUser } from "@/lib/admin-service"
import type { ThongTinNguoiDung } from "@/lib/types"

const ITEMS_PER_PAGE = 10

export default function AdminUsersPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [users, setUsers] = useState<ThongTinNguoiDung[]>([])
  const [filteredUsers, setFilteredUsers] = useState<ThongTinNguoiDung[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<ThongTinNguoiDung | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    birthday: "",
    gender: true,
    role: "USER",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const data = await getAllUsers()
      setUsers(data)
      setFilteredUsers(data)
      setError("")
    } catch (error) {
      console.error("[v0] Error fetching users:", error)
      setError("Không thể tải danh sách người dùng")
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
      fetchUsers()
    }
  }, [isAuthenticated, user, authLoading, router])

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredUsers(filtered)
    } else {
      setFilteredUsers(users)
    }
    setCurrentPage(1)
  }, [searchQuery, users])

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentUsers = filteredUsers.slice(startIndex, endIndex)

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
      name: "",
      email: "",
      password: "",
      phone: "",
      birthday: "",
      gender: true,
      role: "USER",
    })
    setShowCreateDialog(true)
  }

  const handleEdit = (user: ThongTinNguoiDung) => {
    setSelectedUser(user)
    setFormData({
      name: user.name || "",
      email: user.email || "",
      password: "",
      phone: user.phone || "",
      birthday: user.birthday || "",
      gender: user.gender,
      role: user.role || "USER",
    })
    setShowEditDialog(true)
  }

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await createUser({
        id: 0,
        ...formData,
      })
      await fetchUsers()
      setShowCreateDialog(false)
      setError("")
    } catch (err: any) {
      setError(err.message || "Không thể tạo người dùng")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    setIsSubmitting(true)
    try {
      await updateUser(selectedUser.id, {
        id: selectedUser.id,
        ...formData,
      })
      await fetchUsers()
      setShowEditDialog(false)
      setError("")
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật người dùng")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async () => {
    if (!selectedUser) return

    setIsSubmitting(true)
    try {
      await deleteUser(selectedUser.id)
      await fetchUsers()
      setShowDeleteDialog(false)
      if (currentUsers.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      setError("")
    } catch (err: any) {
      setError(err.message || "Không thể xóa người dùng")
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
            <h1 className="text-4xl font-bold">Quản lý người dùng</h1>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm người dùng
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
                placeholder="Tìm kiếm người dùng..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Vai trò</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(user)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowDeleteDialog(true)
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Không tìm thấy người dùng nào
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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

          <p className="text-sm text-muted-foreground mt-4">
            Tổng số: {filteredUsers.length} người dùng | Trang {currentPage} / {totalPages}
          </p>
        </main>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Thêm người dùng mới</DialogTitle>
            <DialogDescription>Nhập thông tin người dùng mới</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitCreate}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="create-name">Họ tên</Label>
                <Input
                  id="create-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-email">Email</Label>
                <Input
                  id="create-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-password">Mật khẩu</Label>
                <Input
                  id="create-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-phone">Số điện thoại</Label>
                <Input
                  id="create-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-birthday">Ngày sinh</Label>
                <Input
                  id="create-birthday"
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-gender">Giới tính</Label>
                <select
                  id="create-gender"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.gender ? "true" : "false"}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value === "true" })}
                >
                  <option value="true">Nam</option>
                  <option value="false">Nữ</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-role">Vai trò</Label>
                <select
                  id="create-role"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
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

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
            <DialogDescription>Cập nhật thông tin người dùng</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitUpdate}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Họ tên</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Số điện thoại</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone || ""}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-birthday">Ngày sinh</Label>
                <Input
                  id="edit-birthday"
                  type="date"
                  value={formData.birthday || ""}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-gender">Giới tính</Label>
                <select
                  id="edit-gender"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.gender ? "true" : "false"}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value === "true" })}
                >
                  <option value="true">Nam</option>
                  <option value="false">Nữ</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Vai trò</Label>
                <select
                  id="edit-role"
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng <strong>{selectedUser?.name}</strong>? Hành động này không thể hoàn
              tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} disabled={isSubmitting} className="bg-destructive">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
