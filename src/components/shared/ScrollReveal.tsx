'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ScrollRevealProps {
    children: ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
}

export function ScrollReveal({
    children,
    delay = 0,
    direction = 'up',
    className = '',
}: ScrollRevealProps) {
    // Desplazamientos seguros y fluidos para evitar desbordes laterales
    const getInitialPosition = () => {
        switch (direction) {
            case 'up':
                return { y: 24, x: 0 };
            case 'down':
                return { y: -24, x: 0 };
            case 'left':
                return { x: 20, y: 0 };
            case 'right':
                return { x: -20, y: 0 };
            default:
                return { y: 24, x: 0 };
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...getInitialPosition() }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true, amount: 0.08 }}
            transition={{
                duration: 0.55,
                delay: delay,
                ease: [0.21, 0.47, 0.32, 0.98],
            }}
            className={`w-full ${className}`}
        >
            {children}
        </motion.div>
    );
}