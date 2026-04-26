import React, { useState, useEffect, useRef } from 'react';
import { Plus, MapPin, Calendar, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { CreateShipmentDto } from '../types';

interface ShipmentFormProps {
  onCreated: () => void;
}

interface GeoResult {
  lat: number;
  lng: number;
  displayName: string;
}

// Geocode a place name using OpenStreetMap Nominatim (free, no key)
async function geocode(place: string): Promise<GeoResult | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    const data = await res.json();
    if (!data || data.length === 0) return null;
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };
  } catch {
    return null;
  }
}

// Haversine formula — straight-line km between two lat/lng points
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  // Multiply by 1.4 to approximate road/sea distance vs straight line
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.4);
}

export default function ShipmentForm({ onCreated }: ShipmentFormProps) {
  const [formData, setFormData] = useState<Omit<CreateShipmentDto, 'distance'> & { distance: number }>({
    origin: '',
    destination: '',
    distance: 0,
    weight: 0,
    volume: 0,
    goodsType: 'Standard',
    expectedDelivery: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  });

  const [originGeo, setOriginGeo] = useState<GeoResult | null>(null);
  const [destGeo, setDestGeo] = useState<GeoResult | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle');
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-calculate distance whenever both origin and destination are filled
  useEffect(() => {
    if (!formData.origin || !formData.destination) {
      setGeoStatus('idle');
      setOriginGeo(null);
      setDestGeo(null);
      setFormData(f => ({ ...f, distance: 0 }));
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setGeoStatus('loading');
      const [o, d] = await Promise.all([
        geocode(formData.origin),
        geocode(formData.destination),
      ]);

      if (!o || !d) {
        setGeoStatus('error');
        setFormData(f => ({ ...f, distance: 0 }));
        return;
      }

      setOriginGeo(o);
      setDestGeo(d);
      const km = haversineKm(o.lat, o.lng, d.lat, d.lng);
      setFormData(f => ({ ...f, distance: km }));
      setGeoStatus('ok');
    }, 800); // debounce — waits for user to stop typing
  }, [formData.origin, formData.destination]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originGeo) {
      alert('Could not locate origin. Check the city name and try again.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          expectedDelivery: new Date(formData.expectedDelivery).toISOString(),
          // Pass geocoded coordinates so server uses real location
          originLat: originGeo.lat,
          originLng: originGeo.lng,
          destLat: destGeo?.lat,
          destLng: destGeo?.lng,
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
          expectedDelivery: new Date(Date.now() + 86400000).toISOString().split('T')[0],
        });
        setOriginGeo(null);
        setDestGeo(null);
        setGeoStatus('idle');
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
                onChange={e => setFormData({ ...formData, origin: e.target.value })}
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
                onChange={e => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Auto-calculated distance display */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded text-xs font-mono">
          {geoStatus === 'idle' && (
            <span className="text-white/30 uppercase tracking-widest">Distance auto-calculated from locations</span>
          )}
          {geoStatus === 'loading' && (
            <>
              <Loader2 className="w-3.5 h-3.5 text-brand-neon animate-spin" />
              <span className="text-white/40 uppercase tracking-widest">Calculating distance...</span>
            </>
          )}
          {geoStatus === 'ok' && (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-success shrink-0" />
              <span className="text-brand-success font-bold">{formData.distance.toLocaleString()} km</span>
              <span className="text-white/20 mx-1">•</span>
              <span className="text-white/30 truncate">{originGeo?.displayName.split(',')[0]} → {destGeo?.displayName.split(',')[0]}</span>
            </>
          )}
          {geoStatus === 'error' && (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-brand-danger" />
              <span className="text-brand-danger uppercase tracking-widest">Could not locate one of the cities — check spelling</span>
            </>
          )}
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
              onChange={e => setFormData({ ...formData, weight: Number(e.target.value) })}
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
              onChange={e => setFormData({ ...formData, volume: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-mono text-white/40 uppercase">Goods Type</label>
          <select
            className="w-full bg-[#0a0a0a] border border-white/10 rounded py-2 px-4 text-sm focus:border-brand-neon focus:outline-none appearance-none"
            value={formData.goodsType}
            onChange={e => setFormData({ ...formData, goodsType: e.target.value as any })}
          >
            <option value="Standard">Standard</option>
            <option value="Perishable">Perishable</option>
            <option value="Fragile">Fragile</option>
            <option value="Hazardous">Hazardous</option>
          </select>
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
              onChange={e => setFormData({ ...formData, expectedDelivery: e.target.value })}
            />
          </div>
        </div>

        <button
          disabled={loading || geoStatus === 'loading' || geoStatus === 'error' || formData.distance === 0}
          className="w-full py-3 bg-brand-neon text-bg-deep font-bold uppercase tracking-widest text-xs hover:brightness-110 disabled:opacity-40 transition-all"
        >
          {loading ? 'Processing...' : geoStatus === 'loading' ? 'Calculating Route...' : 'Initialize Shipment'}
        </button>
      </form>
    </div>
  );
}