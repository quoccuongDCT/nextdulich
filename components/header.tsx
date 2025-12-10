"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, User, LogOut, Home, Calendar } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { signOut } from "@/lib/auth-service"

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  const handleSignOut = () => {
    signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Home className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-foreground">Airbnb</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Trang chủ
          </Link>
          <Link
            href="/rooms"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/rooms" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Phòng
          </Link>
          <Link
            href="/locations"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/locations" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Địa điểm
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatar || ""} alt={user?.name || ""} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Hồ sơ
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/bookings")}>
                  <Calendar className="mr-2 h-4 w-4" />
                  Đặt phòng của tôi
                </DropdownMenuItem>
                {user?.role === "ADMIN" && (
                  <DropdownMenuItem onClick={() => router.push("/admin")}>
                    <Menu className="mr-2 h-4 w-4" />
                    Quản trị
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" onClick={() => router.push("/login")}>
                Đăng nhập
              </Button>
              <Button onClick={() => router.push("/signup")}>Đăng ký</Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
