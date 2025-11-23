import * as React from 'react';
import { useEffect, useState, useRef, useContext } from 'react';
import { Link, Outlet, useRouterState, useNavigate } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  Settings, 
  Users, 
  Menu, 
  Bell, 
  Search, 
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Moon,
  Terminal,
  Network,
  Map,
  Database,
  LifeBuoy
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Toaster, toast } from 'sonner';
import { useAppStore } from '../store';
import { cn, Button, Input, Tooltip, ModalOverlay, Command, CommandInput, CommandList, CommandItem } from './ui';
import { MockService, MockSocket } from '../mock';
import { TicketLog } from '../types';

// Sidebar Item Component
const SidebarItem = ({ icon: Icon, label, to, isCollapsed }: { icon: any, label: string, to: string, isCollapsed: boolean }) => {
  return (
    <Link 
      to={to} 
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-slate-500 transition-all hover:text-slate-900 hover:bg-slate-100 data-[status=active]:bg-indigo-50 data-[status=active]:text-indigo-600 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-white/10 dark:data-[status=active]:bg-white/10 dark:data-[status=active]:text-indigo-400"
      activeProps={{ 'data-status': 'active' }}
    >
      {isCollapsed ? (
        <Tooltip text={label}>
          <Icon className="h-5 w-5" />
        </Tooltip>
      ) : (
        <Icon className="h-5 w-5" />
      )}
      {!isCollapsed && <span className="text-sm font-medium">{label}</span>}
    </Link>
  );
};

export const Sidebar = () => {
  const { isSidebarCollapsed: isCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen border-r border-slate-200 bg-white transition-all duration-300 flex flex-col dark:border-white/10 dark:bg-black",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex h-16 items-center border-b border-slate-200 px-4 justify-between dark:border-white/10">
        <div className={cn("flex items-center gap-2 font-bold text-xl text-indigo-600 dark:text-indigo-500", isCollapsed && "justify-center w-full")}>
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white dark:bg-indigo-600 shrink-0">
            N
          </div>
          {!isCollapsed && <span>Nexus</span>}
        </div>
        {!isCollapsed && (
           <button onClick={toggleSidebar} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
             <PanelLeftClose className="h-4 w-4" />
           </button>
        )}
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col justify-between scrollbar-none">
        <nav className="grid gap-1 px-2">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" isCollapsed={isCollapsed} />
          <SidebarItem icon={TicketIcon} label="Tickets" to="/tickets" isCollapsed={isCollapsed} />
          <SidebarItem icon={Network} label="Topology" to="/topology" isCollapsed={isCollapsed} />
          <SidebarItem icon={Map} label="Maps" to="/maps" isCollapsed={isCollapsed} />
          <SidebarItem icon={Database} label="Database" to="/database" isCollapsed={isCollapsed} />
          <SidebarItem icon={Users} label="Customers" to="/customers" isCollapsed={isCollapsed} />
        </nav>
        
        {/* Footer Nav */}
        <nav className="grid gap-1 px-2 mt-auto pb-2">
           <SidebarItem icon={LifeBuoy} label="Help Center" to="/help" isCollapsed={isCollapsed} />
           <SidebarItem icon={Settings} label="Settings" to="/settings" isCollapsed={isCollapsed} />
        </nav>
      </div>

      {/* Footer User/Toggle */}
      <div className="border-t border-slate-200 p-4 dark:border-white/10">
        {isCollapsed ? (
          <div className="flex justify-center flex-col items-center gap-4">
             <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold dark:bg-white/10 dark:text-indigo-300 text-xs">
               AC
             </div>
             <button onClick={toggleSidebar} className="mt-2"><PanelLeftOpen className="h-5 w-5 text-slate-400 dark:text-slate-500" /></button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
             <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold dark:bg-white/10 dark:text-indigo-300">
               AC
             </div>
             <div className="flex flex-col">
               <span className="text-sm font-medium text-slate-900 dark:text-slate-200">Alex Carter</span>
               <span className="text-xs text-slate-500 dark:text-slate-400">Admin</span>
             </div>
             <LogOut className="ml-auto h-4 w-4 text-slate-400 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300" />
          </div>
        )}
      </div>
    </aside>
  );
};

export const Navbar = () => {
  const { isSidebarCollapsed: isCollapsed, toggleSidebar, theme, toggleTheme, toggleCli } = useAppStore();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{users: any[], tickets: any[], pages: any[]} | null>(null);
  
  const navigate = useNavigate();
  const logsQuery = useQuery({ queryKey: ['logs'], queryFn: MockService.getTicketLogs });

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchQuery.length > 1) {
        const results = await MockService.searchGlobal(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults(null);
      }
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleSelect = (type: string, idOrPath: string) => {
    setIsSearchOpen(false);
    setSearchQuery('');
    if (type === 'page') {
      navigate({ to: idOrPath });
    } else {
      console.log(`Navigating to ${type}: ${idOrPath}`);
    }
  };

  return (
    <header className={cn(
      "fixed top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/80 px-6 backdrop-blur transition-all duration-300 dark:border-white/10 dark:bg-black/80",
      isCollapsed ? "left-16 w-[calc(100%-4rem)]" : "left-64 w-[calc(100%-16rem)]"
    )}>
      {isCollapsed && (
        <button onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </button>
      )}
      
      <div className="flex flex-1 items-center gap-4 md:gap-8">
        <div className="relative flex-1 md:w-full md:max-w-sm">
          <div 
             className="relative flex items-center cursor-text"
             onClick={() => setIsSearchOpen(true)}
          >
             <Search className="absolute left-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
             <div className="w-full h-9 rounded-md border border-slate-300 bg-slate-50 px-3 py-1 pl-9 text-sm text-slate-500 dark:bg-white/5 dark:border-white/10 dark:text-slate-400 flex items-center">
                Search tickets, users, pages...
             </div>
          </div>
          
          {/* Global Search Dropdown */}
          {isSearchOpen && (
            <>
               <div className="fixed inset-0 z-40" onClick={() => setIsSearchOpen(false)} />
               <div className="absolute top-0 left-0 w-full z-50 mt-10 rounded-md border border-slate-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#09090b]">
                  <Command className="rounded-lg border shadow-md dark:border-white/10">
                     <CommandInput 
                        placeholder="Type to search..." 
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                     />
                     <CommandList className="max-h-[400px]">
                        {!searchQuery && <div className="p-4 text-xs text-slate-500 text-center">Start typing to search...</div>}
                        {searchResults?.pages?.length > 0 && (
                           <div className="p-2">
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 mb-2">Pages</p>
                              {searchResults.pages.map((page: any) => (
                                 <CommandItem key={page.to} onSelect={() => handleSelect('page', page.to)} onClick={() => handleSelect('page', page.to)}>
                                    <div className="flex items-center gap-2">
                                       <LayoutDashboard className="h-4 w-4 text-slate-400" />
                                       <span>{page.title}</span>
                                    </div>
                                 </CommandItem>
                              ))}
                           </div>
                        )}
                        {searchResults?.users?.length > 0 && (
                           <div className="p-2 border-t border-slate-100 dark:border-white/10">
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 mb-2">Users</p>
                              {searchResults.users.map((user: any) => (
                                 <CommandItem key={user.id} onSelect={() => handleSelect('user', user.id)} onClick={() => handleSelect('user', user.id)}>
                                    <div className="flex items-center gap-2">
                                       <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] dark:bg-white/10">{user.name.charAt(0)}</div>
                                       <span>{user.name}</span>
                                       <span className="text-xs text-slate-400 ml-auto">{user.email}</span>
                                    </div>
                                 </CommandItem>
                              ))}
                           </div>
                        )}
                        {searchResults?.tickets?.length > 0 && (
                           <div className="p-2 border-t border-slate-100 dark:border-white/10">
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 mb-2">Tickets</p>
                              {searchResults.tickets.map((t: any) => (
                                 <CommandItem key={t.id} onSelect={() => handleSelect('ticket', t.id)} onClick={() => handleSelect('ticket', t.id)}>
                                    <div className="flex items-center gap-2">
                                       <TicketIcon className="h-4 w-4 text-slate-400" />
                                       <span className="font-medium text-xs bg-slate-100 px-1 rounded dark:bg-white/10">{t.id}</span>
                                       <span className="truncate">{t.title}</span>
                                    </div>
                                 </CommandItem>
                              ))}
                           </div>
                        )}
                        {searchQuery && !searchResults?.pages?.length && !searchResults?.users?.length && !searchResults?.tickets?.length && (
                           <div className="p-4 text-xs text-slate-500 text-center">No results found.</div>
                        )}
                     </CommandList>
                  </Command>
               </div>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* CLI Trigger */}
        <Button variant="ghost" size="icon" onClick={toggleCli} title="Open PowerShell CLI">
           <Terminal className="h-5 w-5 text-slate-500 dark:text-slate-400" />
        </Button>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'light' ? (
             <Sun className="h-5 w-5 text-orange-500" />
          ) : (
             <Moon className="h-5 w-5 text-indigo-400" />
          )}
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell className="h-5 w-5 text-slate-500 dark:text-slate-400" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-black" />
          </Button>

          {/* Notification Dropdown */}
          {isNotificationsOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 md:w-96 rounded-xl border border-slate-200 bg-white shadow-lg ring-1 ring-black/5 z-20 overflow-hidden dark:border-white/10 dark:bg-black dark:ring-white/10">
                 <div className="p-4 border-b border-slate-100 dark:border-white/10">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-50">Recent Activity</h3>
                 </div>
                 <div className="max-h-[300px] overflow-y-auto">
                    {logsQuery.data?.map((log) => (
                      <div key={log.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/5 transition-colors">
                        <div className="flex gap-3">
                           <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700 shrink-0 dark:bg-indigo-900/50 dark:text-indigo-300">
                              {log.userName.charAt(0)}
                           </div>
                           <div className="space-y-1">
                              <p className="text-sm text-slate-900 dark:text-slate-200">
                                <span className="font-medium">{log.userName}</span> commented on <span className="font-medium text-indigo-600 dark:text-indigo-400">{log.ticketId}</span>
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">"{log.message}"</p>
                              <p className="text-[10px] text-slate-400">
                                {new Date(log.createdAt).toLocaleTimeString()}
                              </p>
                           </div>
                        </div>
                      </div>
                    ))}
                 </div>
                 <div className="p-2 border-t border-slate-100 bg-slate-50 text-center dark:border-white/10 dark:bg-white/5">
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
      
      // Fake command processing
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
        {/* Title Bar */}
        <div className="h-8 bg-[#1f1f1f] flex items-center justify-between px-3 border-b border-[#333]">
           <div className="flex items-center gap-2">
             <Terminal className="h-3 w-3 text-slate-400" />
             <span className="text-slate-300 text-xs">Administrator: Nexus PowerShell</span>
           </div>
           <button onClick={toggleCli} className="text-slate-400 hover:text-white">✕</button>
        </div>
        
        {/* Terminal Content */}
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

export const AppLayout = () => {
  const { isSidebarCollapsed: isCollapsed, theme } = useAppStore();
  const routerState = useRouterState();

  // Apply Theme Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Subscribe to Real-time events for Toasts
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
    <div className="min-h-screen bg-slate-50/50 dark:bg-black transition-colors duration-300">
      <Toaster position="top-right" theme={theme === 'dark' ? 'dark' : 'light'} richColors />
      <Sidebar />
      <Navbar />
      <CLIModal />
      
      <main className={cn(
        "pt-16 transition-all duration-300 min-h-screen",
        isCollapsed ? "pl-16" : "pl-64"
      )}>
        <div className="container mx-auto p-6">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center text-sm text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-slate-900 dark:hover:text-slate-200">Home</Link>
            {pathSegments.length > 0 && <ChevronRight className="mx-2 h-4 w-4" />}
            {pathSegments.map((segment, index) => (
              <div key={segment} className="flex items-center">
                <span className="capitalize font-medium text-slate-900 dark:text-slate-200">{segment}</span>
                {index < pathSegments.length - 1 && <ChevronRight className="mx-2 h-4 w-4" />}
              </div>
            ))}
          </nav>
          
          <Outlet />
        </div>
      </main>
    </div>
  );
};