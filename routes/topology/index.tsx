import * as React from 'react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as ExcalidrawLib from '@excalidraw/excalidraw';
import { Card, Button, DataTable, ColumnDef, Badge } from '../../components/ui';
import { Plus, ChevronLeft, Save } from 'lucide-react';
import { MockService } from '../../mock';
import { useAppStore } from '../../store';
import { toast } from 'sonner';
import { ImportNodeModal } from './components/ImportNodeModal';
import { TopologyPropertiesPanel } from './components/TopologyPropertiesPanel';
import { TopologyToolbar } from './components/TopologyToolbar';
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
  
  // Toolbar State
  const [isEditMode, setIsEditMode] = useState(true);
  const [activeTool, setActiveTool] = useState<'select' | 'cable' | 'rect' | 'circle' | 'diamond' | 'arrow' | 'text'>('select');
  const [cableStyle, setCableStyle] = useState<'solid' | 'dotted' | 'dashed'>('solid');
  const [cableColor, setCableColor] = useState(theme === 'dark' ? '#ffffff' : '#000000');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Memoize initialData to prevent Excalidraw from re-rendering and triggering onChange loops
  const initialData = useMemo(() => ({
      appState: { 
         viewBackgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
         currentItemStrokeColor: theme === 'dark' ? '#a5b4fc' : '#4f46e5',
         currentItemBackgroundColor: 'transparent',
         gridSize: 20,
      },
      elements: [],
  }), []); // Keep dependency empty to only run on mount

  const uiOptions = useMemo(() => ({
      canvasActions: {
         changeViewBackgroundColor: true,
         clearCanvas: false, // We have our own
         export: { saveFileToDisk: true },
         loadScene: true,
         saveToActiveFile: false,
         toggleTheme: false,
         saveAsImage: true,
      }
  }), []);

  // Effect to update Excalidraw theme when app theme changes
  useEffect(() => {
     if (excalidrawAPI) {
        excalidrawAPI.updateScene({
           appState: {
              viewBackgroundColor: theme === 'dark' ? '#000000' : '#ffffff',
              currentItemStrokeColor: theme === 'dark' ? '#a5b4fc' : '#4f46e5',
           }
        });
     }
  }, [theme, excalidrawAPI]);

  const handleSave = () => {
     if (!excalidrawAPI) return;
     toast.success('Topology Saved', {
        description: `${topology.name} has been updated successfully.`
     });
  };

  // Sync state with Excalidraw events
  useEffect(() => {
    if (!excalidrawAPI) return;

    const onChange = (elements: any[], appState: any) => {
        setCanUndo(true); 
        setCanRedo(true);

        const selectedIds = Object.keys(appState.selectedElementIds);
        if (selectedIds.length === 0) {
            setSelectedNodeData(null);
            return;
        }

        const elementId = selectedIds[0];
        const element = elements.find(el => el.id === elementId);

        if (element) {
            let groupElements = [element];
            if (element.groupIds && element.groupIds.length > 0) {
                const groupId = element.groupIds[0];
                groupElements = elements.filter(el => el.groupIds && el.groupIds.includes(groupId));
            }

            const textEl = groupElements.find(el => el.type === 'text');
            const visualEl = groupElements.find(el => el.type !== 'text'); 

            if (textEl || visualEl) {
                setSelectedNodeData({
                    id: visualEl?.id || textEl?.id || element.id,
                    label: textEl ? textEl.text : '',
                    locked: element.locked,
                    strokeColor: textEl?.strokeColor || visualEl?.strokeColor || '#000000',
                });
            } else {
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
    return () => {};
  }, [excalidrawAPI]);

  // Toolbar Handlers
  const handleSetTool = (tool: 'select' | 'cable' | 'rect' | 'circle' | 'diamond' | 'arrow' | 'text') => {
    setActiveTool(tool);
    if (!excalidrawAPI) return;

    if (tool === 'select') {
      excalidrawAPI.setActiveTool({ type: "selection" });
    } else if (tool === 'cable') {
      excalidrawAPI.setActiveTool({ type: "arrow" });
      excalidrawAPI.updateScene({ appState: { currentItemStrokeStyle: cableStyle === 'dotted' ? 'dotted' : cableStyle === 'dashed' ? 'dashed' : 'solid', currentItemStrokeColor: cableColor } });
    } else if (tool === 'rect') {
      excalidrawAPI.setActiveTool({ type: "rectangle" });
    } else if (tool === 'circle') {
      excalidrawAPI.setActiveTool({ type: "ellipse" });
    } else if (tool === 'diamond') {
      excalidrawAPI.setActiveTool({ type: "diamond" });
    } else if (tool === 'arrow') {
      excalidrawAPI.setActiveTool({ type: "arrow" }); // Generic arrow tool, separate from our 'cable' logic styling
      excalidrawAPI.updateScene({ appState: { currentItemStrokeStyle: 'solid' } });
    } else if (tool === 'text') {
      excalidrawAPI.setActiveTool({ type: "text" });
    }
  };

  const handleCableStyleChange = (style: 'solid' | 'dotted' | 'dashed') => {
     setCableStyle(style);
     if (activeTool === 'cable' && excalidrawAPI) {
        excalidrawAPI.updateScene({ appState: { currentItemStrokeStyle: style } });
     }
  };

  const handleCableColorChange = (color: string) => {
     setCableColor(color);
     if (activeTool === 'cable' && excalidrawAPI) {
        excalidrawAPI.updateScene({ appState: { currentItemStrokeColor: color } });
     }
  };

  const updateSelectedNode = async (updates: Partial<{ label: string; locked: boolean; strokeColor: string; iconType: string; customImage: string }>) => {
      if (!excalidrawAPI) return;
      const elements = excalidrawAPI.getSceneElements();
      const appState = excalidrawAPI.getAppState();
      const selectedIds = Object.keys(appState.selectedElementIds);

      if (selectedIds.length === 0) return;

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

      if (updates.label !== undefined && textEl) {
          textEl.text = updates.label; 
          if (visualEl) {
             textEl.x = visualEl.x + (visualEl.width / 2) - (updates.label.length * 4);
          }
      }

      if (updates.locked !== undefined) {
          targetElements.forEach((el: any) => el.locked = updates.locked);
      }

      if (updates.strokeColor !== undefined) {
          targetElements.forEach((el: any) => el.strokeColor = updates.strokeColor);
      }

      if (updates.iconType || updates.customImage) {
          let dataURL = updates.customImage;
          
          if (updates.iconType && !dataURL) {
             const svgString = NETWORK_SVGS[updates.iconType] || NETWORK_SVGS['default'];
             const color = updates.strokeColor || (theme === 'dark' ? '#ffffff' : '#000000');
             const encodedSvg = btoa(unescape(encodeURIComponent(svgString.replace(/currentColor/g, color))));
             dataURL = `data:image/svg+xml;base64,${encodedSvg}`;
          }

          if (dataURL && visualEl && visualEl.type === 'image') {
              const fileId = `file_${Date.now()}`;
              await excalidrawAPI.addFiles([{
                 id: fileId,
                 dataURL: dataURL,
                 mimeType: 'image/svg+xml',
                 created: Date.now()
              }]);
              visualEl.fileId = fileId;
          }
      }

      excalidrawAPI.updateScene({ elements: elements });
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
           <TopologyToolbar 
              isEditMode={isEditMode}
              activeTool={activeTool}
              onToggleMode={(mode) => { setIsEditMode(mode); excalidrawAPI?.updateScene({ appState: { viewModeEnabled: !mode } }); }}
              onSetTool={handleSetTool}
              onImportClick={() => setIsImportOpen(true)}
              onClear={() => excalidrawAPI?.resetScene()}
              onZoomIn={() => {
                 const current = excalidrawAPI?.getAppState().zoom;
                 excalidrawAPI?.updateScene({ appState: { zoom: { value: (current?.value || 1) + 0.1 } } })
              }}
              onZoomOut={() => {
                 const current = excalidrawAPI?.getAppState().zoom;
                 excalidrawAPI?.updateScene({ appState: { zoom: { value: Math.max(0.1, (current?.value || 1) - 0.1) } } })
              }}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={() => { 
                const action = excalidrawAPI?.getAction('undo');
                if(action) excalidrawAPI.actionManager.executeAction(action);
              }}
              onRedo={() => {
                const action = excalidrawAPI?.getAction('redo');
                if(action) excalidrawAPI.actionManager.executeAction(action);
              }}
              cableStyle={cableStyle}
              cableColor={cableColor}
              onCableStyleChange={handleCableStyleChange}
              onCableColorChange={handleCableColorChange}
           />
           <div className="w-px h-8 bg-slate-200 dark:bg-white/10 mx-2" />
           <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-600 dark:text-white">
              <Save className="mr-2 h-4 w-4" /> Save
           </Button>
        </div>
      </div>

      <div className="flex-1 w-full border border-slate-200 dark:border-white/20 rounded-xl overflow-hidden shadow-sm relative flex">
         <div className="flex-1 h-full relative">
            {Excalidraw ? (
                <Excalidraw 
                   theme={theme === 'dark' ? 'dark' : 'light'}
                   excalidrawAPI={(api: any) => setExcalidrawAPI(api)}
                   initialData={initialData}
                   UIOptions={uiOptions}
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