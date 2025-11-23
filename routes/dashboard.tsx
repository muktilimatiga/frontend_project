import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  TicketCheck, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  MoreHorizontal,
  Search,
  CheckCircle2,
  Plus,
  Network,
  Settings as SettingsIcon,
  X,
  Play,
  UserCog,
  FileText,
  User as UserIcon,
  ChevronLeft
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { MockService, MockSocket } from '../mock';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, ModalOverlay, Label, Select, Textarea, Avatar, CardFooter, cn, Switch } from '../components/ui';
import { Ticket, TicketLog, TicketPrioritySchema, TicketStatusSchema, DashboardStats, User } from '../types';

// --- Helper Components ---
const StatCard = ({ title, value, icon: Icon, trend }: { title: string, value: string | number, icon: any, trend?: string }) => (
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <div className="flex items-center pt-2">
        <div className="text-2xl font-bold dark:text-slate-50">{value}</div>
        {trend && (
          <div className="ml-auto flex items-baseline text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="mr-1 h-3 w-3" />
            {trend}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

const StatusBadge = ({ status }: { status: Ticket['status'] }) => {
  const styles = {
    open: 'secondary',
    in_progress: 'warning',
    resolved: 'success',
    closed: 'outline'
  } as const;
  
  // Formatting status string for display
  const label = status.replace('_', ' ');
  
  return <Badge variant={styles[status] as any} className="capitalize">{label}</Badge>;
};

const PriorityDot = ({ priority }: { priority: Ticket['priority'] }) => {
  const colors = {
    low: 'bg-slate-400',
    medium: 'bg-blue-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500'
  };
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${colors[priority]}`} />
      <span className="capitalize text-slate-600 dark:text-slate-400">{priority}</span>
    </div>
  );
};

// --- Modals ---

const CreateTicketModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [customerSearch, setCustomerSearch] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCustomerSearch('');
      setSelectedUser(null);
      setSearchResults([]);
    }
  }, [isOpen]);

  // Simulate search debounce
  useEffect(() => {
    const timer = setTimeout(async () => {
       if (customerSearch.length > 1) {
          const res = await MockService.searchUsers(customerSearch);
          setSearchResults(res);
       } else {
          setSearchResults([]);
       }
    }, 300);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Create Open Ticket</h2>
        
        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-4">
           <div className={cn("h-2 rounded-full flex-1 transition-colors", step >= 1 ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800")} />
           <div className={cn("h-2 rounded-full flex-1 transition-colors", step >= 2 ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800")} />
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="space-y-2">
                <Label htmlFor="customer-search">Find Customer</Label>
                <div className="relative">
                   <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                   <Input 
                      id="customer-search" 
                      placeholder="Search by name or email..." 
                      className="pl-9"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      autoFocus
                   />
                </div>
             </div>
             <div className="min-h-[200px] border border-slate-100 rounded-md p-2 dark:border-slate-800">
                {searchResults.length === 0 && customerSearch.length > 1 && (
                   <p className="text-xs text-slate-500 text-center py-8">No customers found.</p>
                )}
                {searchResults.length === 0 && customerSearch.length <= 1 && (
                   <p className="text-xs text-slate-500 text-center py-8">Start typing to search...</p>
                )}
                <div className="space-y-1">
                   {searchResults.map(user => (
                      <div 
                         key={user.id} 
                         onClick={() => { setSelectedUser(user); setStep(2); }}
                         className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded cursor-pointer transition-colors"
                      >
                         <Avatar fallback={user.name.charAt(0)} className="h-8 w-8 text-xs" />
                         <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                         </div>
                         <Badge variant="outline" className="ml-auto text-[10px]">{user.role}</Badge>
                      </div>
                   ))}
                </div>
             </div>
             <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
             </div>
          </div>
        )}

        {step === 2 && selectedUser && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center gap-3 bg-indigo-50 p-3 rounded-md dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30">
                <Avatar fallback={selectedUser.name.charAt(0)} className="h-10 w-10 text-sm bg-indigo-200 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100" />
                <div>
                   <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedUser.name}</p>
                   <p className="text-xs text-slate-500 dark:text-slate-400">Customer • {selectedUser.email}</p>
                </div>
                <Button size="sm" variant="ghost" className="ml-auto h-6 w-6 p-0" onClick={() => setStep(1)}><ChevronLeft className="h-4 w-4" /></Button>
             </div>

             <div className="space-y-2">
               <Label htmlFor="title">Subject</Label>
               <Input id="title" placeholder="Brief description of the issue" autoFocus />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="priority">Priority</Label>
                 <Select id="priority">
                   <option>Low</option>
                   <option>Medium</option>
                   <option>High</option>
                   <option>Critical</option>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="category">Category</Label>
                 <Select id="category">
                   <option>Technical</option>
                   <option>Billing</option>
                   <option>Feature Request</option>
                 </Select>
               </div>
             </div>
             <div className="space-y-2">
               <Label htmlFor="desc">Description</Label>
               <Textarea id="desc" placeholder="Detailed explanation..." rows={3} />
             </div>
             <div className="flex justify-end gap-2 pt-2">
               <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
               <Button onClick={onClose}>Create Ticket</Button>
             </div>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
};

const ConfigModal = ({ isOpen, onClose, type }: { isOpen: boolean, onClose: () => void, type: 'basic' | 'bridge' }) => {
  const [isAuto, setIsAuto] = useState(false);

  useEffect(() => {
    if (isOpen) setIsAuto(false);
  }, [isOpen]);

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{type === 'basic' ? 'New Configuration' : 'New Config Bridge'}</h2>
        
        {/* Auto / Manual Toggle */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-900 p-3 rounded-md border border-slate-100 dark:border-slate-800">
           <div className="space-y-0.5">
              <Label className="text-base">Automatic Configuration</Label>
              <p className="text-xs text-slate-500">Let the system determine optimal settings.</p>
           </div>
           <Switch checked={isAuto} onCheckedChange={setIsAuto} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="config-name">Configuration Name</Label>
          <Input id="config-name" placeholder="e.g. Main Router" />
        </div>
        {type === 'bridge' && (
           <div className="space-y-2">
             <Label htmlFor="interface">Interface</Label>
             <Input id="interface" placeholder="eth0" disabled={isAuto} className={cn(isAuto && "opacity-50")} />
           </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="params">Parameters (JSON)</Label>
          <div className="relative">
             <Textarea 
                id="params" 
                className={cn("font-mono text-xs transition-opacity", isAuto && "opacity-50 cursor-not-allowed")} 
                rows={5} 
                value={isAuto ? "{\n  \"mode\": \"auto\",\n  \"optimization\": true,\n  \"discovery\": \"dynamic\"\n}" : "{\n  \n}"}
                readOnly={isAuto}
             />
             {isAuto && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <Badge variant="secondary" className="bg-white/90 shadow-sm dark:bg-slate-800/90 backdrop-blur">Auto-Generated</Badge>
                </div>
             )}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Save Config</Button>
        </div>
      </div>
    </ModalOverlay>
  );
};

const ProcessActionModal = ({ 
  ticket, 
  isOpen, 
  onClose, 
  onConfirm, 
  defaultAction = 'forward' 
}: { 
  ticket: Ticket | null, 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: (id: string, action: 'in_progress' | 'closed', note: string) => void,
  defaultAction?: 'forward' | 'close'
}) => {
  const [actionType, setActionType] = useState<'forward' | 'close'>(defaultAction);
  const [note, setNote] = useState('');

  // Reset state when ticket changes or opens
  useEffect(() => {
    if (isOpen) {
        setActionType(defaultAction);
        setNote('');
    }
  }, [isOpen, defaultAction]);

  if (!ticket) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Process Ticket <span className="text-slate-500 text-base font-normal">#{ticket.id}</span></h2>
        </div>
        
        <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button 
                onClick={() => setActionType('forward')}
                className={cn("flex-1 text-sm font-medium py-1.5 rounded-md transition-all", actionType === 'forward' ? "bg-white shadow-sm text-slate-900 dark:bg-slate-700 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400")}
            >
                Forward / Process
            </button>
            <button 
                onClick={() => setActionType('close')}
                className={cn("flex-1 text-sm font-medium py-1.5 rounded-md transition-all", actionType === 'close' ? "bg-white shadow-sm text-red-600 dark:bg-slate-700 dark:text-red-400" : "text-slate-500 hover:text-slate-900 dark:text-slate-400")}
            >
                Close Ticket
            </button>
        </div>

        <div className="space-y-3">
            {actionType === 'forward' ? (
                <>
                    <div className="space-y-2">
                        <Label>Assignee</Label>
                        <Select>
                            <option>Alex Carter (Me)</option>
                            <option>Sarah Jones</option>
                            <option>Technician Pool</option>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Priority Adjustment</Label>
                        <Select defaultValue={ticket.priority}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </Select>
                    </div>
                </>
            ) : (
                <div className="space-y-2">
                    <Label>Resolution Code</Label>
                    <Select>
                        <option>Resolved</option>
                        <option>Duplicate</option>
                        <option>Cannot Reproduce</option>
                        <option>Wont Fix</option>
                    </Select>
                </div>
            )}

            <div className="space-y-2">
                <Label>Note / Comment</Label>
                <Textarea 
                    placeholder={actionType === 'forward' ? "Add instructions for the technician..." : "Reason for closing..."}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                />
            </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
                variant={actionType === 'close' ? 'destructive' : 'default'}
                onClick={() => onConfirm(ticket.id, actionType === 'forward' ? 'in_progress' : 'closed', note)}
            >
                {actionType === 'forward' ? 'Start Processing' : 'Close Ticket'}
            </Button>
        </div>
      </div>
    </ModalOverlay>
  );
};

const TicketDetailModal = ({ ticket, isOpen, onClose }: { ticket: Ticket | null, isOpen: boolean, onClose: () => void }) => {
  // Use a query to fetch specific logs for this ticket when open
  // In a real app, we'd pass ticket.id to the queryKey
  const logsQuery = useQuery({ 
    queryKey: ['logs', ticket?.id], 
    queryFn: MockService.getTicketLogs,
    enabled: !!ticket 
  });

  if (!ticket) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="flex flex-col h-[80vh] md:h-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4 dark:border-slate-800">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <Badge variant="outline">{ticket.id}</Badge>
                 <StatusBadge status={ticket.status} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{ticket.title}</h2>
              <p className="text-xs text-slate-500 mt-1">Created on {new Date(ticket.createdAt).toLocaleString()}</p>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
           {/* User Card */}
           <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <Avatar fallback={ticket.assigneeId ? 'AC' : 'U'} src={ticket.assigneeId ? 'https://i.pravatar.cc/150?u=alex' : undefined} className="h-12 w-12" />
              <div className="flex-1">
                 <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{ticket.assigneeId ? 'Alex Carter' : 'Unassigned'}</h4>
                 <p className="text-xs text-slate-500">{ticket.assigneeId ? 'Senior Administrator' : 'Waiting for assignment'}</p>
              </div>
              <Button variant="outline" size="sm">View Profile</Button>
           </div>

           {/* Activity Logs */}
           <div>
              <h3 className="text-sm font-semibold mb-3 text-slate-900 dark:text-slate-200">Activity Log</h3>
              <div className="space-y-4">
                 {logsQuery.isLoading ? (
                    <div className="text-center text-xs text-slate-500">Loading logs...</div>
                 ) : (
                    logsQuery.data?.map((log, i) => (
                       <div key={i} className="flex gap-3 text-sm">
                          <div className="flex flex-col items-center">
                             <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {log.userName.charAt(0)}
                             </div>
                             {i < (logsQuery.data?.length || 0) - 1 && <div className="w-px h-full bg-slate-200 my-1 dark:bg-slate-800" />}
                          </div>
                          <div className="pb-4">
                             <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900 dark:text-slate-200">{log.userName}</span>
                                <span className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                             </div>
                             <p className="text-slate-600 dark:text-slate-400 mt-1">{log.message}</p>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 pt-4 mt-4 flex justify-end gap-2 dark:border-slate-800">
           <Button variant="outline" onClick={onClose}>Close</Button>
           <Button>Add Note</Button>
        </div>
      </div>
    </ModalOverlay>
  );
};


// --- Main Dashboard Component ---
export const Dashboard = () => {
  const queryClient = useQueryClient();
  const [closedSearch, setClosedSearch] = useState('');
  
  // Modal States
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [modalType, setModalType] = useState<'none' | 'create_ticket' | 'config' | 'config_bridge'>('none');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [processTicket, setProcessTicket] = useState<Ticket | null>(null);
  const [processDefaultAction, setProcessDefaultAction] = useState<'forward' | 'close'>('forward');

  const statsQuery = useQuery({ queryKey: ['stats'], queryFn: MockService.getDashboardStats });
  const trafficQuery = useQuery({ queryKey: ['traffic'], queryFn: MockService.getTrafficData });
  const ticketsQuery = useQuery({ queryKey: ['recentTickets'], queryFn: MockService.getRecentTickets });
  const distributionQuery = useQuery({ queryKey: ['distribution'], queryFn: MockService.getTicketDistribution });

  // Filter: Recent Tickets (Open & In Progress)
  const activeTickets = useMemo(() => {
    return ticketsQuery.data?.filter(t => t.status === 'open' || t.status === 'in_progress').slice(0, 5) || [];
  }, [ticketsQuery.data]);

  // Filter: Recently Closed (Last 2 days) + Search
  const closedTickets = useMemo(() => {
    if (!ticketsQuery.data) return [];
    const twoDaysAgo = Date.now() - (48 * 60 * 60 * 1000);
    return ticketsQuery.data
      .filter(t => {
        const isClosed = t.status === 'closed';
        const isRecent = new Date(t.createdAt).getTime() > twoDaysAgo;
        const matchesSearch = t.title.toLowerCase().includes(closedSearch.toLowerCase()) || t.id.toLowerCase().includes(closedSearch.toLowerCase());
        return isClosed && isRecent && matchesSearch;
      })
      .slice(0, 10);
  }, [ticketsQuery.data, closedSearch]);

  // Handlers
  const handleUpdateStatus = async (e: React.MouseEvent, id: string, newStatus: string) => {
    e.stopPropagation(); // Prevent opening detail modal
    await MockService.updateTicketStatus(id, newStatus);
    // Optimistic Update
    queryClient.setQueryData(['recentTickets'], (old: Ticket[] | undefined) => {
       if (!old) return [];
       return old.map(t => t.id === id ? { ...t, status: newStatus as any } : t);
    });
  };

  const handleProcessConfirm = async (id: string, status: 'in_progress' | 'closed', note: string) => {
    await MockService.updateTicketStatus(id, status);
    // Optimistic Update
    queryClient.setQueryData(['recentTickets'], (old: Ticket[] | undefined) => {
       if (!old) return [];
       return old.map(t => t.id === id ? { ...t, status: status as any } : t);
    });
    console.log(`Ticket ${id} processed with note: ${note}`);
    setProcessTicket(null);
  };

  // Real-time Subscription
  useEffect(() => {
    const unsubscribe = MockSocket.subscribe((event) => {
      if (event.type === 'NEW_TICKET') {
        queryClient.setQueryData(['recentTickets'], (oldData: Ticket[] | undefined) => {
           if (!oldData) return [event.payload];
           return [event.payload, ...oldData];
        });
        queryClient.setQueryData(['stats'], (oldData: DashboardStats | undefined) => {
           if (!oldData) return oldData;
           return { ...oldData, totalTickets: oldData.totalTickets + 1, openTickets: oldData.openTickets + 1 };
        });
      }
      if (event.type === 'NEW_LOG') {
         queryClient.setQueryData(['logs'], (oldData: TicketLog[] | undefined) => {
          if (!oldData) return [event.payload];
          return [event.payload, ...oldData].slice(0, 15);
        });
      }
    });
    return unsubscribe;
  }, [queryClient]);

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b'];

  if (statsQuery.isLoading) return <div className="p-10 flex justify-center text-slate-400">Loading Dashboard...</div>;

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-100px)]">
      {/* --- Modals --- */}
      <CreateTicketModal isOpen={modalType === 'create_ticket'} onClose={() => setModalType('none')} />
      <ConfigModal isOpen={modalType === 'config'} onClose={() => setModalType('none')} type="basic" />
      <ConfigModal isOpen={modalType === 'config_bridge'} onClose={() => setModalType('none')} type="bridge" />
      <TicketDetailModal isOpen={!!selectedTicket} ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      <ProcessActionModal 
        isOpen={!!processTicket} 
        ticket={processTicket} 
        onClose={() => setProcessTicket(null)} 
        onConfirm={handleProcessConfirm}
        defaultAction={processDefaultAction} 
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400">
           <span className="relative flex h-2 w-2 mr-2">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
           </span>
           Live Updates Active
        </Badge>
      </div>

      {/* Row 1: KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Tickets" value={statsQuery.data?.totalTickets || 0} icon={TicketCheck} trend="+12.5%" />
        <StatCard title="Open Tickets" value={statsQuery.data?.openTickets || 0} icon={AlertCircle} />
        <StatCard title="Resolved" value={statsQuery.data?.resolvedTickets || 0} icon={TicketCheck} trend="+4.3%" />
        <StatCard title="Avg Response" value={statsQuery.data?.avgResponseTime || '--'} icon={Clock} />
      </div>

      {/* Row 2: Chart & Active Tickets */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Ticket Traffic</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trafficQuery.data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'var(--tooltip-bg)', borderRadius: '8px', border: '1px solid var(--border)' }} />
                  <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Active Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTickets.length === 0 && <div className="text-sm text-slate-500">No active tickets.</div>}
              {activeTickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className="group flex flex-col gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 cursor-pointer transition-all"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  <div className="flex items-start justify-between">
                     <div className="space-y-1">
                       <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-200">{ticket.title}</p>
                       <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                         <span>{ticket.id}</span>
                         <span>•</span>
                         <PriorityDot priority={ticket.priority} />
                       </div>
                     </div>
                     <StatusBadge status={ticket.status} />
                  </div>
                  
                  {/* Action Buttons Row */}
                  <div className="flex items-center gap-2 pt-1">
                     {ticket.status === 'open' && (
                        <Button 
                           size="sm" 
                           className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:text-white"
                           onClick={(e) => {
                              e.stopPropagation();
                              setProcessDefaultAction('forward');
                              setProcessTicket(ticket);
                           }}
                        >
                           <Play className="mr-1 h-3 w-3" /> Process Ticket
                        </Button>
                     )}
                     {ticket.status === 'in_progress' && (
                        <>
                           <Button 
                              size="sm" 
                              variant="secondary"
                              className="h-7 text-xs"
                              onClick={(e) => {
                                 e.stopPropagation();
                                 alert("Ticket assigned to technician (mock)");
                              }}
                           >
                              <UserCog className="mr-1 h-3 w-3" /> Technician
                           </Button>
                           <Button 
                              size="sm" 
                              variant="outline"
                              className="h-7 text-xs hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                              onClick={(e) => {
                                e.stopPropagation();
                                setProcessDefaultAction('close');
                                setProcessTicket(ticket);
                              }}
                           >
                              <X className="mr-1 h-3 w-3" /> Close
                           </Button>
                        </>
                     )}
                     <Button size="sm" variant="ghost" className="h-7 text-xs ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                        View Details
                     </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Recently Closed & Distribution */}
      <div className="grid gap-4 md:grid-cols-7 pb-20">
        <Card className="md:col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="space-y-1">
               <CardTitle>Recently Closed Tickets</CardTitle>
               <p className="text-xs text-slate-500 dark:text-slate-400">Last 48 hours</p>
            </div>
            <div className="relative w-48">
              <Search className="absolute left-2 top-2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search..." 
                className="pl-8 h-8" 
                value={closedSearch} 
                onChange={(e) => setClosedSearch(e.target.value)} 
              />
            </div>
          </CardHeader>
          <CardContent>
             <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {closedTickets.length === 0 && (
                   <div className="text-center py-8 text-slate-500 text-sm">No closed tickets found in the last 2 days.</div>
                )}
                {closedTickets.map((ticket) => (
                  <div 
                    key={ticket.id} 
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors cursor-pointer dark:border-slate-800 dark:hover:bg-slate-900"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                     <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{ticket.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Closed {new Date(ticket.createdAt).toLocaleDateString()}</p>
                        </div>
                     </div>
                     <Badge variant="outline" className="text-xs dark:text-slate-400">{ticket.id}</Badge>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Ticket Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
             <div className="h-[250px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={distributionQuery.data}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                     stroke="none"
                   >
                     {distributionQuery.data?.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <RechartsTooltip contentStyle={{ backgroundColor: 'var(--tooltip-bg)', borderRadius: '8px', border: '1px solid var(--border)' }} />
                 </PieChart>
               </ResponsiveContainer>
               <div className="mt-4 flex justify-center gap-4 flex-wrap">
                  {distributionQuery.data?.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      {entry.name}
                    </div>
                  ))}
               </div>
             </div>
          </CardContent>
        </Card>
      </div>

      {/* --- Floating Action Button (FAB) --- */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-4">
        {/* Speed Dial Options */}
        {isFabOpen && (
          <div className="flex flex-col items-end space-y-3 animate-in slide-in-from-bottom-5 duration-200">
             <div className="flex items-center gap-3">
                <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-sm dark:bg-slate-50 dark:text-slate-900">New Config Bridge</span>
                <Button 
                   size="icon" 
                   className="h-10 w-10 rounded-full bg-white text-slate-700 shadow-md hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                   onClick={() => { setModalType('config_bridge'); setIsFabOpen(false); }}
                >
                   <Network className="h-5 w-5" />
                </Button>
             </div>
             <div className="flex items-center gap-3">
                <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-sm dark:bg-slate-50 dark:text-slate-900">New Config</span>
                <Button 
                   size="icon" 
                   className="h-10 w-10 rounded-full bg-white text-slate-700 shadow-md hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                   onClick={() => { setModalType('config'); setIsFabOpen(false); }}
                >
                   <SettingsIcon className="h-5 w-5" />
                </Button>
             </div>
             <div className="flex items-center gap-3">
                <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-sm dark:bg-slate-50 dark:text-slate-900">Open Ticket</span>
                <Button 
                   size="icon" 
                   className="h-10 w-10 rounded-full bg-white text-slate-700 shadow-md hover:bg-slate-50 border border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700"
                   onClick={() => { setModalType('create_ticket'); setIsFabOpen(false); }}
                >
                   <FileText className="h-5 w-5" />
                </Button>
             </div>
          </div>
        )}

        {/* Main Trigger */}
        <Button 
           size="icon" 
           className={cn("h-14 w-14 rounded-full shadow-lg transition-transform", isFabOpen ? "rotate-45" : "rotate-0")}
           onClick={() => setIsFabOpen(!isFabOpen)}
        >
           <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};