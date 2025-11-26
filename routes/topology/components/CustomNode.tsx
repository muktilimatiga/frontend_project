import React, { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { NETWORK_SVGS } from '../constants';
import { cn } from '../../../components/ui';

// Custom Node Component
const CustomNode = ({ data, selected }: NodeProps) => {
  const { label, iconType, strokeColor, status } = data as { 
    label: string; 
    iconType: string; 
    strokeColor?: string;
    status?: string;
  };

  // Get SVG content
  const svgContent = NETWORK_SVGS[iconType] || NETWORK_SVGS['default'];
  
  // Dynamic styles
  const color = strokeColor || 'currentColor';
  const processedSvg = svgContent.replace(/currentColor/g, color);

  return (
    <div className={cn(
      "relative flex flex-col items-center justify-center p-2 rounded-lg transition-all min-w-[80px]",
      selected 
        ? "ring-2 ring-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-lg" 
        : "hover:bg-slate-50 dark:hover:bg-white/5"
    )}>
      {/* Handles for connections */}
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-slate-400 dark:!bg-slate-500" />
      <Handle type="target" position={Position.Left} className="w-2 h-2 !bg-slate-400 dark:!bg-slate-500" />
      
      {/* Node Content */}
      <div 
        className="w-12 h-12 flex items-center justify-center mb-1"
        dangerouslySetInnerHTML={{ __html: processedSvg }}
        style={{ color: color }}
      />
      
      {/* Label */}
      <span className={cn(
        "text-xs font-medium text-center max-w-[120px] truncate px-1 rounded",
        "text-slate-900 dark:text-slate-100 bg-white/80 dark:bg-black/50"
      )}>
        {label}
      </span>

      {/* Status Indicator (Optional) */}
      {status && (
        <span className={cn(
          "absolute -top-1 -right-1 flex h-3 w-3",
          status === 'active' ? "text-emerald-500" : "text-amber-500"
        )}>
           <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
           <span className="relative inline-flex rounded-full h-3 w-3 bg-current"></span>
        </span>
      )}

      <Handle type="source" position={Position.Right} className="w-2 h-2 !bg-slate-400 dark:!bg-slate-500" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-slate-400 dark:!bg-slate-500" />
    </div>
  );
};

export default memo(CustomNode);