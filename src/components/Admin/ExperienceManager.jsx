import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';

const COLOR_THEMES = [
    { name: 'Purple', color: 'text-purple-400', accent: 'bg-purple-500' },
    { name: 'Blue', color: 'text-blue-400', accent: 'bg-blue-500' },
    { name: 'Yellow', color: 'text-yellow-400', accent: 'bg-yellow-500' },
    { name: 'Orange', color: 'text-orange-400', accent: 'bg-orange-500' },
    { name: 'Emerald', color: 'text-emerald-400', accent: 'bg-emerald-500' },
    { name: 'Pink', color: 'text-pink-400', accent: 'bg-pink-500' },
];

const ExperienceManager = () => {
    const [experiences, setExperiences] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentExp, setCurrentExp] = useState({
        company: '', role: '', period: '', description: '',
        status: '', tag: '', iconName: 'Briefcase', themeIndex: 0
    });
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [expToDelete, setExpToDelete] = useState(null);
    const [activeActionMenu, setActiveActionMenu] = useState(null);

    useEffect(() => {
        const q = query(collection(db, 'experiences'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setExperiences(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentExp({ ...currentExp, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const theme = COLOR_THEMES[currentExp.themeIndex];
            const expData = {
                ...currentExp,
                color: theme.color,
                accent: theme.accent,
                createdAt: currentExp.createdAt || new Date().toISOString()
            };

            if (currentExp.id) {
                await updateDoc(doc(db, 'experiences', currentExp.id), expData);
            } else {
                await addDoc(collection(db, 'experiences'), expData);
            }

            setCurrentExp({
                company: '', role: '', period: '', description: '',
                status: '', tag: '', iconName: 'Briefcase', themeIndex: 0
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving experience: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (exp) => {
        const themeIndex = COLOR_THEMES.findIndex(t => t.color === exp.color) || 0;
        setCurrentExp({ ...exp, themeIndex });
        setIsEditing(true);
    };

    const handleDelete = (exp) => {
        setExpToDelete(exp);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (expToDelete) {
            try {
                await deleteDoc(doc(db, 'experiences', expToDelete.id));
                setIsDeleteModalOpen(false);
                setExpToDelete(null);
            } catch (error) {
                console.error("Error deleting experience: ", error);
            }
        }
    };

    const renderDynamicIcon = (iconName, props = {}) => {
        const Icon = Lucide[iconName];
        return Icon ? <Icon {...props} /> : <Lucide.HelpCircle {...props} />;
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        Experience Matrix
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 font-bold">v1.0</span>
                    </h2>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1 font-bold">Manage Career Timeline</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Editor */}
                <div className="lg:col-span-5 space-y-6">
                    <form onSubmit={handleSubmit} className="bg-zinc-900/60 p-6 rounded-xl border border-white/5 space-y-5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-50" />

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Company / Institution</label>
                            <input
                                type="text"
                                name="company"
                                value={currentExp.company}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm font-bold"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Role</label>
                                <input
                                    type="text"
                                    name="role"
                                    value={currentExp.role}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Period</label>
                                <input
                                    type="text"
                                    name="period"
                                    value={currentExp.period}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                            <textarea
                                name="description"
                                value={currentExp.description}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none h-24 resize-none text-sm"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Status Tag</label>
                                <input
                                    type="text"
                                    name="status"
                                    placeholder="e.g. LIVE_OPERATIONS"
                                    value={currentExp.status}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Category Tag</label>
                                <input
                                    type="text"
                                    name="tag"
                                    placeholder="e.g. STRATEGIC"
                                    value={currentExp.tag}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lucide Icon Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="iconName"
                                        placeholder="Briefcase, Rocket, etc."
                                        value={currentExp.iconName}
                                        onChange={handleInputChange}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm pr-10"
                                        required
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400">
                                        {renderDynamicIcon(currentExp.iconName, { size: 18 })}
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Color Theme</label>
                                <select
                                    name="themeIndex"
                                    value={currentExp.themeIndex}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none text-sm appearance-none"
                                >
                                    {COLOR_THEMES.map((theme, index) => (
                                        <option key={index} value={index}>{theme.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setCurrentExp({
                                            company: '', role: '', period: '', description: '',
                                            status: '', tag: '', iconName: 'Briefcase', themeIndex: 0
                                        });
                                    }}
                                    className="px-4 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-blue-900/20 text-xs font-bold uppercase tracking-wider transition-all"
                            >
                                {loading ? 'Processing...' : (isEditing ? 'Update Node' : 'Add Experience')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-xl bg-blue-500 animate-pulse" />
                        Timeline Entries ({experiences.length})
                    </h3>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {experiences.map((exp) => (
                                <motion.div
                                    key={exp.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-zinc-900/40 border border-white/5 rounded-xl p-5 hover:bg-zinc-900/60 transition-colors group relative"
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            <div className={`p-3 rounded-xl bg-white/5 border border-white/5 text-xl ${exp.color}`}>
                                                {renderDynamicIcon(exp.iconName, { size: 24 })}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-lg">{exp.company}</h4>
                                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                    <span>{exp.role}</span>
                                                    <span className="w-1 h-1 rounded-xl bg-zinc-600" />
                                                    <span className="font-bold text-xs">{exp.period}</span>
                                                </div>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-zinc-500 font-bold uppercase">{exp.status}</span>
                                                    <span className={`text-[10px] bg-white/5 px-2 py-0.5 rounded font-bold uppercase ${exp.color} border border-white/5`}>{exp.tag}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex md:flex-col gap-2">
                                            {/* Desktop Actions */}
                                            <div className="hidden lg:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleEdit(exp)} className="p-2 hover:bg-white/10 rounded-xl text-blue-400 transition-colors">
                                                    <FaEdit />
                                                </button>
                                                <button onClick={() => handleDelete(exp)} className="p-2 hover:bg-red-500/10 rounded-xl text-red-400 transition-colors">
                                                    <FaTrash />
                                                </button>
                                            </div>

                                            {/* Mobile 3-Dot Menu */}
                                            <div className="lg:hidden relative">
                                                <button
                                                    onClick={() => setActiveActionMenu(activeActionMenu === exp.id ? null : exp.id)}
                                                    className="p-2 bg-white/5 border border-white/10 rounded-xl text-zinc-400"
                                                >
                                                    {renderDynamicIcon('MoreVertical', { size: 16 })}
                                                </button>
                                                <AnimatePresence>
                                                    {activeActionMenu === exp.id && (
                                                        <>
                                                            <div className="fixed inset-0 z-10" onClick={() => setActiveActionMenu(null)} />
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.9, x: -10 }}
                                                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                                                exit={{ opacity: 0, scale: 0.9, x: -10 }}
                                                                className="absolute right-0 top-10 w-32 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden"
                                                            >
                                                                <button
                                                                    onClick={() => { handleEdit(exp); setActiveActionMenu(null); }}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:bg-white/5 transition-colors"
                                                                >
                                                                    <FaEdit /> Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => { handleDelete(exp); setActiveActionMenu(null); }}
                                                                    className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-white/5 transition-colors border-t border-white/5"
                                                                >
                                                                    <FaTrash /> Delete
                                                                </button>
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm text-zinc-500 line-clamp-2">{exp.description}</p>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Delete Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-900 border border-white/10 rounded-xl p-6 max-w-sm w-full shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-white mb-2">Delete Entry?</h3>
                            <p className="text-zinc-400 text-sm mb-6">Permanently remove <span className="text-white font-bold">{expToDelete?.company}</span> from your timeline?</p>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white transition-colors text-sm font-bold">Cancel</button>
                                <button onClick={confirmDelete} className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors text-sm font-bold">Delete</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ExperienceManager;
