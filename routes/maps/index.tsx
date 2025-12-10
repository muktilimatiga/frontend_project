
import * as React from 'react';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Card, Button, Badge, Avatar, Separator } from '../../components/ui';
import { User } from '../../types';
import { AddNodeModal } from './components/AddNodeModal';
import { MapToolbar } from './components/MapToolbar';
import { MapSearch } from './components/MapSearch';
import { useCustomers } from '../../hooks/useQueries';
import { useAppStore } from '../../store';
import { 
  Plus, Ruler, MapPin, X, Signal, Activity, Zap, 
  User as UserIcon, Server, Shield, Navigation, Clock 
} from 'lucide-react';

interface MapContextMenu {
  x: number;
  y: number;
  latlng: { lat: number, lng: number };
}

interface HoverInfo {
  x: number;
  y: number;
  type: 'node' | 'customer';
  data: any;
}

interface SelectedEntity {
  type: 'node' | 'customer';
  data: any;
}

// --- Popover Component ---
const MapPopover = ({ info }: { info: HoverInfo }) => {
  if (!info) return null;
  const { type, data } = info;
  const isNode = type === 'node';

  return (
    <div 
      className="fixed z-[2000] pointer-events-none bg-white/95 dark:bg-[#09090b] backdrop-blur-sm dark:backdrop-blur-none border border-slate-200 dark:border-white/10 p-4 rounded-xl shadow-2xl flex flex-col gap-2 min-w-[220px] animate-in fade-in zoom-in-95 duration-200"
      style={{ 
        left: info.x, 
        top: info.y, 
        transform: 'translate(-50%, -100%) translateY(-16px)' 
      }}
    >
      <div className="flex items-center gap-3">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shadow-inner ${isNode ? (data.type === 'ODP' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600') : 'bg-indigo-100 text-indigo-600'}`}>
           {isNode ? <Server className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
        </div>
        <div>
           <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{isNode ? data.name : data.name}</h4>
           <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{isNode ? data.type : data.role}</p>
        </div>
      </div>
      
      <div className="h-px bg-slate-100 dark:bg-white/10 w-full" />
      
      <div className="grid grid-cols-2 gap-2 text-xs">
         <div className="bg-slate-50 dark:bg-white/5 p-1.5 rounded-md">
            <span className="text-slate-400 block text-[10px]">Status</span>
            <span className="font-semibold text-emerald-600 flex items-center gap-1">
               <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Online
            </span>
         </div>
         <div className="bg-slate-50 dark:bg-white/5 p-1.5 rounded-md">
            <span className="text-slate-400 block text-[10px]">{isNode ? 'Signal' : 'Plan'}</span>
            <span className="font-medium text-slate-700 dark:text-slate-200">{isNode ? '-18.4 dBm' : '100 Mbps'}</span>
         </div>
      </div>
      
      {/* Triangle Pointer */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-white/95 dark:border-t-[#09090b] drop-shadow-sm" />
    </div>
  );
};

// --- Detail Card (Drawer) ---
const DetailDrawer = ({ entity, onClose }: { entity: SelectedEntity, onClose: () => void }) => {
  const isNode = entity.type === 'node';
  const data = entity.data;

  return (
    <div className="absolute top-4 right-4 bottom-4 w-[380px] z-[1000] flex flex-col gap-4 animate-in slide-in-from-right duration-300 pointer-events-none">
       <Card className="flex-1 pointer-events-auto shadow-2xl border-slate-200 dark:border-white/10 dark:bg-black/95 backdrop-blur-md overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-white/10 flex justify-between items-start bg-slate-50/50 dark:bg-white/5">
             <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center border shadow-sm ${isNode ? 'bg-white dark:bg-black border-slate-200 dark:border-white/20' : 'bg-indigo-600 border-indigo-500 text-white'}`}>
                   {isNode ? <Server className="h-5 w-5 text-slate-700 dark:text-slate-300" /> : <UserIcon className="h-5 w-5" />}
                </div>
                <div>
                   <h2 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">{data.name}</h2>
                   <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <Badge variant="outline" className="h-5 px-1.5 bg-white dark:bg-white/10">{isNode ? data.type : 'Customer'}</Badge>
                      <span className="flex items-center gap-1 text-emerald-600"><Activity className="h-3 w-3" /> Online</span>
                   </div>
                </div>
             </div>
             <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 -mr-2"><X className="h-4 w-4" /></Button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6 flex-1 overflow-y-auto">
             
             {/* Map Preview Mini (Mock) */}
             <div className="h-32 bg-slate-100 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 relative overflow-hidden flex items-center justify-center">
                 <div className="absolute inset-0 opacity-20 bg-[url('https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/13/2411/3078.png')] bg-cover" />
                 <Button size="sm" variant="outline" className="bg-white/80 dark:bg-black/80 backdrop-blur z-10 text-xs">
                    <Navigation className="mr-2 h-3 w-3" /> Get Directions
                 </Button>
             </div>

             {/* Stats Grid */}
             <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5 space-y-1">
                   <div className="text-xs text-slate-500 flex items-center gap-1"><Signal className="h-3 w-3" /> Signal Strength</div>
                   <div className="text-lg font-bold text-slate-900 dark:text-white">-18.4 <span className="text-xs font-normal text-slate-400">dBm</span></div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5 space-y-1">
                   <div className="text-xs text-slate-500 flex items-center gap-1"><Zap className="h-3 w-3" /> Power Status</div>
                   <div className="text-lg font-bold text-slate-900 dark:text-white">Normal</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5 space-y-1">
                   <div className="text-xs text-slate-500 flex items-center gap-1"><Activity className="h-3 w-3" /> Uptime</div>
                   <div className="text-lg font-bold text-slate-900 dark:text-white">14d 2h</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/5 space-y-1">
                   <div className="text-xs text-slate-500 flex items-center gap-1"><Clock className="h-3 w-3" /> Last Ping</div>
                   <div className="text-lg font-bold text-slate-900 dark:text-white">24 <span className="text-xs font-normal text-slate-400">ms</span></div>
                </div>
             </div>

             {isNode && (
               <div className="space-y-3">
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Connected Ports (8/16)</h3>
                  <div className="grid grid-cols-8 gap-1">
                     {Array.from({ length: 16 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`aspect-square rounded border flex items-center justify-center text-[10px] font-medium transition-colors cursor-help
                            ${i < 8 
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-900/50 dark:text-emerald-400' 
                              : 'bg-slate-50 border-slate-200 text-slate-300 dark:bg-white/5 dark:border-white/10 dark:text-slate-600'}`}
                          title={`Port ${i + 1}: ${i < 8 ? 'Connected' : 'Empty'}`}
                        >
                           {i + 1}
                        </div>
                     ))}
                  </div>
               </div>
             )}

             {!isNode && (
                <div className="space-y-2">
                   <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Subscription</h3>
                   <div className="flex items-center justify-between p-3 border border-slate-200 dark:border-white/10 rounded-lg">
                      <div>
                         <div className="font-medium text-sm">Home Fiber 100</div>
                         <div className="text-xs text-slate-500">100 Mbps • Unlimited</div>
                      </div>
                      <Badge variant="success">Active</Badge>
                   </div>
                </div>
             )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 dark:border-white/10 grid grid-cols-2 gap-3 bg-slate-50/50 dark:bg-white/5">
             <Button variant="outline">View History</Button>
             <Button>{isNode ? 'Manage Node' : 'View Profile'}</Button>
          </div>
       </Card>
    </div>
  );
};

export const MapsPage = () => {
  const { theme } = useAppStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const layerGroupRef = useRef<any>(null);
  const cableLayerRef = useRef<any>(null);
  
  // State
  const [mode, setMode] = useState<'view' | 'add_node' | 'measure' | 'delete_node' | 'edit'>('view');
  const [modalOpen, setModalOpen] = useState(false);
  const [newNodeCoords, setNewNodeCoords] = useState<{lat: number, lng: number} | null>(null);
  const [nodes, setNodes] = useState<any[]>([
    { id: 'n1', name: 'ODP-NY-01', type: 'ODP', lat: 40.7128, lng: -74.0060 },
    { id: 'n2', name: 'OTC-NY-CENTRAL', type: 'OTC', lat: 40.7150, lng: -74.0090 },
    { id: 'n3', name: 'ODP-NY-02', type: 'ODP', lat: 40.7100, lng: -74.0020 },
  ]);
  
  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);
  const [showCables, setShowCables] = useState(true);

  const { data: customers = [] } = useCustomers();

  // Initialize Map
  useEffect(() => {
    // Safely access Leaflet from window
    const L = (window as any).L;
    if (!L) {
       console.error("Leaflet (L) is not available. Ensure the script is loaded in index.html");
       return;
    }

    if (mapRef.current && !mapInstance.current) {
       console.log("Initializing Leaflet Map...");
       mapInstance.current = L.map(mapRef.current, {
          center: [40.7128, -74.0060],
          zoom: 15,
          zoomControl: false,
          attributionControl: false
       });

       L.control.zoom({ position: 'bottomright' }).addTo(mapInstance.current);

       layerGroupRef.current = L.layerGroup().addTo(mapInstance.current);
       cableLayerRef.current = L.layerGroup().addTo(mapInstance.current);

       mapInstance.current.on('click', (e: any) => {
          if (useMapsStateRef.current.mode === 'add_node') {
             setNewNodeCoords(e.latlng);
             setModalOpen(true);
          } else {
             setSelectedEntity(null);
          }
       });

       // Force initial resize to prevent gray area
       setTimeout(() => {
          mapInstance.current.invalidateSize();
       }, 200);
    }

    return () => {
       if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
       }
    };
  }, []);

  // Sync state ref for event handlers
  const useMapsStateRef = useRef({ mode, nodes, customers });
  useEffect(() => {
     useMapsStateRef.current = { mode, nodes, customers };
  }, [mode, nodes, customers]);

  // Handle Tile Layer Updates (Theme)
  useEffect(() => {
     const L = (window as any).L;
     if (!mapInstance.current || !L) return;
     
     mapInstance.current.eachLayer((layer: any) => {
        if (layer instanceof L.TileLayer) {
           mapInstance.current.removeLayer(layer);
        }
     });

     // Use 'light_all' for better reliability in light mode
     const tileUrl = theme === 'dark' 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
     
     L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd',
     }).addTo(mapInstance.current);
  }, [theme]);

  // Render Markers and Cables
  useEffect(() => {
     const L = (window as any).L;
     if (!L || !layerGroupRef.current || !cableLayerRef.current) return;

     // Clear layers
     layerGroupRef.current.clearLayers();
     cableLayerRef.current.clearLayers();

     // Helper to create markers
     const createMarker = (lat: number, lng: number, type: 'node' | 'customer', data: any) => {
        const isNode = type === 'node';
        let iconHtml = '';
        
        if (isNode) {
           const colorClass = data.type === 'OTC' ? 'bg-emerald-500' : 'bg-blue-500';
           iconHtml = `<div class="${colorClass} w-4 h-4 rounded-full border-2 border-white shadow-lg flex items-center justify-center transform hover:scale-125 transition-transform"><div class="w-1 h-1 bg-white rounded-full"></div></div>`;
        } else {
           iconHtml = `<div class="bg-indigo-500 w-3 h-3 rounded-full border border-white shadow-sm hover:scale-125 transition-transform"></div>`;
        }

        const icon = L.divIcon({
           className: 'bg-transparent',
           html: iconHtml,
           iconSize: [16, 16],
           iconAnchor: [8, 8]
        });

        const marker = L.marker([lat, lng], { icon, draggable: mode === 'edit' && isNode });
        
        marker.on('mouseover', (e: any) => {
           setHoverInfo({
              x: e.originalEvent.clientX,
              y: e.originalEvent.clientY,
              type,
              data
           });
        });

        marker.on('mouseout', () => {
           setHoverInfo(null);
        });

        marker.on('click', (e: any) => {
           L.DomEvent.stopPropagation(e);
           if (useMapsStateRef.current.mode === 'delete_node' && isNode) {
              setNodes(prev => prev.filter(n => n.id !== data.id));
           } else {
              setSelectedEntity({ type, data });
              setHoverInfo(null);
              mapInstance.current.flyTo([lat, lng], 17, { animate: true, duration: 0.5 });
           }
        });

        if (mode === 'edit' && isNode) {
            marker.on('dragend', (e: any) => {
                const newPos = e.target.getLatLng();
                setNodes(prev => prev.map(n => n.id === data.id ? { ...n, lat: newPos.lat, lng: newPos.lng } : n));
            });
        }

        return marker;
     };

     // Render Nodes
     nodes.forEach(node => {
        createMarker(node.lat, node.lng, 'node', node).addTo(layerGroupRef.current);
     });

     // Render Customers
     customers.forEach(customer => {
        if (customer.coordinates) {
           createMarker(customer.coordinates.lat, customer.coordinates.lng, 'customer', customer).addTo(layerGroupRef.current);
           
           if (showCables) {
               let nearest = nodes[0];
               let minDist = Infinity;
               nodes.forEach(n => {
                   const d = Math.sqrt(Math.pow(n.lat - customer.coordinates!.lat, 2) + Math.pow(n.lng - customer.coordinates!.lng, 2));
                   if (d < minDist) {
                       minDist = d;
                       nearest = n;
                   }
               });
               
               if (nearest) {
                   L.polyline([[nearest.lat, nearest.lng], [customer.coordinates.lat, customer.coordinates.lng]], {
                       color: theme === 'dark' ? '#6366f1' : '#cbd5e1',
                       weight: 1,
                       opacity: 0.5,
                       dashArray: '4, 4'
                   }).addTo(cableLayerRef.current);
               }
           }
        }
     });

     // Backbone Cables
     if (showCables && nodes.length > 1) {
         for(let i = 0; i < nodes.length - 1; i++) {
             L.polyline([[nodes[i].lat, nodes[i].lng], [nodes[i+1].lat, nodes[i+1].lng]], {
                 color: '#10b981',
                 weight: 3,
                 opacity: 0.8
             }).addTo(cableLayerRef.current);
         }
     }

  }, [nodes, customers, mode, theme, showCables]);


  const handleAddNode = (data: any) => {
     const newNode = {
        id: `n-${Date.now()}`,
        ...data
     };
     setNodes(prev => [...prev, newNode]);
     setModalOpen(false);
     setMode('view');
  };

  const handleSelectUser = (user: User) => {
     if (user.coordinates && mapInstance.current) {
        mapInstance.current.flyTo([user.coordinates.lat, user.coordinates.lng], 18);
        setSelectedEntity({ type: 'customer', data: user });
     }
  };

  return (
    <div className="relative h-[calc(100vh-11rem)] w-full rounded-xl overflow-hidden border border-slate-200 dark:border-white/20 shadow-sm animate-in fade-in duration-500">
       
       <AddNodeModal 
          isOpen={modalOpen} 
          onClose={() => setModalOpen(false)} 
          onConfirm={handleAddNode}
          coords={newNodeCoords || { lat: 0, lng: 0 }}
       />

       <MapPopover info={hoverInfo!} />

       {selectedEntity && (
          <DetailDrawer 
            entity={selectedEntity} 
            onClose={() => setSelectedEntity(null)} 
          />
       )}

       <div className="absolute top-4 left-4 right-16 z-[400] flex justify-between items-start pointer-events-none">
          <div className="pointer-events-auto shadow-lg rounded-lg">
              <MapSearch onSelectUser={handleSelectUser} />
          </div>
          <div className="pointer-events-auto">
             <MapToolbar 
                mode={mode} 
                onModeChange={setMode} 
                onMeasureClear={() => {}}
                showCables={showCables}
                onToggleCables={() => setShowCables(!showCables)}
             />
          </div>
       </div>

       {/* Map Container - Explicitly styles */}
       <div 
         id="map" 
         ref={mapRef} 
         className="h-full w-full bg-slate-100 dark:bg-zinc-900 z-0 block" 
         style={{ minHeight: '400px', height: '100%', width: '100%' }}
       />
       
       {mode === 'add_node' && (
          <div className="absolute inset-0 pointer-events-none z-[300] flex items-center justify-center">
             <div className="text-slate-900 dark:text-white drop-shadow-md">
                <Plus className="h-8 w-8" />
             </div>
          </div>
       )}
    </div>
  );
};
