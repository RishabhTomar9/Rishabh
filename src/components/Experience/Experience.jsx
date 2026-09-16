import React, { useState, useRef, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { FaTerminal, FaChevronDown } from 'react-icons/fa';

const ExperienceCard = ({ exp, index, expandedId, setExpandedId }) => {
    const cardRef = useRef(null);
    const isExpanded = expandedId === exp.id;

    const renderDynamicIcon = (iconName, props = {}) => {
        const Icon = Lucide[iconName];
        return Icon ? <Icon {...props} /> : <Lucide.Briefcase {...props} />;
    };

    return (
        <motion.div
            ref={cardRef}
            className={`relative flex flex-col md:flex-row items-center gap-12 md:gap-32 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            onViewportLeave={() => {
                if (isExpanded) {
                    setExpandedId(null);
                }
            }}
            viewport={{ amount: 0.2 }}
        >

            {/* Timeline Node */}
            <div className="absolute left-4 md:left-1/2 w-10 h-10 -ml-5 md:-ml-5 z-30 flex items-center justify-center top-0 md:top-1/2 md:-translate-y-1/2 group">
                <div className="absolute inset-0 bg-purple-500/5 blur-xl transition-all duration-700" />
                <motion.div
                    className={`w-5 h-5 rounded-sm bg-zinc-950 border border-white/20 flex items-center justify-center transition-all duration-300 ${isExpanded ? 'border-purple-500 rotate-45' : 'rotate-0'}`}
                    initial={{ scale: 0, rotate: 0 }}
                    whileInView={{ scale: 1, rotate: isExpanded ? 45 : 0 }}
                    viewport={{ once: true }}
                >
                    <div className={`w-1.5 h-1.5 rounded-xl ${exp.period === 'Present' ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-600 transition-colors'} ${isExpanded ? 'bg-purple-400' : ''}`} />
                </motion.div>
            </div>

            {/* Content Card */}
            <motion.div
                className="pl-12 md:pl-0 w-full md:w-[calc(50%-100px)]"
                initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
            >
                <div
                    className="group relative cursor-pointer"
                    onMouseEnter={() => !('ontouchstart' in window) && setExpandedId(exp.id)}
                    onMouseLeave={() => !('ontouchstart' in window) && setExpandedId(null)}
                    onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                >
                    {/* Background Ghost Number */}
                    <div className={`absolute -z-10 top-1/2 -translate-y-1/2 text-[10rem] font-black text-white/[0.02] left-[-3rem] pointer-events-none select-none transition-colors leading-none ${isExpanded ? 'text-purple-500/[0.03]' : ''}`}>
                        0{index + 1}
                    </div>

                    <div className={`relative bg-[#080808] border transition-all duration-700 rounded-xl shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden ${isExpanded ? 'bg-[#0c0c0c] border-purple-500/40' : 'bg-[#060606] border-white/5'} p-6 md:p-10 `}>

                        {/* Glow Hover Layer */}
                        <div className={`absolute inset-0 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_50%_-20%,rgba(168,85,247,0.1),transparent_70%)] ${isExpanded ? 'opacity-100' : 'opacity-0'}`} />

                        {/* Watermark/Background Icon */}
                        <div className={`absolute -right-8 -bottom-8 text-[12rem] md:text-[18rem] transition-all duration-700 pointer-events-none flex items-center justify-center ${exp.color} rotate-12 ${isExpanded ? 'opacity-[0.05]' : 'opacity-[0.02]'}`}>
                            {renderDynamicIcon(exp.iconName)}
                        </div>

                        {/* Top Metadata Header bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-5 border-b border-white/5 relative z-10 gap-4 md:gap-0">
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                    <div className={`w-1 h-3 rounded-xl ${exp.accent} bg-opacity-80`} />
                                    <div className={`w-1 h-3 rounded-xl ${exp.accent} bg-opacity-40`} />
                                    <div className="w-1 h-3 rounded-xl bg-zinc-800" />
                                </div>
                                <span className="text-[10px] font-black text-zinc-600 tracking-[0.3em] uppercase">VERIFIED_LOG_00{index + 1}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className={`w-1.5 h-1.5 rounded-xl ${exp.period === 'Present' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-zinc-800'}`} />
                                <span className="text-[10px] font-black text-zinc-700 tracking-widest uppercase transition-colors">{exp.period}</span>
                            </div>
                        </div>

                        {/* Company & Core Info - ALWAYS VISIBLE */}
                        <div className="group/header relative z-10">
                            <div className="w-full">
                                <h3 className={`text-2xl md:text-5xl font-black text-white leading-[0.9] tracking-tighter uppercase italic transition-all duration-700 break-words ${isExpanded ? exp.color : ''}`}>
                                    {exp.company}
                                </h3>

                                <div className="flex flex-col md:flex-row md:items-center gap-4 mt-6">
                                    <div className="flex items-center gap-4">
                                        <FaTerminal className={`text-[12px] ${exp.color} opacity-80`} />
                                        <span className="text-[11px] font-black text-white uppercase tracking-[0.3em] font-tech">{exp.role}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-[1px] w-8 bg-white/10 hidden md:block" />
                                        <span className="px-3 py-1 bg-white/5 rounded-md text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                            {exp.tag}
                                        </span>
                                    </div>
                                </div>

                                <AnimatePresence initial={false}>
                                    {isExpanded ? (
                                        <motion.div
                                            key="description"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                            className="overflow-hidden"
                                        >
                                            {/* Technical Description Content ONLY */}
                                            <div className="relative mt-8 mb-10 bg-zinc-950/60 border border-white/5 rounded-xl p-6 md:p-8 z-10 shadow-2xl">
                                                {/* Industrial Corner Decals */}
                                                <div className="absolute top-4 left-4 w-2 h-2 border-l-2 border-t-2 border-zinc-900" />
                                                <div className="absolute bottom-4 right-4 w-2 h-2 border-r-2 border-b-2 border-zinc-900" />

                                                <p className="text-zinc-500 leading-relaxed text-sm md:text-base font-bold transition-colors selection:bg-purple-500 selection:text-white">
                                                    {exp.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="expand-prompt"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="mt-8 mb-4 flex items-center gap-3 text-[9px] font-black text-zinc-700 uppercase tracking-widest"
                                        >
                                            <div className="flex gap-1">
                                                <div className="w-1 h-1 bg-zinc-800 rounded-xl animate-bounce" />
                                                <div className="w-1 h-1 bg-zinc-800 rounded-xl animate-bounce [animation-delay:0.2s]" />
                                                <div className="w-1 h-1 bg-zinc-800 rounded-xl animate-bounce [animation-delay:0.4s]" />
                                            </div>
                                            <span className="group-hover:text-zinc-500 transition-colors">Analyze Log Entry // Expand Dossier</span>
                                            <FaChevronDown className="animate-bounce" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Professional Status Bar - ALWAYS VISIBLE */}
                                <div className="flex items-center justify-between pt-8 border-t border-white/5 relative z-10 transition-all duration-500">
                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col">                                            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-xl bg-black border border-white/5 transition-all ${exp.period === 'Present' ? 'text-emerald-500' : 'text-zinc-600'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-xl ${exp.period === 'Present' ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-zinc-800'}`} />
                                            <span className="text-[9px] font-black uppercase tracking-[0.1em]">{exp.status}</span>
                                        </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end">
                                        <div className={`font-tech text-3xl font-black tracking-tighter transition-all duration-500 italic ${isExpanded ? exp.color : 'text-zinc-800'}`}>
                                            #0{index + 1}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Border Pulse Effect */}
                        <div className={`absolute inset-0 pointer-events-none rounded-xl transition-opacity duration-700 ${isExpanded ? 'opacity-50' : 'opacity-0'}`}>
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent" />
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Neutral Spacer */}
            <div className="hidden md:block w-[calc(50%-100px)]" />
        </motion.div>
    );
};

const Experience = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);

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
        <section id="experience" className="py-24 lg:py-48 relative bg-[#050505] overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:40px_40px]" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 lg:mb-40 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-10 h-[2px] bg-purple-500 shadow-[0_0_10px_#a855f7]" />
                            <span className="text-[10px] font-black text-purple-400 tracking-[0.5em] uppercase">Architecture//Timeline</span>
                        </div>
                        <h2 className="text-6xl md:text-8xl font-black font-tech leading-[0.8] tracking-tighter text-white uppercase italic">
                            Career
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-600 block sm:inline sm:ml-4">Matrix.</span>
                        </h2>
                    </motion.div>

                    <div className="hidden md:flex flex-col items-end gap-3 text-right">
                        <div className="flex items-center gap-2 px-4 py-1.5 rounded-sm bg-zinc-900 border border-white/5 uppercase font-black text-[9px] tracking-widest text-zinc-500">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-xl animate-pulse shadow-[0_0_8px_#10b981]" />
                            System_Sync: Active
                        </div>
                        <span className="text-[8px] font-black text-zinc-700 tracking-[0.3em] uppercase">Bhopal//India_Region</span>
                    </div>
                </div>

                <div className="relative  mx-auto">
                    {/* Central High-Tech Rail */}
                    <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-[1px] md:-translate-x-1/2 bg-zinc-900">
                        <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent,transparent_10px,#a855f710_10px,#a855f720_12px)]" />
                        <motion.div
                            className="absolute top-0 w-full h-full bg-gradient-to-b from-purple-500 via-blue-500 to-transparent origin-top"
                            initial={{ scaleY: 0 }}
                            whileInView={{ scaleY: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2.5, ease: [0.23, 1, 0.32, 1] }}
                        />
                    </div>

                    <div className="space-y-16 md:space-y-48">
                        {experiences.map((exp, index) => (
                            <ExperienceCard
                                key={exp.id}
                                index={index}
                                exp={exp}
                                expandedId={expandedId}
                                setExpandedId={setExpandedId}
                            />
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(100%); }
                }
                .animate-scan {
                    animation: scan 2.5s cubic-bezier(0.33, 1, 0.68, 1) infinite;
                }
            `}</style>
        </section>
    );
};

export default Experience;