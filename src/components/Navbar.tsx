import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Lock } from 'lucide-react';

const navLinks = [
  { label: 'Colección', href: '#coleccion' },
  { label: 'Ubicación', href: '#ubicacion' },
  { label: 'Contacto', href: '#contacto' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNav = (href: string) => {
    setMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAdmin = () => {
    setMenuOpen(false);
    navigate('/admin');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-pink-100'
            : 'bg-transparent'
        }`}
      >
        <nav className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex flex-col leading-none"
          >
            <span
              className="font-playfair font-bold text-xl sm:text-2xl text-pink-500 tracking-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Aluna
            </span>
            <span className="text-[10px] sm:text-xs font-medium tracking-[0.22em] text-pink-300 uppercase">
              Moda Maternal
            </span>
          </a>

          {/* Desktop links + admin */}
          <ul className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <button
                  onClick={() => handleNav(link.href)}
                  className="text-sm font-medium text-pink-400 hover:text-pink-600 transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-pink-400 group-hover:w-full transition-all duration-300" />
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={handleAdmin}
                className="flex items-center gap-1.5 text-xs font-medium text-rose-700/40 hover:text-pink-400 transition-colors py-1"
                aria-label="Panel de administración"
              >
                <Lock size={12} />
              </button>
            </li>
          </ul>

          {/* Mobile toggle */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden p-2 text-pink-400 hover:text-pink-600 transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>
        </nav>
      </header>

      {/* Mobile drawer overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        } bg-rose-900/40 backdrop-blur-sm`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile drawer — slides from right */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-50 md:hidden w-72 max-w-[80vw] bg-white shadow-2xl transition-transform duration-300 ease-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-pink-100">
          <span
            className="font-playfair font-bold text-xl text-pink-500"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Aluna
          </span>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 text-rose-700/60 hover:text-rose-900 hover:bg-pink-50 rounded-lg transition-colors"
            aria-label="Cerrar menú"
          >
            <X size={22} />
          </button>
        </div>

        <ul className="flex flex-col px-5 py-4 gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <button
                onClick={() => handleNav(link.href)}
                className="w-full text-left py-3.5 text-base font-medium text-pink-500 hover:text-pink-700 border-b border-pink-50 transition-colors"
              >
                {link.label}
              </button>
            </li>
          ))}
          {/* Discreet admin link */}
          <li className="mt-6 pt-4 border-t border-pink-50">
            <button
              onClick={handleAdmin}
              className="w-full flex items-center justify-center gap-1.5 text-xs font-medium text-rose-700/40 hover:text-pink-400 transition-colors py-2"
            >
              <Lock size={12} />
              Administración
            </button>
          </li>
        </ul>
      </aside>
    </>
  );
}
