import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
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
  const renderDynamicIcon = (iconName, props = {}) => {
    // 1. Exact match
    let Icon = Lucide[iconName];

    // 2. Smart Mapping match (case-insensitive)
    if (!Icon) {
      const mappedName = Object.keys(TECH_ICON_MAP).find(
        key => key.toLowerCase() === iconName?.toLowerCase()
      );
      if (mappedName) Icon = Lucide[TECH_ICON_MAP[mappedName]];
    }

    // 3. PascalCase fix attempt
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
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
          opacity: 1,
          y: 0,
          transition: { delay: i * 0.05, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
        }),
      }}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      whileHover={{ y: -5 }}
      className="relative p-5 md:p-6 bg-zinc-900/60 rounded-xl group overflow-hidden border border-white/5 hover:border-white/10 transition-colors backdrop-blur-sm"
    >
      <div
        className="absolute -inset-20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-[60px] -z-10"
        style={{ background: `radial-gradient(circle at center, ${skill.color}, transparent 70%)` }}
      />

      <div className="flex items-start gap-4 mb-6">
        <div
          className="text-2xl md:text-3xl w-12 h-12 md:w-14 md:h-14 rounded-xl bg-zinc-950 flex items-center justify-center border border-white/5 group-hover:border-white/20 transition-all shadow-inner shrink-0"
          style={{ color: skill.color?.replace('0.3', '1') || '#fff' }}
        >
          {renderDynamicIcon(skill.iconName || skill.name, { size: 28 })}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white font-tech tracking-tight group-hover:text-purple-300 transition-colors">{skill.name}</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1">{skill.description}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="h-1.5 w-full bg-zinc-950 rounded-xl overflow-hidden border border-white/5">
          <motion.div
            className="h-full rounded-xl relative"
            style={{
              background: `linear-gradient(to right, ${skill.color?.replace('0.3', '0.5') || '#444'}, ${skill.color?.replace('0.3', '1') || '#fff'})`
            }}
            initial={{ width: 0 }}
            animate={isInView ? { width: `${skill.level}%` } : { width: 0 }}
            transition={{ duration: 1.5, ease: "circOut", delay: 0.3 + index * 0.05 }}
          />
        </div>

        <div className="flex justify-between items-center text-[10px] font-bold text-zinc-600">
          <span className="uppercase tracking-widest truncate max-w-[80%]">{skill.tools}</span>
          <span className="text-white">{skill.level}%</span>
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
    <section id="skills" className="py-20 lg:py-32 relative bg-[#050505] overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 md:px-6  relative z-10">
        <div className="flex flex-col gap-16 md:gap-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-[2px] bg-purple-500" />
                <span className="text-xs font-bold text-purple-400 tracking-[0.4em] uppercase">Capabilities</span>
              </div>
              <h2 className="text-5xl md:text-6xl lg:text-8xl font-black font-tech leading-[0.85] tracking-tighter text-white uppercase italic">
                Tech
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500"> Arsenal.</span>
              </h2>
            </motion.div>
            <div className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest hidden md:block text-right">
              System: Operational<br />
              Stack: v4.0_DYNAMIC
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 w-full">
            {techSkills.length > 0 ? techSkills.map((skill, index) => (
              <SkillCard key={skill.id} skill={skill} index={index} isInView={isInView} />
            )) : (
              <div className="col-span-full py-20 text-center text-zinc-800 font-black uppercase tracking-[0.5em]">Initializing Neural Network...</div>
            )}
          </div>

          {softSkills.length > 0 && (
            <div className="mt-10 md:mt-20">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="mb-8 md:mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-8 h-[2px] bg-purple-500" />
                  <span className="text-xs font-bold text-purple-400 tracking-[0.4em] uppercase">Human Interface</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-tech tracking-tighter uppercase leading-[0.85] italic">
                  Professional
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500"> Ethos.</span>
                </h2>
              </motion.div>

              <div className="space-y-6">
                <MarqueeRow skills={softSkills.slice(0, Math.ceil(softSkills.length / 2))} direction="right" speed={30} />
                <MarqueeRow skills={softSkills.slice(Math.ceil(softSkills.length / 2))} direction="left" speed={30} />
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
    <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex gap-4 pr-4"
        initial={{ x: direction === 'left' ? 0 : "-50%" }}
        animate={{ x: direction === 'left' ? "-50%" : 0 }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
        style={{ width: "max-content" }}
      >
        {[...skills, ...skills, ...skills].map((skill, i) => (
          <div
            key={i}
            className="group relative flex items-center gap-3 px-6 py-4 rounded-xl bg-zinc-900/50 border border-white/5 text-sm md:text-base text-zinc-400 cursor-default hover:text-white hover:border-purple-500/30 transition-all font-bold uppercase tracking-wider shrink-0"
          >
            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl blur-md" />
            <span className="text-lg relative z-10">{skill.emoji}</span>
            <span className="relative z-10">{skill.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Skills;
