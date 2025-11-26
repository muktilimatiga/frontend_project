import * as React from 'react';
import { Button } from '../../../components/ui';
import { 
  Plus, 
  Trash2,
  ZoomIn, 
  ZoomOut,
  Maximize,
  Save,
  MousePointer2
} from 'lucide-react';

interface TopologyToolbarProps {
  onImportClick: () => void;
  onFitView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
  onDelete?: () => void;
  hasSelection: boolean;
}

export const TopologyToolbar = ({ 
  onImportClick,
  onFitView,
  onZoomIn,
  onZoomOut,
  onSave,
  onDelete,
  hasSelection
}: TopologyToolbarProps) => {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-black p-1.5 rounded-lg border border-slate-200 dark:border-white/20 shadow-sm flex-wrap">
       
       <Button onClick={onImportClick} size="sm" className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white">
          <Plus className="mr-2 h-3 w-3" /> Add Node
       </Button>

       <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />

       {/* Canvas Controls */}
       <div className="flex items-center gap-1">
         <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onZoomOut} title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
         </Button>
         <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onZoomIn} title="Zoom In">
            <ZoomIn className="h-4 w-4" />
         </Button>
         <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onFitView} title="Fit View">
            <Maximize className="h-4 w-4" />
         </Button>
       </div>

       {hasSelection && (
         <>
           <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />
           <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" 
              onClick={onDelete} 
              title="Delete Selected"
           >
              <Trash2 className="h-4 w-4" />
           </Button>
         </>
       )}

       <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />
       
       <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onSave} title="Save Topology">
          <Save className="h-4 w-4" />
       </Button>
    </div>
  );
};