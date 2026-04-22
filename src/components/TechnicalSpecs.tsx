import React from 'react';
import {motion} from 'motion/react';

const specs = [
  { label: "Optimal Variable", value: "O = min(Time x Cost)", detail: "Calculated with Resilience Buffer" },
  { label: "Target Latency", value: "< 2ms", detail: "Detection-to-Recommendation window" },
  { label: "Architecture", value: "Multi-cloud Mesh", detail: "Distributed Data Lakehouse" },
  { label: "ML Pipeline", value: "RLHF Optimized", detail: "Real-time Feedback Loop" }
];

export default function TechnicalSpecs() {
  return (
    <section id="technical" className="py-32 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
          <div className="space-y-8">
            <h2 className="text-sm font-mono uppercase tracking-[0.4em] text-brand-neon">Technical Constraints</h2>
            <h3 className="text-5xl md:text-6xl font-display font-medium leading-[0.9] tracking-tighter">
              Performance <br/>
              <span className="italic text-white/50">without compromise.</span>
            </h3>
            <p className="max-w-md text-white/40 leading-relaxed font-medium">
              Aegis is built on a custom data architecture designed to ingest unstructured external data alongside proprietary transit logs with zero bottlenecking.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {specs.map((spec, i) => (
                <motion.div 
                    key={i}
                    whileHover={{backgroundColor: 'rgba(255,255,255,0.02)'}}
                    className="p-8 bg-bg-deep space-y-4"
                >
                    <span className="text-[10px] font-mono uppercase text-brand-neon tracking-widest">{spec.label}</span>
                    <p className="text-2xl font-display font-bold tracking-tight">{spec.value}</p>
                    <p className="text-xs text-white/30 font-medium">{spec.detail}</p>
                </motion.div>
            ))}
          </div>
        </div>

        {/* Deliverables Banner */}
        <div className="glass-panel p-12 border-dashed border-2 flex flex-col md:flex-row items-center justify-between gap-8 bg-brand-neon/[0.02] mt-20">
            <div className="space-y-2">
                <h4 className="text-2xl font-display font-bold">Submission Deliverables</h4>
                <p className="text-white/40 text-sm font-medium">Internal System Review v1.0.4</p>
            </div>
            <div className="flex gap-4">
                {['Architecture Diagram', 'MVP Prototype', 'Impact Analysis'].map((d, i) => (
                    <div key={i} className="px-4 py-2 border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-widest">
                        {d}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
