'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/src/lib/supabase';
import { Lock, Mail, Key, Eye, EyeOff, ArrowLeft, Coffee, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError('Credenciales no autorizadas. Verifica tu correo y contraseña.');
            setLoading(false);
        } else {
            router.push('/admin');
        }
    };

    useEffect(() => {
        supabase.auth.signOut();

        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                supabase.auth.signOut();
            }
        };

        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, []);

    return (
        <div className="min-h-screen bg-[#0C0A09] text-[#F8F5F2] flex items-center justify-center p-3 sm:p-6 lg:p-10 relative overflow-hidden">
            {/* Halo ambiental suave */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[700px] h-[300px] sm:h-[700px] bg-[#D57E7E]/5 rounded-full blur-[120px] sm:blur-[160px] pointer-events-none" />

            {/* Contenedor Principal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.98, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="relative z-10 w-full max-w-5xl rounded-3xl sm:rounded-[2.5rem] bg-[#14110E] border border-[#2D2620] shadow-2xl shadow-black/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12"
            >
                {/* =========================================================
            COLUMNA IZQUIERDA: Identidad de Marca (Desktop / Tablet grande)
           ========================================================= */}
                <div className="relative hidden lg:flex lg:col-span-5 flex-col justify-between p-10 overflow-hidden min-h-[600px]">
                    <img
                        src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=1200"
                        alt="Interior cafetería y café artesanal"
                        className="absolute inset-0 w-full h-full object-cover scale-105 filter brightness-[0.45] contrast-110 pointer-events-none select-none"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C0A09] via-transparent to-black/40" />

                    <div className="relative z-10 flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white">
                            <Coffee size={20} />
                        </div>
                        <div>
                            <span className="font-serif font-bold text-lg tracking-wider block leading-tight text-white">
                                VELVET
                            </span>
                            <span className="text-[#D57E7E] text-[9px] uppercase tracking-[0.25em] font-bold">
                                Management Console
                            </span>
                        </div>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div className="p-5 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-semibold text-[#D57E7E]">
                                <Sparkles size={14} /> Panel Central de Operaciones
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed font-normal">
                                Control en tiempo real de reservas, disponibilidad de mesas y catálogo gastronómico.
                            </p>
                        </div>

                        <p className="text-[11px] text-[#A39B92]/70 font-mono">
                            v2.4.0 • Sistema En Línea
                        </p>
                    </div>
                </div>

                {/* =========================================================
            COLUMNA DERECHA: Formulario de Autenticación
           ========================================================= */}
                <div className="lg:col-span-7 p-6 sm:p-10 lg:p-14 flex flex-col justify-between space-y-6 sm:space-y-8 bg-[#14110E]">

                    {/* Header del Formulario */}
                    <div className="space-y-2.5 sm:space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#D57E7E] uppercase tracking-widest bg-[#D57E7E]/10 px-3 py-1 rounded-full border border-[#D57E7E]/20">
                                <ShieldCheck size={13} /> Acceso Administrativo
                            </span>

                            <a
                                href="/"
                                className="text-xs text-[#A39B92] hover:text-white transition-colors flex items-center gap-1 py-1"
                            >
                                <ArrowLeft size={13} /> Ir al sitio
                            </a>
                        </div>

                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#F8F5F2] pt-1">
                            Bienvenido de vuelta
                        </h1>
                        <p className="text-xs sm:text-sm text-[#A39B92]">
                            Ingresa tus credenciales autorizadas para gestionar el negocio.
                        </p>
                    </div>

                    {/* Alerta de Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs text-center font-medium"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Formulario */}
                    <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                        {/* Campo: Correo */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-[#C5BCB3] uppercase tracking-wider">
                                Correo Electrónico
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@velvet.com"
                                    required
                                    className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-2xl bg-[#0C0A09] border border-[#2D2620] focus:border-[#D57E7E] focus:ring-1 focus:ring-[#D57E7E]/30 outline-none text-sm text-white transition-all placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        {/* Campo: Contraseña con Toggle */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-[#C5BCB3] uppercase tracking-wider">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    required
                                    className="w-full pl-11 pr-12 py-3 sm:py-3.5 rounded-2xl bg-[#0C0A09] border border-[#2D2620] focus:border-[#D57E7E] focus:ring-1 focus:ring-[#D57E7E]/30 outline-none text-sm text-white transition-all placeholder:text-gray-600"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-white transition-colors cursor-pointer"
                                    tabIndex={-1}
                                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                                >
                                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                </button>
                            </div>
                        </div>

                        {/* Botón de Envío */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 sm:py-4 rounded-2xl bg-[#D57E7E] text-white font-bold text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:bg-[#c26d6d] transition-all disabled:opacity-50 cursor-pointer shadow-xl shadow-[#D57E7E]/20 hover:scale-[1.01] active:scale-[0.99] mt-2 flex items-center justify-center gap-2 min-h-[48px]"
                        >
                            {loading ? (
                                <span>Autenticando...</span>
                            ) : (
                                <>
                                    <Lock size={14} />
                                    <span>Ingresar al Panel</span>
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer Informativo */}
                    <div className="pt-3 sm:pt-4 border-t border-white/5 flex items-center justify-between text-[11px] text-[#A39B92] flex-wrap gap-2">
                        <span>VELVET Roasters & Co.</span>
                        <span className="flex items-center gap-1 text-emerald-400">
                            <CheckCircle2 size={12} /> Servidor Protegido
                        </span>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}