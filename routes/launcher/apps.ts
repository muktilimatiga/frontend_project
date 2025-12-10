
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
    // Changed from bg-transparent to a subtle surface color for better visibility
    color: 'bg-surface border-2 border-dashed border-border hover:border-primary/50 hover:bg-surface-elevated',
    iconColor: 'text-foreground-muted group-hover:text-primary',
    isAction: true
  },
  {
    id: 'analytics',
    title: 'Overview',
    subtitle: 'Traffic & Stats',
    icon: Activity,
    to: '/overview',
    color: 'bg-primary/10',
    iconColor: 'text-primary'
  },
  {
    id: 'broadband',
    title: 'Broadband',
    subtitle: 'Network status',
    icon: Wifi,
    to: '/monitor',
    color: 'bg-warning/10',
    iconColor: 'text-warning'
  },
  {
    id: 'database',
    title: 'Database',
    subtitle: 'Data management',
    icon: Database,
    to: '/database',
    color: 'bg-danger/10',
    iconColor: 'text-danger'
  },
  {
    id: 'logs',
    title: 'Logs',
    subtitle: 'System logs',
    icon: ScrollText,
    to: '/logs',
    color: 'bg-success/10',
    iconColor: 'text-success'
  },
  {
    id: 'template',
    title: 'Template',
    subtitle: 'Layouts',
    icon: LayoutTemplate,
    to: '/topology',
    color: 'bg-secondary',
    iconColor: 'text-foreground'
  },
  {
    id: 'tickets',
    title: 'Transactions',
    subtitle: 'Ticket management',
    icon: Ticket,
    to: '/tickets',
    color: 'bg-primary/20',
    iconColor: 'text-primary'
  },
  {
    id: 'empty',
    title: 'Empty Slot',
    subtitle: 'Available space',
    icon: Loader2,
    color: 'bg-transparent border-2 border-dashed border-border opacity-50',
    iconColor: 'text-foreground-muted',
    isEmpty: true
  }
];
