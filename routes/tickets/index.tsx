
import * as React from 'react';
import { EnhancedTable, ColumnDef } from '../../components/ui/EnhancedTable';
import { Button, Badge } from '../../components/ui';
import { Ticket } from '../../types';
import { Plus, Filter } from 'lucide-react';
import { useTickets } from '../../hooks/useQueries';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = { 
     open: "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-900/50", 
     in_progress: "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-900/50", 
     resolved: "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-900/50", 
     closed: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-white/10 dark:text-slate-400 dark:border-white/20" 
  };
  return <Badge variant="secondary" className={`capitalize font-normal ${styles[status]}`}>{status.replace('_', ' ')}</Badge>;
};

const PriorityDot = ({ priority }: { priority: string }) => {
  const colors: any = { low: 'bg-slate-400', medium: 'bg-blue-500', high: 'bg-orange-500', critical: 'bg-red-500' };
  return (
     <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${colors[priority]}`} />
        <span className="capitalize text-sm text-slate-600 dark:text-slate-300">{priority}</span>
     </div>
  );
};

export const TicketsPage = () => {
  const { data: tickets = [] } = useTickets();

  const columns: ColumnDef<Ticket>[] = [
    { header: 'Ticket ID', accessorKey: 'id', className: 'font-mono text-xs text-slate-500' },
    { header: 'Subject', accessorKey: 'title', className: 'font-medium text-slate-900 dark:text-slate-100 max-w-[300px] truncate' },
    { header: 'Status', accessorKey: 'status', cell: (t) => <StatusBadge status={t.status} /> },
    { header: 'Priority', accessorKey: 'priority', cell: (t) => <PriorityDot priority={t.priority} /> },
    { header: 'Created', accessorKey: 'createdAt', cell: (t) => <span className="text-slate-500 dark:text-slate-400">{new Date(t.createdAt).toLocaleDateString()}</span> },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <EnhancedTable 
         title="Tickets"
         data={tickets} 
         columns={columns} 
         searchKey="title"
         onEdit={(t) => console.log('Edit', t)}
         onDelete={(t) => console.log('Delete', t)}
         actionButtons={
            <>
               <Button variant="outline" className="bg-white dark:bg-black">
                  <Filter className="mr-2 h-4 w-4" /> Filter
               </Button>
               <Button className="bg-slate-900 dark:bg-white dark:text-black">
                  <Plus className="mr-2 h-4 w-4" /> New Ticket
               </Button>
            </>
         }
      />
    </div>
  );
};
