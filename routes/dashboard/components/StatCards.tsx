import * as React from 'react';
import { Card, CardContent } from '../../../components/ui';
import { ArrowUpRight, TicketCheck, AlertCircle, Clock, Timer, Forward } from 'lucide-react';
import { cn } from '../../../components/ui';
import { KomplainStats } from '../../../hooks/useSupabaseStats';

const StatCard = ({ title, value, icon: Icon, trend, colorClass = "text-indigo-500", loading = false }: { title: string, value: string | number, icon: any, trend?: string, colorClass?: string, loading?: boolean }) => (
  <Card className="relative overflow-hidden border-slate-100 dark:border-white/5">
    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
       <Icon className="w-24 h-24 text-slate-900 dark:text-white" />
    </div>
    <CardContent className="p-6 relative z-10">
      <div className="flex items-center justify-between pb-4">
        <div className={cn("h-12 w-12 rounded-xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-110", "bg-white dark:bg-zinc-900/50 border-slate-100 dark:border-white/10")}>
           <Icon className={cn("h-6 w-6", colorClass)} />
        </div>
        {trend && (
          <div className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
            <ArrowUpRight className="mr-1 h-3 w-3" />
            {trend}
          </div>
        )}
      </div>
      <div className="space-y-1">
        {loading ? (
          <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 animate-pulse rounded" />
        ) : (
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
        )}
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
      </div>
    </CardContent>
  </Card>
);

export const DashboardStatsGrid = ({ stats, loading }: { stats?: KomplainStats, loading?: boolean }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total Tickets (Today)" 
        value={stats?.totalToday || 0} 
        icon={TicketCheck} 
        colorClass="text-indigo-500 dark:text-indigo-400"
        loading={loading}
      />
      <StatCard 
        title="Open Tickets" 
        value={stats?.open || 0} 
        icon={AlertCircle} 
        colorClass="text-red-500 dark:text-red-400"
        loading={loading}
      />
      <StatCard 
        title="Proses Tickets" 
        value={stats?.proses || 0} 
        icon={Timer} 
        colorClass="text-amber-500 dark:text-amber-400"
        loading={loading}
      />
      <StatCard 
        title="Fwd Teknis" 
        value={stats?.fwdTeknis || 0} 
        icon={Forward} 
        colorClass="text-blue-500 dark:text-blue-400"
        loading={loading}
      />
    </div>
  );
};