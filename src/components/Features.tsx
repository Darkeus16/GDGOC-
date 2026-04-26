import React from 'react';
import { Activity, RefreshCcw, Database, LayoutDashboard } from 'lucide-react';

const features = [
  {
    title: 'Predictive Disruption Engine',
    description: 'Ingests live weather, port traffic, and news feeds to flag high-risk shipments before a delay occurs.',
    icon: Activity,
    accent: 'text-brand-neon',
  },
  {
    title: 'Dynamic Re-routing',
    description: 'Calculates alternative routes on disruption — optimizing for cost, fuel, and delivery time simultaneously.',
    icon: RefreshCcw,
    accent: 'text-brand-warning',
  },
  {
    title: 'Scalable Architecture',
    description: 'Handles millions of concurrent shipments across volatile networks without performance degradation.',
    icon: Database,
    accent: 'text-brand-success',
  },
  {
    title: 'One-click Execution',
    description: "AI-suggested route adjustments surface directly in the dashboard — one click to apply, zero manual coordination.",
    icon: LayoutDashboard,
    accent: 'text-white',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-brand-neon mb-3">
              Core capabilities
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight leading-tight">
              Everything you need<br />
              <span className="text-white/30 font-light italic">to stay ahead.</span>
            </h2>
          </div>
          <p className="max-w-sm text-[14px] text-white/35 leading-relaxed">
            NorthRoute is built around one idea: your team should know about problems before they become problems.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.06] border border-white/[0.06] overflow-hidden rounded-xl">
          {features.map((f, i) => (
            <div
              key={i}
              className="group p-8 bg-[#050505] hover:bg-white/[0.02] transition-colors duration-300 flex flex-col gap-6"
            >
              <div className={`w-9 h-9 flex items-center justify-center rounded-lg bg-white/[0.04] group-hover:bg-white/[0.07] transition-colors ${f.accent}`}>
                <f.icon className="w-4.5 h-4.5" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold mb-2 leading-snug">{f.title}</h3>
                <p className="text-[13px] text-white/35 leading-relaxed">{f.description}</p>
              </div>
              <div className="mt-auto text-[10px] font-mono text-white/15 group-hover:text-white/30 transition-colors">
                MOD_0{i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}