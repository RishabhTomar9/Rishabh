import React, { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Typewriter from 'typewriter-effect';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';


const Hero = () => {
  const { scrollY } = useScroll();
  const [heroData, setHeroData] = useState(null);

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

  // Parallax Scroll Effects
  const yText = useTransform(scrollY, [0, 1000], [0, 200]);
  const yImage = useTransform(scrollY, [0, 1000], [0, 100]);

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
      className="relative min-h-screen flex items-center justify-center pt-24 md:pt-32 pb-12 md:pb-20 selection:bg-purple-500/30 overflow-hidden "
    >


      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 lg:gap-10 items-center">  
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        {/* LEFT: INSPIRING TYPOGRAPHY */}
        <motion.div
          style={{ y: yText }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 flex flex-col items-start"
        >
          {/* Subtle Accent Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="inline-flex items-center gap-3 px-4 py-2 mb-8 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-xl bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-xl h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-bold tracking-[0.2em] text-zinc-300 uppercase">
              Visionary Architect
            </span>
          </motion.div>

          {/* Massive Name Display */}
          <h1 className="text-4xl sm:text-7xl font-black mb-4 md:mb-6">
            <span className="block text-white">
              I'm {heroData.name}
            </span>

          </h1>

          {/* Elegant Typewriter */}
          <div className="text-xl md:text-3xl font-light text-zinc-400 mb-8 h-10 flex items-center tracking-tight gap-3">
            <span className="w-8 h-[1px] bg-purple-500/50" />
            <Typewriter
              options={{
                strings: typewriterStrings.length > 0 ? typewriterStrings : ["Building The Future..."],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30,
                wrapperClassName: "text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-blue-300 font-medium",
                cursorClassName: "text-purple-400 opacity-50 font-light"
              }}
            />
          </div>

          {/* Refined Bio */}
          <p className="text-sm sm:text-base md:text-xl text-zinc-400 max-w-xl mb-8 md:mb-12 leading-relaxed font-light">
            {heroData.description}
            {heroData.company && (
              <span className="block mt-4">
                Currently innovating at <span className="text-white font-bold italic font-tech hover:text-purple-400 transition-colors border-b border-white/20 hover:border-purple-400 pb-0.5">{heroData.company}</span>.
              </span>
            )}
          </p>

          {/* Premium Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 md:gap-5 items-start sm:items-center w-full sm:w-auto">
            <a
              href="#projects"
              className="w-full sm:w-auto flex justify-center group relative px-6 md:px-8 py-3 md:py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest text-[10px] md:text-xs overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Work
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </a>

            {heroData.resumeLink && (
              <a
                href={heroData.resumeLink}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto flex justify-center group px-6 md:px-8 py-3 md:py-4 bg-transparent border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white rounded-xl font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all hover:bg-white/5"
              >
                Access Resume
              </a>
            )}
          </div>
        </motion.div>

        {/* RIGHT: THE FLOATING CANVAS (IMAGE) */}
        <motion.div
          style={{ y: yImage }}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:col-span-1 flex justify-center lg:justify-end perspective-[1000px]"
        >
          {/* Mouse-reactive floating container */}
          <motion.div
            className="relative w-[85%] sm:w-full mx-auto max-w-[440px] aspect-[4/5] rounded-xl sm:rounded-xl transform-gpu mt-8 lg:mt-0"
            animate={{
              rotateX: mousePosition.y * 15,
              rotateY: mousePosition.x * -15,
              z: 50
            }}
            transition={{ type: "spring", stiffness: 75, damping: 25, mass: 1 }}
          >
            {/* The Image Canvas */}
            <div className="absolute inset-0 rounded-xl sm:rounded-xl overflow-hidden bg-zinc-900 border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)]">
              <img
                src={heroData.heroImage || "/Images/hero-image.jpg"}
                alt={heroData.name}
                className="w-full h-full object-cover transform scale-105"
                loading="eager"
              />

              {/* Soft Gradient Overlay for depth */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-transparent pointer-events-none mix-blend-overlay" />
            </div>

            {/* Glowing Aura Behind Image */}
            <div className="absolute -inset-10 bg-gradient-to-tr from-purple-600/30 via-transparent to-blue-600/30 blur-3xl opacity-50 pointer-events-none -z-10 rounded-xl" />

            {/* Floating Glass Element */}
            {heroData.company && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="absolute -bottom-4 left-4 sm:-bottom-6 sm:-left-6 md:-left-12 z-20 bg-black/40 backdrop-blur-xl border border-white/10 p-3 sm:p-5 rounded-xl shadow-2xl flex items-center gap-3 sm:gap-4 max-w-[90%]"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 p-[1px]">
                  <div className="w-full h-full rounded-xl bg-black flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-1">Architecting at</div>
                  <div className="text-white font-bold text-sm tracking-wide">{heroData.company}</div>
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