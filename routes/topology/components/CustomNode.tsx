import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NETWORK_SVGS } from '../constants';
import { cn } from '../../../components/ui';
import { Lock } from 'lucide-react';

// Custom Node Component
const CustomNode = ({ data, selected, isConnectable }: NodeProps) => {
  const { label, iconType, strokeColor, status, locked, wrapText } = data as { 
    label: string; 
    iconType: string; 
    strokeColor?: string;
    status?: string;
    locked?: boolean;
    wrapText?: boolean;
  };

  // Get SVG content
  const svgContent = NETWORK_SVGS[iconType] || NETWORK_SVGS['default'];
  
  // Dynamic styles
  const color = strokeColor || 'currentColor';
  const processedSvg = svgContent.replace(/currentColor/g, color);

  return (
    <div className={cn(
      "relative flex flex-col items-center justify-center p-2 rounded-lg transition-all min-w-[80px] group",
      selected 
        ? "ring-2 ring-indigo-500 bg-indigo-50/80 dark:bg-indigo-900/40 shadow-lg backdrop-blur-sm" 
        : status === 'warning'
          ? "ring-1 ring-amber-500/50 bg-amber-50/50 dark:bg-amber-900/20 shadow-sm"
          : "hover:bg-slate-50/80 dark:hover:bg-white/10"
    )}>
      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} className="w-2 h-2 !bg-slate-400 dark:!bg-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-2 h-2 !bg-slate-400 dark:!bg-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Node Content */}
      <div 
        className="w-12 h-12 flex items-center justify-center mb-1 drop-shadow-sm"
        dangerouslySetInnerHTML={{ __html: processedSvg }}
        style={{ color: color }}
      />
      
      {/* Label */}
      <span className={cn(
        "text-xs font-medium text-center px-1 rounded transition-all",
        "text-slate-900 dark:text-slate-100 bg-white/80 dark:bg-black/50 backdrop-blur-sm",
        wrapText ? "whitespace-normal max-w-[120px]" : "whitespace-nowrap max-w-[150px] truncate"
      )}>
        {label}
      </span>

      {/* Lock Indicator */}
      {locked && (
        <div className="absolute top-1 right-1 text-slate-400">
           <Lock className="h-3 w-3" />
        </div>
      )}

      {/* Status Indicator */}
      {status && status !== 'none' && (
        <span className={cn(
          "absolute -top-1 -right-1 flex h-3 w-3 z-10",
          status === 'active' ? "text-emerald-500" : status === 'warning' ? "text-amber-500" : "text-red-500"
        )}>
           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
           <span className="relative inline-flex rounded-full h-3 w-3 bg-current"></span>
        </span>
      )}

      <Handle type="source" position={Position.Right} isConnectable={isConnectable} className="w-2 h-2 !bg-slate-400 dark:!bg-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} className="w-2 h-2 !bg-slate-400 dark:!bg-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};

export default memo(CustomNode);