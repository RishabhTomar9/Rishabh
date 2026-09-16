import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import {
    Plus, Edit3, Trash2, Save, X, ExternalLink, Code2, Pin, Image,
    Search, Filter, Layout, Box, Braces, Rocket, Shield, Eye,
    ArrowRight, Copy, Check, Info, Briefcase, Globe, Github, Monitor, Archive,
    MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './ImageUpload';

const ProjectManager = () => {
    const [projects, setProjects] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState({
        title: '',
        description: '',
        link: '',
        github: '',
        media: '',
        gallery: [],
        technologies: '',
        pinned: false,
        category: 'Web',
        status: 'Production'
    });
    const [loading, setLoading] = useState(false);
    const [copySuccess, setCopySuccess] = useState(null);

    // Search and Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [showArchived, setShowArchived] = useState(false);

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState(null);
    const [activeActionMenu, setActiveActionMenu] = useState(null); // ID of project with open menu

    const categories = ['Web', 'Mobile', 'App', 'AI', 'Game', 'UI/UX'];
    const statuses = ['Production', 'Beta', 'Development', 'Archived'];

    useEffect(() => {
        const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Pinning logic handled in display
            setProjects(projectsData);
        });
        return () => unsubscribe();
    }, []);

    const filteredProjects = useMemo(() => {
        return projects
            .filter(p => {
                const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.description.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesCategory = filterCategory === 'All' || p.category === filterCategory;
                const matchesArchive = showArchived ? true : p.status !== 'Archived';
                return matchesSearch && matchesCategory && matchesArchive;
            })
            .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    }, [projects, searchTerm, filterCategory, showArchived]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentProject({ ...currentProject, [name]: value });
    };

    const togglePin = async (project) => {
        try {
            await updateDoc(doc(db, 'projects', project.id), {
                pinned: !project.pinned
            });
        } catch (error) {
            console.error("Error updating pin status:", error);
        }
    };

    const toggleArchive = async (project) => {
        try {
            const newStatus = project.status === 'Archived' ? 'Production' : 'Archived';
            await updateDoc(doc(db, 'projects', project.id), {
                status: newStatus,
                pinned: false // Unpin if archiving
            });
        } catch (error) {
            console.error("Error updating archive status:", error);
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(id);
        setTimeout(() => setCopySuccess(null), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const technologiesArray = typeof currentProject.technologies === 'string'
                ? currentProject.technologies.split(',').map(tech => tech.trim()).filter(t => t)
                : currentProject.technologies;

            const projectData = {
                ...currentProject,
                technologies: technologiesArray,
                pinned: currentProject.pinned || false,
                updatedAt: serverTimestamp(),
                createdAt: currentProject.createdAt || serverTimestamp()
            };

            if (currentProject.id) {
                await updateDoc(doc(db, 'projects', currentProject.id), projectData);
            } else {
                await addDoc(collection(db, 'projects'), projectData);
            }

            setCurrentProject({
                title: '',
                description: '',
                link: '',
                github: '',
                media: '',
                gallery: [],
                technologies: '',
                pinned: false,
                category: 'Web',
                status: 'Production'
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving project: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (project) => {
        setCurrentProject({
            ...project,
            technologies: Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies,
            category: project.category || 'Web',
            status: project.status || 'Production',
            gallery: project.gallery || []
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (project) => {
        setProjectToDelete(project);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (projectToDelete) {
            try {
                await deleteDoc(doc(db, 'projects', projectToDelete.id));
                setIsDeleteModalOpen(false);
                setProjectToDelete(null);
            } catch (error) {
                console.error("Error deleting project: ", error);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 md:space-y-12 relative pb-20"
        >
            {/* Header / Stats Node */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 border-b border-white/5 pb-8">
                <div>
                    <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter flex items-center gap-4">
                        <Box className="w-10 h-10 text-purple-500" />
                        PROJECT NEXUS
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 px-3 py-1 rounded-xl border border-purple-500/20 font-bold tracking-widest uppercase">
                            Secure Node
                        </span>
                    </h2>
                    <p className="text-zinc-500 text-xs uppercase tracking-[0.3em] mt-2 font-bold ml-14">Management & Deployment Core</p>
                </div>

                <div className="flex flex-wrap gap-4 ml-auto lg:ml-0">
                    <div className="bg-zinc-900/60 border border-white/5 px-6 py-3 rounded-xl backdrop-blur-xl border-l-2 border-l-emerald-500/50">
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Active Nodes</p>
                        <p className="text-2xl font-black text-white">{projects.filter(p => p.status !== 'Archived').length}</p>
                    </div>
                    <div className="bg-zinc-900/60 border border-white/5 px-6 py-3 rounded-xl backdrop-blur-xl border-l-2 border-l-purple-500/50">
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Pinned Items</p>
                        <p className="text-2xl font-black text-purple-400">{projects.filter(p => p.pinned).length}</p>
                    </div>
                    <div className="bg-zinc-900/60 border border-white/5 px-6 py-3 rounded-xl backdrop-blur-xl border-l-2 border-l-zinc-500/50">
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1">Archived</p>
                        <p className="text-2xl font-black text-zinc-400">{projects.filter(p => p.status === 'Archived').length}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 md:gap-12">
                {/* Editor Section */}
                <div className="xl:col-span-5 space-y-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                                <Braces className="w-4 h-4 text-purple-400" />
                            </div>
                            <h3 className="text-lg font-bold text-white tracking-tight">Configuration Hub</h3>
                        </div>
                        {isEditing && (
                            <button
                                onClick={() => {
                                    setIsEditing(false);
                                    setCurrentProject({ title: '', description: '', link: '', github: '', media: '', technologies: '', category: 'Web', status: 'Production' });
                                }}
                                className="text-[10px] text-zinc-500 hover:text-white transition-colors uppercase font-black tracking-widest flex items-center gap-2"
                            >
                                <X className="w-3 h-3" /> Reset Node
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="bg-zinc-900/40 p-6 md:p-8 rounded-xl border border-white/5 space-y-6 backdrop-blur-3xl relative overflow-hidden shadow-2xl ring-1 ring-white/5 group">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none" />

                        <div className="space-y-5 relative z-10">
                            {/* Category & Status Selection */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Layout className="w-3 h-3" /> Area</label>
                                    <select
                                        name="category"
                                        value={currentProject.category}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all text-xs font-bold appearance-none cursor-pointer"
                                    >
                                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Rocket className="w-3 h-3" /> Status</label>
                                    <select
                                        name="status"
                                        value={currentProject.status}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all text-xs font-bold appearance-none cursor-pointer"
                                    >
                                        {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Title Input */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Designation</label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Project Name..."
                                    value={currentProject.title}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-zinc-700 font-bold"
                                    required
                                />
                            </div>

                            {/* Links */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Globe className="w-3 h-3" /> Live URL</label>
                                    <input
                                        type="text"
                                        name="link"
                                        placeholder="https://..."
                                        value={currentProject.link}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-zinc-700 text-xs font-bold"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Github className="w-3 h-3" /> Repository</label>
                                    <input
                                        type="text"
                                        name="github"
                                        placeholder="GitHub URL..."
                                        value={currentProject.github}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-zinc-700 text-xs font-bold"
                                    />
                                </div>
                            </div>

                            {/* Tech Stack */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Code2 className="w-3 h-3" /> Frameworks / Stack</label>
                                <input
                                    type="text"
                                    name="technologies"
                                    placeholder="React, Node.js, Three.js..."
                                    value={currentProject.technologies}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all placeholder:text-zinc-700 font-bold text-xs"
                                    required
                                />
                            </div>

                            {/* Media Upload */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Image className="w-3 h-3" /> Visual Asset</label>
                                <ImageUpload
                                    currentImage={currentProject.media}
                                    onUpload={(url) => setCurrentProject({ ...currentProject, media: url })}
                                    folder="projects"
                                />
                                <input
                                    type="text"
                                    name="media"
                                    placeholder="Direct Media URL..."
                                    value={currentProject.media}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/50 border border-white/5 rounded-xl p-2 text-[9px] text-zinc-500 outline-none truncate font-bold"
                                    required
                                />
                            </div>

                            {/* Gallery Uploads */}
                            <div className="space-y-4 pt-4 border-t border-white/5">
                                <div className="flex items-center justify-between ml-1">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Image className="w-3 h-3" /> Additional Gallery ({currentProject.gallery?.length || 0}/7)</label>
                                </div>
                                {(!currentProject.gallery || currentProject.gallery.length < 7) && (
                                    <ImageUpload
                                        multiple={true}
                                        onUploadMultiple={(urls) => {
                                            const current = currentProject.gallery || [];
                                            const remaining = 7 - current.length;
                                            const newUrls = urls.slice(0, remaining);
                                            setCurrentProject({ ...currentProject, gallery: [...current, ...newUrls] });
                                        }}
                                        folder="projects_gallery"
                                    />
                                )}

                                {currentProject.gallery && currentProject.gallery.length > 0 && (
                                    <div className="flex flex-wrap gap-4 mt-4">
                                        {currentProject.gallery.map((url, i) => (
                                            <div key={i} className="relative group w-24 h-24 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                                <img src={url} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const newGallery = [...currentProject.gallery];
                                                            newGallery.splice(i, 1);
                                                            setCurrentProject({ ...currentProject, gallery: newGallery });
                                                        }}
                                                        className="p-2 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/30"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1 flex items-center gap-2"><Info className="w-3 h-3" /> Node Intel</label>
                                <textarea
                                    name="description"
                                    placeholder="Declassify project details..."
                                    value={currentProject.description}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none h-28 resize-none transition-all placeholder:text-zinc-700 text-sm leading-relaxed"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-white/5 relative z-10">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group/btn relative bg-white text-black px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all hover:bg-zinc-200 text-xs font-black uppercase tracking-[0.2em] w-full overflow-hidden"
                            >
                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                <span className="relative z-10">{loading ? 'Encrypting...' : (isEditing ? 'Sync Node' : 'Deploy Node')}</span>
                                <Rocket className={`w-4 h-4 relative z-10 transition-transform ${loading ? 'translate-y-[-20px] opacity-0' : 'group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1'}`} />
                            </button>
                        </div>
                    </form>
                </div>

                {/* Live Preview Section */}
                <div className="xl:col-span-7 space-y-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <Eye className="w-4 h-4 text-emerald-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-tight">Active Rendering</h3>
                    </div>

                    <div className="bg-black/60 rounded-xl border border-white/10 backdrop-blur-3xl p-6 md:p-12 flex flex-col items-center justify-center relative lg:sticky lg:top-8 overflow-hidden min-h-[600px]">
                        <div className="absolute inset-0 tech-grid-bg opacity-30" />

                        {/* Status Float */}
                        <div className="absolute top-6 left-6 flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 rounded-xl bg-emerald-500 animate-pulse" />
                                Live Buffer
                            </div>
                            <div className="bg-white/5 px-3 py-1.5 rounded-xl border border-white/10 text-white/50 text-[10px] font-black uppercase tracking-widest">
                                Rendering: 120fps
                            </div>
                        </div>

                        {/* Preview Card */}
                        <motion.div
                            layoutId={currentProject.id || 'preview'}
                            className="group relative w-full lg:w-[500px] bg-zinc-950 rounded-xl border border-white/10 overflow-hidden shadow-2xl transition-all duration-500 hover:border-purple-500/50"
                        >
                            <div className="aspect-[16/10] overflow-hidden relative">
                                {currentProject.media ? (
                                    <img
                                        src={currentProject.media}
                                        alt="Preview"
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-zinc-900 flex flex-col items-center justify-center gap-4 text-zinc-700">
                                        <div className="w-16 h-16 rounded-xl border-2 border-dashed border-current flex items-center justify-center animate-[spin_10s_linear_infinite]">
                                            <Box className="w-8 h-8" />
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Awaiting Asset</p>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-8 flex flex-col justify-end">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-3 py-1 bg-purple-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl">
                                            {currentProject.category}
                                        </span>
                                        <span className="px-3 py-1 bg-white/10 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest rounded-xl border border-white/10">
                                            {currentProject.status}
                                        </span>
                                    </div>
                                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-none mb-1">
                                        {currentProject.title || 'NULL_NODE'}
                                    </h3>
                                </div>
                            </div>

                            <div className="p-8 space-y-6">
                                <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3">
                                    {currentProject.description || 'System output pending. Provide node data to begin rendering cycle.'}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {(typeof currentProject.technologies === 'string' ? currentProject.technologies.split(',') : currentProject.technologies || []).map((tech, i) => (
                                        tech && (
                                            <span key={i} className="text-[9px] font-black px-3 py-1.5 rounded-xl bg-zinc-900 border border-white/5 text-zinc-300 uppercase tracking-widest">
                                                {tech.trim()}
                                            </span>
                                        )
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-white/5 flex flex-col gap-4">
                                    {/* Gallery Preview */}
                                    {currentProject.gallery && currentProject.gallery.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {currentProject.gallery.map((img, idx) => (
                                                <div key={idx} className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 opacity-70 hover:opacity-100 transition-opacity cursor-pointer">
                                                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between">
                                        <div className="flex gap-4">
                                            <ExternalLink className="w-4 h-4 text-zinc-600" />
                                            <Github className="w-4 h-4 text-zinc-600" />
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-purple-500 animate-pulse" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="mt-12 text-center max-w-sm">
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest leading-relaxed">
                                Physical representation of the deployed node. All changes sync in real-time to the main visual interface.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* List Header with Search & Filter */}
            <div className="pt-12 border-t border-white/5 space-y-8">
                <div className="flex flex-col xl:flex-row justify-between items-end gap-6">
                    <div className="w-full xl:w-auto">
                        <h3 className="text-xl font-bold text-white flex items-center gap-3 mb-2 ">
                            <div className="w-2 h-2 rounded-xl bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                            Registry Map
                        </h3>
                        <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest">Authenticated Access Points ({filteredProjects.length})</p>
                    </div>

                    <div className="flex flex-col md:flex-row w-full xl:w-auto gap-4">
                        {/* Search */}
                        <div className="relative group flex-1 md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Search Registry..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-zinc-900/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-xs font-bold text-white focus:outline-none focus:border-purple-500/50 backdrop-blur-xl"
                            />
                        </div>
                        {/* Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                            <button
                                onClick={() => setFilterCategory('All')}
                                className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${filterCategory === 'All' ? 'bg-purple-500 border-purple-500 text-white' : 'bg-zinc-900/40 border-white/5 text-zinc-500 hover:border-white/10'
                                    }`}
                            >
                                All Regions
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setFilterCategory(cat)}
                                    className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${filterCategory === cat ? 'bg-purple-500 border-purple-500 text-white' : 'bg-zinc-900/40 border-white/5 text-zinc-500 hover:border-white/10'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                        {/* Archive Toggle */}
                        <button
                            onClick={() => setShowArchived(!showArchived)}
                            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${showArchived ? 'bg-zinc-100 text-black border-white' : 'bg-zinc-900/40 border-white/5 text-zinc-500 hover:border-white/10'
                                }`}
                        >
                            <Archive className="w-3 h-3" />
                            {showArchived ? 'Hide Archived' : 'Show Archived'}
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative bg-zinc-900/20 border border-white/5 rounded-xl overflow-hidden flex flex-col hover:border-purple-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-900/5"
                            >
                                <div className="aspect-video relative overflow-hidden bg-zinc-950 border-b border-white/5">
                                    <img src={project.media} alt={project.title} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000" />

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
                                        <div className="bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-xl bg-emerald-500" />
                                            <span className="text-[8px] font-black text-white uppercase tracking-widest">{project.category}</span>
                                        </div>
                                        {project.pinned && (
                                            <div className="bg-purple-500 px-2.5 py-1 rounded-xl border border-purple-400 flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                                <Pin className="w-2.5 h-2.5 text-white" />
                                                <span className="text-[8px] font-black text-white uppercase tracking-widest">Priority</span>
                                            </div>
                                        )}
                                        {project.status === 'Archived' && (
                                            <div className="bg-zinc-700 px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-2">
                                                <Archive className="w-2.5 h-2.5 text-white" />
                                                <span className="text-[8px] font-black text-white uppercase tracking-widest">Archived</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Mobile 3-Dot Menu Trigger */}
                                    <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setActiveActionMenu(activeActionMenu === project.id ? null : project.id);
                                            }}
                                            className="lg:hidden w-8 h-8 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center text-white"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Action Menu (Mobile Dropdown or Desktop Hover Overlay) */}
                                    <AnimatePresence>
                                        {(activeActionMenu === project.id || true) && (
                                            <motion.div
                                                initial={activeActionMenu === project.id ? { opacity: 0, scale: 0.9, y: 10 } : { opacity: 0 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                                className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-all duration-300 flex items-center justify-center px-6 z-30 ${activeActionMenu === project.id ? 'flex' : 'hidden lg:group-hover:flex'}`}
                                            >
                                                {/* Close button for mobile menu */}
                                                {activeActionMenu === project.id && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setActiveActionMenu(null); }}
                                                        className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-white"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                )}

                                                <div className="grid grid-cols-2 gap-2 w-full max-w-[240px]">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); togglePin(project); setActiveActionMenu(null); }}
                                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${project.pinned ? 'bg-purple-500 text-white' : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                                                            }`}
                                                    >
                                                        <Pin className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleEdit(project); setActiveActionMenu(null); }}
                                                        className="flex items-center justify-center gap-2 p-3 bg-white text-black hover:bg-zinc-200 rounded-xl transition-all"
                                                    >
                                                        <Edit3 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); toggleArchive(project); setActiveActionMenu(null); }}
                                                        className={`flex items-center justify-center gap-2 p-3 rounded-xl transition-all ${project.status === 'Archived' ? 'bg-zinc-100 text-black' : 'bg-white/5 hover:bg-white/10 text-zinc-400'
                                                            }`}
                                                    >
                                                        <Archive className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); copyToClipboard(project.link, project.id); setActiveActionMenu(null); }}
                                                        className="flex items-center justify-center gap-2 p-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl transition-all"
                                                    >
                                                        {copySuccess === project.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDelete(project); setActiveActionMenu(null); }}
                                                        className="col-span-2 flex items-center justify-center gap-2 p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all border border-red-500/20"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                        <span className="text-[10px] font-black uppercase tracking-widest">Purge Node</span>
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-lg font-black text-white mb-2 truncate group-hover:text-purple-400 transition-colors uppercase tracking-tight">
                                        {project.title}
                                    </h3>
                                    <p className="text-zinc-500 text-[11px] line-clamp-2 mb-6 font-bold leading-relaxed flex-grow uppercase tracking-wide">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                        {Array.isArray(project.technologies) && project.technologies.slice(0, 3).map((tech, i) => (
                                            <span key={i} className="text-[8px] bg-white/5 px-2.5 py-1 rounded-xl border border-white/5 text-zinc-400 font-black uppercase tracking-widest whitespace-nowrap">
                                                {tech}
                                            </span>
                                        ))}
                                        {Array.isArray(project.technologies) && project.technologies.length > 3 && (
                                            <span className="text-[8px] bg-white/5 px-2 py-1 rounded-xl border border-white/5 text-zinc-600 font-black">
                                                +{project.technologies.length - 3}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredProjects.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-zinc-900/20 rounded-xl border border-white/5 border-dashed">
                        <Box className="w-12 h-12 text-zinc-800 mb-4" />
                        <h4 className="text-zinc-600 font-black uppercase tracking-[0.3em]">No Active Nodes In Range</h4>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-2xl"
                        onClick={cancelDelete}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-zinc-950 border border-white/10 rounded-xl p-10 max-w-md w-full shadow-[0_0_100px_rgba(239,68,68,0.1)] relative overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />

                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className="w-20 h-20 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20">
                                    <Shield className="w-10 h-10 text-red-500" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter">Authorization Required</h3>
                                    <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                                        Are you certain you want to purge node <span className="text-red-400">{projectToDelete?.title}</span>? This action is irreversible.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 w-full pt-4">
                                    <button
                                        onClick={() => {
                                            setIsDeleteModalOpen(false);
                                            setProjectToDelete(null);
                                        }}
                                        className="px-6 py-4 rounded-xl bg-zinc-900 text-zinc-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-[0.2em] border border-white/5"
                                    >
                                        Abort
                                    </button>
                                    <button
                                        onClick={confirmDelete}
                                        className="px-6 py-4 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-all text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-red-900/40"
                                    >
                                        Purge
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProjectManager;
