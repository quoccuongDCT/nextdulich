import { Wifi, Tv, Wind, Car, UtensilsCrossed, Fan, Waves, Shirt } from "lucide-react"
import type { PhongViewModel } from "@/lib/types"

interface AmenitiesListProps {
  room: PhongViewModel
}

export function AmenitiesList({ room }: AmenitiesListProps) {
  const amenities = [
    { icon: Wifi, show: room.wifi, label: "Wifi" },
    { icon: Tv, show: room.tivi, label: "Tivi" },
    { icon: Wind, show: room.dieuHoa, label: "Điều hòa" },
    { icon: UtensilsCrossed, show: room.bep, label: "Bếp" },
    { icon: Shirt, show: room.mayGiat, label: "Máy giặt" },
    { icon: Fan, show: room.banLa, label: "Bàn là" },
    { icon: Car, show: room.doXe, label: "Đỗ xe" },
    { icon: Waves, show: room.hoBoi, label: "Hồ bơi" },
  ]

  const availableAmenities = amenities.filter((a) => a.show)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Tiện nghi</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {availableAmenities.map((amenity, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted">
            <amenity.icon className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-medium">{amenity.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
