import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Maximize2, Printer, Download, ExternalLink, FileText, CloudUpload, Trash2, Loader2, AlertCircle } from 'lucide-react';
import Button from '../Buttons/Buttons';
import { auth, db } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const Resume = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const containerRef = useRef(null);

    const [isAdmin, setIsAdmin] = useState(false);
    const [resumeUrl, setResumeUrl] = useState('/resume.pdf');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user && user.email === 'rishabhtomar9999@gmail.com') {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        });

        const unsubscribeDb = onSnapshot(doc(db, 'settings', 'resume'), (docSnap) => {
            if (docSnap.exists() && docSnap.data().url) {
                setResumeUrl(docSnap.data().url);
            } else {
                setResumeUrl('/resume.pdf');
            }
        });

        return () => {
            unsubscribeAuth();
            unsubscribeDb();
        };
    }, []);

    const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
        const { left, top } = currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const handlePrint = () => {
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = resumeUrl;
        document.body.appendChild(iframe);
        
        iframe.onload = () => {
            try {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
            } catch (e) {
                console.error("Print blocked due to cross-origin policies. Opening in new tab instead.");
                window.open(resumeUrl, '_blank');
            }
        };
    };

    const toggleFullScreen = () => {
        window.open(resumeUrl, '_blank');
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            setError("Cloudinary configuration missing in .env");
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        formData.append('folder', 'portfolio');

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            const data = await response.json();

            if (data.secure_url) {
                await setDoc(doc(db, 'settings', 'resume'), {
                    url: data.secure_url,
                    updatedAt: new Date().toISOString()
                });
            } else {
                setError(data.error?.message || "Upload failed");
            }
        } catch (err) {
            setError("Connection error: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete the current resume?")) return;
        
        try {
            setUploading(true);
            await setDoc(doc(db, 'settings', 'resume'), {
                url: '',
                updatedAt: new Date().toISOString()
            });
            setResumeUrl('/resume.pdf');
        } catch (error) {
            setError("Error deleting resume");
        } finally {
            setUploading(false);
        }
    };

    return (
        <section id="resume" className="py-20 lg:py-32 relative bg-[#050505] overflow-hidden" aria-label="Resume Section">
            {/* Background Grid Pattern - Matched with About */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            <div className="container mx-auto px-4 md:px-6  relative z-10">

                {/* Header Section - Matched with About */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 lg:mb-20 gap-6">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="w-8 h-[2px] bg-purple-500" />
                            <span className="text-xs font-bold text-purple-400 tracking-[0.4em] uppercase">Credentials</span>
                        </div>
                        <h2 className="text-5xl md:text-6xl lg:text-8xl font-black font-tech leading-[0.85] tracking-tighter text-white uppercase">
                            Resu
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">me.</span>
                        </h2>
                    </motion.div>

                    <div className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest hidden md:block text-right">
                        Last Updated: {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })} <br />
                        Status: Verified
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                    {/* Document Preview Container - Occupies 8 columns */}
                    <div className="lg:col-span-8 flex flex-col gap-4 relative">

                        <motion.div
                            ref={containerRef}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            onMouseMove={handleMouseMove}
                            className="relative w-full h-[400px] md:h-[600px] lg:h-[850px] group rounded-xl bg-zinc-950 border border-white/5 overflow-hidden shadow-2xl transition-all duration-500 hover:border-purple-500/30"
                        >
                            {/* Control Bar - Floating Inside */}
                            <div className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between bg-zinc-900/90 border border-white/10 rounded-xl p-2 px-4 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-1.5 container-dots">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50" />
                                    </div>
                                    <span className="text-[10px] font-bold text-zinc-400 tracking-wider hidden sm:inline-block">RESUME_ACTIVE.PDF</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button onClick={handlePrint} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white" title="Print Document">
                                        <Printer className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={toggleFullScreen} className="p-2 hover:bg-white/10 rounded-lg transition-colors text-zinc-400 hover:text-white" title="Open PDF">
                                        <Maximize2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {/* Spotlight Effect */}
                            <motion.div
                                className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-500 group-hover:opacity-100 z-20"
                                style={{
                                    background: useMotionTemplate`
                                        radial-gradient(
                                            800px circle at ${mouseX}px ${mouseY}px,
                                            rgba(168, 85, 247, 0.1),
                                            transparent 80%
                                        )
                                    `,
                                }}
                            />

                            {/* Scanner Animation */}
                            <motion.div
                                className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500 to-transparent z-30 pointer-events-none opacity-70"
                                animate={{ top: ["0%", "100%"] }}
                                transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                            />

                            {/* Grid Overlay for Texture */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none z-10" />

                            {/* Resume Live Preview */}
                            <div
                                className="w-full h-full bg-zinc-900 cursor-pointer relative overflow-hidden"
                                onClick={() => window.open(resumeUrl, '_blank')}
                            >
                                <iframe
                                    src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                    title="Resume Preview"
                                    className="w-full h-full object-cover opacity-80 transition-opacity duration-300 pointer-events-none border-none"
                                />

                                {/* Watermark Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                    <span className="text-3xl md:text-5xl lg:text-7xl font-black text-black/40 -rotate-45 uppercase tracking-widest whitespace-nowrap transition-colors duration-300">
                                        Click to Zoom
                                    </span>
                                </div>
                            </div>

                            {/* Edge Accents */}
                            <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-purple-500/20 rounded-tl-2xl z-20 pointer-events-none" />
                            <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-purple-500/20 rounded-br-2xl z-20 pointer-events-none" />
                        </motion.div>
                    </div>

                    {/* Right Action Panel - Enhanced */}
                    <div className="lg:col-span-4 flex flex-col gap-4 h-full">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-zinc-900/60 border border-white/5 rounded-xl p-6 lg:p-8 backdrop-blur-xl relative overflow-hidden group h-full flex flex-col"
                        >
                            {/* Tech Corner Accent */}
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-purple-500/10 to-transparent -z-10 rounded-tr-2xl" />
                            <div className="absolute top-6 right-6 w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />

                            {/* Header */}
                            <h3 className="text-xs font-bold text-zinc-400 mb-8 uppercase tracking-[0.2em] flex items-center gap-3 border-b border-white/5 pb-4">
                                <span className="w-2 h-2 bg-purple-500 rounded-sm rotate-45" />
                                System Operations
                            </h3>

                            {/* Main Actions */}
                            <div className="space-y-4 mb-8">
                                <Button
                                    href={resumeUrl}
                                    download="Resume_RishabhTomar.pdf"
                                    target="_blank"
                                    variant="primary"
                                    className="!w-full !justify-center !py-4 shadow-lg shadow-purple-900/20"
                                >
                                    <span className="flex items-center gap-3">
                                        <Download className="w-4 h-4" />
                                        <span>Secure Download</span>
                                    </span>
                                </Button>
                                <Button
                                    href={resumeUrl}
                                    target="_blank"
                                    variant="ghost"
                                    className="!w-full !justify-center !py-4 !bg-white/5 hover:!bg-white/10"
                                >
                                    <span className="flex items-center gap-3">
                                        <ExternalLink className="w-4 h-4" />
                                        <span>Open External</span>
                                    </span>
                                </Button>
                            </div>

                            

                            {/* Enhanced Metadata Grid */}
                            <div className="mt-auto bg-black/20 rounded-xl p-4 border border-white/5">
                                <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Metadata</span>
                                    <div className="flex gap-1">
                                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                                        <div className="w-1 h-1 rounded-full bg-zinc-700" />
                                    </div>
                                </div>
                                <div className="space-y-3 font-bold text-[10px]">
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-600">FILE_TYPE</span>
                                        <span className="text-zinc-300 bg-white/5 px-2 py-0.5 rounded">PDF/A-1b</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-600">SOURCE</span>
                                        <span className="text-zinc-300 truncate max-w-[100px] text-right" title={resumeUrl}>
                                            {resumeUrl === '/resume.pdf' ? 'Local Asset' : 'Cloud Storage'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-600">ENCRYPTION</span>
                                        <span className="text-emerald-500">AES-256</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-zinc-600">STATUS</span>
                                        <span className="text-purple-400">Synced</span>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative Bottom Bar */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-purple-500/20" />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Resume;