import * as React from 'react';
import { Settings2, Lock, Unlock, Activity, Type, Layers, Trash2 } from 'lucide-react';
import { Label, Input, Switch, Button, Select, Separator } from '../../../components/ui';
import { NODE_TYPES } from '../constants';

interface TopologyPropertiesPanelProps {
  type: 'node' | 'edge';
  data: any;
  onUpdate: (updates: any) => void;
  onClose: () => void;
  onDelete?: () => void;
  readOnly?: boolean;
}

export const TopologyPropertiesPanel = ({ type, data, onUpdate, onClose, onDelete, readOnly = false }: TopologyPropertiesPanelProps) => {

  return (
    <div className="w-72 bg-white dark:bg-black border-l border-slate-200 dark:border-white/20 flex flex-col h-full animate-in slide-in-from-right duration-300 shadow-xl z-20 absolute right-0 top-0 bottom-0 pointer-events-auto">
      <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-slate-500" />
          <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
            {type === 'node' ? 'Node Properties' : 'Connection Style'}
          </h3>
          {readOnly && <span className="text-[10px] bg-slate-100 dark:bg-white/10 px-1.5 py-0.5 rounded text-slate-500">Read-Only</span>}
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">✕</button>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto">
        
        {/* --- NODE PROPERTIES --- */}
        {type === 'node' && (
          <>
            <div className="space-y-3">
              <Label>Label</Label>
              <Input 
                value={data.label || ''} 
                onChange={(e) => onUpdate({ label: e.target.value })} 
                placeholder="Node Name"
                readOnly={readOnly}
                disabled={readOnly}
              />
              <div className="flex items-center justify-between pt-1">
                 <span className="text-xs text-slate-500 flex items-center gap-1"><Type className="h-3 w-3" /> Text Wrap</span>
                 <Switch checked={!!data.wrapText} onCheckedChange={(c) => onUpdate({ wrapText: c })} disabled={readOnly} />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
               <Label>Appearance</Label>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-500 mb-1.5 block">Icon Color</span>
                    <div className="flex items-center gap-2">
                      <input 
                          type="color" 
                          value={data.strokeColor || '#000000'} 
                          onChange={(e) => onUpdate({ strokeColor: e.target.value })}
                          className="h-8 w-full cursor-pointer rounded border border-slate-200 dark:border-white/10 bg-transparent disabled:opacity-50"
                          disabled={readOnly}
                      />
                    </div>
                  </div>
                  <div>
                     <span className="text-xs text-slate-500 mb-1.5 block">Status</span>
                     <Select 
                        value={data.status || 'none'} 
                        onChange={(e) => onUpdate({ status: e.target.value })}
                        disabled={readOnly}
                     >
                        <option value="none">None</option>
                        <option value="active">Active (Green)</option>
                        <option value="warning">Warning (Orange)</option>
                        <option value="error">Error (Red)</option>
                     </Select>
                  </div>
               </div>
            </div>

            <Separator />

            <div className="space-y-3">
               <Label>Layout & Ordering</Label>
               
               <div className="space-y-2">
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Layers className="h-3 w-3" /> Layer Order (Z-Index)</span>
                  <Input 
                     type="number" 
                     value={data.zIndex || 0} 
                     onChange={(e) => onUpdate({ zIndex: parseInt(e.target.value) })}
                     readOnly={readOnly}
                     disabled={readOnly}
                  />
               </div>

               <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-2 rounded-md border border-slate-100 dark:border-white/5 mt-2">
                  <div className="flex items-center gap-2">
                      {data.locked ? <Lock className="h-4 w-4 text-orange-500" /> : <Unlock className="h-4 w-4 text-slate-400" />}
                      <span className="text-sm">Lock Position</span>
                  </div>
                  <Switch checked={!!data.locked} onCheckedChange={(c) => onUpdate({ locked: c })} disabled={readOnly} />
               </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Change Icon</Label>
              <div className="grid grid-cols-4 gap-2">
                {NODE_TYPES.slice(0, 16).map(item => (
                    <div 
                      key={item.type}
                      className={`flex items-center justify-center p-2 rounded border transition-all ${data.iconType === item.type ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500' : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5'} ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      title={item.label}
                      onClick={() => !readOnly && onUpdate({ iconType: item.type })}
                    >
                      <item.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                    </div>
                ))}
              </div>
            </div>
          </>
        )}


        {/* --- EDGE PROPERTIES --- */}
        {type === 'edge' && (
          <>
             <div className="space-y-4">
                <div className="space-y-2">
                   <Label>Line Style</Label>
                   <div className="grid grid-cols-3 gap-2">
                      <div 
                         className={`h-10 border rounded flex items-center justify-center ${!data.style?.strokeDasharray ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-white/10'} ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                         onClick={() => !readOnly && onUpdate({ style: { ...data.style, strokeDasharray: '' } })}
                      >
                         <div className="w-8 h-0.5 bg-current" />
                      </div>
                      <div 
                         className={`h-10 border rounded flex items-center justify-center ${data.style?.strokeDasharray === '5 5' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-white/10'} ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                         onClick={() => !readOnly && onUpdate({ style: { ...data.style, strokeDasharray: '5 5' } })}
                      >
                         <div className="w-8 h-0.5 bg-current border-b-2 border-dotted" />
                      </div>
                      <div 
                         className={`h-10 border rounded flex items-center justify-center ${data.style?.strokeDasharray === '10 10' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-white/10'} ${readOnly ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                         onClick={() => !readOnly && onUpdate({ style: { ...data.style, strokeDasharray: '10 10' } })}
                      >
                         <div className="w-8 h-0.5 bg-current border-b-2 border-dashed" />
                      </div>
                   </div>
                   <div className="flex justify-between text-[10px] text-slate-400 px-1">
                      <span>Solid</span>
                      <span>Dotted</span>
                      <span>Dashed</span>
                   </div>
                </div>

                <div className="space-y-2">
                   <Label>Line Color</Label>
                   <div className="flex gap-2">
                      <input 
                         type="color"
                         value={data.style?.stroke || '#b1b1b7'}
                         onChange={(e) => onUpdate({ style: { ...data.style, stroke: e.target.value } })}
                         className="h-9 w-full rounded cursor-pointer border border-slate-200 dark:border-white/10 disabled:opacity-50"
                         disabled={readOnly}
                      />
                   </div>
                </div>

                <div className="space-y-2">
                   <Label>Line Width</Label>
                   <input 
                      type="range" 
                      min="1" 
                      max="5" 
                      step="1"
                      value={data.style?.strokeWidth || 1}
                      onChange={(e) => onUpdate({ style: { ...data.style, strokeWidth: parseInt(e.target.value) } })}
                      className="w-full disabled:opacity-50"
                      disabled={readOnly}
                   />
                   <div className="text-right text-xs text-slate-500">{data.style?.strokeWidth || 1}px</div>
                </div>

                <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-3 rounded-md border border-slate-100 dark:border-white/5">
                   <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm">Animated Flow</span>
                   </div>
                   <Switch checked={!!data.animated} onCheckedChange={(c) => onUpdate({ animated: c })} disabled={readOnly} />
                </div>
             </div>
          </>
        )}

      </div>

      {!readOnly && (
        <div className="p-4 border-t border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5">
           <Button variant="destructive" className="w-full gap-2" onClick={onDelete}>
              <Trash2 className="h-4 w-4" /> Delete {type === 'node' ? 'Node' : 'Connection'}
           </Button>
        </div>
      )}
    </div>
  );
};