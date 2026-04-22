import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {setOptions} from '@googlemaps/js-api-loader';
import App from './App.tsx';
import './index.css';

setOptions({
  apiKey: (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '',
  version: 'weekly',
} as any);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
