import * as React from 'react';
import { Button } from '../../../components/ui';
import { 
  Plus, 
  Trash2,
  ZoomIn, 
  ZoomOut,
  Maximize,
  Save,
  MousePointer2,
  Eye,
  Edit3
} from 'lucide-react';
import { cn } from '../../../components/ui';

interface TopologyToolbarProps {
  mode: 'view' | 'edit';
  onModeChange: (mode: 'view' | 'edit') => void;
  onImportClick: () => void;
  onFitView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSave: () => void;
  onDelete?: () => void;
  hasSelection: boolean;
}

export const TopologyToolbar = ({ 
  mode,
  onModeChange,
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
       
       <div className="flex bg-slate-100 dark:bg-white/10 p-0.5 rounded-md">
          <button
             onClick={() => onModeChange('view')}
             className={cn(
                "flex items-center px-3 py-1.5 text-xs font-medium rounded-sm transition-all",
                mode === 'view' 
                   ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-white" 
                   : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
             )}
          >
             <Eye className="mr-1.5 h-3.5 w-3.5" /> View
          </button>
          <button
             onClick={() => onModeChange('edit')}
             className={cn(
                "flex items-center px-3 py-1.5 text-xs font-medium rounded-sm transition-all",
                mode === 'edit' 
                   ? "bg-white text-slate-900 shadow-sm dark:bg-zinc-800 dark:text-white" 
                   : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
             )}
          >
             <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit
          </button>
       </div>

       <div className="w-px h-6 bg-slate-200 dark:bg-white/10 mx-1" />

       <Button 
          onClick={onImportClick} 
          size="sm" 
          disabled={mode === 'view'}
          className={cn("h-8 text-xs", mode === 'view' && "opacity-50 cursor-not-allowed")}
       >
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

       {hasSelection && mode === 'edit' && (
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