"use client"

import { useEffect, useRef, useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { events } from "@/data/events"
import PurchaseButton from "@/components/purchase-button"
import EventDetails from "@/components/event-details"
import Spinner from "@/components/spinner"

export default function EventPage({ params }: { params: { id: string } }) {
  const event = events.find((e) => e.id === params.id)
  const pageRef = useRef<HTMLElement>(null)
  const [loading, setLoading] = useState(true)

  // Mantener el desplazamiento hacia arriba en la página de detalles
  useEffect(() => {
    // Simular tiempo de carga
    const timer = setTimeout(() => {
      setLoading(false)
      // Mantener el desplazamiento al inicio de la página cuando se carga
      if (pageRef.current) {
        pageRef.current.scrollIntoView({ behavior: "auto", block: "start" })
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (!event) {
    notFound()
  }

  // Mejorar el diseño de la página de detalles del evento
  return (
    <main className="container mx-auto px-4 py-12 bg-[#82898F]" ref={pageRef}>
      {loading ? (
        <div className="bg-white rounded-lg shadow-md p-8">
          <Spinner size="large" />
          <p className="text-center text-gray-600 mt-4">Cargando detalles del evento...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border-0">
          <div className="relative h-80 w-full">
            <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{event.name}</h1>
              <p className="text-lg opacity-90">
                {new Date(event.date).toLocaleDateString("es-ES", {
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
                    <p className="text-3xl font-bold text-gray-800">${event.price.toFixed(2)}</p>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-600 mb-1">Ubicación</p>
                    <p className="font-medium text-gray-800">{event.venue}</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-600 mb-1">Fecha y Hora</p>
                    <p className="font-medium text-gray-800">
                      {new Date(event.date).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-600">{event.time}</p>
                  </div>

                  <PurchaseButton eventId={event.id} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
