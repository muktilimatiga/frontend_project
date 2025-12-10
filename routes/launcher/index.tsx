
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
         <div className="flex items-center justify-between p-6 border-b border-border bg-surface-elevated">
            <h2 className="text-xl font-bold text-foreground">Add New Item</h2>
            <button onClick={() => setIsAddMenuOpen(false)} className="text-foreground-muted hover:text-foreground transition-colors">
                <X className="h-6 w-6" />
            </button>
         </div>
         <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 bg-background">
            {/* New Config */}
            <button 
                onClick={() => openModal('config')}
                className="flex flex-col items-center justify-center p-6 bg-surface border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-primary/50 transition-all group"
            >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Settings className="h-7 w-7 text-primary" />
                </div>
                <span className="font-semibold text-foreground">New Config</span>
            </button>

            {/* New Config Batch (Placeholder) */}
            <button 
                className="flex flex-col items-center justify-center p-6 bg-surface border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-secondary transition-all group opacity-50 cursor-not-allowed"
                title="Coming Soon"
            >
                <div className="h-14 w-14 rounded-2xl bg-secondary/20 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Layers className="h-7 w-7 text-secondary-foreground" />
                </div>
                <span className="font-semibold text-foreground">New Config Batch</span>
            </button>

            {/* New Ticket */}
            <button 
                onClick={() => openModal('create_ticket')}
                className="flex flex-col items-center justify-center p-6 bg-surface border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-success/50 transition-all group"
            >
                <div className="h-14 w-14 rounded-2xl bg-success/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Ticket className="h-7 w-7 text-success" />
                </div>
                <span className="font-semibold text-foreground">New Ticket</span>
            </button>

            {/* Config Bridge */}
            <button 
                onClick={() => openModal('config_bridge')}
                className="flex flex-col items-center justify-center p-6 bg-surface border border-border rounded-2xl shadow-sm hover:shadow-md hover:border-warning/50 transition-all group"
            >
                <div className="h-14 w-14 rounded-2xl bg-warning/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Network className="h-7 w-7 text-warning" />
                </div>
                <span className="font-semibold text-foreground">Config Bridge</span>
            </button>
         </div>
      </ModalOverlay>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {APPS_CONFIG.map((app) => {
          const CardContent = (
            <div className={cn(
              "h-64 flex flex-col items-center justify-center p-6 rounded-[2rem] transition-all duration-300",
              // Use app.color for Action cards to apply their specific border/bg style
              // Use bg-surface-elevated for standard app cards to pop against the bg-background
              app.isAction || app.isEmpty 
                ? app.color
                : "bg-surface-elevated border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 hover:bg-surface",
              app.isAction && "cursor-pointer group",
            )}>
              <div className={cn(
                "w-20 h-20 rounded-3xl flex items-center justify-center mb-5 transition-transform duration-300",
                // For normal apps, use their defined color for the Icon container
                // For Actions/Empty, the color is already on the parent, so keep this transparent or simple
                !app.isAction && !app.isEmpty ? app.color : "bg-transparent",
                !app.isAction && !app.isEmpty && "group-hover:scale-110"
              )}>
                <app.icon className={cn("w-8 h-8", app.iconColor)} />
              </div>
              
              <h3 className={cn(
                "text-lg font-bold mb-1",
                app.isEmpty ? "text-foreground-muted" : "text-foreground"
              )}>
                {app.title}
              </h3>
              
              <p className={cn(
                "text-xs font-medium",
                app.isEmpty ? "text-foreground-muted" : "text-foreground-secondary"
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
