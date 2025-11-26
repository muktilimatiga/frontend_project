import * as React from 'react';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  Panel
} from '@xyflow/react';
import { Card, Button, DataTable, ColumnDef, Badge } from '../../components/ui';
import { Plus, ChevronLeft } from 'lucide-react';
import { MockService } from '../../mock';
import { useAppStore } from '../../store';
import { toast } from 'sonner';
import { ImportNodeModal } from './components/ImportNodeModal';
import { TopologyPropertiesPanel } from './components/TopologyPropertiesPanel';
import { TopologyToolbar } from './components/TopologyToolbar';
import CustomNode from './components/CustomNode';

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
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const reactFlowInstance = useReactFlow();

  // Load initial dummy data if new
  useEffect(() => {
    if (nodes.length === 0 && topology.id !== 'new') {
       // Simulate loading existing data
       const initialNodes = [
         { id: '1', type: 'custom', position: { x: 250, y: 5 }, data: { label: 'Internet', iconType: 'cloud', strokeColor: '#3b82f6' } },
         { id: '2', type: 'custom', position: { x: 250, y: 150 }, data: { label: 'Core Router', iconType: 'router', strokeColor: '#ef4444' } },
         { id: '3', type: 'custom', position: { x: 100, y: 300 }, data: { label: 'Switch A', iconType: 'switch', strokeColor: '#10b981' } },
         { id: '4', type: 'custom', position: { x: 400, y: 300 }, data: { label: 'Switch B', iconType: 'switch', strokeColor: '#10b981' } },
       ];
       const initialEdges = [
         { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#94a3b8' } },
         { id: 'e2-3', source: '2', target: '3', style: { stroke: '#94a3b8' } },
         { id: 'e2-4', source: '2', target: '4', style: { stroke: '#94a3b8' } },
       ];
       setNodes(initialNodes);
       setEdges(initialEdges);
       setTimeout(() => reactFlowInstance.fitView(), 100);
    }
  }, [topology.id, reactFlowInstance, nodes.length, setNodes, setEdges]);

  // Handle Connections
  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  // Handle Node Selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // Update Node Data
  const handleNodeUpdate = (updates: Partial<any>) => {
    if (!selectedNode) return;
    setNodes((nds) => nds.map((node) => {
      if (node.id === selectedNode.id) {
        // If locking logic needed, handle here (e.g., node.draggable = !updates.locked)
        const updatedNode = {
           ...node,
           draggable: updates.locked !== undefined ? !updates.locked : node.draggable,
           data: { ...node.data, ...updates }
        };
        // Update local selection state immediately for UI responsiveness
        if (updates.label !== undefined) setSelectedNode(updatedNode); 
        return updatedNode;
      }
      return node;
    }));
    // Keep selection valid
    if (selectedNode) {
       setSelectedNode(prev => prev ? ({...prev, data: {...prev.data, ...updates}} as Node) : null);
    }
  };

  const handleAddNode = (type: string, label: string) => {
    const id = `node_${Date.now()}`;
    const newNode = {
      id,
      type: 'custom',
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: { label, iconType: type, strokeColor: theme === 'dark' ? '#ffffff' : '#000000' },
    };
    setNodes((nds) => nds.concat(newNode));
    setIsImportOpen(false);
    toast.success('Node Added');
  };

  const handleDeleteSelected = () => {
     if(selectedNode) {
        setNodes((nds) => nds.filter((n) => n.id !== selectedNode.id));
        setEdges((eds) => eds.filter((e) => e.source !== selectedNode.id && e.target !== selectedNode.id));
        setSelectedNode(null);
     }
  };

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] gap-4 animate-in fade-in duration-500">
      <ImportNodeModal 
        isOpen={isImportOpen} 
        onClose={() => setIsImportOpen(false)} 
        onSelect={handleAddNode}
      />

      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 -ml-2">
               <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
               <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{topology.name}</h1>
               <p className="text-xs text-slate-500 dark:text-slate-400">React Flow Engine • {nodes.length} Nodes</p>
            </div>
        </div>
        
        <TopologyToolbar 
           onImportClick={() => setIsImportOpen(true)}
           onFitView={() => reactFlowInstance.fitView()}
           onZoomIn={() => reactFlowInstance.zoomIn()}
           onZoomOut={() => reactFlowInstance.zoomOut()}
           onSave={() => toast.success('Topology saved successfully.')}
           onDelete={handleDeleteSelected}
           hasSelection={!!selectedNode}
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
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className={theme === 'dark' ? 'dark' : ''}
         >
            <Background color={theme === 'dark' ? '#333' : '#ddd'} gap={20} />
            <Controls className="bg-white dark:bg-black border-slate-200 dark:border-white/20 fill-slate-900 dark:fill-white" />
            <MiniMap 
               className="bg-white dark:bg-black border-slate-200 dark:border-white/20" 
               maskColor={theme === 'dark' ? 'rgba(0,0,0, 0.7)' : 'rgba(255,255,255, 0.7)'}
            />
            {selectedNode && (
               <Panel position="top-right" className="m-0">
                  <TopologyPropertiesPanel 
                     data={{
                        label: selectedNode.data.label as string,
                        iconType: selectedNode.data.iconType as string,
                        strokeColor: selectedNode.data.strokeColor as string,
                        locked: !selectedNode.draggable
                     }}
                     onUpdate={handleNodeUpdate}
                     onClose={() => setSelectedNode(null)}
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