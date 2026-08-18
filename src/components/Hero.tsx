import { useState, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';

const SLIDES = [
  {
    image: '/portada1.jpeg',
    alt: 'Mamá embarazada con vestido rosa caminando',
  },
  {
    image: '/portada2.jpeg',
    alt: 'Mamá embarazada con vestido rosa en la naturaleza',
  },
  {
    image: '/portada3.jpeg',
    alt: 'Mamá embarazada con maxi dress en el parque',
  },
  {
    image: '/portada4.jpeg',
    alt: 'Retrato elegante de mamá embarazada sonriendo',
  },
  {
    image: '/portada5.jpeg',
    alt: 'Mamá embarazada con vestido rosa y su perro',
  },
];

const SLIDE_DURATION = 4000;

export default function Hero() {
  const [current, setCurrent] = useState(0);

  const scrollToCollection = useCallback(() => {
    document.getElementById('coleccion')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative lg:min-h-[85vh] flex items-center overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-fuchsia-50 pt-24 lg:pt-32 pb-8">
      {/* Decorative blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-fuchsia-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-rose-200/20 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center w-full">
        {/* Text side */}
        <div className="flex flex-col gap-5 sm:gap-6 animate-fade-up order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-sm border border-pink-200 text-pink-500 text-xs font-semibold px-4 py-2 rounded-full w-fit shadow-sm">
            <Sparkles size={13} className="text-pink-400" />
            Moda para mamás felices
          </div>

          <h1
            className="font-playfair text-4xl sm:text-5xl xl:text-6xl font-bold text-rose-900 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Ropa cómoda,{' '}
            <em className="not-italic text-pink-500">linda</em>{' '}
            y pensada para cada etapa de tu embarazo.
          </h1>

          <p className="text-rose-700/80 text-base sm:text-lg leading-relaxed max-w-md">
            En <strong className="text-pink-500">Aluna Moda Maternal</strong> encontrarás
            prendas diseñadas con amor para que te sientas hermosa, cómoda y
            segura en cada momento de esta etapa mágica.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={scrollToCollection}
              className="bg-pink-400 hover:bg-pink-500 text-white font-semibold text-base px-8 py-4 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              Ver Colección
            </button>
          </div>
        </div>

        {/* Carousel side */}
        <div className="relative flex justify-center order-1 lg:order-2 animate-fade-right w-full">
          <div className="relative w-full max-w-sm">
            {/* Slides — full-width 9:16 vertical */}
            <div className="relative w-full rounded-3xl overflow-hidden shadow-xl aspect-[9/16]">
              {SLIDES.map((slide, i) => (
                <img
                  key={i}
                  src={slide.image}
                  alt={slide.alt}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                  style={{ opacity: i === current ? 1 : 0 }}
                />
              ))}
            </div>

            {/* Dot indicators */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Ir a imagen ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-pink-400' : 'w-2 bg-pink-200 hover:bg-pink-300'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
