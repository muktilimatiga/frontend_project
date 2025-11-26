import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  Settings, 
  Users, 
  Bell, 
  Search, 
  ChevronRight,
  Sun,
  Moon,
  Terminal,
  Network,
  Map,
  Database,
  LifeBuoy,
  Monitor,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
  MoreHorizontal
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { useAppStore } from '../store';
import { 
    cn, 
    Button, 
    Tooltip, 
    ModalOverlay, 
    Avatar,
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator 
} from './ui';
import { MockService, MockSocket } from '../mock';
import { MonitorDrawer } from './MonitorDrawer';
import { GlobalSearch } from './GlobalSearch';

// --- Sidebar Icon / Item Component ---
const SidebarIcon = ({ 
  icon: Icon, 
  label, 
  to, 
  isActive, 
  onClick, 
  isCollapsed 
}: { 
  icon: any, 
  label: string, 
  to?: string, 
  isActive?: boolean, 
  onClick?: () => void,
  isCollapsed: boolean
}) => {
  const content = (
    <div 
      className={cn(
        "relative flex items-center transition-all duration-200 group rounded-lg mx-2 mb-1",
        isCollapsed 
          ? "justify-center p-2.5" 
          : "px-3 py-2 gap-3",
        isActive 
          ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 font-medium" 
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-zinc-800 dark:hover:text-slate-200"
      )}
    >
      <Icon className={cn("shrink-0 transition-all", isCollapsed ? "h-5 w-5" : "h-4.5 w-4.5", isActive && "stroke-[2.5px]")} />
      
      {!isCollapsed && (
        <span className="text-sm whitespace-nowrap overflow-hidden transition-all duration-300">
          {label}
        </span>
      )}

      {/* Active Indicator (Collapsed Only) */}
      {isActive && isCollapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full" />
      )} 
    </div>
  );

  if (isCollapsed) {
    const wrapped = (
      <Tooltip text={label}>
         {content}
      </Tooltip>
    );
    return to ? (
      <Link to={to} className="block w-full focus:outline-none">{wrapped}</Link>
    ) : (
      <button onClick={onClick} className="block w-full focus:outline-none">{wrapped}</button>
    );
  }

  if (to) {
    return (
      <Link to={to} className="block w-full focus:outline-none">
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className="block w-full focus:outline-none text-left">
      {content}
    </button>
  );
};

export const Sidebar = () => {
  const { user, toggleSearch, isSidebarCollapsed, toggleSidebar, logout } = useAppStore();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-50 h-screen flex flex-col border-r border-slate-200 bg-white dark:bg-zinc-950 dark:border-zinc-800 transition-all duration-300 ease-in-out",
        isSidebarCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Top: Brand */}
      <div className={cn("h-16 flex items-center shrink-0 border-b border-transparent", isSidebarCollapsed ? "justify-center" : "px-6")}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/20 cursor-pointer shrink-0 transition-transform hover:scale-105">
             <span className="text-white font-bold text-lg">N</span>
          </div>
          {!isSidebarCollapsed && (
            <span className="font-bold text-lg text-slate-900 dark:text-white whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">Nexus</span>
          )}
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-zinc-800">
        
        {/* Group 1 */}
        <div className="flex flex-col gap-0.5">
           {!isSidebarCollapsed && <div className="px-6 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80">Workspace</div>}
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Search} label="Search" onClick={toggleSearch} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={LayoutDashboard} label="Dashboard" to="/" isActive={isActive('/')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={TicketIcon} label="Tickets" to="/tickets" isActive={isActive('/tickets')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Monitor} label="Monitor" to="#" onClick={() => document.dispatchEvent(new CustomEvent('toggle-monitor'))} isActive={false} />
        </div>

        {/* Group 2 */}
        <div className="mt-4 flex flex-col gap-0.5">
           {!isSidebarCollapsed && <div className="px-6 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80">Resources</div>}
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Network} label="Topology" to="/topology" isActive={isActive('/topology')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Database} label="Database" to="/database" isActive={isActive('/database')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Map} label="Maps" to="/maps" isActive={isActive('/maps')} />
        </div>

        {/* Group 3 */}
        <div className="mt-4 flex flex-col gap-0.5">
           {!isSidebarCollapsed && <div className="px-6 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80">Support</div>}
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Users} label="Customers" to="/customers" isActive={isActive('/customers')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={LifeBuoy} label="Help Center" to="/help" isActive={isActive('/help')} />
        </div>

      </div>

      {/* Bottom Actions */}
      <div className={cn("mt-auto p-3 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/20", isSidebarCollapsed ? "flex flex-col items-center gap-3" : "space-y-1")}>
         
         {/* Collapse Toggle */}
         <button 
           onClick={toggleSidebar}
           className={cn(
             "flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors",
             isSidebarCollapsed ? "justify-center p-2" : "w-full px-3 py-2 gap-3"
           )}
           title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
         >
            {isSidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-4.5 w-4.5" />}
            {!isSidebarCollapsed && <span className="text-sm font-medium">Collapse</span>}
         </button>

         {/* Settings Link */}
         <Link 
            to="/settings" 
            className={cn(
               "flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-lg transition-colors",
               isSidebarCollapsed ? "justify-center p-2" : "w-full px-3 py-2 gap-3",
               isActive('/settings') && "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
            )}
            title="Settings"
         >
            <Settings className={cn("shrink-0", isSidebarCollapsed ? "h-5 w-5" : "h-4.5 w-4.5")} />
            {!isSidebarCollapsed && <span className="text-sm font-medium">Settings</span>}
         </Link>

         {/* User Profile */}
         <div className="pt-2">
            {isSidebarCollapsed ? (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Tooltip text={user?.name || 'Profile'}>
                            <div className="relative">
                                <Avatar src={user?.avatarUrl} fallback="U" className="w-9 h-9 rounded-lg border border-slate-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors cursor-pointer" />
                                <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white dark:border-zinc-950 rounded-full"></span>
                            </div>
                        </Tooltip>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="left-full bottom-0 ml-2 w-56">
                        <div className="flex items-center gap-3 p-2 pb-3 border-b border-slate-100 dark:border-zinc-800 mb-1">
                           <Avatar src={user?.avatarUrl} fallback="U" className="w-8 h-8 rounded-full" />
                           <div className="overflow-hidden">
                              <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
                              <p className="text-xs text-slate-500 dark:text-zinc-400 truncate">{user?.email}</p>
                           </div>
                        </div>
                        <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
                            <LogOut className="mr-2 h-4 w-4" /> Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <DropdownMenu>
                   <DropdownMenuTrigger className="w-full focus:outline-none">
                      <div className="flex items-center gap-3 p-2 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-black hover:border-indigo-300 dark:hover:border-indigo-700 transition-all cursor-pointer group shadow-sm">
                         <Avatar src={user?.avatarUrl} fallback="U" className="w-9 h-9 rounded-lg bg-slate-100" />
                         <div className="flex flex-col overflow-hidden text-left flex-1 min-w-0">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{user?.name}</span>
                            <span className="text-xs text-slate-500 dark:text-zinc-400 truncate">{user?.email}</span>
                         </div>
                         <MoreHorizontal className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                      </div>
                   </DropdownMenuTrigger>
                   <DropdownMenuContent className="w-60 mb-2" align="center" side="right">
                      <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/10">
                         <LogOut className="mr-2 h-4 w-4" /> Log out
                      </DropdownMenuItem>
                   </DropdownMenuContent>
                </DropdownMenu>
            )}
         </div>
      </div>
    </aside>
  );
};

export const Navbar = () => {
  const { theme, toggleTheme, toggleCli, isSidebarCollapsed } = useAppStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const logsQuery = useQuery({ queryKey: ['logs'], queryFn: () => MockService.getTicketLogs() });

  useEffect(() => {
     const handler = () => useAppStore.getState().toggleMonitor();
     document.addEventListener('toggle-monitor', handler);
     return () => document.removeEventListener('toggle-monitor', handler);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 right-0 z-30 flex h-16 items-center justify-between gap-4 px-8 transition-all duration-300 ease-in-out bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200/50 dark:border-zinc-800/50",
        isSidebarCollapsed ? "left-[72px]" : "left-64"
      )}
    >
      {/* Left: Breadcrumb Placeholder */}
      <div className="flex items-center text-sm font-medium text-slate-500 dark:text-zinc-400">
          {/* Breadcrumbs are managed in AppLayout, but we could move them here if desired. */}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleCli} title="Open PowerShell CLI" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
           <Terminal className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
          {theme === 'light' ? (
             <Sun className="h-5 w-5 text-orange-500" />
          ) : (
             <Moon className="h-5 w-5 text-indigo-400" />
          )}
        </Button>

        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-black" />
          </Button>

          {/* Notification Dropdown */}
          {isNotificationsOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 md:w-96 rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 z-20 overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:ring-white/10 animate-in fade-in zoom-in-95 duration-200">
                 <div className="p-4 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                    <span className="text-xs text-indigo-600 cursor-pointer hover:underline">Mark all read</span>
                 </div>
                 <div className="max-h-[300px] overflow-y-auto">
                    {logsQuery.data?.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">No new notifications</div>
                    ) : (
                        logsQuery.data?.map((log) => (
                        <div key={log.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                            <div className="flex gap-3">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0 dark:bg-indigo-900/50 dark:text-indigo-300">
                                {log.userName.charAt(0)}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-slate-900 dark:text-zinc-200">
                                    <span className="font-medium">{log.userName}</span> commented on <span className="font-medium text-indigo-600 dark:text-indigo-400">{log.ticketId}</span>
                                </p>
                                <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2">"{log.message}"</p>
                                <p className="text-[10px] text-slate-400">
                                    {new Date(log.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                            </div>
                        </div>
                        ))
                    )}
                 </div>
                 <div className="p-2 border-t border-slate-100 bg-slate-50 text-center dark:border-zinc-800 dark:bg-zinc-950">
                    <button className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">View All Activity</button>
                 </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

// --- CLI Modal Component ---
const CLIModal = () => {
  const { isCliOpen, toggleCli } = useAppStore();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(['Nexus PowerShell v1.0.2', 'Copyright (c) Nexus Corp. All rights reserved.', '', 'Type "help" for commands.']);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      setHistory(prev => [...prev, `PS C:\\Nexus> ${cmd}`]);
      
      if (cmd === 'help') {
        setHistory(prev => [...prev, 'Available commands:', '  status      Check system status', '  clear       Clear terminal', '  exit        Close terminal']);
      } else if (cmd === 'status') {
         setHistory(prev => [...prev, 'System Status: ONLINE', 'Database: CONNECTED', 'Latency: 24ms']);
      } else if (cmd === 'clear') {
         setHistory([]);
      } else if (cmd === 'exit') {
         toggleCli();
      } else if (cmd) {
         setHistory(prev => [...prev, `Command '${cmd}' not found.`]);
      }
      
      setInput('');
    }
  };

  return (
    <ModalOverlay isOpen={isCliOpen} onClose={toggleCli}>
      <div 
        className="w-[800px] h-[500px] bg-[#0c0c0c] rounded-lg shadow-2xl border border-[#333] flex flex-col font-mono text-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="h-8 bg-[#1f1f1f] flex items-center justify-between px-3 border-b border-[#333]">
           <div className="flex items-center gap-2">
             <Terminal className="h-3 w-3 text-slate-400" />
             <span className="text-slate-300 text-xs">Administrator: Nexus PowerShell</span>
           </div>
           <button onClick={toggleCli} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto text-slate-200" onClick={() => document.getElementById('cli-input')?.focus()}>
           {history.map((line, i) => (
             <div key={i} className="whitespace-pre-wrap mb-1">{line}</div>
           ))}
           <div className="flex items-center gap-2 mt-2">
             <span className="text-slate-400">PS C:\Nexus&gt;</span>
             <input 
               id="cli-input"
               className="bg-transparent border-none outline-none flex-1 text-slate-200 focus:ring-0 p-0"
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={handleKeyDown}
               autoFocus
               spellCheck={false}
             />
           </div>
        </div>
      </div>
    </ModalOverlay>
  );
};

// --- Main App Layout ---
export const AppLayout = () => {
  const { theme, isSidebarCollapsed } = useAppStore();
  const routerState = useRouterState();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const unsubscribe = MockSocket.subscribe((event) => {
      if (event.type === 'NEW_TICKET') {
         toast.info('New Ticket Created', {
           description: `${event.payload.title}`,
           action: {
             label: 'View',
             onClick: () => console.log('Navigate to ticket', event.payload.id)
           }
         });
      } else if (event.type === 'NEW_LOG') {
         toast(`New Activity on ${event.payload.ticketId}`, {
           description: event.payload.message,
         });
      }
    });
    return unsubscribe;
  }, []);

  const pathSegments = routerState.location.pathname.split('/').filter(Boolean);
  
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 transition-colors duration-300 font-sans selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900/30 dark:selection:text-white">
      <Toaster position="top-right" theme={theme === 'dark' ? 'dark' : 'light'} richColors closeButton />
      
      {/* Components */}
      <Sidebar />
      <Navbar />
      <CLIModal />
      <MonitorDrawer />
      <GlobalSearch />
      
      {/* Main Content Area - Padded for sidebar */}
      <main 
        className={cn(
          "pt-16 min-h-screen transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "pl-[72px]" : "pl-64"
        )}
      >
        <div className="container max-w-7xl mx-auto px-6 py-4 md:px-8 md:py-6">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center text-sm text-slate-500 dark:text-zinc-400 animate-in fade-in slide-in-from-left-4 duration-500">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-white transition-colors">Home</Link>
            {pathSegments.length > 0 && <ChevronRight className="mx-2 h-4 w-4 opacity-50" />}
            {pathSegments.map((segment, index) => (
              <div key={segment} className="flex items-center">
                <span className="capitalize font-medium text-slate-900 dark:text-white">{segment}</span>
                {index < pathSegments.length - 1 && <ChevronRight className="mx-2 h-4 w-4 opacity-50" />}
              </div>
            ))}
          </nav>
          
          <Outlet />
        </div>
      </main>
    </div>
  );
};