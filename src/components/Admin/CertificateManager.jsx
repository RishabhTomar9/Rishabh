import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { FaPlus, FaEdit, FaTrash, FaCheckCircle, FaAward, FaMedal, FaTrophy, FaImage } from 'react-icons/fa';
import { MoreVertical, Edit2, Trash2, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './ImageUpload';

const COLLECTIONS = {
    CERTIFICATES: 'certificates',
    BADGES: 'badges',
    ACHIEVEMENTS: 'achievements'
};

const CertificateManager = () => {
    const [activeTab, setActiveTab] = useState(COLLECTIONS.CERTIFICATES);
    const [items, setItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [currentItem, setCurrentItem] = useState({ title: '', date: '', image: '', link: '' });
    const [loading, setLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [activeActionMenu, setActiveActionMenu] = useState(null);

    useEffect(() => {
        const q = query(collection(db, activeTab), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setItems(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });
        return () => unsubscribe();
    }, [activeTab]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem({ ...currentItem, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const itemData = {
                ...currentItem,
                createdAt: currentItem.createdAt || new Date().toISOString()
            };

            if (currentItem.id) {
                await updateDoc(doc(db, activeTab, currentItem.id), itemData);
            } else {
                await addDoc(collection(db, activeTab), itemData);
            }

            setCurrentItem({ title: '', date: '', image: '', link: '' });
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving item: ", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setCurrentItem(item);
        setIsEditing(true);
    };

    const handleDelete = (item) => {
        setItemToDelete(item);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (itemToDelete) {
            try {
                await deleteDoc(doc(db, activeTab, itemToDelete.id));
                setIsDeleteModalOpen(false);
                setItemToDelete(null);
            } catch (error) {
                console.error("Error deleting item: ", error);
            }
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        Credentials Vault
                        <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-1 rounded border border-orange-500/20 font-bold">v1.1</span>
                    </h2>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1 font-bold">Manage Certs & Awards</p>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/10 w-fit">
                {[
                    { id: COLLECTIONS.CERTIFICATES, label: 'Certificates', icon: <FaCheckCircle /> },
                    { id: COLLECTIONS.BADGES, label: 'Badges', icon: <FaMedal /> },
                    { id: COLLECTIONS.ACHIEVEMENTS, label: 'Hall of Fame', icon: <FaTrophy /> }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => { setActiveTab(tab.id); setIsEditing(false); setCurrentItem({ title: '', date: '', image: '', link: '' }); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab.id ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Editor */}
                <div className="lg:col-span-5 space-y-6">
                    <form onSubmit={handleSubmit} className="bg-zinc-900/60 p-6 rounded-xl border border-white/5 space-y-5 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-500 opacity-50" />

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={currentItem.title}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none text-sm font-bold"
                                required
                            />
                        </div>

                        {activeTab !== COLLECTIONS.BADGES && (
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Date</label>
                                <input
                                    type="text"
                                    name="date"
                                    placeholder="e.g. May 2025"
                                    value={currentItem.date}
                                    onChange={handleInputChange}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none text-sm"
                                    required
                                />
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><FaImage /> Asset Upload (Cloudinary)</label>
                            <ImageUpload
                                currentImage={currentItem.image}
                                onUpload={(url) => setCurrentItem({ ...currentItem, image: url })}
                                folder={activeTab}
                            />
                            <input
                                type="text"
                                name="image"
                                value={currentItem.image}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] text-zinc-500 focus:border-orange-500 outline-none truncate"
                                placeholder="Asset URL (Auto-filled on upload)"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Link URL</label>
                            <input
                                type="text"
                                name="link"
                                value={currentItem.link}
                                onChange={handleInputChange}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none text-sm font-bold"
                                required
                            />
                        </div>

                        <div className="flex gap-3 pt-4">
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setCurrentItem({ title: '', date: '', image: '', link: '' });
                                    }}
                                    className="px-4 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-3 rounded-xl shadow-lg hover:shadow-orange-900/20 text-xs font-bold uppercase tracking-wider transition-all"
                            >
                                {loading ? 'Processing...' : (isEditing ? 'Update Item' : 'Add Item')}
                            </button>
                        </div>
                    </form>
                </div>

                {/* List */}
                <div className="lg:col-span-7 space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <span className="w-2 h-2 rounded-xl bg-orange-500 animate-pulse" />
                        Stored Assets ({items.length})
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-zinc-900/40 border border-white/5 rounded-xl overflow-hidden group hover:border-orange-500/30 transition-all flex flex-col"
                                >
                                    <div className="aspect-video bg-black relative shadow-inner overflow-hidden">
                                        <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all group-hover:scale-105 duration-700" />

                                        {/* Desktop Actions */}
                                        <div className="absolute top-2 right-2 hidden lg:flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                            <button onClick={() => handleEdit(item)} className="p-1.5 bg-black/50 backdrop-blur rounded text-white hover:bg-orange-600 transition-colors"><FaEdit className="text-xs" /></button>
                                            <button onClick={() => handleDelete(item)} className="p-1.5 bg-black/50 backdrop-blur rounded text-white hover:bg-red-600 transition-colors"><FaTrash className="text-xs" /></button>
                                        </div>

                                        {/* Mobile 3-Dot Menu */}
                                        <div className="lg:hidden absolute top-2 right-2 z-20">
                                            <button
                                                onClick={() => setActiveActionMenu(activeActionMenu === item.id ? null : item.id)}
                                                className="p-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-white"
                                            >
                                                <MoreVertical className="w-3.5 h-3.5" />
                                            </button>
                                            <AnimatePresence>
                                                {activeActionMenu === item.id && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scale: 0.9, x: -10 }}
                                                        animate={{ opacity: 1, scale: 1, x: 0 }}
                                                        exit={{ opacity: 0, scale: 0.9, x: -10 }}
                                                        className="absolute right-0 top-10 w-28 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden"
                                                    >
                                                        <button
                                                            onClick={() => { handleEdit(item); setActiveActionMenu(null); }}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-orange-400 hover:bg-white/5 transition-colors"
                                                        >
                                                            <Edit2 className="w-3 h-3" /> Edit
                                                        </button>
                                                        <button
                                                            onClick={() => { handleDelete(item); setActiveActionMenu(null); }}
                                                            className="w-full flex items-center gap-3 px-3 py-2.5 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-white/5 transition-colors border-t border-white/5"
                                                        >
                                                            <Trash2 className="w-3 h-3" /> Delete
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h4 className="font-bold text-white text-sm line-clamp-1 mb-1">{item.title}</h4>
                                        {item.date && (
                                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded w-fit mb-2">{item.date}</span>
                                        )}
                                        <a href={item.link} target="_blank" rel="noreferrer" className="mt-auto text-[10px] text-orange-400 hover:underline truncate block font-bold">{item.link}</a>
                                    </div>
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
                            <h3 className="text-xl font-bold text-white mb-2">Confirm Delete?</h3>
                            <p className="text-zinc-400 text-sm mb-6">Permanently remove <span className="text-white font-bold">{itemToDelete?.title}</span>?</p>
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

export default CertificateManager;
