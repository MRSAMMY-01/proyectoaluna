import { useEffect, useState } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { useProducts } from '@/context/ProductsContext';
import { useBusinessHours } from '@/hooks/useBusinessHours';
import ProductCard from '@/components/ProductCard';

export default function Catalog() {
  const ref = useScrollReveal();
  const { products, loading, error } = useProducts();
  const { isOpen, nextOpenLabel } = useBusinessHours();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Restore scroll position when returning from product detail
  useEffect(() => {
    const scrollPos = sessionStorage.getItem('catalogScroll');
    if (scrollPos) {
      window.scrollTo({ top: parseInt(scrollPos, 10), behavior: 'instant' });
      sessionStorage.removeItem('catalogScroll');
    }
  }, []);

  // Derive unique categories dynamically from current products
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ).sort();

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <section id="coleccion" className="pt-8 pb-20 sm:pt-12 sm:pb-28 px-5 sm:px-8 bg-pink-50">
      <div ref={ref as React.RefObject<HTMLDivElement>} className="reveal max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-pink-400 text-sm font-semibold tracking-widest uppercase">
            Nuestra Colección
          </span>
          <h2
            className="font-playfair text-3xl sm:text-4xl font-bold text-rose-900 mt-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Prendas pensadas para ti
          </h2>
          <p className="text-rose-700/70 mt-4 text-base leading-relaxed">
            Cada modelo está diseñado con amor para acompañarte en cada etapa de tu embarazo.
          </p>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-pink-100 animate-pulse">
                <div className="bg-pink-100 aspect-[3/4]" />
                <div className="p-4 flex flex-col gap-3">
                  <div className="h-4 bg-pink-100 rounded-full w-3/4" />
                  <div className="h-3 bg-pink-50 rounded-full w-1/2" />
                  <div className="h-5 bg-pink-100 rounded-full w-1/3 mt-1" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Firestore connection error */}
        {error && !loading && (
          <div className="text-center py-16 flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-2xl">📡</div>
            <p className="text-rose-700 font-semibold">Sin conexión al catálogo</p>
            <p className="text-rose-700/60 text-sm max-w-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-5 py-2 bg-pink-400 hover:bg-pink-500 text-white text-sm font-semibold rounded-full transition-all"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Products loaded */}
        {!loading && !error && (
          <>
            {/* Category filter chips */}
            {categories.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 mb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                    activeCategory === 'all'
                      ? 'bg-pink-400 text-white border-pink-400 shadow-sm'
                      : 'bg-white text-pink-400 border-pink-200 hover:border-pink-300 hover:bg-pink-50'
                  }`}
                >
                  Ver todo
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
                      activeCategory === cat
                        ? 'bg-pink-400 text-white border-pink-400 shadow-sm'
                        : 'bg-white text-pink-400 border-pink-200 hover:border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-rose-700/60">Aún no hay productos disponibles. Vuelve pronto.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, i) => (
                  <div
                    key={product.id}
                    style={{ animation: `fadeInUp 0.6s ease-out ${0.1 * i}s both` }}
                  >
                    <ProductCard product={product} isOpen={isOpen} nextOpenLabel={nextOpenLabel} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
