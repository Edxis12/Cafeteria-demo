'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/src/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, Users, User, Mail, Phone, Sparkles, CheckCircle2, Coffee, Armchair, Sun } from 'lucide-react';

const reservationSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Ingresa un correo electrónico válido'),
    phone: z.string().min(10, 'Ingresa un número de teléfono de al menos 10 dígitos'),
    guests: z.number().min(1, 'Mínimo 1 persona').max(10, 'Máximo 10 personas por reserva'),
    reservation_date: z.string().min(1, 'Selecciona una fecha'),
    reservation_time: z.string().min(1, 'Selecciona una hora'),
});

type ReservationFormData = z.infer<typeof reservationSchema>;

const ZONES = [
    {
        id: 'barra',
        title: 'Barra de Especialidad',
        description: 'Frente a los baristas. Ideal para los amantes de métodos filtrados y el arte del espresso.',
        icon: Coffee,
    },
    {
        id: 'salon',
        title: 'Salón Principal',
        description: 'Ambiente cálido y tranquilo con música suave. Perfecto para reuniones o trabajo en laptop.',
        icon: Armchair,
    },
    {
        id: 'terraza',
        title: 'Terraza Pet-Friendly',
        description: 'Espacio al aire libre con vegetación. Acondicionado para disfrutar con tu mascota.',
        icon: Sun,
    },
];

export function ReservationForm() {
    const [selectedZone, setSelectedZone] = useState<string>('salon');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ReservationFormData>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            guests: 2,
        },
    });

    const onSubmit = async (data: ReservationFormData) => {
        setIsSubmitting(true);
        try {
            const { error } = await supabase.from('reservations').insert([
                {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    guests: Number(data.guests),
                    reservation_date: data.reservation_date,
                    reservation_time: data.reservation_time,
                    zone: selectedZone === 'barra' ? 'Barra' : selectedZone === 'terraza' ? 'Terraza' : 'Salón Principal',
                    status: 'pending',
                    // Opcional: Si en la BD tienes una columna de zona o notas
                },
            ]);

            if (error) throw error;

            setIsSuccess(true);
            reset();
        } catch (err) {
            console.error('Error al guardar reserva:', err);
            alert('Hubo un error al procesar tu reserva. Inténtalo de nuevo.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="reservas" className="max-w-4xl mx-auto px-4 py-20">
            <div className="bg-[#181512] border border-[#2D2620] rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">

                {/* Encabezado */}
                <div className="text-center max-w-lg mx-auto space-y-2">
                    <span className="text-[#D57E7E] text-xs font-semibold tracking-widest uppercase flex items-center justify-center gap-1.5">
                        <Sparkles size={14} /> Reserva Tu Mesa
                    </span>
                    <h2 className="text-3xl font-serif font-bold text-white">
                        Asegura Tu Experiencia
                    </h2>
                    <p className="text-xs text-[#A39B92]">
                        Elige la zona de tu preferencia y la fecha ideal. Te enviaremos confirmación al instante.
                    </p>
                </div>

                {/* Modal/Aviso de Confirmación Exitosa */}
                <AnimatePresence>
                    {isSuccess && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-center space-y-3"
                        >
                            <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
                            <h3 className="text-lg font-bold text-white">¡Reserva Solicitada con Éxito!</h3>
                            <p className="text-xs text-[#A39B92] leading-relaxed">
                                Hemos recibido tu solicitud. Te enviaremos los detalles de confirmación a tu correo electrónico.
                            </p>
                            <button
                                onClick={() => setIsSuccess(false)}
                                className="mt-2 text-xs font-semibold text-emerald-400 underline cursor-pointer"
                            >
                                Hacer otra reserva
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isSuccess && (
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                        {/* 1. Selección Visual de Zona */}
                        <div className="space-y-3">
                            <label className="block text-xs font-semibold text-[#A39B92] uppercase tracking-wider">
                                1. Elige tu ambiente preferido
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {ZONES.map((zone) => {
                                    const Icon = zone.icon;
                                    const isSelected = selectedZone === zone.id;
                                    return (
                                        <div
                                            key={zone.id}
                                            onClick={() => setSelectedZone(zone.id)}
                                            className={`relative p-4 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 ${isSelected
                                                ? 'bg-[#231F1B] border-[#D57E7E] shadow-lg shadow-[#D57E7E]/10'
                                                : 'bg-[#100D0A] border-[#2D2620] hover:border-[#2D2620]/80'
                                                }`}
                                        >
                                            {isSelected && (
                                                <motion.div
                                                    layoutId="activeZoneBorder"
                                                    className="absolute inset-0 border-2 border-[#D57E7E] rounded-2xl pointer-events-none"
                                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                                />
                                            )}
                                            <div className="flex items-center justify-between">
                                                <div
                                                    className={`p-2 rounded-xl ${isSelected ? 'bg-[#D57E7E] text-white' : 'bg-[#231F1B] text-[#A39B92]'
                                                        }`}
                                                >
                                                    <Icon size={18} />
                                                </div>
                                                {isSelected && (
                                                    <span className="text-[10px] font-bold text-[#D57E7E] uppercase tracking-wider">
                                                        Seleccionado
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-sm text-white">{zone.title}</h4>
                                                <p className="text-[11px] text-[#A39B92] leading-tight mt-1">
                                                    {zone.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 2. Datos de la Reserva */}
                        <div className="space-y-4">
                            <label className="block text-xs font-semibold text-[#A39B92] uppercase tracking-wider">
                                2. Detalles de tu visita
                            </label>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Nombre */}
                                <div>
                                    <label className="block text-xs text-[#A39B92] mb-1">Nombre Completo</label>
                                    <div className="relative">
                                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            {...register('name')}
                                            type="text"
                                            placeholder="Ej. Ernesto Lopez"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#100D0A] border border-[#2D2620] focus:border-[#D57E7E] text-sm text-white outline-none transition-colors"
                                        />
                                    </div>
                                    {errors.name && <p className="text-[11px] text-rose-400 mt-1">{errors.name.message}</p>}
                                </div>

                                {/* Correo */}
                                <div>
                                    <label className="block text-xs text-[#A39B92] mb-1">Correo Electrónico</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            {...register('email')}
                                            type="email"
                                            placeholder="ernesto@ejemplo.com"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#100D0A] border border-[#2D2620] focus:border-[#D57E7E] text-sm text-white outline-none transition-colors"
                                        />
                                    </div>
                                    {errors.email && <p className="text-[11px] text-rose-400 mt-1">{errors.email.message}</p>}
                                </div>

                                {/* Teléfono */}
                                <div>
                                    <label className="block text-xs text-[#A39B92] mb-1">Teléfono Móvil</label>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            {...register('phone')}
                                            type="tel"
                                            placeholder="667 123 4567"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#100D0A] border border-[#2D2620] focus:border-[#D57E7E] text-sm text-white outline-none transition-colors"
                                        />
                                    </div>
                                    {errors.phone && <p className="text-[11px] text-rose-400 mt-1">{errors.phone.message}</p>}
                                </div>

                                {/* Número de Personas */}
                                <div>
                                    <label className="block text-xs text-[#A39B92] mb-1">Número de Comensales</label>
                                    <div className="relative">
                                        <Users size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            {...register('guests', { valueAsNumber: true })}
                                            type="number"
                                            min={1}
                                            max={10}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#100D0A] border border-[#2D2620] focus:border-[#D57E7E] text-sm text-white outline-none transition-colors"
                                        />
                                    </div>
                                    {errors.guests && <p className="text-[11px] text-rose-400 mt-1">{errors.guests.message}</p>}
                                </div>

                                {/* Fecha */}
                                <div>
                                    <label className="block text-xs text-[#A39B92] mb-1">Fecha de Reserva</label>
                                    <div className="relative">
                                        <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <input
                                            {...register('reservation_date')}
                                            type="date"
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#100D0A] border border-[#2D2620] focus:border-[#D57E7E] text-sm text-white outline-none transition-colors text-gray-300"
                                        />
                                    </div>
                                    {errors.reservation_date && <p className="text-[11px] text-rose-400 mt-1">{errors.reservation_date.message}</p>}
                                </div>

                                {/* Hora */}
                                <div>
                                    <label className="block text-xs text-[#A39B92] mb-1">Hora Estimada</label>
                                    <div className="relative">
                                        <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                                        <select
                                            {...register('reservation_time')}
                                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#100D0A] border border-[#2D2620] focus:border-[#D57E7E] text-sm text-white outline-none transition-colors"
                                        >
                                            <option value="">Selecciona hora</option>
                                            <option value="08:00 AM">08:00 AM</option>
                                            <option value="10:00 AM">10:00 AM</option>
                                            <option value="12:00 PM">12:00 PM</option>
                                            <option value="02:00 PM">02:00 PM</option>
                                            <option value="04:00 PM">04:00 PM</option>
                                            <option value="06:00 PM">06:00 PM</option>
                                            <option value="08:00 PM">08:00 PM</option>
                                        </select>
                                    </div>
                                    {errors.reservation_time && <p className="text-[11px] text-rose-400 mt-1">{errors.reservation_time.message}</p>}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3.5 rounded-xl bg-[#D57E7E] text-white font-bold text-sm hover:bg-[#c26d6d] transition-all cursor-pointer shadow-lg shadow-[#D57E7E]/20 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Procesando Reserva...' : 'Confirmar Solicitud de Reserva'}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}