"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { RoomCard } from "@/components/room-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Loader2, SlidersHorizontal } from "lucide-react"
import { getAllRooms, getRoomsByLocation, searchRooms } from "@/lib/room-service"
import { getAllLocations } from "@/lib/location-service"
import type { PhongViewModel, ViTriViewModel } from "@/lib/types"

export default function RoomsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [rooms, setRooms] = useState<PhongViewModel[]>([])
  const [locations, setLocations] = useState<ViTriViewModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get("location") || "all")
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minGuests: "",
    maxGuests: "",
    bedrooms: "",
    beds: "",
    bathrooms: "",
    wifi: false,
    tivi: false,
    bep: false,
    dieuHoa: false,
    hoBoi: false,
    doXe: false,
  })

  const fetchInitialData = async () => {
    try {
      const [roomsData, locationsData] = await Promise.all([getAllRooms(), getAllLocations()])
      setRooms(roomsData)
      setLocations(locationsData)
    } catch (error) {
      console.error("[v0] Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInitialData()
  }, [])

  useEffect(() => {
    const locationParam = searchParams.get("location")
    if (locationParam && locationParam !== "all") {
      setSelectedLocation(locationParam)
      handleLocationFilter(locationParam)
    }
  }, [searchParams])

  const handleLocationFilter = async (locationId: string) => {
    if (locationId === "all") {
      const data = await getAllRooms()
      setRooms(data)
    } else {
      const data = await getRoomsByLocation(Number(locationId))
      setRooms(data)
    }
  }

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsLoading(true)
      try {
        const result = await searchRooms({ pageIndex: 1, pageSize: 50, keyword: searchQuery })
        setRooms(result.data)
      } catch (error) {
        console.error("[v0] Error searching rooms:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      const data = await getAllRooms()
      setRooms(data)
    }
  }

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value)
    handleLocationFilter(value)
  }

  const applyFilters = () => {
    let filtered = rooms

    if (filters.minGuests) {
      filtered = filtered.filter((room) => room.khach >= Number(filters.minGuests))
    }
    if (filters.maxGuests) {
      filtered = filtered.filter((room) => room.khach <= Number(filters.maxGuests))
    }
    if (filters.bedrooms) {
      filtered = filtered.filter((room) => room.phongNgu >= Number(filters.bedrooms))
    }
    if (filters.beds) {
      filtered = filtered.filter((room) => room.giuong >= Number(filters.beds))
    }
    if (filters.bathrooms) {
      filtered = filtered.filter((room) => room.phongTam >= Number(filters.bathrooms))
    }
    if (filters.wifi) {
      filtered = filtered.filter((room) => room.wifi)
    }
    if (filters.tivi) {
      filtered = filtered.filter((room) => room.tivi)
    }
    if (filters.bep) {
      filtered = filtered.filter((room) => room.bep)
    }
    if (filters.dieuHoa) {
      filtered = filtered.filter((room) => room.dieuHoa)
    }
    if (filters.hoBoi) {
      filtered = filtered.filter((room) => room.hoBoi)
    }
    if (filters.doXe) {
      filtered = filtered.filter((room) => room.doXe)
    }

    setRooms(filtered)
  }

  const resetFilters = () => {
    setFilters({
      minGuests: "",
      maxGuests: "",
      bedrooms: "",
      beds: "",
      bathrooms: "",
      wifi: false,
      tivi: false,
      bep: false,
      dieuHoa: false,
      hoBoi: false,
      doXe: false,
    })
    setSelectedLocation("all")
    fetchInitialData()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Tìm phòng</h1>
          <p className="text-lg text-muted-foreground">Khám phá hàng ngàn phòng độc đáo trên khắp thế giới</p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Tìm kiếm phòng..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Tìm kiếm
            </Button>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Bộ lọc
            </Button>
          </div>

          {showFilters && (
            <div className="p-6 bg-card border border-border rounded-lg space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Địa điểm</h3>
                <Select value={selectedLocation} onValueChange={handleLocationChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn địa điểm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả địa điểm</SelectItem>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={String(loc.id)}>
                        {loc.tenViTri}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Số lượng khách</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tối thiểu</Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Khách tối thiểu"
                      value={filters.minGuests}
                      onChange={(e) => setFilters({ ...filters, minGuests: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tối đa</Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Khách tối đa"
                      value={filters.maxGuests}
                      onChange={(e) => setFilters({ ...filters, maxGuests: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Phòng và giường</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Phòng ngủ</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Số phòng"
                      value={filters.bedrooms}
                      onChange={(e) => setFilters({ ...filters, bedrooms: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Giường</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Số giường"
                      value={filters.beds}
                      onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phòng tắm</Label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Số phòng tắm"
                      value={filters.bathrooms}
                      onChange={(e) => setFilters({ ...filters, bathrooms: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Tiện nghi</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.wifi}
                      onChange={(e) => setFilters({ ...filters, wifi: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm">Wifi</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.tivi}
                      onChange={(e) => setFilters({ ...filters, tivi: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm">TV</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.bep}
                      onChange={(e) => setFilters({ ...filters, bep: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm">Bếp</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.dieuHoa}
                      onChange={(e) => setFilters({ ...filters, dieuHoa: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm">Điều hòa</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.hoBoi}
                      onChange={(e) => setFilters({ ...filters, hoBoi: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm">Hồ bơi</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.doXe}
                      onChange={(e) => setFilters({ ...filters, doXe: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className="text-sm">Đỗ xe</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button variant="outline" onClick={resetFilters} className="flex-1 bg-transparent">
                  Đặt lại
                </Button>
                <Button onClick={applyFilters} className="flex-1">
                  Áp dụng bộ lọc
                </Button>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : rooms.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">Tìm thấy {rooms.length} phòng</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">Không tìm thấy phòng nào</p>
          </div>
        )}
      </main>
    </div>
  )
}
