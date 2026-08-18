import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/context/ProductsContext';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER } from '@/data/products';
import { useBusinessHours } from '@/hooks/useBusinessHours';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  const [activeImage, setActiveImage] = useState(0);

  const { isOpen, nextOpenLabel } = useBusinessHours();
  const [showToast, setShowToast] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  const product = products.find((p) => p.id === id);

  const handleBack = () => {
    navigate('/');
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-5 text-center">
        <h1 className="font-playfair text-2xl font-bold text-rose-900 mb-3">
          Producto no encontrado
        </h1>
        <p className="text-rose-700/70 mb-6">
          El producto que buscas no existe o ha sido eliminado.
        </p>
        <button
          onClick={handleBack}
          className="flex items-center gap-2 bg-pink-400 hover:bg-pink-500 text-white px-6 py-3 rounded-xl font-medium transition-colors"
        >
          <ArrowLeft size={20} />
          Volver al catálogo
        </button>
      </div>
    );
  }

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hola, me interesa el ${product.name} ($${product.price.toLocaleString('es-CL')})`
  )}`;

  const handleBtnClick = (e: React.MouseEvent) => {
    if (!isOpen) {
      e.preventDefault();
      setShowToast(true);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = window.setTimeout(() => setShowToast(false), 4000);
    }
  };

  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-white text-rose-900 pb-28">
      {/* Top Header */}
      <header className="fixed top-0 w-full z-40 bg-white/80 backdrop-blur-md border-b border-pink-100 flex items-center px-4 h-14">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-rose-700 hover:text-pink-500 font-medium text-sm transition-colors"
          aria-label="Volver al catálogo"
        >
          <ArrowLeft size={18} />
          Volver al catálogo
        </button>
      </header>

      {/* Hero / Carousel */}
      <div className="relative w-full aspect-[4/5] sm:aspect-square md:aspect-[3/2] lg:aspect-[21/9] bg-pink-50 mt-14 overflow-hidden group/carousel">
        <div
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          onScroll={(e) => {
            const target = e.target as HTMLElement;
            const index = Math.round(target.scrollLeft / target.clientWidth);
            setActiveImage(index);
          }}
        >
          {images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${product.name} - ${idx + 1}`}
              className="w-full h-full object-cover shrink-0 snap-center"
            />
          ))}
        </div>

        <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-pink-500 text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm z-10">
          {product.category}
        </span>

        {/* Dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/20 px-2.5 py-1.5 rounded-full backdrop-blur-sm">
            {images.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${activeImage === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                  }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Details */}
      <main className="px-5 py-6 max-w-4xl mx-auto">
        <div className="mb-6 border-b border-pink-50 pb-6">
          <h1
            className="font-playfair text-3xl sm:text-4xl font-bold text-rose-900 leading-snug mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {product.name}
          </h1>
          <p className="text-3xl font-bold text-pink-500">
            ${product.price.toLocaleString('es-CL')}
          </p>
        </div>

        <div className="prose prose-pink">
          <h3 className="text-rose-900 font-semibold mb-2">Descripción del producto</h3>
          <p className="text-rose-700/80 leading-relaxed whitespace-pre-wrap">
            {product.description}
          </p>
        </div>
      </main>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-pink-100 p-4 sm:p-5 z-40 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <div className="max-w-4xl mx-auto flex relative">

          {/* Toast de cerrado */}
          {showToast && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-[90%] max-w-xs sm:max-w-sm bg-rose-900 text-white p-4 rounded-2xl shadow-xl flex flex-col gap-1 animate-fade-up z-50">
              <p className="font-semibold text-sm">Estamos cerrados por ahora</p>
              <p className="text-pink-100 text-xs">{nextOpenLabel} · Lun a Sáb, 10:30–18:30</p>
            </div>
          )}

          <a
            href={isOpen ? waLink : undefined}
            target={isOpen ? '_blank' : undefined}
            rel={isOpen ? 'noopener noreferrer' : undefined}
            onClick={handleBtnClick}
            className={`w-full flex items-center justify-center gap-2 font-bold text-base sm:text-lg px-6 py-4 rounded-2xl shadow-lg transition-all duration-300 ${isOpen
              ? 'bg-pink-500 hover:bg-pink-600 text-white hover:-translate-y-1'
              : 'bg-rose-100 text-rose-500 hover:bg-rose-200 cursor-pointer'
              }`}
          >
            {isOpen && <MessageCircle size={24} fill="currentColor" />}
            {isOpen ? 'Consultar por WhatsApp' : 'Fuera de horario · Ver cuándo abrimos'}
          </a>
        </div>
      </div>
    </div>
  );
}
