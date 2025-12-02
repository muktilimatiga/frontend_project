
import * as React from 'react';
import { useState } from 'react';
import { Search, RefreshCw, Filter } from 'lucide-react';
import { Button, Input, Separator } from '../../components/ui';
import { useDevices } from '../../hooks/useQueries';
import { MonitorStats } from './components/MonitorStats';
import { DeviceList } from './components/DeviceList';
import { SnmpDeviceTable } from './components/SnmpDeviceTable';

export const MonitorPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: devices = [], refetch, isRefetching } = useDevices(true);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Network Monitor</h1>
           <p className="text-slate-500 dark:text-slate-400">Real-time status of all connected infrastructure.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="bg-white dark:bg-black" onClick={() => refetch()} disabled={isRefetching}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} /> Refresh
           </Button>
           <Button className="bg-slate-900 dark:bg-white dark:text-black">
              Add Device
           </Button>
        </div>
      </div>

      <MonitorStats devices={devices} />

      {/* Live Devices (Mock/Realtime) */}
      <div className="space-y-4">
          <div className="flex items-center justify-between">
             <h3 className="font-semibold text-slate-800 dark:text-slate-200">Active Monitoring</h3>
             <div className="flex items-center gap-2">
                <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <Input 
                    placeholder="Filter active devices..." 
                    className="pl-8 h-8 bg-white dark:bg-black border-slate-200 dark:border-white/20 text-xs"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button variant="outline" size="sm" className="h-8 bg-white dark:bg-black border-slate-200 dark:border-white/20">
                    <Filter className="mr-2 h-3 w-3" /> Filter
                </Button>
             </div>
          </div>
          
          <DeviceList devices={devices} filter={searchQuery} />
      </div>

      <Separator className="my-8" />

      {/* Database Registry (SNMP Table) */}
      <SnmpDeviceTable />
    </div>
  );
};
