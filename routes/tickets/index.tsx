
import * as React from 'react';
import { useState } from 'react';
import { EnhancedTable, ColumnDef } from '../../components/ui/EnhancedTable';
import { Button, Badge, cn } from '../../components/ui';
import { Ticket } from '../../types';
import { Plus, Filter, RefreshCw, User as UserIcon, ArrowRight, CheckCircle2, Forward } from 'lucide-react';
import { useSupabaseTickets } from '../../hooks/useSupabaseTickets';
import { ProcessActionModal, CloseTicketModal, ForwardTicketModal } from '../dashboard/components/modals';
import { useUpdateTicketStatus } from '../../hooks/useQueries';
import { useAppStore } from '../../store';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = { 
     open: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/50", 
     in_progress: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/50", 
     resolved: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/50", 
     closed: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/10 dark:text-slate-400 dark:border-white/20" 
  };
  const style = styles[status] || styles['open'];
  return <Badge variant="secondary" className={`capitalize font-normal ${style}`}>{status.replace('_', ' ')}</Badge>;
};

export const TicketsPage = () => {
  const { data: tickets, loading, refetch } = useSupabaseTickets();
  const updateTicketStatus = useUpdateTicketStatus();
  const { toggleCreateTicketModal } = useAppStore();

  // Modal State
  const [processTicket, setProcessTicket] = useState<Ticket | null>(null);
  const [closeTicket, setCloseTicket] = useState<Ticket | null>(null);
  const [forwardTicket, setForwardTicket] = useState<Ticket | null>(null);

  // Handlers
  const handleProcessConfirm = (id: string, status: 'in_progress' | 'closed', note: string) => {
    updateTicketStatus.mutate({ id, status });
    setProcessTicket(null);
    setTimeout(refetch, 500); // Slight delay to ensure DB update propagates
  };

  const handleCloseConfirm = (id: string, note: string) => {
    updateTicketStatus.mutate({ id, status: 'closed' });
    setCloseTicket(null);
    setTimeout(refetch, 500);
  };

  const handleForwardConfirm = (id: string, note: string) => {
    // Logic to forward (e.g., assign technician, update notes)
    // For now we keep it in_progress but log the forward action via mutation/console
    console.log(`Forwarding ticket ${id}: ${note}`);
    updateTicketStatus.mutate({ id, status: 'in_progress' });
    setForwardTicket(null);
    setTimeout(refetch, 500);
  };

  const columns: ColumnDef<Ticket>[] = [
    { header: 'Ticket ID', accessorKey: 'id', className: 'font-mono text-xs text-slate-500 w-[120px]' },
    { header: 'Subject (Kendala)', accessorKey: 'title', className: 'font-medium text-slate-900 dark:text-slate-100 max-w-[300px] truncate' },
    { header: 'Status', accessorKey: 'status', cell: (t) => <StatusBadge status={t.status} /> },
    { 
      header: 'Assignee (Nama)', 
      accessorKey: 'assigneeId',
      cell: (t) => t.assigneeId ? (
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
           <UserIcon className="h-3 w-3 text-slate-400" /> {t.assigneeId}
        </div>
      ) : <span className="text-xs text-slate-400 italic">Unassigned</span>
    },
    { header: 'Created', accessorKey: 'createdAt', cell: (t) => <span className="text-slate-500 dark:text-slate-400 text-xs">{new Date(t.createdAt).toLocaleDateString()}</span> },
    {
      header: 'Actions',
      accessorKey: 'id',
      className: 'text-right',
      cell: (t) => (
        <div className="flex items-center justify-end gap-2">
           {t.status === 'open' && (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 px-2 text-[10px] gap-1 text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:border-indigo-900 dark:text-indigo-400 dark:hover:bg-indigo-900/20"
                onClick={(e) => { e.stopPropagation(); setProcessTicket(t); }}
              >
                 Process <ArrowRight className="h-3 w-3" />
              </Button>
           )}

           {t.status === 'in_progress' && (
              <Button 
                size="sm" 
                variant="outline" 
                className="h-7 px-2 text-[10px] gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 dark:border-blue-900 dark:text-blue-400 dark:hover:bg-blue-900/20"
                onClick={(e) => { e.stopPropagation(); setForwardTicket(t); }}
              >
                 Forward <Forward className="h-3 w-3" />
              </Button>
           )}
           
           {(t.status === 'open' || t.status === 'in_progress') && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-7 px-2 text-[10px] gap-1 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                onClick={(e) => { e.stopPropagation(); setCloseTicket(t); }}
              >
                 Close
              </Button>
           )}

           {(t.status === 'resolved' || t.status === 'closed') && (
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                 <CheckCircle2 className="h-3 w-3" /> Done
              </span>
           )}
        </div>
      )
    }
  ];

  return (
    <div className="animate-in fade-in duration-500">
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

      <EnhancedTable 
         data={tickets} 
         columns={columns} 
         searchKey="title"
         // Removing default edit/delete actions to use custom column
         onEdit={undefined}
         onDelete={undefined}
         actionButtons={
            <>
               <Button variant="ghost" onClick={refetch} disabled={loading} className="bg-white dark:bg-black dark:text-white">
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> 
                  {loading ? 'Loading...' : 'Refresh'}
               </Button>
               <Button variant="outline" className="bg-white dark:bg-black">
                  <Filter className="mr-2 h-4 w-4" /> Filter
               </Button>
               {/* This button is hidden on desktop (md:hidden) because it's in the Navbar now */}
               <Button onClick={toggleCreateTicketModal} className="bg-slate-900 dark:bg-white dark:text-black md:hidden">
                  <Plus className="mr-2 h-4 w-4" /> New Ticket
               </Button>
            </>
         }
      />
    </div>
  );
};
