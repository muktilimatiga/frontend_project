import * as React from 'react';
import { TicketCheck, AlertCircle, Timer, Forward, MoreVertical, ArrowUpRight } from 'lucide-react';
import { cn, Card } from '../../../components/ui';
import { KomplainStats } from '../../../hooks/useSupabaseStats';

// Decorative Wave Component
const WaveDecoration = ({ className }: { className?: string }) => (
  <svg 
    className={cn("absolute right-0 bottom-0 w-32 h-16 opacity-30", className)} 
    viewBox="0 0 140 60" 
    preserveAspectRatio="none"
    fill="currentColor"
  >
    <path d="M0,60 C40,55 50,40 80,35 C110,30 130,5 140,0 V60 H0 Z" />
  </svg>
);

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  colorTheme,
  loading = false,
  trend
}: { 
  title: string, 
  value: string | number, 
  icon: any, 
  colorTheme: 'green' | 'orange' | 'blue' | 'purple',
  loading?: boolean,
  trend?: string
}) => {
  
  const themes = {
    green: {
      iconBg: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
      valueColor: 'text-navy dark:text-white',
      waveColor: 'text-emerald-50 dark:text-emerald-900/30',
      trendColor: 'text-emerald-600 dark:text-emerald-400'
    },
    orange: {
      iconBg: 'bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400',
      valueColor: 'text-navy dark:text-white',
      waveColor: 'text-amber-50 dark:text-amber-900/30',
      trendColor: 'text-amber-600 dark:text-amber-400'
    },
    blue: {
      iconBg: 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
      valueColor: 'text-navy dark:text-white',
      waveColor: 'text-blue-50 dark:text-blue-900/30',
      trendColor: 'text-blue-600 dark:text-blue-400'
    },
    purple: {
      iconBg: 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400',
      valueColor: 'text-navy dark:text-white',
      waveColor: 'text-purple-50 dark:text-purple-900/30',
      trendColor: 'text-purple-600 dark:text-purple-400'
    }
  };

  const theme = themes[colorTheme];

  return (
    <Card className="rounded-[24px] p-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg border-white dark:border-white/10 shadow-soft">
       {/* Background Decoration */}
       <WaveDecoration className={theme.waveColor} />

       {/* Header */}
       <div className="flex justify-between items-start mb-4 relative z-10">
          <div className={cn(
              "h-12 w-12 rounded-2xl flex items-center justify-center transition-transform hover:scale-105",
              theme.iconBg
          )}>
             <Icon className="h-6 w-6" />
          </div>
          <button className="text-slate-300 hover:text-slate-500 dark:hover:text-white transition-colors">
             <MoreVertical className="h-5 w-5" />
          </button>
       </div>

       {/* Content */}
       <div className="space-y-1 relative z-10">
          <p className="text-sm font-medium text-slateBlue dark:text-slate-400 tracking-wide">{title}</p>
          {loading ? (
             <div className="h-10 w-32 rounded animate-pulse bg-slate-100 dark:bg-zinc-800" />
          ) : (
             <h3 className={cn("text-3xl font-extrabold tracking-tight", theme.valueColor)}>
                {value}
             </h3>
          )}
       </div>

       {/* Trend */}
       {trend && (
          <div className={cn("mt-4 flex items-center text-xs font-bold relative z-10", theme.trendColor)}>
             <ArrowUpRight className="h-3.5 w-3.5 mr-1.5" />
             {trend}
          </div>
       )}
    </Card>
  );
};

export const DashboardStatsGrid = ({ stats, loading }: { stats?: KomplainStats, loading?: boolean }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <StatCard 
        title="Total Balance" 
        value={stats?.totalToday ? `$${stats.totalToday * 120}` : '$0'} 
        icon={TicketCheck} 
        colorTheme="blue"
        loading={loading}
        trend="+8% To the last month"
      />
      
      <StatCard 
        title="Total Spending" 
        value={stats?.open ? `$${stats.open * 450}` : '$0'} 
        icon={AlertCircle} 
        colorTheme="orange"
        loading={loading}
        trend="Requires Attention"
      />
      
      <StatCard 
        title="Monthly Savings" 
        value={stats?.proses ? `$${stats.proses * 230}` : '$0'} 
        icon={Timer} 
        colorTheme="green"
        loading={loading}
        trend="Active Handling"
      />
      
      <StatCard 
        title="Investments" 
        value={stats?.fwdTeknis ? `$${stats.fwdTeknis * 1000}` : '$0'} 
        icon={Forward} 
        colorTheme="purple"
        loading={loading}
        trend="Field Operations"
      />
    </div>
  );
};