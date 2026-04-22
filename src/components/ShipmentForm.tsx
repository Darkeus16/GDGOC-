import React, {useState} from 'react';
import {Plus, MapPin, Calendar, Navigation} from 'lucide-react';
import {CreateShipmentDto} from '../types';

interface ShipmentFormProps {
  onCreated: () => void;
}

export default function ShipmentForm({onCreated}: ShipmentFormProps) {
  const [formData, setFormData] = useState<CreateShipmentDto>({
    origin: '',
    destination: '',
    distance: 0,
    weight: 0,
    volume: 0,
    goodsType: 'Standard',
    expectedDelivery: new Date(Date.now() + 86400000).toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            ...formData,
            expectedDelivery: new Date(formData.expectedDelivery).toISOString()
        }),
      });
      if (response.ok) {
        setFormData({
            origin: '',
            destination: '',
            distance: 0,
            weight: 0,
            volume: 0,
            goodsType: 'Standard',
            expectedDelivery: new Date(Date.now() + 86400000).toISOString().split('T')[0]
        });
        onCreated();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 space-y-6">
      <div className="flex items-center gap-2 border-b border-white/10 pb-4">
        <Plus className="w-5 h-5 text-brand-neon" />
        <h3 className="text-sm font-bold uppercase tracking-widest">Register New Shipment</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-white/40 uppercase">Origin</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                required
                className="w-full bg-white/5 border border-white/10 rounded py-2 pl-10 pr-4 text-sm focus:border-brand-neon focus:outline-none"
                placeholder="Mumbai"
                value={formData.origin}
                onChange={e => setFormData({...formData, origin: e.target.value})}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-white/40 uppercase">Destination</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                required
                className="w-full bg-white/5 border border-white/10 rounded py-2 pl-10 pr-4 text-sm focus:border-brand-neon focus:outline-none"
                placeholder="Singapore"
                value={formData.destination}
                onChange={e => setFormData({...formData, destination: e.target.value})}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-white/40 uppercase">Weight (KG)</label>
            <input 
                type="number"
                required
                className="w-full bg-white/5 border border-white/10 rounded py-2 px-4 text-sm focus:border-brand-neon focus:outline-none"
                placeholder="Weight in KG"
                value={formData.weight || ''}
                onChange={e => setFormData({...formData, weight: Number(e.target.value)})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-white/40 uppercase">Volume (M³)</label>
            <input 
                type="number"
                required
                className="w-full bg-white/5 border border-white/10 rounded py-2 px-4 text-sm focus:border-brand-neon focus:outline-none"
                placeholder="Volume in m3"
                value={formData.volume || ''}
                onChange={e => setFormData({...formData, volume: Number(e.target.value)})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-white/40 uppercase">Goods Type</label>
            <select 
                className="w-full bg-[#0a0a0a] border border-white/10 rounded py-2 px-4 text-sm focus:border-brand-neon focus:outline-none appearance-none"
                value={formData.goodsType}
                onChange={e => setFormData({...formData, goodsType: e.target.value as any})}
            >
                <option value="Standard">Standard</option>
                <option value="Perishable">Perishable</option>
                <option value="Fragile">Fragile</option>
                <option value="Hazardous">Hazardous</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-mono text-white/40 uppercase">Distance (KM)</label>
            <div className="relative">
                <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input 
                    type="number"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded py-2 pl-10 pr-4 text-sm focus:border-brand-neon focus:outline-none"
                    placeholder="3900"
                    value={formData.distance || ''}
                    onChange={e => setFormData({...formData, distance: Number(e.target.value)})}
                />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono text-white/40 uppercase">ETA Date</label>
          <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                  type="date"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded py-2 pl-10 pr-4 text-sm focus:border-brand-neon focus:outline-none"
                  value={formData.expectedDelivery}
                  onChange={e => setFormData({...formData, expectedDelivery: e.target.value})}
              />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full py-3 bg-brand-neon text-bg-deep font-bold uppercase tracking-widest text-xs hover:brightness-110 disabled:opacity-50 transition-all"
        >
          {loading ? 'Processing...' : 'Initialize Shipment'}
        </button>
      </form>
    </div>
  );
}
