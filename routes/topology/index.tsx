import * as React from 'react';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as ExcalidrawLib from '@excalidraw/excalidraw';
import { Card, Button, DataTable, ColumnDef, Badge } from '../../components/ui';
import { Plus, ChevronLeft, Save } from 'lucide-react';
import { MockService } from '../../mock';
import { useAppStore } from '../../store';
import { toast } from 'sonner';

// --- Safe Excalidraw Import ---
// This handles the discrepancy between ESM/CJS builds on different CDNs
const Excalidraw = (ExcalidrawLib as any).Excalidraw || (ExcalidrawLib as any).default?.Excalidraw || (ExcalidrawLib as any).default;
const MainMenu = (ExcalidrawLib as any).MainMenu || (ExcalidrawLib as any).default?.MainMenu || (() => null);
const WelcomeScreen = (ExcalidrawLib as any).WelcomeScreen || (ExcalidrawLib as any).default?.WelcomeScreen || (() => null);

// --- Sub-Component: Topology List View (Directory) ---
const TopologyList = ({ onSelect }: { onSelect: (topology: any) => void }) => {
  const { data: topologies = [], isLoading } = useQuery({ queryKey: ['topologies'], queryFn: MockService.getTopologies });

  const columns: ColumnDef<any>[] = [
    { 
       header: 'Name', 
       accessorKey: 'name', 
       cell: (row) => <span className="font-semibold text-slate-900 dark:text-white cursor-pointer hover:underline" onClick={() => onSelect(row)}>{row.name}</span> 
    },
    { 
       header: 'Status', 
       accessorKey: 'status', 
       cell: (row) => (
          <Badge variant={row.status === 'Active' ? 'success' : row.status === 'Maintenance' ? 'warning' : 'secondary'}>
             {row.status}
          </Badge>
       ) 
    },
    { 
       header: 'Nodes', 
       accessorKey: 'nodes',
       className: 'text-center'
    },
    { 
       header: 'Last Updated', 
       accessorKey: 'updatedAt', 
       cell: (row) => <span className="text-xs text-slate-500">{new Date(row.updatedAt).toLocaleDateString()}</span> 
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
       <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Network Topologies</h1>
            <p className="text-slate-500 dark:text-slate-400">Select a topology map to view or edit using Excalidraw.</p>
          </div>
          <Button onClick={() => onSelect({ id: 'new', name: 'New Topology', status: 'Draft', nodes: 0, updatedAt: new Date().toISOString() })}>
             <Plus className="h-4 w-4 mr-2" /> New Topology
          </Button>
       </div>
       <Card className="dark:bg-black dark:border-white/20">
          <div className="p-6">
             {isLoading ? <div className="text-center py-8 text-slate-500">Loading topologies...</div> : (
                <DataTable 
                   data={topologies} 
                   columns={columns} 
                   searchKey="name" 
                   onEdit={(item) => onSelect(item)}
                   onDelete={() => {}}
                />
             )}
          </div>
       </Card>
    </div>
  );
};

// --- Sub-Component: Excalidraw Editor Wrapper ---
export const TopologyEditor = ({ topology, onBack }: { topology: any, onBack: () => void }) => {
  const { theme } = useAppStore();
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);

  const handleSave = () => {
     if (!excalidrawAPI) return;
     // In a real app, we would verify elements: excalidrawAPI.getSceneElements();
     toast.success('Topology Saved', {
        description: `${topology.name} has been updated successfully.`
     });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] gap-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 -ml-2">
               <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{topology.name}</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 ml-8 text-sm">Status: {topology.status} • Excalidraw Editor Active</p>
        </div>
        
        <div className="flex items-center gap-2">
           <Button variant="outline" onClick={onBack}>Cancel</Button>
           <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:text-white">
              <Save className="mr-2 h-4 w-4" /> Save Topology
           </Button>
        </div>
      </div>

      <div className="flex-1 w-full border border-slate-200 dark:border-white/20 rounded-xl overflow-hidden shadow-sm relative">
         <div style={{ width: '100%', height: '100%' }}>
            {/* The Excalidraw component might be undefined if import failed, handle gracefully */}
            {Excalidraw ? (
                <Excalidraw 
                   theme={theme === 'dark' ? 'dark' : 'light'}
                   excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
                   initialData={{
                      appState: { 
                         viewBackgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
                         currentItemStrokeColor: theme === 'dark' ? '#a5b4fc' : '#4f46e5',
                         currentItemBackgroundColor: 'transparent',
                      },
                      elements: [],
                   }}
                   UIOptions={{
                      canvasActions: {
                         changeViewBackgroundColor: true,
                         clearCanvas: true,
                         export: { saveFileToDisk: true },
                         loadScene: true,
                         saveToActiveFile: false,
                         toggleTheme: false,
                         saveAsImage: true,
                      }
                   }}
                >
                   {MainMenu && (
                       <MainMenu>
                          <MainMenu.DefaultItems.Export />
                          <MainMenu.DefaultItems.SaveAsImage />
                          <MainMenu.DefaultItems.ClearCanvas />
                          <MainMenu.Separator />
                          <MainMenu.DefaultItems.ChangeCanvasBackground />
                       </MainMenu>
                   )}
                   {WelcomeScreen && <WelcomeScreen />}
                </Excalidraw>
            ) : (
                <div className="flex items-center justify-center h-full text-slate-500">
                    Failed to load Excalidraw. Please refresh.
                </div>
            )}
         </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export const TopologyPage = () => {
  const [selectedTopology, setSelectedTopology] = useState<any | null>(null);

  if (selectedTopology) {
    return <TopologyEditor topology={selectedTopology} onBack={() => setSelectedTopology(null)} />;
  }
  return <TopologyList onSelect={setSelectedTopology} />;
};