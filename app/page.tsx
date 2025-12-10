"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Calendar, Users } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/rooms?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-br from-primary/10 via-accent/10 to-background">
        <div className="absolute inset-0 bg-[url('/images/project3.png')] bg-cover bg-center opacity-20" />

        <div className="relative z-10 container px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Tìm chỗ ở tiếp theo cho chuyến đi của bạn
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-pretty">
            Khám phá những không gian độc đáo trên khắp thế giới
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-3 p-3 bg-card rounded-lg shadow-lg border border-border">
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-background rounded-md">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Bạn muốn đi đâu?"
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button type="submit" size="lg" className="md:w-auto">
                <Search className="h-5 w-5 mr-2" />
                Tìm kiếm
              </Button>
            </div>
          </form>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Tại sao chọn chúng tôi?</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Địa điểm đa dạng</h3>
              <p className="text-muted-foreground text-pretty">
                Hàng ngàn địa điểm khắp thế giới để bạn lựa chọn cho chuyến đi của mình
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border">
              <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Calendar className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Đặt phòng dễ dàng</h3>
              <p className="text-muted-foreground text-pretty">
                Quy trình đặt phòng nhanh chóng, đơn giản chỉ với vài cú nhấp chuột
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card border border-border">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Đánh giá tin cậy</h3>
              <p className="text-muted-foreground text-pretty">
                Xem đánh giá từ hàng triệu khách hàng đã trải nghiệm thực tế
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Sẵn sàng cho chuyến đi của bạn?</h2>
          <p className="text-lg text-muted-foreground mb-8">Khám phá hàng ngàn phòng độc đáo đang chờ bạn</p>
          <Button size="lg" onClick={() => router.push("/rooms")}>
            Khám phá ngay
          </Button>
        </div>
      </section>

      <footer className="py-8 border-t border-border bg-card">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Airbnb. Được xây dựng với Next.js và Tailwind CSS.</p>
        </div>
      </footer>
    </div>
  )
}
