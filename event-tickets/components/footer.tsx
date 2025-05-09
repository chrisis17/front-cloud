import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-900 to-purple-800 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TickEvent</h3>
            <p className="text-purple-200">
              Tu destino principal para boletos de eventos exclusivos. Encuentra y reserva los eventos más emocionantes
              en tu área.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Soporte</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-purple-200 hover:text-white transition-colors">
                  Preguntas Frecuentes
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-purple-200 hover:text-white transition-colors">
                  Términos de Servicio
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-purple-200 hover:text-white transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-purple-200 hover:text-white transition-colors">
                  Política de Reembolso
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Contáctanos</h4>
            <address className="not-italic text-purple-200">
              <p>Av. Principal 1234</p>
              <p>Ciudad de México, 10001</p>
              <p className="mt-2">Email: info@tickevent.com</p>
              <p>Teléfono: (123) 456-7890</p>
            </address>
          </div>
        </div>

        <div className="border-t border-purple-700 mt-8 pt-8 text-center text-purple-200">
          <p>&copy; {new Date().getFullYear()} TickEvent. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
