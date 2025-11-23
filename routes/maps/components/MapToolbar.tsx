import React from 'react';
import { Button } from '../../../components/ui';
import { Map as MapIcon, Crosshair, Ruler, Trash2 } from 'lucide-react';

interface MapToolbarProps {
  mode: 'view' | 'add_node' | 'measure' | 'delete_node';
  onModeChange: (mode: 'view' | 'add_node' | 'measure' | 'delete_node') => void;
  onMeasureClear: () => void;
}

export const MapToolbar = ({ mode, onModeChange, onMeasureClear }: MapToolbarProps) => {
  return (
    <div className="flex items-center gap-1 bg-white dark:bg-black p-1 rounded-md border border-slate-200 dark:border-white/20">
       <Button 
          size="sm" 
          variant={mode === 'view' ? 'default' : 'ghost'} 
          onClick={() => onModeChange('view')}
          className="h-7 text-xs"
       >
          <MapIcon className="h-3 w-3 mr-1" /> View
       </Button>
       <Button 
          size="sm" 
          variant={mode === 'add_node' ? 'default' : 'ghost'} 
          onClick={() => onModeChange('add_node')}
          className="h-7 text-xs"
       >
          <Crosshair className="h-3 w-3 mr-1" /> Pin Node
       </Button>
       <Button 
          size="sm" 
          variant={mode === 'measure' ? 'default' : 'ghost'} 
          onClick={() => { onModeChange('measure'); onMeasureClear(); }}
          className="h-7 text-xs"
       >
          <Ruler className="h-3 w-3 mr-1" /> Measure
       </Button>
       <Button 
          size="sm" 
          variant={mode === 'delete_node' ? 'destructive' : 'ghost'} 
          onClick={() => onModeChange('delete_node')}
          className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
       >
          <Trash2 className="h-3 w-3 mr-1" /> Delete
       </Button>
    </div>
  );
};