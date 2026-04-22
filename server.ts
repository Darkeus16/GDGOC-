import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { Shipment, CreateShipmentDto, ShipmentStatus, RouteSuggestion } from './src/types';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  let shipments: Shipment[] = [];

  // Helper to generate suggestions
  const generateSuggestions = (shipment: Shipment): RouteSuggestion[] => {
    if (shipment.riskScore < 30) return [];

    return [
      {
        id: uuidv4(),
        name: 'Alt-Corridor-North',
        adjustment: 'Reroute via Northern Expressway',
        impact: { time: '-45 min', cost: '+$120', fuel: '-2%' }
      },
      {
        id: uuidv4(),
        name: 'Intermodal-Shift',
        adjustment: 'Switch to Express Freight Rail',
        impact: { time: '+2 hrs', cost: '-$300', fuel: '-15%' }
      },
      {
        id: uuidv4(),
        name: 'Dynamic-Relay',
        adjustment: 'Direct handoff at Warehouse 7B',
        impact: { time: '-2.5 hrs', cost: '+$450', fuel: '+5%' }
      }
    ];
  };

  // Rule-based Delay Prediction Engine
  const calculateRisk = (shipment: Shipment): number => {
    let score = 0;
    
    // 1. Progress ratio
    const progress = (shipment.distance - shipment.distanceRemaining) / shipment.distance;
    const timeElapsed = (Date.now() - new Date(shipment.createdAt).getTime()) / 3600000;
    const totalAllocatedTime = (new Date(shipment.expectedDelivery).getTime() - new Date(shipment.createdAt).getTime()) / 3600000;
    
    const expectedProgress = timeElapsed / totalAllocatedTime;
    
    if (progress < expectedProgress) {
      score += (expectedProgress - progress) * 100 * 1.5; // Weight progress risk higher
    }

    // 2. Traffic factor
    if (shipment.trafficCondition === 'high') score += 30;
    if (shipment.trafficCondition === 'moderate') score += 15;

    // 3. Weight factor (Heavier shipments are higher risk due to mechanical/compliance stops)
    if (shipment.weight > 10000) score += 20;
    else if (shipment.weight > 5000) score += 10;

    // 4. Volume factor (High volume requires more careful maneuvering/space)
    if (shipment.volume > 50) score += 15;
    else if (shipment.volume > 20) score += 5;

    // 5. Goods Type factor
    switch (shipment.goodsType) {
      case 'Perishable':
        score += 25; // Urgent
        break;
      case 'Hazardous':
        score += 20; // Compliance/safety delays
        break;
      case 'Fragile':
        score += 15; // Slower handling
        break;
      default:
        break;
    }

    // 6. Distance remaining penalty
    if (shipment.distanceRemaining > 100 && score > 40) score += 10;

    return Math.min(Math.max(score, 0), 100);
  };

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.get('/api/shipments', (req, res) => {
    console.log('GET /api/shipments');
    res.json(shipments);
  });

  app.post('/api/shipments', (req, res) => {
    const dto: CreateShipmentDto = req.body;
    const newShipment: Shipment = {
      id: uuidv4(),
      tagId: `JIO-${Math.floor(1000 + Math.random() * 9000)}`,
      origin: dto.origin,
      destination: dto.destination,
      distance: dto.distance,
      distanceRemaining: dto.distance,
      weight: dto.weight || 100,
      volume: dto.volume || 1,
      goodsType: dto.goodsType || 'Standard',
      expectedDelivery: dto.expectedDelivery,
      createdAt: new Date().toISOString(),
      status: 'on-time',
      riskScore: 0,
      lastKnownLocation: {
        lat: 19.0760, // Start in Mumbai
        lng: 72.8777,
        name: dto.origin
      },
      lastSeenBy: 'HUB-MUM-01',
      signalStrength: -65,
      trafficCondition: 'low',
      suggestions: []
    };
    shipments.push(newShipment);
    res.status(201).json(newShipment);
  });

  // Simulation loop (Network Handoff / Last Seen)
  setInterval(() => {
    const devices = ['iPhone-Logistic-42', 'Node-Express-99', 'Samsung-Delivery-7', 'Gate-Validator-B', 'HUB-TRANSIT-2'];
    
    shipments = shipments.map(s => {
      if (s.distanceRemaining <= 0) return s;

      // Handoff logic (Last seen location updates)
      const movement = Math.random() * 1.5;
      const newRemaining = Math.max(s.distanceRemaining - movement, 0);
      
      // Update coordinates based on "detection"
      const newLat = s.lastKnownLocation.lat + (Math.random() - 0.5) * 0.01;
      const newLng = s.lastKnownLocation.lng + (Math.random() - 0.4) * 0.01;

      // Simulation of Bluetooth Mesh detection
      const newDevice = Math.random() > 0.8 ? devices[Math.floor(Math.random() * devices.length)] : s.lastSeenBy;
      const newRSSI = -Math.floor(40 + Math.random() * 50);

      const trafficRand = Math.random();
      const traffic: 'low' | 'moderate' | 'high' = 
        trafficRand > 0.9 ? 'high' : 
        trafficRand > 0.7 ? 'moderate' : 'low';

      const updated: Shipment = {
        ...s,
        distanceRemaining: newRemaining,
        lastKnownLocation: {
            ...s.lastKnownLocation,
            lat: newLat,
            lng: newLng
        },
        lastSeenBy: newDevice,
        signalStrength: newRSSI,
        trafficCondition: traffic
      };

      updated.riskScore = calculateRisk(updated);
      
      if (updated.riskScore > 75) updated.status = 'delayed';
      else if (updated.riskScore > 40) updated.status = 'at-risk';
      else updated.status = 'on-time';

      updated.suggestions = generateSuggestions(updated);

      return updated;
    });
  }, 2000);

  // Unmatched API route protection - Force 404 JSON to prevent SPA fallback
  app.all('/api/*', (req, res) => {
    console.warn(`404 Unmatched API: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'API route not found', path: req.url });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    // Use vite's connect instance as middleware with a path guard to ensure API routes are handled by Express
    app.use((req, res, next) => {
      if (req.url.startsWith('/api')) {
        return next();
      }
      vite.middlewares(req, res, next);
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
