import React from 'react';

const specs = [
  { label: 'Optimal variable', value: 'O = min(T × C)', detail: 'Calculated with resilience buffer' },
  { label: 'Target latency', value: '< 2ms', detail: 'Detection-to-recommendation window' },
  { label: 'Architecture', value: 'Multi-cloud mesh', detail: 'Distributed data lakehouse' },
  { label: 'ML pipeline', value: 'RLHF optimized', detail: 'Real-time feedback loop' },
];

export default function TechnicalSpecs() {
  return (
    <section id="technical" className="py-32 px-6 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-6">
            <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-brand-neon">Technical specs</p>
            <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight leading-tight">
              Performance<br />
              <span className="text-white/25 italic font-light">without compromise.</span>
            </h2>
            <p className="text-[14px] text-white/35 leading-relaxed max-w-sm">
              Built on a custom data architecture designed to ingest unstructured external data alongside proprietary transit logs — zero bottlenecking.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px bg-white/[0.06] border border-white/[0.06] rounded-xl overflow-hidden">
            {specs.map((s, i) => (
              <div key={i} className="p-7 bg-[#050505] hover:bg-white/[0.02] transition-colors">
                <p className="text-[10px] font-mono uppercase tracking-widest text-brand-neon mb-3">{s.label}</p>
                <p className="text-xl font-display font-semibold tracking-tight mb-1">{s.value}</p>
                <p className="text-[12px] text-white/25">{s.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Deliverables */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 p-8 border border-white/[0.08] rounded-xl bg-white/[0.01]">
          <div>
            <h4 className="text-[18px] font-display font-semibold mb-1">Submission deliverables</h4>
            <p className="text-[13px] text-white/30">Internal review · v1.0.4</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {['Architecture diagram', 'MVP prototype', 'Impact analysis'].map((d) => (
              <span key={d} className="px-4 py-2 border border-white/[0.08] rounded-md text-[11px] font-mono uppercase tracking-widest text-white/40">
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}