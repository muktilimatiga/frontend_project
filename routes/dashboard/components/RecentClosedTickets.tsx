import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Input, Badge } from '../../../components/ui';
import { Search, CheckCircle2 } from 'lucide-react';
import { Ticket } from '../../../types';

interface RecentClosedTicketsProps {
  tickets: Ticket[];
  search: string;
  onSearchChange: (val: string) => void;
  onSelectTicket: (t: Ticket) => void;
}

export const RecentClosedTickets = ({ tickets, search, onSearchChange, onSelectTicket }: RecentClosedTicketsProps) => {
  return (
    <Card className="md:col-span-4 dark:bg-[#000000] dark:border-white/20">
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
            value={search} 
            onChange={(e) => onSearchChange(e.target.value)} 
          />
        </div>
      </CardHeader>
      <CardContent>
         <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {tickets.length === 0 && (
               <div className="text-center py-8 text-slate-500 text-sm">No closed tickets found in the last 2 days.</div>
            )}
            {tickets.map((ticket) => (
              <div 
                key={ticket.id} 
                className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors cursor-pointer dark:border-white/10 dark:hover:bg-white/5"
                onClick={() => onSelectTicket(ticket)}
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
  );
};