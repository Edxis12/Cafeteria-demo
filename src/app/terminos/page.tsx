import Link from 'next/link';
import { ArrowLeft, ShieldCheck, FileText } from 'lucide-react';

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-[#100D0A] text-[#F8F5F2] relative overflow-hidden px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
            {/* Halo ambiental suave */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[280px] sm:w-[500px] h-[250px] bg-[#D57E7E]/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                {/* Botón Volver */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#181512] border border-[#2D2620] text-xs font-semibold text-[#A39B92] hover:text-white hover:border-[#D57E7E]/40 transition-colors"
                >
                    <ArrowLeft size={14} />
                    <span>Volver al Inicio</span>
                </Link>

                {/* Encabezado */}
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D57E7E]/10 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#D57E7E] border border-[#D57E7E]/20">
                        <FileText size={12} />
                        <span>Políticas de Servicio</span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
                        Términos y Condiciones
                    </h1>
                    <p className="text-xs sm:text-sm text-[#A39B92] leading-relaxed">
                        Última actualización: 2026. Conoce las directrices operativas de nuestra plataforma y servicios de reserva.
                    </p>
                </div>

                {/* Contenido en bloque estilizado */}
                <div className="p-6 sm:p-8 rounded-3xl bg-[#14110E] border border-[#2D2620] space-y-6 text-xs sm:text-sm text-[#C5BCB3] leading-relaxed">
                    <p>
                        Bienvenido a <span className="text-white font-bold font-serif">VELVET Roasters</span>. Al gestionar una reserva a través de nuestra plataforma web, aceptas los siguientes lineamientos operativos:
                    </p>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                        <h2 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-[#231F1B] text-[#D57E7E] flex items-center justify-center text-xs">1</span>
                            Tolerancia y Horarios
                        </h2>
                        <p className="text-xs text-[#A39B92] pl-8">
                            Las reservas cuentan con un tiempo límite de tolerancia de 15 minutos sobre la hora seleccionada. Transcurrido este periodo sin confirmación presencial, la mesa podrá ser liberada para otros clientes.
                        </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                        <h2 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-[#231F1B] text-[#D57E7E] flex items-center justify-center text-xs">2</span>
                            Modificaciones y Cancelaciones
                        </h2>
                        <p className="text-xs text-[#A39B92] pl-8">
                            Agradecemos notificar cualquier ajuste en el número de comensales o cancelación con al menos 2 horas de anticipación a través de nuestro canal de WhatsApp o correo electrónico.
                        </p>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-white/5">
                        <h2 className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-[#231F1B] text-[#D57E7E] flex items-center justify-center text-xs">3</span>
                            Naturaleza de la Demostración
                        </h2>
                        <p className="text-xs text-[#A39B92] pl-8">
                            Esta plataforma es una aplicación web demostrativa y de portafolio técnico orientada a optimizar la experiencia de usuario y la gestión operativa en tiempo real.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}