import * as React from 'react';
import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { ModalOverlay, Button, Input, Label, cn } from '../../../components/ui';
import { NODE_TYPES } from '../constants'; // Import from constants

interface ImportNodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: string, label: string, imageSrc?: string) => void;
}

export const ImportNodeModal = ({ isOpen, onClose, onSelect }: ImportNodeModalProps) => {
  const [tab, setTab] = useState<'presets' | 'custom' | 'upload'>('presets');
  const [customLabel, setCustomLabel] = useState('');
  const [customType, setCustomType] = useState('server');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomSubmit = () => {
    if (customLabel) {
      onSelect(customType, customLabel);
      setCustomLabel('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onSelect('image', file.name.split('.')[0], ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
       <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Add Node</h2>
            <div className="flex bg-slate-100 dark:bg-white/10 p-1 rounded-lg">
               <button 
                  onClick={() => setTab('presets')}
                  className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", tab === 'presets' ? "bg-white text-slate-900 shadow-sm dark:bg-black dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400")}
               >
                  Presets
               </button>
               <button 
                  onClick={() => setTab('custom')}
                  className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", tab === 'custom' ? "bg-white text-slate-900 shadow-sm dark:bg-black dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400")}
               >
                  Custom
               </button>
               <button 
                  onClick={() => setTab('upload')}
                  className={cn("px-3 py-1 text-xs font-medium rounded-md transition-all", tab === 'upload' ? "bg-white text-slate-900 shadow-sm dark:bg-black dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400")}
               >
                  Upload
               </button>
            </div>
          </div>

          {tab === 'presets' && (
            <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto pr-1">
               {NODE_TYPES.map(item => (
                  <div 
                     key={item.type} 
                     className="flex flex-col items-center justify-center p-3 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-all hover:border-indigo-200 dark:hover:border-indigo-800"
                     onClick={() => onSelect(item.type, item.label)}
                  >
                     <item.icon className="h-6 w-6 mb-2 text-slate-600 dark:text-slate-400" />
                     <span className="text-xs font-medium text-slate-700 dark:text-slate-300 text-center">{item.label}</span>
                  </div>
               ))}
            </div>
          )}

          {tab === 'custom' && (
            <div className="space-y-4 pt-2">
               <div className="space-y-2">
                  <Label>Node Label</Label>
                  <Input 
                    placeholder="e.g. Mainframe-01" 
                    value={customLabel}
                    onChange={(e) => setCustomLabel(e.target.value)}
                    autoFocus
                  />
               </div>
               <div className="space-y-2">
                  <Label>Base Icon Type</Label>
                  <div className="grid grid-cols-4 gap-2">
                     {NODE_TYPES.slice(0, 8).map(item => (
                        <div 
                           key={item.type}
                           className={cn(
                              "flex flex-col items-center p-2 rounded border cursor-pointer transition-all",
                              customType === item.type 
                                ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-400 dark:text-indigo-300" 
                                : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
                           )}
                           onClick={() => setCustomType(item.type)}
                        >
                           <item.icon className="h-4 w-4" />
                        </div>
                     ))}
                  </div>
               </div>
               <Button className="w-full" onClick={handleCustomSubmit} disabled={!customLabel}>
                  Add Custom Node
               </Button>
            </div>
          )}

          {tab === 'upload' && (
             <div className="space-y-6 pt-4 text-center">
                <div 
                  className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl p-8 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                   <Upload className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                   <p className="text-sm font-medium text-slate-900 dark:text-white">Click to upload SVG or Image</p>
                   <p className="text-xs text-slate-500 mt-1">Supports .svg, .png, .jpg</p>
                   <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept=".svg,.png,.jpg,.jpeg" 
                      onChange={handleFileUpload}
                   />
                </div>
                <p className="text-xs text-slate-500">Uploaded images will be used as the node icon.</p>
             </div>
          )}

          <Button variant="outline" className="w-full" onClick={onClose}>Cancel</Button>
       </div>
    </ModalOverlay>
  );
};
