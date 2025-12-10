"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building, Calendar, MessageSquare, Loader2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { getAllUsers } from "@/lib/admin-service"
import { getAllRooms } from "@/lib/room-service"
import { getAllBookings } from "@/lib/booking-service"
import { getAllComments } from "@/lib/comment-service"

export default function AdminDashboard() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    bookings: 0,
    comments: 0,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/")
      return
    }

    const fetchStats = async () => {
      try {
        const [usersData, roomsData, bookingsData, commentsData] = await Promise.all([
          getAllUsers(),
          getAllRooms(),
          getAllBookings(),
          getAllComments(),
        ])

        setStats({
          users: usersData.length,
          rooms: roomsData.length,
          bookings: bookingsData.length,
          comments: commentsData.length,
        })
      } catch (error) {
        console.error("[v0] Error fetching stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (isAuthenticated && user?.role === "ADMIN") {
      fetchStats()
    }
  }, [isAuthenticated, user, authLoading, router])

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
          <h1 className="text-4xl font-bold mb-8">Tổng quan</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Người dùng</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.users}</div>
                <p className="text-xs text-muted-foreground mt-1">Tổng số người dùng</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Phòng</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.rooms}</div>
                <p className="text-xs text-muted-foreground mt-1">Tổng số phòng</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Đặt phòng</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.bookings}</div>
                <p className="text-xs text-muted-foreground mt-1">Tổng số đặt phòng</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Bình luận</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.comments}</div>
                <p className="text-xs text-muted-foreground mt-1">Tổng số bình luận</p>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
