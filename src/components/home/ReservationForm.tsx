"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  User,
  Mail,
  Phone,
  Sparkles,
  CheckCircle2,
  Coffee,
  Armchair,
  Sun,
  ArrowRight,
  AlertCircle,
  Loader2,
} from "lucide-react";

const reservationSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(60, "Máximo 60 caracteres"),
  email: z.string().email("Ingresa un correo electrónico válido"),
  phone: z
    .string()
    .min(10, "Ingresa un número de teléfono válido (mínimo 10 dígitos)"),
  guests: z
    .number({ invalid_type_error: "Ingresa un número válido" })
    .min(1, "Mínimo 1 persona")
    .max(10, "Máximo 10 personas por reserva"),
  reservation_date: z.string().min(1, "Selecciona una fecha"),
  reservation_time: z.string().min(1, "Selecciona una hora"),
  website_hp_check: z.string().optional(), // Honeypot anti-spam
});

type ReservationFormData = z.infer<typeof reservationSchema>;

const ZONES = [
  {
    id: "barra",
    title: "Barra de Especialidad",
    description:
      "Frente a los baristas. Ideal para los amantes de métodos filtrados y el arte del espresso.",
    icon: Coffee,
    name: "Barra de Especialidad",
  },
  {
    id: "salon",
    title: "Salón Principal",
    description:
      "Ambiente cálido y tranquilo con música suave. Perfecto para reuniones o trabajo en laptop.",
    icon: Armchair,
    name: "Salón Principal",
  },
  {
    id: "terraza",
    title: "Terraza Pet-Friendly",
    description:
      "Espacio al aire libre con vegetación. Acondicionado para disfrutar con tu mascota.",
    icon: Sun,
    name: "Terraza Pet-Friendly",
  },
];

export function ReservationForm() {
  const [selectedZone, setSelectedZone] = useState<string>("salon");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fecha mínima permitida (día actual local)
  const todayDate = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guests: 2,
      website_hp_check: "",
    },
  });

  const onSubmit = async (data: ReservationFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const activeZone =
      ZONES.find((z) => z.id === selectedZone)?.name || "Salón Principal";

    const payload = {
      name: data.name.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      guests: Number(data.guests),
      reservation_date: data.reservation_date,
      reservation_time: data.reservation_time,
      zone: activeZone,
      website_hp_check: data.website_hp_check || "",
    };

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setIsSuccess(true);
        reset();
      } else {
        const firstError =
          result.details?.[0]?.message ||
          result.error ||
          "Hubo un error al procesar tu reserva.";
        setErrorMessage(firstError);
      }
    } catch {
      setErrorMessage(
        "Error de conexión con el servidor. Por favor, verifica tu conexión.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="reservas"
      className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24"
    >
      {/* Halo ambiental suave */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] sm:w-[550px] h-[280px] sm:h-[550px] bg-[#D57E7E]/5 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

      <div className="relative z-10 rounded-3xl bg-[#181512]/80 backdrop-blur-xl border border-white/10 p-5 sm:p-8 md:p-12 shadow-2xl shadow-black/60 space-y-8 sm:space-y-10">
        {/* Encabezado */}
        <div className="text-center max-w-xl mx-auto flex flex-col items-center gap-3 sm:gap-4">
          <span className="inline-flex items-center gap-1.5 text-[#D57E7E] text-[11px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase px-3.5 py-1.5 sm:px-4 sm:py-1.5 rounded-full bg-[#D57E7E]/10 border border-[#D57E7E]/20">
            <Sparkles size={13} className="shrink-0" /> Reserva Tu Mesa
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#F8F5F2] leading-tight">
            Asegura Tu Experiencia
          </h2>
          <p className="text-xs sm:text-sm text-[#A39B92] leading-relaxed px-2">
            Elige la zona de tu preferencia y la fecha ideal. Te confirmaremos
            tu mesa al instante.
          </p>
        </div>

        {/* Banner de Éxito */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 sm:p-8 bg-emerald-500/10 border border-emerald-500/30 rounded-3xl text-center space-y-4"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 size={28} className="sm:w-8 sm:h-8" />
              </div>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                ¡Reserva Solicitada con Éxito!
              </h3>
              <p className="text-xs sm:text-sm text-[#C5BCB3] max-w-md mx-auto leading-relaxed">
                Hemos recibido tus datos correctamente y te hemos enviado un
                correo de confirmación. Nuestro equipo preparará tu mesa en el
                ambiente seleccionado.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="mt-2 text-xs font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 underline cursor-pointer p-1"
              >
                Hacer otra reserva
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!isSuccess && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
            className="space-y-8 sm:space-y-10"
          >
            {/* Campo Honeypot Oculto (Anti-Bots) */}
            <input
              type="text"
              {...register("website_hp_check")}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Mensaje de error */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2.5">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1. Selección de Zona */}
            <div className="space-y-3 sm:space-y-4">
              <label className="block text-xs font-bold text-[#D57E7E] uppercase tracking-[0.18em] sm:tracking-[0.2em]">
                1. Elige tu ambiente preferido
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {ZONES.map((zone) => {
                  const Icon = zone.icon;
                  const isSelected = selectedZone === zone.id;
                  return (
                    <div
                      key={zone.id}
                      onClick={() => setSelectedZone(zone.id)}
                      className={`relative p-4 sm:p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                        isSelected
                          ? "bg-[#231F1B] border-[#D57E7E] shadow-xl shadow-[#D57E7E]/10"
                          : "bg-[#100D0A]/70 border-[#2D2620] hover:border-[#D57E7E]/30 hover:bg-[#181512]"
                      }`}
                    >
                      {isSelected && (
                        <motion.div
                          layoutId="activeZoneIndicator"
                          className="absolute inset-0 border-2 border-[#D57E7E] rounded-2xl pointer-events-none transform-gpu"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}
                      <div className="flex items-center justify-between">
                        <div
                          className={`p-2 sm:p-2.5 rounded-xl transition-colors ${
                            isSelected
                              ? "bg-[#D57E7E] text-white shadow-md"
                              : "bg-[#231F1B] text-[#A39B92]"
                          }`}
                        >
                          <Icon size={18} />
                        </div>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-[#D57E7E] uppercase tracking-widest bg-[#D57E7E]/10 px-2 py-0.5 rounded-full border border-[#D57E7E]/20">
                            Seleccionado
                          </span>
                        )}
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-[#F8F5F2]">
                          {zone.title}
                        </h4>
                        <p className="text-xs text-[#A39B92] leading-relaxed">
                          {zone.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Campos del Formulario */}
            <div className="space-y-3 sm:space-y-4">
              <label className="block text-xs font-bold text-[#D57E7E] uppercase tracking-[0.18em] sm:tracking-[0.2em]">
                2. Datos de tu visita
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Nombre */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#C5BCB3]">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                    <input
                      {...register("name")}
                      type="text"
                      autoComplete="name"
                      placeholder="Ej. Edgar Murillo"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#100D0A] border border-[#2D2620] focus:border-[#D57E7E] focus:ring-1 focus:ring-[#D57E7E]/30 text-sm text-white outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[11px] text-rose-400 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Correo */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#C5BCB3]">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                    <input
                      {...register("email")}
                      type="email"
                      autoComplete="email"
                      placeholder="ejemplo@correo.com"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#100D0A] border border-[#2D2620] focus:border-[#D57E7E] focus:ring-1 focus:ring-[#D57E7E]/30 text-sm text-white outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] text-rose-400 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Teléfono */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#C5BCB3]">
                    Teléfono Móvil
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                    <input
                      {...register("phone")}
                      type="tel"
                      autoComplete="tel"
                      placeholder="667 123 4567"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#100D0A] border border-[#2D2620] focus:border-[#D57E7E] focus:ring-1 focus:ring-[#D57E7E]/30 text-sm text-white outline-none transition-all placeholder:text-gray-600"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] text-rose-400 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Comensales */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#C5BCB3]">
                    Número de Comensales
                  </label>
                  <div className="relative">
                    <Users
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                    <select
                      {...register("guests", { valueAsNumber: true })}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#100D0A] border border-[#2D2620] focus:border-[#D57E7E] focus:ring-1 focus:ring-[#D57E7E]/30 text-sm text-white [color-scheme:dark] cursor-pointer outline-none transition-all"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <option
                          key={num}
                          value={num}
                          className="bg-[#181512] text-white"
                        >
                          {num} {num === 1 ? "Persona" : "Personas"}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.guests && (
                    <p className="text-[11px] text-rose-400 mt-1">
                      {errors.guests.message}
                    </p>
                  )}
                </div>

                {/* Fecha */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#C5BCB3]">
                    Fecha de Reserva
                  </label>
                  <div className="relative">
                    <Calendar
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                    <input
                      {...register("reservation_date")}
                      type="date"
                      autoComplete="off"
                      min={todayDate}
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#100D0A] border border-[#2D2620] focus:border-[#D57E7E] focus:ring-1 focus:ring-[#D57E7E]/30 text-sm text-white [color-scheme:dark] cursor-pointer outline-none transition-all"
                    />
                  </div>
                  {errors.reservation_date && (
                    <p className="text-[11px] text-rose-400 mt-1">
                      {errors.reservation_date.message}
                    </p>
                  )}
                </div>

                {/* Hora */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-[#C5BCB3]">
                    Hora Estimada
                  </label>
                  <div className="relative">
                    <Clock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                    <select
                      {...register("reservation_time")}
                      autoComplete="off"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#100D0A] border border-[#2D2620] focus:border-[#D57E7E] focus:ring-1 focus:ring-[#D57E7E]/30 text-sm text-white [color-scheme:dark] cursor-pointer outline-none transition-all"
                    >
                      <option value="" className="bg-[#181512] text-gray-400">
                        Selecciona una hora
                      </option>
                      <option
                        value="08:00 AM"
                        className="bg-[#181512] text-white"
                      >
                        08:00 AM
                      </option>
                      <option
                        value="10:00 AM"
                        className="bg-[#181512] text-white"
                      >
                        10:00 AM
                      </option>
                      <option
                        value="12:00 PM"
                        className="bg-[#181512] text-white"
                      >
                        12:00 PM
                      </option>
                      <option
                        value="02:00 PM"
                        className="bg-[#181512] text-white"
                      >
                        02:00 PM
                      </option>
                      <option
                        value="04:00 PM"
                        className="bg-[#181512] text-white"
                      >
                        04:00 PM
                      </option>
                      <option
                        value="06:00 PM"
                        className="bg-[#181512] text-white"
                      >
                        06:00 PM
                      </option>
                      <option
                        value="08:00 PM"
                        className="bg-[#181512] text-white"
                      >
                        08:00 PM
                      </option>
                    </select>
                  </div>
                  {errors.reservation_time && (
                    <p className="text-[11px] text-rose-400 mt-1">
                      {errors.reservation_time.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Botón de Envío */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 sm:py-4 rounded-2xl bg-[#D57E7E] text-white font-bold text-xs uppercase tracking-[0.12em] sm:tracking-[0.2em] hover:bg-[#c26d6d] transition-all cursor-pointer shadow-xl shadow-[#D57E7E]/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 min-h-[48px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Procesando Reserva...</span>
                </>
              ) : (
                <>
                  <span>Confirmar Solicitud de Reserva</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
