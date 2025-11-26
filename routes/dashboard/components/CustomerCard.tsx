import * as React from 'react';
import { CheckCircle2, Phone, Mail, Clock } from 'lucide-react';
import { Avatar, Button } from '../../../components/ui';
import { User } from '../../../types';

interface CustomerCardProps {
  user: User;
  onChangeUser?: () => void;
}

export const CustomerCard = ({ user, onChangeUser }: CustomerCardProps) => {
  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 p-6 animate-in fade-in slide-in-from-top-2 duration-300">
       
       {/* Header Section */}
       <div className="flex items-start gap-5">
          <div className="relative">
             <div className="h-20 w-20 rounded-full p-1 bg-gradient-to-tr from-lime-400 to-emerald-500 shadow-lg">
                <Avatar src={user.avatarUrl} fallback={user.name.charAt(0)} className="h-full w-full border-4 border-white dark:border-zinc-900" />
             </div>
          </div>
          <div className="flex-1 min-w-0 pt-1">
             <h3 className="text-xl font-bold text-slate-900 dark:text-white truncate">{user.name}</h3>
             <div className="flex items-center gap-2 mt-1 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                   {/* Flag simulation */}
                   <div className="h-3 w-4 bg-slate-200 rounded-sm overflow-hidden relative shadow-sm">
                      <div className="absolute top-0 w-full h-1/3 bg-red-500"></div>
                      <div className="absolute bottom-0 w-full h-1/3 bg-blue-500"></div>
                   </div>
                   <span className="truncate font-medium">New York, United States</span>
                </div>
             </div>
          </div>
       </div>

       {/* Stats Row */}
       <div className="flex items-center gap-6 mt-6 pb-6 border-b border-slate-100 dark:border-white/5 overflow-x-auto">
          <div className="shrink-0">
             <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Tenure</p>
             <p className="text-base font-bold text-slate-900 dark:text-white">2 Years</p>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-white/10 shrink-0" />
          <div className="shrink-0">
             <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Monthly Bill</p>
             <p className="text-base font-bold text-slate-900 dark:text-white">$59.00</p>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-white/10 shrink-0" />
          <div className="shrink-0">
             <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Open Tickets</p>
             <p className="text-base font-bold text-orange-600 dark:text-orange-400">1</p>
          </div>
          <div className="w-px h-8 bg-slate-200 dark:bg-white/10 shrink-0" />
          <div className="shrink-0">
             <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">Total Tickets</p>
             <p className="text-base font-bold text-slate-900 dark:text-white">12</p>
          </div>
       </div>

       {/* Description / Bio */}
       <div className="mt-5 space-y-2">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
             Customer has a history of latency issues during peak hours. Currently on the <span className="font-semibold text-slate-900 dark:text-white">Gamer Pro 300Mbps</span> plan. Router was last replaced in Jan 2023.
             <button className="ml-1 text-indigo-600 dark:text-indigo-400 font-medium hover:underline text-xs inline-flex items-center">View history</button>
          </p>
       </div>

       {/* Skills / Services */}
       <div className="mt-5">
          <p className="text-xs font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Active Services</p>
          <div className="flex flex-wrap gap-3">
             {['Fiber 300', 'Static IP', 'Managed WiFi'].map(service => (
                <div key={service} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-sm">
                   <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                   {service}
                </div>
             ))}
             <button className="text-xs text-slate-500 hover:text-indigo-600 underline self-center ml-1">View more</button>
          </div>
       </div>

       {/* Contact Detail */}
       <div className="mt-6">
          <p className="text-xs font-semibold text-slate-900 dark:text-white mb-3 uppercase tracking-wider">Contact Detail</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
             <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                    <Phone className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">(405) 555-0128</span>
             </div>
             <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{user.email}</span>
             </div>
          </div>
       </div>

       {/* Timeline / Meeting Section */}
       <div className="mt-6 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="flex justify-between items-center mb-4">
             <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Last Session</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">14 April 2024, IST</p>
             </div>
             <div className="text-right">
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Connection Type</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">PPPoE Session</p>
             </div>
          </div>

          <div className="relative pl-2 ml-1">
             {/* Vertical Line */}
             <div className="absolute left-[7px] top-2 bottom-2 w-0.5 border-l-2 border-dashed border-indigo-200 dark:border-indigo-900/50"></div>
             
             <div className="relative flex items-center gap-3 mb-5">
                <div className="h-4 w-4 rounded-full border-2 border-white dark:border-zinc-900 bg-blue-100 text-blue-600 flex items-center justify-center z-10 shadow-sm">
                   <Clock className="h-2.5 w-2.5" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">9:00 AM - Session Start</span>
             </div>

             <div className="relative flex items-center gap-3">
                <div className="h-4 w-4 rounded-full border-2 border-white dark:border-zinc-900 bg-emerald-100 text-emerald-600 flex items-center justify-center z-10 shadow-sm">
                   <CheckCircle2 className="h-2.5 w-2.5" />
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">10:30 AM - Signal Verified (-19dBm)</span>
             </div>
          </div>
       </div>

       {/* Footer Action */}
       {onChangeUser && (
          <div className="mt-6 flex justify-end">
             <Button 
                onClick={onChangeUser}
                className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 shadow-sm"
             >
                Change Customer
             </Button>
          </div>
       )}
    </div>
  );
};