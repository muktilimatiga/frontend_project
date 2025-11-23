import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, Button, DataTable, ColumnDef, Badge } from '../../components/ui';
import { MockService } from '../../mock';
import { Ticket } from '../../types';

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = { open: 'secondary', in_progress: 'warning', resolved: 'success', closed: 'outline' };
  return <Badge variant={styles[status]}>{status.replace('_', ' ')}</Badge>;
};

const PriorityDot = ({ priority }: { priority: string }) => {
  const colors: any = { low: 'bg-slate-400', medium: 'bg-blue-500', high: 'bg-orange-500', critical: 'bg-red-500' };
  return <div className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${colors[priority]}`} /><span className="capitalize">{priority}</span></div>;
};

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
      <Card className="dark:bg-black dark:border-white/20">
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