import React from 'react';
import {motion} from 'motion/react';
import {Activity, RefreshCcw, Database, LayoutDashboard} from 'lucide-react';
import {cn} from '../lib/utils';

const features = [
  {
    title: "Predictive Disruption Engine",
    description: "Ingests multifaceted data streams—live weather, global news, port traffic—to flag high-risk shipments before a delay occurs.",
    icon: Activity,
    color: "text-brand-neon"
  },
  {
    title: "Dynamic Re-routing Logic",
    description: "Instantly calculates alternative routes based on cost, fuel efficiency, and time-to-delivery when a disruption is flagged.",
    icon: RefreshCcw,
    color: "text-brand-warning"
  },
  {
    title: "Scalable Data Architecture",
    description: "Handles millions of concurrent shipments across volatile transportation networks without performance degradation.",
    icon: Database,
    color: "text-brand-success"
  },
  {
    title: "Automated Execution UI",
    description: "A dashboard for logistics managers highlighting AI-suggested route adjustments with one-click implementation.",
    icon: LayoutDashboard,
    color: "text-white"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="space-y-4">
            <h2 className="text-sm font-mono uppercase tracking-[0.4em] text-brand-neon">Core Functionalities</h2>
            <h3 className="text-4xl md:text-5xl font-display font-medium tracking-tighter">
              Kills the ripple effect of <br />
              <span className="italic text-white/50">Supply Chain Latency.</span>
            </h3>
          </div>
          <p className="max-w-md text-white/40 font-medium">
            Our system transitions from reactive detection to proactive mitigation, ensuring resilience is built into every shipment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10 overflow-hidden">
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{opacity: 0, y: 20}}
              whileInView={{opacity: 1, y: 0}}
              viewport={{once: true}}
              transition={{delay: i * 0.1}}
              className="group relative p-10 bg-bg-deep hover:bg-bg-card-hover transition-colors"
            >
              <div className="space-y-6">
                <f.icon className={cn("w-10 h-10 transition-transform group-hover:scale-110", f.color)} />
                <h4 className="text-xl font-display font-bold leading-tight">{f.title}</h4>
                <p className="text-sm text-white/40 leading-relaxed font-medium">
                  {f.description}
                </p>
              </div>
              
              <div className="absolute top-0 right-0 p-4 font-mono text-[10px] opacity-20 group-hover:opacity-100 transition-opacity">
                MOD_0{i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
