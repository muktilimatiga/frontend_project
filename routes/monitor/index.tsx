import * as React from 'react';
import { useState } from 'react';
import { Search, RefreshCw, Filter } from 'lucide-react';
import { Button, Input } from '../../components/ui';
import { useDevices } from '../../hooks/useQueries';
import { MonitorStats } from './components/MonitorStats';
import { DeviceList } from './components/DeviceList';

export const MonitorPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: devices = [], refetch, isRefetching } = useDevices(true);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
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

      <div className="flex items-center gap-4 py-2">
         <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <Input 
               placeholder="Search devices by name or IP..." 
               className="pl-9 bg-white dark:bg-black border-slate-200 dark:border-white/20"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>
         <Button variant="outline" className="bg-white dark:bg-black border-slate-200 dark:border-white/20">
            <Filter className="mr-2 h-4 w-4" /> Filter
         </Button>
      </div>

      <DeviceList devices={devices} filter={searchQuery} />
    </div>
  );
};