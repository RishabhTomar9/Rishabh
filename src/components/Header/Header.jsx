import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaWhatsapp, FaTwitter } from 'react-icons/fa';
import { HiOutlineMenuAlt3, HiOutlineX } from 'react-icons/hi';
import useScrollSpy from '../../hooks/useScrollSpy';
import { Button } from '../ui/button';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState(null);

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

  // Lock Body Scroll when Menu is Open
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };

    if (menuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
      window.addEventListener('keydown', handleEsc);
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [menuOpen]);

  // Fetch Admin Settings for Socials & Footer
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'content', 'settings'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    });
    return () => unsub();
  }, []);

  const socialLinks = [];
  if (settings) {
    socialLinks.push({ icon: <FaGithub />, link: settings.github || "https://github.com/RishabhTomar9" });
    socialLinks.push({ icon: <FaWhatsapp />, link: settings.whatsapp || "https://wa.me/+919981909017" });
    socialLinks.push({ icon: <FaLinkedin />, link: settings.linkedin || "https://www.linkedin.com/in/rishabhtomar99/" });
    if (settings.twitter) socialLinks.push({ icon: <FaTwitter />, link: settings.twitter });
    socialLinks.push({ icon: <FaInstagram />, link: settings.instagram || "https://www.instagram.com/_._.rishabh_._/" });
    socialLinks.push({ icon: <FaEnvelope />, link: settings.email ? `mailto:${settings.email}` : "mailto:rishabhtomar9999@gmail.com" });
  } else {
    socialLinks.push(
      { icon: <FaGithub />, link: "https://github.com/RishabhTomar9" },
      { icon: <FaWhatsapp />, link: "https://wa.me/+919981909017" },
      { icon: <FaLinkedin />, link: "https://www.linkedin.com/in/rishabhtomar99/" },
      { icon: <FaInstagram />, link: "https://www.instagram.com/_._.rishabh_._/" },
      { icon: <FaEnvelope />, link: "mailto:rishabhtomar9999@gmail.com" }
    );
  }

  // --- ANIMATION VARIANTS (Optimized for 60fps) ---
  const menuVariants = {
    closed: {
      x: "100vw", // Use viewport units for absolute layout isolation
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
    },
    open: {
      x: "0vw",
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const containerVariants = {
    closed: {
      transition: { staggerChildren: 0.02, staggerDirection: -1 }
    },
    open: {
      transition: { staggerChildren: 0.05, delayChildren: 0.35 } // Delay until drawer mostly open to avoid CPU crunch
    }
  };

  const itemVariants = {
    closed: {
      x: 30,
      opacity: 0,
      transition: { duration: 0.2 }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] flex flex-col items-center pointer-events-none group/hdr">
      {/* MAIN NAVBAR */}
      <motion.div
        onMouseMove={handleMouseMove}
        layout
        className="pointer-events-auto flex items-center justify-between w-full h-16 md:h-20 shadow-[0_20px_40px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-3xl border-b border-white/[0.05] px-6 md:px-10 lg:px-20 bg-black/40"
      >
        {/* DYNAMIC BACKGROUND */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

        {/* PARALLAX REFRAC ENGINE */}
        <motion.div
          style={{ x: gridX, y: gridY }}
          className="absolute inset-[-40px] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.04] mix-blend-screen pointer-events-none"
        />
        <motion.div
          style={{ x: useTransform(mouseX, [0, 1], [15, -15]), y: useTransform(mouseY, [0, 1], [8, -8]) }}
          className="absolute inset-[-40px] bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none opacity-50 [mask-image:radial-gradient(ellipse_60%_100%_at_50%_0%,#000_70%,transparent_100%)]"
        />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-50 pointer-events-none" />

        {/* LOGO */}
        <div className="flex items-center gap-12 min-w-[240px] z-10 relative">
          <a href="/#home" className="flex items-center gap-5 group/logo relative overflow-visible">
            <motion.div className="flex items-center gap-2" >
              <div className="relative">
                <span className="text-3xl font-black  italic  block bg-clip-text text-transparent bg-gradient-to-br from-white via-white/90 to-white/40 drop-shadow-sm">
                  R
                </span>
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[12px] font-black tracking-[0.2em] text-white/80 group-hover/logo:text-white uppercase leading-none transition-colors duration-300">
                  Rishabh
                </span>
                <span className="text-[8px] font-bold tracking-[0.3em] text-purple-400/70 uppercase leading-none mt-1">
                  Portfolio
                </span>
              </div>
            </motion.div>
          </a>
        </div>

        {/* RIGHT: COMMAND HUB (Menu + Email) */}
        <div className="flex items-center gap-4 md:gap-6 justify-end z-10 relative">

          {/* Drop Mail Button (Desktop Only) */}
          <a
            href={`mailto:${settings?.email || 'rishabhtomar9999@gmail.com'}?subject=Project%20Inquiry`}
            className="hidden md:flex group relative items-center gap-4 px-6 py-2.5 rounded-xl overflow-hidden transition-all duration-500 bg-white/[0.02] hover:bg-purple-500/[0.05] border border-white/5 hover:border-purple-500/30 backdrop-blur-md shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]"
          >
            <span className="relative z-10 text-[10px] tracking-[0.25em] font-bold uppercase text-zinc-400 group-hover:text-purple-100 transition-colors duration-300">
              Drop Mail
            </span>

            <div className="relative z-10 flex items-center justify-center w-6 h-6 rounded-xl bg-white/5 group-hover:bg-purple-500/20 transition-all duration-300 border border-white/5 group-hover:border-purple-500/30 shadow-[0_0_10px_rgba(0,0,0,0.5)] overflow-hidden">
              <svg className="w-2.5 h-2.5 text-zinc-400 group-hover:text-purple-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>

            {/* Sweeping Light Effect */}
            <motion.div
              className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-purple-500/10 to-transparent skew-x-[-20deg] pointer-events-none"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
            />
          </a>

          {/* Menu Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`group relative z-[1100] flex items-center gap-4 px-5 py-2.5 focus:outline-none transition-all duration-500 rounded-xl backdrop-blur-md overflow-hidden ${menuOpen
              ? 'bg-transparent text-white border border-transparent'
              : 'bg-white/[0.02] hover:bg-white/[0.08] border border-white/5 hover:border-white/20 text-zinc-300 shadow-lg'}`}
          >
            {!menuOpen && (
              <div className="flex items-center gap-3 hidden sm:flex relative z-10">
                <div className="relative flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-xl bg-purple-500" />
                  <div className="absolute w-1.5 h-1.5 rounded-xl bg-purple-500 animate-ping opacity-75" />
                </div>
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase">Menu</span>
              </div>
            )}

            {/* Subtle Hover Glow Layer */}
            {!menuOpen && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            )}

            <div className="relative z-10">
              <AnimatePresence mode="wait">
                {menuOpen ? (
                  <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <HiOutlineX size={20} className="text-purple-400 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
                  </motion.div>
                ) : (
                  <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.3 }}>
                    <HiOutlineMenuAlt3 size={20} className="group-hover:scale-110 transition-transform duration-300 text-zinc-400 group-hover:text-white" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </button>
        </div>

        {/* PROGRESS BAR */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/[0.05] overflow-hidden">
          <motion.div className="h-full bg-gradient-to-r from-purple-600 via-white to-blue-600 relative" style={{ scaleX }}>
            <div className="absolute inset-0 shadow-[0_0_25px_rgba(255,255,255,1)]" />
            <motion.div
              className="absolute inset-0 bg-white/50 blur-md"
              animate={{ x: ["-100%", "250%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* AMBIENT GLOW */}
      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-[180px] bg-purple-500/[0.03] blur-[150px] pointer-events-none transition-opacity duration-1000 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />

      {/* DRAWER COMPONENT (PORTAL) */}
      {
        createPortal(
          <AnimatePresence>
            {menuOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setMenuOpen(false)}
                  className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999]"
                />

                {/* Drawer Container */}
                <div className="fixed inset-0 z-[10000] pointer-events-none flex justify-end overflow-hidden">
                  <motion.div
                    className="pointer-events-auto w-full md:w-[90%] lg:w-[85%] h-full bg-[#0a0a0a] flex flex-col md:flex-row shadow-[-30px_0_100px_rgba(0,0,0,0.8)] border-l border-white/5 relative transform-gpu will-change-transform"
                    initial="closed"
                    animate="open"
                    exit="closed"
                    variants={menuVariants}
                  >
                    {/* Drawer Background Patterns */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-black pointer-events-none" />

                    {/* Close Button Inside Drawer */}
                    <div className="hidden md:flex absolute top-12 right-12 z-50 items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-xl bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                        <span className="text-xs font-bold text-zinc-500 tracking-[0.25em] uppercase">Rishabh's Portfolio</span>
                      </div>
                      <button
                        onClick={() => setMenuOpen(false)}
                        className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all transform hover:rotate-90 duration-300 border border-white/5"
                      >
                        <HiOutlineX size={24} />
                      </button>
                    </div>

                    {/* LEFT: SOCIALS & FOOTER */}
                    {/* REMOVED backdrop-blur-md for max sliding performance */}
                    <div className="order-2 md:order-1 w-full md:w-[45%] lg:w-[40%] h-full flex flex-col justify-end md:justify-center p-8 sm:p-12 md:p-20 relative z-10 border-t md:border-t-0 md:border-r border-white/5 bg-zinc-950/80">
                      <div className="flex flex-col gap-12 md:max-w-md mx-auto w-full">
                        <div className="hidden md:block mb-6">
                          <h3 className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-bold mb-4">Connect</h3>
                          <div className="w-12 h-[1px] bg-gradient-to-r from-purple-500 to-transparent" />
                        </div>

                        <motion.div
                          variants={containerVariants}
                          className="flex flex-wrap justify-center md:grid md:grid-cols-2 gap-3 md:gap-4"
                        >
                          {socialLinks.map((social, idx) => (
                            <motion.a
                              key={idx}
                              variants={itemVariants}
                              href={social.link}
                              target="_blank"
                              rel="noreferrer"
                              className={`w-14 h-14 sm:w-16 sm:h-16 md:w-full aspect-square md:aspect-auto md:py-5 rounded-xl border border-white/5 bg-white/[0.02] flex flex-row items-center justify-center gap-4 text-zinc-500 hover:text-white hover:bg-white/10 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] transition-all duration-300 group ${socialLinks.length % 2 !== 0 && idx === socialLinks.length - 1 ? 'md:col-span-2' : ''}`}
                            >
                              <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform duration-500 ease-out drop-shadow-lg">
                                {social.icon}
                              </span>
                              <span className="hidden md:block text-[11px] uppercase tracking-[0.2em] font-bold group-hover:tracking-[0.25em] transition-all duration-500">
                                {social.link.includes('github') ? 'GitHub' : social.link.includes('wa.me') ? 'WhatsApp' : social.link.includes('linkedin') ? 'LinkedIn' : social.link.includes('twitter') || social.link.includes('x.com') ? 'Twitter' : social.link.includes('instagram') ? 'Instagram' : 'Email'}
                              </span>
                            </motion.a>
                          ))}
                        </motion.div>

                        <motion.div
                          variants={{ closed: { opacity: 0 }, open: { opacity: 1, transition: { delay: 0.6, duration: 0.5 } } }}
                          className="text-center md:text-left mt-6"
                        >
                          <p className="text-[9px] md:text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">
                            © {new Date().getFullYear()} {settings?.footerCredit || "Rishabh Tomar"}
                          </p>
                        </motion.div>
                      </div>
                    </div>

                    {/* RIGHT: NAVIGATION LINKS */}
                    <div className="order-1 md:order-2 w-full md:w-[55%] lg:w-[60%] h-full flex flex-col justify-center p-8 sm:p-12 md:p-24 relative z-10">

                      {/* Mobile Header Inside Drawer */}
                      <div className="md:hidden flex justify-between items-center mb-10 pb-6 relative z-10 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-xl bg-purple-500 animate-pulse shadow-[0_0_10px_rgba(168,85,247,0.8)]" />
                          <span className="text-[10px] font-bold text-zinc-500 tracking-[0.3em] uppercase">Navigation</span>
                        </div>
                        <button
                          onClick={() => setMenuOpen(false)}
                          className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all transform hover:rotate-90 duration-300"
                        >
                          <HiOutlineX size={20} />
                        </button>
                      </div>

                      <div className="md:max-w-2xl mx-auto w-full">
                        <div className="hidden md:block mb-12">
                          <h3 className="text-white/40 text-[10px] tracking-[0.4em] uppercase font-bold mb-4">Navigation</h3>
                          <div className="w-12 h-[1px] bg-gradient-to-r from-purple-500 to-transparent" />
                        </div>

                        <motion.nav
                          variants={containerVariants}
                          className="flex flex-col gap-1 md:gap-3 relative z-10"
                        >
                          {scrollItems.map((item, i) => (
                            <motion.div
                              key={item}
                              variants={itemVariants}
                              className="overflow-visible"
                            >
                              <a
                                href={`/#${item}`}
                                className="group flex items-center gap-6 md:gap-10 py-1 transition-colors relative"
                                onClick={() => setMenuOpen(false)}
                              >
                                <span className={`text-[10px] md:text-xl font-bold transition-colors duration-500 w-6 md:w-8 tracking-widest ${activeSection === item ? 'text-purple-400' : 'text-zinc-600 group-hover:text-zinc-400'}`}>
                                  0{i + 1}
                                </span>
                                <span className={`text-4xl sm:text-5xl font-black font-tech tracking-tighter uppercase transition-all duration-700 ease-out ${activeSection === item
                                  ? "text-purple-400"
                                  : "text-zinc-700/80 group-hover:text-purple-400 group-hover:translate-x-4"
                                  }`}>
                                  {item}
                                </span>
                                {activeSection === item && (
                                  <motion.div
                                    layoutId="nav-active-indicator"
                                    className="absolute left-[-20px] md:left-[-40px] top-1/2 -translate-y-1/2 w-[3px] md:w-1 h-8 md:h-12 bg-gradient-to-b from-purple-400 to-purple-600 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.8)]"
                                  />
                                )}
                              </a>
                            </motion.div>
                          ))}
                        </motion.nav>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )
      }
    </header>
  );
};

export default Header;
