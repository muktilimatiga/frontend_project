
import { create } from 'zustand';
import { User } from './types';

interface AppState {
  // Sidebar State (Kept for compatibility, but UI will be fixed narrow)
  isSidebarCollapsed: boolean;
  toggleSidebar: () => void;
  
  // Session State
  user: User | null;
  login: (user: User) => void;
  logout: () => void;

  // Theme State
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // CLI Modal State
  isCliOpen: boolean;
  toggleCli: () => void;

  // Monitor Drawer State
  isMonitorOpen: boolean;
  toggleMonitor: () => void;

  // Global Search State
  isSearchOpen: boolean;
  toggleSearch: () => void;
  setSearchOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarCollapsed: true, // Default to collapsed/narrow view
  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  
  user: {
    id: 'u1',
    name: 'Alex Carter',
    email: 'alex@nexus.com',
    role: 'admin',
    avatarUrl: 'https://i.pravatar.cc/150?u=alex',
  },
  login: (user) => set({ user }),
  logout: () => set({ user: null }),

  theme: 'light',
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

  isCliOpen: false,
  toggleCli: () => set((state) => ({ isCliOpen: !state.isCliOpen })),

  isMonitorOpen: false,
  toggleMonitor: () => set((state) => ({ isMonitorOpen: !state.isMonitorOpen })),

  isSearchOpen: false,
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
}));
