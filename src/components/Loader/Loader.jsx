import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Loader = ({ onFinish, isReady }) => {
  const [percent, setPercent] = useState(0);
  const [logs, setLogs] = useState(["SYSTEM_INITIALIZING..."]);
  const [hexDump, setHexDump] = useState([]);

  // Matrix Hex Dump Generator
  useEffect(() => {
    const interval = setInterval(() => {
      setHexDump(prev => {
        const newHex = `0x${Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0')}`;
        return [newHex, ...prev.slice(0, 15)];
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  // Main Loader Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setPercent(prev => {
        if (prev >= 95 && !isReady) return 95;
        if (prev >= 100) {
          clearInterval(interval);
          const timer = setTimeout(() => {
            onFinish();
          }, 800);
          return 100;
        }

        if (Math.random() > 0.6) {
          const key = Math.random().toString(36).substring(7).toUpperCase();
          const messages = [
            "SHADOW_BUFFER_FETCHED", "PROTOCOL_LAYER_INIT",
            "KERNEL_SYNC_COMPLETE", "UI_THREAD_ESTABLISHED",
            "FIREBASE_SOCKET_ACTIVE", "DATA_STREAM_HANDSHAKE",
            "QUANTUM_STATE_LOCKED", "NEURAL_NET_ALIGNED"
          ];
          const msg = messages[Math.floor(Math.random() * messages.length)];
          setLogs(prevLogs => [...prevLogs.slice(-6), `> [${key}] ${msg}... OK`]);
        }

        const increment = Math.random() > 0.8 ? 6 : (Math.random() > 0.5 ? 3 : 1);
        return Math.min(prev + increment, 100);
      });
    }, 30);
    return () => clearInterval(interval);
  }, [onFinish, isReady]);

  return (
    <motion.div 
      className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center font-bold text-zinc-500 select-none overflow-hidden bg-[#050505]"
      exit={{
        opacity: 0,
        scale: 1.05,
        filter: "blur(20px)",
        transition: { duration: 0.6, ease: "easeOut" }
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      <div className="absolute left-10 top-0 bottom-0 w-px bg-white/5 hidden md:block">
        <div className="absolute top-1/2 left-0 -translate-x-1/2 w-1 h-32 bg-purple-500/50 blur-[2px]" />
      </div>
      
      {/* Right Hex Dump Column */}
      <div className="absolute right-10 top-0 bottom-0 w-24 hidden md:flex flex-col justify-center text-[10px] font-bold opacity-30 gap-1 leading-none text-right">
          {hexDump.map((hex, i) => (
          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 - i * 0.05 }} className="font-bold text-purple-400 font-mono">
              {hex}
          </motion.div>
          ))}
      </div>

      {/* Central Content */}
      <div className="relative z-10 w-full max-w-2xl px-8 flex flex-col gap-8">
            {/* Top Status Bar */}
            <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.3em] mb-4 border-b border-white/10 pb-4">
            <span className="flex items-center gap-3 text-white">
                <span className="w-2 h-2 bg-purple-500 rounded-xl animate-pulse shadow-[0_0_10px_#a855f7]" />
                System Boot Sequence
            </span>
            <span className="text-purple-400">v2.0.26</span>
            </div>

            {/* Main Progress Display */}
            <div className="relative group">
            <motion.h1 
                animate={
                    percent > 10 && percent < 95 && Math.random() > 0.8 
                    ? { x: [-3, 3, -3, 0], opacity: [1, 0.4, 1] } 
                    : {}
                }
                transition={{ duration: 0.1 }}
                className="text-9xl md:text-[12rem] font-black text-white/5 leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-md pointer-events-none"
            >
                {Math.min(percent, 100)}
            </motion.h1>

            <div className="flex items-baseline gap-4 relative z-10">
                <motion.span 
                    animate={
                        percent > 10 && percent < 95 && Math.random() > 0.85 
                        ? { x: [-4, 4, -2, 0], color: ['#fff', '#a855f7', '#fff'] } 
                        : { color: '#fff' }
                    }
                    transition={{ duration: 0.1 }}
                    className="text-7xl md:text-9xl font-black tracking-tighter shadow-purple-500/20 drop-shadow-lg leading-none"
                >
                {Math.min(percent, 100)}
                </motion.span>
                <span className="text-2xl text-purple-500 font-bold mb-4">/ 100</span>
            </div>
            </div>

            {/* Complex Progress Bar */}
            <div className="flex flex-col gap-3 mt-4">
            <div className="w-full h-3 bg-zinc-900 rounded-xl overflow-hidden border border-white/10 relative shadow-inner">
                <motion.div
                className="h-full bg-white relative z-10"
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
                >
                <div className="absolute right-0 top-0 bottom-0 w-6 bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,1)]" />
                </motion.div>

                <motion.div
                className="absolute inset-y-0 left-0 bg-purple-900/50 z-0"
                initial={{ width: 0 }}
                animate={{ width: `${percent * 0.8}%` }}
                transition={{ ease: "linear", duration: 0.5 }}
                />
            </div>

            <div className="flex justify-between text-[10px] font-bold text-zinc-500 uppercase mt-1 tracking-widest">
                <span className="text-emerald-400">Memory_Alloc: OK</span>
                <span className="text-purple-400">Core_Temp: OPTIMAL</span>
            </div>
            </div>

            {/* Terminal Log Output */}
            <div className="h-36 bg-black/60 border border-white/10 rounded-xl p-5 font-bold text-xs text-emerald-400 overflow-hidden flex flex-col justify-end shadow-2xl relative backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none z-20" />
            <div className="relative z-10 flex flex-col gap-1.5">
                {logs.map((log, i) => (
                <motion.div
                    key={i}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    className="truncate font-mono tracking-wider"
                >
                    <span className="text-zinc-500 mr-3">[{new Date().toLocaleTimeString()}]</span>
                    {log}
                </motion.div>
                ))}
                <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2.5 h-4 bg-emerald-400 ml-1 inline-block align-middle shadow-[0_0_10px_#34d399]"
                />
            </div>
            </div>

        </div>
    </motion.div>
  );
};

export default Loader;
