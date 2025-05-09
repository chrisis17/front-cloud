"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { events } from "@/data/events"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Spinner from "@/components/spinner"

export default function PurchasePage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [loading, setLoading] = useState(true)
  const pageRef = useRef<HTMLDivElement>(null)

  // Mantener el desplazamiento hacia arriba en la página de compra
  useEffect(() => {
    // Redirigir si no ha iniciado sesión
    if (!user) {
      router.push("/login?redirect=/purchase/" + params.id)
      return
    }

    // Encontrar evento
    const foundEvent = events.find((e) => e.id === params.id)
    if (foundEvent) {
      setEvent(foundEvent)
      // Simular tiempo de carga
      setTimeout(() => {
        setLoading(false)
        // Mantener el desplazamiento al inicio de la página cuando se carga
        if (pageRef.current) {
          pageRef.current.scrollIntoView({ behavior: "auto", block: "start" })
        }
      }, 500)
    } else {
      router.push("/events")
    }
  }, [user, params.id, router])

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <p>Redirigiendo al inicio de sesión...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 bg-gray-100">
        <div className="bg-white rounded-lg shadow-md p-8">
          <Spinner size="large" />
          <p className="text-center text-gray-600 mt-4">Cargando información de compra...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <p>Evento no encontrado</p>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí manejarías la compra real
    alert("¡Compra exitosa! Esto es una demostración, no se realizó ninguna compra real.")
    router.push("/")
  }

  const totalPrice = event.price * quantity

  // Mejorar el diseño de la página de compra con un fondo más claro
  return (
    <div className="container mx-auto px-4 py-12 bg-[#82898F]" ref={pageRef}>
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Completa tu Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-md border-0">
            <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-800 text-white">
              <CardTitle>Información de Pago</CardTitle>
              <CardDescription className="text-purple-100">
                Ingresa tus datos de pago para completar la compra
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 bg-white">
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-700">
                      Nombre en la Tarjeta
                    </Label>
                    <Input
                      id="name"
                      placeholder="Juan Pérez"
                      required
                      className="bg-gray-50 border-gray-200 focus:bg-white text-black"
                    />
                  </div>

                  <div>
                    <Label htmlFor="card" className="text-gray-700">
                      Número de Tarjeta
                    </Label>
                    <Input
                      id="card"
                      placeholder="1234 5678 9012 3456"
                      required
                      className="bg-gray-50 border-gray-200 focus:bg-white text-black"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry" className="text-gray-700">
                        Fecha de Expiración
                      </Label>
                      <Input
                        id="expiry"
                        placeholder="MM/AA"
                        required
                        className="bg-gray-50 border-gray-200 focus:bg-white text-black"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc" className="text-gray-700">
                        CVC
                      </Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        required
                        className="bg-gray-50 border-gray-200 focus:bg-white text-black"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-gray-700">Método de Pago</Label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="text-gray-700">
                          Tarjeta de Crédito
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="text-gray-700">
                          PayPal
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="quantity" className="text-gray-700">
                      Cantidad de Boletos
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max="10"
                      value={quantity}
                      onChange={(e) => setQuantity(Number.parseInt(e.target.value))}
                      required
                      className="bg-gray-50 border-gray-200 focus:bg-white text-black"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full mt-6 bg-purple-600 hover:bg-purple-700">
                  Completar Compra
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="shadow-md border-0">
            <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-800 text-white">
              <CardTitle>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 bg-white">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-800">{event.name}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString("es-ES")} a las {event.time}
                  </p>
                </div>

                <div className="border-t pt-4 border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Precio por boleto</span>
                    <span className="text-gray-800">${event.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Cantidad</span>
                    <span className="text-gray-800">{quantity}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-800">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Cargo por Servicio</span>
                    <span className="text-gray-800">${(totalPrice * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-4 border-gray-200">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-800">Total</span>
                    <span className="text-gray-800">${(totalPrice * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
