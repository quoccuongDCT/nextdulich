"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { BookingForm } from "@/components/booking-form"
import { AmenitiesList } from "@/components/amenities-list"
import { CommentForm } from "@/components/comment-form"
import { CommentList } from "@/components/comment-list"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Users, Bed, Bath, Star, MapPin, Loader2 } from "lucide-react"
import { getRoomById } from "@/lib/room-service"
import { getLocationById } from "@/lib/location-service"
import { getCommentsByRoom } from "@/lib/comment-service"
import type { PhongViewModel, ViTriViewModel, BinhLuanViewModel } from "@/lib/types"

export default function RoomDetailPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = Number(params.id)

  const [room, setRoom] = useState<PhongViewModel | null>(null)
  const [location, setLocation] = useState<ViTriViewModel | null>(null)
  const [comments, setComments] = useState<BinhLuanViewModel[]>([])
  const [showAllComments, setShowAllComments] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomData = await getRoomById(roomId)
        setRoom(roomData)

        if (roomData.maViTri) {
          const locationData = await getLocationById(roomData.maViTri)
          setLocation(locationData)
        }

        const commentsData = await getCommentsByRoom(roomId)
        setComments(commentsData)
      } catch (error) {
        console.error("[v0] Error fetching room data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (roomId) {
      fetchRoomData()
    }
  }, [roomId])

  const handleCommentAdded = (newComment: BinhLuanViewModel) => {
    setComments([newComment, ...comments])
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Không tìm thấy phòng</p>
        </div>
      </div>
    )
  }

  const avgRating =
    comments.length > 0 ? (comments.reduce((sum, c) => sum + c.saoBinhLuan, 0) / comments.length).toFixed(1) : "5.0"

  return (
    <div className="min-h-screen flex flex-col bg-background ">
      <Header />

      <main className="flex-1 mx-auto max-w-[1440px] w-full">
        <div className="container px-4 py-8">
          <Button variant="ghost" className="mb-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{room.tenPhong}</h1>
                {location && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {location.tenViTri}, {location.tinhThanh}, {location.quocGia}
                    </span>
                  </div>
                )}
              </div>

              <div className="relative h-96 rounded-lg overflow-hidden bg-muted">
                <img
                  src={
                    room.hinhAnh || `/placeholder.svg?height=400&width=800&query=${encodeURIComponent(room.tenPhong)}`
                  }
                  alt={room.tenPhong}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>{room.khach} khách</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span>{room.phongNgu} phòng ngủ</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span>{room.phongTam} phòng tắm</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-current text-accent" />
                  <span className="font-medium">
                    {avgRating} ({comments.length} đánh giá)
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Mô tả</h2>
                <p className="text-muted-foreground leading-relaxed">{room.moTa}</p>
              </div>

              <Separator />

              <AmenitiesList room={room} />

              <Separator />

              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Đánh giá ({comments.length})</h2>

                <CommentForm roomId={room.id} onCommentAdded={handleCommentAdded} />

                <CommentList
                  comments={comments}
                  showAll={showAllComments}
                  onShowMore={() => setShowAllComments(true)}
                />
              </div>
            </div>

            <div className="lg:col-span-1">
              <BookingForm roomId={room.id} roomPrice={room.giaTien} roomName={room.tenPhong} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
