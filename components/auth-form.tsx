"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { signIn, signUp } from "@/lib/auth-service"
import type { DangNhapView, ThongTinNguoiDung } from "@/lib/types"

interface AuthFormProps {
  mode: "login" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: "",
    birthday: "",
    gender: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (mode === "login") {
        const credentials: DangNhapView = {
          email: formData.email,
          password: formData.password,
        }
        await signIn(credentials)
        router.push("/")
        router.refresh()
      } else {
        const userData: Omit<ThongTinNguoiDung, "id"> = {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          birthday: formData.birthday,
          gender: formData.gender,
          role: "USER",
        }
        await signUp(userData)
        setError("")
        // Auto login after signup
        const credentials: DangNhapView = {
          email: formData.email,
          password: formData.password,
        }
        await signIn(credentials)
        router.push("/")
        router.refresh()
      }
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl">{mode === "login" ? "Đăng nhập" : "Đăng ký"}</CardTitle>
        <CardDescription>
          {mode === "login" ? "Nhập thông tin đăng nhập của bạn" : "Tạo tài khoản mới để bắt đầu đặt phòng"}
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

          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Họ tên</Label>
              <Input
                id="name"
                type="text"
                placeholder="Nguyễn Văn A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          {mode === "signup" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="0123456789"
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
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "login" ? "Đăng nhập" : "Đăng ký"}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/signup")}
                  className="font-medium text-primary hover:underline"
                >
                  Đăng ký ngay
                </button>
              </>
            ) : (
              <>
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="font-medium text-primary hover:underline"
                >
                  Đăng nhập
                </button>
              </>
            )}
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
