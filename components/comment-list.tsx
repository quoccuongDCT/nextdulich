"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"
import type { BinhLuanViewModel } from "@/lib/types"

interface CommentListProps {
  comments: BinhLuanViewModel[]
  showAll?: boolean
  onShowMore?: () => void
}

export function CommentList({ comments, showAll = false, onShowMore }: CommentListProps) {
  const displayedComments = showAll ? comments : comments.slice(0, 5)
  const hasMore = comments.length > 5 && !showAll

  if (comments.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">Chưa có đánh giá nào. Hãy là người đầu tiên!</div>
  }

  return (
    <div className="space-y-4">
      {displayedComments.map((comment) => {
        const userInitial = comment.maNguoiBinhLuan?.toString().charAt(0) || "U"
        const userName = comment.maNguoiBinhLuan || "Người dùng"
        const commentDate = comment.ngayBinhLuan ? new Date(comment.ngayBinhLuan).toLocaleDateString("vi-VN") : ""
        const rating = Math.max(0, Math.min(5, comment.saoBinhLuan || 0))

        return (
          <div key={comment.id} className="p-4 bg-card border border-border rounded-lg">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground">{userInitial}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Người dùng {userName}</span>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                  </div>
                  {commentDate && <span className="text-sm text-muted-foreground">{commentDate}</span>}
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">{comment.noiDung || ""}</p>
              </div>
            </div>
          </div>
        )
      })}

      {hasMore && onShowMore && (
        <Button variant="outline" className="w-full bg-transparent" onClick={onShowMore}>
          Xem thêm đánh giá
        </Button>
      )}
    </div>
  )
}
