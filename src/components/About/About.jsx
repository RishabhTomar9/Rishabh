import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import * as Lucide from 'lucide-react';
import Button from '../Buttons/Buttons';
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
    return <Icon size={24} />;
  };

  return (
    <motion.article
      onMouseMove={onMouseMove}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative p-6 md:p-10 rounded-xl border border-white/5 bg-zinc-900/30 backdrop-blur-xl overflow-hidden transition-all duration-700 ${index === 0 ? 'lg:col-span-2' : 'lg:col-span-1'
        } hover:border-white/10 hover:bg-zinc-900/50 shadow-2xl`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition duration-500"
        style={{
          background: useTransform(
            [mouseX, mouseY],
            ([x, y]) => `radial-gradient(400px circle at ${x}px ${y}px, ${card.color}15, transparent 80%)`
          ),
        }}
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-start justify-between mb-10">
            <div
              className="p-5 rounded-xl bg-zinc-950 border flex items-center justify-center text-white group-hover:scale-110 transition-all duration-700 shadow-3xl"
              style={{ borderColor: `${card.color}30`, color: card.color, boxShadow: `0 0 30px ${card.color}10` }}
            >
              {renderIcon(card.icon)}
            </div>
            <div
              className="flex items-center gap-2.5 px-4 py-1.5 rounded-xl bg-zinc-950 border border-white/5 shadow-inner"
            >
              <div
                className="w-1.5 h-1.5 rounded-xl animate-pulse shadow-lg"
                style={{ backgroundColor: card.color, boxShadow: `0 0 10px ${card.color}` }}
              />
              <span className="text-[10px] font-black text-zinc-500 tracking-[0.2em] uppercase">{card.tag}</span>
            </div>
          </div>

          <h3 className="text-3xl md:text-4xl font-black text-white mb-6 font-tech tracking-tighter uppercase italic leading-none group-hover:translate-x-1 transition-transform duration-500">
            {card.title}
          </h3>
          <p className="text-zinc-500 leading-relaxed text-lg md:text-xl font-medium group-hover:text-zinc-300 transition-colors duration-500 max-w-[90%]">
            {card.description}
          </p>
        </div>

        <div className="mt-12 w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:via-white/10 transition-colors duration-700" />
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
      <div className="text-[10px] font-black text-zinc-800 uppercase tracking-[1em] animate-pulse">Initializing Identity...</div>
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
      color: aboutData.card3Color || '#f97316'
    },
  ];

  return (
    <>
      <section id="about" className="py-24 md:py-48 relative bg-[#050505] overflow-hidden" aria-label="About Section">
        {/* Background Grid System - Synchronized with Resume */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50" />

        <div className="container mx-auto px-6  relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 md:mb-32 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-[1px] bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                <span className="text-[11px] font-black text-emerald-400 tracking-[0.6em] uppercase">{aboutData.subheading}</span>
              </div>
              <h2 className="text-6xl md:text-8xl lg:text-[10rem] font-black font-tech leading-[0.8] tracking-tighter text-white uppercase italic">
                {aboutData.heading.split(' ')[0]}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-600 block md:inline"> {aboutData.heading.split(' ').slice(1).join(' ')}</span>
              </h2>
            </motion.div>

            <div className="lg:text-right space-y-2">
              <div className="inline-flex items-center gap-3 bg-zinc-950 px-5 py-2.5 rounded-xl border border-white/5 shadow-2xl">
                <span className="w-2 h-2 rounded-xl bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none mt-0.5">Live Status: {aboutData.status}</span>
              </div>
              <div className="text-zinc-600 font-bold text-[10px] uppercase tracking-[0.4em] leading-loose pr-4">
                Node: {aboutData.location}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 md:gap-24 items-start">
            <div className="lg:col-span-5 space-y-12">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="space-y-10"
              >
                <div className="relative">
                  <span className="absolute -top-10 -left-6 text-8xl text-white/5 font-black font-tech">"</span>
                  <p className="text-2xl md:text-3xl font-bold italic text-white/90 leading-tight tracking-tight relative z-10">
                    {aboutData.quote}
                  </p>
                </div>

                <p className="text-lg md:text-xl text-zinc-500 font-medium leading-relaxed border-l-2 border-white/5 pl-8 hover:border-emerald-500/30 transition-colors duration-500">
                  {aboutData.mainDescription}
                </p>

                <div className="flex flex-col gap-6 pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center shadow-inner">
                      <Lucide.Cpu className="text-emerald-500" size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Mainstream focus</div>
                      <div className="text-sm font-bold text-white uppercase tracking-tight">Full-Stack & Data Architecture</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center shadow-inner">
                      <Lucide.Activity className="text-purple-500" size={20} />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Systems uptime</div>
                      <div className="text-sm font-bold text-white uppercase tracking-tight">Deployment active in {aboutData.location}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
              {cards.map((card, index) => (
                <AboutCard key={card.id} card={card} index={index} />
              ))}
            </div>
          </div>
        </div >
      </section >
      <Resume />
      <Community />
    </>
  );
};

export default About;