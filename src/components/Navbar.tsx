import React, { useState, useEffect } from 'react';
import { User, Menu, X } from 'lucide-react';

interface NavbarProps {
  onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/[0.06]' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Wordmark */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-7 h-7 rounded-sm bg-brand-neon flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 12L7 2L12 12" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 8.5H10" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight text-white">
            NorthRoute
          </span>
        </a>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8">
          {['Features', 'Dashboard', 'Specs'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-[13px] text-white/50 hover:text-white transition-colors duration-200 tracking-wide"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <button
            onClick={onLoginClick}
            className="hidden md:flex items-center gap-2 px-4 py-2 text-[13px] font-medium text-white/70 hover:text-white border border-white/10 hover:border-white/30 rounded-md transition-all duration-200"
          >
            <User className="w-3.5 h-3.5" />
            Sign in
          </button>
          <button
            className="md:hidden p-2 text-white/50 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/[0.06] px-6 py-4 space-y-3">
          {['Features', 'Dashboard', 'Specs'].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="block text-sm text-white/60 hover:text-white py-1"
              onClick={() => setMenuOpen(false)}
            >
              {item}
            </a>
          ))}
          <button onClick={onLoginClick} className="text-sm text-white/60 hover:text-white py-1">
            Sign in
          </button>
        </div>
      )}
    </nav>
  );
}