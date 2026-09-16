import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import * as Lucide from 'lucide-react';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';


const Hero = () => {
  const [heroData, setHeroData] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Floating effect based on mouse movement
  const containerRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePosition({ x, y });
  };

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'content', 'hero'), (docSnap) => {
      if (docSnap.exists()) {
        setHeroData(docSnap.data());
      }
    });
    return () => unsub();
  }, []);

  if (!heroData) return <div className="min-h-screen bg-black" />;

  const typewriterStrings = [
    heroData.role1,
    heroData.role2,
    heroData.role3,
    heroData.role4
  ].filter(Boolean);

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center pt-24 md:pt-32 pb-12 md:pb-20 selection:bg-purple-500/30 overflow-hidden bg-black"
    >
      {/* Soft Ambient Background matching About */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-purple-900/10 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/10 blur-[120px] mix-blend-screen" />
      </div>

      {/* Dynamic Grid Background overlay */}
      <motion.div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,#000_60%,transparent_100%)] opacity-40 pointer-events-none" 
      />

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-16 lg:gap-10 items-center">  
        
        {/* LEFT: INSPIRING TYPOGRAPHY */}
        <motion.div
          className="relative z-20 flex flex-col items-start lg:col-span-7"
        >
          {/* Subtle Accent Pill */}
          <motion.div
            className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-2xl mb-8"
          >
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 shadow-[0_0_10px_#3b82f6]"></span>
            </div>
            <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-[0.2em]">{heroData.topPillText || "Visionary Architect"}</span>
          </motion.div>

          {/* Massive Name Display */}
          <h1 className="text-5xl sm:text-8xl font-black text-white mb-6">
            <span className="block text-3xl sm:text-4xl md:text-5xl font-light text-zinc-400 mb-4 tracking-tight">I'm</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-300 to-zinc-600"> {heroData.name}</span>
          </h1>

          {/* Elegant Typewriter */}
          <div className="text-2xl md:text-4xl font-light text-zinc-400 mb-8 h-12 flex items-center tracking-tight gap-4">
            <span className="w-12 h-[1px] bg-gradient-to-r from-blue-500 to-transparent" />
            <Typewriter
              options={{
                strings: typewriterStrings.length > 0 ? typewriterStrings : ["Building The Future..."],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30,
                wrapperClassName: "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-medium",
                cursorClassName: "text-purple-400 opacity-50 font-light"
              }}
            />
          </div>

          {/* Refined Bio */}
          <div className="relative mb-12 max-w-xl">
            <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-gradient-to-b from-blue-500 via-blue-500/20 to-transparent" />
            <p className="text-base md:text-xl text-zinc-400 font-light leading-relaxed pl-8">
              {heroData.description}
              {heroData.company && (
                <span className="block mt-6">
                  Currently innovating at <a href={heroData.companyLink} target="_blank" rel="noopener noreferrer" className="text-white font-bold italic font-tech hover:text-blue-400 transition-colors border-b border-white/20 hover:border-blue-400 pb-0.5">{heroData.company}</a>.
                </span>
              )}
            </p>
          </div>

          {/* Premium Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-5 items-start sm:items-center w-full sm:w-auto mt-4">
            <motion.a
              href="#projects"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto flex justify-center group relative px-8 py-4 bg-white text-black rounded-2xl font-black uppercase tracking-[0.2em] text-xs overflow-hidden duration-500"
            >              
              <span className="relative z-10 flex items-center gap-3">
                Explore Work
                <div className="w-5 h-5 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black transition-colors duration-300">
                  <Lucide.ArrowRight size={12} strokeWidth={3} className="text-black group-hover:text-white transform group-hover:translate-x-0.5 transition-all duration-300" />
                </div>
              </span>
            </motion.a>

            {heroData.resumeLink && (
              <motion.a
                href={heroData.resumeLink}
                target="_blank"
                rel="noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto flex items-center justify-center gap-3 group px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 hover:border-blue-500/50 text-zinc-300 hover:text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all duration-500"
              >
                Access Resume
                <div className="relative w-4 h-4 overflow-hidden">
                  <Lucide.Download size={16} strokeWidth={2.5} className="absolute inset-0 opacity-50 group-hover:translate-y-4 transition-transform duration-300" />
                  <Lucide.Download size={16} strokeWidth={2.5} className="absolute inset-0 text-blue-400 -translate-y-4 group-hover:translate-y-0 transition-transform duration-300" />
                </div>
              </motion.a>
            )}
          </div>
        </motion.div>

        {/* RIGHT: THE FLOATING CANVAS (IMAGE) */}
        <motion.div
          className="relative lg:col-span-5 flex justify-center lg:justify-end perspective-[1000px] mt-12 lg:mt-0"
        >
          {/* Mouse-reactive floating container */}
          <motion.div
            className="relative w-[85%] sm:w-full mx-auto max-w-[440px] aspect-[4/5] rounded-[2rem] transform-gpu group"
            animate={{
              rotateX: mousePosition.y * 15,
              rotateY: mousePosition.x * -15,
              z: 50
            }}
            transition={{ type: "spring", stiffness: 75, damping: 25, mass: 1 }}
          >
            {/* The Image Canvas */}
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden bg-zinc-950 border border-white/5 shadow-[0_30px_80px_rgba(0,0,0,0.8)] flex items-center justify-center">
              {!isImageLoaded && (
                <Lucide.Loader2 className="absolute text-purple-500 animate-spin z-10" size={32} />
              )}
              <img
                src={heroData.heroImage || "/Images/hero-image.jpg"}
                alt={heroData.name}
                onLoad={() => setIsImageLoaded(true)}
                className={`w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-all duration-[2s] ease-out ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading="eager"
              />

              {/* Soft Gradient Overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-transparent pointer-events-none mix-blend-overlay" />
            </div>

            {/* Glowing Aura Behind Image */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-purple-600/20 via-transparent to-blue-600/20 blur-[100px] pointer-events-none -z-10 rounded-full group-hover:opacity-80 transition-opacity duration-500" />

            {/* Floating Glass Element */}
            {heroData.company && (
              <motion.div
                className="absolute -bottom-4 left-4 sm:-bottom-6 sm:-left-6 md:-left-12 z-20 group/pill flex items-center gap-5 p-4 md:p-5 rounded-3xl bg-zinc-900/40 backdrop-blur-3xl border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:bg-zinc-900/60 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-blue-400 group-hover/pill:scale-110 transition-transform">
                  <Lucide.Cpu size={20} strokeWidth={1.5} />
                </div>
                <div className="pr-2">
                  <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-0.5">{heroData.companyPrefix || "Architecting at"}</div>
                  <div className="text-sm font-bold text-zinc-200 tracking-wide">{heroData.company}</div>
                </div>
              </motion.div>
            )}

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;