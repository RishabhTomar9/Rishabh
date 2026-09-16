import React, { useState } from 'react';
import { CloudUpload, Loader2, CheckCircle2, AlertCircle, Trash2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageUpload = ({ onUpload, onUploadMultiple, currentImage, folder = 'portfolio', multiple = false }) => {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [preview, setPreview] = useState(currentImage);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

    const handleUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        if (!cloudName || !uploadPreset) {
            setError("Cloudinary configuration missing in .env");
            return;
        }

        setUploading(true);
        setError(null);

        try {
            if (multiple && onUploadMultiple) {
                const uploadPromises = files.map(file => {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', uploadPreset);
                    formData.append('folder', folder);
                    return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                        method: 'POST',
                        body: formData,
                    }).then(res => res.json());
                });

                const results = await Promise.all(uploadPromises);
                const urls = results.filter(data => data.secure_url).map(data => data.secure_url);
                if (urls.length > 0) {
                    onUploadMultiple(urls);
                } else {
                    setError("All uploads failed.");
                }
            } else {
                const file = files[0];
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', uploadPreset);
                formData.append('folder', folder);

                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                const data = await response.json();

                if (data.secure_url) {
                    setPreview(data.secure_url);
                    if (onUpload) onUpload(data.secure_url);
                } else {
                    setError(data.error?.message || "Upload failed");
                }
            }
        } catch (err) {
            setError("Connection error: " + err.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="group relative">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-black/40 border border-white/5 backdrop-blur-xl group-hover:border-purple-500/20 transition-all duration-500">
                {/* Preview Frame */}
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-zinc-900 border border-white/10 overflow-hidden shadow-2xl flex-shrink-0 group/preview">
                    <AnimatePresence mode="wait">
                        {preview && !multiple ? (
                            <motion.img
                                key="preview"
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover/preview:scale-110"
                            />
                        ) : multiple ? (
                            <motion.div
                                key="placeholder-multiple"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-700 bg-purple-500/5"
                            >
                                <CloudUpload className="w-8 h-8 text-purple-500/40" />
                                <span className="text-[8px] font-black uppercase tracking-widest text-purple-500/40">Batch Mode</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="placeholder"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full h-full flex flex-col items-center justify-center gap-2 text-zinc-700"
                            >
                                <ImageIcon className="w-8 h-8 opacity-20" />
                                <span className="text-[8px] font-black uppercase tracking-widest opacity-20">No Asset</span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {uploading && (
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-2 z-10">
                            <Loader2 className="w-6 h-6 text-purple-500 animate-spin" />
                            <span className="text-[8px] font-black text-purple-500 uppercase tracking-widest animate-pulse">Syncing...</span>
                        </div>
                    )}
                </div>

                {/* Upload Controls */}
                <div className="flex-1 w-full space-y-4">
                    <div className="space-y-1">
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Asset Management</h4>
                        <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider leading-relaxed">
                            {multiple ? 'Select multiple assets to upload simultaneously' : (preview ? 'Existing asset detected in cloud storage' : 'Deploy new visual asset to secure server')}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <label className="relative cursor-pointer group/label">
                            <div className={`px-5 py-3 rounded-xl border transition-all flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] overflow-hidden relative ${uploading ? 'bg-zinc-800 border-white/5 text-zinc-600 cursor-not-allowed' : 'bg-white text-black hover:bg-zinc-200 shadow-lg group-hover/label:shadow-purple-500/10'
                                }`}>
                                <CloudUpload className={`w-4 h-4 ${uploading ? 'animate-bounce' : ''}`} />
                                {uploading ? 'Processing' : (multiple ? 'Upload Multiple' : (preview ? 'Replace Node' : 'Upload Node'))}
                            </div>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                multiple={multiple}
                                onChange={handleUpload}
                                disabled={uploading}
                            />
                        </label>

                        {preview && !uploading && !multiple && (
                            <button
                                onClick={() => { setPreview(null); onUpload(''); }}
                                className="p-3 rounded-xl border border-white/5 bg-white/5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 hover:border-red-400/20 transition-all"
                                title="Clear Asset"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Status Feedback */}
                    <div className="min-h-[16px] flex items-center gap-3">
                        <AnimatePresence mode="wait">
                            {error ? (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-red-400 text-[8px] font-black uppercase tracking-widest flex items-center gap-2"
                                >
                                    <AlertCircle className="w-3 h-3" /> {error}
                                </motion.span>
                            ) : preview && !uploading ? (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-emerald-500 text-[8px] font-black uppercase tracking-widest flex items-center gap-2"
                                >
                                    <CheckCircle2 className="w-3 h-3 shadow-[0_0_10px_#10b981]" /> Asset Live & Synchronized
                                </motion.span>
                            ) : null}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Background Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/0 via-purple-500/0 to-blue-500/0 rounded-xl blur group-hover:from-purple-500/5 group-hover:to-blue-500/5 -z-10 transition-all duration-500" />
        </div>
    );
};

export default ImageUpload;
