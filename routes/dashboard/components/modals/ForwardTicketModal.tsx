
import * as React from 'react';
import { useState } from 'react';
import { X } from 'lucide-react';
import { ModalOverlay, Label, Input, Textarea, Button, Select } from '../../../../components/ui';
import { Ticket } from '../../../../types';

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
