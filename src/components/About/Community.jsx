import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { FaInstagram, FaYoutube, FaExternalLinkAlt } from 'react-icons/fa';

const SocialCard = ({ platform, handle }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const isInsta = platform === 'Instagram';
    const accentColor = isInsta ? 'from-pink-500 to-purple-500' : 'from-red-600 to-red-500';
    const shadowColor = isInsta ? 'group-hover:shadow-pink-500/20' : 'group-hover:shadow-red-500/20';
    const borderColor = isInsta ? 'group-hover:border-pink-500/50' : 'group-hover:border-red-500/50';
    const iconColor = isInsta ? 'text-pink-500' : 'text-red-500';

    return (
        <motion.a
            href={handle.link}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`group relative flex flex-col items-center justify-center p-12 rounded-xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm overflow-hidden transition-all duration-500 ${borderColor} ${shadowColor} hover:-translate-y-2`}
        >
            {/* Dynamic Spotlight */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition duration-300"
                style={{
                    background: useTransform(
                        [mouseX, mouseY],
                        ([x, y]) => `radial-gradient(600px circle at ${x}px ${y}px, rgba(255,255,255,0.05), transparent 80%)`
                    ),
                }}
            />

            {/* Background Gradient Blur */}
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br ${accentColor} opacity-0 group-hover:opacity-20 blur-[100px] transition-opacity duration-700`} />

            {/* Icon */}
            <div className={`relative z-10 mb-6 p-6 rounded-xl bg-zinc-950 border border-white/10 group-hover:scale-110 transition-transform duration-500 ${iconColor}`}>
                {platform === 'Instagram' ? <FaInstagram className="w-12 h-12" /> : <FaYoutube className="w-12 h-12" />}
            </div>

            {/* Content */}
            <div className="relative z-10 text-center space-y-2">
                <h3 className="text-2xl font-bold text-white font-tech uppercase tracking-wider">
                    {platform}
                </h3>
                <p className="text-zinc-500 font-bold text-sm tracking-widest group-hover:text-zinc-300 transition-colors">
                    @{handle.name}
                </p>
            </div>

            {/* External Link Indicator */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <FaExternalLinkAlt className="text-white/30 w-4 h-4" />
            </div>

            {/* Decorative Lines */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-white/20 transition-all duration-500" />
        </motion.a>
    );
};

const Community = () => {
    return (
        <section className="py-32 relative bg-[#050505] overflow-hidden" aria-label="Community Section">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="container mx-auto px-6  relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-[2px] bg-purple-500" />
                            <span className="text-xs font-bold text-purple-400 tracking-[0.4em] uppercase">Connect</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-black font-tech leading-[0.85] tracking-tighter text-white uppercase">
                            Digital
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500"> Hub.</span>
                        </h2>
                    </motion.div>

                    <div className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest hidden md:block text-right">
                        Join the Movement <br />
                        Stay Updated
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto">
                    <SocialCard
                        platform="Instagram"
                        handle={{ name: 'CodeGladitor', link: 'https://www.instagram.com/codegladiator_/' }}
                    />
                    <SocialCard
                        platform="YouTube"
                        handle={{ name: 'CodesGladiator', link: 'https://www.youtube.com/@CodesGladiator' }}
                    />
                </div>
            </div>
        </section>
    );
};

export default Community;
