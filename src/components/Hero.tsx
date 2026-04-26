import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';

const STATS = [
  { value: '99.4%', label: 'On-time prediction accuracy' },
  { value: '<2ms', label: 'Detection-to-alert latency' },
  { value: '10M+', label: 'Shipments processed' },
];

export default function Hero() {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-24 pb-16 overflow-hidden">
      {/* Subtle grid background */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      {/* Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #00F0FF 0%, transparent 70%)' }}
      />

      <div className="relative max-w-5xl mx-auto w-full">
        {/* Eyebrow */}
        <div
          className={`inline-flex items-center gap-2 mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
          style={{ transitionDelay: '0ms' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-brand-neon animate-pulse" />
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-white/40">
            Supply chain intelligence
          </span>
        </div>

        {/* Headline */}
        <h1
          className={`text-[clamp(3rem,8vw,7rem)] font-display font-semibold leading-[0.95] tracking-[-0.03em] mb-8 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: '100ms' }}
        >
          Preemptive
          <br />
          <span className="text-white/25 italic font-light">logistics</span>
          <br />
          <span className="text-brand-neon">intelligence.</span>
        </h1>

        {/* Subtext */}
        <p
          className={`max-w-xl text-[15px] text-white/40 leading-relaxed mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: '200ms' }}
        >
          NorthRoute shifts your supply chain from reactive firefighting to preemptive control — detecting disruptions before they cascade and routing around them automatically.
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-20 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: '300ms' }}
        >
          <a
            href="#tracking"
            className="group flex items-center gap-2 px-6 py-3 bg-white text-black text-[13px] font-semibold rounded-md hover:bg-brand-neon transition-colors duration-200"
          >
            Open live demo
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a
            href="#features"
            className="flex items-center gap-2 px-6 py-3 text-[13px] text-white/50 hover:text-white transition-colors duration-200"
          >
            See how it works
          </a>
        </div>

        {/* Stats bar */}
        <div
          className={`flex flex-col sm:flex-row gap-8 sm:gap-16 pt-8 border-t border-white/[0.07] transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          style={{ transitionDelay: '400ms' }}
        >
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-display font-semibold tracking-tight text-white mb-0.5">{s.value}</div>
              <div className="text-[11px] text-white/30 uppercase tracking-widest font-mono">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}