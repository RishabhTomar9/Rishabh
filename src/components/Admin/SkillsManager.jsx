import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import * as Lucide from 'lucide-react';

const TECH_ICON_MAP = {
    'React': 'Atom',
    'JavaScript': 'FileJson',
    'Node.js': 'Server',
    'Firebase': 'Flame',
    'PL/SQL': 'Database',
    'Snowflake': 'Snowflake',
    'HTML': 'Code2',
    'CSS': 'Layers',
    'Design': 'Palette',
    'Git': 'GitBranch',
    'C++': 'Terminal',
    'Python': 'FileCode',
    'SQL': 'Database',
    'MongoDB': 'Leaf',
    'Java': 'Coffee',
    'AWS': 'Cloud'
};

const SkillsManager = () => {
    const [techSkills, setTechSkills] = useState([]);
    const [softSkills, setSoftSkills] = useState([]);
    const [activeTab, setActiveTab] = useState('technical'); // 'technical', 'soft'
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    // Technical Skill Form
    const [currentTechSkill, setCurrentTechSkill] = useState({
        name: '', level: 80, iconName: 'Cpu', color: 'rgba(168, 85, 247, 0.3)',
        description: '', tools: ''
    });

    // Soft Skill Form
    const [currentSoftSkill, setCurrentSoftSkill] = useState({ name: '', emoji: '🚀' });

    // Modals
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [activeActionMenu, setActiveActionMenu] = useState(null);

    useEffect(() => {
        const qTech = query(collection(db, 'skills_tech'), orderBy('createdAt', 'desc'));
        const unsubTech = onSnapshot(qTech, (snapshot) => {
            setTechSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const qSoft = query(collection(db, 'skills_soft'), orderBy('createdAt', 'desc'));
        const unsubSoft = onSnapshot(qSoft, (snapshot) => {
            setSoftSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubTech();
            unsubSoft();
        };
    }, []);

    const handleTechSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const skillData = {
                ...currentTechSkill,
                createdAt: currentTechSkill.createdAt || new Date().toISOString()
            };

            if (currentTechSkill.id) {
                await updateDoc(doc(db, 'skills_tech', currentTechSkill.id), skillData);
            } else {
                await addDoc(collection(db, 'skills_tech'), skillData);
            }

            setCurrentTechSkill({ name: '', level: 80, iconName: 'Cpu', color: 'rgba(168, 85, 247, 0.3)', description: '', tools: '' });
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving tech skill:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSoftSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const skillData = {
                ...currentSoftSkill,
                createdAt: currentSoftSkill.createdAt || new Date().toISOString()
            };

            if (currentSoftSkill.id) {
                await updateDoc(doc(db, 'skills_soft', currentSoftSkill.id), skillData);
            } else {
                await addDoc(collection(db, 'skills_soft'), skillData);
            }

            setCurrentSoftSkill({ name: '', emoji: '🚀' });
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving soft skill:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (skill, type) => {
        if (type === 'technical') {
            setCurrentTechSkill(skill);
            setActiveTab('technical');
        } else {
            setCurrentSoftSkill(skill);
            setActiveTab('soft');
        }
        setIsEditing(true);
    };

    const handleDeleteClick = (skill, type) => {
        setItemToDelete({ ...skill, type });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            try {
                const collectionName = itemToDelete.type === 'technical' ? 'skills_tech' : 'skills_soft';
                await deleteDoc(doc(db, collectionName, itemToDelete.id));
                setIsDeleteModalOpen(false);
                setItemToDelete(null);
            } catch (error) {
                console.error("Error deleting skill:", error);
            }
        }
    };

    const renderDynamicIcon = (iconName, props = {}) => {
        // 1. Exact match
        let Icon = Lucide[iconName];

        // 2. Smart Mapping match (case-insensitive)
        if (!Icon) {
            const mappedName = Object.keys(TECH_ICON_MAP).find(
                key => key.toLowerCase() === iconName?.toLowerCase()
            );
            if (mappedName) Icon = Lucide[TECH_ICON_MAP[mappedName]];
        }

        // 3. PascalCase fix attempt
        if (!Icon && iconName) {
            const pascalName = iconName.charAt(0).toUpperCase() + iconName.slice(1);
            Icon = Lucide[pascalName];
        }

        return Icon ? <Icon {...props} /> : <Lucide.Cpu {...props} />;
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-white/5 pb-6 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        Capabilities Command
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-1 rounded border border-purple-500/20 font-bold">v3.0</span>
                    </h2>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1 font-bold">Manage Tech Arsenal & Ethos</p>
                </div>

                <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/10 w-fit">
                    <button
                        onClick={() => { setActiveTab('technical'); setIsEditing(false); }}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'technical' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                    >
                        Technical
                    </button>
                    <button
                        onClick={() => { setActiveTab('soft'); setIsEditing(false); }}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all ${activeTab === 'soft' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
                    >
                        Soft Skills
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Editor Section */}
                <div className="lg:col-span-5">
                    {activeTab === 'technical' ? (
                        <form onSubmit={handleTechSubmit} className="bg-zinc-900/60 p-6 rounded-xl border border-white/5 space-y-5 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-50" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <FaEdit className="text-purple-400" /> {isEditing ? 'Modify Skill Node' : 'Initialize Skill Node'}
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Skill Name</label>
                                    <input
                                        type="text"
                                        placeholder="React, Node.js, etc."
                                        value={currentTechSkill.name}
                                        onChange={(e) => setCurrentTechSkill({ ...currentTechSkill, name: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none font-bold"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Efficiency ({currentTechSkill.level}%)</label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={currentTechSkill.level}
                                            onChange={(e) => setCurrentTechSkill({ ...currentTechSkill, level: parseInt(e.target.value) })}
                                            className="w-full h-2 bg-zinc-800 rounded-xl appearance-none cursor-pointer accent-purple-500"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Lucide Icon Name</label>
                                        <div className="relative group/icon">
                                            <input
                                                type="text"
                                                placeholder="Cpu, Code, Layers..."
                                                value={currentTechSkill.iconName}
                                                onChange={(e) => setCurrentTechSkill({ ...currentTechSkill, iconName: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none text-sm pr-10"
                                                required
                                            />
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400">
                                                {renderDynamicIcon(currentTechSkill.iconName, { size: 18 })}
                                            </div>
                                        </div>
                                        <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-widest">Search on lucide.dev</p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Theme Color (RGBA)</label>
                                    <input
                                        type="text"
                                        placeholder="rgba(168, 85, 247, 0.3)"
                                        value={currentTechSkill.color}
                                        onChange={(e) => setCurrentTechSkill({ ...currentTechSkill, color: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none text-xs font-bold"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                                    <input
                                        type="text"
                                        placeholder="Frontend Library, Core Language, etc."
                                        value={currentTechSkill.description}
                                        onChange={(e) => setCurrentTechSkill({ ...currentTechSkill, description: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none text-sm"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Tools / Stack</label>
                                    <input
                                        type="text"
                                        placeholder="Next.js, Redux, Context"
                                        value={currentTechSkill.tools}
                                        onChange={(e) => setCurrentTechSkill({ ...currentTechSkill, tools: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-purple-500 outline-none text-sm"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-white/5">
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => { setIsEditing(false); setCurrentTechSkill({ name: '', level: 80, iconName: 'Cpu', color: 'rgba(168, 85, 247, 0.3)', description: '', tools: '' }); }}
                                        className="px-4 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-3 rounded-xl shadow-lg text-xs font-bold uppercase tracking-wider hover:shadow-purple-900/40 transition-all font-tech"
                                >
                                    {loading ? 'Processing...' : (isEditing ? 'Update Node' : 'Deploy Node')}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleSoftSubmit} className="bg-zinc-900/60 p-6 rounded-xl border border-white/5 space-y-5 backdrop-blur-xl relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-50" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <FaPlus className="text-emerald-400" /> {isEditing ? 'Modify Ethos' : 'Initialize Ethos'}
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Skill Name</label>
                                    <input
                                        type="text"
                                        placeholder="Teamwork, Problem Solving, etc."
                                        value={currentSoftSkill.name}
                                        onChange={(e) => setCurrentSoftSkill({ ...currentSoftSkill, name: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 outline-none font-bold"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Emoji Symbol</label>
                                    <input
                                        type="text"
                                        placeholder="🤝, 🧠, etc."
                                        value={currentSoftSkill.emoji}
                                        onChange={(e) => setCurrentSoftSkill({ ...currentSoftSkill, emoji: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 outline-none text-2xl text-center"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t border-white/5">
                                {isEditing && (
                                    <button
                                        type="button"
                                        onClick={() => { setIsEditing(false); setCurrentSoftSkill({ name: '', emoji: '🚀' }); }}
                                        className="px-4 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white transition-all text-xs font-bold uppercase tracking-wider"
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-4 py-3 rounded-xl shadow-lg text-xs font-bold uppercase tracking-wider hover:shadow-emerald-900/40 transition-all font-tech"
                                >
                                    {loading ? 'Processing...' : (isEditing ? 'Connect Ethos' : 'Inject Ethos')}
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* List Section */}
                <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-xl animate-pulse ${activeTab === 'technical' ? 'bg-purple-500' : 'bg-emerald-500'}`} />
                        Active Manifest ({activeTab === 'technical' ? techSkills.length : softSkills.length} Units)
                    </h3>

                    <div className="grid gap-3">
                        <AnimatePresence mode="popLayout">
                            {(activeTab === 'technical' ? techSkills : softSkills).map((skill) => (
                                <motion.div
                                    key={skill.id}
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-zinc-900/40 border border-white/5 rounded-xl p-4 flex items-center justify-between group hover:bg-zinc-900/60 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        {activeTab === 'technical' ? (
                                            <>
                                                <div
                                                    className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-xl border border-white/5"
                                                    style={{ color: skill.color?.replace('0.3', '1') }}
                                                >
                                                    {renderDynamicIcon(skill.iconName, { size: 24 })}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">{skill.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <div className="w-20 h-1 bg-black rounded-xl overflow-hidden">
                                                            <div className="h-full bg-purple-500" style={{ width: `${skill.level}%` }} />
                                                        </div>
                                                        <span className="text-[10px] text-zinc-500 font-bold">{skill.level}%</span>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center text-2xl border border-white/5">
                                                    {skill.emoji}
                                                </div>
                                                <h4 className="font-bold text-white text-sm">{skill.name}</h4>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        {/* Desktop Actions */}
                                        <div className="hidden lg:flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEdit(skill, activeTab)}
                                                className="p-2 hover:bg-white/10 rounded-xl text-blue-400 transition-colors"
                                            >
                                                <FaEdit className="text-sm" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(skill, activeTab)}
                                                className="p-2 hover:bg-red-500/10 rounded-xl text-red-400 transition-colors"
                                            >
                                                <FaTrash className="text-sm" />
                                            </button>
                                        </div>

                                        {/* Mobile 3-Dot Menu */}
                                        <div className="lg:hidden relative">
                                            <button
                                                onClick={() => setActiveActionMenu(activeActionMenu === skill.id ? null : skill.id)}
                                                className="p-2 bg-white/5 border border-white/10 rounded-xl text-zinc-400"
                                            >
                                                {renderDynamicIcon('MoreVertical', { size: 16 })}
                                            </button>
                                            <AnimatePresence>
                                                {activeActionMenu === skill.id && (
                                                    <>
                                                        <div className="fixed inset-0 z-10" onClick={() => setActiveActionMenu(null)} />
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.9, x: -10 }}
                                                            animate={{ opacity: 1, scale: 1, x: 0 }}
                                                            exit={{ opacity: 0, scale: 0.9, x: -10 }}
                                                            className="absolute right-0 top-10 w-32 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden"
                                                        >
                                                            <button
                                                                onClick={() => { handleEdit(skill, activeTab); setActiveActionMenu(null); }}
                                                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:bg-white/5 transition-colors"
                                                            >
                                                                <FaEdit /> Edit
                                                            </button>
                                                            <button
                                                                onClick={() => { handleDeleteClick(skill, activeTab); setActiveActionMenu(null); }}
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
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Modal */}
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
                            <h3 className="text-xl font-bold text-white mb-2">Decommission Unit?</h3>
                            <p className="text-zinc-400 text-sm mb-6">Permanently remove <span className="text-white font-bold">{itemToDelete?.name}</span> from the capability matrix?</p>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">Abort</button>
                                <button onClick={confirmDelete} className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-500 transition-colors text-sm font-bold uppercase tracking-widest">Execute</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default SkillsManager;
