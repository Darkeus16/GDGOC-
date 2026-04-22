/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {useState, useEffect} from 'react';
import AnimatedBackground from './components/AnimatedBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Dashboard from './components/Dashboard';
import TechnicalSpecs from './components/TechnicalSpecs';
import Login from './components/Login';
import ShipmentForm from './components/ShipmentForm';
import ShipmentList from './components/ShipmentList';
import ShipmentMap from './components/ShipmentMap';
import { Shipment } from './types';
import { Activity, LayoutDashboard, Database, Zap, Radio } from 'lucide-react';

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>([]);

  const fetchShipments = async () => {
    try {
      const res = await fetch('/api/shipments');
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setShipments(data);
      } else {
        const text = await res.text();
        console.error(`API Error (${res.status}):`, text.slice(0, 100));
      }
    } catch (err) {
      console.error('Network Error:', err);
    }
  };

  useEffect(() => {
    fetchShipments();
    const interval = setInterval(fetchShipments, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground />
      
      <div className="relative z-10">
        <Navbar onLoginClick={() => setIsLoginOpen(true)} />
        
        <main>
          <Hero />
          
          {/* Tracking Section (Phase 1.5 - JioTag & Maps) */}
          <section id="tracking" className="py-32 px-6">
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                <div className="space-y-4">
                  <h2 className="text-sm font-mono uppercase tracking-[0.4em] text-brand-neon">JioTag Mesh Network</h2>
                  <h3 className="text-4xl md:text-6xl font-display font-medium leading-none tracking-tighter">
                    BLE TRACKING <br/>
                    <span className="italic text-white/50">SMART NODES</span>
                  </h3>
                </div>
                <div className="flex items-center gap-6 p-4 glass-panel border-dashed">
                    <div className="flex items-center gap-2">
                        <Radio className="w-4 h-4 text-brand-neon animate-pulse" />
                        <span className="text-xs font-mono uppercase text-white/60">Mesh active • {shipments.length} tags detected</span>
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="space-y-8">
                  <ShipmentForm onCreated={fetchShipments} />
                  
                  <div className="glass-panel p-6 space-y-4">
                     <div className="flex items-center gap-2 text-brand-neon">
                        <Zap className="w-4 h-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Low-Cost Edge Logic</span>
                     </div>
                     <p className="text-xs text-white/40 leading-relaxed font-medium">
                        Aegis uses <span className="text-white">JioTag BLE Mesh</span> for context-aware location updates, simulating a low-cost alternative to active GPS for large fleet deployments.
                     </p>
                  </div>
                </div>
                
                <div className="lg:col-span-2 space-y-6">
                  <ShipmentMap shipments={shipments} />
                  <ShipmentList shipments={shipments} />
                </div>
              </div>
            </div>
          </section>

          <Features />
          <Dashboard />
          <TechnicalSpecs />
        </main>

        <footer className="py-20 px-6 border-t border-white/5 bg-black/50">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
            <div className="flex items-center gap-2">
              <span className="text-xl font-display font-bold tracking-tight">AEGIS <span className="text-white/50">LOGISTICS AI</span></span>
            </div>
            
            <p className="text-[10px] font-mono uppercase tracking-[0.3em]">
              © 2026 AEGIS LOGISTICS AI • PHASE 1 MVP
            </p>
            
            <div className="flex gap-8 text-[10px] font-mono uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">OS Terms</a>
              <a href="#" className="hover:text-white transition-colors">Console</a>
            </div>
          </div>
        </footer>
      </div>

      <Login 
        isOpen={isLoginOpen} 
        onClose={() => setIsLoginOpen(false)} 
      />
    </div>
  );
}
