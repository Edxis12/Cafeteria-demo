'use client';

import { useEffect } from 'react';

export function SessionGuard() {
    useEffect(() => {
        // 1. Limpieza de tokens en storage local sin importar el SDK
        if (typeof window !== 'undefined') {
            try {
                Object.keys(localStorage).forEach((key) => {
                    if (key.startsWith('sb-')) {
                        localStorage.removeItem(key);
                    }
                });
            } catch {
                // Ignorar si el almacenamiento está restringido
            }
        }

        // 2. Notificar al backend para revocar sesión en servidor
        fetch('/api/logout', { method: 'POST' }).catch(() => { });
    }, []);

    return null;
}