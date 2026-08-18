import { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem('hasSeenSplash');
    
    if (!hasSeenSplash) {
      setIsVisible(true);
      
      // Permanecer visible ~1.5s y luego iniciar fade-out
      const fadeOutTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, 1500);

      // Desmontar completamente después del fade-out (1.5s + 400ms = 1.9s)
      const removeTimer = setTimeout(() => {
        setIsVisible(false);
        sessionStorage.setItem('hasSeenSplash', 'true');
      }, 1900);

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(removeTimer);
      };
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-[#fdf2f6] to-[#fbe4ee] transition-opacity duration-400 ease-in-out ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className={`transition-all duration-600 ease-out ${isFadingOut ? 'scale-100' : 'animate-splash-in'}`}>
        <img
          src="/logoinicio1.png"
          alt="Aluna Moda Maternal"
          className="w-52 h-52 sm:w-60 sm:h-60 object-contain"
        />
      </div>
    </div>
  );
}
