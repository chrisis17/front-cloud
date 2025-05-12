"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import SearchBar from "@/components/search-bar"
import Pagination from "@/components/pagination"
import Spinner from "@/components/spinner"

export default function Home() {
  const [events, setEvents] = useState<any[]>([])
  const [allFilteredEvents, setAllFilteredEvents] = useState<any[]>([])
  const [displayedEvents, setDisplayedEvents] = useState<any[]>([])
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const eventsPerPage = 5
  const mainRef = useRef<HTMLElement>(null)

  // Cargar eventos desde el endpoint
  useEffect(() => {
    setLoading(true)
    fetch("http://3.229.99.45:8080/eventos")
      .then((res) => res.json())
      .then((data) => {
        const sorted = data.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
        setEvents(sorted)
        setAllFilteredEvents(sorted)
        setTotalPages(Math.ceil(sorted.length / eventsPerPage))
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error al cargar eventos:", error)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (allFilteredEvents.length > 0) {
      const start = (currentPage - 1) * eventsPerPage
      const end = start + eventsPerPage
      setDisplayedEvents(allFilteredEvents.slice(start, end))
    }
  }, [allFilteredEvents, currentPage])

  const handleSearch = (query: string, category: string) => {
    setSearchPerformed(true)
    setCurrentPage(1)
    setLoading(true)

    setTimeout(() => {
      let results = [...events]

      if (query) {
        const search = query.toLowerCase()
        results = results.filter(
          (e) =>
            e.nombre.toLowerCase().includes(search) ||
            e.descripcion.toLowerCase().includes(search) ||
            e.lugar.toLowerCase().includes(search)
        )
      }

      if (category && category !== "todos") {
        results = results.filter((e) => e.categoria.nombre.toLowerCase() === category.toLowerCase())
      }

      results.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())

      setAllFilteredEvents(results)
      setTotalPages(Math.ceil(results.length / eventsPerPage))
      setLoading(false)

      if (mainRef.current) {
        mainRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 500)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setLoading(true)
    setTimeout(() => setLoading(false), 300)
  }

  const mainEvent = events[0]

  const categories = Array.from(new Set(events.map((e) => e.categoria.nombre)))

  return (
    <main className="min-h-screen bg-gray-50" ref={mainRef}>
      {/* Hero */}
      {mainEvent && (
        <section className="relative bg-black text-white">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-black/70 z-10" />
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${mainEvent.imagen})` }} />
          <div className="relative z-20 container mx-auto px-4 py-24 md:py-32">
            <Badge className="mb-4 bg-purple-600 hover:bg-purple-700">{mainEvent.categoria.nombre}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">{mainEvent.nombre}</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-2xl">{mainEvent.descripcion}</p>
            <div className="space-y-2 text-sm text-gray-200 mb-8">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                <span>{formatDate(mainEvent.fecha)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>20:00</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                <span>{mainEvent.lugar}</span>
              </div>
            </div>
            <Link href={`/events/${mainEvent.id}`} className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors inline-block">
              Ver Detalles
            </Link>
          </div>
        </section>
      )}

      {/* Buscador */}
      <section className="py-10 bg-gradient-to-b from-purple-900 to-purple-800">
        <div className="container mx-auto px-4">
          <SearchBar onSearch={handleSearch} categories={categories} />
        </div>
      </section>

      {/* Eventos */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            {searchPerformed ? "Resultados de búsqueda" : "Próximos Eventos"}
          </h2>

          {loading ? (
            <div className="bg-white rounded-lg shadow-md p-8">
              <Spinner size="large" />
              <p className="text-center text-gray-600 mt-4">Cargando eventos...</p>
            </div>
          ) : allFilteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-xl text-gray-600">No se encontraron eventos que coincidan con tu búsqueda.</p>
              <Button
                onClick={() => {
                  setLoading(true)
                  setTimeout(() => {
                    const sorted = [...events].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
                    setAllFilteredEvents(sorted)
                    setTotalPages(Math.ceil(sorted.length / eventsPerPage))
                    setCurrentPage(1)
                    setSearchPerformed(false)
                    setLoading(false)
                  }, 500)
                }}
                className="mt-4 bg-purple-600 hover:bg-purple-700"
              >
                Ver todos los eventos
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-8">
                {displayedEvents.map((event, index) => (
                  <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
                    <div className={`grid grid-cols-1 md:grid-cols-2 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
                      <div className="relative h-64 md:h-full">
                        <Image src={event.imagen || "/placeholder.svg"} alt={event.nombre} fill className="object-cover" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-purple-600">{event.categoria.nombre}</Badge>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col justify-between">
                        <div>
                          <h2 className="text-gray-900 font-bold mb-2">{event.nombre}</h2>
                          <p className="text-gray-600 mb-4">{event.descripcion}</p>
                          <div className="text-sm text-gray-500 space-y-1">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>{formatDate(event.fecha)}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{event.lugar}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="font-semibold text-gray-700 mr-2">S/.{event.precio}</span>
                            </div>
                          </div>
                        </div>
                        <Link href={`/events/${event.id}`} className="mt-4 inline-block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                          Ver Detalles
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-12 flex justify-center">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

