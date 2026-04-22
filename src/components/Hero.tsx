import React from 'react';
import {motion} from 'motion/react';
import {ArrowRight, ShieldAlert, Cpu} from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20">
      <div className="max-w-5xl w-full text-center space-y-8">
        <motion.div
           initial={{opacity: 0, y: 20}}
           animate={{opacity: 1, y: 0}}
           transition={{duration: 0.8}}
           className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono uppercase bg-brand-neon/10 border border-brand-neon/30 text-brand-neon"
        >
          <Cpu className="w-3 h-3" />
          Aegis Operational Prototype
        </motion.div>

        <motion.h1 
          initial={{opacity: 0, scale: 0.95}}
          animate={{opacity: 1, scale: 1}}
          transition={{duration: 0.8, delay: 0.2}}
          className="text-6xl md:text-8xl font-display font-bold leading-[0.9] tracking-tighter"
        >
          AEGIS <span className="text-white/20 italic">LOGISTICS</span> <br/>
          <span className="text-brand-neon">AI</span> SYSTEMS
        </motion.h1>

        <motion.p 
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.8, delay: 0.4}}
          className="max-w-2xl mx-auto text-lg md:text-xl text-white/60 font-medium"
        >
          Transition supply chain management from <span className="text-white font-bold">reactive</span> to <span className="text-brand-neon font-bold">preemptive</span>. Detect disruptions in real-time and automate optimized routing.
        </motion.p>

        <motion.div 
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.8, delay: 0.6}}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <a href="#tracking" className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-tighter overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Launch Prototype <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-neon transition-all" />
          </a>
          
          <button className="px-8 py-4 border border-white/20 hover:border-white transition-colors text-white font-bold uppercase tracking-tighter">
            View Case Study
          </button>
        </motion.div>
      </div>

      <motion.div 
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{delay: 1, duration: 2}}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-mono">Kill the bottleneck cascade</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
      </motion.div>
    </section>
  );
}
