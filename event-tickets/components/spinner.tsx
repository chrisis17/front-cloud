import { Loader2 } from "lucide-react"

export default function Spinner({ size = "default" }: { size?: "small" | "default" | "large" }) {
  const sizeClass = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12",
  }

  return (
    <div className="flex justify-center items-center py-8">
      <Loader2 className={`${sizeClass[size]} animate-spin text-purple-600`} />
      <span className="sr-only">Cargando...</span>
    </div>
  )
}
