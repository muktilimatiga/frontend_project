import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, Avatar } from '../../../components/ui';
import { Play, UserCog, X, MoreHorizontal, Eye, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
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

// Simple time ago helper
const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

interface ActiveTicketsProps {
  tickets: Ticket[];
  onSelectTicket: (t: Ticket) => void;
  onProcess: (t: Ticket, action: 'forward' | 'close') => void;
  onTechnicianAssign: (t: Ticket) => void;
}

export const ActiveTickets = ({ tickets, onSelectTicket, onProcess, onTechnicianAssign }: ActiveTicketsProps) => {
  return (
    <Card className="md:col-span-3 dark:bg-card dark:border-slate-700/50 flex flex-col shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Active Queue</CardTitle>
            <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-900/50">
                {tickets.length} Pending
            </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-3">
          {tickets.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-slate-500">
                  <CheckCircle2 className="h-10 w-10 mb-2 opacity-20" />
                  <p className="text-sm">All caught up! No active tickets.</p>
              </div>
          )}
          {tickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="group relative flex flex-col gap-3 rounded-xl border border-slate-100 p-4 hover:bg-slate-50 hover:border-indigo-100 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/40 dark:hover:bg-slate-800 dark:hover:border-indigo-900/50 transition-all cursor-pointer"
              onClick={() => onSelectTicket(ticket)}
            >
              {/* Top Row: ID, Priority, Time */}
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {ticket.id}
                    </span>
                    <PriorityDot priority={ticket.priority} />
                 </div>
                 <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    {timeAgo(ticket.createdAt)}
                 </div>
              </div>

              {/* Title */}
              <h4 className="font-medium text-slate-900 dark:text-slate-100 leading-tight pr-6">
                 {ticket.title}
              </h4>

              {/* Footer: Assignee & Actions */}
              <div className="flex items-center justify-between pt-1">
                 <div className="flex items-center gap-2">
                    {ticket.assigneeId ? (
                        <div className="flex items-center gap-2" title="Assigned">
                             <Avatar src={`https://i.pravatar.cc/150?u=${ticket.assigneeId}`} fallback="A" className="h-6 w-6 border border-white dark:border-slate-700" />
                             <span className="text-xs text-slate-600 dark:text-slate-400">Assigned</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 italic">
                             <div className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center">
                                 <UserCog className="h-3 w-3" />
                             </div>
                             Unassigned
                        </div>
                    )}
                 </div>

                 {/* Quick Actions (Visible on Hover/Mobile) */}
                 <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                     {ticket.status === 'open' ? (
                        <Button 
                            size="sm" 
                            className="h-7 text-xs bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                            onClick={(e) => { e.stopPropagation(); onProcess(ticket, 'forward'); }}
                        >
                            Process
                        </Button>
                     ) : (
                        <Button 
                            size="sm" 
                            variant="outline"
                            className="h-7 text-xs"
                            onClick={(e) => { e.stopPropagation(); onProcess(ticket, 'close'); }}
                        >
                            Close
                        </Button>
                     )}
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onSelectTicket(ticket)}>View Details</DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onTechnicianAssign(ticket); }}>Assign Tech</DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};