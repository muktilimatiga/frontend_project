
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
  ModalOverlay
} from '../../components/ui';
import { ConfigModal } from '../dashboard/components/modals';
import { APPS_CONFIG } from './apps';
import { useAppStore } from '../../store';

export const LauncherPage = () => {
  const { setCreateTicketModalOpen } = useAppStore();
  const [modalType, setModalType] = useState<'none' | 'config' | 'config_bridge' | 'config_batch'>('none');
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const openModal = (type: 'create_ticket' | 'config' | 'config_bridge' | 'config_batch') => {
      setIsAddMenuOpen(false);
      if (type === 'create_ticket') {
          setCreateTicketModalOpen(true);
      } else {
          setModalType(type);
      }
  };

  return (
    <div className="p-8 md:p-12 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <ConfigModal isOpen={modalType === 'config'} onClose={() => setModalType('none')} type="basic" />
      <ConfigModal isOpen={modalType === 'config_bridge'} onClose={() => setModalType('none')} type="bridge" />
      <ConfigModal isOpen={modalType === 'config_batch'} onClose={() => setModalType('none')} type="batch" />

      {/* Add New Item Menu Modal */}
      <ModalOverlay isOpen={isAddMenuOpen} onClose={() => setIsAddMenuOpen(false)} hideCloseButton className="max-w-2xl p-0 overflow-hidden rounded-xl border border-border shadow-2xl">
         <div className="flex items-center justify-between p-6 border-b border-border bg-surface">
            <h2 className="text-xl font-bold text-foreground">Add New Item</h2>
            <button onClick={() => setIsAddMenuOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-secondary">
                <X className="h-6 w-6" />
            </button>
         </div>
         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-background">
            <button 
                onClick={() => openModal('config')}
                className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-xl shadow-sm hover:border-primary hover:shadow-md transition-all group"
            >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <Settings className="h-7 w-7 text-primary" />
                </div>
                <span className="font-bold text-lg text-foreground">New Config</span>
            </button>

            <button 
                onClick={() => openModal('config_batch')}
                className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-xl shadow-sm hover:border-primary hover:shadow-md transition-all group"
            >
                <div className="h-14 w-14 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:bg-secondary-foreground/10 transition-colors">
                    <Layers className="h-7 w-7 text-secondary-foreground" />
                </div>
                <span className="font-bold text-lg text-foreground">New Config Batch</span>
            </button>

            <button 
                onClick={() => openModal('create_ticket')}
                className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-xl shadow-sm hover:border-success hover:shadow-md transition-all group"
            >
                <div className="h-14 w-14 rounded-xl bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors dark:bg-green-900/30">
                    <Ticket className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <span className="font-bold text-lg text-foreground">New Ticket</span>
            </button>

            <button 
                onClick={() => openModal('config_bridge')}
                className="flex flex-col items-center justify-center p-8 bg-card border border-border rounded-xl shadow-sm hover:border-warning hover:shadow-md transition-all group"
            >
                <div className="h-14 w-14 rounded-xl bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors dark:bg-amber-900/30">
                    <Network className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                </div>
                <span className="font-bold text-lg text-foreground">Config Bridge</span>
            </button>
         </div>
      </ModalOverlay>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-6">
        {APPS_CONFIG.map((app) => {
          const CardContent = (
            <div className={cn(
              "h-60 flex flex-col items-center justify-center p-8 rounded-3xl transition-all duration-300 relative overflow-hidden",
              app.color,
              app.isAction && "cursor-pointer",
            )}>
              <div className={cn(
                "mb-6 transition-transform duration-300 group-hover:scale-110",
                app.id === 'new' ? "mb-4" : ""
              )}>
                <app.icon strokeWidth={1.5} className={cn("w-10 h-10", app.iconColor)} />
              </div>
              
              <h3 className={cn(
                "text-xl font-bold mb-2 tracking-tight",
                app.isEmpty ? "text-muted-foreground" : "text-foreground"
              )}>
                {app.title}
              </h3>
              
              <p className={cn(
                "text-sm font-medium",
                app.isEmpty ? "text-muted-foreground/60" : "text-muted-foreground"
              )}>
                {app.subtitle}
              </p>
            </div>
          );

          if (app.id === 'new') {
             return (
               <div key={app.id} className="block outline-none cursor-pointer group select-none" onClick={() => setIsAddMenuOpen(true)}>
                 {CardContent}
               </div>
             );
          }

          if (app.to) {
            return (
              <Link key={app.id} to={app.to} className="block group outline-none select-none">
                {CardContent}
              </Link>
            );
          }

          return (
            <div key={app.id} className="block outline-none group select-none">
              {CardContent}
            </div>
          );
        })}
      </div>
    </div>
  );
};
