import { User, Device, Ticket, TicketLog, DashboardStats, TrafficData } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Alex Carter', email: 'alex@nexus.com', role: 'admin', avatarUrl: 'https://i.pravatar.cc/150?u=alex', coordinates: { lat: 40.7128, lng: -74.0060 } },
  { id: 'u2', name: 'Sarah Jones', email: 'sarah@client.com', role: 'user', coordinates: { lat: 40.7300, lng: -73.9950 } },
  { id: 'u3', name: 'Mike Chen', email: 'mike@tech.com', role: 'agent', coordinates: { lat: 40.7500, lng: -73.9800 } },
  { id: 'u4', name: 'Emma Wilson', email: 'emma@client.com', role: 'user', coordinates: { lat: 40.7100, lng: -74.0100 } },
  { id: 'u5', name: 'James Rod', email: 'james@corp.com', role: 'user', coordinates: { lat: 40.7400, lng: -74.0000 } },
  { id: 'u6', name: 'Lisa Ray', email: 'lisa@studio.com', role: 'user', coordinates: { lat: 40.7200, lng: -73.9900 } },
];

export const MOCK_DEVICES: Device[] = [
  { id: 'd1', name: 'Core Router HQ', ip: '192.168.1.1', status: 'online', folder: 'Routers', type: 'router', ping: 2 },
  { id: 'd2', name: 'Switch Floor 1', ip: '192.168.1.2', status: 'online', folder: 'Switches', type: 'switch', ping: 4 },
  { id: 'd3', name: 'Switch Floor 2', ip: '192.168.1.3', status: 'warning', folder: 'Switches', type: 'switch', ping: 150 },
  { id: 'd4', name: 'Backup Server', ip: '10.0.0.5', status: 'online', folder: 'Servers', type: 'server', ping: 1 },
  { id: 'd5', name: 'Web Server 01', ip: '10.0.0.10', status: 'offline', folder: 'Servers', type: 'server', ping: 0 },
  { id: 'd6', name: 'Access Point Lobby', ip: '192.168.2.10', status: 'online', folder: 'Access Points', type: 'ap', ping: 8 },
  { id: 'd7', name: 'Access Point Cafe', ip: '192.168.2.11', status: 'online', folder: 'Access Points', type: 'ap', ping: 12 },
  { id: 'd8', name: 'Firewall Main', ip: '192.168.0.1', status: 'online', folder: 'Security', type: 'firewall', ping: 3 },
];

// In-memory stores (in a real app, these would be in a DB)
let ticketsStore: Ticket[] = [];
let logsStore: TicketLog[] = [];

// Initialize some data
const now = Date.now();
const hour = 3600000;
const day = 86400000;

ticketsStore = [
  { id: 'T-1024', title: 'Login page crashing on Safari', status: 'open', priority: 'critical', assigneeId: 'u1', createdAt: new Date().toISOString() },
  { id: 'T-1023', title: 'Update subscription plan', status: 'open', priority: 'medium', assigneeId: null, createdAt: new Date(now - 1 * hour).toISOString() },
  { id: 'T-1022', title: 'Export data CSV malformed', status: 'in_progress', priority: 'high', assigneeId: 'u2', createdAt: new Date(now - 2 * hour).toISOString() },
  { id: 'T-1021', title: 'Dark mode toggle glitch', status: 'closed', priority: 'low', assigneeId: 'u1', createdAt: new Date(now - 5 * hour).toISOString() },
  { id: 'T-1020', title: 'API Rate limit inquiry', status: 'closed', priority: 'medium', assigneeId: 'u3', createdAt: new Date(now - 1 * day).toISOString() },
  { id: 'T-1019', title: 'Typos in documentation', status: 'closed', priority: 'low', assigneeId: 'u1', createdAt: new Date(now - 1.5 * day).toISOString() },
  { id: 'T-1018', title: 'User unable to delete account', status: 'closed', priority: 'high', assigneeId: 'u2', createdAt: new Date(now - 1.8 * day).toISOString() },
];

logsStore = [
  { id: 'L-1', ticketId: 'T-1024', userId: 'u1', userName: 'Alex Carter', message: 'Investigating Safari specific rendering issue.', createdAt: new Date().toISOString() },
  { id: 'L-2', ticketId: 'T-1024', userId: 'u1', userName: 'Alex Carter', message: 'Reproduced on iOS 17.', createdAt: new Date(now - 1800000).toISOString() },
  { id: 'L-3', ticketId: 'T-1022', userId: 'u2', userName: 'Sarah Jones', message: 'Patch deployed to staging.', createdAt: new Date(now - 3600000).toISOString() },
];

// Helper functions
export const getDashboardStats = (): DashboardStats => {
  return {
    totalTickets: 1248 + ticketsStore.length,
    openTickets: ticketsStore.filter(t => t.status === 'open').length + 42,
    resolvedTickets: 1105 + ticketsStore.filter(t => t.status === 'resolved' || t.status === 'closed').length,
    avgResponseTime: '1h 45m',
  };
};

export const getTrafficData = (): TrafficData => {
  return [
    { name: 'Mon', value: 120 },
    { name: 'Tue', value: 132 },
    { name: 'Wed', value: 101 },
    { name: 'Thu', value: 134 },
    { name: 'Fri', value: 190 },
    { name: 'Sat', value: 230 },
    { name: 'Sun', value: 210 },
  ];
};

export const getAllTickets = () => ticketsStore;
export const addTicket = (t: Ticket) => ticketsStore.unshift(t);
export const updateTicket = (id: string, updates: Partial<Ticket>) => {
  const idx = ticketsStore.findIndex(t => t.id === id);
  if (idx !== -1) {
    ticketsStore[idx] = { ...ticketsStore[idx], ...updates };
    return true;
  }
  return false;
};

export const getAllLogs = () => logsStore;
export const addLog = (l: TicketLog) => logsStore.unshift(l);

export const searchGlobalData = (query: string) => {
    if (!query) return { users: [], tickets: [], pages: [] };
    
    const users = MOCK_USERS.filter(u => u.name.toLowerCase().includes(query.toLowerCase()));
    const tickets = ticketsStore.filter(t => t.title.toLowerCase().includes(query.toLowerCase()) || t.id.toLowerCase().includes(query.toLowerCase()));

    const pages = [
       { title: 'Dashboard', to: '/', type: 'page' },
       { title: 'Topology', to: '/topology', type: 'page' },
       { title: 'Database', to: '/database', type: 'page' },
       { title: 'Settings', to: '/settings', type: 'page' }
    ].filter(p => p.title.toLowerCase().includes(query.toLowerCase()));

    return { users, tickets, pages };
};
