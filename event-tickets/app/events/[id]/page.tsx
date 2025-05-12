"use client"

import { useEffect, useRef, useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import PurchaseButton from "@/components/purchase-button"
import EventDetails from "@/components/event-details"
import Spinner from "@/components/spinner"

export default function EventPage({ params }: { params: { id: string } }) {
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const pageRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch("http://3.229.99.45:8080/eventos")
        const data = await response.json()
        const foundEvent = data.find((e: any) => String(e.id) === params.id)

        if (!foundEvent) {
          notFound()
        }

        setEvent(foundEvent)
        setLoading(false)

        if (pageRef.current) {
          pageRef.current.scrollIntoView({ behavior: "auto", block: "start" })
        }
      } catch (error) {
        console.error("Error fetching event data:", error)
        notFound()
      }
    }

    fetchEvent()
  }, [params.id])

  if (loading || !event) {
    return (
      <main className="container mx-auto px-4 py-12 bg-[#82898F]" ref={pageRef}>
        <div className="bg-white rounded-lg shadow-md p-8">
          <Spinner size="large" />
          <p className="text-center text-gray-600 mt-4">Cargando detalles del evento...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-12 bg-[#82898F]" ref={pageRef}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden border-0">
        <div className="relative h-80 w-full">
          <Image src={event.imagen || "/placeholder.svg"} alt={event.nombre} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.nombre}</h1>
            <p className="text-lg opacity-90">
              {new Date(event.fecha).toLocaleDateString("es-ES", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <EventDetails event={event} />
            </div>

            <div className="md:w-1/3">
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 shadow-sm">
                <div className="mb-6">
                  <p className="text-gray-600 mb-1">Precio</p>
                  <p className="text-3xl font-bold text-gray-800">${event.precio.toFixed(2)}</p>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-1">Lugar</p>
                  <p className="font-medium text-gray-800">{event.lugar}</p>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-1">Fecha</p>
                  <p className="font-medium text-gray-800">
                    {new Date(event.fecha).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <PurchaseButton eventId={event.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
