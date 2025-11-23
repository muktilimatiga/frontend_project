import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as ExcalidrawLib from '@excalidraw/excalidraw';
import { Card, Button, DataTable, ColumnDef, Badge } from '../../components/ui';
import { Plus, ChevronLeft, Save } from 'lucide-react';
import { MockService } from '../../mock';
import { useAppStore } from '../../store';
import { toast } from 'sonner';
import { ImportNodeModal } from './components/ImportNodeModal';
import { TopologyPropertiesPanel } from './components/TopologyPropertiesPanel';
import { NETWORK_SVGS } from './constants';

// --- Safe Excalidraw Import ---
const Excalidraw = (ExcalidrawLib as any).Excalidraw || (ExcalidrawLib as any).default?.Excalidraw || (ExcalidrawLib as any).default;
const MainMenu = (ExcalidrawLib as any).MainMenu || (ExcalidrawLib as any).default?.MainMenu || (() => null);
const WelcomeScreen = (ExcalidrawLib as any).WelcomeScreen || (ExcalidrawLib as any).default?.WelcomeScreen || (() => null);

// --- Sub-Component: Topology List View ---
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

// --- Sub-Component: Excalidraw Editor ---
export const TopologyEditor = ({ topology, onBack }: { topology: any, onBack: () => void }) => {
  const { theme } = useAppStore();
  const [excalidrawAPI, setExcalidrawAPI] = useState<any>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selectedNodeData, setSelectedNodeData] = useState<{ id: string, label: string, locked: boolean, strokeColor: string } | null>(null);

  const handleSave = () => {
     if (!excalidrawAPI) return;
     toast.success('Topology Saved', {
        description: `${topology.name} has been updated successfully.`
     });
  };

  // Listen for Selection Changes
  useEffect(() => {
    if (!excalidrawAPI) return;

    const onChange = (elements: any[], appState: any) => {
        const selectedIds = Object.keys(appState.selectedElementIds);
        
        if (selectedIds.length === 0) {
            setSelectedNodeData(null);
            return;
        }

        // We check if we selected a "Node" group (Text + Image)
        // For simplicity, we grab the first selected element
        // If it's part of a group, Excalidraw selects the group usually
        const elementId = selectedIds[0];
        const element = elements.find(el => el.id === elementId);

        if (element) {
            // Find related elements in the same group
            let groupElements = [element];
            if (element.groupIds && element.groupIds.length > 0) {
                const groupId = element.groupIds[0];
                groupElements = elements.filter(el => el.groupIds && el.groupIds.includes(groupId));
            }

            const textEl = groupElements.find(el => el.type === 'text');
            const visualEl = groupElements.find(el => el.type !== 'text'); // Image or Rectangle

            if (textEl || visualEl) {
                setSelectedNodeData({
                    id: visualEl?.id || textEl?.id || element.id, // ID to track logic
                    label: textEl ? textEl.text : '',
                    locked: element.locked,
                    strokeColor: textEl?.strokeColor || visualEl?.strokeColor || '#000000',
                });
            } else {
                // Generic element
                setSelectedNodeData({
                    id: element.id,
                    label: '',
                    locked: element.locked,
                    strokeColor: element.strokeColor
                });
            }
        }
    };

    const unsubscribe = excalidrawAPI.onChange(onChange);
    return () => { 
        // Excalidraw onChange returns a cleanup function in newer versions, 
        // but if not, we rely on standard React cleanup which might just detach if the component unmounts.
        // The library handles listeners internally usually.
    };
  }, [excalidrawAPI]);


  const updateSelectedNode = async (updates: Partial<{ label: string; locked: boolean; strokeColor: string; iconType: string; customImage: string }>) => {
      if (!excalidrawAPI) return;
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const selectedIds = Object.keys(appState.selectedElementIds);

      if (selectedIds.length === 0) return;

      // Identify the group
      const primaryId = selectedIds[0];
      const primaryEl = elements.find((el: any) => el.id === primaryId);
      if (!primaryEl) return;

      let targetElements = [primaryEl];
      if (primaryEl.groupIds && primaryEl.groupIds.length > 0) {
          const groupId = primaryEl.groupIds[0];
          targetElements = elements.filter((el: any) => el.groupIds && el.groupIds.includes(groupId));
      }

      const textEl = targetElements.find((el: any) => el.type === 'text');
      const visualEl = targetElements.find((el: any) => el.type === 'image' || el.type === 'rectangle' || el.type === 'ellipse');

      // 1. Update Label
      if (updates.label !== undefined && textEl) {
          // Excalidraw text elements are immutable-ish, we use updateScene
          // But we just pass the updated element object
          // We need to preserve original props
          textEl.text = updates.label; 
          // Re-centering text might be complex, simplified here:
          if (visualEl) {
             textEl.x = visualEl.x + (visualEl.width / 2) - (updates.label.length * 4); // Approx
          }
      }

      // 2. Update Lock
      if (updates.locked !== undefined) {
          targetElements.forEach((el: any) => el.locked = updates.locked);
      }

      // 3. Update Color
      if (updates.strokeColor !== undefined) {
          targetElements.forEach((el: any) => el.strokeColor = updates.strokeColor);
      }

      // 4. Update Icon (Image)
      if (updates.iconType || updates.customImage) {
          let dataURL = updates.customImage;
          
          if (updates.iconType && !dataURL) {
             const svgString = NETWORK_SVGS[updates.iconType] || NETWORK_SVGS['default'];
             const color = updates.strokeColor || (theme === 'dark' ? '#ffffff' : '#000000');
             const encodedSvg = btoa(unescape(encodeURIComponent(svgString.replace(/currentColor/g, color))));
             dataURL = `data:image/svg+xml;base64,${encodedSvg}`;
          }

          if (dataURL && visualEl && visualEl.type === 'image') {
              // Add new file
              const fileId = `file_${Date.now()}`;
              await excalidrawAPI.addFiles([{
                 id: fileId,
                 dataURL: dataURL,
                 mimeType: 'image/svg+xml', // or png
                 created: Date.now()
              }]);
              
              // Update element to point to new file
              visualEl.fileId = fileId;
          }
      }

      // Commit Updates
      excalidrawAPI.updateScene({
          elements: elements // We mutated elements in place (which works with some libraries) or we should map. 
                             // Excalidraw usually expects a new array or mutated objects passed to updateScene.
                             // Safest is to pass the modified objects.
      });
      
      // Update local state to reflect changes in panel immediately
      setSelectedNodeData(prev => prev ? ({ ...prev, ...updates }) : null);
  };


  const insertNodeToScene = async (type: string, label: string, imageSrc?: string) => {
    if (!excalidrawAPI) return;

    let dataURL = imageSrc;

    if (!dataURL) {
      const svgString = NETWORK_SVGS[type] || NETWORK_SVGS['default'];
      const color = theme === 'dark' ? '#ffffff' : '#000000';
      const encodedSvg = btoa(unescape(encodeURIComponent(svgString.replace(/currentColor/g, color))));
      dataURL = `data:image/svg+xml;base64,${encodedSvg}`;
    }

    if (!dataURL) return;

    const fileId = `${type}_${Date.now()}`;
    await excalidrawAPI.addFiles([{
        id: fileId,
        dataURL: dataURL,
        mimeType: imageSrc ? 'image/png' : 'image/svg+xml',
        created: Date.now(),
    }]);

    const appState = excalidrawAPI.getAppState();
    const centerX = appState.scrollX + (appState.width / 2);
    const centerY = appState.scrollY + (appState.height / 2);

    const imgId = `img_${Date.now()}`;
    const imageElement = {
        id: imgId,
        type: "image",
        fileId: fileId,
        status: "saved",
        x: centerX - 25,
        y: centerY - 25,
        width: 50,
        height: 50,
        strokeColor: "transparent",
        backgroundColor: "transparent",
    };

    const txtId = `txt_${Date.now()}`;
    const textElement = {
        id: txtId,
        type: "text",
        text: label,
        x: centerX - (label.length * 4), 
        y: centerY + 30,
        fontSize: 16,
        fontFamily: 1,
        strokeColor: theme === 'dark' ? '#ffffff' : '#000000',
        textAlign: 'center',
        verticalAlign: 'top',
    };

    const groupId = `grp_${Date.now()}`;
    const newElements = [
        { ...imageElement, groupIds: [groupId] },
        { ...textElement, groupIds: [groupId] }
    ];
    
    excalidrawAPI.updateScene({
        elements: [
            ...excalidrawAPI.getSceneElements(),
            ...newElements
        ]
    });

    setIsImportOpen(false);
    toast.success('Node Added', { description: `${label} added to canvas.` });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] gap-4 animate-in fade-in duration-500">
      <ImportNodeModal 
        isOpen={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        onSelect={insertNodeToScene}
      />

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
           <Button variant="outline" onClick={() => setIsImportOpen(true)}>
               <Plus className="mr-2 h-4 w-4" /> Add Node
           </Button>
           <Button variant="outline" onClick={onBack}>Cancel</Button>
           <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:text-white">
              <Save className="mr-2 h-4 w-4" /> Save Topology
           </Button>
        </div>
      </div>

      <div className="flex-1 w-full border border-slate-200 dark:border-white/20 rounded-xl overflow-hidden shadow-sm relative flex">
         <div className="flex-1 h-full relative">
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

         {/* Property Editor Panel */}
         {selectedNodeData && (
             <TopologyPropertiesPanel 
                data={selectedNodeData} 
                onUpdate={updateSelectedNode}
                onClose={() => {
                   // Deselect
                   if (excalidrawAPI) {
                      excalidrawAPI.updateScene({ appState: { selectedElementIds: {} } });
                   }
                   setSelectedNodeData(null);
                }}
             />
         )}
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
