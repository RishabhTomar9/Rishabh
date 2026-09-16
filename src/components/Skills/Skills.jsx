import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useMotionTemplate, useMotionValue } from "framer-motion";
import * as Lucide from 'lucide-react';
import { db } from '../../firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const TECH_ICON_MAP = {
  'React': 'Atom',
  'JavaScript': 'FileJson',
  'Node.js': 'Server',
  'Firebase': 'Flame',
  'PL/SQL': 'Database',
  'Snowflake': 'Snowflake',
  'HTML': 'Code2',
  'CSS': 'Layers',
  'Design': 'Palette',
  'Git': 'GitBranch',
  'C++': 'Terminal',
  'Python': 'FileCode',
  'SQL': 'Database',
  'MongoDB': 'Leaf',
  'Java': 'Coffee',
  'AWS': 'Cloud'
};

const SkillCard = ({ skill, index, isInView }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const renderDynamicIcon = (iconName, props = {}) => {
    let Icon = Lucide[iconName];

    if (!Icon) {
      const mappedName = Object.keys(TECH_ICON_MAP).find(
        key => key.toLowerCase() === iconName?.toLowerCase()
      );
      if (mappedName) Icon = Lucide[TECH_ICON_MAP[mappedName]];
    }

    if (!Icon && iconName) {
      const pascalName = iconName.charAt(0).toUpperCase() + iconName.slice(1).replace(/\s+/g, '');
      Icon = Lucide[pascalName];
    }

    return Icon ? <Icon {...props} /> : <Lucide.Cpu {...props} />;
  };

  return (
    <motion.div
      custom={index}
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.05, duration: 1, ease: [0.16, 1, 0.3, 1] },
        }),
      }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      onMouseMove={handleMouseMove}
      className="relative p-6 md:p-8 bg-zinc-900/30 rounded-3xl group overflow-hidden border border-white/5 hover:border-white/10 hover:bg-zinc-900/50 transition-colors backdrop-blur-md shadow-2xl"
    >
      

      <div
        className="absolute -right-10 -bottom-10 opacity-[0.02] group-hover:opacity-[0.04] transition-all duration-700 pointer-events-none scale-150 group-hover:scale-125 rotate-12 group-hover:rotate-0"
        style={{ color: skill.color?.replace('0.3', '1') || '#fff' }}
      >
        {renderDynamicIcon(skill.iconName || skill.name, { size: 160 })}
      </div>

      <div className="relative z-20 flex items-start gap-5 mb-8">
        <div
          className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-black/50 flex items-center justify-center border border-white/5 group-hover:border-white/10 transition-all backdrop-blur-xl shrink-0 shadow-lg"
          style={{ color: skill.color?.replace('0.3', '1') || '#fff' }}
        >
          {renderDynamicIcon(skill.iconName || skill.name, { size: 32 })}
        </div>
        <div className="flex flex-col justify-center pt-1">
          <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter transition-colors group-hover:text-zinc-200">
            {skill.name}
          </h3>
          <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.2em] mt-1">{skill.description}</p>
        </div>
      </div>

      <div className="relative z-20 space-y-4">
        {/* Progress Bar Container */}
        <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full rounded-full relative"
            style={{
              background: `linear-gradient(90deg, ${skill.color?.replace('0.3', '0.5') || '#444'}, ${skill.color?.replace('0.3', '1') || '#fff'})`,
              boxShadow: `0 0 15px ${skill.color?.replace('0.3', '0.5') || '#444'}`
            }}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 + index * 0.05 }}
          />
        </div>

        <div className="flex justify-between items-center text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">
          <span className="truncate max-w-[80%]">{skill.tools}</span>
          <span className="text-zinc-300">{skill.level}%</span>
        </div>
      </div>
    </motion.div>
  );
};

const Skills = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [techSkills, setTechSkills] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);

  useEffect(() => {
    const qTech = query(collection(db, 'skills_tech'), orderBy('createdAt', 'asc'));
    const unsubTech = onSnapshot(qTech, (snapshot) => {
      if (!snapshot.empty) {
        setTechSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    });

    const qSoft = query(collection(db, 'skills_soft'), orderBy('createdAt', 'asc'));
    const unsubSoft = onSnapshot(qSoft, (snapshot) => {
      if (!snapshot.empty) {
        setSoftSkills(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    });

    return () => {
      unsubTech();
      unsubSoft();
    };
  }, []);

  return (
    <section id="skills" className="py-24 md:py-40 relative bg-black overflow-hidden" ref={ref}>
      {/* Ambient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[10%] right-[20%] w-[50vw] h-[50vw] rounded-full bg-purple-900/10 blur-[150px] mix-blend-screen" />
          <div className="absolute bottom-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-blue-900/10 blur-[150px] mix-blend-screen" />
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-100 pointer-events-none" />

      <div className="w-full px-6 md:px-12 lg:px-20 relative z-10">
        <div className="flex flex-col gap-24 md:gap-32">
          
          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
              <div className="flex items-center gap-4 mb-8">
                <span className="w-12 h-[1px] bg-gradient-to-r from-purple-500 to-transparent" />
                <span className="text-[10px] font-bold text-purple-400 tracking-[0.4em] uppercase">Capabilities</span>
              </div>
              <h2 className="text-4xl sm:text-6xl font-black text-white uppercase">
                Tech
                <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#e2e8f0,45%,#64748b,55%,#e2e8f0)] bg-[length:200%_auto] animate-[shimmer_3s_infinite]"> Arsenal.</span>
              </h2>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }} className="hidden lg:flex flex-col items-end gap-4 text-right">
              <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 shadow-2xl">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 shadow-[0_0_10px_#3b82f6]"></span>
                </div>
                <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Stack_Status: Online</span>
              </div>
            </motion.div>
          </div>

          {/* Tech Arsenal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8 w-full relative">
            {techSkills.length > 0 ? techSkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} isInView={isInView} />
            )) : (
              <div className="col-span-full py-20 text-center text-zinc-600 font-bold uppercase tracking-[0.5em] text-xs">Initializing Neural Network...</div>
            )}
          </div>

          {/* Soft Skills Section */}
          {softSkills.length > 0 && (
            <div className="mt-12 md:mt-20 flex flex-col gap-12">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <span className="w-12 h-[1px] bg-gradient-to-r from-blue-500 to-transparent" />
                  <span className="text-[10px] font-bold text-blue-400 tracking-[0.4em] uppercase">Human Interface</span>
                </div>
                <h2 className="text-4xl sm:text-6xl font-black text-white uppercase">
                  Professional
                  <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#e2e8f0,45%,#64748b,55%,#e2e8f0)] bg-[length:200%_auto] animate-[shimmer_3s_infinite]"> Ethos.</span>
                </h2>
              </motion.div>

              <div className="space-y-6">
                <MarqueeRow skills={softSkills.slice(0, Math.ceil(softSkills.length / 2))} direction="right" speed={40} />
                <MarqueeRow skills={softSkills.slice(Math.ceil(softSkills.length / 2))} direction="left" speed={40} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const MarqueeRow = ({ skills, direction, speed }) => {
  if (skills.length === 0) return null;
  return (
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
      <motion.div
        className="flex gap-6 pr-6 py-2"
        initial={{ x: direction === 'left' ? 0 : "-50%" }}
        animate={{ x: direction === 'left' ? "-50%" : 0 }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        style={{ width: "max-content" }}
      >
        {[...skills, ...skills, ...skills, ...skills].map((skill, i) => (
          <div
            key={i}
            className="group relative flex items-center gap-4 px-8 py-5 rounded-2xl bg-zinc-900/30 backdrop-blur-md border border-white/5 text-sm md:text-base text-zinc-400 cursor-default hover:text-white hover:bg-zinc-900/60 hover:border-white/10 hover:shadow-2xl transition-all font-bold uppercase tracking-widest shrink-0"
          >
            <span className="text-2xl relative z-10 drop-shadow-lg group-hover:scale-110 transition-transform">{skill.emoji}</span>
            <span className="relative z-10">{skill.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Skills;
