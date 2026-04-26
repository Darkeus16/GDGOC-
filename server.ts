import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Shipment, ShipmentStatus, RouteSuggestion } from './src/types';

// Extended DTO with geocoded coords from the form
interface CreateShipmentDto {
  origin: string;
  destination: string;
  distance: number;
  weight?: number;
  volume?: number;
  goodsType?: string;
  expectedDelivery: string;
  originLat?: number;
  originLng?: number;
  destLat?: number;
  destLng?: number;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  let shipments: Shipment[] = [];

  const generateSuggestions = (shipment: Shipment): RouteSuggestion[] => {
    if (shipment.riskScore < 30) return [];
    return [
      {
        id: uuidv4(),
        name: 'Alt-Corridor-North',
        adjustment: 'Reroute via Northern Expressway',
        impact: { time: '-45 min', cost: '+$120', fuel: '-2%' },
      },
      {
        id: uuidv4(),
        name: 'Intermodal-Shift',
        adjustment: 'Switch to Express Freight Rail',
        impact: { time: '+2 hrs', cost: '-$300', fuel: '-15%' },
      },
      {
        id: uuidv4(),
        name: 'Dynamic-Relay',
        adjustment: 'Direct handoff at Warehouse 7B',
        impact: { time: '-2.5 hrs', cost: '+$450', fuel: '+5%' },
      },
    ];
  };

  const calculateRisk = (shipment: Shipment): number => {
    let score = 0;

    // 1. Progress vs time ratio — only meaningful after shipment has started moving
    const progress = shipment.distance > 0
      ? (shipment.distance - shipment.distanceRemaining) / shipment.distance
      : 0;
    const timeElapsed = (Date.now() - new Date(shipment.createdAt).getTime()) / 3600000;
    const totalAllocatedHours =
      (new Date(shipment.expectedDelivery).getTime() - new Date(shipment.createdAt).getTime()) / 3600000;

    // Only add progress risk after at least 5% of time has elapsed (avoids instant-high risk)
    if (totalAllocatedHours > 0 && timeElapsed / totalAllocatedHours > 0.05) {
      const expectedProgress = timeElapsed / totalAllocatedHours;
      if (progress < expectedProgress) {
        score += (expectedProgress - progress) * 80;
      }
    }

    // 2. Traffic
    if (shipment.trafficCondition === 'high') score += 25;
    else if (shipment.trafficCondition === 'moderate') score += 10;

    // 3. Weight
    if (shipment.weight > 10000) score += 15;
    else if (shipment.weight > 5000) score += 8;

    // 4. Volume
    if (shipment.volume > 50) score += 10;
    else if (shipment.volume > 20) score += 5;

    // 5. Goods type
    switch (shipment.goodsType) {
      case 'Perishable': score += 20; break;
      case 'Hazardous': score += 15; break;
      case 'Fragile': score += 10; break;
    }

    // 6. Late penalty — if past expected delivery
    if (Date.now() > new Date(shipment.expectedDelivery).getTime()) {
      score += 30;
    }

    return Math.min(Math.max(Math.round(score), 0), 100);
  };

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/shipments', (req, res) => {
    res.json(shipments);
  });

  app.post('/api/shipments', (req, res) => {
    const dto: CreateShipmentDto = req.body;

    // Use real geocoded coordinates if provided, fallback to Mumbai
    const startLat = dto.originLat ?? 19.076;
    const startLng = dto.originLng ?? 72.8777;

    const newShipment: Shipment = {
      id: uuidv4(),
      tagId: `JIO-${Math.floor(1000 + Math.random() * 9000)}`,
      origin: dto.origin,
      destination: dto.destination,
      distance: dto.distance,
      distanceRemaining: dto.distance,
      weight: dto.weight || 100,
      volume: dto.volume || 1,
      goodsType: (dto.goodsType as any) || 'Standard',
      expectedDelivery: dto.expectedDelivery,
      createdAt: new Date().toISOString(),
      status: 'on-time',
      riskScore: 0,
      lastKnownLocation: {
        lat: startLat,
        lng: startLng,
        name: dto.origin,
      },
      lastSeenBy: 'HUB-INIT-01',
      signalStrength: -65,
      trafficCondition: 'low',
      suggestions: [],
    };

    shipments.push(newShipment);
    res.status(201).json(newShipment);
  });

  // Simulation loop
  setInterval(() => {
    const devices = ['iPhone-Logistic-42', 'Node-Express-99', 'Samsung-Delivery-7', 'Gate-Validator-B', 'HUB-TRANSIT-2'];

    shipments = shipments.map(s => {
      if (s.distanceRemaining <= 0) return { ...s, status: 'on-time', riskScore: 0, suggestions: [] };

      const movement = Math.random() * 1.5;
      const newRemaining = Math.max(s.distanceRemaining - movement, 0);

      // Move coordinates slightly toward destination (simulate travel)
      const newLat = s.lastKnownLocation.lat + (Math.random() - 0.5) * 0.008;
      const newLng = s.lastKnownLocation.lng + (Math.random() - 0.3) * 0.008;

      const newDevice = Math.random() > 0.8
        ? devices[Math.floor(Math.random() * devices.length)]
        : s.lastSeenBy;
      const newRSSI = -Math.floor(40 + Math.random() * 50);

      const trafficRand = Math.random();
      const traffic: 'low' | 'moderate' | 'high' =
        trafficRand > 0.92 ? 'high' : trafficRand > 0.75 ? 'moderate' : 'low';

      const updated: Shipment = {
        ...s,
        distanceRemaining: newRemaining,
        lastKnownLocation: { ...s.lastKnownLocation, lat: newLat, lng: newLng },
        lastSeenBy: newDevice,
        signalStrength: newRSSI,
        trafficCondition: traffic,
      };

      updated.riskScore = calculateRisk(updated);

      if (updated.riskScore > 70) updated.status = 'delayed';
      else if (updated.riskScore > 35) updated.status = 'at-risk';
      else updated.status = 'on-time';

      updated.suggestions = generateSuggestions(updated);
      return updated;
    });
  }, 2000);

  app.all('/api/*', (req, res) => {
    res.status(404).json({ error: 'API route not found', path: req.url });
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use((req, res, next) => {
      if (req.url.startsWith('/api')) return next();
      vite.middlewares(req, res, next);
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();