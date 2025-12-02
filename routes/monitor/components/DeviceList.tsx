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
    <Card className="hover:shadow-md transition-all group">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
           <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400">
                 <DeviceIcon type={device.type} className="h-5 w-5" />
              </div>
              <div>
                 <h4 className="font-semibold text-slate-900 dark:text-white text-sm">{device.name}</h4>
                 <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{device.ip}</p>
              </div>
           </div>
           <DropdownMenu>
              <DropdownMenuTrigger>
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                    <MoreHorizontal className="h-4 w-4" />
                 </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                 <DropdownMenuItem><Terminal className="mr-2 h-4 w-4" /> SSH Terminal</DropdownMenuItem>
                 <DropdownMenuItem><RefreshCw className="mr-2 h-4 w-4" /> Reboot</DropdownMenuItem>
                 <DropdownMenuItem className="text-red-600"><Power className="mr-2 h-4 w-4" /> Shutdown</DropdownMenuItem>
              </DropdownMenuContent>
           </DropdownMenu>
        </div>

        <div className="flex items-center justify-between mb-4">
           <Badge variant="outline" className={cn("border-0 font-medium capitalize", statusBg)}>
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
        <div className="flex items-end gap-0.5 h-8 opacity-50 group-hover:opacity-100 transition-opacity">
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
                    style={{ height: device.status === 'offline' ? '4px' : `${Math.max(10, height)}%` }}
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
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map(device => (
                   <DeviceCard key={device.id} device={device} />
                ))}
             </div>
          </div>
       ))}
    </div>
  );
};