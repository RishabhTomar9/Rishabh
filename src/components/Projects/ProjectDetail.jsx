import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaArrowLeft, FaExternalLinkAlt, FaGithub, FaCode, FaDesktop, FaInfoCircle, FaTabletAlt, FaMobileAlt, FaTimes, FaSpinner, FaLock, FaSyncAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'preview'
    const [previewSize, setPreviewSize] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
    
    // Phase 2 States
    const [iframeLoading, setIframeLoading] = useState(true);
    const [lightboxIndex, setLightboxIndex] = useState(null);
    const [orientation, setOrientation] = useState('portrait'); // 'portrait' | 'landscape'
    const [refreshKey, setRefreshKey] = useState(0);

    // Keyboard navigation for Lightbox
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (lightboxIndex === null || !project?.gallery) return;
            if (e.key === 'ArrowRight') {
                setLightboxIndex((prev) => (prev < project.gallery.length - 1 ? prev + 1 : 0));
            } else if (e.key === 'ArrowLeft') {
                setLightboxIndex((prev) => (prev > 0 ? prev - 1 : project.gallery.length - 1));
            } else if (e.key === 'Escape') {
                setLightboxIndex(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, project]);

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;
            try {
                const docRef = doc(db, 'projects', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.status === 'Archived') {
                        navigate('/projects');
                        return;
                    }
                    setProject({ id: docSnap.id, ...data });
                } else {
                    console.error("No such document!");
                    navigate('/projects');
                }
            } catch (error) {
                console.error("Error getting document:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin shadow-[0_0_30px_rgba(168,85,247,0.3)]" />
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-[10px] text-purple-400 animate-pulse tracking-widest">SYS</div>
                </div>
            </div>
        );
    }

    if (!project) return null;

    // Helper to calculate responsive dimensions based on orientation
    const getContainerClasses = () => {
        if (previewSize === 'desktop') {
            return 'w-[1728px] max-w-full h-[1080px] max-h-full';
        }
        if (previewSize === 'tablet') {
            return orientation === 'portrait' 
                ? 'w-[1024px] max-w-full h-[1366px] max-h-full'
                : 'w-[1366px] max-w-full h-[1024px] max-h-full';
        }
        // mobile
        return orientation === 'portrait'
            ? 'w-[412px] max-w-full h-[915px] max-h-full'
            : 'w-[915px] max-w-full h-[412px] max-h-full';
    };

    return (
        <section className="min-h-screen bg-black relative overflow-x-hidden pt-32 pb-32">
            {/* Cinematic Header Background */}
            <div className="absolute top-0 left-0 w-full h-[50vh] pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black z-10" />
                {project.media && (
                    <motion.img
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.4, scale: 1 }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        src={project.media}
                        alt="Background"
                        className="w-full h-full object-cover blur-3xl saturate-200"
                    />
                )}
            </div>

            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

            <div className="w-full px-6 md:px-12 lg:px-20 relative z-20">
                
                {/* Main Header / Navigation */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20 relative">
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="max-w-4xl"
                    >
                        <button
                            onClick={() => navigate(-1)}
                            className="group flex items-center gap-4 text-zinc-400 hover:text-white transition-colors mb-10 w-fit"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:border-purple-500/50 transition-all backdrop-blur-md shadow-xl group-hover:shadow-purple-500/20">
                                <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform text-purple-400" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Return to Archives</span>
                        </button>
                        <h1 className="text-5xl md:text-7xl font-black text-white font-tech uppercase tracking-tight">
                            <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#fff,45%,#a855f7,55%,#fff)] bg-[length:200%_auto] animate-[shimmer_3s_infinite]">{project.title}.</span>
                        </h1>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} 
                        animate={{ opacity: 1, scale: 1 }} 
                        transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col items-start lg:items-end gap-6"
                    >
                        {/* Segmented Control */}
                        <div className="flex items-center bg-zinc-900/80 p-1.5 rounded-2xl border border-white/10 backdrop-blur-2xl shadow-2xl relative">
                            {['overview', 'preview'].map((mode) => (
                                <button
                                    key={mode}
                                    onClick={() => setViewMode(mode)}
                                    className={`relative z-10 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-colors flex items-center gap-3 ${viewMode === mode ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                    {viewMode === mode && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-white/10 border border-white/20 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-20 flex items-center gap-2">
                                        {mode === 'overview' ? <FaInfoCircle className="text-sm" /> : <FaDesktop className="text-sm" />} 
                                        {mode}
                                    </span>
                                </button>
                            ))}
                        </div>
                        
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/40 backdrop-blur-xl border border-white/10 text-zinc-400 font-bold text-[9px] uppercase tracking-[0.3em] shadow-xl">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                            Archive_ID // {project.id ? project.id.slice(0, 8) : '00000001'}
                        </div>
                    </motion.div>
                </div>

                <AnimatePresence mode="wait">
                    {viewMode === 'overview' ? (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-16"
                        >
                            {/* Main Bento Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Large Visual Box */}
                                <div className="lg:col-span-8 relative aspect-video rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] group bg-zinc-950">
                                    <img
                                        src={project.media}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-90 group-hover:opacity-100 ease-[0.16,1,0.3,1]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

                                    <div className="absolute bottom-8 left-8 right-8 z-20">
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 bg-white text-black py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-zinc-200 transition-transform active:scale-95 shadow-xl hover:shadow-2xl"
                                            >
                                                <FaExternalLinkAlt /> Open Live Site
                                            </a>
                                            <a
                                                href={project.github || "https://github.com/RishabhTomar9"}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 bg-black/50 backdrop-blur-xl border border-white/10 text-white py-4 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-black/70 transition-transform active:scale-95 hover:border-white/30"
                                            >
                                                <FaGithub className="text-sm" /> Source Code
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Detail Boxes */}
                                <div className="lg:col-span-4 flex flex-col gap-8 h-full">
                                    <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden flex-1 group hover:border-purple-500/30 transition-colors">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                            <FaInfoCircle className="text-purple-400" /> Project Brief
                                        </h3>
                                        <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-medium">
                                            {project.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-6 bg-zinc-900/40 border border-white/10 rounded-[2rem] backdrop-blur-md shadow-xl flex flex-col justify-center items-center text-center">
                                            <div className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2">Role</div>
                                            <div className="text-white text-lg font-black tracking-tight">Full Stack</div>
                                        </div>
                                        <div className="p-6 bg-zinc-900/40 border border-white/10 rounded-[2rem] backdrop-blur-md shadow-xl flex flex-col justify-center items-center text-center">
                                            <div className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] mb-2">Year</div>
                                            <div className="text-white text-lg font-black tracking-tight">
                                                {project.createdAt?.toDate ? new Date(project.createdAt.toDate()).getFullYear() : '2024'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Tech Stack Bento */}
                            <div className="bg-zinc-900/40 border border-white/10 rounded-[2rem] p-8 md:p-12 backdrop-blur-3xl shadow-2xl w-full relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 opacity-50 pointer-events-none" />
                                <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em] mb-8 flex items-center gap-3 relative z-10">
                                    <FaCode className="text-purple-500 text-sm" /> Technology Stack
                                </h3>
                                <div className="flex flex-wrap gap-3 relative z-10">
                                    {(Array.isArray(project.technologies) ? project.technologies : project.technologies?.split(',') || []).map((tech, i) => (
                                        <span key={i} className="px-5 py-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-xl text-zinc-300 text-[11px] font-black uppercase tracking-[0.2em] hover:bg-purple-500/20 hover:border-purple-500/50 hover:text-white transition-all cursor-default shadow-lg hover:shadow-purple-500/20">
                                            {tech.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Masonry Gallery */}
                            {project.gallery && project.gallery.length > 0 && (
                                <div className="w-full">
                                    <div className="flex items-center gap-4 mb-10">
                                        <span className="w-12 h-[1px] bg-gradient-to-r from-purple-500 to-transparent" />
                                        <h3 className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em]">Visual Gallery</h3>
                                        <span className="h-[1px] flex-grow bg-gradient-to-r from-purple-500/20 to-transparent" />
                                    </div>
                                    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
                                        {project.gallery.map((img, i) => (
                                            <motion.div 
                                                key={i} 
                                                className="break-inside-avoid relative group rounded-xl overflow-hidden border border-white/10 bg-zinc-950 shadow-[0_30px_60px_rgba(0,0,0,0.5)] cursor-zoom-in"
                                                initial={{ opacity: 0, y: 30 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true, margin: "-100px" }}
                                                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                                whileHover={{ scale: 0.98 }}
                                                onClick={() => setLightboxIndex(i)}
                                            >
                                                <img 
                                                    src={img} 
                                                    alt={`Gallery image ${i + 1}`}
                                                    className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-[0.16,1,0.3,1]"
                                                    loading="lazy"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-6">
                                                    <span className="text-white text-[10px] font-bold uppercase tracking-[0.2em] transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">View Fullscreen</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="h-[calc(100vh)] w-full flex flex-col items-center justify-center relative overflow-hidden p-6 pt-24"
                        >
                            {/* Device Toggles */}
                            <div className="absolute top-6 z-30 flex items-center bg-black/80 backdrop-blur-2xl px-3 py-2 rounded-xl border border-white/10 shadow-2xl">
                                <div className="flex gap-2">
                                    <button onClick={() => setPreviewSize('desktop')} className={`p-3 rounded-xl transition-all ${previewSize === 'desktop' ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-zinc-500 hover:text-white hover:bg-white/10 border border-transparent'}`} title="Desktop View"><FaDesktop className="text-sm" /></button>
                                    <button onClick={() => setPreviewSize('tablet')} className={`p-3 rounded-xl transition-all ${previewSize === 'tablet' ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-zinc-500 hover:text-white hover:bg-white/10 border border-transparent'}`} title="Tablet View"><FaTabletAlt className="text-sm" /></button>
                                    <button onClick={() => setPreviewSize('mobile')} className={`p-3 rounded-xl transition-all ${previewSize === 'mobile' ? 'bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-zinc-500 hover:text-white hover:bg-white/10 border border-transparent'}`} title="Mobile View"><FaMobileAlt className="text-sm" /></button>
                                </div>
                                
                                {/* Orientation Toggle (Only on mobile/tablet) */}
                                {previewSize !== 'desktop' && (
                                    <div className="flex items-center ml-4 pl-4 border-l border-white/10">
                                        <button 
                                            onClick={() => setOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')} 
                                            className="p-3 rounded-xl transition-all text-zinc-400 hover:text-white hover:bg-white/10" 
                                            title="Rotate Device"
                                        >
                                            <FaSyncAlt className={`text-sm transition-transform duration-300 ${orientation === 'landscape' ? 'rotate-90' : ''}`} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Responsive Container */}
                            <motion.div 
                                layout
                                className={`bg-zinc-950 rounded-xl border border-white/10 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.8)] flex flex-col transition-all duration-700 ease-[0.16,1,0.3,1] relative ${getContainerClasses()}`}
                            >
                                {/* Browser Bar */}
                                <div className="h-14 bg-[#09090b] border-b border-white/5 flex items-center justify-between px-6 shrink-0 z-20">
                                    <div className="flex gap-2">
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] border border-[#ff5f56]/50" />
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] border border-[#ffbd2e]/50" />
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] border border-[#27c93f]/50" />
                                    </div>
                                    
                                    {/* URL Bar */}
                                    <div className="flex-1 max-w-xl mx-6 bg-black/60 h-9 rounded-xl border border-white/5 flex items-center px-4 text-[10px] uppercase tracking-widest text-zinc-500 font-bold relative group shadow-inner">
                                        <FaLock className="text-emerald-500/80 mr-3 text-xs" />
                                        <span className="truncate w-full text-left group-hover:text-zinc-400 transition-colors">{project.link}</span>
                                        <button 
                                            onClick={() => {
                                                setIframeLoading(true);
                                                setRefreshKey(prev => prev + 1);
                                            }}
                                            className="ml-4 text-zinc-500 hover:text-white transition-colors"
                                            title="Reload Environment"
                                        >
                                            <FaSyncAlt className="text-xs" />
                                        </button>
                                    </div>

                                    <div className="flex gap-4">
                                        <a href={project.link} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors" title="Open in New Tab">
                                            <FaExternalLinkAlt className="text-sm" />
                                        </a>
                                    </div>
                                </div>

                                {/* Iframe Preview */}
                                <div className="flex-1 relative bg-white overflow-hidden">
                                    {/* Skeleton Loader */}
                                    <AnimatePresence>
                                        {iframeLoading && (
                                            <motion.div 
                                                initial={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.5 }}
                                                className="absolute inset-0 bg-zinc-900 z-10 flex flex-col items-center justify-center gap-4"
                                            >
                                                <FaSpinner className="text-purple-500 text-3xl animate-spin" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 animate-pulse">Initializing Environment</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="absolute inset-0 overflow-y-auto w-full h-full [-webkit-overflow-scrolling:touch]">
                                        <iframe
                                            key={refreshKey}
                                            src={project.link}
                                            title={project.title}
                                            onLoad={() => setIframeLoading(false)}
                                            className="w-full h-full border-0 bg-white"
                                            sandbox="allow-scripts allow-same-origin allow-forms"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Lightbox Modal */}
                <AnimatePresence>
                    {lightboxIndex !== null && project.gallery && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-3xl p-4 md:p-10"
                            onClick={() => setLightboxIndex(null)}
                        >
                            {/* Top UI */}
                            <div className="absolute top-8 left-0 w-full px-8 flex justify-between items-center z-50 pointer-events-none">
                                <div className="bg-black/50 backdrop-blur-xl px-6 py-3 rounded-2xl border border-white/10 text-zinc-300 font-bold tracking-[0.3em] text-[10px] uppercase shadow-2xl flex items-center gap-3">
                                    <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                                    Image {lightboxIndex + 1} of {project.gallery.length}
                                </div>
                                <button 
                                    className="w-14 h-14 bg-white/5 hover:bg-red-500/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-xl transition-all border border-white/10 hover:border-red-500/50 pointer-events-auto"
                                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
                                >
                                    <FaTimes className="text-xl" />
                                </button>
                            </div>

                            {/* Prev / Next Buttons */}
                            <button 
                                className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 w-16 h-16 bg-black/40 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-xl transition-all border border-white/10 z-50 group pointer-events-auto"
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setLightboxIndex((prev) => (prev > 0 ? prev - 1 : project.gallery.length - 1)); 
                                }}
                            >
                                <FaChevronLeft className="text-2xl group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button 
                                className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 w-16 h-16 bg-black/40 hover:bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-xl transition-all border border-white/10 z-50 group pointer-events-auto"
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setLightboxIndex((prev) => (prev < project.gallery.length - 1 ? prev + 1 : 0)); 
                                }}
                            >
                                <FaChevronRight className="text-2xl group-hover:translate-x-1 transition-transform" />
                            </button>

                            {/* Image */}
                            <motion.img 
                                key={lightboxIndex}
                                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95, x: -20 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                src={project.gallery[lightboxIndex]} 
                                alt="Expanded view" 
                                className="max-w-[90vw] max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/5 cursor-default pointer-events-auto"
                                onClick={(e) => e.stopPropagation()} 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </section>
    );
};

export default ProjectDetail;
