"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Bed, Bath, Wifi, Tv, Wind } from "lucide-react"
import type { PhongViewModel } from "@/lib/types"
import { useRouter } from "next/navigation"

interface RoomCardProps {
  room: PhongViewModel
}

export function RoomCard({ room }: RoomCardProps) {
  const router = useRouter()

  const amenities = [
    { icon: Wifi, show: room.wifi, label: "Wifi" },
    { icon: Tv, show: room.tivi, label: "TV" },
    { icon: Wind, show: room.dieuHoa, label: "Điều hòa" },
  ]

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/rooms/${room.id}`)}
    >
      <div className="relative h-56 bg-muted">
        <img
          src={room.hinhAnh || `/placeholder.svg?height=240&width=360&query=${encodeURIComponent(room.tenPhong)}`}
          alt={room.tenPhong}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{room.tenPhong}</h3>
          <Badge variant="secondary" className="ml-2">
            <Star className="h-3 w-3 fill-current mr-1" />
            4.8
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{room.khach}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{room.phongNgu}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{room.phongTam}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          {amenities
            .filter((a) => a.show)
            .slice(0, 3)
            .map((amenity, idx) => (
              <amenity.icon key={idx} className="h-4 w-4 text-muted-foreground" />
            ))}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{room.moTa}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-foreground">${room.giaTien}</span>
            <span className="text-sm text-muted-foreground"> / đêm</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
