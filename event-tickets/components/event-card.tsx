import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface EventCardProps {
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
  }
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="overflow-hidden h-full transition-all hover:shadow-lg">
        <div className="relative h-48 w-full">
          <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
          <div className="absolute top-2 right-2">
            <Badge className="bg-purple-600 hover:bg-purple-700">{event.category}</Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="text-xl font-bold mb-2 line-clamp-1">{event.name}</h3>

          <div className="space-y-2 text-sm text-gray-600">
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
              <span className="line-clamp-1">
                {event.venue}, {event.location}
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <span className="font-bold text-lg">${event.price.toFixed(2)}</span>
          <span className="text-sm text-purple-600 font-medium">View Details</span>
        </CardFooter>
      </Card>
    </Link>
  )
}
