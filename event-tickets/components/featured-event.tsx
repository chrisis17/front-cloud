import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FeaturedEventProps {
  event: {
    id: string
    name: string
    date: string
    time: string
    location: string
    venue: string
    price: number
    image: string
    category: string
    description: string
  }
}

export default function FeaturedEvent({ event }: FeaturedEventProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative h-64 md:h-full">
          <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
          <div className="absolute top-4 left-4">
            <Badge className="bg-purple-600 hover:bg-purple-700">Featured</Badge>
          </div>
        </div>

        <div className="p-6 md:p-8 flex flex-col">
          <div>
            <Badge variant="outline" className="mb-2">
              {event.category}
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold mb-2">{event.name}</h2>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                <span>
                  {event.venue}, {event.location}
                </span>
              </div>
            </div>

            <p className="text-gray-700 mb-6 line-clamp-3">{event.description}</p>
          </div>

          <div className="mt-auto flex items-center justify-between">
            <span className="font-bold text-xl">${event.price.toFixed(2)}</span>
            <Link href={`/events/${event.id}`}>
              <Button className="bg-purple-600 hover:bg-purple-700">View Details</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
