"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Star, Loader2, AlertCircle } from "lucide-react"
import { createComment } from "@/lib/comment-service"
import { getUserData } from "@/lib/api-client"
import { useAuth } from "@/hooks/use-auth"
import type { BinhLuanViewModel } from "@/lib/types"

interface CommentFormProps {
  roomId: number
  onCommentAdded: (comment: BinhLuanViewModel) => void
}

export function CommentForm({ roomId, onCommentAdded }: CommentFormProps) {
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [rating, setRating] = useState(5)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [content, setContent] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setError("Vui lòng đăng nhập để bình luận")
      return
    }

    if (!content.trim()) {
      setError("Vui lòng nhập nội dung bình luận")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const user = getUserData()
      if (!user || !user.id) {
        throw new Error("Vui lòng đăng nhập")
      }

      const commentData: Omit<BinhLuanViewModel, "id"> = {
        maPhong: roomId,
        maNguoiBinhLuan: user.id,
        ngayBinhLuan: new Date().toISOString(),
        noiDung: content,
        saoBinhLuan: rating,
      }

      const newComment = await createComment(commentData)
      onCommentAdded(newComment)
      setContent("")
      setRating(5)
    } catch (err: any) {
      setError(err.message || "Không thể thêm bình luận. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Viết đánh giá của bạn</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label>Đánh giá</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating) ? "fill-accent text-accent" : "fill-none text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">({rating} sao)</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Nội dung</Label>
            <Textarea
              id="content"
              placeholder="Chia sẻ trải nghiệm của bạn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || !isAuthenticated}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAuthenticated ? "Gửi đánh giá" : "Đăng nhập để đánh giá"}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
