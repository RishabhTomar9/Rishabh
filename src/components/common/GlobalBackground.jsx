import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const GlobalBackground = () => {
    const { scrollYProgress } = useScroll();
    const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

    // Generate static particles for performance
    const particles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
    }));

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-zinc-950 pointer-events-none">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(17,17,23,1)_0%,rgba(9,9,11,1)_100%)]"></div>

            {/* Subtle Grid - Global */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px',
                    maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)'
                }}
            />

            {/* Ambient Colors (Blur Blobs) */}
            <motion.div
                style={{ y }}
                className="absolute top-0 left-0 w-full h-full overflow-hidden"
            >
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/10 rounded-xl blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
                <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] bg-blue-900/10 rounded-xl blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
                <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-indigo-900/10 rounded-xl blur-[140px] animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }}></div>
            </motion.div>

            {/* Floating Particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-xl bg-white/10"
                    style={{
                        top: `${p.top}%`,
                        left: `${p.left}%`,
                        width: p.size,
                        height: p.size,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0, 0.5, 0],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
};

export default GlobalBackground;
