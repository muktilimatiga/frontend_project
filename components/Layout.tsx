import * as React from 'react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Ticket as TicketIcon, 
  Settings, 
  Users, 
  Bell, 
  Search, 
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
  MoreHorizontal, 
  Sparkles, 
  Minus, 
  Maximize2, 
  X, 
  ScrollText
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
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
} from './ui';
import { MockService } from '../mock';
import { GlobalSearch } from './GlobalSearch';
import { AIChatDrawer } from './AIChatDrawer';
import { supabase } from '../lib/supabaseClient';
import { useSupabaseStats } from '../hooks/useSupabaseStats';

// --- Sidebar Icon / Item Component ---
const SidebarIcon = ({ 
  icon: Icon, 
  label, 
  to, 
  isActive, 
  onClick, 
  isCollapsed,
  badgeCount
}: { 
  icon: any, 
  label: string, 
  to?: string, 
  isActive?: boolean, 
  onClick?: () => void,
  isCollapsed: boolean,
  badgeCount?: number
}) => {
  const content = (
    <div 
      className={cn(
        "relative flex items-center transition-all duration-200 group rounded-xl mx-4 mb-1",
        isCollapsed 
          ? "justify-center p-3 mx-2" 
          : "px-4 py-3.5 gap-3",
        // Active: Vibrant Blue background, White text, Pill shape
        isActive 
          ? "bg-primary text-white shadow-md shadow-blue-500/30 dark:shadow-none" 
          : "text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-white/10 dark:text-slate-400"
      )}
    >
      <Icon className={cn("shrink-0 transition-all", isCollapsed ? "h-6 w-6" : "h-5 w-5")} />
      
      {!isCollapsed && (
        <span className="text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 flex-1">
          {label}
        </span>
      )}

      {/* Badge Logic - Expanded */}
      {!isCollapsed && badgeCount !== undefined && badgeCount > 0 && (
         <span className={cn(
             "text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto min-w-[20px] text-center transition-colors",
             isActive 
               ? "bg-white text-primary" 
               : "bg-red-500 text-white"
         )}>
            {badgeCount}
         </span>
      )}

      {/* Badge Logic - Collapsed (Dot) */}
      {isCollapsed && badgeCount !== undefined && badgeCount > 0 && (
          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white dark:border-black" />
      )}
    </div>
  );

  const wrapperClass = "block w-full focus:outline-none relative";

  if (isCollapsed) {
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
  const { user, toggleSearch, isSidebarCollapsed, toggleSidebar, logout } = useAppStore();
  const { stats } = useSupabaseStats();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-50 h-screen flex flex-col bg-white dark:bg-black transition-all duration-300 ease-in-out border-r border-slate-100 dark:border-white/10",
        isSidebarCollapsed ? "w-[90px]" : "w-64"
      )}
    >
      {/* Top: Brand */}
      <div className={cn("h-24 flex items-center shrink-0", isSidebarCollapsed ? "justify-center" : "px-8")}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center cursor-pointer shrink-0 transition-transform hover:scale-105 shadow-lg shadow-blue-500/30 dark:shadow-none">
             <span className="text-white font-bold text-xl italic">P</span>
          </div>
          {!isSidebarCollapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="font-extrabold text-xl text-navy dark:text-white leading-none">Prime Pay</span>
                <span className="text-[10px] text-slate-400 font-medium">Finance App</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-2 scrollbar-none px-0">
        
        {/* Main Menu */}
        <div className="flex flex-col gap-1">
           {!isSidebarCollapsed && <div className="px-8 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Menu</div>}
           
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={LayoutDashboard} label="Dashboard" to="/" isActive={isActive('/')} />
           <SidebarIcon 
              isCollapsed={isSidebarCollapsed} 
              icon={TicketIcon} 
              label="Transaction" 
              to="/tickets" 
              isActive={isActive('/tickets')} 
              badgeCount={stats?.open}
           />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Monitor} label="Auto Pay" to="/monitor" isActive={isActive('/monitor')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Users} label="Goals" to="/customers" isActive={isActive('/customers')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Settings} label="Settings" to="/settings" isActive={isActive('/settings')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Bell} label="Message" to="/logs" isActive={isActive('/logs')} badgeCount={2} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Network} label="Investment" to="/topology" isActive={isActive('/topology')} />
        </div>

        {/* Separator */}
        <div className="my-4 border-t border-slate-100 dark:border-white/10 mx-6"></div>

        {/* Support */}
        <div className="flex flex-col gap-1">
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={LifeBuoy} label="Support" to="/help" isActive={isActive('/help')} />
           <button 
             onClick={logout}
             className={cn(
                "relative flex items-center transition-all duration-200 group rounded-xl mx-4 mb-1",
                isSidebarCollapsed ? "justify-center p-3 mx-2" : "px-4 py-3.5 gap-3",
                "text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
             )}
           >
              <LogOut className={cn("shrink-0 transition-all", isSidebarCollapsed ? "h-6 w-6" : "h-5 w-5")} />
              {!isSidebarCollapsed && (
                <span className="text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 flex-1 text-left">
                  Log out
                </span>
              )}
           </button>
        </div>

      </div>

      {/* Collapse Toggle at Bottom */}
      <div className={cn("mt-auto pb-6 px-2 flex justify-center")}>
         <button 
           onClick={toggleSidebar}
           className="p-2 text-slate-300 hover:text-primary transition-colors"
         >
            {isSidebarCollapsed ? <PanelLeftOpen className="h-6 w-6" /> : <PanelLeftClose className="h-6 w-6" />}
         </button>
      </div>
    </aside>
  );
};

export const Navbar = () => {
  const { theme, toggleTheme, toggleCli, isSidebarCollapsed, toggleAIChat, isCliOpen, user } = useAppStore();
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
        "fixed top-0 right-0 z-30 flex h-24 items-center justify-end gap-4 px-10 transition-all duration-300 ease-in-out bg-background/80 dark:bg-background/80 backdrop-blur-md",
        isSidebarCollapsed ? "left-[90px]" : "left-64"
      )}
    >
      {/* Right: Actions */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
               className="h-12 w-72 rounded-full bg-white dark:bg-white/10 pl-11 pr-4 text-sm outline-none placeholder:text-slate-400 dark:text-white transition-all focus:w-80 shadow-soft focus:ring-2 focus:ring-primary/20 dark:border-white/10 dark:border"
               placeholder="Search anything here..."
            />
        </div>

        <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleAIChat} 
            className="rounded-full h-12 w-12 bg-white dark:bg-white/10 shadow-soft text-slate-400 hover:text-primary dark:text-slate-300 dark:hover:text-white"
        >
           <Sparkles className="h-5 w-5" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCli} 
          className={cn(
            "rounded-full h-12 w-12 bg-white dark:bg-white/10 shadow-soft text-slate-400 hover:text-primary dark:text-slate-300 dark:hover:text-white",
            isCliOpen && "text-primary ring-2 ring-primary/20"
          )}
        >
           <Terminal className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full h-12 w-12 bg-white dark:bg-white/10 shadow-soft text-slate-400 hover:text-primary dark:text-slate-300 dark:hover:text-white">
          {theme === 'light' ? (
             <Sun className="h-5 w-5" />
          ) : (
             <Moon className="h-5 w-5" />
          )}
        </Button>

        <div className="relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative rounded-full h-12 w-12 bg-white dark:bg-white/10 shadow-soft text-slate-400 hover:text-primary dark:text-slate-300 dark:hover:text-white"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-black" />
          </Button>

          {/* Notification Dropdown */}
          {isNotificationsOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsNotificationsOpen(false)} />
              <div className="absolute right-0 top-full mt-4 w-96 rounded-3xl border border-border bg-white shadow-xl ring-1 ring-black/5 z-20 overflow-hidden dark:border-white/10 dark:bg-black dark:ring-white/10 animate-in fade-in zoom-in-95 duration-200">
                 <div className="p-4 border-b border-border dark:border-white/10 flex justify-between items-center">
                    <h3 className="font-semibold text-navy dark:text-white">Notifications</h3>
                    <span className="text-xs text-primary cursor-pointer hover:underline">Mark all read</span>
                 </div>
                 <div className="max-h-[350px] overflow-y-auto">
                    {logsQuery.data?.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">No new notifications</div>
                    ) : (
                        logsQuery.data?.map((log) => (
                        <div key={log.id} className="p-4 border-b border-border hover:bg-slate-50 dark:border-white/5 dark:hover:bg-white/5 transition-colors cursor-pointer">
                            <div className="flex gap-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-sm font-bold text-primary shrink-0 dark:bg-indigo-900/30">
                                {log.userName.charAt(0)}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-navy dark:text-slate-200">
                                    <span className="font-medium">{log.userName}</span> commented on <span className="font-medium text-slateBlue">{log.ticketId}</span>
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">"{log.message}"</p>
                                <p className="text-[10px] text-slate-400">
                                    {new Date(log.createdAt).toLocaleTimeString()}
                                </p>
                            </div>
                            </div>
                        </div>
                        ))
                    )}
                 </div>
              </div>
            </>
          )}
        </div>
        
        {/* Profile */}
        <Avatar src={user?.avatarUrl} fallback="U" className="h-12 w-12 border-2 border-white shadow-soft cursor-pointer dark:border-white/10" />
      </div>
    </header>
  );
};

// ... (CLI Modal remains unchanged)
const CLIModal = () => {
  const { isCliOpen, toggleCli, isCliMinimized, setIsCliMinimized } = useAppStore();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>(['Last login: ' + new Date().toDateString() + ' on ttys000', 'Nexus System v2.1.0', '']);
  
  // Floating Window State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 700, height: 450 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });

  // Center the window on mount or when reopened
  useEffect(() => {
    if (isCliOpen) {
       if (position.x === 0 && position.y === 0) {
           resetWindow();
       }
    }
  }, [isCliOpen]);

  const resetWindow = () => {
     setPosition({ 
       x: Math.max(0, (window.innerWidth - 700) / 2), 
       y: Math.max(0, (window.innerHeight - 450) / 2) 
     });
     setSize({ width: 700, height: 450 });
     setIsCliMinimized(false);
  };

  // Handle Dragging
  const handleMouseDownDrag = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    };
  };

  // Handle Resizing
  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    resizeStart.current = { 
      x: e.clientX, 
      y: e.clientY, 
      w: size.width, 
      h: size.height 
    };
  };

  // Global Mouse Events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.current.x,
          y: e.clientY - dragStart.current.y
        });
      }
      if (isResizing && !isCliMinimized) {
        setSize({
          width: Math.max(400, resizeStart.current.w + (e.clientX - resizeStart.current.x)),
          height: Math.max(300, resizeStart.current.h + (e.clientY - resizeStart.current.y))
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, isCliMinimized]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const cmd = input.trim();
      setHistory(prev => [...prev, `➜  ~ ${cmd}`]);
      
      if (cmd === 'help') {
        setHistory(prev => [...prev, 'Available commands:', '  status      Check system status', '  clear       Clear terminal', '  exit        Close terminal', '  whoami      Current user']);
      } else if (cmd === 'status') {
         setHistory(prev => [...prev, 'System Status: ONLINE', 'Database: CONNECTED', 'Latency: 24ms']);
      } else if (cmd === 'clear') {
         setHistory([]);
      } else if (cmd === 'exit') {
         toggleCli();
      } else if (cmd === 'whoami') {
         setHistory(prev => [...prev, 'admin']);
      } else if (cmd) {
         setHistory(prev => [...prev, `zsh: command not found: ${cmd}`]);
      }
      
      setInput('');
    }
  };

  if (!isCliOpen) return null;

  return (
    <div 
      className={cn(
        "fixed z-[100] bg-[#1e1e1e]/95 backdrop-blur-xl rounded-xl shadow-2xl flex flex-col font-mono text-[13px] leading-relaxed overflow-hidden ring-1 ring-white/10 transition-[height] duration-200 ease-in-out",
        isCliMinimized && "h-[28px] !important"
      )}
      style={{ 
        left: position.x, 
        top: position.y, 
        width: size.width, 
        height: isCliMinimized ? '28px' : size.height,
        cursor: isDragging ? 'grabbing' : 'auto',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.1), 0 20px 50px rgba(0,0,0,0.5)'
      }}
      onClick={(e) => e.stopPropagation()} 
    >
      {/* macOS Style Header */}
      <div 
        className="h-7 bg-gradient-to-b from-[#3a3a3a] to-[#2b2b2b] flex items-center px-2.5 border-b border-black/40 select-none cursor-grab active:cursor-grabbing relative"
        onMouseDown={handleMouseDownDrag}
        onDoubleClick={() => setIsCliMinimized(!isCliMinimized)}
      >
         {/* Window Controls */}
         <div className="flex items-center gap-2 z-10 group">
            <button 
                onClick={toggleCli} 
                className="w-3 h-3 rounded-full bg-[#ff5f56] border-[0.5px] border-[#e0443e] flex items-center justify-center hover:bg-[#ff5f56]/80"
                title="Close"
            >
               <X className="h-2 w-2 text-black/60 opacity-0 group-hover:opacity-100" />
            </button>
            <button 
                onClick={() => setIsCliMinimized(!isCliMinimized)} 
                className="w-3 h-3 rounded-full bg-[#ffbd2e] border-[0.5px] border-[#dea123] flex items-center justify-center hover:bg-[#ffbd2e]/80"
                title="Minimize (Window Shade)"
            >
               <Minus className="h-2 w-2 text-black/60 opacity-0 group-hover:opacity-100" />
            </button>
            <button 
                onClick={resetWindow}
                className="w-3 h-3 rounded-full bg-[#27c93f] border-[0.5px] border-[#1aab29] flex items-center justify-center hover:bg-[#27c93f]/80"
                title="Reset / Maximize"
            >
               <Maximize2 className="h-2 w-2 text-black/60 opacity-0 group-hover:opacity-100" />
            </button>
         </div>

         {/* Title */}
         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="flex items-center gap-1.5 opacity-60">
                <Terminal className="h-3 w-3" />
                <span className="font-semibold text-xs text-shadow-sm text-[#e5e5e5]">admin — -zsh</span>
            </div>
         </div>
      </div>

      {/* Content (Hidden when minimized) */}
      {!isCliMinimized && (
          <div 
            className="flex-1 p-3 overflow-y-auto text-[#e5e5e5] cursor-text selection:bg-white/20" 
            onClick={() => document.getElementById('cli-input')?.focus()}
            style={{ fontFamily: "Menlo, Monaco, 'Courier New', monospace" }}
          >
             {history.map((line, i) => (
               <div key={i} className="whitespace-pre-wrap min-h-[1.2em]">{line}</div>
             ))}
             <div className="flex items-center gap-2 mt-0.5">
               <span className="text-emerald-400 font-bold shrink-0">➜</span>
               <span className="text-cyan-400 font-bold shrink-0">~</span>
               <div className="flex-1 relative">
                 <input 
                   id="cli-input"
                   className="bg-transparent border-none outline-none w-full text-[#e5e5e5] focus:ring-0 p-0 m-0 h-5"
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={handleKeyDown}
                   autoFocus
                   spellCheck={false}
                   autoComplete="off"
                 />
               </div>
             </div>
          </div>
      )}
      
      {/* Invisible Resize Handle Area (Hidden when minimized) */}
      {!isCliMinimized && (
          <div 
            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-20"
            onMouseDown={handleMouseDownResize}
          />
      )}
    </div>
  );
};

// --- Main App Layout ---
export const AppLayout = () => {
  const { theme, isSidebarCollapsed, login } = useAppStore();
  const routerState = useRouterState();
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Scroll listener for auto-collapsing sidebar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const state = useAppStore.getState();
      
      // Collapse on scroll down
      if (currentScrollY > 50 && currentScrollY > lastScrollY.current && !state.isSidebarCollapsed) {
         state.setSidebarCollapsed(true);
      }
      
      // Auto-expand when back at the top
      if (currentScrollY < 20 && state.isSidebarCollapsed) {
         state.setSidebarCollapsed(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Current User from Supabase 'users' table
  useEffect(() => {
    const fetchSessionUser = async () => {
        if (!supabase || (supabase['supabaseUrl'] && supabase['supabaseUrl'].includes('placeholder'))) return;

        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .limit(1)
                .single();
            
            if (data && !error) {
                const mappedUser = {
                    id: String(data.id),
                    name: data.full_name || data.username || 'Admin',
                    email: (data.username && data.username.includes('@')) ? data.username : `${data.username || 'admin'}@nexus.com`,
                    role: (data.role as any) || 'admin',
                    avatarUrl: undefined 
                };
                login(mappedUser);
            }
        } catch (e) {
            console.error("Failed to load user profile from Supabase", e);
        }
    };
    
    fetchSessionUser();
  }, [login]);

  const pathSegments = routerState.location.pathname.split('/').filter(Boolean);
  
  return (
    <div className="min-h-screen bg-background text-navy transition-colors duration-300 font-sans selection:bg-primary/20 selection:text-primary dark:selection:bg-primary/40 dark:selection:text-white">
      <Toaster position="top-center" theme={theme === 'dark' ? 'dark' : 'light'} richColors closeButton />
      
      {/* Components */}
      <Sidebar />
      <Navbar />
      <CLIModal />
      <GlobalSearch />
      <AIChatDrawer />
      
      {/* Main Content Area - Padded for sidebar */}
      <main 
        className={cn(
          "pt-28 min-h-screen transition-all duration-300 ease-in-out pb-8",
          isSidebarCollapsed ? "pl-[110px]" : "pl-72"
        )}
      >
        <div className="container max-w-7xl mx-auto px-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
           <Outlet />
        </div>
      </main>
    </div>
  );
};