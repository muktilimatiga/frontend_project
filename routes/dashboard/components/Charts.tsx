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
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xl ring-1 ring-slate-900/5 dark:ring-white/10">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1 uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline gap-2">
           <span className="text-2xl font-bold text-slate-900 dark:text-white tabular-nums">{payload[0].value}</span>
           <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Tickets</span>
        </div>
        <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            +8% from last week
        </div>
      </div>
    );
  }
  return null;
};

export const TrafficChart = ({ data }: { data?: TrafficData }) => {
  // Calculate total for UX
  const total = data?.reduce((acc, curr) => acc + curr.value, 0) || 0;
  
  return (
    <Card className="md:col-span-4 dark:bg-card dark:border-slate-700/50 shadow-sm flex flex-col h-full">
      <CardHeader className="flex flex-row items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800/50">
        <div className="space-y-1">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-indigo-500" />
                Ticket Traffic
            </CardTitle>
            <p className="text-sm text-slate-500 dark:text-slate-400">Inbound ticket volume over the last 7 days.</p>
        </div>
        <div className="flex items-center gap-4">
             <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Weekly Total</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{total}</p>
             </div>
             <Badge variant="outline" className="h-8 gap-1 pl-2 pr-3 bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs">Last 7 Days</span>
             </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 min-h-[350px]">
        <div className="h-full w-full pt-6 pr-4 pb-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="trafficGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#64748b'}} 
                dy={10} 
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#64748b'}} 
                tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value}
                width={40}
              />
              <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#6366f1" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#trafficGradient)" 
                activeDot={{ r: 6, strokeWidth: 4, stroke: 'var(--background)', fill: '#6366f1' }}
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
    <Card className="md:col-span-3 dark:bg-card dark:border-slate-700/50 shadow-sm flex flex-col h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
             <CardTitle className="text-base font-semibold">Distribution</CardTitle>
             <p className="text-xs text-slate-500 dark:text-slate-400">Tickets by category</p>
        </div>
        <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">
           <Filter className="h-3 w-3 mr-1" /> View All
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center items-center">
         <div className="h-[250px] w-full relative">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie
                 data={data}
                 cx="50%"
                 cy="50%"
                 innerRadius={70}
                 outerRadius={90}
                 paddingAngle={4}
                 dataKey="value"
                 stroke="none"
               >
                 {data?.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                 ))}
               </Pie>
               <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'transparent', border: 'none', boxShadow: 'none' }}
                  itemStyle={{ color: 'transparent' }} // Hide default tooltip text
                  cursor={false}
                  content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                          const data = payload[0];
                          return (
                              <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded shadow-lg dark:bg-white dark:text-black font-medium">
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
                <span className="text-3xl font-bold text-slate-900 dark:text-white">
                    {data?.reduce((acc, curr) => acc + curr.value, 0)}
                </span>
                <span className="text-xs text-slate-500 uppercase font-medium tracking-wide">Total</span>
           </div>
         </div>
         
         <div className="w-full grid grid-cols-2 gap-3 mt-4 px-4">
              {data?.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50">
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="truncate flex-1">{entry.name}</span>
                  <span className="font-semibold text-slate-900 dark:text-white">{entry.value}</span>
                </div>
              ))}
         </div>
      </CardContent>
    </Card>
  );
};
