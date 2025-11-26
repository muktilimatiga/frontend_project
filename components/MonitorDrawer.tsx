
import * as React from 'react';
import { useState, useMemo } from 'react';
import { 
  X, 
  Search, 
  Folder, 
  FolderOpen, 
  Monitor, 
  ChevronRight, 
  ChevronDown, 
  Circle,
  Server,
  Wifi,
  Globe,
  Shield
} from 'lucide-react';
import { useAppStore } from '../store';
import { Device } from '../types';
import { Input, cn } from './ui';
import { useDevices } from '../hooks/useQueries';

const StatusDot = ({ status }: { status: Device['status'] }) => {
  const color = status === 'online' ? 'text-emerald-500' : status === 'warning' ? 'text-amber-500' : 'text-red-500';
  return <Circle className={cn("h-2 w-2 fill-current", color)} />;
};

const DeviceIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'router': return <Globe className="h-4 w-4 text-slate-500" />;
    case 'server': return <Server className="h-4 w-4 text-slate-500" />;
    case 'ap': return <Wifi className="h-4 w-4 text-slate-500" />;
    case 'firewall': return <Shield className="h-4 w-4 text-slate-500" />;
    default: return <Monitor className="h-4 w-4 text-slate-500" />;
  }
};

export const MonitorDrawer = () => {
  const { isMonitorOpen, toggleMonitor } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({ 'Routers': true, 'Switches': true });

  const { data: devices = [] } = useDevices(isMonitorOpen);

  const toggleFolder = (folder: string) => {
    setExpandedFolders(prev => ({ ...prev, [folder]: !prev[folder] }));
  };

  const groupedDevices = useMemo(() => {
    const groups: Record<string, Device[]> = {};
    devices.forEach(d => {
      if (searchQuery && !d.name.toLowerCase().includes(searchQuery.toLowerCase()) && !d.ip.includes(searchQuery)) {
        return;
      }
      if (!groups[d.folder]) groups[d.folder] = [];
      groups[d.folder].push(d);
    });
    return groups;
  }, [devices, searchQuery]);

  if (!isMonitorOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity animate-in fade-in"
        onClick={toggleMonitor}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-80 md:w-96 bg-white dark:bg-black border-l border-slate-200 dark:border-white/20 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/10">
          <div className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-semibold text-slate-900 dark:text-white">Device Monitor</h2>
          </div>
          <button onClick={toggleMonitor} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50 dark:bg-white/5">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search devices..." 
              className="pl-9 bg-white dark:bg-black border-slate-200 dark:border-white/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Device List */}
        <div className="flex-1 overflow-y-auto p-2">
          {Object.keys(groupedDevices).length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              {searchQuery ? 'No devices found.' : 'No devices available.'}
            </div>
          ) : (
            Object.entries(groupedDevices).map(([folder, items]: [string, Device[]]) => (
              <div key={folder} className="mb-1">
                {/* Folder Header */}
                <div 
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer select-none text-sm font-medium text-slate-700 dark:text-slate-200"
                  onClick={() => toggleFolder(folder)}
                >
                  {expandedFolders[folder] ? (
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  )}
                  {expandedFolders[folder] ? (
                    <FolderOpen className="h-4 w-4 text-indigo-500" />
                  ) : (
                    <Folder className="h-4 w-4 text-indigo-500" />
                  )}
                  <span>{folder}</span>
                  <span className="ml-auto text-xs text-slate-400 font-normal">{items.length}</span>
                </div>

                {/* Folder Items */}
                {expandedFolders[folder] && (
                  <div className="ml-6 mt-1 space-y-1 border-l border-slate-200 dark:border-white/10 pl-2">
                    {items.map(device => (
                      <div 
                        key={device.id} 
                        className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer group transition-colors"
                      >
                        <DeviceIcon type={device.type} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-200 truncate">{device.name}</p>
                            <StatusDot status={device.status} />
                          </div>
                          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>{device.ip}</span>
                            <span className={cn(
                              device.ping > 100 ? "text-amber-500" : "text-emerald-500"
                            )}>{device.ping}ms</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs text-center text-slate-500">
           Total Devices: {devices.length}
        </div>
      </div>
    </>
  );
};
