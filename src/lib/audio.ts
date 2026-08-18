let cachedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;

    if (!cachedAudioContext) {
        const AudioContextClass =
            window.AudioContext ||
            (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

        if (AudioContextClass) {
            cachedAudioContext = new AudioContextClass();
        }
    }

    return cachedAudioContext;
}

export const playNotificationSound = async () => {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;

        // Reactivar el contexto si el navegador lo suspendió por falta de interacción inicial
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }

        const now = ctx.currentTime;

        // Tono 1 (587.33 Hz - Re5)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now);
        gain1.gain.setValueAtTime(0.2, now);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.45);

        // Tono 2 (880.00 Hz - La5) con retardo armónico
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.12);
        gain2.gain.setValueAtTime(0.2, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.12);
        osc2.stop(now + 0.7);

        // Desconectar nodos del grafo de audio al finalizar para liberar memoria
        setTimeout(() => {
            try {
                osc1.disconnect();
                gain1.disconnect();
                osc2.disconnect();
                gain2.disconnect();
            } catch {
                // Ignorar si ya fueron recolectados
            }
        }, 800);
    } catch (err) {
        console.warn('AudioContext no inicializado o bloqueado por políticas del navegador:', err);
    }
};