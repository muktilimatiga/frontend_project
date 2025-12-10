
import * as React from 'react';
import { TicketCheck, AlertCircle, Timer, Forward, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn, Card } from '../../../components/ui';
import { KomplainStats } from '../../../hooks/useSupabaseStats';

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  colorTheme,
  loading = false,
  trend,
  trendDirection = 'up'
}: { 
  title: string, 
  value: string | number, 
  icon: any, 
  colorTheme: 'green' | 'orange' | 'blue' | 'purple',
  loading?: boolean,
  trend?: string,
  trendDirection?: 'up' | 'down'
}) => {
  
  const themes = {
    green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
    orange: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
    blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400',
    purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
  };

  const iconColor = themes[colorTheme];

  return (
    <Card className="p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
       <div className="flex justify-between items-start mb-2">
          <div>
             <p className="text-sm font-medium text-muted-foreground">{title}</p>
             {loading ? (
                <div className="h-8 w-24 mt-1 rounded bg-secondary animate-pulse" />
             ) : (
                <h3 className="text-2xl font-bold tracking-tight text-foreground mt-1">
                   {value}
                </h3>
             )}
          </div>
          <div className={cn("p-2 rounded-md", iconColor)}>
             <Icon className="h-5 w-5" />
          </div>
       </div>

       {trend && (
          <div className="flex items-center gap-1.5 mt-2">
             <span className={cn(
                 "flex items-center text-xs font-semibold px-1.5 py-0.5 rounded",
                 trendDirection === 'up' 
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400" 
                    : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
             )}>
                 {trendDirection === 'up' ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                 {trend}
             </span>
             <span className="text-xs text-muted-foreground">vs last month</span>
          </div>
       )}
    </Card>
  );
};

export const DashboardStatsGrid = ({ stats, loading }: { stats?: KomplainStats, loading?: boolean }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total Balance" 
        value={stats?.totalToday ? `$${stats.totalToday * 120}` : '$0'} 
        icon={TicketCheck} 
        colorTheme="blue"
        loading={loading}
        trend="8%"
        trendDirection="up"
      />
      
      <StatCard 
        title="Total Spending" 
        value={stats?.open ? `$${stats.open * 450}` : '$0'} 
        icon={AlertCircle} 
        colorTheme="orange"
        loading={loading}
        trend="2.1%"
        trendDirection="down"
      />
      
      <StatCard 
        title="Monthly Savings" 
        value={stats?.proses ? `$${stats.proses * 230}` : '$0'} 
        icon={Timer} 
        colorTheme="green"
        loading={loading}
        trend="12%"
        trendDirection="up"
      />
      
      <StatCard 
        title="Investments" 
        value={stats?.fwdTeknis ? `$${stats.fwdTeknis * 1000}` : '$0'} 
        icon={Forward} 
        colorTheme="purple"
        loading={loading}
        trend="4.5%"
        trendDirection="up"
      />
    </div>
  );
};
