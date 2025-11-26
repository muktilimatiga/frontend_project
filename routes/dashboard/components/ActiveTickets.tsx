
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '../../../components/ui';
import { Play, UserCog, X, MoreHorizontal, Eye, ArrowRight } from 'lucide-react';
import { Ticket } from '../../../types';

const StatusBadge = ({ status }: { status: Ticket['status'] }) => {
  const styles = {
    open: 'secondary',
    in_progress: 'warning',
    resolved: 'success',
    closed: 'outline'
  } as const;
  return <Badge variant={styles[status] as any} className="capitalize">{status.replace('_', ' ')}</Badge>;
};

const PriorityDot = ({ priority }: { priority: Ticket['priority'] }) => {
  const colors = { low: 'bg-slate-400', medium: 'bg-blue-500', high: 'bg-orange-500', critical: 'bg-red-500' };
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${colors[priority]}`} />
      <span className="capitalize text-slate-600 dark:text-slate-400">{priority}</span>
    </div>
  );
};

interface ActiveTicketsProps {
  tickets: Ticket[];
  onSelectTicket: (t: Ticket) => void;
  onProcess: (t: Ticket, action: 'forward' | 'close') => void;
  onTechnicianAssign: (t: Ticket) => void;
}

export const ActiveTickets = ({ tickets, onSelectTicket, onProcess, onTechnicianAssign }: ActiveTicketsProps) => {
  return (
    <Card className="md:col-span-3 dark:bg-[#000000] dark:border-white/20">
      <CardHeader>
        <CardTitle>Recent Active Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tickets.length === 0 && <div className="text-sm text-slate-500">No active tickets.</div>}
          {tickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="group flex flex-col gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 dark:border-white/10 dark:hover:bg-white/5 cursor-pointer transition-all"
              onClick={() => onSelectTicket(ticket)}
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
                 
                 <div className="flex items-center gap-2">
                    <StatusBadge status={ticket.status} />
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onSelectTicket(ticket)}>
                                <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            {ticket.status === 'open' && (
                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onProcess(ticket, 'forward'); }} className="text-indigo-600 dark:text-indigo-400">
                                    <Play className="mr-2 h-4 w-4" /> Process Ticket
                                </DropdownMenuItem>
                            )}
                             {ticket.status === 'in_progress' && (
                                <>
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onTechnicianAssign(ticket); }}>
                                        <UserCog className="mr-2 h-4 w-4" /> Assign Technician
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onProcess(ticket, 'close'); }} className="text-red-600 dark:text-red-400">
                                        <X className="mr-2 h-4 w-4" /> Close Ticket
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
              </div>
              
              <div className="flex items-center gap-2 pt-1">
                 {ticket.status === 'open' && (
                    <Button 
                       size="sm" 
                       className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:text-white flex-1 md:flex-none"
                       onClick={(e) => { e.stopPropagation(); onProcess(ticket, 'forward'); }}
                    >
                       <Play className="mr-1 h-3 w-3" /> Process Ticket
                    </Button>
                 )}
                 {ticket.status === 'in_progress' && (
                    <div className="flex gap-2 w-full md:w-auto">
                        <Button 
                            size="sm" 
                            variant="secondary"
                            className="h-7 text-xs flex-1"
                            onClick={(e) => { e.stopPropagation(); onTechnicianAssign(ticket); }}
                        >
                            <UserCog className="mr-1 h-3 w-3" /> Technician
                        </Button>
                        <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7 text-xs hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                            onClick={(e) => { e.stopPropagation(); onProcess(ticket, 'close'); }}
                        >
                            <X className="mr-1 h-3 w-3" /> Close
                        </Button>
                    </div>
                 )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
