import * as React from 'react';
import { Activity, Server, Wifi, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui';
import { Device } from '../../../types';

interface MonitorStatsProps {
  devices: Device[];
}

export const MonitorStats = ({ devices }: MonitorStatsProps) => {
  const total = devices.length;
  const online = devices.filter(d => d.status === 'online').length;
  const offline = devices.filter(d => d.status === 'offline').length;
  const warning = devices.filter(d => d.status === 'warning').length;

  const uptime = total > 0 ? ((online / total) * 100).toFixed(1) : '0';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="dark:bg-card dark:border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Network Uptime</p>
            <Activity className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="flex items-center pt-2">
            <div className="text-2xl font-bold dark:text-slate-50">{uptime}%</div>
            <div className="ml-auto flex items-baseline text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight className="mr-1 h-3 w-3" />
              Stable
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-card dark:border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Devices</p>
            <Server className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex items-center pt-2">
            <div className="text-2xl font-bold dark:text-slate-50">{total}</div>
            <div className="ml-auto flex items-baseline text-xs font-medium text-slate-500 dark:text-slate-400">
              Across 4 Zones
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-card dark:border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Alerts</p>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="flex items-center pt-2">
            <div className="text-2xl font-bold dark:text-slate-50">{offline + warning}</div>
            {offline > 0 ? (
               <div className="ml-auto flex items-baseline text-xs font-medium text-red-600 dark:text-red-400">
                 <ArrowDownRight className="mr-1 h-3 w-3" />
                 {offline} Critical
               </div>
            ) : (
                <div className="ml-auto flex items-baseline text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    All Systems Operational
                </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-card dark:border-slate-700/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Avg Latency</p>
            <Wifi className="h-4 w-4 text-purple-500" />
          </div>
          <div className="flex items-center pt-2">
            <div className="text-2xl font-bold dark:text-slate-50">12ms</div>
            <div className="ml-auto flex items-baseline text-xs font-medium text-slate-500 dark:text-slate-400">
              Global Average
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};