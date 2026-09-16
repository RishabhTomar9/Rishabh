import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useMotionTemplate } from 'framer-motion';
import * as Lucide from 'lucide-react';
import { db } from '../../firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import Resume from '../Resume/Resume';
import Community from './Community';

const AboutCard = ({ card, index }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function onMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const renderIcon = (iconName) => {
    const Icon = Lucide[iconName] || Lucide.HelpCircle;
    return <Icon size={20} strokeWidth={2} />;
  };

  return (
    <motion.article
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative p-8 md:p-10 rounded-[2rem] border border-white/5 bg-zinc-900/20 backdrop-blur-3xl overflow-hidden transition-all duration-500 ${index === 0 ? 'lg:col-span-2' : 'lg:col-span-1'
        } hover:border-white/10 hover:bg-zinc-900/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]`}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, ${card.color}15, transparent 70%)`
        }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-transform duration-500 group-hover:scale-110 shadow-inner border border-white/10"
            style={{ backgroundColor: `${card.color}15`, color: card.color }}
          >
            {renderIcon(card.icon)}
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
            <div
              className="w-1.5 h-1.5 rounded-full animate-pulse shadow-sm"
              style={{ backgroundColor: card.color, boxShadow: `0 0 8px ${card.color}` }}
            />
            <span className="text-[9px] font-bold text-zinc-400 tracking-[0.2em] uppercase">{card.tag}</span>
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight relative">
          <span className="text-white group-hover:opacity-0 transition-opacity duration-500">
            {card.title}
          </span>
          <span 
            className="absolute left-0 top-0 text-transparent bg-clip-text opacity-0 group-hover:opacity-100 transition-opacity duration-500" 
            style={{ backgroundImage: `linear-gradient(to right, #fff, ${card.color})` }}
          >
            {card.title}
          </span>
        </h3>
        
        <p className="text-sm md:text-base text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors duration-500">
          {card.description}
        </p>

        {/* Decorative Bottom Line */}
        <div className="mt-auto pt-8">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-white/20 transition-colors duration-500" />
        </div>
      </div>
    </motion.article>
  );
};

const About = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'content', 'about'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAboutData(data);
      }
    });
    return () => unsub();
  }, []);

  if (!aboutData) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.5em] animate-pulse">Initializing Identity...</div>
    </div>
  );

  const cards = [
    {
      id: 'card-1',
      icon: aboutData.card1Icon || 'User',
      title: aboutData.card1Title,
      tag: aboutData.card1Tag,
      description: aboutData.card1Desc,
      color: aboutData.card1Color || '#a855f7'
    },
    {
      id: 'card-2',
      icon: aboutData.card2Icon || 'Code',
      title: aboutData.card2Title,
      tag: aboutData.card2Tag,
      description: aboutData.card2Desc,
      color: aboutData.card2Color || '#3b82f6'
    },
    {
      id: 'card-3',
      icon: aboutData.card3Icon || 'Rocket',
      title: aboutData.card3Title,
      tag: aboutData.card3Tag,
      description: aboutData.card3Desc,
      color: aboutData.card3Color || '#10b981'
    },
  ];

  return (
    <>
      <section id="about" className="py-24 md:py-48 relative bg-black overflow-hidden" aria-label="About Section">
        {/* Soft Ambient Background matching Hero */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-emerald-900/10 blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-blue-900/10 blur-[120px] mix-blend-screen" />
        </div>

        {/* Dynamic Grid Background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_0%,#000_60%,transparent_100%)] opacity-40 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          
          {/* Header Row */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 md:mb-32 gap-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-[1px] bg-gradient-to-r from-emerald-500 to-transparent" />
                <span className="text-[10px] font-bold text-emerald-400 tracking-[0.4em] uppercase">{aboutData.subheading}</span>
              </div>
              
              <h2 className="text-5xl sm:text-7xl md:text-8xl font-black text-white">
                {aboutData.heading.split(' ')[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-zinc-300 to-zinc-600"> {aboutData.heading.split(' ').slice(1).join(' ')}</span>
              </h2>
            </motion.div>

            {/* Status Indicators */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col gap-4 lg:items-end"
            >
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
                </div>
                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Status: {aboutData.status}</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-500 px-2">
                <Lucide.MapPin size={14} className="text-zinc-600" />
                <span className="font-bold text-[10px] uppercase tracking-[0.3em]">
                  Node: {aboutData.location}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
            
            {/* Left Column: Bio & Quote */}
            <div className="lg:col-span-5 space-y-16">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-12"
              >
                {/* Manifesto Quote */}
                <div className="relative">
                  <span className="absolute -top-12 -left-6 text-9xl text-white/5 font-black leading-none pointer-events-none">"</span>
                  <p className="text-3xl md:text-4xl font-light italic text-white/90 leading-[1.3] tracking-tight relative z-10">
                    {aboutData.quote}
                  </p>
                </div>

                {/* Main Description */}
                <div className="relative">
                  <div className="absolute left-0 top-2 bottom-2 w-[2px] bg-gradient-to-b from-emerald-500 via-emerald-500/20 to-transparent" />
                  <p className="text-base md:text-xl text-zinc-400 font-light leading-relaxed pl-8">
                    {aboutData.mainDescription}
                  </p>
                </div>

                {/* Info Pills */}
                <div className="flex flex-col gap-4 pt-4">
                  <div className="group flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                      <Lucide.Cpu size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-0.5">Focus Area</div>
                      <div className="text-sm font-bold text-zinc-200 tracking-wide">{aboutData.focusArea || "Full-Stack & Data Architecture"}</div>
                    </div>
                  </div>
                  
                  <div className="group flex items-center gap-5 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                      <Lucide.Globe size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <div className="text-[9px] font-bold text-zinc-500 uppercase mb-0.5">Operations</div>
                      <div className="text-sm font-bold text-zinc-200 tracking-wide">Deployement active from {aboutData.location}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Bento Grid Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {cards.map((card, index) => (
                <AboutCard key={card.id} card={card} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Existing Sub-sections */}
      <Resume />
      <Community />
    </>
  );
};

export default About;