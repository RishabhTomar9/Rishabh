import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { FaAward, FaMedal, FaTrophy, FaExternalLinkAlt, FaCheckCircle } from 'react-icons/fa';

const CertificateAchievements = () => {
  const [certificates, setCertificates] = useState([]);
  const [badges, setBadges] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubCert = onSnapshot(query(collection(db, 'certificates'), orderBy('createdAt', 'desc')), (snap) => {
      setCertificates(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubBadge = onSnapshot(query(collection(db, 'badges'), orderBy('createdAt', 'desc')), (snap) => {
      setBadges(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubAch = onSnapshot(query(collection(db, 'achievements'), orderBy('createdAt', 'desc')), (snap) => {
      setAchievements(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });

    return () => { unsubCert(); unsubBadge(); unsubAch(); };
  }, []);

  if (loading) return null;

  return (
    <section id="milestones" className="py-32 relative bg-[#050505] overflow-hidden">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-6 relative z-10 ">

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="w-8 h-[2px] bg-purple-500" />
              <span className="text-xs font-bold text-purple-400 tracking-[0.4em] uppercase">Credentials</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black text-white font-tech tracking-tighter uppercase leading-[0.8]">
              Verified
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500"> Milestones.</span>
            </h2>
          </motion.div>
          <div className="text-zinc-500 font-bold text-[10px] uppercase tracking-widest hidden md:block">
            Status: Archive_Updated_2026<br />
            Auth: 2FA_Verified
          </div>
        </div>

        {/* 1. Certificates Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {certificates.map((cert, index) => (
            <motion.a
              key={index}
              href={cert.image}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group relative aspect-video rounded-xl overflow-hidden cursor-pointer block border border-white/5 shadow-2xl bg-zinc-950"
            >
              {/* Full Background Image */}
              <img
                src={cert.image}
                alt={cert.title}
                className="absolute inset-0 w-full h-full object-contain transition-transform duration-700"
              />

              {/* Gradient Overlay - Stronger on Mobile, hover effect on Desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent opacity-90 md:opacity-60 md:group-hover:opacity-80 transition-opacity duration-300" />

              {/* Top Right Link Icon - Always visible on Mobile */}
              <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md p-2.5 rounded-xl border border-white/20 opacity-100 translate-y-0 md:opacity-0 md:translate-y-4 md:group-hover:opacity-100 md:group-hover:translate-y-0 transition-all duration-300 z-20">
                <FaExternalLinkAlt className="text-white text-xs" />
              </div>

              {/* Content Overlay - Always visible on Mobile */}
              <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6 flex flex-col justify-end h-full z-10">
                <div className="transform translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex justify-between items-center mb-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 delay-75">
                    <span className="text-[10px] font-bold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded border border-purple-500/30 uppercase tracking-wider">
                      {cert.date}
                    </span>
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <FaCheckCircle className="text-[10px]" />
                      <span className="text-[9px] font-bold uppercase tracking-widest">Verified</span>
                    </div>
                  </div>

                  <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-white leading-tight mb-1 group-hover:text-purple-100 transition-colors line-clamp-2">
                    {cert.title}
                  </h4>

                  <div className="h-0.5 w-12 md:group-hover:w-full bg-purple-500 mt-3 transition-all duration-500 ease-out" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* 2. Badges Collection */}
        <div className="mb-40">
          <div className="flex items-center justify-center gap-4 mb-20">
            <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-zinc-800" />
            <span className="text-[10px] md:text-xs font-bold text-zinc-500 uppercase tracking-[0.3em] md:tracking-[0.4em] text-center">
              Digital_Assets_Collection
            </span>
            <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-zinc-800" />
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-12 md:gap-20">
            {badges.map((badge, index) => (
              <motion.a
                key={index}
                href={badge.link}
                target="_blank"
                rel="noreferrer"
                className="group relative flex flex-col items-center justify-center p-2 md:p-4"
                whileHover={{ y: -8 }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: "spring" }}
              >
                {/* Pedestal/Background */}
                <div className="absolute inset-0 bg-transparent group-hover:bg-purple-500/5 rounded-xl blur-xl transition-colors duration-500 hidden md:block" />

                <div className="w-20 h-20 md:w-24 md:h-24 relative z-10 flex items-center justify-center transition-all duration-500 drop-shadow-2xl">
                  <img src={badge.image} alt={badge.title} className="w-full h-full object-contain filter drop-shadow-lg" />
                </div>

                {/* Mobile Title (Visible Always) */}
                <div className="mt-4 block md:hidden">
                  <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider text-center max-w-[100px] leading-tight opacity-80">
                    {badge.title}
                  </p>
                </div>

                {/* Enhanced Tooltip (Desktop Only) */}
                <div className="hidden md:block absolute -bottom-12 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-20 pointer-events-none">
                  <div className="bg-zinc-900/90 border border-purple-500/20 px-3 py-2 rounded-xl backdrop-blur-md shadow-2xl flex flex-col items-center">
                    <div className="w-2 h-2 bg-zinc-900 border-t border-l border-purple-500/20 absolute -top-1 left-1/2 -translate-x-1/2 rotate-45" />
                    <p className="text-[9px] font-bold text-zinc-200 uppercase tracking-wider whitespace-nowrap">
                      {badge.title}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* 3. Major Wins */}
        <div className="space-y-10">
          <motion.h3
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-3xl md:text-5xl font-black text-white font-tech uppercase flex items-center gap-5"
          >
            <span className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-500 relative overflow-hidden">
              <span className="absolute inset-0 bg-orange-500/20 blur-lg animate-pulse" />
              <FaTrophy className="text-2xl md:text-3xl relative z-10" />
            </span>
            <span>Hall of Fame</span>
          </motion.h3>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {achievements.map((ach, idx) => (
              <motion.a
                key={idx}
                href={ach.image}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                className="group relative overflow-hidden rounded-xl bg-zinc-900/40 border border-white/5 p-1 transition-colors hover:border-orange-500/30"
              >
                <div className="relative h-full bg-zinc-950/80 rounded-[20px] p-6 md:p-8 flex flex-col sm:flex-row justify-between items-center gap-6 overflow-hidden">

                  {/* Background Glows */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-xl blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-xl blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                  <div className="relative z-10 flex-1 text-center sm:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-orange-500/5 border border-orange-500/10 mb-4">
                      <span className="w-1.5 h-1.5 rounded-xl bg-orange-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">{ach.date}</span>
                    </div>

                    <h4 className="text-xl md:text-2xl font-black text-white leading-tight mb-2 group-hover:text-orange-100 transition-colors">
                      {ach.title}
                    </h4>

                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">
                      Prestigious Achievement
                    </p>
                  </div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:border-orange-500/30 transition-all duration-300">
                      <FaMedal className="text-3xl text-zinc-600 group-hover:text-orange-400 switch-colors duration-300" />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CertificateAchievements;