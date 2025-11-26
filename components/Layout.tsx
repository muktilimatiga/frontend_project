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
        "relative flex items-center transition-all duration-200 group rounded-xl",
        isCollapsed 
          ? "justify-center w-10 h-10" 
          : "w-full px-3 py-2.5 gap-3",
        isActive 
          ? "bg-slate-100 text-indigo-600 dark:bg-zinc-800 dark:text-zinc-50" 
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-200"
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0", isActive && "stroke-[2.5px]")} />
      
      {!isCollapsed && (
        <span className="text-sm font-medium whitespace-nowrap overflow-hidden transition-opacity duration-200 animate-in fade-in">
          {label}
        </span>
      )}

      {/* Active Indicator (Collapsed Only) */}
      {isActive && isCollapsed && (
        <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-1 h-4 bg-indigo-600 rounded-l-full hidden" />
      )} 
    </div>
  );

  // If collapsed, wrap in Tooltip. If expanded, no tooltip needed.
  const wrappedContent = isCollapsed ? (
    <Tooltip text={label}>{content}</Tooltip>
  ) : content;

  if (to) {
    return (
      <Link to={to} className={cn("block focus:outline-none", !isCollapsed && "w-full")}>
        {wrappedContent}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={cn("block focus:outline-none text-left", !isCollapsed && "w-full")}>
      {wrappedContent}
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
        "fixed left-0 top-0 z-50 h-screen flex flex-col border-r border-slate-200 bg-white dark:bg-zinc-950 dark:border-zinc-800 transition-all duration-300",
        isSidebarCollapsed ? "w-[72px] items-center py-6" : "w-64 px-4 py-6"
      )}
    >
      {/* Top: Brand & Toggle */}
      <div className={cn("mb-8 flex items-center", isSidebarCollapsed ? "justify-center" : "justify-between px-2")}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20 cursor-pointer shrink-0">
             <span className="text-white font-bold text-lg">N</span>
          </div>
          {!isSidebarCollapsed && (
            <span className="font-bold text-xl text-slate-900 dark:text-white whitespace-nowrap">Nexus</span>
          )}
        </div>
        
        {!isSidebarCollapsed && (
           <button onClick={toggleSidebar} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
              <PanelLeftClose className="h-5 w-5" />
           </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className={cn("flex-1 flex flex-col gap-6 overflow-y-auto scrollbar-none", isSidebarCollapsed ? "w-full px-3 items-center" : "w-full")}>
        
        {/* Group 1 */}
        <div className={cn("flex flex-col gap-1", isSidebarCollapsed ? "items-center" : "items-stretch")}>
           {!isSidebarCollapsed && <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">Workspace</div>}
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Search} label="Search" onClick={toggleSearch} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={LayoutDashboard} label="Dashboard" to="/" isActive={isActive('/')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={TicketIcon} label="Tickets" to="/tickets" isActive={isActive('/tickets')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Monitor} label="Monitor" to="#" onClick={() => document.dispatchEvent(new CustomEvent('toggle-monitor'))} isActive={false} />
        </div>

        {/* Group 2 */}
        <div className={cn("flex flex-col gap-1 pt-2 border-t border-slate-100 dark:border-zinc-800/50", isSidebarCollapsed ? "items-center" : "items-stretch")}>
           {!isSidebarCollapsed && <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 mt-2">Resources</div>}
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Network} label="Topology" to="/topology" isActive={isActive('/topology')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Database} label="Database" to="/database" isActive={isActive('/database')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Map} label="Maps" to="/maps" isActive={isActive('/maps')} />
        </div>

        {/* Group 3 */}
        <div className={cn("flex flex-col gap-1 pt-2 border-t border-slate-100 dark:border-zinc-800/50", isSidebarCollapsed ? "items-center" : "items-stretch")}>
           {!isSidebarCollapsed && <div className="px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1 mt-2">Support</div>}
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Users} label="Customers" to="/customers" isActive={isActive('/customers')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={LifeBuoy} label="Help Center" to="/help" isActive={isActive('/help')} />
        </div>

      </div>

      {/* Bottom: Settings & User */}
      <div className={cn("mt-auto flex flex-col gap-2 pt-4 w-full border-t border-slate-100 dark:border-zinc-800", isSidebarCollapsed ? "items-center px-3" : "items-stretch")}>
         <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Settings} label="Settings" to="/settings" isActive={isActive('/settings')} />
         
         {isSidebarCollapsed ? (
            <div className="pt-2 flex flex-col items-center gap-4">
               <DropdownMenu>
                  <DropdownMenuTrigger>
                     <Tooltip text={user?.name || 'Profile'}>
                        <div className="p-0.5 rounded-xl border border-slate-200 hover:border-indigo-500 cursor-pointer transition-colors dark:border-zinc-700">
                           <Avatar src={user?.avatarUrl} fallback="U" className="w-9 h-9 rounded-lg" />
                        </div>
                     </Tooltip>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="left-full top-0 ml-4 w-48 -mt-10">
                     <DropdownMenuLabel>My Account</DropdownMenuLabel>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
                        <LogOut className="mr-2 h-4 w-4" /> Log out
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>

               <button onClick={toggleSidebar} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                  <PanelLeftOpen className="h-5 w-5" />
               </button>
            </div>
         ) : (
            <DropdownMenu className="w-full">
               <DropdownMenuTrigger className="w-full">
                  <div className="flex items-center gap-3 mt-2 px-2 py-2 rounded-xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer group w-full">
                     <Avatar src={user?.avatarUrl} fallback="U" className="w-9 h-9 rounded-lg" />
                     <div className="flex flex-col overflow-hidden text-left flex-1 min-w-0">
                        <span className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</span>
                        <span className="text-xs text-slate-500 dark:text-zinc-400 truncate">{user?.email}</span>
                     </div>
                     <MoreHorizontal className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                  </div>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-60 mb-2 bottom-full mt-0" align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/settings" className="block w-full">
                     <DropdownMenuItem>
                        <Settings className="mr-2 h-4 w-4" /> Settings
                     </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
                     <LogOut className="mr-2 h-4 w-4" /> Log out
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
         )}
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
        "fixed top-0 right-0 z-30 flex h-16 items-center justify-between gap-4 px-8 transition-all duration-300",
        isSidebarCollapsed ? "left-[72px]" : "left-64"
      )}
    >
      {/* Left: Placeholder */}
      <div className="flex items-center text-sm font-medium text-slate-500 dark:text-zinc-400"></div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={toggleCli} title="Open PowerShell CLI">
           <Terminal className="h-5 w-5 text-slate-500 dark:text-zinc-400" />
        </Button>

        <Button variant="ghost" size="icon" onClick={toggleTheme}>
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
            className="relative"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell className="h-5 w-5 text-slate-500 dark:text-zinc-400" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-black" />
          </Button>

          {/* Notification Dropdown */}
          {isNotificationsOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 md:w-96 rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black/5 z-20 overflow-hidden dark:border-zinc-800 dark:bg-zinc-900 dark:ring-white/10 animate-in fade-in zoom-in-95 duration-200">
                 <div className="p-4 border-b border-slate-100 dark:border-zinc-800">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
                 </div>
                 <div className="max-h-[300px] overflow-y-auto">
                    {logsQuery.data?.map((log) => (
                      <div key={log.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50 transition-colors">
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
                    ))}
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
    <div className="min-h-screen bg-slate-50/50 dark:bg-zinc-950 transition-colors duration-300 font-sans selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-indigo-900/30 dark:selection:text-white">
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
          "pt-20 min-h-screen transition-all duration-300",
          isSidebarCollapsed ? "pl-[72px]" : "pl-64"
        )}
      >
        <div className="container max-w-7xl mx-auto p-6 md:p-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center text-sm text-slate-500 dark:text-zinc-400 animate-in fade-in slide-in-from-left-4 duration-500">
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