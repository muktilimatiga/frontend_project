
import * as React from 'react';
import { ModalOverlay, Badge, Button, Avatar } from '../../../../components/ui';
import { Ticket } from '../../../../types';
import { useTicketLogs } from '../../../../hooks/useQueries';

const StatusBadge = ({ status }: { status: Ticket['status'] }) => {
    const styles = {
      open: 'secondary',
      in_progress: 'warning',
      resolved: 'success',
      closed: 'outline'
    } as const;
    const label = status.replace('_', ' ');
    return <Badge variant={styles[status] as any} className="capitalize">{label}</Badge>;
};

export const TicketDetailModal = ({ ticket, isOpen, onClose }: { ticket: Ticket | null, isOpen: boolean, onClose: () => void }) => {
  // Use custom hook for logs
  const logsQuery = useTicketLogs(ticket?.id);

  if (!ticket) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} className="max-w-2xl">
      <div className="flex flex-col h-[80vh] md:h-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 mb-4 dark:border-white/10">
           <div>
              <div className="flex items-center gap-2 mb-1">
                 <Badge variant="outline">{ticket.id}</Badge>
                 <StatusBadge status={ticket.status} />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{ticket.title}</h2>
              <p className="text-xs text-slate-500 mt-1">Created on {new Date(ticket.createdAt).toLocaleDateString()}</p>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
           {/* User Card */}
           <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10">
              <Avatar fallback={ticket.assigneeId ? 'AC' : 'U'} src={ticket.assigneeId ? 'https://i.pravatar.cc/150?u=alex' : undefined} className="h-12 w-12" />
              <div className="flex-1">
                 <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{ticket.assigneeId ? 'Alex Carter' : 'Unassigned'}</h4>
                 <p className="text-xs text-slate-500">{ticket.assigneeId ? 'Senior Administrator' : 'Waiting for assignment'}</p>
              </div>
              <Button variant="outline" size="sm">View Profile</Button>
           </div>

           {/* Activity Logs */}
           <div>
              <h3 className="text-sm font-semibold mb-3 text-slate-900 dark:text-slate-200">Activity Log</h3>
              <div className="space-y-4">
                 {logsQuery.isLoading ? (
                    <div className="text-center text-xs text-slate-500">Loading logs...</div>
                 ) : (
                    logsQuery.data?.map((log, i) => (
                       <div key={i} className="flex gap-3 text-sm">
                          <div className="flex flex-col items-center">
                             <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                                {log.userName.charAt(0)}
                             </div>
                             {i < (logsQuery.data?.length || 0) - 1 && <div className="w-px h-full bg-slate-200 my-1 dark:bg-white/10" />}
                          </div>
                          <div className="pb-4">
                             <div className="flex items-center gap-2">
                                <span className="font-semibold text-slate-900 dark:text-slate-200">{log.userName}</span>
                                <span className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                             </div>
                             <p className="text-slate-600 dark:text-slate-400 mt-1">{log.message}</p>
                          </div>
                       </div>
                    ))
                 )}
              </div>
           </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-100 pt-4 mt-4 flex justify-end gap-2 dark:border-white/10">
           <Button variant="outline" onClick={onClose}>Close</Button>
           <Button>Add Note</Button>
        </div>
      </div>
    </ModalOverlay>
  );
};
