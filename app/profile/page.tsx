"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Loader2, AlertCircle, User, Calendar, Mail, Phone, Save } from "lucide-react"
import { getUserData, setUserData } from "@/lib/api-client"
import { updateUser } from "@/lib/user-service"
import { useAuth } from "@/hooks/use-auth"
import type { CapNhatNguoiDung } from "@/lib/types"

export default function ProfilePage() {
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, user: authUser } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    birthday: "",
    gender: true,
  })

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (authUser) {
      setFormData({
        name: authUser.name || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        birthday: authUser.birthday ? authUser.birthday.split("T")[0] : "",
        gender: authUser.gender ?? true,
      })
    }
  }, [authUser, isAuthenticated, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const user = getUserData()
      if (!user || !user.id) {
        throw new Error("Vui lòng đăng nhập")
      }

      const updateData: CapNhatNguoiDung = {
        id: user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birthday: formData.birthday,
        gender: formData.gender,
        role: user.role,
      }

      const updatedUser = await updateUser(user.id, updateData)
      setUserData(updatedUser)
      setSuccess("Cập nhật thông tin thành công!")
    } catch (err: any) {
      setError(err.message || "Không thể cập nhật thông tin. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
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
        <h1 className="text-4xl font-bold mb-8">Hồ sơ của tôi</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <div className="flex flex-col items-center text-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={authUser?.avatar || ""} alt={authUser?.name || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {authUser?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{authUser?.name}</h2>
                    <p className="text-sm text-muted-foreground">{authUser?.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{authUser?.gender ? "Nam" : "Nữ"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {authUser?.birthday ? new Date(authUser.birthday).toLocaleDateString("vi-VN") : "Chưa cập nhật"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{authUser?.phone || "Chưa cập nhật"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{authUser?.email}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="info">Thông tin cá nhân</TabsTrigger>
                <TabsTrigger value="bookings">Lịch sử đặt phòng</TabsTrigger>
              </TabsList>

              <TabsContent value="info" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Chỉnh sửa thông tin</CardTitle>
                    <CardDescription>Cập nhật thông tin cá nhân của bạn</CardDescription>
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
                          <AlertDescription className="text-primary">{success}</AlertDescription>
                        </Alert>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="name">Họ tên</Label>
                        <Input
                          id="name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birthday">Ngày sinh</Label>
                        <Input
                          id="birthday"
                          type="date"
                          value={formData.birthday}
                          onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="gender">Giới tính</Label>
                        <select
                          id="gender"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={formData.gender ? "true" : "false"}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value === "true" })}
                        >
                          <option value="true">Nam</option>
                          <option value="false">Nữ</option>
                        </select>
                      </div>

                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Lưu thay đổi
                      </Button>
                    </CardContent>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Lịch sử đặt phòng</CardTitle>
                    <CardDescription>Xem tất cả các lần đặt phòng của bạn</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">Xem chi tiết lịch sử đặt phòng</p>
                      <Button onClick={() => router.push("/bookings")}>Đi đến trang đặt phòng</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
