import React, {useState, useEffect} from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area} from 'recharts';
import {AlertTriangle, ShieldCheck, Map, Clock, DollarSign, Fuel} from 'lucide-react';

const data = [
  {time: '08:00', risk: 10, cost: 450},
  {time: '09:00', risk: 15, cost: 460},
  {time: '10:00', risk: 45, cost: 480},
  {time: '11:00', risk: 85, cost: 520},
  {time: '12:00', risk: 92, cost: 580},
  {time: '13:00', risk: 30, cost: 540},
  {time: '14:00', risk: 15, cost: 500},
];

export default function Dashboard() {
  const [isDisruption, setIsDisruption] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
        setIsDisruption(prev => !prev);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="dashboard" className="py-20 px-6 bg-white/[0.02]">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4">
             <h2 className="text-4xl md:text-5xl font-display font-bold tracking-tighter">PREDICTIVE ANALYTICS</h2>
             <p className="text-white/40 font-mono text-sm tracking-widest uppercase italic">Live Prototype Simulation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Main Chart Card */}
          <div className="lg:col-span-2 glass-panel p-8 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full animate-pulse ${isDisruption ? 'bg-brand-danger' : 'bg-brand-success'}`} />
                    <span className="text-xs font-mono uppercase tracking-widest text-white/60">
                        {isDisruption ? 'Disruption Detected: Port Congestion (Suez)' : 'System Normal: Network Stable'}
                    </span>
                </div>
                <div className="flex gap-2 text-[10px] font-mono uppercase opacity-40">
                    <span>Lat: 29.97</span>
                    <span>Lon: 32.52</span>
                </div>
            </div>

            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isDisruption ? '#FF4D4D' : '#00F0FF'} stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={isDisruption ? '#FF4D4D' : '#00F0FF'} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis dataKey="time" stroke="#444" fontSize={10} fontStyle="italic" />
                        <YAxis stroke="#444" fontSize={10} hide />
                        <Tooltip 
                            contentStyle={{backgroundColor: '#0F0F0F', border: '1px solid #333', borderRadius: '4px'}}
                            itemStyle={{color: '#fff'}}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="risk" 
                            stroke={isDisruption ? '#FF4D4D' : '#00F0FF'} 
                            fillOpacity={1} 
                            fill="url(#colorRisk)" 
                            strokeWidth={2}
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-6">
                <div className="space-y-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase">Latency</span>
                    <p className="text-xl font-display font-bold tabular-nums">1.2ms</p>
                </div>
                <div className="space-y-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase">Optim. Var</span>
                    <p className="text-xl font-display font-bold tabular-nums">0.82</p>
                </div>
                <div className="space-y-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase">Resilience</span>
                    <p className={`text-xl font-display font-bold tabular-nums ${isDisruption ? 'text-brand-danger' : 'text-brand-success'}`}>
                        {isDisruption ? 'Low' : '98.4%'}
                    </p>
                </div>
            </div>
          </div>

          {/* Action/Recommendation Card */}
          <div className="glass-panel overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10 bg-white/5">
                <h4 className="text-sm font-bold uppercase tracking-widest">AI Recommendations</h4>
            </div>
            
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {isDisruption ? (
                        <motion.div 
                            key="disruption"
                            initial={{opacity: 0, x: 20}}
                            animate={{opacity: 1, x: 0}}
                            exit={{opacity: 0, x: -20}}
                            className="space-y-6"
                        >
                            <div className="flex items-start gap-4 p-4 bg-brand-danger/10 border border-brand-danger/30 rounded">
                                <AlertTriangle className="w-5 h-5 text-brand-danger shrink-0 mt-1" />
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-brand-danger uppercase">Bottleneck Cascade Alert</p>
                                    <p className="text-xs text-brand-danger/70 leading-relaxed font-medium">Delay detected at Port Said. Estimated ripple effect: +48hrs for North Med route.</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-mono uppercase text-white/40">Suggested Mitigation</p>
                                <div className="p-4 bg-white/5 border border-white/10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Map className="w-4 h-4 text-brand-neon" />
                                            <span className="text-sm font-bold uppercase">Cape of Good Hope</span>
                                        </div>
                                        <span className="px-2 py-0.5 bg-brand-success/20 text-brand-success text-[10px] font-bold uppercase rounded">Optimized</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-xs text-white/60">
                                            <Clock className="w-3 h-3" />
                                            <span>+12.4 hrs</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-white/60">
                                            <DollarSign className="w-3 h-3" />
                                            <span>+$12,400</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-white/60">
                                            <Fuel className="w-3 h-3" />
                                            <span>-1.2% Fuel</span>
                                        </div>
                                    </div>
                                    <button className="w-full py-2 bg-brand-neon text-bg-deep font-bold text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all">
                                        Apply Reroute
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="normal"
                            initial={{opacity: 0, x: 20}}
                            animate={{opacity: 1, x: 0}}
                            className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-50 py-12"
                        >
                            <ShieldCheck className="w-12 h-12 text-brand-success/50" />
                            <p className="text-xs font-mono uppercase tracking-[0.2em] leading-relaxed">
                                No active disruptions <br/> in monitored corridors.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
