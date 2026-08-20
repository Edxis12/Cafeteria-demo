"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, ShieldCheck } from "lucide-react";

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    setShowBanner(false);
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-3 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm p-4 sm:p-5 bg-[#181512]/95 backdrop-blur-xl text-[#F8F5F2] border border-[#2D2620] rounded-3xl shadow-2xl z-50 space-y-3.5"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#231F1B] text-[#D57E7E] border border-[#2D2620] shrink-0">
              <Cookie size={16} />
            </div>
            <div className="space-y-1">
              <span className="font-serif font-bold text-xs text-[#F8F5F2] block">
                Privacidad & Cookies
              </span>
              <p className="text-[11px] text-[#A39B92] leading-relaxed">
                Utilizamos cookies para optimizar tu navegación y gestionar
                reservas sin almacenar datos invasivos.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/5">
            <Link
              href="/privacidad"
              className="text-[11px] text-[#A39B92] hover:text-white underline transition-colors py-1.5"
            >
              Ver política
            </Link>
            <button
              onClick={acceptCookies}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#D57E7E] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#c26d6d] transition-all cursor-pointer shadow-md shadow-[#D57E7E]/20 min-h-[38px]"
            >
              <ShieldCheck size={14} />
              <span>Aceptar</span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
