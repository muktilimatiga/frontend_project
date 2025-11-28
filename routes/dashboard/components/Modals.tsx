
import * as React from 'react';
import { useState, useEffect } from 'react';
import { ChevronLeft, Search, Lock, Unlock, X, RefreshCw, Cloud } from 'lucide-react';
import { ModalOverlay, Label, Input, Select, Textarea, Button, Badge, Avatar, Switch, cn } from '../../../components/ui';
import { MockService } from '../../../mock';
import { Ticket, User } from '../../../types';
import { useTicketStore } from '../stores/ticketStore';
import { useTicketLogs } from '../../../hooks/useQueries';
import { CustomerCard } from './CustomerCard';
import { supabase } from '../../../lib/supabaseClient';

// --- Types ---
interface TicketFormData {
  name: string;
  address: string;
  contact: string;
  noInternet: string;
  ticketRef: string;
  priority: string;
  type: string;
  description: string;
}

// --- Reusable Pure Components ---

interface TicketFormFieldsProps {
    data: TicketFormData;
    onChange?: (updates: Partial<TicketFormData>) => void;
    readOnly?: boolean;
}

const TicketFormFields = ({ 
    data, 
    onChange, 
    readOnly = false 
}: TicketFormFieldsProps) => {
    
    // Helper to safely call onChange if provided
    const handleChange = (field: keyof TicketFormData, value: string) => {
        if (onChange) {
            onChange({ [field]: value });
        }
    };

    return (
        <div className="p-6 space-y-5">
            <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                    id="name" 
                    value={data.name} 
                    onChange={e => handleChange('name', e.target.value)} 
                    className="bg-slate-50/50 dark:bg-black/20"
                    readOnly={readOnly}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="address">Installation Address</Label>
                <Input 
                    id="address" 
                    value={data.address} 
                    onChange={e => handleChange('address', e.target.value)} 
                    className="bg-slate-50/50 dark:bg-black/20"
                    readOnly={readOnly}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="contact">Contact Number</Label>
                    <Input 
                        id="contact" 
                        value={data.contact} 
                        onChange={e => handleChange('contact', e.target.value)} 
                        className="bg-slate-50/50 dark:bg-black/20"
                        readOnly={readOnly}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="noInternet">No Internet ID</Label>
                    <Input 
                        id="noInternet" 
                        value={data.noInternet} 
                        onChange={e => handleChange('noInternet', e.target.value)} 
                        className="bg-slate-50/50 dark:bg-black/20"
                        readOnly={readOnly}
                    />
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="ticketRef">Reference</Label>
                    <Input 
                        id="ticketRef" 
                        value={data.ticketRef} 
                        readOnly 
                        className="bg-slate-100 dark:bg-white/10 text-slate-500 cursor-not-allowed font-mono"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select 
                        id="priority" 
                        value={data.priority}
                        onChange={e => handleChange('priority', e.target.value)}
                        disabled={readOnly}
                    >
                        <option value="">Select...</option>
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                        id="type"
                        value={data.type}
                        onChange={e => handleChange('type', e.target.value)}
                        disabled={readOnly}
                    >
                        <option value="">Select...</option>
                        <option value="Technical">Technical</option>
                        <option value="Billing">Billing</option>
                        <option value="Sales">Sales</option>
                        <option value="Complaint">Complaint</option>
                    </Select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Problem Description</Label>
                <Textarea 
                    id="description" 
                    rows={4} 
                    className="resize-none bg-slate-50/50 dark:bg-black/20 focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="Describe the customer's issue in detail..."
                    value={data.description}
                    onChange={e => handleChange('description', e.target.value)}
                    readOnly={readOnly}
                />
            </div>
        </div>
    );
};

// --- Create Ticket Modal (Zustand + Props) ---
export const CreateTicketModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { 
      step, 
      setStep, 
      searchQuery, 
      setSearchQuery, 
      searchResults, 
      searchCustomers, 
      selectUser, 
      selectedUser, 
      formData,
      updateFormData,
      reset,
      isSearching 
  } = useTicketStore();

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(() => {
       searchCustomers(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleClose = () => {
      onClose();
      setTimeout(reset, 200); 
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={handleClose} className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        
        {step === 1 && (
           <div className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Create Open Ticket</h2>
              <div className="flex items-center gap-2 mb-4">
                  <div className="h-2 rounded-full flex-1 bg-indigo-600" />
                  <div className="h-2 rounded-full flex-1 bg-slate-200 dark:bg-white/10" />
              </div>

              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-2">
                    <Label htmlFor="customer-search">Find Customer</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input 
                          id="customer-search" 
                          placeholder="Search by name, PPPoE or address..." 
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          autoFocus
                      />
                    </div>
                </div>
                <div className="min-h-[200px] border border-slate-100 rounded-md p-2 dark:border-white/10">
                    {isSearching && (
                        <div className="text-center py-8 text-xs text-slate-500">Searching...</div>
                    )}
                    {!isSearching && searchResults.length === 0 && searchQuery.length > 1 && (
                      <p className="text-xs text-slate-500 text-center py-8">No customers found.</p>
                    )}
                    {!isSearching && searchResults.length === 0 && searchQuery.length <= 1 && (
                      <p className="text-xs text-slate-500 text-center py-8">Start typing to search...</p>
                    )}
                    <div className="space-y-1">
                      {searchResults.map(user => (
                          <div 
                            key={user.id} 
                            onClick={() => selectUser(user)}
                            className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded cursor-pointer transition-colors"
                          >
                            <Avatar fallback={user.name.charAt(0)} className="h-8 w-8 text-xs" />
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">{user.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email} {(user as any)._address ? `• ${(user as any)._address}` : ''}</p>
                            </div>
                            <Badge variant="outline" className="ml-auto text-[10px] whitespace-nowrap">{user.role}</Badge>
                          </div>
                      ))}
                    </div>
                </div>
                <div className="flex justify-end pt-2">
                    <Button variant="outline" onClick={handleClose}>Cancel</Button>
                </div>
              </div>
           </div>
        )}

        {step === 2 && selectedUser && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
             <CustomerCard user={selectedUser} onChangeUser={() => setStep(1)} />
             <TicketFormFields data={formData} onChange={updateFormData} />
          </div>
        )}
      </div>

      {step === 2 && selectedUser && (
         <div className="flex justify-end gap-2 p-6 pt-4 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-zinc-900 sticky bottom-0 z-10 shadow-lg">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-none">Create Ticket</Button>
         </div>
      )}
    </ModalOverlay>
  );
};

// --- Process Action Modal (Zustand + Props) ---
export const ProcessActionModal = ({ 
  ticket, 
  isOpen, 
  onClose, 
  onConfirm
}: { 
  ticket: Ticket | null, 
  isOpen: boolean, 
  onClose: () => void, 
  onConfirm: (id: string, action: 'in_progress' | 'closed', note: string) => void,
}) => {
  const { initializeFromTicket, selectedUser, formData, updateFormData, reset } = useTicketStore();

  useEffect(() => {
    if (isOpen && ticket) {
        initializeFromTicket(ticket);
    } else {
        reset();
    }
  }, [isOpen, ticket]);

  const handleClose = () => {
      onClose();
      setTimeout(reset, 200);
  };

  if (!ticket) return null;

  return (
    <ModalOverlay isOpen={isOpen} onClose={handleClose} hideCloseButton={true} className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
             <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50">
                 <div className="flex items-center gap-2">
                     <Badge variant="outline" className="bg-white dark:bg-zinc-800">{ticket.id}</Badge>
                     <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Process Ticket</h2>
                 </div>
                 <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8"><X className="h-4 w-4" /></Button>
             </div>

             {selectedUser && (
                 <CustomerCard user={selectedUser} />
             )}

             <TicketFormFields data={formData} onChange={updateFormData} />
        </div>

        <div className="flex justify-between items-center p-6 pt-4 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-zinc-900 sticky bottom-0 z-10 shadow-lg">
            <div className="flex gap-2">
            </div>
            <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <Button 
                    onClick={() => onConfirm(ticket.id, 'in_progress', `Processed: ${formData.description}`)} 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 dark:shadow-none"
                >
                    Update & Process
                </Button>
            </div>
        </div>
    </ModalOverlay>
  );
};

// --- Close Ticket Modal (Read-Only Fields) ---
export const CloseTicketModal = ({
    ticket,
    isOpen,
    onClose,
    onConfirm
}: {
    ticket: Ticket | null,
    isOpen: boolean,
    onClose: () => void,
    onConfirm: (id: string, note: string) => void
}) => {
    const [actionClose, setActionClose] = useState('');
    const [viewData, setViewData] = useState<TicketFormData>({
        name: 'NURYANTI',
        address: 'DSN. KRAJAN, 02/03, NGENTRONG, CAMPURDARAT',
        description: ticket?.title || 'Mas minta tolong ganti kata sandi',
        contact: '',
        noInternet: 'gpon-onu_1/1/6:62',
        ticketRef: ticket?.id || '',
        priority: ticket?.priority || '',
        type: 'Technical'
    });
    
    useEffect(() => {
        if (ticket) {
            setViewData(prev => ({ ...prev, description: ticket.title, ticketRef: ticket.id, priority: ticket.priority }));
        }
    }, [ticket]);

    if (!ticket) return null;

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose} hideCloseButton={true} className="max-w-xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
             <div className="p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
                 <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Close Ticket</h2>
                 <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8"><X className="h-4 w-4" /></Button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                 <div className="space-y-2">
                     <Label className="text-xs text-slate-500">Name</Label>
                     <Input value={viewData.name} readOnly className="bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-300" />
                 </div>
                 <div className="space-y-2">
                     <Label className="text-xs text-slate-500">Address</Label>
                     <Input value={viewData.address} readOnly className="bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-300" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label className="text-xs text-slate-500">Description</Label>
                         <Textarea value={viewData.description} readOnly className="bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-300 min-h-[80px] resize-none" />
                     </div>
                     <div className="space-y-2">
                         <Label className="text-xs text-slate-500">Last Action</Label>
                         <Textarea value="cek" readOnly className="bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-300 min-h-[80px] resize-none" />
                     </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label className="text-xs text-slate-500">ONU index</Label>
                         <Input value={viewData.noInternet} readOnly className="bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-300" />
                     </div>
                     <div className="space-y-2">
                         <Label className="text-xs text-slate-500">ONU SN</Label>
                         <Input value="ZTEGA6DD7279" readOnly className="bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-300" />
                     </div>
                 </div>
                 
                 <div className="space-y-2 pt-2">
                     <Label className="text-sm font-semibold text-slate-700 dark:text-slate-200">Action Close</Label>
                     <Textarea 
                        value={actionClose} 
                        onChange={(e) => setActionClose(e.target.value)} 
                        className="min-h-[100px] border-slate-300 dark:border-zinc-700"
                        placeholder="Detail resolution notes..."
                     />
                 </div>
             </div>

             <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-zinc-900 flex justify-end gap-2 sticky bottom-0 z-10">
                 <Button variant="outline" onClick={onClose}>Cancel</Button>
                 <Button onClick={() => onConfirm(ticket.id, actionClose)} className="bg-red-600 hover:bg-red-700 text-white dark:text-white">Submit & Close</Button>
             </div>
        </ModalOverlay>
    );
};

// --- Forward Ticket (Technician) Modal ---
export const ForwardTicketModal = ({
    ticket,
    isOpen,
    onClose,
    onConfirm
}: {
    ticket: Ticket | null,
    isOpen: boolean,
    onClose: () => void,
    onConfirm: (id: string, note: string) => void
}) => {
    const mockData = {
        name: 'AMINAH AGUSTINA',
        address: 'DSN DADAPAN RT 02/RW 02 DS BOYOLANGU KEC BOYOLANGU',
        description: ticket?.title || 'minta memperpendek jaringan',
        lastAction: 'cek',
        onuIndex: 'gpon-onu_1/1/6:62',
        onuSn: 'ZTEGC84A09F0'
    };

    const [formData, setFormData] = useState({
        serviceImpact: '',
        rootCause: '',
        networkImpact: '',
        severity: 'LOW',
        pic: '',
        recommendedAction: ''
    });

    if (!ticket) return null;

    return (
        <ModalOverlay isOpen={isOpen} onClose={onClose} hideCloseButton={true} className="max-w-xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
             <div className="p-4 border-b border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
                 <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Forward Ticket</h2>
                 <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8"><X className="h-4 w-4" /></Button>
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-4">
                 <div className="space-y-2">
                     <Label className="text-xs text-slate-500">Name</Label>
                     <Input value={mockData.name} readOnly className="bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-300" />
                 </div>
                 <div className="space-y-2">
                     <Label className="text-xs text-slate-500">Address</Label>
                     <Input value={mockData.address} readOnly className="bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-300" />
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label className="text-xs text-slate-500">Description</Label>
                         <Input value={mockData.description} readOnly className="bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-300" />
                     </div>
                     <div className="space-y-2">
                         <Label className="text-xs text-slate-500">Last Action</Label>
                         <Input value={mockData.lastAction} readOnly className="bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-300" />
                     </div>
                 </div>

                 <div className="space-y-2">
                     <Label className="text-xs text-slate-500">Service Impact/Desc</Label>
                     <Input value={formData.serviceImpact} onChange={e => setFormData({...formData, serviceImpact: e.target.value})} />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label className="text-xs text-slate-500">Root Cause</Label>
                         <Input value={formData.rootCause} onChange={e => setFormData({...formData, rootCause: e.target.value})} />
                     </div>
                     <div className="space-y-2">
                         <Label className="text-xs text-slate-500">Network Impact</Label>
                         <Input value={formData.networkImpact} onChange={e => setFormData({...formData, networkImpact: e.target.value})} />
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label className="text-xs text-slate-500">ONU index</Label>
                         <Input value={mockData.onuIndex} readOnly className="bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-300" />
                     </div>
                     <div className="space-y-2">
                         <Label className="text-xs text-slate-500">ONU SN</Label>
                         <Input value={mockData.onuSn} readOnly className="bg-slate-50 dark:bg-zinc-900/50 text-slate-600 dark:text-slate-300" />
                     </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                         <Label className="text-xs text-slate-500">Severity</Label>
                         <Select value={formData.severity} onChange={e => setFormData({...formData, severity: e.target.value})}>
                            <option value="LOW">LOW</option>
                            <option value="MEDIUM">MEDIUM</option>
                            <option value="HIGH">HIGH</option>
                         </Select>
                     </div>
                     <div className="space-y-2">
                         <Label className="text-xs text-slate-500">Person In Charge</Label>
                         <Select value={formData.pic} onChange={e => setFormData({...formData, pic: e.target.value})}>
                            <option value="">--Choose One--</option>
                            <option value="tech1">Technician A</option>
                            <option value="tech2">Technician B</option>
                            <option value="tech3">Technician C</option>
                         </Select>
                     </div>
                 </div>

                 <div className="space-y-2">
                     <Label className="text-xs text-slate-500">Recommended Action</Label>
                     <Textarea 
                        value={formData.recommendedAction} 
                        onChange={(e) => setFormData({...formData, recommendedAction: e.target.value})} 
                        className="min-h-[80px]"
                     />
                 </div>
             </div>

             <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-zinc-900 flex justify-end gap-2 sticky bottom-0 z-10">
                 <Button variant="outline" onClick={onClose}>Cancel</Button>
                 <Button onClick={() => onConfirm(ticket.id, formData.recommendedAction)} className="bg-indigo-600 hover:bg-indigo-700 text-white">Forward to Tech</Button>
             </div>
        </ModalOverlay>
    );
};


// --- Config Modal ---
export const ConfigModal = ({ isOpen, onClose, type }: { isOpen: boolean, onClose: () => void, type: 'basic' | 'bridge' }) => {
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [isAutoLoading, setIsAutoLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const [formData, setFormData] = useState({
     olt: 'OLT-01',
     name: '',
     address: '',
     pppoeUser: '',
     pppoePass: '',
     package: '100mbps',
     ethLock: false,
     interface: 'eth1'
  });

  // Reset on open
  useEffect(() => {
     if(isOpen) {
        setMode('manual');
        setSearchTerm('');
        setSearchResults([]);
        setFormData({
            olt: 'OLT-01',
            name: '',
            address: '',
            pppoeUser: '',
            pppoePass: '',
            package: '100mbps',
            ethLock: false,
            interface: 'eth1'
        });
     }
  }, [isOpen]);

  // Search Logic (Supabase)
  useEffect(() => {
     const timer = setTimeout(async () => {
        if (mode === 'manual' && searchTerm.length > 1) {
           setIsSearching(true);
           try {
               const { data } = await supabase
                   .from('data_fiber')
                   .select('*')
                   .or(`name.ilike.%${searchTerm}%,user_pppoe.ilike.%${searchTerm}%`)
                   .limit(5);
               
               if (data) {
                   setSearchResults(data);
               } else {
                   setSearchResults([]);
               }
           } catch (e) {
               console.error(e);
               setSearchResults([]);
           } finally {
               setIsSearching(false);
           }
        } else {
           setSearchResults([]);
        }
     }, 400);
     return () => clearTimeout(timer);
  }, [searchTerm, mode]);

  const handleSelectUser = (user: any) => {
     setFormData(prev => ({
        ...prev,
        name: user.name || '',
        address: user.alamat || '',
        pppoeUser: user.user_pppoe || '',
        pppoePass: user.pppoe_password || '', // If available in schema
        ethLock: false
     }));
     setSearchTerm('');
     setSearchResults([]);
  };

  const handleAutoFetch = () => {
      setIsAutoLoading(true);
      // Simulate API Fetch
      setTimeout(() => {
          setFormData({
              olt: 'OLT-01',
              name: 'AUTO SUBSCRIBER ' + Math.floor(Math.random() * 1000),
              address: 'FETCHED FROM CRM API\nREGION WEST-JAVA',
              pppoeUser: `user_${Date.now().toString().substr(-6)}`,
              pppoePass: '123456',
              package: '100mbps',
              ethLock: false,
              interface: 'eth1'
          });
          setIsAutoLoading(false);
      }, 1500);
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="space-y-5">
         <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
               {type === 'basic' ? 'New Service Configuration' : 'New Bridge Configuration'}
            </h2>
            <div className="flex items-center gap-2">
                <Label className="text-xs cursor-pointer text-slate-500" onClick={() => setMode(m => m === 'manual' ? 'auto' : 'manual')}>
                    {mode === 'manual' ? 'Manual Entry' : 'Auto Provision'}
                </Label>
                <Switch checked={mode === 'auto'} onCheckedChange={(c) => { setMode(c ? 'auto' : 'manual'); if(c) handleAutoFetch(); }} />
            </div>
         </div>

         {/* Conditional Search or Fetch Section */}
         {mode === 'manual' ? (
             <div className="space-y-2 relative">
                <Label>Import from CRM (Manual)</Label>
                <div className="relative">
                   <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                   <Input 
                      placeholder="Search subscriber by name or ID..." 
                      className="pl-9"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      autoFocus
                   />
                </div>
                {/* Dropdown Results */}
                {searchResults.length > 0 && (
                   <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                      {searchResults.map(u => (
                         <div 
                            key={u.id || u.user_pppoe}
                            className="p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer flex items-center gap-2 border-b border-slate-50 dark:border-white/5 last:border-0"
                            onClick={() => handleSelectUser(u)}
                         >
                            <Avatar fallback={u.name?.charAt(0) || 'U'} className="h-8 w-8 text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" />
                            <div className="overflow-hidden">
                               <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{u.name}</p>
                               <p className="text-xs text-slate-500 truncate">{u.user_pppoe}</p>
                            </div>
                         </div>
                      ))}
                   </div>
                )}
             </div>
         ) : (
             <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                        <Cloud className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">External CRM</p>
                        <p className="text-xs text-indigo-700 dark:text-indigo-400">Fetching pending configurations...</p>
                    </div>
                </div>
                <Button size="sm" variant="ghost" onClick={handleAutoFetch} disabled={isAutoLoading} className="hover:bg-indigo-200 dark:hover:bg-indigo-800">
                    <RefreshCw className={cn("h-4 w-4", isAutoLoading && "animate-spin")} />
                </Button>
            </div>
         )}

         <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
               <Label>OLT Device</Label>
               <Select 
                  value={formData.olt} 
                  onChange={e => setFormData({...formData, olt: e.target.value})}
               >
                  <option value="OLT-01">Huawei MA5608T - HQ</option>
                  <option value="OLT-02">ZTE C320 - Branch A</option>
                  <option value="OLT-03">Nokia 7360 - North</option>
               </Select>
            </div>
            <div className="space-y-2">
               <Label>Service Package</Label>
               <Select 
                  value={formData.package} 
                  onChange={e => setFormData({...formData, package: e.target.value})}
               >
                  <option value="50mbps">Home Basic (50 Mbps)</option>
                  <option value="100mbps">Home Stream (100 Mbps)</option>
                  <option value="300mbps">Gamer Pro (300 Mbps)</option>
                  <option value="1gbps">Gigabit Business</option>
               </Select>
            </div>
         </div>

         <div className="space-y-2">
            <Label>Subscriber Name</Label>
            <Input 
               value={formData.name} 
               onChange={e => setFormData({...formData, name: e.target.value})}
               placeholder="Full Name"
            />
         </div>

         <div className="space-y-2">
            <Label>Installation Address</Label>
            <Textarea 
               value={formData.address} 
               onChange={e => setFormData({...formData, address: e.target.value})}
               placeholder="Street address, unit, city..."
               className="min-h-[60px]"
            />
         </div>

         <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-white/5 p-4 rounded-lg border border-slate-100 dark:border-white/10">
            <div className="space-y-2">
               <Label>PPPoE Username</Label>
               <Input 
                  value={formData.pppoeUser} 
                  onChange={e => setFormData({...formData, pppoeUser: e.target.value})}
                  placeholder="username"
               />
            </div>
            <div className="space-y-2">
               <Label>PPPoE Password</Label>
               <Input 
                  type="password"
                  value={formData.pppoePass} 
                  onChange={e => setFormData({...formData, pppoePass: e.target.value})}
                  placeholder="••••••"
               />
            </div>
         </div>

         {type === 'bridge' && (
             <div className="space-y-2">
               <Label>Bridge Interface</Label>
               <Input 
                  value={formData.interface}
                  onChange={e => setFormData({...formData, interface: e.target.value})}
                  placeholder="e.g. eth1, nas0_1"
               />
             </div>
         )}

         <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
               <div className={cn("p-2 rounded-full", formData.ethLock ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-slate-100 text-slate-500 dark:bg-white/10")}>
                  {formData.ethLock ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
               </div>
               <div className="space-y-0.5">
                  <Label className="cursor-pointer" onClick={() => setFormData({...formData, ethLock: !formData.ethLock})}>Ethernet Port Lock</Label>
                  <p className="text-xs text-slate-500">Restrict port access to specific MAC</p>
               </div>
            </div>
            <Switch 
               checked={formData.ethLock} 
               onCheckedChange={c => setFormData({...formData, ethLock: c})} 
            />
         </div>

         <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => { console.log(formData); onClose(); }}>
               {type === 'basic' ? 'Provision Service' : 'Configure Bridge'}
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
