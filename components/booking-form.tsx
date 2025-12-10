"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Users, Loader2, AlertCircle } from "lucide-react"
import { createBooking } from "@/lib/booking-service"
import { getUserData } from "@/lib/api-client"
import { useAuth } from "@/hooks/use-auth"
import type { DatPhongViewModel } from "@/lib/types"

interface BookingFormProps {
  roomId: number
  roomPrice: number
  roomName: string
}

export function BookingForm({ roomId, roomPrice, roomName }: BookingFormProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    ngayDen: "",
    ngayDi: "",
    soLuongKhach: 1,
  })

  const calculateNights = () => {
    if (formData.ngayDen && formData.ngayDi) {
      const start = new Date(formData.ngayDen)
      const end = new Date(formData.ngayDi)
      const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      return nights > 0 ? nights : 0
    }
    return 0
  }

  const totalPrice = calculateNights() * roomPrice

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    setIsLoading(true)
    setError("")
    setSuccess(false)

    try {
      const user = getUserData()
      if (!user || !user.id) {
        throw new Error("Vui lòng đăng nhập để đặt phòng")
      }

      if (new Date(formData.ngayDen) >= new Date(formData.ngayDi)) {
        throw new Error("Ngày đi phải sau ngày đến")
      }

      const bookingData: Omit<DatPhongViewModel, "id"> = {
        maPhong: roomId,
        ngayDen: new Date(formData.ngayDen).toISOString(),
        ngayDi: new Date(formData.ngayDi).toISOString(),
        soLuongKhach: formData.soLuongKhach,
        maNguoiDung: user.id,
      }

      await createBooking(bookingData)
      setSuccess(true)
      setTimeout(() => {
        router.push("/bookings")
      }, 2000)
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi đặt phòng. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Đặt phòng</CardTitle>
        <CardDescription>
          <span className="text-2xl font-bold text-foreground">${roomPrice}</span> / đêm
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-primary/10 border-primary">
              <AlertDescription className="text-primary">Đặt phòng thành công! Đang chuyển hướng...</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="ngayDen">
              <Calendar className="inline h-4 w-4 mr-1" />
              Ngày đến
            </Label>
            <Input
              id="ngayDen"
              type="date"
              value={formData.ngayDen}
              onChange={(e) => setFormData({ ...formData, ngayDen: e.target.value })}
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ngayDi">
              <Calendar className="inline h-4 w-4 mr-1" />
              Ngày đi
            </Label>
            <Input
              id="ngayDi"
              type="date"
              value={formData.ngayDi}
              onChange={(e) => setFormData({ ...formData, ngayDi: e.target.value })}
              required
              min={formData.ngayDen || new Date().toISOString().split("T")[0]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="soLuongKhach">
              <Users className="inline h-4 w-4 mr-1" />
              Số lượng khách
            </Label>
            <Input
              id="soLuongKhach"
              type="number"
              min="1"
              value={formData.soLuongKhach}
              onChange={(e) => setFormData({ ...formData, soLuongKhach: Number(e.target.value) })}
              required
            />
          </div>

          {calculateNights() > 0 && (
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex justify-between text-sm">
                <span>
                  ${roomPrice} x {calculateNights()} đêm
                </span>
                <span>${totalPrice}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Tổng cộng</span>
                <span>${totalPrice}</span>
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading || success}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isAuthenticated ? "Đặt phòng ngay" : "Đăng nhập để đặt phòng"}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
