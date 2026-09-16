import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { FaTerminal, FaChevronDown } from 'react-icons/fa';

const ExperienceCard = ({ exp, index }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isMobileExpanded, setIsMobileExpanded] = useState(false);

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const renderDynamicIcon = (iconName, props = {}) => {
        const Icon = Lucide[iconName];
        return Icon ? <Icon {...props} /> : <Lucide.Briefcase {...props} />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full relative group bg-black/50"
        >
            {/* Node on the Rail - Hidden on Mobile */}
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 -left-[4rem] w-4 h-4 -ml-2 rounded-xl bg-black border-2 border-white/20 z-30 transition-all duration-500 group-hover:border-purple-500 group-hover:shadow-[0_0_15px_#a855f7] items-center justify-center">
                <div className={`w-1.5 h-1.5 rounded-xl ${exp.period === 'Present' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse' : 'bg-transparent group-hover:bg-purple-400'}`} />
            </div>

            {/* Horizontal Connector Line - Hidden on Mobile */}
            <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -left-[4rem] w-[4rem] h-[1px] bg-white/5 group-hover:bg-purple-500/50 transition-colors duration-500 z-20" />

            <div
                onMouseMove={handleMouseMove}
                className="relative w-full overflow-hidden rounded-xl transition-all duration-700 ease-out border bg-zinc-900/30 border-white/5 hover:bg-zinc-900/50 hover:border-white/10 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5)]"
            >


                {/* Left Accent Bar inside Card */}
                <div className="absolute top-0 bottom-0 left-0 w-1 z-20 h-full">
                    <div className={`w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${exp.accent} ${exp.color}`} />
                </div>

                {/* Massive Watermark Icon */}
                <div className={`absolute right-0 top-1/2 -translate-y-1/2 text-[30rem] md:text-[40rem] transition-all duration-1000 ease-out pointer-events-none flex items-center justify-center ${exp.color} opacity-[0.02] group-hover:opacity-[0.04] scale-90 group-hover:scale-100 rotate-12 group-hover:rotate-0`}>
                    {renderDynamicIcon(exp.iconName)}
                </div>

                <div className="relative z-20 p-8 md:p-12 lg:p-16 flex flex-col gap-12">

                    {/* Top Log Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
                        <div className="flex items-center gap-4">
                            <div className="flex gap-1.5">
                                <div className={`w-1.5 h-4 rounded-xl ${exp.accent} bg-opacity-80`} />
                                <div className={`w-1.5 h-4 rounded-xl ${exp.accent} bg-opacity-40`} />
                                <div className="w-1.5 h-4 rounded-xl bg-white/10" />
                            </div>
                            <span className={`text-3xl md:text-5xl font-black font-tech transition-colors duration-700 text-zinc-200`}>
                                0{index + 1}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/5 backdrop-blur-md">
                            <div className={`w-2 h-2 rounded-xl ${exp.period === 'Present' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981] animate-pulse' : 'bg-zinc-600'}`} />
                            <span className="text-[11px] font-bold text-zinc-300 tracking-widest uppercase">{exp.period}</span>
                        </div>
                    </div>

                    {/* Main Content Grid: Split into Left (Company/Role) and Right (Description) */}
                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 xl:gap-24">

                        {/* Left Side: Company, Role */}
                        <div className="xl:col-span-5 flex flex-col gap-6">
                            <div className="flex flex-col">
                                <h3 className={`text-3xl md:text-5xl font-black uppercase transition-colors duration-700 ${exp.color}`}>
                                    {exp.company}
                                </h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 mt-4">
                                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-3 rounded-xl border border-white/5">
                                    <FaTerminal className={`text-sm ${exp.color}`} />
                                    <span className="text-xs font-bold text-white uppercase tracking-[0.2em]">{exp.role}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                    Status // <span className="text-zinc-300">{exp.status}</span>
                                </span>
                            </div>
                        </div>

                        {/* Right Side: Always Visible Description on Desktop, Collapsible on Mobile */}
                        <div className="xl:col-span-7 flex flex-col gap-4 xl:gap-8">

                            {/* Mobile Toggle Button */}
                            <button
                                onClick={() => setIsMobileExpanded(!isMobileExpanded)}
                                className="xl:hidden flex items-center justify-between w-full bg-white/5 px-6 py-4 rounded-xl border border-white/5 text-zinc-300 font-bold uppercase tracking-widest text-xs"
                            >
                                Description
                                <FaChevronDown className={`transition-transform duration-300 ${isMobileExpanded ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Description Container */}
                            <motion.div
                                className="overflow-hidden xl:!h-auto xl:!opacity-100 xl:!mt-0 xl:!overflow-visible"
                                initial={false}
                                animate={{
                                    height: isMobileExpanded ? 'auto' : 0,
                                    opacity: isMobileExpanded ? 1 : 0,
                                    marginTop: isMobileExpanded ? '1rem' : 0
                                }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                            >
                                <div className="bg-black/20 backdrop-blur-md border border-white/5 rounded-xl p-6 md:p-10 shadow-2xl relative group-hover:bg-black/40 transition-colors duration-500">
                                    {/* Tech Decals */}
                                    <div className="absolute top-6 left-6 w-3 h-3 border-l-2 border-t-2 border-white/10" />
                                    <div className="absolute bottom-6 right-6 w-3 h-3 border-r-2 border-b-2 border-white/10" />

                                    <p className="text-zinc-300 leading-relaxed text-sm md:text-xl font-medium selection:bg-purple-500 selection:text-white">
                                        {exp.description}
                                    </p>
                                </div>
                            </motion.div>

                            <div className="flex items-center gap-3 mt-2 xl:mt-0">
                                <span className="text-[9px] font-bold text-zinc-500 tracking-[0.3em] uppercase">Tags:</span>
                                <span className="px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-zinc-400 border border-white/5 uppercase tracking-widest group-hover:border-white/10 group-hover:text-zinc-300 transition-all duration-300">
                                    {exp.tag}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const Experience = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'experiences'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setExperiences(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return null;

    return (
        <section id="experience" className="py-24 md:py-48 relative bg-black overflow-hidden" aria-label="Experience Section">
            {/* Soft Ambient Background matching About & Hero */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-purple-900/10 blur-[150px] mix-blend-screen" />
                <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/10 blur-[150px] mix-blend-screen" />
            </div>

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_60%,transparent_100%)] opacity-100 pointer-events-none" />

            {/* Changed from container max-w-6xl to w-full px-4 md:px-12 for Full Page Width */}
            <div className="w-full px-6 md:px-12 lg:px-20 relative z-10">

                {/* Section Header */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 md:mb-32 gap-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <span className="w-12 h-[1px] bg-gradient-to-r from-purple-500 to-transparent" />
                            <span className="text-[10px] font-bold text-purple-400 tracking-[0.4em] uppercase">Architecture//Timeline</span>
                        </div>
                        <h2 className="text-4xl sm:text-6xl font-black text-white uppercase">
                            Career
                            <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#e2e8f0,45%,#64748b,55%,#e2e8f0)] bg-[length:200%_auto]"> Matrix.</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="hidden lg:flex flex-col items-end gap-4 text-right"
                    >
                        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 shadow-2xl">
                            <div className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
                            </div>
                            <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-[0.2em]">System_Sync: Active</span>
                        </div>
                        <span className="text-[10px] font-bold text-zinc-500 tracking-[0.3em] uppercase px-2">Bhopal//India_Region</span>
                    </motion.div>
                </div>

                {/* Connected Rail + Cards Container */}
                <div className="relative w-full pl-0 md:pl-16 border-l-0 md:border-l-2 border-white/5">
                    {/* Animated Glow Rail - Hidden on Mobile */}
                    <motion.div
                        className="hidden md:block absolute left-[-2px] top-0 w-[2px] h-full bg-gradient-to-b from-purple-500 via-blue-500 to-transparent origin-top"
                        initial={{ scaleY: 0 }}
                        whileInView={{ scaleY: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 2.5, ease: [0.22, 1, 0.36, 1] }}
                    />

                    <div className="flex flex-col gap-10 md:gap-16 w-full">
                        {experiences.map((exp, index) => (
                            <ExperienceCard
                                key={exp.id}
                                index={index}
                                exp={exp}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Experience;