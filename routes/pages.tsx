import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge, DataTable, ColumnDef, ModalOverlay, Label, Select, Switch } from '../components/ui';
import { Search, Server, Database, Activity, Share2, MapPin, Globe, LifeBuoy, Book, MessageCircle, FileText, Move, MousePointer2, Plus, GripVertical, Trash2 } from 'lucide-react';
import { MockService } from '../mock';
import { Ticket, User } from '../types';

// --- Helper Components ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = { open: 'secondary', in_progress: 'warning', resolved: 'success', closed: 'outline' };
  return <Badge variant={styles[status]}>{status.replace('_', ' ')}</Badge>;
};

const PriorityDot = ({ priority }: { priority: string }) => {
  const colors: any = { low: 'bg-slate-400', medium: 'bg-blue-500', high: 'bg-orange-500', critical: 'bg-red-500' };
  return <div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${colors[priority]}`} /><span className="capitalize">{priority}</span></div>;
};

// --- Tickets Page ---
export const TicketsPage = () => {
  const { data: tickets = [], isLoading } = useQuery({ queryKey: ['allTickets'], queryFn: MockService.getTickets });

  const columns: ColumnDef<Ticket>[] = [
    { header: 'ID', accessorKey: 'id', className: 'font-mono text-xs' },
    { header: 'Subject', accessorKey: 'title', className: 'font-medium max-w-[300px] truncate' },
    { header: 'Status', accessorKey: 'status', cell: (t) => <StatusBadge status={t.status} /> },
    { header: 'Priority', accessorKey: 'priority', cell: (t) => <PriorityDot priority={t.priority} /> },
    { header: 'Created', accessorKey: 'createdAt', cell: (t) => new Date(t.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tickets</h1>
           <p className="text-slate-500 dark:text-slate-400">Manage support requests and issues.</p>
        </div>
        <Button>New Ticket</Button>
      </div>
      <Card>
         <CardContent className="pt-6">
            {isLoading ? <div className="p-8 text-center text-slate-500">Loading tickets...</div> : (
              <DataTable 
                 data={tickets} 
                 columns={columns} 
                 searchKey="title" 
                 onEdit={(t) => console.log('Edit', t)}
                 onDelete={(t) => console.log('Delete', t)}
              />
            )}
         </CardContent>
      </Card>
    </div>
  );
};

// --- Customers Page ---
export const CustomersPage = () => {
  const { data: customers = [], isLoading } = useQuery({ queryKey: ['customers'], queryFn: MockService.getCustomers });

  const columns: ColumnDef<User>[] = [
    { header: 'User', accessorKey: 'name', cell: (u) => (
       <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold">{u.name.charAt(0)}</div>
          <div>
             <div className="font-medium">{u.name}</div>
             <div className="text-xs text-slate-500">{u.email}</div>
          </div>
       </div>
    )},
    { header: 'Role', accessorKey: 'role', cell: (u) => <Badge variant="outline">{u.role}</Badge> },
    { header: 'ID', accessorKey: 'id', className: 'text-xs text-slate-400 font-mono' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Customers</h1>
           <p className="text-slate-500 dark:text-slate-400">View and manage user accounts.</p>
        </div>
        <Button>Add Customer</Button>
      </div>
      <Card>
         <CardContent className="pt-6">
            {isLoading ? <div className="p-8 text-center text-slate-500">Loading customers...</div> : (
              <DataTable 
                 data={customers} 
                 columns={columns} 
                 searchKey="name" 
                 onEdit={(u) => console.log('Edit', u)}
                 onDelete={(u) => console.log('Delete', u)}
              />
            )}
         </CardContent>
      </Card>
    </div>
  );
};

// --- Topology Page (Interactive) ---

type Node = {
  id: string;
  type: 'router' | 'switch' | 'server' | 'rect' | 'circle' | 'text';
  x: number;
  y: number;
  label?: string;
  w?: number;
  h?: number;
};

export const TopologyPage = () => {
  const [nodes, setNodes] = useState<Node[]>([
     { id: 'n1', type: 'router', x: 400, y: 300, label: 'Core Router' },
     { id: 'n2', type: 'switch', x: 250, y: 150, label: 'Switch A' },
     { id: 'n3', type: 'server', x: 550, y: 150, label: 'Db Server' }
  ]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  
  // Drag Logic
  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    if (!isEditMode) return;
    const node = nodes.find(n => n.id === id);
    if (!node) return;
    setDraggedNode(id);
    setOffset({ x: e.clientX - node.x, y: e.clientY - node.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNode) return;
    setNodes(prev => prev.map(n => {
       if (n.id === draggedNode) {
          return { ...n, x: e.clientX - offset.x, y: e.clientY - offset.y };
       }
       return n;
    }));
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const addNode = (type: Node['type'], label = 'New Node') => {
     const id = `n-${Date.now()}`;
     setNodes([...nodes, { id, type, x: 400, y: 300, label }]);
  };

  const deleteNode = (id: string) => {
     setNodes(nodes.filter(n => n.id !== id));
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500" onMouseUp={handleMouseUp} onMouseMove={handleMouseMove}>
      <ModalOverlay isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)}>
         <div className="space-y-4">
            <h2 className="text-lg font-semibold dark:text-white">Import Network Node</h2>
            <div className="grid grid-cols-3 gap-4">
               {['Router', 'Switch', 'Server', 'Firewall', 'Access Point', 'Cloud'].map(type => (
                  <div 
                     key={type} 
                     className="flex flex-col items-center justify-center p-4 border border-slate-200 dark:border-slate-800 rounded hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer transition-colors"
                     onClick={() => {
                        addNode(type.toLowerCase().split(' ')[0] as any, type);
                        setIsImportModalOpen(false);
                     }}
                  >
                     <Server className="h-6 w-6 mb-2 text-slate-600 dark:text-slate-400" />
                     <span className="text-xs font-medium dark:text-slate-300">{type}</span>
                  </div>
               ))}
            </div>
            <Button variant="outline" className="w-full" onClick={() => setIsImportModalOpen(false)}>Cancel</Button>
         </div>
      </ModalOverlay>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Network Topology</h1>
          <p className="text-slate-500 dark:text-slate-400">Visualizing infrastructure nodes and connections.</p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-md border border-slate-200 dark:border-slate-800 mr-4">
              <span className="text-xs font-medium px-2 text-slate-500">Mode:</span>
              <Button 
                 size="sm" 
                 variant={!isEditMode ? 'default' : 'ghost'} 
                 onClick={() => setIsEditMode(false)}
                 className="h-7 text-xs"
              >
                 <MousePointer2 className="h-3 w-3 mr-1" /> View
              </Button>
              <Button 
                 size="sm" 
                 variant={isEditMode ? 'default' : 'ghost'} 
                 onClick={() => setIsEditMode(true)}
                 className="h-7 text-xs"
              >
                 <Move className="h-3 w-3 mr-1" /> Edit
              </Button>
           </div>
           {isEditMode && (
             <div className="flex items-center gap-1">
                 <Button size="icon" variant="outline" title="Add Rectangle" onClick={() => addNode('rect')}><div className="h-4 w-4 border border-current" /></Button>
                 <Button size="icon" variant="outline" title="Add Circle" onClick={() => addNode('circle')}><div className="h-4 w-4 rounded-full border border-current" /></Button>
                 <Button size="icon" variant="outline" title="Add Text" onClick={() => addNode('text', 'Label')}><FileText className="h-4 w-4" /></Button>
             </div>
           )}
           <Button onClick={() => setIsImportModalOpen(true)} disabled={!isEditMode}>
              <Plus className="mr-2 h-4 w-4" /> Import Node
           </Button>
        </div>
      </div>

      <Card className="h-[600px] relative overflow-hidden bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center border-slate-200 dark:border-slate-800 select-none">
        {/* Grid Background */}
        <div className="absolute inset-0 grid grid-cols-[repeat(40,minmax(0,1fr))] grid-rows-[repeat(40,minmax(0,1fr))] opacity-[0.05] pointer-events-none">
           {Array.from({ length: 1600 }).map((_, i) => <div key={i} className="border-[0.5px] border-slate-500" />)}
        </div>
        
        {/* Render Nodes */}
        <div className="relative w-full h-full">
           {nodes.map(node => (
             <div 
                key={node.id} 
                className={`absolute flex flex-col items-center group ${isEditMode ? 'cursor-move' : 'cursor-default'}`}
                style={{ left: node.x, top: node.y, transform: 'translate(-50%, -50%)' }}
                onMouseDown={(e) => handleMouseDown(e, node.id)}
             >
                {/* Node Shape */}
                <div className={`
                   relative flex items-center justify-center shadow-md transition-all
                   ${node.type === 'rect' ? 'w-24 h-16 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded' : ''}
                   ${node.type === 'circle' ? 'w-20 h-20 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-700 rounded-full' : ''}
                   ${['router', 'switch', 'server', 'firewall'].includes(node.type) ? 'w-14 h-14 bg-indigo-600 rounded-full text-white' : ''}
                   ${node.type === 'text' ? 'bg-transparent border-0 shadow-none' : ''}
                   ${draggedNode === node.id ? 'scale-110 shadow-xl ring-2 ring-indigo-500' : ''}
                `}>
                   {node.type === 'router' && <Share2 className="h-6 w-6" />}
                   {node.type === 'switch' && <Activity className="h-6 w-6" />}
                   {node.type === 'server' && <Server className="h-6 w-6" />}
                   {node.type === 'text' && <span className="text-lg font-bold text-slate-900 dark:text-white">{node.label}</span>}
                </div>

                {/* Label */}
                {node.type !== 'text' && (
                   <span className="mt-2 text-xs font-semibold bg-white/80 dark:bg-slate-950/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800 backdrop-blur-sm text-slate-700 dark:text-slate-300">
                      {node.label}
                   </span>
                )}
                
                {/* Delete Button (Edit Mode Only) */}
                {isEditMode && (
                   <div 
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-red-600"
                      onClick={(e) => { e.stopPropagation(); deleteNode(node.id); }}
                   >
                      <Trash2 className="h-3 w-3" />
                   </div>
                )}
             </div>
           ))}
        </div>
      </Card>
    </div>
  );
};

// --- Maps Page ---
export const MapsPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Geographic Distribution</h1>
           <p className="text-slate-500 dark:text-slate-400">Live server locations and latency zones.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
           <Button variant="ghost" size="sm" className="bg-slate-100 dark:bg-slate-800">World</Button>
           <Button variant="ghost" size="sm">USA</Button>
           <Button variant="ghost" size="sm">Europe</Button>
        </div>
      </div>

      <Card className="h-[600px] bg-indigo-50 dark:bg-[#0f172a] relative overflow-hidden border-0 shadow-inner">
         {/* Abstract Map Background */}
         <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-indigo-300 dark:fill-indigo-900">
               <path d="M10,20 Q20,5 30,20 T50,20 T70,20 T90,20 V80 H10 Z" />
               <path d="M0,40 Q25,25 50,40 T100,40 V100 H0 Z" transform="translate(0, 10)" />
            </svg>
         </div>

         {/* Pins */}
         <div className="absolute top-1/3 left-1/4 animate-bounce duration-[2000ms]">
            <MapPin className="h-8 w-8 text-red-500 drop-shadow-md" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[2px]" />
         </div>
         <div className="absolute top-1/2 left-1/2 animate-bounce duration-[2500ms]">
            <MapPin className="h-8 w-8 text-indigo-500 drop-shadow-md" />
         </div>
         <div className="absolute bottom-1/3 right-1/3 animate-bounce duration-[3000ms]">
            <MapPin className="h-8 w-8 text-emerald-500 drop-shadow-md" />
         </div>
         
         <div className="absolute bottom-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800">
            <h4 className="font-semibold text-sm mb-2">Region Status</h4>
            <div className="space-y-2 text-xs">
               <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>North America (Active)</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  <span>Europe (Active)</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Asia Pacific (High Latency)</span>
               </div>
            </div>
         </div>
      </Card>
    </div>
  );
};

// --- Database Page ---
export const DatabasePage = () => {
  const tables = [
    { name: 'users', rows: 12405, size: '45 MB', lastUpdated: '2 mins ago' },
    { name: 'tickets', rows: 84320, size: '128 MB', lastUpdated: '1 min ago' },
    { name: 'logs', rows: 1542001, size: '2.4 GB', lastUpdated: 'Just now' },
    { name: 'configs', rows: 540, size: '1.2 MB', lastUpdated: '4 hours ago' },
    { name: 'sessions', rows: 45, size: '0.5 MB', lastUpdated: 'Live' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Database Management</h1>
            <p className="text-slate-500 dark:text-slate-400">Schema overview and maintenance tools.</p>
         </div>
         <Button><Database className="mr-2 h-4 w-4" /> New Backup</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         {/* Main Tables List */}
         <div className="md:col-span-2 space-y-4">
            <Card>
               <CardHeader>
                  <CardTitle className="text-base">Public Schema Tables</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-1">
                     {tables.map((table) => (
                        <div key={table.name} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md transition-colors cursor-pointer group">
                           <div className="flex items-center gap-3">
                              <Database className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                              <div>
                                 <p className="font-medium text-sm text-slate-900 dark:text-slate-200">{table.name}</p>
                                 <p className="text-xs text-slate-500">{table.lastUpdated}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{table.rows.toLocaleString()}</p>
                              <p className="text-xs text-slate-400">{table.size}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Sidebar / Stats */}
         <div className="space-y-4">
            <Card className="bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30">
               <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                     <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                     <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Healthy</h3>
                  </div>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200">Database cluster is operating within normal parameters.</p>
                  <div className="mt-4 text-2xl font-bold text-emerald-900 dark:text-emerald-100">99.99%</div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">Uptime this month</p>
               </CardContent>
            </Card>
            
            <Card>
               <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs"><Server className="mr-2 h-3 w-3" /> Rotate Credentials</Button>
                  <Button variant="outline" className="w-full justify-start text-xs"><Activity className="mr-2 h-3 w-3" /> View Query Logs</Button>
                  <Button variant="outline" className="w-full justify-start text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"><Database className="mr-2 h-3 w-3" /> Flush Cache</Button>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
};

// --- Help Center Page ---
export const HelpCenterPage = () => {
   return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500">
         <div className="text-center space-y-4 py-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">How can we help you?</h1>
            <div className="relative max-w-lg mx-auto">
               <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
               <Input className="pl-10 h-12 text-lg shadow-md border-slate-200 dark:border-slate-800" placeholder="Search for answers..." />
            </div>
         </div>

         <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors cursor-pointer">
               <CardContent className="p-6 space-y-3 text-center">
                  <div className="h-12 w-12 mx-auto bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                     <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Documentation</h3>
                  <p className="text-sm text-slate-500">Guides and reference materials for configuration.</p>
               </CardContent>
            </Card>
            <Card className="hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors cursor-pointer">
               <CardContent className="p-6 space-y-3 text-center">
                  <div className="h-12 w-12 mx-auto bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                     <MessageCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Community Forum</h3>
                  <p className="text-sm text-slate-500">Connect with other users and share solutions.</p>
               </CardContent>
            </Card>
            <Card className="hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors cursor-pointer">
               <CardContent className="p-6 space-y-3 text-center">
                  <div className="h-12 w-12 mx-auto bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                     <LifeBuoy className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Contact Support</h3>
                  <p className="text-sm text-slate-500">Get in touch with our technical support team.</p>
               </CardContent>
            </Card>
         </div>

         <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Popular Articles</h2>
            <div className="grid gap-2">
               {['Setting up your first bridge config', 'Understanding topology nodes', 'Database backup best practices', 'Troubleshooting API latency'].map((article, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                     <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{article}</span>
                     </div>
                     <ChevronRightIcon className="h-4 w-4 text-slate-400" />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

function ChevronRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}