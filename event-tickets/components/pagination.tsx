"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  // No mostrar paginación si solo hay una página
  if (totalPages <= 1) return null

  // Función para generar los números de página a mostrar
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5 // Mostrar máximo 5 números de página

    if (totalPages <= maxPagesToShow) {
      // Si hay 5 o menos páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Siempre mostrar la primera página
      pages.push(1)

      // Calcular el rango de páginas a mostrar alrededor de la página actual
      let startPage = Math.max(2, currentPage - 1)
      let endPage = Math.min(totalPages - 1, currentPage + 1)

      // Ajustar si estamos cerca del inicio o final
      if (currentPage <= 3) {
        endPage = 4
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3
      }

      // Agregar elipsis si es necesario
      if (startPage > 2) {
        pages.push("...")
      }

      // Agregar páginas intermedias
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Agregar elipsis si es necesario
      if (endPage < totalPages - 1) {
        pages.push("...")
      }

      // Siempre mostrar la última página
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  // Modificar los botones de paginación para mejorar el contraste y cambiar el color del texto
  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9 bg-gray-100 hover:bg-gray-200 border-gray-300 text-black"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Página anterior</span>
      </Button>

      {pageNumbers.map((page, index) => (
        <Button
          key={index}
          variant={page === currentPage ? "default" : "outline"}
          size="icon"
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={`h-9 w-9 ${
            page === currentPage
              ? "bg-purple-600 hover:bg-purple-700 text-white"
              : "bg-gray-100 hover:bg-gray-200 border-gray-300 text-black"
          }`}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 w-9 bg-gray-100 hover:bg-gray-200 border-gray-300 text-black"
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Página siguiente</span>
      </Button>
    </div>
  )
}
