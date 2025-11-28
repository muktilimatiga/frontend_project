
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Network, Settings as SettingsIcon, FileText, Plus, WifiOff, RefreshCw } from 'lucide-react';
import { MockSocket } from '../../mock';
import { Badge, Button, cn } from '../../components/ui';
import { Ticket, TicketLog } from '../../types';
import { useUpdateTicketStatus, queryKeys } from '../../hooks/useQueries';
import { useSupabaseStats } from '../../hooks/useSupabaseStats';
import { toast } from 'sonner';

// Import refactored components
import { DashboardStatsGrid } from './components/StatCards';
import { TrafficChart, DistributionChart } from './components/Charts';
import { ActiveTickets } from './components/ActiveTickets';
import { RecentClosedTickets } from './components/RecentClosedTickets';
import { CreateTicketModal, ConfigModal, ProcessActionModal, TicketDetailModal, CloseTicketModal, ForwardTicketModal } from './components/Modals';

export const Dashboard = () => {
  const queryClient = useQueryClient();
  const [closedSearch, setClosedSearch] = useState('');
  
  // Modal States
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [modalType, setModalType] = useState<'none' | 'create_ticket' | 'config' | 'config_bridge'>('none');
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  // Action Modals State
  const [processTicket, setProcessTicket] = useState<Ticket | null>(null);
  const [closeTicket, setCloseTicket] = useState<Ticket | null>(null);
  const [forwardTicket, setForwardTicket] = useState<Ticket | null>(null);

  // Queries using custom hooks
  // extracting stats, recentTickets, trafficData, and closedTickets from Supabase hook
  const { 
    stats, 
    recentTickets, 
    closedTickets, 
    trafficData, 
    oltDistribution,
    loading: statsLoading, 
    error: statsError, 
    isFallback 
  } = useSupabaseStats();
  
  const updateTicketStatus = useUpdateTicketStatus();

  // Filter: Recent Tickets (Open & In Progress) - Using Supabase Data
  // activeTickets for the queue list will populate from the recent tickets fetched from Supabase
  const activeTickets = useMemo(() => {
    return recentTickets; 
  }, [recentTickets]);

  // Filter: Recently Closed (Last 2 days) + Search
  // Using real data from Supabase, applying local search filter
  const filteredClosedTickets = useMemo(() => {
     if (!closedSearch) return closedTickets;
     const lower = closedSearch.toLowerCase();
     return closedTickets.filter(t => 
        t.title.toLowerCase().includes(lower) || 
        t.id.toLowerCase().includes(lower)
     );
  }, [closedTickets, closedSearch]);

  // Handlers
  const handleUpdateStatus = (id: string, status: 'in_progress' | 'closed', note: string) => {
    updateTicketStatus.mutate({ id, status });
    console.log(`Ticket ${id} updated to ${status} with note: ${note}`);
  };

  const handleProcessConfirm = (id: string, status: 'in_progress' | 'closed', note: string) => {
      handleUpdateStatus(id, status, note);
      setProcessTicket(null);
  };
  
  const handleCloseConfirm = (id: string, note: string) => {
      handleUpdateStatus(id, 'closed', note);
      setCloseTicket(null);
  };

  const handleForwardConfirm = (id: string, note: string) => {
      // In a real app, you would assign a technician here
      console.log(`Forwarding ticket ${id} to technician. Note: ${note}`);
      handleUpdateStatus(id, 'in_progress', `Forwarded to technician: ${note}`);
      setForwardTicket(null);
  };

  const handleProcessTrigger = (ticket: Ticket, action: 'forward' | 'close') => {
      if (action === 'close') {
          setCloseTicket(ticket);
      } else {
          setProcessTicket(ticket);
      }
  };

  const handleTechnicianAssign = (ticket: Ticket) => {
      setForwardTicket(ticket);
  };

  // Real-time Subscription (Kept for compatibility with other parts of app if needed)
  useEffect(() => {
    const unsubscribe = MockSocket.subscribe((event) => {
      if (event.type === 'NEW_TICKET') {
        // Optimistic UI updates could go here
      }
    });
    return unsubscribe;
  }, [queryClient]);

  return (
    <div className="space-y-6 relative min-h-[calc(100vh-100px)] animate-in fade-in duration-500">
      {/* --- Modals --- */}
      <CreateTicketModal isOpen={modalType === 'create_ticket'} onClose={() => setModalType('none')} />
      <ConfigModal isOpen={modalType === 'config'} onClose={() => setModalType('none')} type="basic" />
      <ConfigModal isOpen={modalType === 'config_bridge'} onClose={() => setModalType('none')} type="bridge" />
      <TicketDetailModal isOpen={!!selectedTicket} ticket={selectedTicket} onClose={() => setSelectedTicket(null)} />
      
      {/* Action Modals */}
      <ProcessActionModal 
        isOpen={!!processTicket} 
        ticket={processTicket} 
        onClose={() => setProcessTicket(null)} 
        onConfirm={handleProcessConfirm}
      />
      <CloseTicketModal 
        isOpen={!!closeTicket}
        ticket={closeTicket}
        onClose={() => setCloseTicket(null)}
        onConfirm={handleCloseConfirm}
      />
      <ForwardTicketModal 
        isOpen={!!forwardTicket}
        ticket={forwardTicket}
        onClose={() => setForwardTicket(null)}
        onConfirm={handleForwardConfirm}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard</h1>
        {statsLoading ? (
           <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-500 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-400">
              <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
              Connecting...
           </Badge>
        ) : isFallback ? (
           <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 shadow-sm dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400">
              <WifiOff className="h-3 w-3 mr-2" />
              Offline Mode (Mock Data)
           </Badge>
        ) : (
           <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Connection
           </Badge>
        )}
      </div>

      {/* Row 1: KPIs */}
      <DashboardStatsGrid stats={stats} loading={statsLoading} />

      {/* Row 2: Chart & Active Tickets */}
      <div className="grid gap-4 md:grid-cols-7">
        <TrafficChart data={trafficData} />
        <ActiveTickets 
            tickets={activeTickets} 
            onSelectTicket={setSelectedTicket}
            onProcess={handleProcessTrigger}
            onTechnicianAssign={handleTechnicianAssign}
        />
      </div>

      {/* Row 3: Recently Closed & Distribution */}
      <div className="grid gap-4 md:grid-cols-7 pb-20">
        <RecentClosedTickets 
            tickets={filteredClosedTickets} 
            search={closedSearch} 
            onSearchChange={setClosedSearch} 
            onSelectTicket={setSelectedTicket}
        />
        <DistributionChart data={oltDistribution} />
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
