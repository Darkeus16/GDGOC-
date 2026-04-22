export type ShipmentStatus = 'on-time' | 'at-risk' | 'delayed';

export interface RouteSuggestion {
  id: string;
  name: string;
  adjustment: string;
  impact: {
    time: string;
    cost: string;
    fuel: string;
  };
}

export type GoodsType = 'Standard' | 'Perishable' | 'Fragile' | 'Hazardous';

export interface Shipment {
  id: string;
  tagId: string; // JioTag identifier
  origin: string;
  destination: string;
  distance: number; // in km
  distanceRemaining: number;
  weight: number; // in kg
  volume: number; // in m3
  goodsType: GoodsType;
  expectedDelivery: string; // ISO string
  createdAt: string;
  status: ShipmentStatus;
  riskScore: number; // 0-100
  lastKnownLocation: {
    lat: number;
    lng: number;
    name: string;
  };
  lastSeenBy: string; // Device ID/Name that detected the JioTag
  signalStrength: number; // RSSI in dBm
  trafficCondition: 'low' | 'moderate' | 'high';
  suggestions: RouteSuggestion[];
}

export interface CreateShipmentDto {
  origin: string;
  destination: string;
  distance: number;
  weight: number;
  volume: number;
  goodsType: GoodsType;
  expectedDelivery: string;
}
