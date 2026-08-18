import { Instagram, Facebook, Clock, MapPin, Heart } from 'lucide-react';
import { useBusinessHours } from '@/hooks/useBusinessHours';

export default function Footer() {
  const { isOpen, nextOpenLabel, closingTimeLabel } = useBusinessHours();

  return (
    <footer id="contacto" className="bg-gradient-to-b from-pink-50 to-rose-100 pt-16 pb-10 px-5 sm:px-8 border-t border-pink-100">
      <div className="max-w-6xl mx-auto">
        {/* Thank you message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-pink-400 mb-5">
            <Heart size={26} className="text-white" />
          </div>
          <h2
            className="font-playfair text-2xl sm:text-3xl font-bold text-rose-900 max-w-2xl mx-auto leading-snug"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Gracias por elegirnos para acompañarte en esta etapa tan especial
          </h2>
          <p className="text-rose-700/70 mt-4 max-w-md mx-auto">
            Estamos aquí para ayudarte a sentirte hermosa durante tu embarazo.
          </p>
        </div>

        {/* Contact grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-2 bg-white rounded-2xl p-5 shadow-sm border border-pink-100 transition-all hover:-translate-y-1">
            <Clock size={22} className="text-pink-500" />
            <span className="text-xs text-rose-700/60 uppercase tracking-wide">Horario de atención</span>
            <div className="flex flex-col items-center text-center">
              <span className="text-sm font-semibold text-rose-900 flex items-start justify-center gap-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
                <span>{isOpen ? `Abierto ahora · Cierra a las ${closingTimeLabel}` : `Cerrado · ${nextOpenLabel}`}</span>
              </span>
              <span className="text-xs text-rose-700/60 font-medium">Lun a Sáb · 10:30 - 18:30</span>
            </div>
          </div>

          <a
            href="https://www.google.com/maps/search/?api=1&query=El+Roble+655+Galeria+Caracol+Chillan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 bg-white rounded-2xl p-5 shadow-sm hover:shadow-md border border-pink-100 transition-all hover:-translate-y-1"
          >
            <MapPin size={22} className="text-pink-500" />
            <span className="text-xs text-rose-700/60 uppercase tracking-wide">Ubicación</span>
            <span className="text-sm font-semibold text-rose-900 text-center">Local 44, Chillán</span>
          </a>

          <div className="flex flex-col items-center gap-2 bg-white rounded-2xl p-5 shadow-sm border border-pink-100">
            <span className="text-xs text-rose-700/60 uppercase tracking-wide">Síguenos</span>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/aluna_modamaternal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-400 flex items-center justify-center transition-all hover:-translate-y-1"
              >
                <Instagram size={18} className="text-pink-500 hover:text-white transition-colors" />
              </a>
              <a
                href="https://www.facebook.com/Alunamodamaternal"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-pink-100 hover:bg-pink-400 flex items-center justify-center transition-all hover:-translate-y-1"
              >
                <Facebook size={18} className="text-pink-500 hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-pink-200/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="font-playfair font-bold text-lg text-pink-500"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Aluna <span className="text-xs font-medium tracking-[0.22em] text-pink-300 uppercase">Moda Maternal</span>
          </p>
          <p className="text-xs text-rose-700/50">
            © {new Date().getFullYear()} Aluna Moda Maternal · Chillán, Chile · Hecho con amor
          </p>
        </div>
      </div>
    </footer>
  );
}
