import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Search } from 'lucide-react';
import { ModalOverlay, Label, Input, Select, Textarea, Button, Badge, Avatar, Switch, cn } from '../../../components/ui';
import { MockService } from '../../../mock';
import { Ticket, User } from '../../../types';

// --- Create Ticket Modal ---
export const CreateTicketModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [customerSearch, setCustomerSearch] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setCustomerSearch('');
      setSelectedUser(null);
      setSearchResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(async () => {
       if (customerSearch.length > 1) {
          const res = await MockService.searchUsers(customerSearch);
          setSearchResults(res);
       } else {
          setSearchResults([]);
       }
    }, 300);
    return () => clearTimeout(timer);
  }, [customerSearch]);

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Create Open Ticket</h2>
        <div className="flex items-center gap-2 mb-4">
           <div className={cn("h-2 rounded-full flex-1 transition-colors", step >= 1 ? "bg-indigo-600" : "bg-slate-200 dark:bg-white/10")} />
           <div className={cn("h-2 rounded-full flex-1 transition-colors", step >= 2 ? "bg-indigo-600" : "bg-slate-200 dark:bg-white/10")} />
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="space-y-2">
                <Label htmlFor="customer-search">Find Customer</Label>
                <div className="relative">
                   <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                   <Input 
                      id="customer-search" 
                      placeholder="Search by name or email..." 
                      className="pl-9"
                      value={customerSearch}
                      onChange={(e) => setCustomerSearch(e.target.value)}
                      autoFocus
                   />
                </div>
             </div>
             <div className="min-h-[200px] border border-slate-100 rounded-md p-2 dark:border-white/10">
                {searchResults.length === 0 && customerSearch.length > 1 && (
                   <p className="text-xs text-slate-500 text-center py-8">No customers found.</p>
                )}
                {searchResults.length === 0 && customerSearch.length <= 1 && (
                   <p className="text-xs text-slate-500 text-center py-8">Start typing to search...</p>
                )}
                <div className="space-y-1">
                   {searchResults.map(user => (
                      <div 
                         key={user.id} 
                         onClick={() => { setSelectedUser(user); setStep(2); }}
                         className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded cursor-pointer transition-colors"
                      >
                         <Avatar fallback={user.name.charAt(0)} className="h-8 w-8 text-xs" />
                         <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                         </div>
                         <Badge variant="outline" className="ml-auto text-[10px]">{user.role}</Badge>
                      </div>
                   ))}
                </div>
             </div>
             <div className="flex justify-end pt-2">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
             </div>
          </div>
        )}

        {step === 2 && selectedUser && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="flex items-center gap-3 bg-indigo-50 p-3 rounded-md dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/30">
                <Avatar fallback={selectedUser.name.charAt(0)} className="h-10 w-10 text-sm bg-indigo-200 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-100" />
                <div>
                   <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedUser.name}</p>
                   <p className="text-xs text-slate-500 dark:text-slate-400">Customer • {selectedUser.email}</p>
                </div>
                <Button size="sm" variant="ghost" className="ml-auto h-6 w-6 p-0" onClick={() => setStep(1)}><ChevronLeft className="h-4 w-4" /></Button>
             </div>

             <div className="space-y-2">
               <Label htmlFor="title">Subject</Label>
               <Input id="title" placeholder="Brief description of the issue" autoFocus />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="priority">Priority</Label>
                 <Select id="priority">
                   <option>Low</option>
                   <option>Medium</option>
                   <option>High</option>
                   <option>Critical</option>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="category">Category</Label>
                 <Select id="category">
                   <option>Technical</option>
                   <option>Billing</option>
                   <option>Feature Request</option>
                 </Select>
               </div>
             </div>
             <div className="space-y-2">
               <Label htmlFor="desc">Description</Label>
               <Textarea id="desc" placeholder="Detailed explanation..." rows={3} />
             </div>
             <div className="flex justify-end gap-2 pt-2">
               <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
               <Button onClick={onClose}>Create Ticket</Button>
             </div>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
};

// --- Config Modal ---
export const ConfigModal = ({ isOpen, onClose, type }: { isOpen: boolean, onClose: () => void, type: 'basic' | 'bridge' }) => {
  const [isAuto, setIsAuto] = useState(false);

  useEffect(() => {
    if (isOpen) setIsAuto(false);
  }, [isOpen]);

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{type === 'basic' ? 'New Configuration' : 'New Config Bridge'}</h2>
        
        <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-3 rounded-md border border-slate-100 dark:border-white/10">
           <div className="space-y-0.5">
              <Label className="text-base">Automatic Configuration</Label>
              <p className="text-xs text-slate-500">Let the system determine optimal settings.</p>
           </div>
           <Switch checked={isAuto} onCheckedChange={setIsAuto} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="config-name">Configuration Name</Label>
          <Input id="config-name" placeholder="e.g. Main Router" />
        </div>
        {type === 'bridge' && (
           <div className="space-y-2">
             <Label htmlFor="interface">Interface</Label>
             <Input id="interface" placeholder="eth0" disabled={isAuto} className={cn(isAuto && "opacity-50")} />
           </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="params">Parameters (JSON)</Label>
          <div className="relative">
             <Textarea 
                id="params" 
                className={cn("font-mono text-xs transition-opacity", isAuto && "opacity-50 cursor-not-allowed")} 
                rows={5} 
                value={isAuto ? "{\n  \"mode\": \"auto\",\n  \"optimization\": true,\n  \"discovery\": \"dynamic\"\n}" : "{\n  \n}"}
                readOnly={isAuto}
             />
             {isAuto && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                   <Badge variant="secondary" className="bg-white/90 shadow-sm dark:bg-black/90 backdrop-blur">Auto-Generated</Badge>
                </div>
             )}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onClose}>Save Config</Button>
        </div>
      </div>
    </ModalOverlay>
  );
};

// --- Process Action Modal ---
export const ProcessActionModal = ({ 
  ticket, 
  isOpen, 
  onClose, 
  onConfirm, 
  defaultAction = 'forward' 
}: { 
  ticket: Ticket | null, 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: (id: string, action: 'in_progress' | 'closed', note: string) => void,
  defaultAction?: 'forward' | 'close'
}) => {
  const [actionType, setActionType] = useState<'forward' | 'close'>(defaultAction);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (isOpen) {
        setActionType(defaultAction);
        setNote('');
    }
  }, [isOpen, defaultAction]);

  if (!ticket) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Process Ticket <span className="text-slate-500 text-base font-normal">#{ticket.id}</span></h2>
        </div>
        
        <div className="flex p-1 bg-slate-100 dark:bg-white/10 rounded-lg">
            <button 
                onClick={() => setActionType('forward')}
                className={cn("flex-1 text-sm font-medium py-1.5 rounded-md transition-all", actionType === 'forward' ? "bg-white shadow-sm text-slate-900 dark:bg-white/20 dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400")}
            >
                Forward / Process
            </button>
            <button 
                onClick={() => setActionType('close')}
                className={cn("flex-1 text-sm font-medium py-1.5 rounded-md transition-all", actionType === 'close' ? "bg-white shadow-sm text-red-600 dark:bg-white/20 dark:text-red-400" : "text-slate-500 hover:text-slate-900 dark:text-slate-400")}
            >
                Close Ticket
            </button>
        </div>

        <div className="space-y-3">
            {actionType === 'forward' ? (
                <>
                    <div className="space-y-2">
                        <Label>Assignee</Label>
                        <Select>
                            <option>Alex Carter (Me)</option>
                            <option>Sarah Jones</option>
                            <option>Technician Pool</option>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Priority Adjustment</Label>
                        <Select defaultValue={ticket.priority}>
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                            <option value="critical">Critical</option>
                        </Select>
                    </div>
                </>
            ) : (
                <div className="space-y-2">
                    <Label>Resolution Code</Label>
                    <Select>
                        <option>Resolved</option>
                        <option>Duplicate</option>
                        <option>Cannot Reproduce</option>
                        <option>Wont Fix</option>
                    </Select>
                </div>
            )}

            <div className="space-y-2">
                <Label>Note / Comment</Label>
                <Textarea 
                    placeholder={actionType === 'forward' ? "Add instructions for the technician..." : "Reason for closing..."}
                    value={note}
                    onChange={e => setNote(e.target.value)}
                />
            </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button 
                variant={actionType === 'close' ? 'destructive' : 'default'}
                onClick={() => onConfirm(ticket.id, actionType === 'forward' ? 'in_progress' : 'closed', note)}
            >
                {actionType === 'forward' ? 'Start Processing' : 'Close Ticket'}
            </Button>
        </div>
      </div>
    </ModalOverlay>
  );
};

// --- Ticket Detail Modal ---
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
  const logsQuery = useQuery({ 
    queryKey: ['logs', ticket?.id], 
    queryFn: MockService.getTicketLogs,
    enabled: !!ticket 
  });

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
              <p className="text-xs text-slate-500 mt-1">Created on {new Date(ticket.createdAt).toLocaleString()}</p>
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