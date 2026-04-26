import React, { useEffect, useRef } from 'react';
import { Shipment } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface ShipmentMapProps {
  shipments: Shipment[];
}

const STATUS_COLORS: Record<string, string> = {
  'on-time': '#00FF94',
  'at-risk': '#FFB800',
  'delayed': '#FF4D4D',
};

const createMarkerIcon = (status: string) => {
  const color = STATUS_COLORS[status] ?? '#00F0FF';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="10" fill="${color}" fill-opacity="0.2" />
      <circle cx="14" cy="14" r="6" fill="${color}" />
      <circle cx="14" cy="14" r="10" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.6" />
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -16],
  });
};

export default function ShipmentMap({ shipments }: ShipmentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<string, L.Marker>>(new Map());

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629],
      zoom: 5,
      zoomControl: true,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const activeIds = new Set(shipments.map(s => s.id));

    markersRef.current.forEach((marker, id) => {
      if (!activeIds.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });

    shipments.forEach(shipment => {
      const pos: L.LatLngTuple = [shipment.lastKnownLocation.lat, shipment.lastKnownLocation.lng];
      const icon = createMarkerIcon(shipment.status);
      const progressPct = Math.round(
        ((shipment.distance - shipment.distanceRemaining) / shipment.distance) * 100
      );

      const popupContent = `
        <div style="
          font-family: 'JetBrains Mono', monospace;
          background: #0F0F0F;
          color: #fff;
          padding: 12px 14px;
          border-radius: 8px;
          min-width: 200px;
          border: 1px solid rgba(255,255,255,0.1);
          font-size: 11px;
          line-height: 1.8;
        ">
          <div style="font-size:13px; font-weight:700; color:${STATUS_COLORS[shipment.status]}; margin-bottom:6px;">
            ${shipment.tagId}
          </div>
          <div style="color:rgba(255,255,255,0.5); text-transform:uppercase; letter-spacing:0.1em; font-size:9px; margin-bottom:8px;">
            ${shipment.origin} → ${shipment.destination}
          </div>
          <div>Risk: <span style="color:${STATUS_COLORS[shipment.status]}">${shipment.riskScore.toFixed(0)}%</span></div>
          <div>Progress: <span style="color:#fff">${progressPct}%</span></div>
          <div>Traffic: <span style="color:#fff">${shipment.trafficCondition}</span></div>
          <div>Last seen: <span style="color:rgba(255,255,255,0.6)">${shipment.lastSeenBy}</span></div>
          <div>Signal: <span style="color:rgba(255,255,255,0.6)">${shipment.signalStrength} dBm</span></div>
          <div>Goods: <span style="color:#fff">${shipment.goodsType}</span></div>
        </div>
      `;

      if (markersRef.current.has(shipment.id)) {
        const existing = markersRef.current.get(shipment.id)!;
        existing.setLatLng(pos);
        existing.setIcon(icon);
        existing.setPopupContent(popupContent);
      } else {
        const marker = L.marker(pos, { icon })
          .addTo(map)
          .bindPopup(popupContent, { className: 'aegis-popup', closeButton: false, maxWidth: 260 });
        markersRef.current.set(shipment.id, marker);
      }
    });
  }, [shipments]);

  return (
    <div className="glass-panel overflow-hidden relative" style={{ borderRadius: '12px' }}>
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF] animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60">
            Network View: Active Mesh
          </span>
        </div>
        <div className="flex items-center gap-4 text-[9px] font-mono uppercase tracking-widest text-white/40">
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#00FF94]" /> On-time
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FFB800]" /> At-risk
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FF4D4D]" /> Delayed
          </span>
        </div>
      </div>
      <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
    </div>
  );
}