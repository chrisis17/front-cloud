"use client"

import type React from "react"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SearchBarProps {
  onSearch: (query: string, category: string) => void
  categories: string[]
}

export default function SearchBar({ onSearch, categories }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("todos")

  const handleSearch = () => {
    onSearch(searchQuery, category)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="w-full bg-purple-50 p-6 rounded-lg shadow-md border border-purple-100">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            type="text"
            placeholder="Buscar eventos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10 w-full bg-white border-purple-200 text-black"
          />
        </div>

        <div className="w-full md:w-48">
          <Select value={category} onValueChange={setCategory}>
            {/* Cambiar el color del texto a negro para mejor visibilidad */}
            <SelectTrigger className="bg-white border-purple-200 text-black">
              <SelectValue placeholder="Categoría" className="text-black" />
            </SelectTrigger>
            <SelectContent className="bg-black">
              <SelectItem value="todos" className="text-white">
                Todas las categorías
              </SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()} className="text-white">
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700">
          Buscar
        </Button>
      </div>
    </div>
  )
}
