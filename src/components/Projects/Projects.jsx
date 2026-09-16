import React, { useRef } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaExternalLinkAlt, FaCode, FaGithub, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Button from '../Buttons/Buttons';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

const ProjectCard = ({ project }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const ref = useRef(null);

  const x = useSpring(0, { stiffness: 300, damping: 30 });
  const y = useSpring(0, { stiffness: 300, damping: 30 });

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;

    x.set(xPct * 10); // Reduced tilt for better usability
    y.set(yPct * 10);

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className="group relative flex flex-col rounded-xl bg-zinc-900/40 border border-white/5 overflow-hidden transition-all duration-500 hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-900/10 hover:-translate-y-1 h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-500 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(168, 85, 247, 0.10),
              transparent 80%
            )
          `,
        }}
      />

      {/* Image Container */}
      <Link
        to={`/projects/${project.id}`}
        className="block relative aspect-[16/9] overflow-hidden bg-zinc-950 border-b border-white/5 cursor-pointer z-20 group/image"
      >
        <div className="absolute inset-0 bg-zinc-900 animate-pulse" /> {/* Placeholder loading state */}
        <img
          src={project.media}
          alt={project.title}
          className="w-full h-full object-cover opacity-80 group-hover/image:opacity-100 group-hover/image:scale-105 transition-all duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent opacity-60" />

        {/* Mobile/Quick Action Overlay - Subtle hint */}
        <div className="absolute top-4 right-4 bg-purple-500/90 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shadow-lg">
          View Details <FaArrowRight />
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-grow p-6 md:p-8 z-20 relative">
        <div className="flex justify-between items-start mb-4 gap-4">
          <Link to={`/projects/${project.id}`} className="group-hover:underline decoration-purple-500/50 underline-offset-4 decoration-2">
            <h3 className="text-2xl font-black text-white font-tech tracking-tight leading-none group-hover:text-purple-400 transition-colors duration-300">
              {project.title}
            </h3>
          </Link>

          {/* Action Buttons - Always visible for better UX */}
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 flex items-center justify-center text-zinc-400 hover:text-white transition-all hover:scale-110 active:scale-95"
              title="Live Demo"
            >
              <FaExternalLinkAlt className="text-sm" />
            </a>
            <a
              href="https://github.com/RishabhTomar9" // Using generic logic as specific repo wasn't in DB usually
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-purple-500/30 flex items-center justify-center text-zinc-400 hover:text-white transition-all hover:scale-110 active:scale-95"
              title="Source Code"
            >
              <FaGithub className="text-lg" />
            </a>
          </div>
        </div>

        <p className="text-zinc-400 text-sm mb-6 leading-relaxed font-medium line-clamp-3">
          {project.description}
        </p>

        <div className="mt-auto pt-6 border-t border-white/5">
          <div className="flex flex-wrap gap-2">
            {project.technologies.slice(0, 5).map((tech, i) => (
              <span key={i} className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-purple-500/5 border border-purple-500/10 text-purple-300/80 group-hover:border-purple-500/20 group-hover:bg-purple-500/10 transition-all uppercase tracking-wider">
                {tech}
              </span>
            ))}
            {project.technologies.length > 5 && (
              <span className="text-[10px] font-bold px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-zinc-500 uppercase tracking-wider">
                +{project.technologies.length - 5}
              </span>
            )}
          </div>
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
    <section id="projects" className="py-24 md:py-32 relative bg-[#050505] overflow-hidden">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 ">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="w-12 h-[2px] bg-gradient-to-r from-purple-500 to-transparent" />
              <span className="text-xs font-bold text-purple-400 tracking-[0.3em] uppercase glow-text">Showcase</span>
            </div>
            <h2 className="text-6xl lg:text-7xl font-black text-white font-tech uppercase">
              Featured
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 via-zinc-200 to-zinc-500 bg-300% animate-gradient">Works.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-zinc-500 font-bold text-[10px] md:text-xs uppercase tracking-widest text-left md:text-right border-l md:border-l-0 md:border-r border-white/10 pl-4 md:pl-0 md:pr-4 py-1"
          >
            <p>System Status: <span className="text-emerald-500">Online</span></p>
            <p>Selection: <span className="text-white">Premium</span></p>
            <p>Total Archives: <span className="text-white">{projects.length}</span></p>
          </motion.div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="min-h-[400px] flex justify-center items-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-xl animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center font-bold text-[10px] font-bold text-purple-500 animate-pulse">LOAD</div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {projects.map((project, index) => (
              <ProjectCard key={project.id || index} project={project} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 md:mt-32 text-center"
        >
          <Button
            href="https://github.com/RishabhTomar9"
            variant="ghost"
            className="group !px-8 !py-4 md:!px-12 md:!py-6 uppercase tracking-[0.2em] text-[10px] md:text-xs border border-white/10 bg-zinc-900/50 hover:bg-zinc-900 hover:border-purple-500/50 transition-all rounded-xl backdrop-blur-md"
          >
            Access Full Archive <span className="group-hover:translate-x-1 transition-transform inline-block ml-2">→</span>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};


export default Projects;