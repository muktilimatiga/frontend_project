import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '../../../components/ui';
import { TrafficData } from '../../../types';

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b'];

export const TrafficChart = ({ data }: { data?: TrafficData }) => {
  return (
    <Card className="md:col-span-4 dark:bg-[#000000] dark:border-white/20">
      <CardHeader>
        <CardTitle>Ticket Traffic</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-white/10" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <RechartsTooltip contentStyle={{ backgroundColor: 'var(--tooltip-bg)', borderRadius: '8px', border: '1px solid var(--border)' }} />
              <Area type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const DistributionChart = ({ data }: { data?: any[] }) => {
  return (
    <Card className="md:col-span-3 dark:bg-[#000000] dark:border-white/20">
      <CardHeader>
        <CardTitle>Ticket Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
         <div className="h-[250px] w-full">
           <ResponsiveContainer width="100%" height="100%">
             <PieChart>
               <Pie
                 data={data}
                 cx="50%"
                 cy="50%"
                 innerRadius={60}
                 outerRadius={80}
                 paddingAngle={5}
                 dataKey="value"
                 stroke="none"
               >
                 {data?.map((entry, index) => (
                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                 ))}
               </Pie>
               <RechartsTooltip contentStyle={{ backgroundColor: 'var(--tooltip-bg)', borderRadius: '8px', border: '1px solid var(--border)' }} />
             </PieChart>
           </ResponsiveContainer>
           <div className="mt-4 flex justify-center gap-4 flex-wrap">
              {data?.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  {entry.name}
                </div>
              ))}
           </div>
         </div>
      </CardContent>
    </Card>
  );
};