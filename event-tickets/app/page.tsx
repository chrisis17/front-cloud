"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { events } from "@/data/events"
import { Calendar, MapPin, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import SearchBar from "@/components/search-bar"
import Pagination from "@/components/pagination"
import Spinner from "@/components/spinner"

export default function Home() {
  // Estado para los eventos filtrados y paginación
  const [allFilteredEvents, setAllFilteredEvents] = useState<typeof events>([])
  const [displayedEvents, setDisplayedEvents] = useState<typeof events>([])
  const [searchPerformed, setSearchPerformed] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true) // Estado para controlar la carga
  const eventsPerPage = 5 // Reducir a 5 eventos por página

  // Referencia para el contenedor principal
  const mainRef = useRef<HTMLElement>(null)

  // Obtener todas las categorías únicas
  const categories = Array.from(new Set(events.map((event) => event.category)))

  // Ordenar eventos por fecha y configurar paginación
  useEffect(() => {
    // Simular un tiempo de carga para mostrar el spinner
    setLoading(true)

    const timer = setTimeout(() => {
      const sortedEvents = [...events].sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })

      setAllFilteredEvents(sortedEvents)
      setTotalPages(Math.ceil(sortedEvents.length / eventsPerPage))
      setLoading(false)
    }, 800) // Simular carga de 800ms

    return () => clearTimeout(timer)
  }, [])

  // Actualizar eventos mostrados cuando cambia la página o los eventos filtrados
  useEffect(() => {
    if (allFilteredEvents.length > 0) {
      const startIndex = (currentPage - 1) * eventsPerPage
      const endIndex = startIndex + eventsPerPage
      setDisplayedEvents(allFilteredEvents.slice(startIndex, endIndex))
    }
  }, [allFilteredEvents, currentPage])

  // Función para manejar la búsqueda
  const handleSearch = (query: string, category: string) => {
    setSearchPerformed(true)
    setCurrentPage(1) // Resetear a la primera página al buscar
    setLoading(true) // Mostrar spinner durante la búsqueda

    // Simular tiempo de búsqueda
    setTimeout(() => {
      let results = [...events]

      // Filtrar por texto de búsqueda
      if (query) {
        const searchTerms = query.toLowerCase()
        results = results.filter(
          (event) =>
            event.name.toLowerCase().includes(searchTerms) ||
            event.description.toLowerCase().includes(searchTerms) ||
            event.location.toLowerCase().includes(searchTerms) ||
            event.venue.toLowerCase().includes(searchTerms),
        )
      }

      // Filtrar por categoría
      if (category && category !== "todos") {
        results = results.filter((event) => event.category.toLowerCase() === category.toLowerCase())
      }

      // Ordenar por fecha
      results.sort((a, b) => {
        const dateA = new Date(a.date)
        const dateB = new Date(b.date)
        return dateA.getTime() - dateB.getTime()
      })

      setAllFilteredEvents(results)
      setTotalPages(Math.ceil(results.length / eventsPerPage))
      setLoading(false)

      // Desplazar al inicio de la sección de eventos
      if (mainRef.current) {
        mainRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 500)
  }

  // Modificar la función handlePageChange para quitar el desplazamiento hacia arriba
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    setLoading(true) // Mostrar spinner durante el cambio de página

    // Simular tiempo de carga al cambiar de página
    setTimeout(() => {
      setLoading(false)
      // Eliminar el desplazamiento hacia arriba al cambiar de página
    }, 300)
  }

  // Obtener el evento más importante (el primero marcado como destacado)
  const mainEvent = events.find((event) => event.featured) || events[0]

  return (
    <main className="min-h-screen bg-gray-50" ref={mainRef}>
      {/* Sección Hero con el evento principal */}
      <section className="relative bg-black text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/70 to-black/70 z-10" />
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${mainEvent.image})` }} />
        <div className="relative z-20 container mx-auto px-4 py-24 md:py-32">
          <Badge className="mb-4 bg-purple-600 hover:bg-purple-700">{mainEvent.category}</Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{mainEvent.name}</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl">{mainEvent.description}</p>
          <div className="space-y-2 text-sm text-gray-200 mb-8">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{formatDate(mainEvent.date)}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>{mainEvent.time}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 flex-shrink-0" />
              <span>
                {mainEvent.venue}, {mainEvent.location}
              </span>
            </div>
          </div>
          <Link
            href={`/events/${mainEvent.id}`}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium transition-colors inline-block"
          >
            Ver Detalles
          </Link>
        </div>
      </section>

      {/* Buscador */}
      <section className="py-10 bg-gradient-to-b from-purple-900 to-purple-800">
        <div className="container mx-auto px-4">
          <SearchBar onSearch={handleSearch} categories={categories} />
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">
            {searchPerformed ? "Resultados de búsqueda" : "Próximos Eventos"}
          </h2>

          {loading ? (
            // Mostrar spinner mientras carga
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
                    const sortedEvents = [...events].sort((a, b) => {
                      const dateA = new Date(a.date)
                      const dateB = new Date(b.date)
                      return dateA.getTime() - dateB.getTime()
                    })
                    setAllFilteredEvents(sortedEvents)
                    setTotalPages(Math.ceil(sortedEvents.length / eventsPerPage))
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
                      <div className={`relative h-64 md:h-full ${index % 2 === 1 ? "order-first md:order-last" : ""}`}>
                        <Image src={event.image || "/placeholder.svg"} alt={event.name} fill className="object-cover" />
                        <div className="absolute top-4 left-4">
                          <Badge className="bg-purple-600 hover:bg-purple-700">{event.category}</Badge>
                        </div>
                      </div>

                      <div className="p-6 md:p-8 flex flex-col">
                        <div>
                          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">{event.name}</h2>

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

                          <p className="text-gray-700 mb-6">{event.description}</p>
                        </div>

                        <div className="mt-auto flex items-center justify-between">
                          <span className="font-bold text-xl text-gray-800">${event.price.toFixed(2)}</span>
                          <Link href={`/events/${event.id}`}>
                            <Button className="bg-purple-600 hover:bg-purple-700">Ver Detalles</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Paginación */}
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}
        </div>
      </section>
    </main>
  )
}
