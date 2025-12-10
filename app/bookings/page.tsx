"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Users, Loader2, AlertCircle } from "lucide-react"
import { getBookingsByUser, deleteBooking } from "@/lib/booking-service"
import { getRoomById } from "@/lib/room-service"
import { getUserData } from "@/lib/api-client"
import { useAuth } from "@/hooks/use-auth"
import type { DatPhongViewModel, PhongViewModel } from "@/lib/types"

interface BookingWithRoom extends DatPhongViewModel {
  room?: PhongViewModel
}

export default function BookingsPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const [bookings, setBookings] = useState<BookingWithRoom[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    const fetchBookings = async () => {
      try {
        const user = getUserData()
        if (!user || !user.id) {
          throw new Error("Vui lòng đăng nhập")
        }

        const bookingsData = await getBookingsByUser(user.id)

        const bookingsWithRooms = await Promise.all(
          bookingsData.map(async (booking) => {
            try {
              const room = await getRoomById(booking.maPhong)
              return { ...booking, room }
            } catch {
              return booking
            }
          }),
        )

        setBookings(bookingsWithRooms)
      } catch (err: any) {
        setError(err.message || "Không thể tải danh sách đặt phòng")
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchBookings()
    }
  }, [isAuthenticated, authLoading, router])

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đặt phòng này?")) return

    try {
      await deleteBooking(bookingId)
      setBookings(bookings.filter((b) => b.id !== bookingId))
    } catch (err: any) {
      setError(err.message || "Không thể hủy đặt phòng")
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

      <main className="flex-1 container px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Đặt phòng của tôi</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl">{booking.room?.tenPhong || "Phòng"}</CardTitle>
                    <Badge>{new Date(booking.ngayDen) > new Date() ? "Sắp tới" : "Đã qua"}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {booking.room?.hinhAnh && (
                    <div className="relative h-40 rounded-lg overflow-hidden bg-muted">
                      <img
                        src={booking.room.hinhAnh || "/placeholder.svg"}
                        alt={booking.room.tenPhong}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Nhận phòng: {new Date(booking.ngayDen).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Trả phòng: {new Date(booking.ngayDi).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{booking.soLuongKhach} khách</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => router.push(`/rooms/${booking.maPhong}`)}
                    >
                      Xem chi tiết
                    </Button>
                    <Button variant="destructive" className="flex-1" onClick={() => handleCancelBooking(booking.id)}>
                      Hủy đặt phòng
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">Bạn chưa có đặt phòng nào</p>
            <Button onClick={() => router.push("/rooms")}>Khám phá phòng</Button>
          </div>
        )}
      </main>
    </div>
  )
}
