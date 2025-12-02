import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Input, Badge, cn } from '../../../components/ui';
import { Search, CheckCircle2, Forward } from 'lucide-react';
import { Ticket } from '../../../types';

interface RecentClosedTicketsProps {
  tickets: Ticket[];
  search: string;
  onSearchChange: (val: string) => void;
  onSelectTicket: (t: Ticket) => void;
}

export const RecentClosedTickets = ({ tickets, search, onSearchChange, onSelectTicket }: RecentClosedTicketsProps) => {
  return (
    <Card className="md:col-span-4 shadow-soft">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="space-y-1">
           <CardTitle>Recently Closed Tickets</CardTitle>
           <p className="text-xs text-slate-500 dark:text-slate-400">Status: Done & Done/Fwd</p>
        </div>
        <div className="relative w-48">
          <Search className="absolute left-2 top-2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search..." 
            className="pl-8 h-8" 
            value={search} 
            onChange={(e) => onSearchChange(e.target.value)} 
          />
        </div>
      </CardHeader>
      <CardContent>
         <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {tickets.length === 0 && (
               <div className="text-center py-8 text-slate-500 text-sm">No closed tickets found.</div>
            )}
            {tickets.map((ticket) => {
              // Styling logic for specific DB statuses
              // Cast status to string to avoid type overlap errors with strict TicketStatus union
              const statusStr = ticket.status as string;
              const isFwd = statusStr === 'done/fwd' || statusStr === 'fwd teknis';
              return (
                <div 
                  key={ticket.id} 
                  className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors cursor-pointer dark:border-white/5 dark:hover:bg-white/5"
                  onClick={() => onSelectTicket(ticket)}
                >
                   <div className="flex items-center gap-3 overflow-hidden">
                      {isFwd ? (
                         <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                            <Forward className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                         </div>
                      ) : (
                         <div className="h-8 w-8 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                         </div>
                      )}
                      <div className="min-w-0 flex-1">
                        {/* Primary: Customer Name (mapped to assigneeId from DB 'nama') */}
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">
                            {ticket.assigneeId || 'Unknown Customer'}
                        </p>
                        {/* Secondary: Issue (title) + Date */}
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                           {ticket.title} • {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                   </div>
                   <div className="flex flex-col items-end gap-1 ml-2 shrink-0">
                      <Badge variant="outline" className="text-[10px] h-5 dark:text-slate-400">{ticket.id}</Badge>
                      <span className={cn(
                          "text-[10px] font-medium capitalize",
                          isFwd ? "text-blue-600 dark:text-blue-400" : "text-emerald-600 dark:text-emerald-400"
                      )}>
                          {statusStr.replace('_', ' ')}
                      </span>
                   </div>
                </div>
              );
            })}
         </div>
      </CardContent>
    </Card>
  );
};