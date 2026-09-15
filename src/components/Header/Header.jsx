import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent, useSpring, useTransform, useMotionValue } from 'framer-motion';
import useScrollSpy from '../../hooks/useScrollSpy';
import MobileNav from './MobileNav';
import DesktopNav from './DesktopNav';
import { Button } from '../ui/button';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Parallax Values for Refraction
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const { scrollY, scrollYProgress } = useScroll();

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = (clientX - left) / width;
    const y = (clientY - top) / height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const gridX = useTransform(mouseX, [0, 1], [-10, 10]);
  const gridY = useTransform(mouseY, [0, 1], [-5, 5]);

  // Smooth scroll progress for the progress bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollItems = ['home', 'about', 'experience', 'skills', 'milestones', 'projects', 'contact'];
  const activeSection = useScrollSpy(scrollItems, 100);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest < 50) {
      setScrolled(false);
    } else {
      setScrolled(true);
    }
  });

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center pointer-events-none group/hdr">
      <motion.div
        onMouseMove={handleMouseMove}
        layout
        className="pointer-events-auto flex items-center justify-between w-full h-16 md:h-20 shadow-[0_30px_60px_rgba(0,0,0,0.7)] relative overflow-hidden backdrop-blur-[100px] border-b border-white/10 px-6 md:px-10 lg:px-20 bg-black/80"
      >
        {/* PARALLAX REFRAC ENGINE: Fresnel Grid & Noise */}
        <motion.div
          style={{ x: gridX, y: gridY }}
          className="absolute inset-[-40px] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.08] mix-blend-overlay pointer-events-none"
        />
        <motion.div
          style={{ x: useTransform(mouseX, [0, 1], [15, -15]), y: useTransform(mouseY, [0, 1], [8, -8]) }}
          className="absolute inset-[-40px] bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:10px_10px] pointer-events-none opacity-20"
        />

        {/* PHYSICAL DASHBOARD REFRAC: Fresnel Top Edge */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/30 to-transparent z-50 pointer-events-none" />

        {/* LEFT: ICONIC BRANDING & LIVE HUD */}
        <div className="flex items-center gap-12 min-w-[240px]">
          <a href="/#home" className="flex items-center gap-5 group/logo relative">
            <motion.div className="flex items-center gap-4" whileHover={{ x: 2 }}>
              <div className="relative">
                <span className="text-2xl md:text-3xl font-black tracking-tighter text-white font-tech italic leading-none block">
                  R<span className="text-purple-500 transition-all duration-700 group-hover/logo:text-white group-hover/logo:drop-shadow-[0_0_15px_#fff]">.</span>
                </span>

                {/* Holographic Fluid Beacon */}
                <motion.div
                  className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-purple-500 blur-[5px]"
                  animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.9, 0.3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />

                {/* Periodic Glitch Effect */}
                <motion.div
                  className="absolute inset-0 bg-white/30 blur-sm opacity-0 group-hover/logo:opacity-100"
                  animate={{ opacity: [0, 0.4, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 15 }}
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-black tracking-tighter text-white uppercase leading-none">Rishabh.</span>
              </div>
            </motion.div>
          </a>
        </div>

        {/* CENTER: NESTED TACTICAL DOCK ENGINE */}
        <div className="hidden md:block">
          <div className="relative p-1.5 rounded-xl bg-white/[0.02] border border-white/5 backdrop-blur-2xl shadow-inner group-hover/hdr:border-white/10 transition-colors duration-700 overflow-hidden">
            {/* Dock Highlight Fresnel */}
            <div className="absolute top-0 left-0 right-0 h-[0.5px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <DesktopNav scrollItems={scrollItems} activeSection={activeSection} />
          </div>
        </div>

        {/* RIGHT: COMMAND CENTER ACTION HUB */}
        <div className="flex items-center gap-10 md:min-w-[240px] justify-end">

          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex group relative overflow-hidden rounded-xl font-black transition-all text-[10px] tracking-[0.2em] uppercase bg-white/5 text-zinc-400 hover:text-white border border-white/5 hover:border-white/20 h-11 px-8 backdrop-blur-md"
            asChild
          >
            <a href="mailto:rishabhtomar9999@gmail.com?subject=Project%20Inquiry">
              <span className="relative z-10 flex items-center gap-3">
                Drop Mail
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-white group-hover:bg-purple-500 transition-all duration-300 shadow-[0_0_12px_#fff]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-purple-800 transition-all duration-500" />
                </div>
              </span>

              {/* Button Reflect Effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <motion.div
                className="absolute inset-0 bg-white/[0.04] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700"
              />
            </a>
          </Button>

          <div className="md:hidden flex items-center">
            <MobileNav menuOpen={menuOpen} setMenuOpen={setMenuOpen} scrollItems={scrollItems} activeSection={activeSection} />
          </div>
        </div>

        {/* ENERGY-PULSE PROGRESS CORE */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.05] overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-600 via-white to-blue-600 relative"
            style={{ scaleX }}
          >
            {/* High-Intensity Bloom */}
            <div className="absolute inset-0 shadow-[0_0_25px_rgba(255,255,255,1)]" />

            {/* Recursive Pulse Animation */}
            <motion.div
              className="absolute inset-0 bg-white/50 blur-md"
              animate={{ x: ["-100%", "250%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* AMBIENT UNDER-GLOW */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[180px] bg-purple-500/[0.03] blur-[150px] pointer-events-none transition-opacity duration-1000 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />
    </header>
  );
};

export default Header;
