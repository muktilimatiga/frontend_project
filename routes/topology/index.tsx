import * as React from 'react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Connection,
  Edge,
  Node,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  ConnectionMode,
  MarkerType
} from '@xyflow/react';
import { Card, Button, DataTable, ColumnDef, Badge } from '../../components/ui';
import { Plus, ChevronLeft } from 'lucide-react';
import { useAppStore } from '../../store';
import { toast } from 'sonner';
import { ImportNodeModal } from './components/ImportNodeModal';
import { TopologyPropertiesPanel } from './components/TopologyPropertiesPanel';
import { TopologyToolbar } from './components/TopologyToolbar';
import { ContextMenu } from './components/ContextMenu';
import CustomNode from './components/CustomNode';
import { useTopologies } from '../../hooks/useQueries';

// --- Sub-Component: Topology List View ---
const TopologyList = ({ onSelect }: { onSelect: (topology: any) => void }) => {
  const { data: topologies = [], isLoading } = useTopologies();

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
            <p className="text-slate-500 dark:text-slate-400">Select a topology map to view or edit using React Flow.</p>
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

// --- Sub-Component: React Flow Editor ---
const EditorContent = ({ topology, onBack }: { topology: any, onBack: () => void }) => {
  const { theme } = useAppStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  
  // Selection State
  const [selectedElement, setSelectedElement] = useState<{ type: 'node' | 'edge', id: string, data?: any } | null>(null);
  
  // Context Menu State
  const [menu, setMenu] = useState<{ top: number, left: number, type: 'node' | 'edge' | 'pane', id?: string } | null>(null);

  const reactFlowInstance = useReactFlow();

  // Load initial dummy data if new
  useEffect(() => {
    if (nodes.length === 0 && topology.id !== 'new') {
       const initialNodes = [
         { id: '1', type: 'custom', position: { x: 250, y: 5 }, data: { label: 'Internet', iconType: 'cloud', strokeColor: '#3b82f6', wrapText: false }, zIndex: 1 },
         { id: '2', type: 'custom', position: { x: 250, y: 150 }, data: { label: 'Core Router', iconType: 'router', strokeColor: '#ef4444', wrapText: false }, zIndex: 2 },
         { id: '3', type: 'custom', position: { x: 100, y: 300 }, data: { label: 'Switch A', iconType: 'switch', strokeColor: '#10b981', wrapText: false }, zIndex: 3 },
         { id: '4', type: 'custom', position: { x: 400, y: 300 }, data: { label: 'Switch B', iconType: 'switch', strokeColor: '#10b981', wrapText: false }, zIndex: 3 },
       ];
       const initialEdges = [
         { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#94a3b8', strokeWidth: 2 } },
         { id: 'e2-3', source: '2', target: '3', style: { stroke: '#94a3b8', strokeWidth: 2 } },
         { id: 'e2-4', source: '2', target: '4', style: { stroke: '#94a3b8', strokeWidth: 2 } },
       ];
       setNodes(initialNodes);
       setEdges(initialEdges);
       setTimeout(() => reactFlowInstance.fitView(), 100);
    }
  }, [topology.id, reactFlowInstance, nodes.length, setNodes, setEdges]);

  // Handle Connections
  const onConnect = useCallback((params: Connection) => {
    const newEdge = { 
        ...params, 
        type: 'default', // Bezier by default, can be changed via properties
        style: { stroke: '#94a3b8', strokeWidth: 2 },
        animated: false
    };
    setEdges((eds) => addEdge(newEdge, eds));
  }, [setEdges]);

  // --- Click Handlers ---

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    // Include zIndex in the selected data
    setSelectedElement({ type: 'node', id: node.id, data: { ...node.data, zIndex: node.zIndex } });
    setMenu(null);
  }, []);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
     setSelectedElement({ type: 'edge', id: edge.id, data: { ...edge, ...edge.data } }); // Pass full edge obj as data to access style
     setMenu(null);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedElement(null);
    setMenu(null);
  }, []);

  // --- Context Menu Handlers ---

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      // Only show menu in Edit Mode
      if (mode === 'view') return;

      setMenu({
        id: node.id,
        top: event.clientY,
        left: event.clientX,
        type: 'node',
      });
      // Also select it
      setSelectedElement({ type: 'node', id: node.id, data: { ...node.data, zIndex: node.zIndex } });
    },
    [mode],
  );

  const onEdgeContextMenu = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      event.preventDefault();
      // Only show menu in Edit Mode
      if (mode === 'view') return;

      setMenu({
        id: edge.id,
        top: event.clientY,
        left: event.clientX,
        type: 'edge',
      });
      setSelectedElement({ type: 'edge', id: edge.id, data: { ...edge, ...edge.data } });
    },
    [mode],
  );

  const onPaneContextMenu = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      // Allow pane context menu (e.g., Fit View) in View Mode, but maybe filter actions inside ContextMenu if needed.
      // For now, let's just allow Fit View everywhere.
      setMenu({
        top: event.clientY,
        left: event.clientX,
        type: 'pane',
      });
    },
    [],
  );

  // --- Property Updates ---

  const handleUpdate = (updates: any) => {
    if (!selectedElement || mode === 'view') return;

    if (selectedElement.type === 'node') {
        setNodes((nds) => nds.map((node) => {
            if (node.id === selectedElement.id) {
                // Separate zIndex if it's in updates, as it's a top-level property
                const { zIndex, ...dataUpdates } = updates;
                const updatedNode = {
                    ...node,
                    zIndex: zIndex !== undefined ? zIndex : node.zIndex,
                    draggable: updates.locked !== undefined ? !updates.locked : node.draggable,
                    data: { ...node.data, ...dataUpdates }
                };
                // Keep local selection state in sync
                setSelectedElement({ type: 'node', id: node.id, data: { ...updatedNode.data, zIndex: updatedNode.zIndex } });
                return updatedNode;
            }
            return node;
        }));
    } else if (selectedElement.type === 'edge') {
        setEdges((eds) => eds.map((edge) => {
            if (edge.id === selectedElement.id) {
                // Merge style updates
                const newStyle = updates.style ? { ...edge.style, ...updates.style } : edge.style;
                const updatedEdge = {
                    ...edge,
                    animated: updates.animated !== undefined ? updates.animated : edge.animated,
                    style: newStyle,
                    data: { ...edge.data, ...updates }
                };
                setSelectedElement({ type: 'edge', id: edge.id, data: { ...updatedEdge, ...updatedEdge.data } });
                return updatedEdge;
            }
            return edge;
        }));
    }
  };

  const handleContextAction = (action: string, id?: string) => {
      if (!id) {
          if (action === 'fit_view') reactFlowInstance.fitView();
          return;
      }
      
      // Prevent modifications in View Mode
      if (mode === 'view') return;

      switch(action) {
          case 'delete':
             if (menu?.type === 'node') {
                 setNodes(nds => nds.filter(n => n.id !== id));
                 setEdges(eds => eds.filter(e => e.source !== id && e.target !== id));
             } else {
                 setEdges(eds => eds.filter(e => e.id !== id));
             }
             setSelectedElement(null);
             break;
          case 'duplicate':
             setNodes((nds) => {
                 const nodeToDup = nds.find((n) => n.id === id);
                 if (nodeToDup) {
                     const newId = `${nodeToDup.id}_copy_${Date.now()}`;
                     const newNode = {
                         ...nodeToDup,
                         id: newId,
                         position: { x: nodeToDup.position.x + 20, y: nodeToDup.position.y + 20 },
                         selected: true,
                         zIndex: (nodeToDup.zIndex || 0) + 1
                     };
                     return [...nds.map(n => ({...n, selected: false})), newNode];
                 }
                 return nds;
             });
             break;
          case 'toggle_lock':
             setNodes(nds => nds.map(n => n.id === id ? { ...n, draggable: !n.draggable, data: { ...n.data, locked: !n.data.locked } } : n));
             break;
          case 'toggle_wrap':
             setNodes(nds => nds.map(n => n.id === id ? { ...n, data: { ...n.data, wrapText: !n.data.wrapText } } : n));
             break;
          case 'layer_up':
             setNodes((prevNodes) => {
                const currentZValues = prevNodes.map(n => n.zIndex || 0);
                const maxZ = Math.max(0, ...currentZValues);
                
                return prevNodes.map((n) => {
                   if (n.id === id) {
                      return { ...n, zIndex: maxZ + 1 };
                   }
                   return n;
                });
             });
             break;
          case 'layer_down':
             setNodes((prevNodes) => {
                const currentZValues = prevNodes.map(n => n.zIndex || 0);
                const minZ = Math.min(0, ...currentZValues);

                return prevNodes.map((n) => {
                   if (n.id === id) {
                      return { ...n, zIndex: minZ - 1 };
                   }
                   return n;
                });
             });
             break;
          case 'edit':
             const elem = nodes.find(n => n.id === id) || edges.find(e => e.id === id);
             if (elem) {
                 const type = nodes.find(n => n.id === id) ? 'node' : 'edge';
                 const elemData = type === 'node' ? { ...elem.data, zIndex: (elem as Node).zIndex } : { ...elem, ...elem.data };
                 setSelectedElement({ type: type as any, id, data: elemData });
             }
             break;
      }
  };

  const handleDeleteSelected = () => {
     if(selectedElement && mode === 'edit') {
        handleContextAction('delete', selectedElement.id);
     }
  };

  const handleAddNode = (type: string, label: string) => {
    const id = `node_${Date.now()}`;
    const newNode = {
      id,
      type: 'custom',
      position: { x: Math.random() * 400 + 100, y: Math.random() * 300 + 100 },
      data: { label, iconType: type, strokeColor: theme === 'dark' ? '#ffffff' : '#000000' },
      zIndex: 10
    };
    setNodes((nds) => nds.concat(newNode));
    setIsImportOpen(false);
    toast.success('Node Added');
  };

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] gap-4 animate-in fade-in duration-500">
      <ImportNodeModal 
        isOpen={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        onSelect={handleAddNode}
      />

      {menu && (
        <ContextMenu 
           {...menu} 
           onClose={() => setMenu(null)} 
           onAction={handleContextAction} 
           data={selectedElement?.id === menu.id ? selectedElement.data : null}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 -ml-2">
               <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
               <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{topology.name}</h1>
               <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-500 dark:text-slate-400">React Flow Engine • {nodes.length} Nodes</p>
                  <Badge variant={mode === 'edit' ? 'warning' : 'secondary'} className="h-4 text-[10px] px-1.5 uppercase tracking-wide">
                     {mode} Mode
                  </Badge>
               </div>
            </div>
        </div>
        
        <TopologyToolbar 
           mode={mode}
           onModeChange={setMode}
           onImportClick={() => setIsImportOpen(true)}
           onFitView={() => reactFlowInstance.fitView()}
           onZoomIn={() => reactFlowInstance.zoomIn()}
           onZoomOut={() => reactFlowInstance.zoomOut()}
           onSave={() => toast.success('Topology saved successfully.')}
           onDelete={handleDeleteSelected}
           hasSelection={!!selectedElement}
        />
      </div>

      {/* Canvas */}
      <div className="flex-1 w-full border border-slate-200 dark:border-white/20 rounded-xl overflow-hidden shadow-sm relative">
         <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onEdgeClick={onEdgeClick}
            onPaneClick={onPaneClick}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeContextMenu={onEdgeContextMenu}
            onPaneContextMenu={onPaneContextMenu}
            nodeTypes={nodeTypes}
            connectionMode={ConnectionMode.Loose}
            
            // Mode-specific properties
            nodesDraggable={mode === 'edit'}
            nodesConnectable={mode === 'edit'}
            elementsSelectable={true} // Allow selection in View mode for inspection
            panOnDrag={true}
            zoomOnScroll={true}
            
            fitView
            className={theme === 'dark' ? 'dark' : ''}
         >
            <Background color={theme === 'dark' ? '#333' : '#ddd'} gap={20} />
            <Controls className="bg-white dark:bg-black border-slate-200 dark:border-white/20 fill-slate-900 dark:fill-white" />
            <MiniMap 
               className="bg-white dark:bg-black border-slate-200 dark:border-white/20" 
               maskColor={theme === 'dark' ? 'rgba(0,0,0, 0.7)' : 'rgba(255,255,255, 0.7)'}
            />
            {selectedElement && (
               <Panel position="top-right" className="m-0 h-full pointer-events-none">
                  <TopologyPropertiesPanel 
                     type={selectedElement.type}
                     data={selectedElement.data}
                     onUpdate={handleUpdate}
                     onClose={() => setSelectedElement(null)}
                     onDelete={handleDeleteSelected}
                     readOnly={mode === 'view'}
                  />
               </Panel>
            )}
         </ReactFlow>
      </div>
    </div>
  );
};

// --- Wrapper Provider ---
export const TopologyEditor = (props: { topology: any, onBack: () => void }) => {
   return (
      <ReactFlowProvider>
         <EditorContent {...props} />
      </ReactFlowProvider>
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