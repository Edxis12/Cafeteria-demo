'use client';

import { useState, useEffect } from 'react';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:max-w-md p-4 bg-[#181512] text-[#F8F5F2] border border-[#2D2620] rounded-2xl shadow-2xl z-50 space-y-3">
      <p className="text-xs text-[#A39B92] leading-relaxed">
        Utilizamos cookies propias y de terceros para optimizar la experiencia de navegación y gestionar tus reservas.
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={acceptCookies}
          className="px-4 py-1.5 rounded-xl bg-[#D57E7E] text-white text-xs font-semibold hover:bg-[#c26d6d] transition-all cursor-pointer"
        >
          Aceptar todas
        </button>
        <a
          href="/privacidad"
          className="text-xs text-[#A39B92] underline hover:text-white transition-colors"
        >
          Ver política
        </a>
      </div>
    </div>
  );
}