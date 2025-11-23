import * as React from 'react';
import { useRef } from 'react';
import { Settings2, Lock, Unlock, Upload } from 'lucide-react';
import { Label, Input, Button, Switch, cn } from '../../../components/ui';
import { NODE_TYPES } from '../constants';

interface TopologyPropertiesPanelProps {
  data: {
    label: string;
    locked: boolean;
    strokeColor: string;
  };
  onUpdate: (updates: Partial<{ label: string; locked: boolean; strokeColor: string; iconType: string; customImage: string }>) => void;
  onClose: () => void;
}

export const TopologyPropertiesPanel = ({ data, onUpdate, onClose }: TopologyPropertiesPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onUpdate({ customImage: ev.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-72 bg-white dark:bg-black border-l border-slate-200 dark:border-white/20 flex flex-col h-full animate-in slide-in-from-right duration-300 shadow-xl z-10">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/10">
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-slate-500" />
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Node Properties</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">✕</button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        {/* Label */}
        <div className="space-y-2">
          <Label>Label</Label>
          <Input 
            value={data.label} 
            onChange={(e) => onUpdate({ label: e.target.value })} 
          />
        </div>

        {/* Lock State */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
              {data.locked ? <Lock className="h-4 w-4 text-orange-500" /> : <Unlock className="h-4 w-4 text-slate-400" />}
              <Label className="cursor-pointer" onClick={() => onUpdate({ locked: !data.locked })}>Lock Position</Label>
           </div>
           <Switch checked={data.locked} onCheckedChange={(c) => onUpdate({ locked: c })} />
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label>Theme Color</Label>
          <div className="flex items-center gap-2">
             <input 
                type="color" 
                value={data.strokeColor} 
                onChange={(e) => onUpdate({ strokeColor: e.target.value })}
                className="h-8 w-full cursor-pointer rounded border border-slate-200 dark:border-white/10 bg-transparent"
             />
          </div>
        </div>

        {/* Icon Type */}
        <div className="space-y-2">
          <Label>Change Icon</Label>
          <div className="grid grid-cols-4 gap-2">
             {NODE_TYPES.slice(0, 12).map(item => (
                <div 
                   key={item.type}
                   className="flex items-center justify-center p-2 rounded border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                   title={item.label}
                   onClick={() => onUpdate({ iconType: item.type })}
                >
                   <item.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
             ))}
          </div>
        </div>

        {/* Custom Upload */}
        <div className="space-y-2">
           <Label>Custom Image</Label>
           <Button variant="outline" className="w-full text-xs" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-3 w-3" /> Upload New Icon
           </Button>
           <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".svg,.png,.jpg,.jpeg" 
              onChange={handleFileUpload}
           />
        </div>
      </div>
    </div>
  );
};
