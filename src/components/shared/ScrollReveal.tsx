'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
}

export function ScrollReveal({
    children,
    delay = 0,
    direction = 'up',
}: ScrollRevealProps) {
    // Configuración de la posición inicial según la dirección deseada
    const getInitialPosition = () => {
        switch (direction) {
            case 'up':
                return { y: 40, x: 0 };
            case 'down':
                return { y: -40, x: 0 };
            case 'left':
                return { x: 40, y: 0 };
            case 'right':
                return { x: -40, y: 0 };
            default:
                return { y: 40, x: 0 };
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...getInitialPosition() }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: false, amount: 0.2 }} // amount: 0.2 activa la animación cuando se ve el 20% del elemento
            transition={{
                duration: 0.6,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98], // Curva suave tipo Apple
            }}
        >
            {children}
        </motion.div>
    );
}