import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import type { Product } from '@/data/products';
import { WHATSAPP_NUMBER } from '@/data/products';

export default function ProductCard({
  product,
  isOpen,
  nextOpenLabel,
}: {
  product: Product;
  isOpen: boolean;
  nextOpenLabel: string;
}) {
  const navigate = useNavigate();
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  const handleProductClick = () => {
    sessionStorage.setItem('catalogScroll', window.scrollY.toString());
    navigate(`/producto/${product.id}`);
  };

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola, me interesa el producto: ${product.name} por $${product.price.toLocaleString('es-CL')}`
  )}`;

  const handleWaClick = (e: React.MouseEvent) => {
    if (!isOpen) {
      e.preventDefault();
      setShowToast(true);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = window.setTimeout(() => setShowToast(false), 4000);
    }
  };

  return (
    <>
      <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-pink-100 hover:border-pink-200 transition-all duration-300 hover:-translate-y-1.5 flex flex-col h-full">
        {/* Clickable image + title area */}
        <button
          onClick={handleProductClick}
          className="relative overflow-hidden h-60 sm:h-64 block text-left"
          aria-label={`Ver detalles de ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-pink-500 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
            {product.category}
          </span>
        </button>

        {/* Body */}
        <div className="flex flex-col flex-grow p-5">
          <button
            onClick={handleProductClick}
            className="text-left"
            aria-label={`Ver detalles de ${product.name}`}
          >
            <h3 className="font-playfair text-lg font-semibold text-rose-900 leading-snug hover:text-pink-500 transition-colors">
              {product.name}
            </h3>
          </button>
          <p className="text-rose-700/60 text-sm mt-1.5 leading-relaxed flex-grow line-clamp-2">
            {product.description}
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-pink-50">
            <span className="text-xl font-bold text-pink-500">
              ${product.price.toLocaleString('es-CL')}
            </span>
            {/* Wrapper for toast + button */}
            <div className="relative">
              {showToast && (
                <div className="absolute bottom-full right-0 mb-2 w-56 bg-rose-900 text-white p-3 rounded-2xl shadow-xl flex flex-col gap-0.5 animate-fade-up z-50">
                  <p className="font-semibold text-xs">Estamos cerrados por ahora</p>
                  <p className="text-pink-100 text-[10px] leading-snug">{nextOpenLabel} · Lun a Sáb, 10:30–18:30</p>
                </div>
              )}
              <a
                href={isOpen ? waLink : undefined}
                target={isOpen ? '_blank' : undefined}
                rel={isOpen ? 'noopener noreferrer' : undefined}
                onClick={handleWaClick}
                aria-label={`Consultar ${product.name} por WhatsApp`}
                className={`flex items-center justify-center gap-1.5 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all duration-200 sm:py-2.5 ${
                  isOpen
                    ? 'bg-pink-400 hover:bg-pink-500 hover:shadow-md hover:-translate-y-0.5'
                    : 'bg-rose-200 text-rose-500 cursor-pointer'
                }`}
              >
                <MessageCircle size={16} fill="currentColor" />
                {isOpen ? 'Consultar' : 'Cerrado'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
