import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader = ({ onFinish, isReady }) => {
  const [percent, setPercent] = useState(0);
  const [logs, setLogs] = useState(["SYSTEM_INITIALIZING..."]);
  const [hexDump, setHexDump] = useState([]);

  // Hex Dump Generator
  useEffect(() => {
    const interval = setInterval(() => {
      setHexDump(prev => {
        const newHex = `0x${Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0')}`;
        return [newHex, ...prev.slice(0, 15)];
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  // Main Loader Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(prev => {
        // If we reach 95%, we wait for isReady to jump to 100%
        if (prev >= 95 && !isReady) return 95;

        if (prev >= 100) {
          clearInterval(interval);
          // Small debounce/settle time after 100%
          const timer = setTimeout(() => {
            onFinish();
          }, 800);
          return 100;
        }

        // Add random logs based on progress
        if (Math.random() > 0.6) {
          const key = Math.random().toString(36).substring(7).toUpperCase();
          const messages = [
            "SHADOW_BUFFER_FETCHED", "PROTOCOL_LAYER_INIT",
            "KERNEL_SYNC_COMPLETE", "UI_THREAD_ESTABLISHED",
            "FIREBASE_SOCKET_ACTIVE", "DATA_STREAM_HANDSHAKE"
          ];
          const msg = messages[Math.floor(Math.random() * messages.length)];
          setLogs(prevLogs => [...prevLogs.slice(-6), `> [${key}] ${msg}... OK`]);
        }

        // Non-linear progress increment
        const increment = Math.random() > 0.8 ? 5 : (Math.random() > 0.5 ? 2 : 1);
        return Math.min(prev + increment, 100);
      });
    }, 30); // Faster initial interval
    return () => clearInterval(interval);
  }, [onFinish, isReady]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#050505] flex items-center justify-center overflow-hidden font-bold text-zinc-500 select-none"
      exit={{
        opacity: 0,
        scale: 1.1,
        filter: "blur(20px)",
        transition: { duration: 0.8, ease: "easeInOut" }
      }}
    >
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Radar Scanline */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent z-0 pointer-events-none"
        animate={{ top: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Left Vertical Line Decoration */}
      <div className="absolute left-10 top-0 bottom-0 w-px bg-white/5 hidden md:block">
        <div className="absolute top-1/2 left-0 -translate-x-1/2 w-1 h-32 bg-purple-500/50 blur-[2px]" />
      </div>

      {/* Right Hex Dump Column */}
      <div className="absolute right-10 top-0 bottom-0 w-24 hidden md:flex flex-col justify-center text-[10px] font-bold opacity-30 gap-1 leading-none text-right">
        {hexDump.map((hex, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 - i * 0.05 }} className="font-bold">
            {hex}
          </motion.div>
        ))}
      </div>

      {/* Center Content */}
      <div className="relative z-10 w-full max-w-2xl px-8 flex flex-col gap-8">

        {/* Top Status Bar */}
        <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] mb-4 border-b border-white/5 pb-4">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-purple-500 rounded-xl animate-pulse" />
            System Boot
          </span>
          <span>v2.0.26</span>
        </div>

        {/* Main Progress Display */}
        <div className="relative">
          <h1 className="text-9xl md:text-[12rem] font-black text-white/5 leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-sm pointer-events-none">
            {Math.min(percent, 100)}
          </h1>

          <div className="flex items-baseline gap-4 relative z-10">
            <span className="text-7xl md:text-9xl font-black text-white tracking-tighter shadow-purple-500/20 drop-shadow-lg leading-none">
              {Math.min(percent, 100)}
            </span>
            <span className="text-2xl text-purple-500 font-bold mb-4">/ 100</span>
          </div>
        </div>

        {/* Complex Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="w-full h-2 bg-zinc-900 rounded-xl overflow-hidden border border-white/5 relative">
            {/* Primary Bar */}
            <motion.div
              className="h-full bg-white relative z-10"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ ease: "linear", duration: 0.1 }}
            >
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
            </motion.div>

            {/* Ghost Bar (Lagging) */}
            <motion.div
              className="absolute inset-y-0 left-0 bg-purple-900/40 z-0"
              initial={{ width: 0 }}
              animate={{ width: `${percent * 0.8}%` }}
              transition={{ ease: "linear", duration: 0.5 }}
            />
          </div>

          <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase">
            <span>Memory_Alloc: OK</span>
            <span>Core_Temp: NORMAL</span>
          </div>
        </div>

        {/* Terminal Log Output */}
        <div className="h-32 bg-black/40 border border-white/5 rounded-xl p-4 font-bold text-xs text-green-500/80 overflow-hidden flex flex-col justify-end shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none" />
          <div className="relative z-10 flex flex-col gap-1">
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="truncate"
              >
                <span className="text-zinc-600 mr-2">[{new Date().toLocaleTimeString()}]</span>
                {log}
              </motion.div>
            ))}
            <motion.div
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              className="w-2 h-4 bg-green-500 ml-1 inline-block align-middle"
            />
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default Loader;
