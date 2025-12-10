
import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { 
  Ticket as TicketIcon, 
  Settings, 
  Users, 
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
  Database,
  Plus,
  ScrollText,
  Check
} from 'lucide-react';
import { Toaster } from 'sonner';
import { useAppStore } from '../store';
import { 
    cn, 
    Button, 
    Tooltip, 
    Avatar,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator
} from './ui';
import { GlobalSearch } from './GlobalSearch';
import { AIChatDrawer } from './AIChatDrawer';
import { MonitorDrawer } from './MonitorDrawer';
import { CreateTicketModal } from '../routes/dashboard/components/modals/CreateTicketModal';
import { useSupabaseStats } from '../hooks/useSupabaseStats';
import { useDevices } from '../hooks/useQueries';
import { APPS_CONFIG } from '../routes/launcher/apps';
import { NotificationDropdown } from './NotificationDropdown';
import { supabase } from '../lib/supabaseClient';
import { User } from '../types';

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
  
  const getBadgeStyles = () => {
    switch(badgeVariant) {
      case 'warning': return "bg-warning text-warning-foreground";
      case 'success': return "bg-success text-success-foreground";
      case 'info': return "bg-blue-600 text-white";
      case 'destructive': default: return "bg-danger text-white";
    }
  };

  const getDotStyles = () => {
    switch(badgeVariant) {
        case 'warning': return "bg-warning";
        case 'success': return "bg-success";
        case 'info': return "bg-blue-500";
        case 'destructive': default: return "bg-danger";
    }
  };

  const content = (
    <div 
      className={cn(
        "relative flex items-center transition-all duration-200 ease-out group select-none",
        isSidebarCollapsed 
          ? "w-10 h-10 justify-center rounded-md mx-auto mb-2" 
          : "px-3 py-2 gap-3 rounded-md mx-2 mb-1",
        
        isActive 
          ? "bg-sidebar-active text-white shadow-sm"
          : "text-sidebar-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <Icon 
        strokeWidth={isActive ? 2.5 : 2}
        className={cn(
          "shrink-0 transition-all", 
          isSidebarCollapsed ? "h-5 w-5" : "h-4 w-4",
        )} 
      />
      
      {!isSidebarCollapsed && (
        <span className="text-sm font-medium whitespace-nowrap overflow-hidden flex-1 tracking-tight">
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
              "absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background",
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
  const { logout } = useAppStore();
  const { stats } = useSupabaseStats();
  const { data: devices = [] } = useDevices(true); 
  const offlineDevices = devices.filter(d => d.status === 'offline').length;

  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isSidebarCollapsed = true;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-50 h-screen flex flex-col transition-all duration-300 ease-in-out border-r",
        "bg-background border-border", 
        "w-[64px]"
      )}
    >
      <div className="flex-1 overflow-y-auto pt-4 pb-4 scrollbar-none flex flex-col items-center">
        
        <div className="flex flex-col w-full gap-1">
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

        <div className="flex flex-col w-full mt-4 pt-4 border-t border-border gap-1">
             <SidebarIcon isSidebarCollapsed={isSidebarCollapsed} icon={Database} label="Database" to="/database" isActive={isActive('/database')} />
             <SidebarIcon isSidebarCollapsed={isSidebarCollapsed} icon={ScrollText} label="Logs" to="/logs" isActive={isActive('/logs')} />
             <SidebarIcon isSidebarCollapsed={isSidebarCollapsed} icon={LifeBuoy} label="Help Center" to="/help" isActive={isActive('/help')} />
        </div>

      </div>

      <div className="p-2 shrink-0 pb-6 flex flex-col gap-2 items-center border-t border-border pt-4">
         <SidebarIcon isSidebarCollapsed={isSidebarCollapsed} icon={Settings} label="Settings" to="/settings" isActive={isActive('/settings')} />
         
         <Tooltip text="Log out">
            <button 
                onClick={logout}
                className="relative flex items-center justify-center transition-all duration-200 group rounded-md w-10 h-10 text-muted-foreground hover:text-danger hover:bg-danger/10"
            >
                <LogOut className="shrink-0 h-5 w-5" strokeWidth={2} />
            </button>
         </Tooltip>
      </div>
    </aside>
  );
};

export const Navbar = () => {
  const { theme, toggleTheme, toggleCli, toggleAIChat, isCliOpen, user, setCreateTicketModalOpen, login, logout } = useAppStore();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;
  const isLauncher = currentPath === '/';
  const appCount = APPS_CONFIG.filter(a => !a.isAction && !a.isEmpty).length;
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch users for switcher
    const loadUsers = async () => {
        const { data } = await supabase.from('users').select('*').limit(10);
        if(data) {
            setUsers(data.map((u: any) => ({
                id: String(u.id),
                name: u.full_name || u.username || 'User',
                email: u.username || '',
                role: u.role || 'user',
                avatarUrl: u.avatar_url
            })));
        }
    };
    loadUsers();
  }, []);

  const pageTitle = () => {
     if (isLauncher) return 'Launcher';
     if (currentPath.includes('/overview')) return 'Dashboard';
     if (currentPath.includes('/monitor')) return 'Monitor';
     if (currentPath.includes('/tickets')) return 'Tickets';
     if (currentPath.includes('/database')) return 'Database';
     if (currentPath.includes('/logs')) return 'Logs';
     if (currentPath.includes('/topology')) return 'Topology';
     if (currentPath.includes('/settings')) return 'Settings';
     if (currentPath.includes('/customers')) return 'Customers';
     if (currentPath.includes('/maps')) return 'Maps';
     if (currentPath.includes('/help')) return 'Help Center';
     return 'Nexus';
  };

  useEffect(() => {
     const handler = () => useAppStore.getState().toggleMonitor();
     document.addEventListener('toggle-monitor', handler);
     return () => document.removeEventListener('toggle-monitor', handler);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 right-0 z-40 flex h-14 items-center justify-between px-6 transition-all duration-300 ease-in-out",
        "bg-background border-b border-border",
        "left-[64px]"
      )}
    >
      <div className="flex flex-col justify-center">
         <h1 className="text-base font-semibold text-foreground tracking-tight">{pageTitle()}</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input 
               className="h-8 w-64 rounded-md bg-secondary pl-8 pr-3 text-xs outline-none placeholder:text-muted-foreground text-foreground transition-all focus:ring-1 focus:ring-primary border border-transparent"
               placeholder="Global search..."
            />
        </div>

        <div className="flex items-center gap-1.5">
            {currentPath.includes('/tickets') && (
                <Button onClick={() => setCreateTicketModalOpen(true)} size="sm" className="hidden md:flex h-8 gap-2 mr-2">
                    <Plus className="h-3.5 w-3.5" /> New
                </Button>
            )}

            <Tooltip text="AI Assistant">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleAIChat} 
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                    <Sparkles className="h-4 w-4" />
                </Button>
            </Tooltip>

            <Tooltip text="Terminal">
                <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleCli} 
                className={cn(
                    "h-8 w-8 text-muted-foreground hover:text-foreground",
                    isCliOpen && "text-primary bg-primary/10"
                )}
                >
                <Terminal className="h-4 w-4" />
                </Button>
            </Tooltip>

            <Tooltip text="Toggle Theme">
                <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleTheme} 
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                {theme === 'light' ? (
                    <Sun className="h-4 w-4" />
                ) : (
                    <Moon className="h-4 w-4" />
                )}
                </Button>
            </Tooltip>

            <Tooltip text="Notifications">
                <div className="relative">
                    <NotificationDropdown />
                </div>
            </Tooltip>
        </div>
        
        <div className="pl-2 border-l border-border ml-1">
            <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                    <Avatar src={user?.avatarUrl} fallback={user?.name?.charAt(0) || 'U'} className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user?.name}</p>
                            <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Switch Account</DropdownMenuLabel>
                    {users.map((u) => (
                        <DropdownMenuItem key={u.id} onClick={() => login(u)}>
                            <div className="flex items-center gap-2 w-full cursor-pointer">
                                <Avatar src={u.avatarUrl} fallback={u.name.charAt(0)} className="h-5 w-5" />
                                <span className="text-xs font-medium flex-1 truncate">{u.name}</span>
                                {user?.id === u.id && <Check className="h-3 w-3 text-primary" />}
                            </div>
                        </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 cursor-pointer">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export const AppLayout = () => {
  const { theme, isCreateTicketModalOpen, setCreateTicketModalOpen, fetchUser } = useAppStore();
  
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Initialize user session from Supabase
    fetchUser();
  }, [theme]);

  return (
    <div className="min-h-screen bg-secondary/30 text-foreground font-sans selection:bg-primary/20">
      <Sidebar />
      <Navbar />
      <main 
        className={cn(
          "min-h-screen transition-all duration-300 ease-in-out",
          "pt-20 pr-6 pb-6",
          "pl-[88px]" 
        )}
      >
        <Outlet />
      </main>
      <Toaster position="bottom-right" theme={theme as 'light' | 'dark'} />
      <GlobalSearch />
      <AIChatDrawer />
      <MonitorDrawer />
      <CreateTicketModal isOpen={isCreateTicketModalOpen} onClose={() => setCreateTicketModalOpen(false)} />
    </div>
  );
};
