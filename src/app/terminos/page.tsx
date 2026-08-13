export default function TermsPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-16 text-[#1A120B] dark:text-[#F8F5F2]">
            <h1 className="text-4xl font-serif font-bold mb-6">Términos y Condiciones</h1>
            <div className="space-y-4 text-sm text-gray-600 dark:text-[#A39B92] leading-relaxed">
                <p>Bienvenido a VELVET Roasters. Al realizar una reserva en nuestra plataforma, aceptas las siguientes políticas de servicio.</p>

                <h2 className="text-lg font-bold text-[#1A120B] dark:text-white pt-2">1. Tolerancia y Horarios</h2>
                <p>Las reservas cuentan con un tiempo límite de tolerancia de 15 minutos sobre la hora programada. Transcurrido ese lapso, la mesa podrá ser reasignada.</p>

                <h2 className="text-lg font-bold text-[#1A120B] dark:text-white pt-2">2. Cancelaciones</h2>
                <p>Agradecemos notificar la cancelación o modificación del número de asistentes con al menos 2 horas de anticipación.</p>

                <h2 className="text-lg font-bold text-[#1A120B] dark:text-white pt-2">3. Uso Comercial de la Demo</h2>
                <p>Este sitio web ha sido desarrollado como una demostración técnica de capacidades de desarrollo web y no representa transacciones financieras reales.</p>
            </div>
        </main>
    );
}