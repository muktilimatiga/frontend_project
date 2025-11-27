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
  MoreHorizontal,
  Sparkles,
  Minus,
  Maximize2,
  X,
  GripHorizontal
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
import { AIChatDrawer } from './AIChatDrawer';

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
          ? "text-primary dark:text-primary font-medium bg-indigo-50 dark:bg-slate-800/50 nav-item-active-bg" 
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
      )}
    >
      <Icon className={cn("shrink-0 transition-all", isCollapsed ? "h-5 w-5" : "h-4.5 w-4.5", isActive && "stroke-[2.5px] drop-shadow-sm")} />
      
      {!isCollapsed && (
        <span className="text-sm whitespace-nowrap overflow-hidden transition-all duration-300">
          {label}
        </span>
      )}
    </div>
  );

  const wrapperClass = cn(
      "block w-full focus:outline-none relative", 
      isActive && "nav-item-glow" // Apply Glow Effect on Container
  );

  if (isCollapsed) {
    const wrapped = (
      <Tooltip text={label}>
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
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/';
    return currentPath.startsWith(path);
  };

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-50 h-screen flex flex-col border-r border-slate-200 bg-white dark:bg-main dark:border-slate-800 transition-all duration-300 ease-in-out shadow-sm",
        isSidebarCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      {/* Top: Brand */}
      <div className={cn("h-16 flex items-center shrink-0 border-b border-transparent", isSidebarCollapsed ? "justify-center" : "px-6")}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20 cursor-pointer shrink-0 transition-transform hover:scale-105">
             <span className="text-white font-bold text-lg">N</span>
          </div>
          {!isSidebarCollapsed && (
            <span className="font-bold text-lg text-slate-900 dark:text-white whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-300">Nexus</span>
          )}
        </div>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        
        {/* Group 1 */}
        <div className="flex flex-col gap-0.5">
           {!isSidebarCollapsed && <div className="px-6 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 dark:text-slate-500">Workspace</div>}
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Search} label="Search" onClick={toggleSearch} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={LayoutDashboard} label="Dashboard" to="/" isActive={isActive('/')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={TicketIcon} label="Tickets" to="/tickets" isActive={isActive('/tickets')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Monitor} label="Monitor" to="/monitor" isActive={isActive('/monitor')} />
        </div>

        {/* Group 2 */}
        <div className="mt-4 flex flex-col gap-0.5">
           {!isSidebarCollapsed && <div className="px-6 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 dark:text-slate-500">Resources</div>}
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Network} label="Topology" to="/topology" isActive={isActive('/topology')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Database} label="Database" to="/database" isActive={isActive('/database')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Map} label="Maps" to="/maps" isActive={isActive('/maps')} />
        </div>

        {/* Group 3 */}
        <div className="mt-4 flex flex-col gap-0.5">
           {!isSidebarCollapsed && <div className="px-6 py-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400/80 dark:text-slate-500">Support</div>}
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={Users} label="Customers" to="/customers" isActive={isActive('/customers')} />
           <SidebarIcon isCollapsed={isSidebarCollapsed} icon={LifeBuoy} label="Help Center" to="/help" isActive={isActive('/help')} />
        </div>

      </div>

      {/* Bottom Actions */}
      <div className={cn("mt-auto border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30")}>
         
         <div className={cn("p-2", isSidebarCollapsed ? "flex flex-col items-center gap-2" : "space-y-1")}>
             {/* Settings Link */}
             <Link 
                to="/settings" 
                className={cn(
                   "flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors",
                   isSidebarCollapsed ? "justify-center p-2" : "w-full px-3 py-2 gap-3",
                   isActive('/settings') && "nav-item-active"
                )}
                title="Settings"
             >
                <Settings className={cn("shrink-0", isSidebarCollapsed ? "h-5 w-5" : "h-4.5 w-4.5")} />
                {!isSidebarCollapsed && <span className="text-sm font-medium">Settings</span>}
             </Link>

             {/* Collapse Toggle */}
             <button 
               onClick={toggleSidebar}
               className={cn(
                 "flex items-center text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors",
                 isSidebarCollapsed ? "justify-center p-2" : "w-full px-3 py-2 gap-3"
               )}
               title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
             >
                {isSidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-4.5 w-4.5" />}
                {!isSidebarCollapsed && <span className="text-sm font-medium">Collapse</span>}
             </button>
         </div>

         {/* User Profile - Full Width Footer */}
         <div className="border-t border-slate-100 dark:border-slate-800">
            {isSidebarCollapsed ? (
                <div className="p-3 flex justify-center">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Tooltip text={user?.name || 'Profile'}>
                                <div className="relative">
                                    <Avatar src={user?.avatarUrl} fallback="U" className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 transition-colors cursor-pointer" />
                                    <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
                                </div>
                            </Tooltip>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="left-full bottom-0 ml-2 w-56">
                            <div className="flex items-center gap-3 p-2 pb-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                               <Avatar src={user?.avatarUrl} fallback="U" className="w-8 h-8 rounded-full" />
                               <div className="overflow-hidden">
                                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                               </div>
                            </div>
                            <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400">
                                <LogOut className="mr-2 h-4 w-4" /> Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ) : (
                <div className="p-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="w-full focus:outline-none">
                        {/* Refactored Full Width Card */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-100 dark:bg-card border border-transparent dark:border-slate-700 hover:border-indigo-300 dark:hover:border-primary/50 transition-all cursor-pointer group shadow-sm w-full">
                          <div className="relative shrink-0">
                              <Avatar src={user?.avatarUrl} fallback="U" className="w-10 h-10 rounded-lg shadow-sm" />
                              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-slate-100 dark:border-slate-800 rounded-full"></span>
                          </div>
                          <div className="flex flex-col overflow-hidden text-left flex-1 min-w-0">
                              <span className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-primary dark:group-hover:text-primary transition-colors">{user?.name}</span>
                              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</span>
                          </div>
                          <MoreHorizontal className="h-4 w-4 text-slate-400 group-hover:text-primary shrink-0" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[230px] mb-2" align="center" side="top">
                        <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/10">
                          <LogOut className="mr-2 h-4 w-4" /> Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            )}
         </div>
      </div>
    </aside>
  );
};

export const Navbar = () => {
  const { theme, toggleTheme, toggleCli, isSidebarCollapsed, toggleAIChat, isCliOpen } = useAppStore();
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
        "fixed top-0 right-0 z-30 flex h-16 items-center justify-between gap-4 px-8 transition-all duration-300 ease-in-out bg-white/80 dark:bg-main/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50",
        isSidebarCollapsed ? "left-[72px]" : "left-64"
      )}
    >
      {/* Left: Breadcrumb Placeholder */}
      <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
          {/* Breadcrumbs are managed in AppLayout */}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleAIChat} 
            title="Ask Nexus AI" 
            className="text-primary hover:text-indigo-700 hover:bg-indigo-50 dark:text-primary dark:hover:text-indigo-300 dark:hover:bg-indigo-900/20"
        >
           <Sparkles className="h-5 w-5" />
        </Button>

        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCli} 
          title="Open PowerShell CLI" 
          className={cn(
            "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white",
            isCliOpen && "bg-slate-100 dark:bg-white/10 text-slate-900 dark:text-white"
          )}
        >
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
              <div className="absolute right-0 top-full mt-2 w-80 md:w-96 rounded-xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 z-20 overflow-hidden dark:border-slate-800 dark:bg-card dark:ring-white/10 animate-in fade-in zoom-in-95 duration-200">
                 <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-900 dark:text-white">Notifications</h3>
                    <span className="text-xs text-indigo-600 cursor-pointer hover:underline">Mark all read</span>
                 </div>
                 <div className="max-h-[300px] overflow-y-auto">
                    {logsQuery.data?.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">No new notifications</div>
                    ) : (
                        logsQuery.data?.map((log) => (
                        <div key={log.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 transition-colors cursor-pointer">
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
                        ))
                    )}
                 </div>
                 <div className="p-2 border-t border-slate-100 bg-slate-50 text-center dark:border-slate-800 dark:bg-slate-900">
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

// --- Resizable & Draggable CLI Modal (macOS Style) ---
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
       // Only reset position if it's currently at 0,0 (first open) or explicitly requested (via green button logic later)
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
    <div className="min-h-screen bg-slate-50 dark:bg-main transition-colors duration-300 font-sans selection:bg-indigo-100 selection:text-indigo-900 dark:selection:bg-primary/30 dark:selection:text-white">
      <Toaster position="top-right" theme={theme === 'dark' ? 'dark' : 'light'} richColors closeButton />
      
      {/* Components */}
      <Sidebar />
      <Navbar />
      <CLIModal />
      <GlobalSearch />
      <AIChatDrawer />
      
      {/* Main Content Area - Padded for sidebar */}
      <main 
        className={cn(
          "pt-16 min-h-screen transition-all duration-300 ease-in-out",
          isSidebarCollapsed ? "pl-[72px]" : "pl-64"
        )}
      >
        <div className="container max-w-7xl mx-auto p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
           <Outlet />
        </div>
      </main>
    </div>
  );
};