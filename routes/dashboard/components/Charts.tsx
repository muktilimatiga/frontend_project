
import * as React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../../../components/ui';
import { TrafficData } from '../../../types';
import { TrendingUp, Calendar, BarChart3, Filter } from 'lucide-react';

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200 dark:border-zinc-800 p-3 rounded-lg shadow-xl ring-1 ring-slate-900/5 dark:ring-white/10 text-xs">
        <p className="font-semibold text-slate-500 dark:text-zinc-400 mb-1">{label}</p>
        <div className="flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"></span>
           <span className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">{payload[0].value}</span>
           <span className="text-slate-500 dark:text-zinc-500">Tickets</span>
        </div>
      </div>
    );
  }
  return null;
};

export const TrafficChart = ({ data }: { data?: TrafficData }) => {
  const total = data?.reduce((acc, curr) => acc + curr.value, 0) || 0;
  
  return (
    <Card className="md:col-span-4 dark:bg-card dark:border-zinc-800 shadow-sm flex flex-col h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-slate-100 dark:border-zinc-800/50 bg-slate-50/30 dark:bg-slate-900/20">
        <div className="flex flex-col">
            <CardTitle className="text-base font-semibold text-slate-800 dark:text-white">Ticket Traffic</CardTitle>
            <span className="text-xs text-slate-500 dark:text-zinc-500 font-medium">Last 7 Days</span>
        </div>
        <div className="text-right">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full mb-1">
                <TrendingUp className="h-3 w-3" /> +12.5%
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{total}</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative min-h-0">
        <div className="absolute inset-0 pt-4 pb-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.3} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: '#94a3b8'}} 
                dy={10} 
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 11, fill: '#94a3b8'}} 
                tickCount={5}
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.3 }} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#trafficGradient)" 
                activeDot={{ 
                  r: 6, 
                  strokeWidth: 4, 
                  stroke: 'var(--background)',
                  fill: '#6366f1' 
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const DistributionChart = ({ data }: { data?: any[] }) => {
  return (
    <Card className="md:col-span-3 dark:bg-card dark:border-zinc-800 shadow-sm flex flex-col h-[400px]">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-slate-100 dark:border-zinc-800/50 bg-slate-50/30 dark:bg-slate-900/20">
        <CardTitle className="text-base font-semibold text-slate-800 dark:text-white">Distribution</CardTitle>
        <Badge variant="outline" className="dark:border-zinc-700 dark:text-zinc-400 font-normal bg-white dark:bg-black">
           By OLT
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center items-center p-0 relative">
         <div className="h-[220px] w-full relative mt-4">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie
                 data={data}
                 cx="50%"
                 cy="50%"
                 innerRadius={75}
                 outerRadius={95}
                 paddingAngle={4}
                 dataKey="value"
                 stroke="none"
               >
                 {data?.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="outline-none" />
                 ))}
               </Pie>
               <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}
                  itemStyle={{ color: 'transparent' }} 
                  cursor={false}
                  content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                          const data = payload[0];
                          return (
                              <div className="bg-slate-800 text-white text-xs px-3 py-1.5 rounded-full shadow-lg font-medium border border-slate-700">
                                  {data.name}: {data.value}
                              </div>
                          )
                      }
                      return null;
                  }}
               />
             </PieChart>
           </ResponsiveContainer>
           
           {/* Center Text */}
           <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {data?.reduce((acc, curr) => acc + curr.value, 0)}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1">Total</span>
           </div>
         </div>
         
         <div className="w-full grid grid-cols-2 gap-x-8 gap-y-3 px-8 pb-8">
              {data?.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full ring-2 ring-opacity-20" style={{ backgroundColor: COLORS[index % COLORS.length], '--tw-ring-color': COLORS[index % COLORS.length] } as any} />
                    <span className="text-slate-600 dark:text-zinc-400 font-medium truncate max-w-[80px]" title={entry.name}>{entry.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px]">{entry.value}</span>
                </div>
              ))}
         </div>
      </CardContent>
    </Card>
  );
};
