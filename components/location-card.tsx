"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import type { ViTriViewModel } from "@/lib/types"
import { useRouter } from "next/navigation"

interface LocationCardProps {
  location: ViTriViewModel
}

export function LocationCard({ location }: LocationCardProps) {
  const router = useRouter()

  return (
    <Card
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => router.push(`/rooms?location=${location.id}`)}
    >
      <div className="relative h-48 bg-muted">
        <img
          src={
            location.hinhAnh || `/placeholder.svg?height=200&width=300&query=${encodeURIComponent(location.tenViTri)}`
          }
          alt={location.tenViTri}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{location.tenViTri}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>
            {location.tinhThanh}, {location.quocGia}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
