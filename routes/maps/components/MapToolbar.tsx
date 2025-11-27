
import * as React from 'react';
import { Button } from '../../../components/ui';
import { Map as MapIcon, Crosshair, Ruler, Trash2, Edit3, Activity, Layers } from 'lucide-react';
import { cn } from '../../../components/ui';

interface MapToolbarProps {
  mode: 'view' | 'add_node' | 'measure' | 'delete_node' | 'edit';
  onModeChange: (mode: 'view' | 'add_node' | 'measure' | 'delete_node' | 'edit') => void;
  onMeasureClear: () => void;
  showCables: boolean;
  onToggleCables: () => void;
}

export const MapToolbar = ({ mode, onModeChange, onMeasureClear, showCables, onToggleCables }: MapToolbarProps) => {
  return (
    <div className="flex items-center gap-1 bg-white dark:bg-black p-1.5 rounded-lg border border-slate-200 dark:border-white/20 shadow-sm">
       <Button 
          size="sm" 
          variant={mode === 'view' ? 'default' : 'ghost'} 
          onClick={() => onModeChange('view')}
          className="h-8 text-xs"
          title="View Mode"
       >
          <MapIcon className="h-3.5 w-3.5 md:mr-1" /> <span className="hidden md:inline">View</span>
       </Button>
       
       <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-1" />
       
       <Button 
          size="sm" 
          variant={mode === 'add_node' ? 'default' : 'ghost'} 
          onClick={() => onModeChange('add_node')}
          className="h-8 text-xs"
          title="Add Node"
       >
          <Crosshair className="h-3.5 w-3.5 md:mr-1" /> <span className="hidden md:inline">Add</span>
       </Button>
       
       <Button 
          size="sm" 
          variant={mode === 'edit' ? 'default' : 'ghost'} 
          onClick={() => onModeChange('edit')}
          className="h-8 text-xs"
          title="Edit/Drag Nodes"
       >
          <Edit3 className="h-3.5 w-3.5 md:mr-1" /> <span className="hidden md:inline">Edit</span>
       </Button>

       <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-1" />

       <Button 
          size="sm" 
          variant={mode === 'measure' ? 'default' : 'ghost'} 
          onClick={() => { onModeChange('measure'); onMeasureClear(); }}
          className="h-8 text-xs"
          title="Measure Distance"
       >
          <Ruler className="h-3.5 w-3.5 md:mr-1" /> <span className="hidden md:inline">Measure</span>
       </Button>
       
       <Button 
          size="sm" 
          variant={mode === 'delete_node' ? 'destructive' : 'ghost'} 
          onClick={() => onModeChange('delete_node')}
          className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          title="Delete Node"
       >
          <Trash2 className="h-3.5 w-3.5 md:mr-1" /> <span className="hidden md:inline">Delete</span>
       </Button>

       <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-1" />

       <Button 
          size="sm" 
          variant="ghost"
          onClick={onToggleCables}
          className={cn("h-8 text-xs", showCables ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400" : "text-slate-500")}
          title="Toggle Cable Layer"
       >
          <Activity className="h-3.5 w-3.5 md:mr-1" /> <span className="hidden md:inline">Cables</span>
       </Button>
    </div>
  );
};
