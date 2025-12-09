
import * as React from 'react';
import { useEffect } from 'react';
import { Search } from 'lucide-react';
import { ModalOverlay, Label, Input, Button, Badge, Avatar } from '../../../../components/ui';
import { useTicketStore } from '../../stores/ticketStore';
import { useFiberStore } from '../../stores/fiberStore';
import { CustomerCard } from '../CustomerCard';
import { TicketFormFields } from './TicketFormFields';

export const CreateTicketModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  // Ticket Store for Wizard State
  const { 
      step, 
      setStep, 
      selectUser, 
      selectedUser, 
      formData,
      updateFormData,
      reset: resetTicketStore
  } = useTicketStore();

  // Fiber Store for Search State
  const {
      searchTerm,
      setSearchTerm,
      searchResults,
      isSearching,
      searchCustomers,
      resetSearch
  } = useFiberStore();

  useEffect(() => {
    if (isOpen) {
      resetTicketStore();
      resetSearch();
    }
  }, [isOpen]);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(() => {
       if (isOpen && step === 1) {
           searchCustomers(searchTerm);
       }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, isOpen, step]);

  const handleClose = () => {
      onClose();
      setTimeout(() => {
          resetTicketStore();
          resetSearch();
      }, 200); 
  };

  const handleSelectCustomer = (fiberCustomer: any) => {
      // Map fiber customer to User type expected by ticketStore
      const user = {
          id: fiberCustomer.id,
          name: fiberCustomer.name,
          email: fiberCustomer.user_pppoe,
          role: 'user' as const,
          // Store extra fields for form population
          _address: fiberCustomer.alamat,
          _pppoe: fiberCustomer.user_pppoe,
          _sn: fiberCustomer.onu_sn
      };
      selectUser(user);
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
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          autoFocus
                      />
                    </div>
                </div>
                <div className="min-h-[200px] border border-slate-100 rounded-md p-2 dark:border-white/10">
                    {isSearching && (
                        <div className="text-center py-8 text-xs text-slate-500">Searching...</div>
                    )}
                    {!isSearching && searchResults.length === 0 && searchTerm.length > 1 && (
                      <p className="text-xs text-slate-500 text-center py-8">No customers found.</p>
                    )}
                    {!isSearching && searchResults.length === 0 && searchTerm.length <= 1 && (
                      <p className="text-xs text-slate-500 text-center py-8">Start typing to search...</p>
                    )}
                    <div className="space-y-1">
                      {searchResults.map(customer => (
                          <div 
                            key={customer.id} 
                            onClick={() => handleSelectCustomer(customer)}
                            className="flex items-center gap-3 p-2 hover:bg-slate-50 dark:hover:bg-white/5 rounded cursor-pointer transition-colors"
                          >
                            <Avatar fallback={customer.name.charAt(0)} className="h-8 w-8 text-xs" />
                            <div className="overflow-hidden">
                                <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">{customer.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{customer.user_pppoe} {customer.alamat ? `• ${customer.alamat}` : ''}</p>
                            </div>
                            <Badge variant="outline" className="ml-auto text-[10px] whitespace-nowrap bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50">Fiber</Badge>
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
