import * as React from 'react';
import { Settings2, Lock, Unlock } from 'lucide-react';
import { Label, Input, Switch } from '../../../components/ui';
import { NODE_TYPES } from '../constants';

interface TopologyPropertiesPanelProps {
  data: {
    label: string;
    iconType: string;
    strokeColor?: string;
    locked?: boolean;
  };
  onUpdate: (updates: Partial<{ label: string; iconType: string; strokeColor: string; locked: boolean }>) => void;
  onClose: () => void;
}

export const TopologyPropertiesPanel = ({ data, onUpdate, onClose }: TopologyPropertiesPanelProps) => {

  return (
    <div className="w-72 bg-white dark:bg-black border-l border-slate-200 dark:border-white/20 flex flex-col h-full animate-in slide-in-from-right duration-300 shadow-xl z-10 absolute right-0 top-0 bottom-0">
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

        {/* Lock State (Simulated for React Flow via drag handling or data) */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
              {data.locked ? <Lock className="h-4 w-4 text-orange-500" /> : <Unlock className="h-4 w-4 text-slate-400" />}
              <Label className="cursor-pointer" onClick={() => onUpdate({ locked: !data.locked })}>Lock Position</Label>
           </div>
           <Switch checked={!!data.locked} onCheckedChange={(c) => onUpdate({ locked: c })} />
        </div>

        {/* Color */}
        <div className="space-y-2">
          <Label>Theme Color</Label>
          <div className="flex items-center gap-2">
             <input 
                type="color" 
                value={data.strokeColor || '#000000'} 
                onChange={(e) => onUpdate({ strokeColor: e.target.value })}
                className="h-8 w-full cursor-pointer rounded border border-slate-200 dark:border-white/10 bg-transparent"
             />
          </div>
        </div>

        {/* Icon Type */}
        <div className="space-y-2">
          <Label>Change Icon</Label>
          <div className="grid grid-cols-4 gap-2">
             {NODE_TYPES.slice(0, 16).map(item => (
                <div 
                   key={item.type}
                   className={`flex items-center justify-center p-2 rounded border cursor-pointer ${data.iconType === item.type ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'}`}
                   title={item.label}
                   onClick={() => onUpdate({ iconType: item.type })}
                >
                   <item.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};