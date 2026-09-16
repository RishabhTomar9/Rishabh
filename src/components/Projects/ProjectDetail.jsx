import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { FaArrowLeft, FaExternalLinkAlt, FaGithub, FaCode, FaDesktop, FaInfoCircle } from 'react-icons/fa';

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState('overview'); // 'overview' | 'preview'

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
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-xl animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-[10px] font-bold text-purple-500 animate-pulse">LOAD</div>
                </div>
            </div>
        );
    }

    if (!project) return null;

    return (
        <section className="min-h-screen bg-[#050505] relative overflow-hidden pt-24 pb-20">
            {/* Background Grid & Spotlights */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="container mx-auto px-4 md:px-6 relative z-10 ">
                {/* Navigation Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="group flex items-center gap-3 text-zinc-400 hover:text-white transition-colors"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-purple-500/20 group-hover:border-purple-500/30 transition-all">
                            <FaArrowLeft className="text-sm group-hover:-translate-x-1 transition-transform" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-wider">Back to Archives</span>
                    </button> //

                    <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-white/10 backdrop-blur-md shadow-2xl">
                        <button
                            onClick={() => setViewMode('overview')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${viewMode === 'overview' ? 'bg-zinc-800 text-white shadow-lg border border-white/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                        >
                            <FaInfoCircle /> Overview
                        </button>
                        <button
                            onClick={() => setViewMode('preview')}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${viewMode === 'preview' ? 'bg-zinc-800 text-white shadow-lg border border-white/10' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                        >
                            <FaDesktop /> Live Preview
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {viewMode === 'overview' ? (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.98 }}
                            transition={{ duration: 0.4 }}
                            className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20"
                        >
                            {/* Left Column: Visuals */}
                            <div className="space-y-8">
                                <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-purple-900/10 group bg-zinc-900">
                                    <img
                                        src={project.media}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-80" />

                                    <div className="absolute bottom-6 left-6 right-6 z-20">
                                        <div className="flex gap-3">
                                            <a
                                                href={project.link}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 bg-white text-black py-3 rounded-xl font-bold uppercase tracking-wider text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10"
                                            >
                                                <FaExternalLinkAlt /> Open Live Site
                                            </a>
                                            <a
                                                href="https://github.com/RishabhTomar9"
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex-1 bg-black/60 backdrop-blur-md border border-white/10 text-white py-3 rounded-xl font-bold uppercase tracking-wider text-[10px] md:text-xs flex items-center justify-center gap-2 hover:bg-black/80 transition-colors hover:border-white/20"
                                            >
                                                <FaGithub /> Source Code
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Tech Stack Grid */}
                                <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-6 md:p-8 backdrop-blur-sm">
                                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                                        <FaCode className="text-purple-500" /> Technology Stack
                                    </h3>
                                    <div className="flex flex-wrap gap-2">
                                        {project.technologies?.map((tech, i) => (
                                            <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-xl text-zinc-300 text-[10px] md:text-xs font-bold uppercase tracking-wider hover:bg-purple-500/10 hover:border-purple-500/20 hover:text-purple-300 transition-all cursor-default">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Details */}
                            <div className="flex flex-col justify-center">
                                <div className="mb-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-[10px] uppercase tracking-widest">
                                        <span className="w-1.5 h-1.5 rounded-xl bg-purple-500 animate-pulse" />
                                        Project Archive // {project.id ? project.id.slice(0, 6) : '001'}
                                    </div>
                                </div>
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white font-tech uppercase leading-[0.85] mb-8 tracking-tighter">
                                    {project.title}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-tr from-purple-500 to-blue-500">.</span>
                                </h1>

                                <p className="text-zinc-400 text-base md:text-lg leading-relaxed mb-10 border-l-2 border-white/10 pl-6">
                                    {project.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 md:gap-6">
                                    <div className="p-5 bg-zinc-900/40 border border-white/5 rounded-xl backdrop-blur-sm hover:border-white/10 transition-colors group">
                                        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-purple-400 transition-colors">Role</div>
                                        <div className="text-white text-lg md:text-xl font-bold">Full Stack Dev</div>
                                    </div>
                                    <div className="p-5 bg-zinc-900/40 border border-white/5 rounded-xl backdrop-blur-sm hover:border-white/10 transition-colors group">
                                        <div className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2 group-hover:text-blue-400 transition-colors">Year</div>
                                        <div className="text-white text-lg md:text-xl font-bold">
                                            {project.createdAt?.toDate ? new Date(project.createdAt.toDate()).getFullYear() : '2024'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="preview"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.4 }}
                            className="h-[calc(100vh-200px)] w-full bg-zinc-950 rounded-xl border border-white/10 overflow-hidden relative shadow-2xl flex flex-col"
                        >
                            {/* Browser Bar */}
                            <div className="h-12 bg-[#09090b] border-b border-white/5 flex items-center px-4 gap-4 shrink-0">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-xl bg-[#ff5f56] border border-[#ff5f56]/50" />
                                    <div className="w-3 h-3 rounded-xl bg-[#ffbd2e] border border-[#ffbd2e]/50" />
                                    <div className="w-3 h-3 rounded-xl bg-[#27c93f] border border-[#27c93f]/50" />
                                </div>
                                <div className="flex-1 max-w-2xl mx-auto bg-black/50 h-8 rounded-xl border border-white/5 flex items-center px-4 text-[10px] text-zinc-500 font-bold relative group">
                                    <span className="truncate w-full text-center group-hover:text-zinc-400 transition-colors">{project.link}</span>
                                    <a href={project.link} target="_blank" rel="noreferrer" className="absolute right-2 text-zinc-500 hover:text-white transition-colors">
                                        <FaExternalLinkAlt />
                                    </a>
                                </div>
                                <div className="w-16" /> {/* Spacer for centering */}
                            </div>

                            {/* Iframe Preview */}
                            <div className="flex-1 relative bg-white">
                                <iframe
                                    src={project.link}
                                    title={project.title}
                                    className="absolute inset-0 w-full h-full border-0"
                                    sandbox="allow-scripts allow-same-origin allow-forms" // Relaxed sandbox for better compatibility
                                    loading="lazy"
                                />
                                {/* Overlay if iframe fails to load X-Frame-Options or similar (Visual Hint) */}
                                <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center bg-zinc-900/50 backdrop-blur-[2px] opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-auto z-10">
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="bg-white text-black px-6 py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-xl transform hover:scale-105 transition-all flex items-center gap-2"
                                    >
                                        <FaExternalLinkAlt /> Open in New Tab
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
};

export default ProjectDetail;
