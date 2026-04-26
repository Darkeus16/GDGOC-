import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, ShieldCheck, Map, Clock, DollarSign, Fuel } from 'lucide-react';

const data = [
  { time: '08:00', risk: 10 },
  { time: '09:00', risk: 15 },
  { time: '10:00', risk: 45 },
  { time: '11:00', risk: 85 },
  { time: '12:00', risk: 92 },
  { time: '13:00', risk: 30 },
  { time: '14:00', risk: 15 },
];

export default function Dashboard() {
  const [isDisruption, setIsDisruption] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setIsDisruption(p => !p), 5000);
    return () => clearInterval(t);
  }, []);

  const color = isDisruption ? '#FF4D4D' : '#00F0FF';

  return (
    <section id="dashboard" className="py-32 px-6 border-t border-white/[0.05]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-brand-neon mb-3">
              Predictive analytics
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">
              Live risk monitoring.
            </h2>
          </div>
          <div className="flex items-center gap-2 text-[12px] text-white/30 font-mono">
            <span className={`w-1.5 h-1.5 rounded-full ${isDisruption ? 'bg-brand-danger' : 'bg-brand-success'} animate-pulse`} />
            {isDisruption ? 'Disruption detected · Port Said' : 'All corridors nominal'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white/[0.02] border border-white/[0.07] rounded-xl p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-white/50">Risk index — last 6 hours</span>
              <div className="flex gap-4 text-[11px] font-mono text-white/20">
                <span>29.97°N</span>
                <span>32.52°E</span>
              </div>
            </div>

            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.15)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ stroke: 'rgba(255,255,255,0.1)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="risk"
                    stroke={color}
                    strokeWidth={1.5}
                    fill="url(#riskGrad)"
                    animationDuration={800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/[0.06]">
              {[
                { label: 'Latency', value: '1.2ms' },
                { label: 'Optim. variance', value: '0.82' },
                { label: 'Resilience', value: isDisruption ? 'Degraded' : '98.4%', highlight: isDisruption },
              ].map((m) => (
                <div key={m.label}>
                  <div className="text-[10px] font-mono text-white/25 uppercase tracking-widest mb-1">{m.label}</div>
                  <div className={`text-xl font-display font-semibold ${m.highlight ? 'text-brand-danger' : ''}`}>{m.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-white/[0.06]">
              <span className="text-[12px] font-semibold uppercase tracking-widest text-white/60">AI Recommendations</span>
            </div>

            <div className="flex-1 p-6">
              {isDisruption ? (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="flex gap-3 p-4 bg-brand-danger/[0.06] border border-brand-danger/20 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-brand-danger shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-semibold text-brand-danger mb-1">Bottleneck cascade alert</p>
                      <p className="text-[11px] text-brand-danger/60 leading-relaxed">Port Said congestion — estimated +48hr ripple on North Med routes.</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-white/25 mb-3">Suggested mitigation</p>
                    <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Map className="w-3.5 h-3.5 text-brand-neon" />
                          <span className="text-[13px] font-semibold">Cape of Good Hope</span>
                        </div>
                        <span className="text-[9px] px-2 py-0.5 bg-brand-success/10 text-brand-success rounded font-bold uppercase tracking-wide">Optimal</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-white/40">
                        <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" /> +12.4 hrs</span>
                        <span className="flex items-center gap-1.5"><DollarSign className="w-3 h-3" /> +$12,400</span>
                        <span className="flex items-center gap-1.5"><Fuel className="w-3 h-3" /> -1.2% fuel</span>
                      </div>
                      <button className="w-full py-2 bg-white text-black text-[11px] font-bold uppercase tracking-widest rounded hover:bg-brand-neon transition-colors duration-200">
                        Apply reroute
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-3">
                  <ShieldCheck className="w-10 h-10 text-brand-success/30" />
                  <p className="text-[12px] text-white/25 font-mono uppercase tracking-widest leading-relaxed">
                    No active disruptions<br />in monitored corridors
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}