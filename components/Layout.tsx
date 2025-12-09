
import * as React from 'react';
import { useEffect } from 'react';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { 
  Ticket as TicketIcon, 
  Settings, 
  Users, 
  Bell, 
  Search, 
  Sun, 
  Moon, 
  Terminal, 
  Network, 
  LifeBuoy, 
  Monitor, 
  LogOut, 
  Sparkles, 
  Activity,
  Home,
  ChevronLeft,
  Database,
  Plus
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAppStore } from '../store';
import { 
    cn, 
    Button, 
    Tooltip, 
    Avatar,
} from './ui';
import { MockService } from '../mock';
import { GlobalSearch } from './GlobalSearch';
import { AIChatDrawer } from './AIChatDrawer';
import { MonitorDrawer } from './MonitorDrawer';
import { CreateTicketModal } from '../routes/dashboard/components/modals/CreateTicketModal';
import { useSupabaseStats } from '../hooks/useSupabaseStats';
import { useDevices } from '../hooks/useQueries';
import { APPS_CONFIG } from '../routes/launcher/apps';

// --- Sidebar Icon / Item Component ---
interface SidebarIconProps {
  icon: any;
  label: string;
  to?: string;
  isActive?: boolean;
  onClick?: () => void;
  isSidebarCollapsed: boolean;
  badgeCount?: number;
  badgeVariant?: 'destructive' | 'warning' | 'success' | 'info';
}

const SidebarIcon = ({ 
  icon: Icon, 
  label, 
  to, 
  isActive, 
  onClick, 
  isSidebarCollapsed,
  badgeCount,
  badgeVariant = 'destructive'
}: SidebarIconProps) => {
  
  // Determine Badge Colors based on variant and active state
  const getBadgeStyles = () => {
    if (isActive) return "bg-white text-primary shadow-sm";
    
    switch(badgeVariant) {
      case 'warning': return "bg-amber-500 text-white";
      case 'success': return "bg-emerald-500 text-white";
      case 'info': return "bg-blue-500 text-white";
      case 'destructive': default: return "bg-red-500 text-white";
    }
  };

  const getDotStyles = () => {
    switch(badgeVariant) {
        case 'warning': return "bg-amber-500 ring-amber-400/20";
        case 'success': return "bg-emerald-500 ring-emerald-400/20";
        case 'info': return "bg-blue-500 ring-blue-400/20";
        case 'destructive': default: return "bg-red-500 ring-red-400/20";
    }
  };

  const content = (
    <div 
      className={cn(
        "relative flex items-center transition-all duration-200 group",
        // Sidebar Collapsed: Centered Square (Dock style)
        isSidebarCollapsed 
          ? "w-10 h-10 justify-center rounded-xl mx-auto mb-2" 
          : "px-3 py-2.5 gap-3 rounded-lg mx-2 mb-1",
        
        isActive 
          ? "bg-primary text-white shadow-md shadow-blue-500/20 font-medium" 
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10"
      )}
    >
      <Icon 
        className={cn(
          "shrink-0 transition-transform duration-200", 
          isSidebarCollapsed ? "h-5 w-5" : "h-4.5 w-4.5",
          isActive && !isSidebarCollapsed ? "" : "group-hover:scale-105"
        )} 
      />
      
      {!isSidebarCollapsed && (
        <span className="text-sm whitespace-nowrap overflow-hidden flex-1">
          {label}
        </span>
      )}

      {!isSidebarCollapsed && badgeCount !== undefined && badgeCount > 0 && (
         <span className={cn(
             "text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto min-w-[18px] text-center",
             getBadgeStyles()
         )}>
            {badgeCount > 99 ? '99+' : badgeCount}
         </span>
      )}

      {isSidebarCollapsed && badgeCount !== undefined && badgeCount > 0 && (
          <span className={cn(
              "absolute -top-1 -right-1 h-3 w-3 rounded-full ring-2 ring-white dark:ring-[#09090b]",
              getDotStyles()
          )} />
      )}
    </div>
  );

  const wrapperClass = "block w-full focus:outline-none relative";

  if (isSidebarCollapsed) {
    const wrapped = (
      <Tooltip text={label + (badgeCount ? ` (${badgeCount})` : '')}>
         {content}
      </Tooltip>
    );
    return to ? (
      <Link to={to} className={wrapperClass}>{wrapped}</Link>
    ) : (
      <button onClick={onClick} className={wrapperClass}>{wrapped}</button>
    );
  }

  if (to) {
    return (
      <Link to={to} className={wrapperClass}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cn(wrapperClass, "text-left")}>
      {content}
    </button>
  );
};

export const Sidebar = () => {
  const { user, logout } = useAppStore();
  const { stats } = useSupabaseStats();
  const { data: devices = [] } = useDevices(true); 
  const offlineDevices = devices.filter(d => d.status === 'offline').length;

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  // Enforce collapsed state (icon mode)
  const isSidebarCollapsed = true;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-50 h-screen flex flex-col transition-all duration-300 ease-in-out border-r",
        "bg-white border-slate-200",
        "dark:bg-[#09090b] dark:border-white/5",
        "w-[70px]" // Fixed width for icon mode
      )}
    >
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto pt-6 pb-4 scrollbar-none flex flex-col gap-3">
        
        {/* Main Group */}
        <div className="flex flex-col">
           <SidebarIcon isSidebarCollapsed={isSidebarCollapsed} icon={Home} label="Launcher" to="/" isActive={isActive('/') && currentPath === '/'} />
           <SidebarIcon isSidebarCollapsed={isSidebarCollapsed} icon={Activity} label="Overview" to="/overview" isActive={isActive('/overview')} />
           <SidebarIcon 
              isSidebarCollapsed={isSidebarCollapsed} 
              icon={TicketIcon} 
              label="Tickets" 
              to="/tickets" 
              isActive={isActive('/tickets')} 
              badgeCount={stats?.open}
              badgeVariant="destructive"
           />
           <SidebarIcon isSidebarCollapsed={isSidebarCollapsed} icon={Users} label="Customers" to="/customers" isActive={isActive('/customers')} />
           <SidebarIcon isSidebarCollapsed={isSidebarCollapsed} icon={Network} label="Topology" to="/topology" isActive={isActive('/topology')} />
           <SidebarIcon 
              isSidebarCollapsed={isSidebarCollapsed} 
              icon={Monitor} 
              label="Monitor" 
              to="/monitor" 
              isActive={isActive('/monitor')}
              badgeCount={offlineDevices}
              badgeVariant="destructive"
           />
        </div>

        {/* Separator Line (Optional, keeping it clean by just gap) */}
        
        {/* System Group */}
        <div className="flex flex-col pt-2 border-t border-slate-100 dark:border-white/5 mx-3">
           <div className="mt-2">
             <SidebarIcon isSidebarCollapsed={isSidebarCollapsed} icon={Database} label="Database" to="/database" isActive={isActive('/database')} />
             <SidebarIcon isSidebarCollapsed={isSidebarCollapsed} icon={Bell} label="Logs" to="/logs" isActive={isActive('/logs')} />
             <SidebarIcon isSidebarCollapsed={isSidebarCollapsed} icon={Settings} label="Settings" to="/settings" isActive={isActive('/settings')} />
           </div>
        </div>

      </div>

      {/* Footer */}
      <div className="p-2 shrink-0 pb-4 flex flex-col gap-1 items-center">
         <SidebarIcon isSidebarCollapsed={isSidebarCollapsed} icon={LifeBuoy} label="Help Center" to="/help" isActive={isActive('/help')} />
         
         <Tooltip text="Log out">
            <button 
                onClick={logout}
                className={cn(
                    "relative flex items-center justify-center transition-all duration-200 group rounded-xl w-10 h-10",
                    "text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 dark:text-slate-400"
                )}
            >
                <LogOut className="shrink-0 h-5 w-5" />
            </button>
         </Tooltip>
      </div>
    </aside>
  );
};

export const Navbar = () => {
  const { theme, toggleTheme, toggleCli, toggleAIChat, isCliOpen, user, setCreateTicketModalOpen } = useAppStore();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const isLauncher = currentPath === '/';
  const appCount = APPS_CONFIG.filter(a => !a.isAction && !a.isEmpty).length;

  const pageTitle = () => {
     if (isLauncher) return 'Installed Applications';
     if (currentPath.includes('/overview')) return 'Dashboard';
     if (currentPath.includes('/monitor')) return 'Broadband Monitor';
     if (currentPath.includes('/tickets')) return 'Transactions';
     if (currentPath.includes('/database')) return 'Database';
     if (currentPath.includes('/logs')) return 'System Logs';
     if (currentPath.includes('/topology')) return 'Topology Template';
     if (currentPath.includes('/settings')) return 'Settings';
     if (currentPath.includes('/customers')) return 'Customer List';
     if (currentPath.includes('/maps')) return 'Network Maps';
     if (currentPath.includes('/help')) return 'Help Center';
     return 'Dashboard';
  };

  useEffect(() => {
     const handler = () => useAppStore.getState().toggleMonitor();
     document.addEventListener('toggle-monitor', handler);
     return () => document.removeEventListener('toggle-monitor', handler);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 right-0 z-40 flex h-16 items-center justify-between px-6 transition-all duration-300 ease-in-out",
        "bg-white dark:bg-[#09090b] border-b border-slate-200 dark:border-white/5",
        "left-[70px]" // Fixed left position for icon mode sidebar
      )}
    >
      {/* Left: Title */}
      <div className="flex flex-col justify-center">
         <h1 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{pageTitle()}</h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 pointer-events-auto">
        <div className="relative hidden md:block mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
               className="h-9 w-64 rounded-lg bg-slate-100 dark:bg-white/5 pl-9 pr-4 text-sm outline-none placeholder:text-slate-400 text-slate-900 dark:text-white transition-all focus:w-80 focus:ring-1 focus:ring-primary/20 border-transparent"
               placeholder="Global search..."
            />
        </div>

        {isLauncher && (
            <div className="hidden lg:flex items-center justify-center h-8 px-3 bg-slate-100 dark:bg-white/5 rounded-md border border-slate-200 dark:border-white/5 mr-1">
               <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{appCount} Apps</span>
            </div>
        )}

        {/* Primary Action Button for Tickets Page - Navbar */}
        {currentPath.includes('/tickets') && (
            <Button onClick={() => setCreateTicketModalOpen(true)} size="sm" className="hidden md:flex bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-black dark:hover:bg-slate-200 shadow-sm gap-2 mr-2">
                <Plus className="h-4 w-4" /> New Ticket
            </Button>
        )}

        <div className="flex items-center gap-1">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleAIChat} 
                className="h-9 w-9 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
            <Sparkles className="h-4.5 w-4.5" />
            </Button>

            <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleCli} 
            className={cn(
                "h-9 w-9 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
                isCliOpen && "text-primary bg-primary/10"
            )}
            >
            <Terminal className="h-4.5 w-4.5" />
            </Button>

            <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme} 
            className="h-9 w-9 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
            {theme === 'light' ? (
                <Sun className="h-4.5 w-4.5" />
            ) : (
                <Moon className="h-4.5 w-4.5" />
            )}
            </Button>

            <div className="relative">
            <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            >
                <Bell className="h-4.5 w-4.5" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500"></span>
            </Button>
            </div>
        </div>
        
        <div className="w-px h-5 bg-slate-200 dark:bg-white/10 mx-1" />

        <Avatar src={user?.avatarUrl} fallback={user?.name?.charAt(0) || 'U'} className="h-8 w-8 cursor-pointer hover:opacity-80 transition-opacity" />
      </div>
    </header>
  );
};

export const AppLayout = () => {
  const { theme, isCreateTicketModalOpen, setCreateTicketModalOpen } = useAppStore();
  
  // Effect to sync theme state with DOM
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-navy dark:text-white font-sans selection:bg-primary/20">
      <Sidebar />
      <Navbar />
      <main 
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out",
          // Explicitly set PT to 28 (7rem) to increase gap, PR/PB to 8 (2rem)
          "pt-28 pr-8 pb-8",
          "pl-[102px]" // Fixed padding for icon mode sidebar (70px sidebar + 32px gap)
        )}
      >
        <Outlet />
      </main>
      <Toaster position="bottom-right" theme={theme as 'light' | 'dark'} />
      {/* Drawers & Modals */}
      <GlobalSearch />
      <AIChatDrawer />
      <MonitorDrawer />
      {/* Global Create Ticket Modal used by Navbar */}
      <CreateTicketModal isOpen={isCreateTicketModalOpen} onClose={() => setCreateTicketModalOpen(false)} />
    </div>
  );
};
