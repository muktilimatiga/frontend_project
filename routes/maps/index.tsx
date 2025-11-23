import * as React from 'react';
import { useRef, useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '../../components/ui';
import { MockService } from '../../mock';
import { User } from '../../types';
import { AddNodeModal } from './components/AddNodeModal';
import { MapToolbar } from './components/MapToolbar';
import { MapSearch } from './components/MapSearch';

declare const L: any;

export const MapsPage = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [mode, setMode] = useState<'view' | 'add_node' | 'measure' | 'delete_node'>('view');
  const [modalOpen, setModalOpen] = useState(false);
  const [tempCoords, setTempCoords] = useState<any>(null);
  const [measurePoints, setMeasurePoints] = useState<any[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  
  const { data: customers = [] } = useQuery({ queryKey: ['customers'], queryFn: MockService.getCustomers });

  const handleUserSelect = (user: User) => {
     if (user.coordinates && mapInstance.current) {
        mapInstance.current.flyTo([user.coordinates.lat, user.coordinates.lng], 16, {
           animate: true,
           duration: 1.5
        });
     }
  };

  // Initialize Map
  useEffect(() => {
    if (mapRef.current && !mapInstance.current) {
      const map = L.map(mapRef.current).setView([40.73, -74.00], 12);
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
         attribution: '&copy; OpenStreetMap &copy; CARTO',
         subdomains: 'abcd',
         maxZoom: 20
      }).addTo(map);
      mapInstance.current = map;
    }
    return () => {
       if (mapInstance.current) {
          mapInstance.current.off();
          mapInstance.current.remove();
          mapInstance.current = null;
       }
    };
  }, []);

  // Handle Mode & Clicks via Ref
  const modeRef = useRef(mode);
  useEffect(() => { modeRef.current = mode; }, [mode]);
  const measurePointsRef = useRef(measurePoints);
  useEffect(() => { measurePointsRef.current = measurePoints; }, [measurePoints]);

  useEffect(() => {
     if (!mapInstance.current) return;
     const map = mapInstance.current;
     
     const clickHandler = (e: any) => {
        const currentMode = modeRef.current;
        if (currentMode === 'add_node') {
           setTempCoords(e.latlng);
           setModalOpen(true);
        } else if (currentMode === 'measure') {
           const newPoints = [...measurePointsRef.current, e.latlng];
           setMeasurePoints(newPoints);
           L.circleMarker(e.latlng, { radius: 5, color: 'red' }).addTo(map);
           if (newPoints.length >= 2) {
              const p1 = newPoints[newPoints.length - 2];
              const p2 = newPoints[newPoints.length - 1];
              L.polyline([p1, p2], { color: 'red', dashArray: '5, 10' }).addTo(map);
              const dist = map.distance(p1, p2);
              setDistance(dist);
              L.popup().setLatLng(p2).setContent(`Distance: ${dist.toFixed(2)} meters`).openOn(map);
           }
        }
     };

     map.on('click', clickHandler);
     return () => { map.off('click', clickHandler); };
  }, []);

  // Sync Customers
  useEffect(() => {
     if (!mapInstance.current || customers.length === 0) return;
     const map = mapInstance.current;
     customers.forEach(u => {
        if (u.coordinates) {
           const icon = L.divIcon({
              className: 'custom-icon',
              html: `<div class="w-8 h-8 rounded-full border-2 border-white shadow-lg overflow-hidden"><img src="${u.avatarUrl || 'https://i.pravatar.cc/150'}" class="w-full h-full object-cover" /></div>`,
              iconSize: [32, 32],
              iconAnchor: [16, 32]
           });
           L.marker([u.coordinates.lat, u.coordinates.lng], { icon })
             .bindPopup(`<b>${u.name}</b><br/>${u.role}`)
             .addTo(map);
        }
     });
  }, [customers]);

  const handleAddNode = (data: any) => {
     setModalOpen(false);
     const map = mapInstance.current;
     
     const color = data.type === 'ODP' ? '#3b82f6' : '#10b981';
     const label = data.type === 'ODP' ? 'O' : 'T';
     
     const icon = L.divIcon({
        className: 'custom-node-icon',
        html: `<div style="background-color: ${color}; color: white; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; border-radius: 4px; font-size: 10px; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">${label}</div>`,
        iconSize: [24, 24]
     });
     
     const newNode = { ...data, id: `node-${Date.now()}` };
     const marker = L.marker([data.lat, data.lng], { icon });
     marker.on('click', () => {
        if (modeRef.current === 'delete_node') {
           map.removeLayer(marker);
           setMarkers(prev => prev.filter(m => m.id !== newNode.id));
        }
     });
     marker.bindPopup(`<b>${data.type}</b><br/>${data.name}`).addTo(map);
     setMarkers(prev => [...prev, newNode]);
     setMode('view');
  };

  const clearMeasurement = () => {
     setMeasurePoints([]);
     setDistance(null);
     alert("To clear drawings in this demo, please refresh the page.");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <AddNodeModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onConfirm={handleAddNode} coords={tempCoords} />
      
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Geographic Map</h1>
           <p className="text-slate-500 dark:text-slate-400">Network distribution and customer locations.</p>
        </div>
        <div className="flex gap-4">
           <MapSearch onSelectUser={handleUserSelect} />
           <MapToolbar mode={mode} onModeChange={setMode} onMeasureClear={clearMeasurement} />
        </div>
      </div>

      <Card className="h-[600px] overflow-hidden border-0 shadow-lg relative dark:bg-black">
         <div ref={mapRef} className="w-full h-full z-0" />
         
         {mode === 'add_node' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl z-[1000] animate-in fade-in slide-in-from-top-4">Click map to add Node</div>
         )}
         {mode === 'measure' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl z-[1000] animate-in fade-in slide-in-from-top-4">Click points to measure {distance !== null && `(${distance.toFixed(1)}m)`}</div>
         )}
         {mode === 'delete_node' && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl z-[1000] animate-in fade-in slide-in-from-top-4">Click node to delete</div>
         )}
      </Card>
    </div>
  );
};