"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
import { Loader2, AlertCircle, Trash2, Star } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getAllComments, deleteComment } from "@/lib/admin-service"
import type { BinhLuanViewModel } from "@/lib/types"

const ITEMS_PER_PAGE = 10

export default function AdminCommentsPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [comments, setComments] = useState<BinhLuanViewModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedComment, setSelectedComment] = useState<BinhLuanViewModel | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchComments = async () => {
    setIsLoading(true)
    try {
      const data = await getAllComments()
      setComments(data)
      setError("")
    } catch (error) {
      console.error("[v0] Error fetching comments:", error)
      setError("Không thể tải danh sách bình luận")
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
      fetchComments()
    }
  }, [isAuthenticated, user, authLoading, router])

  const totalPages = Math.ceil(comments.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentComments = comments.slice(startIndex, endIndex)

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

  const handleDeleteComment = async () => {
    if (!selectedComment) return

    setIsSubmitting(true)
    try {
      await deleteComment(selectedComment.id)
      await fetchComments()
      setShowDeleteDialog(false)
      if (currentComments.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
      setError("")
    } catch (err: any) {
      setError(err.message || "Không thể xóa bình luận")
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
          <h1 className="text-4xl font-bold mb-8">Quản lý bình luận</h1>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Mã phòng</TableHead>
                  <TableHead>Người dùng</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Ngày</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentComments.length > 0 ? (
                  currentComments.map((comment) => (
                    <TableRow key={comment.id}>
                      <TableCell>{comment.id}</TableCell>
                      <TableCell>{comment.maPhong}</TableCell>
                      <TableCell>{comment.maNguoiBinhLuan || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-current text-accent" />
                          <span>{comment.saoBinhLuan}/5</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{comment.noiDung}</TableCell>
                      <TableCell>{new Date(comment.ngayBinhLuan).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => {
                            setSelectedComment(comment)
                            setShowDeleteDialog(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Không có bình luận nào
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
            Tổng số: {comments.length} bình luận | Trang {currentPage} / {totalPages}
          </p>
        </main>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa bình luận này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteComment} disabled={isSubmitting} className="bg-destructive">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
