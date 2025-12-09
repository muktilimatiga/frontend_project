
import * as React from 'react';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { ModalOverlay, Button, Badge } from '../../../../components/ui';
import { useTicketStore } from '../../stores/ticketStore';
import { CustomerCard } from '../CustomerCard';
import { TicketFormFields } from './TicketFormFields';
import { Ticket } from '../../../../types';

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
