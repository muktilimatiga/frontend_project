
import * as React from 'react';
import { 
  Trash2, 
  Copy, 
  Lock, 
  Unlock, 
  ArrowUp, 
  ArrowDown, 
  Edit, 
  AlignLeft,
  BringToFront,
  SendToBack
} from 'lucide-react';
import { cn } from '../../../components/ui';

interface ContextMenuProps {
  top: number;
  left: number;
  type: 'node' | 'edge' | 'pane';
  id?: string;
  data?: any; // Node or Edge data
  onClose: () => void;
  onAction: (action: string, id?: string) => void;
}

export const ContextMenu = ({ top, left, type, id, data, onClose, onAction }: ContextMenuProps) => {
  // Close menu if clicking outside
  React.useEffect(() => {
    const handleClick = () => onClose();
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [onClose]);

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation(); // Prevent closing immediately
    onAction(action, id);
    onClose();
  };

  const MenuItem = ({ icon: Icon, label, action, danger = false }: any) => (
    <button
      onClick={(e) => handleAction(e, action)}
      className={cn(
        "w-full flex items-center gap-2 px-3 py-2 text-xs font-medium transition-colors text-left",
        danger 
          ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20" 
          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
      )}
    >
      <Icon className="h-3.5 w-3.5 opacity-70" />
      {label}
    </button>
  );

  return (
    <div 
      style={{ top, left }} 
      className="fixed z-[100] w-48 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-white/10 rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100"
      onContextMenu={(e) => e.preventDefault()} // Prevent native menu inside custom menu
    >
      {type === 'node' && (
        <>
          <div className="px-3 py-2 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
             <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Node Actions</span>
          </div>
          <MenuItem icon={Edit} label="Edit Properties" action="edit" />
          <MenuItem icon={Copy} label="Duplicate" action="duplicate" />
          <MenuItem icon={data?.locked ? Unlock : Lock} label={data?.locked ? "Unlock Position" : "Lock Position"} action="toggle_lock" />
          <div className="h-px bg-slate-100 dark:bg-white/5 my-1" />
          <MenuItem icon={BringToFront} label="Bring to Front" action="layer_up" />
          <MenuItem icon={SendToBack} label="Send to Back" action="layer_down" />
          <div className="h-px bg-slate-100 dark:bg-white/5 my-1" />
          <MenuItem icon={AlignLeft} label="Toggle Text Wrap" action="toggle_wrap" />
          <div className="h-px bg-slate-100 dark:bg-white/5 my-1" />
          <MenuItem icon={Trash2} label="Delete Node" action="delete" danger />
        </>
      )}

      {type === 'edge' && (
        <>
          <div className="px-3 py-2 bg-slate-50 dark:bg-white/5 border-b border-slate-100 dark:border-white/5">
             <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Connection Actions</span>
          </div>
          <MenuItem icon={Edit} label="Edit Line Style" action="edit" />
          <MenuItem icon={Trash2} label="Delete Connection" action="delete" danger />
        </>
      )}

      {type === 'pane' && (
        <>
          <MenuItem icon={Edit} label="Fit View" action="fit_view" />
        </>
      )}
    </div>
  );
};
