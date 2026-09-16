import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaArrowRight, FaCode } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Button from '../Buttons/Buttons';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const ProjectRow = ({ project, index }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const ref = useRef(null);

  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;

    x.set(xPct * 10);
    y.set(yPct * 10);

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className={`relative w-full flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center mb-24 md:mb-40 group`}
    >
      {/* Background Ambient Glow linking the projects */}
      <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? 'left-1/4' : 'right-1/4'} w-1/2 h-[120%] bg-purple-900/10 blur-[120px] rounded-[100%] pointer-events-none -z-10`} />

      {/* Image Side (7 columns) */}
      <div className="w-full lg:w-7/12 relative perspective-[1000px]">
        <Link to={`/projects/${project.id}`} className="block relative">
          <motion.div
            className="relative aspect-[16/10] md:aspect-[16/9] overflow-hidden rounded-[2rem] bg-zinc-900 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5)] group-hover:border-purple-500/30 transition-all duration-700 z-20"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: "preserve-3d" }}
          >
            <img
              src={project.media}
              alt={project.title}
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-[0.16,1,0.3,1]"
              loading="lazy"
            />
            
            {/* Image Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 z-10" />
            
            {/* Quick Action Pill */}
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-30 flex items-center gap-3 bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">Explore Project</span>
              <FaArrowRight className="text-purple-400 text-xs" />
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Content Side (5 columns) */}
      <div className="w-full lg:w-5/12 flex flex-col justify-center relative z-20">
        <div className="flex items-center gap-4 mb-6">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-[0.3em]">Project 0{index + 1}</span>
          <span className="h-[1px] flex-grow bg-gradient-to-r from-purple-500/50 to-transparent" />
        </div>

        <Link to={`/projects/${project.id}`} className="group-hover:translate-x-2 transition-transform duration-500 inline-block w-fit">
          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-white font-tech uppercase tracking-tighter mb-6 hover:text-purple-300 transition-colors">
            {project.title}
          </h3>
        </Link>

        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-transparent" />
          <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-medium line-clamp-4">
            {project.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {project.technologies?.map((tech, i) => (
            <span key={i} className="text-[10px] font-bold px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-zinc-400 uppercase tracking-widest hover:text-purple-300 hover:border-purple-500/30 transition-colors cursor-default">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="group/btn relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-widest text-[10px] overflow-hidden transition-transform hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-purple-200 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 ease-[0.16,1,0.3,1]" />
            <span className="relative z-10 flex items-center gap-3">
              Live Demo <FaExternalLinkAlt className="text-sm" />
            </span>
          </a>
          
          <a
            href="https://github.com/RishabhTomar9"
            target="_blank"
            rel="noreferrer"
            className="w-14 h-14 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-white/30 flex items-center justify-center text-zinc-400 hover:text-white transition-all hover:scale-110 active:scale-95 backdrop-blur-sm"
            title="Source Code"
          >
            <FaGithub className="text-xl" />
          </a>
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [projects, setProjects] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(p => p.status !== 'Archived');

      // Sort: Pinned first, then by createdAt desc (which is already returned by query)
      projectsData.sort((a, b) => {
        if (a.pinned === b.pinned) return 0;
        return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0);
      });
      setProjects(projectsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section id="projects" className="py-24 md:py-40 relative bg-black overflow-hidden">
      {/* Ambient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-purple-900/10 blur-[150px] mix-blend-screen" />
          <div className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/10 blur-[150px] mix-blend-screen" />
      </div>

      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full px-6 md:px-12 lg:px-20 relative z-10">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 md:mb-40 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="w-12 h-[1px] bg-gradient-to-r from-purple-500 to-transparent" />
              <span className="text-[10px] font-bold text-purple-400 tracking-[0.4em] uppercase">Showcase</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white font-tech uppercase">
              <span className="text-transparent bg-clip-text bg-[linear-gradient(110deg,#e2e8f0,45%,#64748b,55%,#e2e8f0)] bg-[length:200%_auto]">
              Featured Works.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex flex-col items-end gap-4 text-right"
          >
            <div className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10 shadow-2xl">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
              </div>
              <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-[0.2em]">Deploy_Status: Online</span>
            </div>
            <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em]">
              Total Archives: <span className="text-white">{projects.length}</span>
            </div>
          </motion.div>
        </div>

        {/* Projects List - Editorial Book-like Split Layout */}
        {loading ? (
          <div className="min-h-[400px] flex justify-center items-center">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin shadow-[0_0_30px_rgba(168,85,247,0.3)]" />
              <div className="absolute inset-0 flex items-center justify-center font-bold text-[10px] text-purple-400 animate-pulse tracking-widest">SYS</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full">
            {projects.map((project, index) => (
              <ProjectRow key={project.id || index} project={project} index={index} />
            ))}
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-32 flex justify-center"
        >
          <a
            href="https://github.com/RishabhTomar9"
            target="_blank"
            rel="noreferrer"
            className="group relative flex items-center justify-center gap-4 px-12 py-6 rounded-3xl bg-zinc-900/50 border border-white/10 hover:border-purple-500/50 hover:bg-zinc-900 transition-all duration-500 backdrop-blur-xl shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl blur-xl" />
            <span className="relative z-10 text-[11px] font-bold text-white uppercase tracking-[0.3em]">Access Full Archive</span>
            <FaArrowRight className="relative z-10 text-purple-400 group-hover:translate-x-2 transition-transform duration-300" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;