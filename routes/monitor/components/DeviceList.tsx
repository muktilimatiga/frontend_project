import * as React from 'react';
import { Globe, Server, Wifi, Shield, Monitor, MoreHorizontal, Power, Terminal, RefreshCw } from 'lucide-react';
import { Card, CardContent, Button, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Badge, cn } from '../../../components/ui';
import { Device } from '../../../types';

interface DeviceListProps {
  devices: Device[];
  filter: string;
}

const DeviceIcon = ({ type, className }: { type: string, className?: string }) => {
  switch (type) {
    case 'router': return <Globe className={className} />;
    case 'server': return <Server className={className} />;
    case 'ap': return <Wifi className={className} />;
    case 'firewall': return <Shield className={className} />;
    default: return <Monitor className={className} />;
  }
};

const DeviceCard: React.FC<{ device: Device }> = ({ device }) => {
  const statusColor = 
    device.status === 'online' ? 'bg-emerald-500' : 
    device.status === 'warning' ? 'bg-amber-500' : 
    'bg-red-500';

  const statusBg = 
    device.status === 'online' ? 'bg-emerald-500/10 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400' : 
    device.status === 'warning' ? 'bg-amber-500/10 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' : 
    'bg-red-500/10 text-red-600 dark:bg-red-900/20 dark:text-red-400';

  return (
    <Card className="group hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer dark:bg-[#121214] dark:border-slate-800 hover:shadow-md">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/5">
                 <DeviceIcon type={device.type} className="h-6 w-6" />
              </div>
              <div>
                 <h4 className="font-bold text-slate-900 dark:text-white text-base leading-tight">{device.name}</h4>
                 <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-1">{device.ip}</p>
              </div>
           </div>
           <DropdownMenu>
              <DropdownMenuTrigger>
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-white p-0 -mr-2">
                    <MoreHorizontal className="h-5 w-5" />
                 </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                 <DropdownMenuItem><Terminal className="mr-2 h-4 w-4" /> SSH Terminal</DropdownMenuItem>
                 <DropdownMenuItem><RefreshCw className="mr-2 h-4 w-4" /> Reboot</DropdownMenuItem>
                 <DropdownMenuItem className="text-red-600"><Power className="mr-2 h-4 w-4" /> Shutdown</DropdownMenuItem>
              </DropdownMenuContent>
           </DropdownMenu>
        </div>

        <div className="flex items-center justify-between mb-6">
           <Badge variant="outline" className={cn("border-0 font-bold capitalize px-2 py-0.5 h-6", statusBg)}>
              <span className={cn("h-1.5 w-1.5 rounded-full mr-2", statusColor)} />
              {device.status}
           </Badge>
           <span className={cn(
              "text-xs font-bold", 
              device.ping > 100 ? "text-amber-500" : "text-slate-600 dark:text-slate-400"
           )}>
              {device.ping} ms
           </span>
        </div>

        {/* Visual Ping Bar (Mock) */}
        <div className="flex items-end gap-1 h-8 opacity-50 group-hover:opacity-100 transition-opacity">
           {Array.from({ length: 20 }).map((_, i) => {
              const height = Math.random() * 100;
              const isPingSpike = Math.random() > 0.9;
              return (
                 <div 
                    key={i} 
                    className={cn(
                       "flex-1 rounded-sm transition-all duration-500",
                       device.status === 'offline' ? "bg-slate-200 dark:bg-slate-800 h-1" :
                       isPingSpike ? "bg-amber-500" : "bg-primary"
                    )}
                    style={{ height: device.status === 'offline' ? '4px' : `${Math.max(15, height)}%` }}
                 />
              )
           })}
        </div>
      </CardContent>
    </Card>
  );
};

export const DeviceList = ({ devices, filter }: DeviceListProps) => {
  const grouped: Record<string, Device[]> = React.useMemo(() => {
     const groups: Record<string, Device[]> = {};
     devices.forEach(d => {
        if (filter && !d.name.toLowerCase().includes(filter.toLowerCase()) && !d.ip.includes(filter)) return;
        if (!groups[d.folder]) groups[d.folder] = [];
        groups[d.folder].push(d);
     });
     return groups;
  }, [devices, filter]);

  if (Object.keys(grouped).length === 0) {
     return <div className="text-center py-12 text-slate-500">No devices found matching your search.</div>;
  }

  return (
    <div className="space-y-8">
       {Object.entries(grouped).map(([folder, items]) => (
          <div key={folder} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
             <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 pl-1">{folder}</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map(device => (
                   <DeviceCard key={device.id} device={device} />
                ))}
             </div>
          </div>
       ))}
    </div>
  );
};