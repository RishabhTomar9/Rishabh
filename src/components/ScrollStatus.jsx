import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
];

const ScrollStatus = () => {
    const [activeSection, setActiveSection] = useState('home');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            },
            { threshold: 0.5 }
        );

        sections.forEach((section) => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="fixed bottom-10 left-10 z-[100] hidden lg:block">
            <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex gap-0.5">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                className="w-1 h-3 bg-purple-500/50"
                                animate={{
                                    height: [4, 12, 4],
                                    opacity: [0.3, 1, 0.3]
                                }}
                                transition={{
                                    duration: 0.8,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em]">
                        SYSTEM_STATUS: ONLINE
                    </span>
                </div>

                <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-6 border-white/5">
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={activeSection}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="text-[10px] font-bold text-white uppercase tracking-[0.2em]"
                        >
                            {activeSection.replace('-', '_')}
                        </motion.span>
                    </AnimatePresence>

                    <div className="flex gap-1.5">
                        {sections.map((s) => (
                            <motion.div
                                key={s.id}
                                className={`h-1 rounded-xl transition-all duration-500 ${activeSection === s.id ? 'w-8 bg-purple-500' : 'w-2 bg-zinc-800'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScrollStatus;
