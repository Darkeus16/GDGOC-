import React from 'react';
import {motion, AnimatePresence} from 'motion/react';
import {Shipment} from '../types';
import {Package, AlertCircle, CheckCircle2, MoreVertical, TrendingDown, Clock, Map} from 'lucide-react';
import {cn} from '../lib/utils';

interface ShipmentListProps {
  shipments: Shipment[];
}

export default function ShipmentList({shipments}: ShipmentListProps) {
  if (shipments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/20 border-2 border-dashed border-white/5 rounded-xl">
        <Package className="w-12 h-12 mb-2" />
        <p className="text-xs uppercase tracking-widest font-mono">No active trackings</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {shipments.map((s) => (
          <motion.div
            key={s.id}
            initial={{opacity: 0, x: -20}}
            animate={{opacity: 1, x: 0}}
            exit={{opacity: 0, scale: 0.95}}
            className="glass-panel overflow-hidden group"
          >
            {/* Health Bar */}
            <div className={`h-1 w-full ${
              s.status === 'delayed' ? 'bg-brand-danger' : 
              s.status === 'at-risk' ? 'bg-brand-warning' : 'bg-brand-success'
            }`} />

            <div className="p-6 flex flex-col md:flex-row gap-8">
              {/* Status Icon */}
              <div className="shrink-0 flex items-center">
                <div className={cn(
                    "w-12 h-12 flex items-center justify-center rounded-full border",
                    s.status === 'delayed' ? "border-brand-danger/30 bg-brand-danger/10 text-brand-danger" : 
                    s.status === 'at-risk' ? "border-brand-warning/30 bg-brand-warning/10 text-brand-warning" : 
                    "border-brand-success/30 bg-brand-success/10 text-brand-success"
                )}>
                    {s.status === 'on-time' ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                </div>
              </div>

              {/* Main Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-lg font-display font-bold">{s.origin} <span className="text-white/20 mx-2">→</span> {s.destination}</h4>
                    <p className="text-[10px] font-mono text-white/40 uppercase">ID: {s.id.slice(0, 8)} • Expected: {new Date(s.expectedDelivery).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                        "text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded",
                        s.status === 'delayed' ? "bg-brand-danger/20 text-brand-danger" : 
                        s.status === 'at-risk' ? "bg-brand-warning/20 text-brand-warning" : 
                        "bg-brand-success/20 text-brand-success"
                    )}>
                        {s.status.replace('-', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-white/30 font-mono">Last Seen By</span>
                    <p className="font-display font-medium text-xs leading-tight">{s.lastSeenBy}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-white/30 font-mono">Signal (RSSI)</span>
                    <p className="font-display font-medium tabular-nums text-xs">{s.signalStrength} dBm</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-white/30 font-mono">Payload</span>
                    <p className="font-display font-medium text-xs tracking-tight">{s.goodsType} ({s.weight}kg)</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-white/30 font-mono">Volume</span>
                    <p className="font-display font-medium text-xs tabular-nums">{s.volume} m³</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-white/30 font-mono">Dist. Rem.</span>
                    <p className="font-display font-medium tabular-nums text-xs">{s.distanceRemaining.toFixed(1)} km</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase text-white/30 font-mono">Risk</span>
                    <p className="font-display font-medium tabular-nums text-xs">{Math.round(s.riskScore)}%</p>
                  </div>
                </div>

                <div className="space-y-1 mt-2">
                    <span className="text-[10px] uppercase text-white/30 font-mono">Live Progress</span>
                    <div className="w-full bg-white/5 h-1.5 rounded-full">
                        <div 
                            className="bg-brand-neon h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                            style={{width: `${((s.distance - s.distanceRemaining) / s.distance) * 100}%`}}
                        />
                    </div>
                </div>

                
                {/* Suggestions Block */}
                {s.suggestions.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
                        <div className="flex items-center gap-2">
                            <TrendingDown className="w-3 h-3 text-brand-neon" />
                            <span className="text-[10px] uppercase font-bold text-brand-neon tracking-widest">Optimized Course Corrections</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            {s.suggestions.slice(0, 3).map((opt) => (
                                <div key={opt.id} className="p-3 bg-white/5 border border-white/10 rounded group/opt hover:border-brand-neon/50 transition-colors cursor-pointer">
                                    <p className="text-[10px] font-bold uppercase mb-1">{opt.name}</p>
                                    <p className="text-[9px] text-white/40 leading-tight mb-2">{opt.adjustment}</p>
                                    <div className="flex items-center gap-2 text-[8px] font-mono text-brand-neon">
                                        <Clock className="w-2.5 h-2.5" /> {opt.impact.time}
                                        <span className="text-white/20">•</span>
                                        <Map className="w-2.5 h-2.5" /> {opt.impact.cost}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
