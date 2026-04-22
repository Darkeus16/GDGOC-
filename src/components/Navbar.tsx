import React from 'react';
import {motion} from 'motion/react';
import {Box, Search, User} from 'lucide-react';

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({onLoginClick}: NavbarProps) {
  return (
    <motion.nav 
      initial={{y: -100}}
      animate={{y: 0}}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 glass-panel border-t-0 border-x-0"
    >
      <div className="flex items-center gap-2">
        <Box className="w-8 h-8 text-brand-neon" />
        <span className="text-xl font-display font-bold tracking-tight">AEGIS <span className="text-white/50">LOGISTICS AI</span></span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium uppercase tracking-widest text-white/60">
        <a href="#features" className="hover:text-brand-neon transition-colors">Features</a>
        <a href="#dashboard" className="hover:text-brand-neon transition-colors">Dashboard</a>
        <a href="#technical" className="hover:text-brand-neon transition-colors">Specs</a>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onLoginClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold uppercase tracking-tighter border border-white/20 hover:border-brand-neon hover:text-brand-neon transition-all"
        >
          <User className="w-4 h-4" />
          Login
        </button>
      </div>
    </motion.nav>
  );
}
