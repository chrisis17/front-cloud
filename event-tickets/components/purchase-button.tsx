"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"

interface PurchaseButtonProps {
  eventId: string
}

export default function PurchaseButton({ eventId }: PurchaseButtonProps) {
  const { user } = useAuth()
  const router = useRouter()

  const handlePurchase = () => {
    if (!user) {
      router.push(`/login?redirect=/purchase/${eventId}`)
      return
    }

    router.push(`/purchase/${eventId}`)
  }

  return (
    <Button onClick={handlePurchase} className="w-full bg-purple-600 hover:bg-purple-700">
      {user ? "Comprar Boletos" : "Iniciar sesión para comprar"}
    </Button>
  )
}
