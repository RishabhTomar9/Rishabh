import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, addDoc, serverTimestamp, doc, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaGithub, FaLinkedin, FaTwitter, FaInstagram,
  FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaLock,
  FaUser, FaCommentDots
} from 'react-icons/fa';

const Footer = () => {
  const form = useRef();
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [currentTime, setCurrentTime] = useState(new Date());
  const [settings, setSettings] = useState(null);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'content', 'settings'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data());
      }
    });
    return () => unsub();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    if (!db) {
      console.error("FIREBASE ERROR: Database instance undefined.");
      setStatus('error');
      return;
    }

    const formData = new FormData(form.current);
    const name = formData.get('user_name');
    const email = formData.get('user_email');
    const messageContent = formData.get('message');

    const emailData = {
      to: settings?.email || 'rishabhtomar9999@gmail.com',
      message: {
        subject: `Portfolio Inquiry from ${name}`,
        html: `
          <div style="font-family: monospace; padding: 20px; background: #f4f4f5; border-radius: 8px;">
            <h2 style="color: #6366f1;">New Portfolio Inquiry</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <hr style="border: 1px solid #e4e4e7;" />
            <p style="white-space: pre-wrap;">${messageContent}</p>
          </div>
        `,
      },
      name: name,
      email: email,
      content: messageContent,
      timestamp: serverTimestamp(),
    };

    try {
      await addDoc(collection(db, "mail"), emailData);
      setStatus('success');
      setTimeout(() => setStatus('idle'), 5000);
      form.current.reset();
    } catch (error) {
      console.error("FIREBASE ERROR:", error);
      setStatus('error');
    }
  };

  const contactItems = [
    {
      icon: <FaEnvelope />,
      label: "Email",
      value: "Email",
      detail: settings?.email || "rishabhtomar9999@gmail.com",
      href: `mailto:${settings?.email || "rishabhtomar9999@gmail.com"}`,
      color: "purple"
    },
    {
      icon: <FaPhoneAlt />,
      label: "Phone",
      value: "Phone",
      detail: "+91 9981909017",
      href: "tel:+919981909017",
      color: "blue"
    },
    {
      icon: <FaMapMarkerAlt />,
      label: "Location",
      value: "Location",
      detail: settings?.location || "Bhopal, India",
      href: "#",
      color: "yellow"
    }
  ];

  const socialLinks = [
    { icon: <FaGithub />, link: settings?.github || "https://github.com/RishabhTomar9", label: "GitHub" },
    { icon: <FaLinkedin />, link: settings?.linkedin || "https://www.linkedin.com/in/rishabhtomar99/", label: "LinkedIn" },
    { icon: <FaTwitter />, link: settings?.twitter || "https://x.com/Rishabh03tomar", label: "Twitter" },
    { icon: <FaInstagram />, link: settings?.instagram || "https://www.instagram.com/_._.rishabh_._/", label: "Instagram" }
  ].filter(s => s.link);

  return (
    <footer className="relative pt-32 pb-12 bg-[#050505] overflow-hidden" id="contact">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="container mx-auto px-6 relative z-10 ">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="flex items-center gap-3 mb-8">
                <span className="w-8 h-[2px] bg-purple-500" />
                <span className="text-sm font-bold text-purple-400 tracking-[0.3em] uppercase">Contact</span>
              </div>

              <h2 className="text-6xl sm:text-7xl md:text-8xl font-black mb-8 tracking-tighter uppercase text-white leading-[0.85] italic">
                {settings?.contactHeading?.split(' ')[0] || 'Get In'} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                  {settings?.contactHeading?.split(' ').slice(1).join(' ') || 'Touch.'}
                </span>
              </h2>

              <p className="text-zinc-400 text-lg sm:text-xl mb-12 max-w-sm leading-relaxed font-bold">
                {settings?.contactSubheading || "Have a vision? Let's build it. I'm currently looking for new opportunities and high-impact collaborations."}
              </p>

              <div className="space-y-8">
                {contactItems.map((item, i) => (
                  <motion.a key={i} href={item.href} whileHover={{ x: 10 }} className="flex items-center gap-6 group cursor-pointer">
                    <div className="w-14 h-14 rounded-xl bg-zinc-900/50 border border-white/5 flex items-center justify-center text-xl transition-all duration-300 group-hover:border-purple-500/50 group-hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]">{item.icon}</div>
                    <div>
                      <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-white text-lg sm:text-xl font-bold tracking-tight group-hover:text-purple-400 transition-colors uppercase font-tech">{item.detail}</p>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div className="lg:col-span-7 w-full" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-6 sm:p-10 md:p-12 rounded-xl shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-xl blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-xl blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <form ref={form} onSubmit={handleSubmit} className="relative z-10 space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Name</label>
                      <div className="relative group/input">
                        <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within/input:text-purple-400 transition-colors text-sm" />
                        <input type="text" name="user_name" required placeholder="Authenticated User" className="w-full bg-zinc-950/50 border border-white/10 rounded-xl pl-11 pr-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-zinc-700 font-bold group-hover/input:border-white/20 uppercase text-xs tracking-wider" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Address</label>
                      <div className="relative group/input">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within/input:text-purple-400 transition-colors text-sm" />
                        <input type="email" name="user_email" required placeholder="user@hostname.com" className="w-full bg-zinc-950/50 border border-white/10 rounded-xl pl-11 pr-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all placeholder:text-zinc-700 font-bold group-hover/input:border-white/20 uppercase text-xs tracking-wider" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Message</label>
                    <div className="relative group/input">
                      <FaCommentDots className="absolute left-4 top-5 text-zinc-500 group-focus-within/input:text-purple-400 transition-colors text-sm" />
                      <textarea name="message" rows="4" required placeholder="Tell me about your project..." className="w-full bg-zinc-950/50 border border-white/10 rounded-xl pl-11 pr-5 py-4 text-white focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all resize-none placeholder:text-zinc-700 font-bold group-hover/input:border-white/20 leading-relaxed text-sm" />
                    </div>
                  </div>

                  <button type="submit" disabled={status === 'sending' || status === 'success'} className={`relative w-full overflow-hidden group py-5 rounded-xl font-black tracking-[0.3em] uppercase transition-all flex items-center justify-center gap-3 shadow-lg ${status === 'success' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-black hover:bg-zinc-200 border-white font-tech'}`}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    <AnimatePresence mode="wait">
                      {status === 'idle' && (
                        <motion.div key="idle" className="flex items-center gap-2 relative z-10 italic">
                          Send Message <FaPaperPlane className="text-xs group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      )}
                      {status === 'sending' && (
                        <motion.div key="sending" className="animate-pulse flex items-center gap-2 relative z-10">
                          Sending Signal...
                        </motion.div>
                      )}
                      {status === 'success' && (
                        <motion.div key="success" className="flex items-center gap-2 relative z-10">
                          Signal Transmitted <FaCheckCircle className="text-lg" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-24 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex gap-4">
            {socialLinks.map((social, idx) => (
              <motion.a key={idx} href={social.link} target="_blank" rel="noreferrer" whileHover={{ y: -5, scale: 1.1 }} whileTap={{ scale: 0.95 }} className="w-12 h-12 rounded-xl border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:border-purple-500 hover:bg-purple-500/10 transition-all relative group bg-zinc-900/50">
                <div className="text-lg">{social.icon}</div>
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-[10px] font-bold text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/5 uppercase tracking-widest">{social.label}</span>
              </motion.a>
            ))}
          </div>

          <div className="text-zinc-500 font-black text-[9px] sm:text-[10px] uppercase tracking-[0.3em] flex flex-col md:items-end gap-2 text-center md:text-right leading-relaxed select-none">
            <div className="flex flex-wrap justify-center md:justify-end gap-3 sm:gap-4 items-center mb-2 italic">
              <span className="text-zinc-500 hover:text-white transition-colors">© {currentTime.getFullYear()} {settings?.name || "Rishabh Tomar"}</span>
              <span className="text-zinc-800 hidden sm:inline">|</span>
              <div className="font-bold text-zinc-400 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/5">
                <span className="w-1.5 h-1.5 rounded-xl bg-purple-500 animate-pulse"></span>
                <span>
                  {currentTime.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="text-zinc-600 text-[8px] ml-1">IST</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-end items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/5 px-3 py-1 rounded-xl border border-emerald-500/10 hover:bg-emerald-500/10 transition-colors cursor-default">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-xl bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-xl h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="tracking-wider text-[9px] font-bold">Protocol Online</span>
              </div>

              <Link to="/admin" className="flex items-center gap-2 text-zinc-600 hover:text-purple-400 transition-all hover:bg-purple-500/5 px-3 py-1 rounded-xl border border-transparent hover:border-purple-500/10 group">
                <FaLock className="text-[9px] group-hover:animate-pulse" />
                <span className="tracking-widest text-[9px]">RESTRICTED ACCESS</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;