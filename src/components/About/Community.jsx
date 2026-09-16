import React from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { FaInstagram, FaYoutube, FaExternalLinkAlt, FaUsers } from 'react-icons/fa';

const SocialCard = ({ platform, handle, stats, subtitle }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const isInsta = platform === 'Instagram';
    const accentGradient = isInsta ? 'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]' : 'from-red-600 via-red-500 to-red-400';
    const hoverBorder = isInsta ? 'hover:border-pink-500/50' : 'hover:border-red-500/50';
    const iconColor = isInsta ? 'text-pink-500' : 'text-red-500';

    return (
        <motion.a
            href={handle.link}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleMouseMove}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className={`group relative flex flex-col justify-between p-8 md:p-12 h-full rounded-[2rem] bg-zinc-900/40 backdrop-blur-3xl border border-white/5 overflow-hidden transition-all duration-700 shadow-[0_20px_40px_rgba(0,0,0,0.5)] ${hoverBorder}`}
        >
            {/* Dynamic Spotlight */}
            <motion.div
                className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-500 z-10"
                style={{
                    background: useMotionTemplate`
                        radial-gradient(
                            600px circle at ${mouseX}px ${mouseY}px,
                            ${isInsta ? 'rgba(236, 72, 153, 0.15)' : 'rgba(239, 68, 68, 0.15)'},
                            transparent 70%
                        )
                    `,
                }}
            />

            {/* Ambient Background Blur */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${accentGradient} opacity-0 group-hover:opacity-20 blur-[80px] transition-opacity duration-700 -translate-y-1/2 translate-x-1/2`} />

            {/* Top Row: Icon & Link Indicator */}
            <div className="relative z-20 flex justify-between items-start mb-16">
                <div className={`p-5 rounded-2xl bg-black/50 border border-white/10 group-hover:scale-110 transition-transform duration-500 ${iconColor} shadow-xl backdrop-blur-md`}>
                    {platform === 'Instagram' ? <FaInstagram className="w-8 h-8" /> : <FaYoutube className="w-8 h-8" />}
                </div>
                <div className="p-3 rounded-full bg-white/5 border border-white/5 opacity-50 group-hover:opacity-100 group-hover:bg-white/10 transition-all duration-300">
                    <FaExternalLinkAlt className="text-white w-4 h-4" />
                </div>
            </div>

            {/* Bottom Content */}
            <div className="relative z-20 space-y-4">
                <div className="space-y-1">
                    <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
                        {platform}
                    </h3>
                    <p className="text-zinc-400 font-bold text-sm tracking-widest uppercase">
                        @{handle.name}
                    </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                        <FaUsers size={12} /> {subtitle}
                    </div>
                    <div className={`text-sm font-black ${iconColor} tracking-wider`}>
                        {stats}
                    </div>
                </div>
            </div>

            {/* Interactive Laser Border Line */}
            <div className={`absolute bottom-0 left-0 w-0 h-[2px] bg-gradient-to-r ${accentGradient} group-hover:w-full transition-all duration-1000 ease-out`} />
        </motion.a>
    );
};

const Community = () => {
    return (
        <section className="py-24 md:py-32 relative bg-black overflow-hidden" aria-label="Community Section">
            {/* Soft Ambient Background matching About & Hero */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[30%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-purple-900/10 blur-[120px] mix-blend-screen" />
            </div>

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,#000_60%,transparent_100%)] opacity-40" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <span className="w-12 h-[1px] bg-gradient-to-r from-purple-500 to-transparent" />
                            <span className="text-[10px] font-bold text-purple-400 tracking-[0.4em] uppercase">Community</span>
                        </div>
                        <h2 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                            Digital
                            <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#e2e8f0,45%,#64748b,55%,#e2e8f0)] bg-[length:200%_auto] animate-[shimmer_3s_infinite]"> Hub.</span>
                        </h2>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="text-zinc-500 font-bold text-[10px] uppercase tracking-[0.3em] hidden md:block text-right"
                    >
                        Join the Movement <br />
                        <span className="text-zinc-300">Stay Updated</span>
                    </motion.div>
                </div>

                {/* Cards Grid */}
                <div className="grid md:grid-cols-2 gap-8 lg:gap-16 max-w-5xl mx-auto">
                    <SocialCard
                        platform="Instagram"
                        handle={{ name: 'CodeGladitor', link: 'https://www.instagram.com/codegladiator_/' }}
                        stats="Join Now"
                        subtitle="Daily Insights"
                    />
                    <SocialCard
                        platform="YouTube"
                        handle={{ name: 'CodesGladiator', link: 'https://www.youtube.com/@CodesGladiator' }}
                        stats="Watch Videos"
                        subtitle="Video Content"
                    />
                </div>
            </div>
        </section>
    );
};

export default Community;
