import React, { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Network, Settings as SettingsIcon, FileText, Plus } from 'lucide-react';
import { MockService, MockSocket } from '../../mock';
import { Badge, Button, cn } from '../../components/ui';
import { Ticket, TicketLog, DashboardStats } from '../../types';

// Import refactored components
import { DashboardStatsGrid } from './components/StatCards';
import { TrafficChart, DistributionChart } from './components/Charts';
import { ActiveTickets } from './components/ActiveTickets';
import { RecentClosedTickets } from './components/RecentClosedTickets';
import { CreateTicketModal, ConfigModal, ProcessActionModal, TicketDetailModal } from './components/Modals';

export const Dashboard = () => {
  const queryClient = useQueryClient();
  const [closedSearch, setClosedSearch] = useState('');
  
  // Modal States
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [modalType, setModalType] = useState<'none' | 'create_ticket' | 'config' | 'config_bridge'>('none');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [processTicket, setProcessTicket] = useState<Ticket | null>(null);
  const [processDefaultAction, setProcessDefaultAction] = useState<'forward' | 'close'>('forward');

  // Queries
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

  const handleProcessTrigger = (ticket: Ticket, action: 'forward' | 'close') => {
      setProcessDefaultAction(action);
      setProcessTicket(ticket);
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

  if (statsQuery.isLoading) return <div className="p-10 flex justify-center text-slate-400">Loading Dashboard...</div>;

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-100px)] animate-in fade-in duration-500">
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
      <DashboardStatsGrid stats={statsQuery.data} />

      {/* Row 2: Chart & Active Tickets */}
      <div className="grid gap-4 md:grid-cols-7">
        <TrafficChart data={trafficQuery.data} />
        <ActiveTickets 
            tickets={activeTickets} 
            onSelectTicket={setSelectedTicket}
            onProcess={handleProcessTrigger}
            onTechnicianAssign={() => alert('Assigned to technician pool.')}
        />
      </div>

      {/* Row 3: Recently Closed & Distribution */}
      <div className="grid gap-4 md:grid-cols-7 pb-20">
        <RecentClosedTickets 
            tickets={closedTickets} 
            search={closedSearch} 
            onSearchChange={setClosedSearch} 
            onSelectTicket={setSelectedTicket}
        />
        <DistributionChart data={distributionQuery.data} />
      </div>

      {/* --- Floating Action Button (FAB) --- */}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end space-y-4">
        {isFabOpen && (
          <div className="flex flex-col items-end space-y-3 animate-in slide-in-from-bottom-5 duration-200">
             <div className="flex items-center gap-3">
                <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-sm dark:bg-white dark:text-black">New Config Bridge</span>
                <Button 
                   size="icon" 
                   className="h-10 w-10 rounded-full bg-white text-slate-700 shadow-md hover:bg-slate-50 border border-slate-200 dark:bg-black dark:text-white dark:border-white/20"
                   onClick={() => { setModalType('config_bridge'); setIsFabOpen(false); }}
                >
                   <Network className="h-5 w-5" />
                </Button>
             </div>
             <div className="flex items-center gap-3">
                <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-sm dark:bg-white dark:text-black">New Config</span>
                <Button 
                   size="icon" 
                   className="h-10 w-10 rounded-full bg-white text-slate-700 shadow-md hover:bg-slate-50 border border-slate-200 dark:bg-black dark:text-white dark:border-white/20"
                   onClick={() => { setModalType('config'); setIsFabOpen(false); }}
                >
                   <SettingsIcon className="h-5 w-5" />
                </Button>
             </div>
             <div className="flex items-center gap-3">
                <span className="bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-sm dark:bg-white dark:text-black">Open Ticket</span>
                <Button 
                   size="icon" 
                   className="h-10 w-10 rounded-full bg-white text-slate-700 shadow-md hover:bg-slate-50 border border-slate-200 dark:bg-black dark:text-white dark:border-white/20"
                   onClick={() => { setModalType('create_ticket'); setIsFabOpen(false); }}
                >
                   <FileText className="h-5 w-5" />
                </Button>
             </div>
          </div>
        )}

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