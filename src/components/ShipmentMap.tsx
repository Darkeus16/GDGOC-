import React, {useEffect, useRef} from 'react';
import {importLibrary} from '@googlemaps/js-api-loader';
import {Shipment} from '../types';

interface ShipmentMapProps {
  shipments: Shipment[];
}

export default function ShipmentMap({shipments}: ShipmentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());

  useEffect(() => {
    async function initMap() {
      if (!mapRef.current) return;
      
      try {
        const {Map} = await importLibrary('maps') as google.maps.MapsLibrary;
        const {Marker} = await importLibrary('marker') as google.maps.MarkerLibrary;

        googleMapRef.current = new Map(mapRef.current, {
          center: {lat: 19.0760, lng: 72.8777},
          zoom: 5,
          styles: [
              {elementType: "geometry", stylers: [{color: "#242f3e"}]},
              {elementType: "labels.text.stroke", stylers: [{color: "#242f3e"}]},
              {elementType: "labels.text.fill", stylers: [{color: "#746855"}]},
              {featureType: "water", elementType: "geometry", stylers: [{color: "#17263c"}]},
              {featureType: "road", elementType: "geometry", stylers: [{color: "#38414e"}]},
          ],
          backgroundColor: '#050505',
          disableDefaultUI: true,
        });

        // Store standard Marker class for the other effect to use
        (window as any).googleMarkerClass = Marker;
      } catch (e) {
        console.error("Google Maps failed to load", e);
      }
    }

    initMap();
  }, []);

  useEffect(() => {
    if (!googleMapRef.current || !(window as any).googleMarkerClass) return;

    const Marker = (window as any).googleMarkerClass;

    // Remove obsolete markers
    const currentIds = new Set(shipments.map(s => s.id));
    markersRef.current.forEach((marker, id) => {
      if (!currentIds.has(id)) {
        marker.setMap(null);
        markersRef.current.delete(id);
      }
    });

    // Update or Create markers
    shipments.forEach(s => {
      const pos = {lat: s.lastKnownLocation.lat, lng: s.lastKnownLocation.lng};
      let marker = markersRef.current.get(s.id);

      if (marker) {
        marker.setPosition(pos);
      } else {
        marker = new Marker({
          position: pos,
          map: googleMapRef.current,
          title: `Shipment ${s.id}`,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: s.status === 'delayed' ? '#FF4D4D' : s.status === 'at-risk' ? '#FFB800' : '#00F0FF',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#FFFFFF',
            scale: 8
          }
        });
        markersRef.current.set(s.id, marker);
      }
    });
  }, [shipments]);

  return (
    <div className="glass-panel overflow-hidden relative" style={{height: '400px'}}>
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 z-10 p-2 bg-black/80 border border-white/10 text-[10px] font-mono uppercase tracking-widest">
        Network View: Active Mesh
      </div>
      {!((import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY) && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-sm text-center p-6">
            <p className="text-white/60 text-xs font-mono uppercase leading-relaxed">
                Google Maps API Key Missing. <br/> 
                <span className="text-brand-neon">Set VITE_GOOGLE_MAPS_API_KEY in environment to enable live visualization.</span>
            </p>
        </div>
      )}
    </div>
  );
}
