import { MapPin, Clock, Phone } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function Location() {
  const ref = useScrollReveal();

  return (
    <section id="ubicacion" className="py-20 sm:py-28 px-5 sm:px-8 bg-white">
      <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-pink-400 text-sm font-semibold tracking-widest uppercase">
            Visítanos
          </span>
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-rose-900 mt-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Te esperamos en Chillán
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Info side */}
          <div className="flex flex-col justify-center gap-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 sm:p-12 border border-pink-100 shadow-sm order-2 lg:order-1">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-400 flex items-center justify-center flex-shrink-0">
                <MapPin size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-rose-900 leading-tight">
                  Nuestra boutique
                </h3>
                <p className="text-lg sm:text-xl text-pink-600 font-medium mt-2 leading-relaxed">
                  El Roble 655, Galería Caracol,<br />Local 44, Chillán
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
                <Clock size={22} className="text-pink-500" />
              </div>
              <div>
                <h4 className="font-semibold text-rose-900 mb-1">Horario</h4>
                <p className="text-rose-700/70 text-sm leading-relaxed">
                  Lunes a Viernes: 10:00 — 19:00 hrs<br />
                  Sábado: 10:00 — 14:00 hrs
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-pink-100 flex items-center justify-center flex-shrink-0">
                <Phone size={22} className="text-pink-500" />
              </div>
              <div>
                <h4 className="font-semibold text-rose-900 mb-1">Teléfono</h4>
                <a
                  href="tel:+56998944867"
                  className="text-pink-600 hover:text-pink-700 font-medium transition-colors"
                >
                  +569 98944867
                </a>
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=El+Roble+655+Galeria+Caracol+Local+44+Chillan"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-pink-400 hover:bg-pink-500 text-white font-semibold text-center py-3.5 rounded-2xl transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 mt-2"
            >
              Cómo llegar
            </a>
          </div>

          {/* Map side */}
          <div className="rounded-2xl overflow-hidden shadow-md border border-pink-100 min-h-[420px] order-1 lg:order-2">
            <iframe
              title="Ubicación de Aluna Moda Maternal en Chillán"
              src="https://www.google.com/maps?q=El+Roble+655,+Galer%C3%ADa+Caracol,+Chill%C3%A1n&output=embed"
              width="100%"
              height="100%"
              style={{ minHeight: '420px', border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
