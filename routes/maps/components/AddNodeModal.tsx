import * as React from 'react';
import { useState, useEffect } from 'react';
import { ModalOverlay, Label, Select, Input, Button } from '../../../components/ui';

interface AddNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: any) => void;
  coords: { lat: number, lng: number };
}

export const AddNodeModal = ({ isOpen, onClose, onConfirm, coords }: AddNodeModalProps) => {
   const [type, setType] = useState('ODP');
   const [name, setName] = useState('');

   useEffect(() => {
      if (isOpen) {
         setType('ODP');
         setName('');
      }
   }, [isOpen]);

   return (
      <ModalOverlay isOpen={isOpen} onClose={onClose}>
         <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add Network Node</h2>
            <div className="text-xs text-slate-500 font-mono p-2 bg-slate-100 dark:bg-white/5 rounded">
               Lat: {coords?.lat.toFixed(5)}, Lng: {coords?.lng.toFixed(5)}
            </div>
            <div className="space-y-2">
               <Label>Node Type</Label>
               <Select value={type} onChange={(e) => setType(e.target.value)}>
                  <option value="ODP">ODP (Optical Distribution Point)</option>
                  <option value="OTC">OTC (Optical Termination Cabinet)</option>
               </Select>
            </div>
            <div className="space-y-2">
               <Label>Node Name/ID</Label>
               <Input placeholder="e.g. ODP-NY-01" value={name} onChange={(e) => setName(e.target.value)} autoFocus />
            </div>
            <div className="flex justify-end gap-2 pt-2">
               <Button variant="outline" onClick={onClose}>Cancel</Button>
               <Button onClick={() => onConfirm({ type, name, ...coords })}>Add Node</Button>
            </div>
         </div>
      </ModalOverlay>
   );
};