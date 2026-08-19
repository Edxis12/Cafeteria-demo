"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  X,
  CheckCircle2,
  MessageSquarePlus,
  Loader2,
} from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("Cliente Frecuente");
  const [comment, setComment] = useState("");
  const [stars, setStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    abortControllerRef.current = new AbortController();
    let timeoutId: NodeJS.Timeout | undefined;

    try {
      timeoutId = setTimeout(() => abortControllerRef.current?.abort(), 10000);

      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortControllerRef.current.signal,
        body: JSON.stringify({
          name: name.trim(),
          role: role.trim() || "Cliente Frecuente",
          comment: comment.trim(),
          stars,
        }),
      });

      clearTimeout(timeoutId);
      const result = await res.json();

      if (res.ok && result.success) {
        setIsSuccess(true);
        setName("");
        setComment("");
        setStars(5);
      } else {
        const firstError =
          result.details?.[0]?.message ||
          result.error ||
          "Hubo un error al enviar tu reseña.";
        setErrorMessage(firstError);
      }
    } catch (error: unknown) {
      if (timeoutId) clearTimeout(timeoutId);

      if (error instanceof Error && error.name === "AbortError") {
        setErrorMessage(
          "La solicitud tardó demasiado tiempo. Verifica tu conexión.",
        );
      } else {
        setErrorMessage(
          "Error de conexión con el servidor. Inténtalo de nuevo.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsSuccess(false);
    setErrorMessage(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          {/* Overlay interactivo */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md rounded-3xl bg-[#14110E] border border-[#2D2620] p-6 sm:p-8 shadow-2xl shadow-black/80 space-y-5 z-10 my-auto"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full text-[#A39B92] hover:text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {isSuccess ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <CheckCircle2 size={30} />
                </div>
                <h3 className="font-serif font-bold text-xl text-white">
                  ¡Gracias por tu opinión!
                </h3>
                <p className="text-xs text-[#A39B92] leading-relaxed">
                  Hemos recibido tu reseña con éxito. Se publicará en breve tras
                  una breve verificación.
                </p>
                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-2xl bg-[#D57E7E] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#c26d6d] transition-all cursor-pointer shadow-lg shadow-[#D57E7E]/20"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#D57E7E] uppercase tracking-widest bg-[#D57E7E]/10 px-2.5 py-1 rounded-full border border-[#D57E7E]/20">
                    <MessageSquarePlus size={12} /> Tu Experiencia
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white pt-1">
                    Cuéntanos qué te pareció
                  </h3>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs leading-relaxed">
                    {errorMessage}
                  </div>
                )}

                {/* Selector de Estrellas */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-[#C5BCB3]">
                    Calificación
                  </label>
                  <div className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setStars(star)}
                        onMouseEnter={() => setHoverStars(star)}
                        onMouseLeave={() => setHoverStars(0)}
                        className="p-1 text-[#2D2620] hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Star
                          size={24}
                          className={
                            (hoverStars || stars) >= star
                              ? "text-orange-400 fill-orange-400"
                              : "text-[#2D2620]"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Nombre */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#C5BCB3]">
                    Tu Nombre
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Sofía Morales"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full p-3 rounded-2xl bg-[#0C0A09] border border-[#2D2620] text-xs text-white focus:border-[#D57E7E] outline-none"
                  />
                </div>

                {/* Rol Opcional */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#C5BCB3]">
                    Ocupación / Rol (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Amante del café / Diseñadora"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-[#0C0A09] border border-[#2D2620] text-xs text-white focus:border-[#D57E7E] outline-none"
                  />
                </div>

                {/* Comentario */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-[#C5BCB3]">
                    Tu Comentario
                  </label>
                  <textarea
                    placeholder="El café de especialidad y la atención fueron increíbles..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    rows={3}
                    className="w-full p-3 rounded-2xl bg-[#0C0A09] border border-[#2D2620] text-xs text-white focus:border-[#D57E7E] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#D57E7E] text-white font-bold text-xs uppercase tracking-wider hover:bg-[#c26d6d] transition-all cursor-pointer shadow-lg shadow-[#D57E7E]/20 disabled:opacity-50 min-h-[44px] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Enviando reseña...</span>
                    </>
                  ) : (
                    "Publicar mi reseña"
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
