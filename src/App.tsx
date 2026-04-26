import React, { useState, useEffect } from 'react';
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
import { Radio } from 'lucide-react';

export default function App() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [shipments, setShipments] = useState<Shipment[]>([]);

  const fetchShipments = async () => {
    try {
      const res = await fetch('/api/shipments');
      const contentType = res.headers.get('content-type');
      if (res.ok && contentType?.includes('application/json')) {
        setShipments(await res.json());
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

          {/* Tracking section */}
          <section id="tracking" className="py-32 px-6 border-t border-white/[0.05]">
            <div className="max-w-7xl mx-auto space-y-12">

              {/* Section header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-brand-neon mb-3">
                    Live tracking
                  </p>
                  <h2 className="text-4xl md:text-5xl font-display font-semibold tracking-tight">
                    BLE mesh network.
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-white/30 font-mono">
                  <Radio className="w-3.5 h-3.5 text-brand-neon animate-pulse" />
                  Mesh active · {shipments.length} tag{shipments.length !== 1 ? 's' : ''} detected
                </div>
              </div>

              {/* Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <ShipmentForm onCreated={fetchShipments} />

                  <div className="bg-white/[0.02] border border-white/[0.07] rounded-xl p-5 space-y-3">
                    <p className="text-[10px] font-mono uppercase tracking-widest text-brand-neon">Low-cost edge logic</p>
                    <p className="text-[13px] text-white/35 leading-relaxed">
                      NorthRoute uses <span className="text-white/70">JioTag BLE Mesh</span> for context-aware location updates — a low-cost alternative to active GPS for large fleet deployments.
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

        <footer className="py-16 px-6 border-t border-white/[0.05]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-white/20">
            <div className="flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-sm bg-brand-neon flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
                  <path d="M2 12L7 2L12 12" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4 8.5H10" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="text-[13px] font-semibold text-white/40">NorthRoute</span>
            </div>
            <p className="text-[11px] font-mono uppercase tracking-widest">© 2026 NorthRoute · Phase 1 MVP</p>
            <div className="flex gap-6 text-[11px] font-mono uppercase tracking-widest">
              <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
              <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
              <a href="#" className="hover:text-white/50 transition-colors">Console</a>
            </div>
          </div>
        </footer>
      </div>

      <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}