import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { doc, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
import { FaUserAstronaut, FaCode, FaLaptopCode, FaRocket, FaIdCard, FaImage, FaFileAlt, FaSave, FaPalette, FaCompass } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUpload from './ImageUpload';
import * as Lucide from 'lucide-react';

const HeroAboutManager = () => {
    const [activeTab, setActiveTab] = useState('hero'); // 'hero', 'about'
    const [loading, setLoading] = useState(false);

    const [heroData, setHeroData] = useState({
        name: 'Rishabh Tomar',
        role1: 'Architecting Scalable Systems...',
        role2: 'Building The Future of Tech...',
        role3: 'Data Engineering Expert...',
        role4: 'Forging Digital Experiences...',
        company: 'Zintrix Technologies',
        companyLink: 'https://zintrixtechnologies.com/',
        description: "I'm Rishabh Tomar. Co-Founder & Co-CTO at Zintrix Technologies. I build high-performance ecosystems where data meets design.",
        resumeLink: '',
        heroImage: '/Images/hero-image.jpg'
    });

    const [aboutData, setAboutData] = useState({
        heading: 'Core Engine.',
        subheading: 'Identity',
        location: 'Bhopal, India',
        status: 'Available',
        quote: "I don't just write code; I architect ecosystems where data flows seamlessly into experience.",
        mainDescription: "I bridge the gap between complex data systems and intuitive user interfaces. My approach is centered on scalability and performance-first architecture.",
        // Card 1
        card1Title: 'The Architect',
        card1Tag: 'STRATEGY',
        card1Desc: "I bridge the gap between complex data systems and intuitive user interfaces. My approach is centered on scalability and performance-first architecture.",
        card1Icon: 'User',
        card1Color: '#a855f7',
        // Card 2
        card2Title: 'The Toolkit',
        card2Tag: 'TECHNOLOGY',
        card2Desc: 'Expertise across the MERN stack and Data Engineering mastery in Snowflake. I build modern, data-driven solutions.',
        card2Icon: 'Code',
        card2Color: '#3b82f6',
        // Card 3
        card3Title: 'The Mission',
        card3Tag: 'INNOVATION',
        card3Desc: 'Co-founding Zintrix Technologies to empower businesses with cutting-edge tech. Solving real-world challenges with elegant code.',
        card3Icon: 'Rocket',
        card3Color: '#f97316'
    });

    useEffect(() => {
        const unsubHero = onSnapshot(doc(db, 'content', 'hero'), (docSnap) => {
            if (docSnap.exists()) setHeroData(docSnap.data());
        });

        const unsubAbout = onSnapshot(doc(db, 'content', 'about'), (docSnap) => {
            if (docSnap.exists()) setAboutData(docSnap.data());
        });

        return () => {
            unsubHero();
            unsubAbout();
        };
    }, []);

    const handleHeroSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await setDoc(doc(db, 'content', 'hero'), heroData);
        } catch (error) {
            console.error("Error updating hero:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAboutSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await setDoc(doc(db, 'content', 'about'), aboutData);
        } catch (error) {
            console.error("Error updating about:", error);
        } finally {
            setLoading(false);
        }
    };

    const renderDynamicIcon = (iconName, props = {}) => {
        const Icon = Lucide[iconName] || Lucide.HelpCircle;
        return <Icon {...props} />;
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between md:items-center border-b border-white/5 pb-6 gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        Identity Modules
                        <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-1 rounded border border-blue-500/20 font-bold uppercase">Enhanced v4.0</span>
                    </h2>
                    <p className="text-zinc-500 text-xs uppercase tracking-widest mt-1 font-bold">Configure Personal Core & Brand DNA</p>
                </div>

                <div className="flex bg-zinc-900/50 p-1 rounded-xl border border-white/10 w-full sm:w-fit shadow-lg shadow-black/40">
                    <button
                        onClick={() => setActiveTab('hero')}
                        className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${activeTab === 'hero' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]' : 'text-zinc-500 hover:text-white'}`}
                    >
                        Hero
                    </button>
                    <button
                        onClick={() => setActiveTab('about')}
                        className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${activeTab === 'about' ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(5,150,105,0.4)]' : 'text-zinc-500 hover:text-white'}`}
                    >
                        About
                    </button>
                </div>
            </div>

            <div className="max-w-[1200px] mx-auto">
                <AnimatePresence mode="wait">
                    {activeTab === 'hero' ? (
                        <motion.form
                            key="hero-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            onSubmit={handleHeroSubmit}
                            className="grid lg:grid-cols-12 gap-8"
                        >
                            <div className="lg:col-span-12 bg-zinc-900/60 p-6 md:p-8 rounded-xl border border-white/5 space-y-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-50" />

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><FaIdCard className="text-blue-400" /> Professional Persona</label>
                                                <input
                                                    type="text"
                                                    value={heroData.name}
                                                    onChange={(e) => setHeroData({ ...heroData, name: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none font-bold text-lg"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><FaCompass className="text-blue-400" /> Primary Affiliation</label>
                                                <input
                                                    type="text"
                                                    value={heroData.company}
                                                    onChange={(e) => setHeroData({ ...heroData, company: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none font-bold"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4 pt-4 border-t border-white/5">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] flex items-center gap-2">Dynamic Roles Oscillator</label>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="relative group">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-700 group-focus-within:text-blue-500 transition-colors">0{i}</span>
                                                        <input
                                                            type="text"
                                                            value={heroData[`role${i}`]}
                                                            onChange={(e) => setHeroData({ ...heroData, [`role${i}`]: e.target.value })}
                                                            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 pl-10 text-white focus:border-blue-500 outline-none text-xs font-bold"
                                                            placeholder={`Signal 0${i}`}
                                                            required
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><FaImage className="text-blue-400" /> Visual Identity Core</label>
                                            <ImageUpload
                                                currentImage={heroData.heroImage}
                                                onUpload={(url) => setHeroData({ ...heroData, heroImage: url })}
                                                folder="hero"
                                            />
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={heroData.heroImage}
                                                    onChange={(e) => setHeroData({ ...heroData, heroImage: e.target.value })}
                                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-[9px] text-zinc-600 focus:border-blue-500 outline-none truncate font-bold"
                                                    placeholder="Asset Protocol URL"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><FaFileAlt className="text-blue-400" /> Resume Manifest</label>
                                            <input
                                                type="text"
                                                value={heroData.resumeLink}
                                                onChange={(e) => setHeroData({ ...heroData, resumeLink: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-blue-500 outline-none text-xs font-bold"
                                                placeholder="https://cloud.storage/resume.pdf"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/5">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">Core Directive Description</label>
                                    <textarea
                                        value={heroData.description}
                                        onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-6 text-white focus:border-blue-500 outline-none h-32 resize-none leading-relaxed text-sm font-medium"
                                        required
                                    />
                                </div>

                                <div className="flex justify-end pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-xl flex items-center gap-3 shadow-[0_0_30px_rgba(37,99,235,0.2)] hover:shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all text-[10px] font-black uppercase tracking-[0.2em] font-tech"
                                    >
                                        <FaSave /> {loading ? 'Transmitting...' : 'Update Hero Matrix'}
                                    </button>
                                </div>
                            </div>
                        </motion.form>
                    ) : (
                        <motion.form
                            key="about-form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            onSubmit={handleAboutSubmit}
                            className="space-y-8"
                        >
                            <div className="bg-zinc-900/60 p-8 rounded-xl border border-white/5 space-y-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-50" />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Master Headline</label>
                                            <input
                                                type="text"
                                                value={aboutData.heading}
                                                onChange={(e) => setAboutData({ ...aboutData, heading: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-emerald-500 outline-none font-black text-xl italic"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Geolocation Signal</label>
                                            <input
                                                type="text"
                                                value={aboutData.location}
                                                onChange={(e) => setAboutData({ ...aboutData, location: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-emerald-500 outline-none text-sm font-bold"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Descriptor Tag</label>
                                            <input
                                                type="text"
                                                value={aboutData.subheading}
                                                onChange={(e) => setAboutData({ ...aboutData, subheading: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-emerald-500 outline-none font-bold tracking-[0.2em]"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Availability Status</label>
                                            <input
                                                type="text"
                                                value={aboutData.status}
                                                onChange={(e) => setAboutData({ ...aboutData, status: e.target.value })}
                                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-emerald-400 focus:border-emerald-500 outline-none text-sm font-black uppercase"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-6 border-t border-white/5">
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Manifesto Quote</label>
                                    <textarea
                                        value={aboutData.quote}
                                        onChange={(e) => setAboutData({ ...aboutData, quote: e.target.value })}
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-6 text-white focus:border-emerald-500 outline-none h-24 resize-none italic font-bold text-lg leading-relaxed shadow-inner"
                                        required
                                    />
                                </div>

                                <div className="grid md:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(num => (
                                        <div key={num} className="bg-black/40 p-6 rounded-xl border border-white/5 space-y-6 group hover:border-white/10 transition-all shadow-xl">
                                            <div className="flex items-center justify-between">
                                                <div className="relative group/icon">
                                                    <div
                                                        className="w-12 h-12 rounded-xl bg-zinc-900 border flex items-center justify-center text-xl shadow-2xl"
                                                        style={{ color: aboutData[`card${num}Color`], borderColor: `${aboutData[`card${num}Color`]}40` }}
                                                    >
                                                        {renderDynamicIcon(aboutData[`card${num}Icon`], { size: 24 })}
                                                    </div>
                                                </div>
                                                <input
                                                    type="color"
                                                    value={aboutData[`card${num}Color`] || '#ffffff'}
                                                    onChange={(e) => setAboutData({ ...aboutData, [`card${num}Color`]: e.target.value })}
                                                    className="w-8 h-8 rounded-xl bg-transparent border-none cursor-pointer overflow-hidden shadow-lg translate-x-2"
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Icon Name</label>
                                                    <input
                                                        type="text"
                                                        value={aboutData[`card${num}Icon`]}
                                                        onChange={(e) => setAboutData({ ...aboutData, [`card${num}Icon`]: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white focus:border-emerald-500 outline-none text-[10px] font-bold"
                                                        placeholder="Lucide Icon (e.g. Code)"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Designation</label>
                                                    <input
                                                        type="text"
                                                        value={aboutData[`card${num}Title`]}
                                                        onChange={(e) => setAboutData({ ...aboutData, [`card${num}Title`]: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white focus:border-emerald-500 outline-none text-xs font-black uppercase tracking-tight"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Tag</label>
                                                    <input
                                                        type="text"
                                                        value={aboutData[`card${num}Tag`]}
                                                        onChange={(e) => setAboutData({ ...aboutData, [`card${num}Tag`]: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-white focus:border-emerald-500 outline-none text-[9px] font-black uppercase tracking-widest"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em]">Core Logic</label>
                                                    <textarea
                                                        value={aboutData[`card${num}Desc`]}
                                                        onChange={(e) => setAboutData({ ...aboutData, [`card${num}Desc`]: e.target.value })}
                                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-emerald-500 outline-none h-24 resize-none text-[10px] leading-relaxed font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end pt-8 border-t border-white/5">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-xl flex items-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.2)] hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all text-[10px] font-black uppercase tracking-[0.2em] font-tech"
                                    >
                                        <FaSave /> {loading ? 'Synchronizing...' : 'Update Engine Config'}
                                    </button>
                                </div>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default HeroAboutManager;
