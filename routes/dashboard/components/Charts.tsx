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
      <div className="bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200 dark:border-white/10 p-3 rounded-2xl shadow-xl ring-1 ring-slate-900/5 dark:ring-white/10 text-xs">
        <p className="font-bold text-slate-500 dark:text-zinc-400 mb-1">{label}</p>
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
  
  return (
    <Card className="md:col-span-4 dark:bg-[#121214] dark:border-white/5 shadow-soft flex flex-col h-[420px] rounded-3xl overflow-hidden border-transparent">
      <CardHeader className="flex flex-row items-center justify-between py-6 px-8 border-b border-slate-50 dark:border-white/5">
        <div className="flex flex-col">
            <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Ticket Traffic</CardTitle>
            <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium mt-1">Weekly Overview</span>
        </div>
        <div className="text-right">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full mb-1">
                <TrendingUp className="h-3 w-3" /> +12.5%
            </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative min-h-0">
        <div className="absolute inset-0 pt-6 pb-2 pr-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" strokeOpacity={0.1} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#71717a', fontWeight: 500}} 
                dy={15} 
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#71717a', fontWeight: 500}} 
                tickCount={5}
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 2, opacity: 0.1 }} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={4} 
                fillOpacity={1} 
                fill="url(#trafficGradient)" 
                activeDot={{ 
                  r: 6, 
                  strokeWidth: 4,
                  stroke: '#fff' 
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
    <Card className="md:col-span-3 dark:bg-[#121214] dark:border-white/5 shadow-soft flex flex-col h-[420px] rounded-3xl overflow-hidden border-transparent">
      <CardHeader className="flex flex-row items-center justify-between py-6 px-8 border-b border-slate-50 dark:border-white/5">
        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Distribution</CardTitle>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="border-slate-200 text-slate-500 font-normal bg-white dark:bg-black dark:border-white/10 px-3 py-1">
              By OLT
           </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center items-center p-0 relative">
         <div className="h-[240px] w-full relative mt-2">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie
                 data={data}
                 cx="50%"
                 cy="50%"
                 innerRadius={80}
                 outerRadius={105}
                 paddingAngle={5}
                 dataKey="value"
                 stroke="none"
                 cornerRadius={12}
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
                              <div className="bg-slate-900 dark:bg-white text-white dark:text-black text-xs px-4 py-2 rounded-xl shadow-xl font-bold">
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
                <span className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {data?.reduce((acc, curr) => acc + curr.value, 0)}
                </span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Total</span>
           </div>
         </div>
         
         <div className="w-full grid grid-cols-2 gap-x-8 gap-y-3 px-8 pb-8">
              {data?.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-slate-600 dark:text-zinc-400 font-semibold truncate max-w-[80px]" title={entry.name}>{entry.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">{entry.value}</span>
                </div>
              ))}
         </div>
      </CardContent>
    </Card>
  );
};
