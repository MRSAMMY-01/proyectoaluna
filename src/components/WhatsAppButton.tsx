import { useState, useRef } from 'react';
import { useBusinessHours } from '@/hooks/useBusinessHours';

export default function WhatsAppButton() {
  const { isOpen, nextOpenLabel } = useBusinessHours();
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  const waLink = `https://wa.me/56998944867?text=${encodeURIComponent(
    'Hola, somos Aluna Moda Maternal. ¿Tienes una duda? Escríbenos'
  )}`;

  const handleClick = (e: React.MouseEvent) => {
    if (!isOpen) {
      e.preventDefault();
      setShowToast(true);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = window.setTimeout(() => setShowToast(false), 4000);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-30 group flex items-center">
      {/* Toast de horario cerrado */}
      {showToast && (
        <div className="absolute bottom-full right-0 mb-3 w-60 bg-rose-900 text-white p-4 rounded-2xl shadow-xl flex flex-col gap-1 animate-fade-up z-50">
          <p className="font-semibold text-sm">Estamos cerrados por ahora</p>
          <p className="text-pink-100 text-xs">{nextOpenLabel} · Lun a Sáb, 10:30–18:30</p>
        </div>
      )}

      {/* Tooltip / label */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-rose-900 text-xs sm:text-sm font-medium px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl shadow-lg whitespace-nowrap opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-pink-100">
        {isOpen ? '¿Tienes una duda?' : 'Cerrado por ahora'}
      </span>

      {/* Ping ring */}
      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-60" />
      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full bg-green-400 animate-pulse-pink" style={{ animationName: 'pulsePink' }} />

      {/* Button */}
      <a
        href={isOpen ? waLink : undefined}
        target={isOpen ? '_blank' : undefined}
        rel={isOpen ? 'noopener noreferrer' : undefined}
        onClick={handleClick}
        aria-label="Escríbenos por WhatsApp"
        className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-110"
      >
        <img src="/logowsp1.png" alt="WhatsApp" className="w-8 h-8 object-contain" />
      </a>
    </div>
  );
}
