
import * as React from 'react';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ModalOverlay, Label, Input, Textarea, Button, Avatar } from '../../../../components/ui';
import { Ticket } from '../../../../types';
import { TicketFormData } from './TicketFormFields';
import { useAppStore } from '../../../../store';

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
    const { user } = useAppStore();
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

             <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-white dark:bg-zinc-900 flex items-center justify-between sticky bottom-0 z-10">
                 <div className="flex items-center gap-2">
                     <span className="text-xs text-slate-500">Operator:</span>
                     <Avatar src={user?.avatarUrl} fallback={user?.name?.charAt(0)} className="h-6 w-6" />
                     <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 max-w-[120px] truncate">{user?.name}</span>
                 </div>
                 <div className="flex gap-2">
                     <Button variant="outline" onClick={onClose}>Cancel</Button>
                     <Button onClick={() => onConfirm(ticket.id, actionClose)} className="bg-red-600 hover:bg-red-700 text-white dark:text-white">Submit & Close</Button>
                 </div>
             </div>
        </ModalOverlay>
    );
};
