
import * as React from 'react';
import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { 
  Settings,
  Network,
  X,
  Layers,
  Ticket,
  Plus
} from 'lucide-react';
import { 
  Card, 
  cn, 
  Badge,
  ModalOverlay
} from '../../components/ui';
import { ConfigModal } from '../dashboard/components/modals';
import { APPS_CONFIG } from './apps';
import { useAppStore } from '../../store';

export const LauncherPage = () => {
  const { setCreateTicketModalOpen } = useAppStore();
  const [modalType, setModalType] = useState<'none' | 'config' | 'config_bridge'>('none');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const openModal = (type: 'create_ticket' | 'config' | 'config_bridge') => {
      setIsAddMenuOpen(false);
      if (type === 'create_ticket') {
          setCreateTicketModalOpen(true);
      } else {
          setModalType(type);
      }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* CreateTicketModal is Global now */}
      <ConfigModal isOpen={modalType === 'config'} onClose={() => setModalType('none')} type="basic" />
      <ConfigModal isOpen={modalType === 'config_bridge'} onClose={() => setModalType('none')} type="bridge" />

      {/* Add New Item Menu Modal */}
      <ModalOverlay isOpen={isAddMenuOpen} onClose={() => setIsAddMenuOpen(false)} hideCloseButton className="max-w-2xl p-0 overflow-hidden rounded-3xl">
         <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/10 bg-white dark:bg-black">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Item</h2>
            <button onClick={() => setIsAddMenuOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X className="h-6 w-6" />
            </button>
         </div>
         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 dark:bg-white/5">
            {/* New Config */}
            <button 
                onClick={() => openModal('config')}
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/50 transition-all group"
            >
                <div className="h-14 w-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Settings className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">New Config</span>
            </button>

            {/* New Config Batch (Placeholder) */}
            <button 
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md hover:border-purple-200 dark:hover:border-purple-900/50 transition-all group opacity-50 cursor-not-allowed"
                title="Coming Soon"
            >
                <div className="h-14 w-14 rounded-2xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Layers className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">New Config Batch</span>
            </button>

            {/* New Ticket */}
            <button 
                onClick={() => openModal('create_ticket')}
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all group"
            >
                <div className="h-14 w-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Ticket className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">New Ticket</span>
            </button>

            {/* Config Bridge */}
            <button 
                onClick={() => openModal('config_bridge')}
                className="flex flex-col items-center justify-center p-6 bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-2xl shadow-sm hover:shadow-md hover:border-orange-200 dark:hover:border-orange-900/50 transition-all group"
            >
                <div className="h-14 w-14 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Network className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="font-semibold text-slate-900 dark:text-white">Config Bridge</span>
            </button>
         </div>
      </ModalOverlay>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {APPS_CONFIG.map((app) => {
          const CardContent = (
            <div className={cn(
              "h-64 flex flex-col items-center justify-center p-6 rounded-[2rem] transition-all duration-300",
              app.isAction || app.isEmpty 
                ? "bg-transparent" 
                : "bg-white dark:bg-black border border-slate-100 dark:border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 dark:shadow-none",
              app.isAction && "cursor-pointer group hover:bg-slate-50 dark:hover:bg-white/5 " + app.color,
              app.isEmpty && app.color
            )}>
              <div className={cn(
                "w-20 h-20 rounded-3xl flex items-center justify-center mb-5 transition-transform duration-300",
                app.color,
                (app.isAction || app.isEmpty) && "border-none bg-transparent",
                !app.isAction && !app.isEmpty && "group-hover:scale-110"
              )}>
                <app.icon className={cn("w-8 h-8", app.iconColor)} />
              </div>
              
              <h3 className={cn(
                "text-lg font-bold mb-1",
                app.isEmpty ? "text-slate-300 dark:text-slate-600" : "text-slate-900 dark:text-white"
              )}>
                {app.title}
              </h3>
              
              <p className={cn(
                "text-xs font-medium",
                app.isEmpty ? "text-slate-300 dark:text-slate-600" : "text-slate-400 dark:text-slate-500"
              )}>
                {app.subtitle}
              </p>
            </div>
          );

          if (app.id === 'new') {
             return (
               <div key={app.id} className="block outline-none cursor-pointer" onClick={() => setIsAddMenuOpen(true)}>
                 {CardContent}
               </div>
             );
          }

          if (app.to) {
            return (
              <Link key={app.id} to={app.to} className="block group outline-none">
                {CardContent}
              </Link>
            );
          }

          return (
            <div key={app.id} className="block outline-none">
              {CardContent}
            </div>
          );
        })}
      </div>
    </div>
  );
};
