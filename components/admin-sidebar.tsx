"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Users, Building, MapPin, Calendar, MessageSquare, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { icon: LayoutDashboard, label: "Tổng quan", href: "/admin" },
  { icon: Users, label: "Người dùng", href: "/admin/users" },
  { icon: Building, label: "Phòng", href: "/admin/rooms" },
  { icon: MapPin, label: "Địa điểm", href: "/admin/locations" },
  { icon: Calendar, label: "Đặt phòng", href: "/admin/bookings" },
  { icon: MessageSquare, label: "Bình luận", href: "/admin/comments" },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border">
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Quản trị</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted text-muted-foreground hover:text-foreground",
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}

          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-muted text-muted-foreground hover:text-foreground mt-6"
          >
            <Home className="h-5 w-5" />
            <span className="font-medium">Về trang chủ</span>
          </Link>
        </nav>
      </div>
    </aside>
  )
}
