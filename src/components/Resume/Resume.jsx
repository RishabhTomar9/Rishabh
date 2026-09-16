import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { Maximize2, Printer, Download, ExternalLink, CloudUpload, Trash2, Loader2, AlertCircle, ShieldCheck, Shield } from 'lucide-react';
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
        <section id="resume" className="py-24 md:py-48 relative bg-black overflow-hidden" aria-label="Resume Section">
            {/* Soft Ambient Background matching About & Hero */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-purple-900/10 blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/10 blur-[120px] mix-blend-screen" />
            </div>

            {/* Dynamic Grid Background overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,#000_60%,transparent_100%)] opacity-40 pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">

                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 md:mb-32 gap-10">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <span className="w-12 h-[1px] bg-gradient-to-r from-purple-500 to-transparent" />
                            <span className="text-[10px] font-bold text-purple-400 tracking-[0.4em] uppercase">Credentials</span>
                        </div>
                        <h2 className="text-5xl sm:text-7xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                            <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#e2e8f0,45%,#64748b,55%,#e2e8f0)] bg-[length:200%_auto] animate-[shimmer_3s_infinite]">Resume.</span>
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                        className="flex flex-col gap-4 lg:items-end"
                    >
                        <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
                            <div className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
                            </div>
                            <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Status: Verified</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 px-2">
                            <span className="font-bold text-[10px] uppercase tracking-[0.3em]">
                                Last Updated: {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

                    {/* Document Preview Container - Occupies 7 columns */}
                    <div className="lg:col-span-7">
                        <motion.div 
                            className="relative flex flex-col gap-4"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1.4, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div
                                ref={containerRef}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={() => {
                                    mouseX.set(425);
                                    mouseY.set(425);
                                }}
                                className="relative w-full h-[500px] md:h-[700px] lg:h-[850px] group rounded-[2rem] bg-zinc-900/40 backdrop-blur-3xl border border-white/10 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] transition-colors duration-500 hover:border-purple-500/50"
                            >
                                {/* Control Bar - Floating Inside */}
                                <div 
                                    className="absolute top-4 left-4 right-4 z-40 flex items-center justify-between bg-black/60 border border-white/10 rounded-2xl p-3 px-5 backdrop-blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 shadow-2xl"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex gap-2 container-dots">
                                            <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                                            <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                                            <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                        </div>
                                        <span className="text-[9px] font-bold text-zinc-300 tracking-[0.3em] uppercase hidden sm:inline-block">RESUME_ACTIVE.PDF</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button onClick={handlePrint} className="p-2.5 hover:bg-white/20 rounded-xl transition-colors text-white" title="Print Document">
                                            <Printer size={16} strokeWidth={2.5} />
                                        </button>
                                        <button onClick={toggleFullScreen} className="p-2.5 hover:bg-white/20 rounded-xl transition-colors text-white" title="Open PDF">
                                            <Maximize2 size={16} strokeWidth={2.5} />
                                        </button>
                                    </div>
                                </div>

                                {/* Dynamic Glare Effect */}
                                <motion.div
                                    className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-500 group-hover:opacity-100 z-30 mix-blend-overlay"
                                    style={{
                                        background: useMotionTemplate`
                                            radial-gradient(
                                                800px circle at ${mouseX}px ${mouseY}px,
                                                rgba(255, 255, 255, 0.4),
                                                transparent 60%
                                            )
                                        `,
                                    }}
                                />

                                {/* Spotlight Effect (Colored) */}
                                <motion.div
                                    className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-500 group-hover:opacity-100 z-20"
                                    style={{
                                        background: useMotionTemplate`
                                            radial-gradient(
                                                600px circle at ${mouseX}px ${mouseY}px,
                                                rgba(168, 85, 247, 0.15),
                                                transparent 70%
                                            )
                                        `,
                                    }}
                                />

                                {/* High-Tech Laser Scanner */}
                                <motion.div
                                    className="absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-purple-400 to-transparent z-40 pointer-events-none opacity-0 group-hover:opacity-70 blur-[1px]"
                                    animate={{ top: ["0%", "100%"] }}
                                    transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                                />
                                <motion.div
                                    className="absolute left-0 right-0 h-[100px] bg-gradient-to-b from-transparent to-purple-500/10 z-30 pointer-events-none opacity-0 group-hover:opacity-100"
                                    animate={{ top: ["-10%", "100%"] }}
                                    transition={{ duration: 3, ease: "linear", repeat: Infinity }}
                                />

                                {/* Resume Live Preview */}
                                <div
                                    className="w-full h-full cursor-pointer relative overflow-hidden rounded-[2rem] p-[2px]"
                                    onClick={() => window.open(resumeUrl, '_blank')}
                                >
                                    <div className="w-full h-full rounded-[calc(2rem-2px)] overflow-hidden bg-black relative">
                                        <iframe
                                            src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                                            title="Resume Preview"
                                            className="w-full h-full object-cover opacity-70 transition-opacity duration-500 pointer-events-none border-none group-hover:opacity-90"
                                        />
                                    </div>

                                    {/* Watermark Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 mix-blend-overlay opacity-30 group-hover:opacity-0 transition-opacity duration-500">
                                        <span className="text-4xl md:text-6xl lg:text-8xl font-black text-white -rotate-45 uppercase tracking-[0.5em] whitespace-nowrap transition-colors duration-500 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">
                                            Interactive
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Action Panel - Occupies 5 columns */}
                    <div className="lg:col-span-5 flex flex-col gap-6 h-full">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                            className="bg-zinc-900/20 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 lg:p-10 relative overflow-hidden group hover:border-white/10 hover:bg-zinc-900/40 transition-all duration-500 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col h-full"
                        >
                            {/* Tech Corner Accent */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/10 to-transparent -z-10 rounded-tr-[2rem]" />
                            <div className="absolute top-8 right-8 w-2 h-2 rounded-xl bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.5)]" />

                            {/* Header */}
                            <h3 className="text-[10px] font-bold text-zinc-400 mb-10 uppercase tracking-[0.3em] flex items-center gap-4">
                                <span className="w-2 h-2 bg-purple-500 rounded-sm rotate-45" />
                                System Operations
                            </h3>

                            {/* Main Actions */}
                            <div className="space-y-4 mb-10">
                                <motion.a
                                    href={resumeUrl}
                                    download="Resume_RishabhTomar.pdf"
                                    target="_blank"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-center gap-3 group/btn relative px-8 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] transition-all duration-500"
                                >
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 -translate-x-[150%] group-hover/btn:translate-x-[150%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-black/10 to-transparent skew-x-12" />
                                    
                                    <span className="relative z-10 flex items-center gap-3">
                                        Secure Download
                                        <div className="w-6 h-6 rounded-full bg-black/10 flex items-center justify-center group-hover/btn:bg-black transition-colors duration-300">
                                            <Download size={12} strokeWidth={3} className="text-black group-hover/btn:text-white transform group-hover/btn:translate-y-0.5 transition-all duration-300" />
                                        </div>
                                    </span>
                                </motion.a>

                                <motion.a
                                    href={resumeUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full flex items-center justify-center gap-3 group/btn px-8 py-5 bg-white/5 backdrop-blur-md border border-white/10 hover:border-purple-500/50 text-zinc-300 hover:text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-500 hover:bg-purple-500/10 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]"
                                >
                                    Open External
                                    <ExternalLink size={14} className="opacity-50 group-hover/btn:opacity-100 group-hover/btn:scale-110 transition-all duration-300" />
                                </motion.a>
                            </div>

                            {/* Enhanced Metadata Grid */}
                            <div className="mt-auto bg-black/40 rounded-2xl p-6 border border-white/5">
                                <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.3em]">Metadata Logs</span>
                                    <div className="flex gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                        <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                                    </div>
                                </div>
                                <div className="space-y-4 font-bold text-[10px] tracking-wide">
                                    <div className="flex justify-between items-center group/meta">
                                        <span className="text-zinc-600 transition-colors group-hover/meta:text-zinc-400">FILE_TYPE</span>
                                        <span className="text-zinc-300 bg-white/5 px-2.5 py-1 rounded border border-white/5">PDF/A-1b</span>
                                    </div>
                                    <div className="flex justify-between items-center group/meta">
                                        <span className="text-zinc-600 transition-colors group-hover/meta:text-zinc-400">SOURCE</span>
                                        <span className="text-zinc-300 truncate max-w-[120px] text-right" title={resumeUrl}>
                                            {resumeUrl === '/resume.pdf' ? 'Local System' : 'Cloud Storage'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center group/meta">
                                        <span className="text-zinc-600 transition-colors group-hover/meta:text-zinc-400">ENCRYPTION</span>
                                        <span className="text-emerald-500 flex items-center gap-1.5">
                                            <ShieldCheck size={12} /> AES-256
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center group/meta">
                                        <span className="text-zinc-600 transition-colors group-hover/meta:text-zinc-400">STATUS</span>
                                        <span className="text-purple-400 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" /> Synced
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Resume;