"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { LocationCard } from "@/components/location-card"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"
import { getAllLocations } from "@/lib/location-service"
import type { ViTriViewModel } from "@/lib/types"

export default function LocationsPage() {
  const [locations, setLocations] = useState<ViTriViewModel[]>([])
  const [filteredLocations, setFilteredLocations] = useState<ViTriViewModel[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getAllLocations()
        setLocations(data)
        setFilteredLocations(data)
      } catch (error) {
        console.error("[v0] Error fetching locations:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = locations.filter(
        (loc) =>
          loc.tenViTri.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.tinhThanh.toLowerCase().includes(searchQuery.toLowerCase()) ||
          loc.quocGia.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredLocations(filtered)
    } else {
      setFilteredLocations(locations)
    }
  }, [searchQuery, locations])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container px-4 py-8 mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Khám phá địa điểm</h1>
          <p className="text-lg text-muted-foreground">Tìm kiếm những điểm đến tuyệt vời cho chuyến đi của bạn</p>
        </div>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm kiếm địa điểm..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredLocations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLocations.map((location) => (
              <LocationCard key={location.id} location={location} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Không tìm thấy địa điểm nào</p>
          </div>
        )}
      </main>
    </div>
  )
}
