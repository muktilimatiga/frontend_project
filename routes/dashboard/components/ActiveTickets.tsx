
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
        case 'critical': return 'bg-red-500 shadow-red-500/50';
        case 'high': return 'bg-orange-500 shadow-orange-500/50';
        case 'medium': return 'bg-blue-500 shadow-blue-500/50';
        case 'low': return 'bg-slate-400 shadow-slate-400/50';
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
    <Card className="md:col-span-3 dark:bg-card dark:border-slate-700/50 flex flex-col shadow-sm overflow-hidden h-[400px]">
      <CardHeader className="pb-0 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/20 py-4 px-5">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">Active Queue</CardTitle>
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-5 font-medium bg-slate-200/50 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {tickets.length}
                </Badge>
            </div>
            {tickets.length > 0 && (
                <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </span>
            )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-0 scrollbar-thin">
        {tickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                <div className="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500/50" />
                </div>
                <p className="text-sm font-medium">All caught up!</p>
            </div>
        ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {tickets.map((ticket) => (
                    <div 
                        key={ticket.id} 
                        className="group flex items-start gap-3 p-4 hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors cursor-pointer relative"
                        onClick={() => onSelectTicket(ticket)}
                    >
                        {/* Priority Indicator */}
                        <div className={cn("mt-1.5 h-2 w-2 rounded-full shadow-sm shrink-0", getPriorityColor(ticket.priority))} title={`Priority: ${ticket.priority}`} />

                        {/* Content */}
                        <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate block">
                                    {ticket.title}
                                </span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                                <span className="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-1 rounded text-slate-600 dark:text-slate-300">
                                    {ticket.id}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {timeAgo(ticket.createdAt)}
                                </span>
                                {ticket.assigneeId ? (
                                    <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                                        <Avatar src={`https://i.pravatar.cc/150?u=${ticket.assigneeId}`} fallback="A" className="h-4 w-4" />
                                        Assigned
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 italic text-slate-400">
                                        <UserCog className="h-3 w-3" /> Unassigned
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 shrink-0">
                            {ticket.status === 'open' ? (
                                <Button 
                                    size="sm" 
                                    variant="outline"
                                    className="h-7 px-2 text-xs border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800 dark:hover:bg-indigo-900/40"
                                    onClick={(e) => { e.stopPropagation(); onProcess(ticket, 'forward'); }}
                                >
                                    Process
                                    <ArrowRight className="ml-1 h-3 w-3" />
                                </Button>
                            ) : (
                                <Button 
                                    size="sm" 
                                    variant="ghost"
                                    className="h-7 px-2 text-xs text-slate-500 hover:text-slate-900"
                                    onClick={(e) => { e.stopPropagation(); onProcess(ticket, 'close'); }}
                                >
                                    Close
                                </Button>
                            )}
                            
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-slate-600">
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
