import React from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {X, User, Lock, ArrowRight, Github, Chrome} from 'lucide-react';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Login({isOpen, onClose}: LoginProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
          />
          <motion.div 
            initial={{opacity: 0, scale: 0.9, y: 20}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.9, y: 20}}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md p-8 glass-panel border-white/20 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-white/50" />
            </button>

            <div className="space-y-8 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-display font-bold tracking-tighter">AUTHENTICATION</h2>
                <p className="text-sm text-white/40 font-medium">Log in to access the Aegis Command Center</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2 text-left">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 px-1">User ID / Email</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input 
                            type="text" 
                            className="w-full bg-white/5 border border-white/10 rounded py-3 pl-12 pr-4 text-sm focus:border-brand-neon focus:outline-none transition-colors"
                            placeholder="operator@aegis-ai.logistics"
                        />
                    </div>
                </div>

                <div className="space-y-2 text-left">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-white/60 px-1">Access Token</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input 
                            type="password" 
                            className="w-full bg-white/5 border border-white/10 rounded py-3 pl-12 pr-4 text-sm focus:border-brand-neon focus:outline-none transition-colors"
                            placeholder="••••••••••••"
                        />
                    </div>
                </div>

                <button className="w-full py-4 bg-white text-bg-deep font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all">
                  Initialize Session <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-white/20"><span className="bg-bg-card px-2">Secure Gateway</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-2 py-3 border border-white/10 text-xs font-bold uppercase hover:bg-white/5 transition-colors">
                  <Github className="w-4 h-4" /> Github
                </button>
                <button className="flex items-center justify-center gap-2 py-3 border border-white/10 text-xs font-bold uppercase hover:bg-white/5 transition-colors">
                  <Chrome className="w-4 h-4" /> Google
                </button>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">Authorized Personnel Only</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
