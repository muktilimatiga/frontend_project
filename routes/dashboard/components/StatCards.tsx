import * as React from 'react';
import { Card, CardContent } from '../../../components/ui';
import { ArrowUpRight, TicketCheck, AlertCircle, Clock } from 'lucide-react';
import { DashboardStats } from '../../../types';

const StatCard = ({ title, value, icon: Icon, trend }: { title: string, value: string | number, icon: any, trend?: string }) => (
  <Card className="dark:bg-card dark:border-slate-700/50">
    <CardContent className="p-6">
      <div className="flex items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <Icon className="h-4 w-4 text-slate-400" />
      </div>
      <div className="flex items-center pt-2">
        <div className="text-2xl font-bold dark:text-slate-50">{value}</div>
        {trend && (
          <div className="ml-auto flex items-baseline text-xs font-medium text-emerald-600 dark:text-emerald-400">
            <ArrowUpRight className="mr-1 h-3 w-3" />
            {trend}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
);

export const DashboardStatsGrid = ({ stats }: { stats?: DashboardStats }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Tickets" value={stats?.totalTickets || 0} icon={TicketCheck} trend="+12.5%" />
      <StatCard title="Open Tickets" value={stats?.openTickets || 0} icon={AlertCircle} />
      <StatCard title="Resolved" value={stats?.resolvedTickets || 0} icon={TicketCheck} trend="+4.3%" />
      <StatCard title="Avg Response" value={stats?.avgResponseTime || '--'} icon={Clock} />
    </div>
  );
};