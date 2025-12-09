
import * as React from 'react';
import { Label, Input, Select, Textarea } from '../../../../components/ui';

export interface TicketFormData {
  name: string;
  address: string;
  contact: string;
  noInternet: string;
  ticketRef: string;
  priority: string;
  type: string;
  description: string;
}

interface TicketFormFieldsProps {
    data: TicketFormData;
    onChange?: (updates: Partial<TicketFormData>) => void;
    readOnly?: boolean;
}

export const TicketFormFields = ({ 
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
