import { Ticket, TicketLog, DashboardStats, TrafficData, RealtimeEvent, User } from './types';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Carter', email: 'alex@nexus.com', role: 'admin', avatarUrl: 'https://i.pravatar.cc/150?u=alex' },
  { id: 'u2', name: 'Sarah Jones', email: 'sarah@client.com', role: 'user' },
  { id: 'u3', name: 'Mike Chen', email: 'mike@tech.com', role: 'agent' },
  { id: 'u4', name: 'Emma Wilson', email: 'emma@client.com', role: 'user' },
  { id: 'u5', name: 'James Rod', email: 'james@corp.com', role: 'user' },
  { id: 'u6', name: 'Lisa Ray', email: 'lisa@studio.com', role: 'user' },
];

export const MockService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    await delay(600);
    return {
      totalTickets: 1248,
      openTickets: 42,
      resolvedTickets: 1105,
      avgResponseTime: '1h 45m',
    };
  },

  getTrafficData: async (): Promise<TrafficData> => {
    await delay(800);
    return [
      { name: 'Mon', value: 120 },
      { name: 'Tue', value: 132 },
      { name: 'Wed', value: 101 },
      { name: 'Thu', value: 134 },
      { name: 'Fri', value: 190 },
      { name: 'Sat', value: 230 },
      { name: 'Sun', value: 210 },
    ];
  },

  getTicketDistribution: async () => {
    await delay(700);
    return [
      { name: 'Technical', value: 45 },
      { name: 'Billing', value: 25 },
      { name: 'Feature', value: 20 },
      { name: 'General', value: 10 },
    ];
  },

  getRecentTickets: async (): Promise<Ticket[]> => {
    await delay(500);
    const now = Date.now();
    const hour = 3600000;
    const day = 86400000;

    return [
      { id: 'T-1024', title: 'Login page crashing on Safari', status: 'open', priority: 'critical', assigneeId: 'u1', createdAt: new Date().toISOString() },
      { id: 'T-1023', title: 'Update subscription plan', status: 'open', priority: 'medium', assigneeId: null, createdAt: new Date(now - 1 * hour).toISOString() },
      { id: 'T-1022', title: 'Export data CSV malformed', status: 'in_progress', priority: 'high', assigneeId: 'u2', createdAt: new Date(now - 2 * hour).toISOString() },
      // Recently closed (within 2 days)
      { id: 'T-1021', title: 'Dark mode toggle glitch', status: 'closed', priority: 'low', assigneeId: 'u1', createdAt: new Date(now - 5 * hour).toISOString() },
      { id: 'T-1020', title: 'API Rate limit inquiry', status: 'closed', priority: 'medium', assigneeId: 'u3', createdAt: new Date(now - 1 * day).toISOString() },
      { id: 'T-1019', title: 'Typos in documentation', status: 'closed', priority: 'low', assigneeId: 'u1', createdAt: new Date(now - 1.5 * day).toISOString() },
      { id: 'T-1018', title: 'User unable to delete account', status: 'closed', priority: 'high', assigneeId: 'u2', createdAt: new Date(now - 1.8 * day).toISOString() },
      // Older closed
      { id: 'T-1015', title: 'Legacy API deprecation', status: 'closed', priority: 'low', assigneeId: 'u1', createdAt: new Date(now - 3 * day).toISOString() },
      { id: 'T-1014', title: 'Favicon missing', status: 'resolved', priority: 'low', assigneeId: 'u3', createdAt: new Date(now - 4 * day).toISOString() },
    ];
  },

  getTickets: async (): Promise<Ticket[]> => {
    await delay(600);
    // Generate more mock tickets for the table
    const tickets: Ticket[] = [];
    const statuses: Ticket['status'][] = ['open', 'in_progress', 'resolved', 'closed'];
    const priorities: Ticket['priority'][] = ['low', 'medium', 'high', 'critical'];
    
    for(let i = 0; i < 50; i++) {
        tickets.push({
            id: `T-${2000 + i}`,
            title: `System issue report #${2000 + i} - ${['Network latency', 'UI Glitch', 'Billing Error', 'Feature Request'][i % 4]}`,
            status: statuses[i % 4],
            priority: priorities[i % 4],
            assigneeId: i % 3 === 0 ? 'u1' : null,
            createdAt: new Date(Date.now() - i * 86400000).toISOString()
        });
    }
    return tickets;
  },

  getCustomers: async (): Promise<User[]> => {
    await delay(500);
    return MOCK_USERS;
  },

  getTicketLogs: async (): Promise<TicketLog[]> => {
    await delay(600);
    return [
      { id: 'L-1', ticketId: 'T-1024', userId: 'u1', userName: 'Alex Carter', message: 'Investigating Safari specific rendering issue.', createdAt: new Date().toISOString() },
      { id: 'L-2', ticketId: 'T-1024', userId: 'u1', userName: 'Alex Carter', message: 'Reproduced on iOS 17.', createdAt: new Date(Date.now() - 1800000).toISOString() },
      { id: 'L-3', ticketId: 'T-1022', userId: 'u2', userName: 'Sarah Jones', message: 'Patch deployed to staging.', createdAt: new Date(Date.now() - 3600000).toISOString() },
      { id: 'L-4', ticketId: 'T-1023', userId: 'sys', userName: 'System', message: 'Ticket created via Email.', createdAt: new Date(Date.now() - 7200000).toISOString() },
    ];
  },
  
  updateTicketStatus: async (ticketId: string, status: string): Promise<boolean> => {
    await delay(400);
    console.log(`Updated ticket ${ticketId} to ${status}`);
    return true;
  },

  searchUsers: async (query: string): Promise<User[]> => {
    await delay(300);
    if (!query) return [];
    return MOCK_USERS.filter(u => 
      u.name.toLowerCase().includes(query.toLowerCase()) || 
      u.email.toLowerCase().includes(query.toLowerCase())
    );
  },

  searchGlobal: async (query: string) => {
    await delay(300);
    if (!query) return { users: [], tickets: [], pages: [] };
    
    const users = MOCK_USERS.filter(u => u.name.toLowerCase().includes(query.toLowerCase()));
    
    // Quick mock ticket search (normally would call getRecentTickets but filtering here for speed)
    const tickets = [
       { id: 'T-1024', title: 'Login page crashing on Safari', type: 'ticket' },
       { id: 'T-1023', title: 'Update subscription plan', type: 'ticket' }
    ].filter(t => t.title.toLowerCase().includes(query.toLowerCase()) || t.id.toLowerCase().includes(query.toLowerCase()));

    const pages = [
       { title: 'Dashboard', to: '/', type: 'page' },
       { title: 'Topology', to: '/topology', type: 'page' },
       { title: 'Database', to: '/database', type: 'page' },
       { title: 'Settings', to: '/settings', type: 'page' }
    ].filter(p => p.title.toLowerCase().includes(query.toLowerCase()));

    return { users, tickets, pages };
  }
};

// --- Realtime Mock Socket ---

type Listener = (event: RealtimeEvent) => void;

export const MockSocket = {
  listeners: new Set<Listener>(),
  
  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  emit(event: RealtimeEvent) {
    this.listeners.forEach((listener) => listener(event));
  }
};

// Simulation Loop
const SIM_TITLES = [
  "Payment gateway timeout",
  "User profile 404 error",
  "Dashboard charts not loading",
  "Export to PDF failed",
  "Mobile view navigation broken",
  "Slow API response on /users",
  "Password reset email delayed",
  "Integration key invalid",
];
const SIM_NAMES = ["Alex Carter", "Sarah Jones", "Mike Chen", "Emma Wilson", "System"];
const SIM_MESSAGES = [
  "Customer replied via email.",
  "Internal note added.",
  "Escalated to engineering.",
  "Pending customer response.",
  "Patch verification passed.",
  "Ticket priority updated.",
];

let logIdCounter = 100;
let ticketIdCounter = 2000;

// Only start interval if we are in a browser environment
if (typeof window !== 'undefined') {
  setInterval(() => {
    // 1. Randomly add a new log (30% chance every 3s)
    if (Math.random() < 0.3) {
      const newLog: TicketLog = {
        id: `L-${logIdCounter++}`,
        ticketId: `T-${Math.floor(Math.random() * 5) + 1020}`, 
        userId: Math.random() > 0.8 ? 'sys' : 'u2',
        userName: SIM_NAMES[Math.floor(Math.random() * SIM_NAMES.length)],
        message: SIM_MESSAGES[Math.floor(Math.random() * SIM_MESSAGES.length)],
        createdAt: new Date().toISOString()
      };
      MockSocket.emit({ type: 'NEW_LOG', payload: newLog });
    }

    // 2. Randomly add a new ticket (20% chance every 3s)
    if (Math.random() < 0.2) {
       const newTicket: Ticket = {
           id: `T-${ticketIdCounter++}`,
           title: SIM_TITLES[Math.floor(Math.random() * SIM_TITLES.length)],
           status: 'open',
           priority: Math.random() > 0.6 ? 'high' : 'medium',
           assigneeId: null,
           createdAt: new Date().toISOString()
       };
       MockSocket.emit({ type: 'NEW_TICKET', payload: newTicket });
    }
  }, 3000);
}