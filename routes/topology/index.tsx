import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, Input, Button, DataTable, ColumnDef, Badge, cn } from '../../components/ui';
import { 
  Server, Trash2, Globe, Box, Shield, Wifi, 
  Cloud, Smartphone, Laptop, Printer, Database, HardDrive, 
  Video, Cpu, Lock, Unlock, Zap, Edit2, Replace, Image as ImageIcon,
  ChevronLeft, Plus
} from 'lucide-react';
import { ImportNodeModal } from './components/ImportNodeModal';
import { TopologyToolbar } from './components/TopologyToolbar';
import { MockService } from '../../mock';

// --- Types ---
type NodeType = 'router' | 'switch' | 'server' | 'firewall' | 'ap' | 'cloud' | 'laptop' | 'phone' | 'printer' | 'database' | 'storage' | 'camera' | 'iot' | 'rect' | 'circle' | 'text' | 'image';

interface Node {
  id: string;
  type: NodeType;
  x: number;
  y: number;
  label?: string;
  locked?: boolean;
  color?: string;
  imageSrc?: string;
}

interface Edge {
  id: string;
  from: string;
  to: string;
  style?: 'solid' | 'dashed' | 'dotted';
  color?: string;
}

// --- Icons Map ---
const Icons: Record<string, any> = {
  router: Globe,
  switch: Box,
  server: Server,
  firewall: Shield,
  ap: Wifi,
  cloud: Cloud,
  laptop: Laptop,
  phone: Smartphone,
  printer: Printer,
  database: Database,
  storage: HardDrive,
  camera: Video,
  iot: Cpu
};

// --- Colors ---
const PRESET_COLORS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#64748b', // Slate (Default)
];

const PRESET_CABLE_COLORS = [
    '#94a3b8', // Slate (Default)
    '#ef4444', // Red
    '#22c55e', // Green
    '#3b82f6', // Blue
    '#eab308', // Yellow
];

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
            <p className="text-slate-500 dark:text-slate-400">Select a topology map to view or edit.</p>
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

// --- Sub-Component: Topology Editor (The Canvas) ---
const TopologyEditor = ({ topology, onBack }: { topology: any, onBack: () => void }) => {
  // Initial Data (Mocked per topology for now, or just generic defaults)
  const initialNodes: Node[] = [
     { id: 'n1', type: 'router', x: 400, y: 300, label: 'Core Router', locked: true, color: '#3b82f6' },
     { id: 'n2', type: 'switch', x: 250, y: 150, label: 'Switch A' },
     { id: 'n3', type: 'server', x: 550, y: 150, label: 'Db Server' }
  ];
  const initialEdges: Edge[] = [
     { id: 'e1', from: 'n1', to: 'n2', style: 'solid', color: '#94a3b8' },
     { id: 'e2', from: 'n1', to: 'n3', style: 'dashed', color: '#94a3b8' },
  ];

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  
  // History State
  const [history, setHistory] = useState<{nodes: Node[], edges: Edge[]}[]>([{ nodes: initialNodes, edges: initialEdges }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTool, setActiveTool] = useState<'select' | 'cable'>('select');
  
  // Cable Tool Options
  const [defaultCableStyle, setDefaultCableStyle] = useState<'solid' | 'dashed' | 'dotted'>('solid');
  const [defaultCableColor, setDefaultCableColor] = useState('#94a3b8');

  // Interaction State
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [cableStartNode, setCableStartNode] = useState<string | null>(null);
  const [tempCableEnd, setTempCableEnd] = useState<{x: number, y: number} | null>(null);

  // Modal / Context State
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [changeTypeNodeId, setChangeTypeNodeId] = useState<string | null>(null); 
  const [editingLabel, setEditingLabel] = useState<{ id: string, text: string } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, targetId: string, type: 'node' | 'edge' } | null>(null);

  // --- History Helper ---
  const addToHistory = useCallback((newNodes: Node[], newEdges: Edge[]) => {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push({ nodes: newNodes, edges: newEdges });
      if (newHistory.length > 20) newHistory.shift(); // Limit history
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setNodes(newNodes);
      setEdges(newEdges);
  }, [history, historyIndex]);

  const undo = () => {
      if (historyIndex > 0) {
          const prev = history[historyIndex - 1];
          setNodes(prev.nodes);
          setEdges(prev.edges);
          setHistoryIndex(historyIndex - 1);
      }
  };

  const redo = () => {
      if (historyIndex < history.length - 1) {
          const next = history[historyIndex + 1];
          setNodes(next.nodes);
          setEdges(next.edges);
          setHistoryIndex(historyIndex + 1);
      }
  };

  // Handlers (Same as previous implementation)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEditMode) return;
      if ((e.key === 'z' || e.key === 'Z') && (e.ctrlKey || e.metaKey)) {
          e.preventDefault();
          if (e.shiftKey) redo();
          else undo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditMode, historyIndex, history]);

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (!isEditMode) return;
    e.stopPropagation(); 
    if (e.button !== 0) return; 
    setContextMenu(null); 
    if (activeTool === 'cable') {
       setCableStartNode(id);
       return;
    }
    const node = nodes.find(n => n.id === id);
    if (!node || node.locked) return; 
    setDraggedNode(id);
    setOffset({ x: e.clientX - node.x, y: e.clientY - node.y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (cableStartNode) {
       const rect = e.currentTarget.getBoundingClientRect();
       setTempCableEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    if (!draggedNode) return;
    setNodes(prev => prev.map(n => {
       if (n.id === draggedNode) {
          return { ...n, x: e.clientX - offset.x, y: e.clientY - offset.y };
       }
       return n;
    }));
  };

  const handleNodeMouseUp = (e: React.MouseEvent, targetId: string) => {
     if (activeTool === 'cable' && cableStartNode && cableStartNode !== targetId) {
        e.stopPropagation();
        const exists = edges.find(e => (e.from === cableStartNode && e.to === targetId) || (e.from === targetId && e.to === cableStartNode));
        if (!exists) {
           const newEdge: Edge = { 
               id: `e-${Date.now()}`, 
               from: cableStartNode, 
               to: targetId,
               style: defaultCableStyle,
               color: defaultCableColor
           };
           addToHistory(nodes, [...edges, newEdge]);
        }
        setCableStartNode(null);
        setTempCableEnd(null);
     }
  };

  const handleCanvasMouseUp = () => {
    if (draggedNode) addToHistory(nodes, edges);
    setDraggedNode(null);
    setCableStartNode(null);
    setTempCableEnd(null);
  };

  const handleContextMenu = (e: React.MouseEvent, targetId: string, type: 'node' | 'edge') => {
     if (!isEditMode) return;
     e.preventDefault();
     e.stopPropagation();
     setContextMenu({ x: e.clientX, y: e.clientY, targetId, type });
  };

  const addNode = (type: string, label = 'New Node', imageSrc?: string) => {
     if (changeTypeNodeId) {
        const newNodes = nodes.map(n => n.id === changeTypeNodeId ? { ...n, type: type as NodeType, label, imageSrc } : n);
        addToHistory(newNodes, edges);
        setChangeTypeNodeId(null);
     } else {
        const id = `n-${Date.now()}`;
        const newNodes = [...nodes, { id, type: type as NodeType, x: 400, y: 300, label, imageSrc }];
        addToHistory(newNodes, edges);
     }
     setIsImportModalOpen(false);
  };

  const deleteTarget = (id: string, type: 'node' | 'edge') => {
     if (type === 'node') {
        const newNodes = nodes.filter(n => n.id !== id);
        const newEdges = edges.filter(e => e.from !== id && e.to !== id);
        addToHistory(newNodes, newEdges);
     } else {
        const newEdges = edges.filter(e => e.id !== id);
        addToHistory(nodes, newEdges);
     }
     setContextMenu(null);
  }

  const toggleLock = (id: string) => {
     const newNodes = nodes.map(n => n.id === id ? { ...n, locked: !n.locked } : n);
     addToHistory(newNodes, edges);
     setContextMenu(null);
  };

  const changeColor = (id: string, color: string, type: 'node' | 'edge') => {
    if (type === 'node') {
        const newNodes = nodes.map(n => n.id === id ? { ...n, color } : n);
        addToHistory(newNodes, edges);
    } else {
        const newEdges = edges.map(e => e.id === id ? { ...e, color } : e);
        addToHistory(nodes, newEdges);
    }
  };

  const changeEdgeStyle = (id: string, style: 'solid' | 'dashed' | 'dotted') => {
      const newEdges = edges.map(e => e.id === id ? { ...e, style } : e);
      addToHistory(nodes, newEdges);
  };

  const startEditing = (id: string, currentLabel: string) => {
     setEditingLabel({ id, text: currentLabel });
     setContextMenu(null);
  };

  const saveLabel = () => {
     if (editingLabel) {
        const newNodes = nodes.map(n => n.id === editingLabel.id ? { ...n, label: editingLabel.text } : n);
        addToHistory(newNodes, edges);
        setEditingLabel(null);
     }
  };

  const getEdgeCoords = (edge: Edge) => {
     const n1 = nodes.find(n => n.id === edge.from);
     const n2 = nodes.find(n => n.id === edge.to);
     if (!n1 || !n2) return null;
     return { x1: n1.x, y1: n1.y, x2: n2.x, y2: n2.y };
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500" onClick={() => setContextMenu(null)}>
      <ImportNodeModal 
        isOpen={isImportModalOpen} 
        onClose={() => { setIsImportModalOpen(false); setChangeTypeNodeId(null); }} 
        onSelect={(type, label, imageSrc) => addNode(type, label, imageSrc)}
      />

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8 -ml-2">
               <ChevronLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{topology.name}</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 ml-8">Status: {topology.status} • {nodes.length} Devices</p>
        </div>
        
        <TopologyToolbar 
           isEditMode={isEditMode} 
           activeTool={activeTool}
           onToggleMode={setIsEditMode}
           onSetTool={setActiveTool}
           onAddShape={(type, label) => addNode(type, label)}
           onImportClick={() => setIsImportModalOpen(true)}
           canUndo={historyIndex > 0}
           canRedo={historyIndex < history.length - 1}
           onUndo={undo}
           onRedo={redo}
           cableStyle={defaultCableStyle}
           cableColor={defaultCableColor}
           onCableStyleChange={setDefaultCableStyle}
           onCableColorChange={setDefaultCableColor}
        />
      </div>

      <Card 
        className="h-[650px] relative overflow-hidden bg-slate-50 dark:bg-black flex border-slate-200 dark:border-white/20 select-none"
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseUp}
      >
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] grid-rows-[repeat(40,minmax(0,1fr))] opacity-[0.03] pointer-events-none dark:opacity-[0.08]">
           {Array.from({ length: 1600 }).map((_, i) => <div key={i} className="border-[0.5px] border-slate-500" />)}
        </div>

        {/* --- Layer 1: Connections --- */}
        <svg className="absolute inset-0 w-full h-full z-0">
           {edges.map(edge => {
              const coords = getEdgeCoords(edge);
              if (!coords) return null;
              const strokeDasharray = edge.style === 'dotted' ? '3,4' : edge.style === 'dashed' ? '8,6' : undefined;
              return (
                 <g key={edge.id} onContextMenu={(e) => handleContextMenu(e, edge.id, 'edge')}>
                    <line x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} stroke="transparent" strokeWidth="15" className={isEditMode ? "cursor-pointer" : ""} />
                    <line x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2} stroke={edge.color || "#94a3b8"} strokeWidth="2" strokeDasharray={strokeDasharray} strokeLinecap="round" />
                 </g>
              );
           })}
           {activeTool === 'cable' && cableStartNode && tempCableEnd && (
              (() => {
                 const start = nodes.find(n => n.id === cableStartNode);
                 if (start) {
                    return <line x1={start.x} y1={start.y} x2={tempCableEnd.x} y2={tempCableEnd.y} stroke={defaultCableColor} strokeWidth="2" opacity={0.6} />;
                 }
                 return null;
              })()
           )}
        </svg>

        {/* --- Layer 2: Nodes --- */}
        <div className="relative w-full h-full z-10 pointer-events-none">
           {nodes.map(node => {
             const Icon = Icons[node.type] || Server;
             const isDragging = draggedNode === node.id;
             const color = node.color; 
             return (
               <div 
                  key={node.id} 
                  className={`absolute flex flex-col items-center group pointer-events-auto`}
                  style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
                  onMouseDown={(e) => handleMouseDown(e, node.id)}
                  onMouseUp={(e) => handleNodeMouseUp(e, node.id)}
                  onContextMenu={(e) => handleContextMenu(e, node.id, 'node')}
                  onDoubleClick={() => isEditMode && startEditing(node.id, node.label || '')}
               >
                  {/* Lock Indicator */}
                  {node.locked && isEditMode && <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-amber-100 text-amber-600 rounded-full p-0.5 border border-amber-200"><Lock className="h-3 w-3" /></div>}

                  {/* Node Shape */}
                  <div 
                    className={cn(
                        "relative flex items-center justify-center shadow-md transition-all duration-200",
                        node.type === 'rect' ? 'w-24 h-16 rounded' : 
                        node.type === 'circle' ? 'w-20 h-20 rounded-full' : 
                        node.type === 'image' ? 'w-20 h-20 rounded-lg overflow-hidden' :
                        !['rect', 'circle', 'text', 'image'].includes(node.type) ? 'w-14 h-14 rounded-xl' : '',
                        node.type === 'image' ? 'bg-transparent border-0' :
                        node.type === 'text' ? 'bg-transparent border-0 shadow-none' : 'bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10',
                        isDragging ? 'scale-110 shadow-xl ring-2 ring-indigo-500 z-50' : '',
                        isEditMode && !node.locked && activeTool === 'select' ? 'cursor-move hover:border-indigo-400 dark:hover:border-indigo-500' : ''
                    )}
                    style={{
                        ...(color && ['rect', 'circle'].includes(node.type) ? { backgroundColor: color, borderColor: color } : {}),
                        ...(color && !['rect', 'circle', 'text', 'image'].includes(node.type) ? { borderColor: color, boxShadow: `0 0 0 1px ${color}` } : {}),
                    }}
                  >
                     {!['rect', 'circle', 'text', 'image'].includes(node.type) && <Icon className={cn("h-7 w-7", !color && "text-slate-600 dark:text-slate-300")} style={{ color: color || undefined }} />}
                     {node.type === 'text' && <span className={cn("text-lg font-bold whitespace-nowrap", !color && "text-slate-900 dark:text-white")} style={{ color: color || undefined }}>{node.label}</span>}
                     {node.type === 'image' && node.imageSrc && <img src={node.imageSrc} alt={node.label} className="w-full h-full object-cover pointer-events-none" />}
                     {node.type === 'image' && !node.imageSrc && <ImageIcon className="h-8 w-8 text-slate-400" />}
                  </div>

                  {/* Label */}
                  {node.type !== 'text' && (
                     <div className="mt-2 min-w-[60px] text-center relative">
                        {editingLabel?.id === node.id ? (
                           <Input className="h-6 text-xs px-1 text-center bg-white dark:bg-black shadow-lg border-indigo-500" value={editingLabel.text} onChange={e => setEditingLabel({ ...editingLabel, text: e.target.value })} onBlur={saveLabel} onKeyDown={e => e.key === 'Enter' && saveLabel()} autoFocus onClick={e => e.stopPropagation()} />
                        ) : (
                           <span className="text-xs font-semibold bg-white/80 dark:bg-black/60 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10 backdrop-blur-sm text-slate-700 dark:text-slate-300 select-none">{node.label}</span>
                        )}
                     </div>
                  )}
               </div>
             );
           })}
        </div>

        {/* --- Context Menu --- */}
        {contextMenu && (
           <div className="fixed z-50 w-52 bg-white dark:bg-[#111] border border-slate-200 dark:border-white/10 rounded-lg shadow-xl py-2 text-sm animate-in fade-in zoom-in-95 duration-100" style={{ left: contextMenu.x, top: contextMenu.y }}>
              {contextMenu.type === 'node' ? (
                  <>
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-1">
                        <p className="text-xs font-medium text-slate-500 mb-2">Node Color</p>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_COLORS.map(c => (
                            <button key={c} className="w-5 h-5 rounded-full border border-slate-200 dark:border-white/20 hover:scale-110 transition-transform" style={{ backgroundColor: c }} onClick={() => changeColor(contextMenu.targetId, c, 'node')} />
                            ))}
                        </div>
                    </div>
                    <button className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2 text-slate-700 dark:text-slate-300" onClick={() => startEditing(contextMenu.targetId, nodes.find(n => n.id === contextMenu.targetId)?.label || '')}><Edit2 className="h-3.5 w-3.5" /> Edit Label</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2 text-slate-700 dark:text-slate-300" onClick={() => { setChangeTypeNodeId(contextMenu.targetId); setIsImportModalOpen(true); setContextMenu(null); }}><Replace className="h-3.5 w-3.5" /> Change Type/Image</button>
                    <button className="w-full text-left px-3 py-2 hover:bg-slate-100 dark:hover:bg-white/5 flex items-center gap-2 text-slate-700 dark:text-slate-300" onClick={() => toggleLock(contextMenu.targetId)}>{nodes.find(n => n.id === contextMenu.targetId)?.locked ? <><Unlock className="h-3.5 w-3.5" /> Unlock Node</> : <><Lock className="h-3.5 w-3.5" /> Lock Node</>}</button>
                  </>
              ) : (
                  <>
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-1">
                        <p className="text-xs font-medium text-slate-500 mb-2">Cable Style</p>
                        <div className="flex gap-1">{['solid', 'dashed', 'dotted'].map((style) => <button key={style} onClick={() => changeEdgeStyle(contextMenu.targetId, style as any)} className="px-2 py-1 text-xs border border-slate-200 dark:border-white/20 rounded hover:bg-slate-100 dark:hover:bg-white/10">{style}</button>)}</div>
                    </div>
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-white/5 mb-1">
                        <p className="text-xs font-medium text-slate-500 mb-2">Cable Color</p>
                        <div className="flex flex-wrap gap-2">{PRESET_CABLE_COLORS.map(c => <button key={c} className="w-5 h-5 rounded-full border border-slate-200 dark:border-white/20 hover:scale-110 transition-transform" style={{ backgroundColor: c }} onClick={() => changeColor(contextMenu.targetId, c, 'edge')} />)}</div>
                    </div>
                  </>
              )}
              <div className="h-px bg-slate-100 dark:bg-white/10 my-1" />
              <button className="w-full text-left px-3 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-2" onClick={() => deleteTarget(contextMenu.targetId, contextMenu.type)}><Trash2 className="h-3.5 w-3.5" /> Delete</button>
           </div>
        )}
      </Card>
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