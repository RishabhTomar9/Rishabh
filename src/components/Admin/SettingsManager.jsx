import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { FaGlobe, FaLinkedin, FaGithub, FaTwitter, FaInstagram, FaEnvelope, FaMapMarkerAlt, FaSave, FaTools, FaShareAlt, FaFileUpload, FaTrash, FaFilePdf, FaSpinner, FaWhatsapp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const SettingsManager = () => {
    const [loading, setLoading] = useState(false);
    const [settings, setSettings] = useState({
        email: 'rishabhtomar9999@gmail.com',
        github: 'https://github.com/RishabhTomar9',
        linkedin: 'https://www.linkedin.com/in/rishabhtomar9/',
        twitter: '',
        instagram: '',
        whatsapp: '',
        location: 'India',
        footerCredit: 'Designed & Built by Rishabh Tomar',
        contactHeading: 'Get In Touch',
        contactSubheading: 'Let\'s build something together.'
    });

    const [resumeUrl, setResumeUrl] = useState('/resume.pdf');
    const [uploadingResume, setUploadingResume] = useState(false);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'content', 'settings'), (docSnap) => {
            if (docSnap.exists()) setSettings(docSnap.data());
        });
        
        const unsubResume = onSnapshot(doc(db, 'settings', 'resume'), (docSnap) => {
            if (docSnap.exists() && docSnap.data().url) {
                setResumeUrl(docSnap.data().url);
            } else {
                setResumeUrl('/resume.pdf');
            }
        });

        return () => { unsub(); unsubResume(); };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await setDoc(doc(db, 'content', 'settings'), settings);
            alert('Settings updated successfully!');
        } catch (error) {
            console.error("Error updating settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleResumeUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            alert("Cloudinary configuration missing in .env");
            return;
        }

        setUploadingResume(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', 'portfolio');

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
                { method: 'POST', body: formData }
            );

            const data = await response.json();

            if (data.secure_url) {
                await setDoc(doc(db, 'settings', 'resume'), {
                    url: data.secure_url,
                    updatedAt: new Date().toISOString()
                });
                alert("Resume uploaded successfully!");
            } else {
                alert(data.error?.message || "Upload failed");
            }
        } catch (err) {
            alert("Connection error: " + err.message);
        } finally {
            setUploadingResume(false);
        }
    };

    const handleResumeDelete = async () => {
        if (!window.confirm("Are you sure you want to delete the current resume?")) return;
        
        try {
            setUploadingResume(true);
            await setDoc(doc(db, 'settings', 'resume'), {
                url: '',
                updatedAt: new Date().toISOString()
            });
            setResumeUrl('/resume.pdf');
            alert("Resume reset to default successfully!");
        } catch (error) {
            alert("Error deleting resume");
        } finally {
            setUploadingResume(false);
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-white/5 pb-6 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        Global Protocol
                        <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-1 rounded border border-orange-500/20 font-bold">v1.5</span>
                    </h2>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1 font-bold">Manage Social Links, Resume & Global Metadata</p>
                </div>
            </div>

            <div className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit} className="bg-zinc-900/60 p-6 md:p-8 rounded-xl border border-white/5 space-y-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500 opacity-50" />

                    {/* Social Section */}
                    <div className="space-y-6">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 border-l-2 border-orange-500 pl-3">
                            <FaShareAlt className="text-orange-400" /> Digital Presence
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><FaGithub /> GitHub URL</label>
                                <input
                                    type="text"
                                    value={settings.github}
                                    onChange={(e) => setSettings({ ...settings, github: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none text-sm"
                                    placeholder="https://github.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><FaLinkedin /> LinkedIn URL</label>
                                <input
                                    type="text"
                                    value={settings.linkedin}
                                    onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none text-sm"
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><FaTwitter /> Twitter / X URL</label>
                                <input
                                    type="text"
                                    value={settings.twitter}
                                    onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none text-sm"
                                    placeholder="https://twitter.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><FaInstagram /> Instagram URL</label>
                                <input
                                    type="text"
                                    value={settings.instagram}
                                    onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none text-sm"
                                    placeholder="https://instagram.com/..."
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><FaWhatsapp /> WhatsApp URL</label>
                                <input
                                    type="text"
                                    value={settings.whatsapp}
                                    onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none text-sm"
                                    placeholder="https://wa.me/..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact & Misc */}
                    <div className="space-y-6 pt-6 border-t border-white/5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 border-l-2 border-orange-500 pl-3">
                            <FaTools className="text-orange-400" /> System Params
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><FaEnvelope /> Primary Email</label>
                                <input
                                    type="email"
                                    value={settings.email}
                                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none text-sm"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><FaMapMarkerAlt /> Global Location</label>
                                <input
                                    type="text"
                                    value={settings.location}
                                    onChange={(e) => setSettings({ ...settings, location: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Footer Attribution</label>
                                <input
                                    type="text"
                                    value={settings.footerCredit}
                                    onChange={(e) => setSettings({ ...settings, footerCredit: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none text-sm"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contact Heading</label>
                                    <input
                                        type="text"
                                        value={settings.contactHeading}
                                        onChange={(e) => setSettings({ ...settings, contactHeading: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none text-sm"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Contact Subheading</label>
                                    <input
                                        type="text"
                                        value={settings.contactSubheading}
                                        onChange={(e) => setSettings({ ...settings, contactSubheading: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 outline-none text-sm"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Resume Management */}
                    <div className="space-y-6 pt-6 border-t border-white/5">
                        <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 border-l-2 border-orange-500 pl-3">
                            <FaFilePdf className="text-orange-400" /> Resume Document
                        </h3>
                        
                        <div className="bg-black/40 border border-white/10 rounded-xl p-6 flex flex-col md:flex-row items-center gap-6 justify-between">
                            <div className="flex-1 space-y-2 text-center md:text-left">
                                <h4 className="text-sm font-bold text-white">Current Active Resume</h4>
                                <p className="text-[10px] text-zinc-400 uppercase tracking-widest truncate max-w-xs md:max-w-md" title={resumeUrl}>
                                    {resumeUrl === '/resume.pdf' ? 'Local Default (resume.pdf)' : 'Cloud Document (Active)'}
                                </p>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                                <label className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all cursor-pointer ${uploadingResume ? 'bg-zinc-800 text-zinc-500 pointer-events-none' : 'bg-white text-black hover:bg-zinc-200'}`}>
                                    {uploadingResume ? <FaSpinner className="animate-spin" /> : <FaFileUpload />}
                                    {uploadingResume ? 'Uploading...' : 'Upload PDF'}
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="application/pdf"
                                        onChange={handleResumeUpload}
                                        disabled={uploadingResume}
                                    />
                                </label>
                                
                                {resumeUrl !== '/resume.pdf' && (
                                    <button 
                                        type="button"
                                        onClick={handleResumeDelete}
                                        disabled={uploadingResume}
                                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-xs font-bold uppercase tracking-widest"
                                    >
                                        <FaTrash /> Reset
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-white/5">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-8 py-3.5 rounded-xl flex items-center gap-2 shadow-lg hover:shadow-orange-900/40 transition-all text-xs font-bold uppercase tracking-wider font-tech"
                        >
                            <FaSave /> {loading ? 'Synchronizing...' : 'Apply Protocol Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};

export default SettingsManager;
