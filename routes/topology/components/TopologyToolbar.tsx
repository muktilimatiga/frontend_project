import * as React from 'react';
import { Button } from '../../../components/ui';
import { 
  MousePointer2, Move, FileText, Plus, Zap, 
  RotateCcw, RotateCw, Diamond, ArrowRight, Trash2,
  ZoomIn, ZoomOut
} from 'lucide-react';
import { cn } from '../../../components/ui';

interface TopologyToolbarProps {
  isEditMode: boolean;
  activeTool: 'select' | 'cable' | 'rect' | 'circle' | 'diamond' | 'arrow' | 'text';
  onToggleMode: (mode: boolean) => void;
  onSetTool: (tool: 'select' | 'cable' | 'rect' | 'circle' | 'diamond' | 'arrow' | 'text') => void;
  onImportClick: () => void;
  onClear: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  
  // History
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;

  // Cable Options
  cableStyle: 'solid' | 'dotted' | 'dashed';
  cableColor: string;
  onCableStyleChange: (style: 'solid' | 'dotted' | 'dashed') => void;
  onCableColorChange: (color: string) => void;
}

export const TopologyToolbar = ({ 
  isEditMode, 
  activeTool, 
  onToggleMode, 
  onSetTool, 
  onImportClick,
  onClear,
  onZoomIn,
  onZoomOut,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  cableStyle,
  cableColor,
  onCableStyleChange,
  onCableColorChange
}: TopologyToolbarProps) => {
  return (
    <div className="flex flex-col gap-2 items-end">
    <div className="flex gap-2 bg-white dark:bg-black p-1.5 rounded-lg border border-slate-200 dark:border-white/20 shadow-sm flex-wrap justify-end">
       {/* Mode Switcher */}
       <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/10 p-1 rounded-md mr-1">
          <button 
             onClick={() => onToggleMode(false)}
             className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all", !isEditMode ? "bg-white text-slate-900 shadow-sm dark:bg-black dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400")}
          >
             <MousePointer2 className="h-3.5 w-3.5" /> View
          </button>
          <button 
             onClick={() => onToggleMode(true)}
             className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-all", isEditMode ? "bg-white text-slate-900 shadow-sm dark:bg-black dark:text-white" : "text-slate-500 hover:text-slate-900 dark:text-slate-400")}
          >
             <Move className="h-3.5 w-3.5" /> Edit
          </button>
       </div>

       {isEditMode && (
         <>
           <div className="w-px bg-slate-200 dark:bg-white/10 mx-1" />
           
           {/* History */}
           <div className="flex items-center gap-1">
             <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onUndo} disabled={!canUndo} title="Undo">
                <RotateCcw className="h-4 w-4" />
             </Button>
             <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onRedo} disabled={!canRedo} title="Redo">
                <RotateCw className="h-4 w-4" />
             </Button>
           </div>

           <div className="w-px bg-slate-200 dark:bg-white/10 mx-1" />

           {/* Tools */}
           <div className="flex items-center gap-1">
             <Button 
                size="icon" 
                variant={activeTool === 'select' ? 'default' : 'ghost'} 
                className="h-8 w-8" 
                title="Select Tool" 
                onClick={() => onSetTool('select')}
             >
                <MousePointer2 className="h-4 w-4" />
             </Button>
             <Button 
                size="icon" 
                variant={activeTool === 'cable' ? 'default' : 'ghost'} 
                className={cn("h-8 w-8", activeTool === 'cable' && "bg-emerald-600 hover:bg-emerald-700 text-white")}
                title="Cable/Connect Tool" 
                onClick={() => onSetTool('cable')}
             >
                <Zap className="h-4 w-4" />
             </Button>
           </div>

           <div className="w-px bg-slate-200 dark:bg-white/10 mx-1" />

           {/* Shapes */}
           <div className="flex items-center gap-1">
             <Button size="icon" variant={activeTool === 'rect' ? 'secondary' : 'ghost'} className="h-8 w-8" title="Rectangle" onClick={() => onSetTool('rect')}>
                <div className="h-3 w-4 border-2 border-current rounded-[2px]" />
             </Button>
             <Button size="icon" variant={activeTool === 'circle' ? 'secondary' : 'ghost'} className="h-8 w-8" title="Circle" onClick={() => onSetTool('circle')}>
                <div className="h-4 w-4 rounded-full border-2 border-current" />
             </Button>
             <Button size="icon" variant={activeTool === 'diamond' ? 'secondary' : 'ghost'} className="h-8 w-8" title="Diamond" onClick={() => onSetTool('diamond')}>
                <Diamond className="h-4 w-4" />
             </Button>
             <Button size="icon" variant={activeTool === 'arrow' ? 'secondary' : 'ghost'} className="h-8 w-8" title="Arrow" onClick={() => onSetTool('arrow')}>
                <ArrowRight className="h-4 w-4" />
             </Button>
             <Button size="icon" variant={activeTool === 'text' ? 'secondary' : 'ghost'} className="h-8 w-8" title="Text" onClick={() => onSetTool('text')}>
                <FileText className="h-4 w-4" />
             </Button>
           </div>

           <div className="w-px bg-slate-200 dark:bg-white/10 mx-1" />

           {/* Canvas Controls */}
           <div className="flex items-center gap-1">
             <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onZoomOut} title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
             </Button>
             <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onZoomIn} title="Zoom In">
                <ZoomIn className="h-4 w-4" />
             </Button>
             <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 dark:hover:text-red-400" onClick={onClear} title="Clear Canvas">
                <Trash2 className="h-4 w-4" />
             </Button>
           </div>

           <div className="w-px bg-slate-200 dark:bg-white/10 mx-1" />
         </>
       )}

       <Button onClick={onImportClick} disabled={!isEditMode} size="sm" className="h-8 text-xs">
          <Plus className="mr-2 h-3 w-3" /> Add Node
       </Button>
    </div>
    
    {/* Cable Sub-Toolbar */}
    {isEditMode && activeTool === 'cable' && (
       <div className="flex items-center gap-2 bg-slate-50 dark:bg-white/5 p-1.5 rounded-lg border border-slate-200 dark:border-white/10 text-xs animate-in slide-in-from-top-2">
          <span className="text-slate-500 font-medium px-1">Cable Settings:</span>
          
          <div className="flex items-center gap-1 border border-slate-200 dark:border-white/10 rounded overflow-hidden">
             {['solid', 'dashed', 'dotted'].map((style) => (
                <button
                   key={style}
                   onClick={() => onCableStyleChange(style as any)}
                   className={cn(
                      "px-2 py-1 hover:bg-slate-200 dark:hover:bg-white/10",
                      cableStyle === style && "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                   )}
                   title={style}
                >
                   {style === 'solid' && <div className="w-4 h-0.5 bg-current" />}
                   {style === 'dashed' && <div className="w-4 h-0.5 border-b-2 border-dashed border-current" />}
                   {style === 'dotted' && <div className="w-4 h-0.5 border-b-2 border-dotted border-current" />}
                </button>
             ))}
          </div>
          
          <div className="w-px h-4 bg-slate-200 dark:bg-white/10" />
          
          <div className="flex items-center gap-1">
             <input 
               type="color" 
               value={cableColor}
               onChange={(e) => onCableColorChange(e.target.value)}
               className="w-5 h-5 rounded cursor-pointer border-none p-0 bg-transparent"
               title="Cable Color"
             />
          </div>
       </div>
    )}
    </div>
  );
};