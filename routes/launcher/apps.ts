
import * as React from 'react';
import { 
  Wifi, 
  Database, 
  ScrollText, 
  LayoutTemplate, 
  Plus, 
  Loader2,
  Activity,
  Ticket
} from 'lucide-react';

export interface AppItem {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  to?: string;
  color: string;
  iconColor: string;
  isEmpty?: boolean;
  isAction?: boolean;
}

export const APPS_CONFIG: AppItem[] = [
  {
    id: 'new',
    title: 'Add New',
    subtitle: 'Install app',
    icon: Plus,
    color: 'bg-transparent border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20',
    iconColor: 'text-slate-400',
    isAction: true
  },
  {
    id: 'analytics',
    title: 'Overview',
    subtitle: 'Traffic & Stats',
    icon: Activity,
    to: '/overview',
    color: 'bg-blue-50 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    id: 'broadband',
    title: 'Broadband',
    subtitle: 'Network status',
    icon: Wifi,
    to: '/monitor',
    color: 'bg-amber-50 dark:bg-amber-900/20',
    iconColor: 'text-amber-600 dark:text-amber-400'
  },
  {
    id: 'database',
    title: 'Database',
    subtitle: 'Data management',
    icon: Database,
    to: '/database',
    color: 'bg-orange-50 dark:bg-orange-900/20',
    iconColor: 'text-orange-600 dark:text-orange-400'
  },
  {
    id: 'logs',
    title: 'Logs',
    subtitle: 'System logs',
    icon: ScrollText,
    to: '/logs',
    color: 'bg-emerald-50 dark:bg-emerald-900/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400'
  },
  {
    id: 'template',
    title: 'Template',
    subtitle: 'Layouts',
    icon: LayoutTemplate,
    to: '/topology',
    color: 'bg-indigo-50 dark:bg-indigo-900/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400'
  },
  {
    id: 'tickets',
    title: 'Transactions',
    subtitle: 'Ticket management',
    icon: Ticket,
    to: '/tickets',
    color: 'bg-pink-50 dark:bg-pink-900/20',
    iconColor: 'text-pink-600 dark:text-pink-400'
  },
  {
    id: 'empty',
    title: 'Empty Slot',
    subtitle: 'Available space',
    icon: Loader2,
    color: 'bg-transparent border-2 border-dashed border-slate-200 dark:border-white/10 opacity-50',
    iconColor: 'text-slate-300',
    isEmpty: true
  }
];
