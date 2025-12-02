
import * as React from 'react';
import { TicketCheck, AlertCircle, Timer, Forward, MoreVertical, ArrowUpRight } from 'lucide-react';
import { cn } from '../../../components/ui';
import { KomplainStats } from '../../../hooks/useSupabaseStats';

// Decorative Wave Component
const WaveDecoration = ({ className }: { className?: string }) => (
  <svg 
    className={cn("absolute right-0 bottom-0 w-32 h-16 opacity-50", className)} 
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
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400',
      valueColor: 'text-emerald-600 dark:text-emerald-400',
      waveColor: 'text-emerald-100 dark:text-emerald-900/30',
      trendColor: 'text-emerald-600 dark:text-emerald-400'
    },
    orange: {
      iconBg: 'bg-orange-50 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400',
      valueColor: 'text-orange-600 dark:text-orange-400',
      waveColor: 'text-orange-100 dark:text-orange-900/30',
      trendColor: 'text-orange-600 dark:text-orange-400'
    },
    blue: {
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
      valueColor: 'text-blue-600 dark:text-blue-400',
      waveColor: 'text-blue-100 dark:text-blue-900/30',
      trendColor: 'text-blue-600 dark:text-blue-400'
    },
    purple: {
      iconBg: 'bg-violet-50 text-violet-600 dark:bg-violet-500/20 dark:text-violet-400',
      valueColor: 'text-violet-600 dark:text-violet-400',
      waveColor: 'text-violet-100 dark:text-violet-900/30',
      trendColor: 'text-violet-600 dark:text-violet-400'
    }
  };

  const theme = themes[colorTheme];

  return (
    <div className={cn(
        "rounded-[32px] p-6 relative overflow-hidden transition-all duration-300 group border",
        "bg-white border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md",
        "dark:bg-[#121214] dark:border-white/5 dark:hover:border-white/10"
    )}>
       {/* Background Decoration */}
       <WaveDecoration className={theme.waveColor} />

       {/* Header */}
       <div className="flex justify-between items-start mb-4 relative z-10">
          <div className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
              theme.iconBg
          )}>
             <Icon className="h-6 w-6" />
          </div>
          <button className="p-2 rounded-full hover:bg-slate-50 dark:hover:bg-white/5 transition-colors opacity-60">
             <MoreVertical className="h-5 w-5 text-slate-400" />
          </button>
       </div>

       {/* Content */}
       <div className="space-y-1 relative z-10">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400 tracking-wide">{title}</p>
          {loading ? (
             <div className="h-10 w-32 rounded animate-pulse bg-slate-100 dark:bg-slate-800" />
          ) : (
             <h3 className={cn("text-4xl font-extrabold tracking-tight", theme.valueColor)}>
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
    </div>
  );
};

export const DashboardStatsGrid = ({ stats, loading }: { stats?: KomplainStats, loading?: boolean }) => {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* 1. Total Today -> Green */}
      <StatCard 
        title="Total Today" 
        value={stats?.totalToday || 0} 
        icon={TicketCheck} 
        colorTheme="green"
        loading={loading}
        trend="+12% from yesterday"
      />
      
      {/* 2. Open Tickets -> Orange */}
      <StatCard 
        title="Open Tickets" 
        value={stats?.open || 0} 
        icon={AlertCircle} 
        colorTheme="orange"
        loading={loading}
        trend="Requires Attention"
      />
      
      {/* 3. Proses -> Blue */}
      <StatCard 
        title="On Process" 
        value={stats?.proses || 0} 
        icon={Timer} 
        colorTheme="blue"
        loading={loading}
        trend="Active Handling"
      />
      
      {/* 4. Fwd Teknis -> Purple */}
      <StatCard 
        title="Forwarded Teknis" 
        value={stats?.fwdTeknis || 0} 
        icon={Forward} 
        colorTheme="purple"
        loading={loading}
        trend="Field Operations"
      />
    </div>
  );
};
