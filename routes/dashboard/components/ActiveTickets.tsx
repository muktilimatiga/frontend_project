
import * as React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Avatar, cn } from '../../../components/ui';
import { UserCog, MoreHorizontal, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Ticket } from '../../../types';

// Helper for relative time
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

// Priority Color Helper
const getPriorityColor = (priority: string) => {
    switch (priority) {
        case 'critical': return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]';
        case 'high': return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]';
        case 'medium': return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]';
        case 'low': return 'bg-slate-400';
        default: return 'bg-slate-400';
    }
};

interface ActiveTicketsProps {
  tickets: Ticket[];
  onSelectTicket: (t: Ticket) => void;
  onProcess: (t: Ticket, action: 'forward' | 'close') => void;
  onTechnicianAssign: (t: Ticket) => void;
}

export const ActiveTickets = ({ tickets, onSelectTicket, onProcess, onTechnicianAssign }: ActiveTicketsProps) => {
  return (
    <Card className="md:col-span-3 flex flex-col shadow-sm overflow-hidden h-[400px]">
      <CardHeader className="pb-0 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 py-4 px-5">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">Active Queue</CardTitle>
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-5 font-medium bg-slate-200/50 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border border-slate-200 dark:border-zinc-700">
                    {tickets.length}
                </Badge>
            </div>
            {tickets.length > 0 && (
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                </span>
            )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800">
        {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-zinc-800/50 flex items-center justify-center border border-slate-100 dark:border-zinc-700">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500/50" />
                </div>
                <p className="text-sm font-medium">All caught up!</p>
            </div>
        ) : (
            <div className="divide-y divide-slate-100 dark:divide-white/5">
                {tickets.map((ticket) => (
                    <div 
                        key={ticket.id} 
                        className="group flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-zinc-800/50 transition-all cursor-pointer relative"
                        onClick={() => onSelectTicket(ticket)}
                    >
                        {/* Priority Indicator */}
                        <div className={cn("h-2.5 w-2.5 rounded-full shrink-0", getPriorityColor(ticket.priority))} title={`Priority: ${ticket.priority}`} />

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-sm text-slate-900 dark:text-zinc-100 truncate pr-2">
                                    {ticket.title}
                                </span>
                                <span className="text-[10px] font-mono text-slate-400 shrink-0">{timeAgo(ticket.createdAt)}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                <span className="font-mono text-[10px] bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-400">
                                    {ticket.id}
                                </span>
                                {ticket.assigneeId ? (
                                    <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded-md">
                                        <Avatar src={`https://i.pravatar.cc/150?u=${ticket.assigneeId}`} fallback="A" className="h-3.5 w-3.5 ring-1 ring-indigo-200 dark:ring-indigo-800" />
                                        <span className="font-medium">Assigned</span>
                                    </div>
                                ) : (
                                    <span className="flex items-center gap-1 italic text-slate-400">
                                        <UserCog className="h-3 w-3" /> Unassigned
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions (Visible on Hover or Touch) */}
                        <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                            {ticket.status === 'open' ? (
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-8 px-3 text-xs border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300 dark:border-indigo-500/30 dark:hover:bg-indigo-500/30"
                                    onClick={(e) => { e.stopPropagation(); onProcess(ticket, 'forward'); }}
                                >
                                    Process
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                            ) : (
                                <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="h-8 px-3 text-xs"
                                    onClick={(e) => { e.stopPropagation(); onProcess(ticket, 'close'); }}
                                >
                                    Close
                                </Button>
                            )}
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
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
                ))}
            </div>
        )}
      </CardContent>
    </Card>
  );
};
