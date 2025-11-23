
import { BackendService, Ticket, TicketLog, DashboardStats, TrafficData, User, Device } from '../types';

// Replace this with your actual backend URL
const API_BASE_URL = typeof process !== 'undefined' && process.env.API_URL 
  ? process.env.API_URL 
  : 'http://localhost:4000/api';

const headers = {
  'Content-Type': 'application/json',
  // Add authentication headers here if needed (e.g., Bearer token)
  // 'Authorization': `Bearer ${localStorage.getItem('token')}`
};

async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: { ...headers, ...options.headers },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const ApiService: BackendService = {
  getDashboardStats: () => fetchJson<DashboardStats>('/dashboard/stats'),
  
  getTrafficData: () => fetchJson<TrafficData>('/dashboard/traffic'),
  
  getTicketDistribution: () => fetchJson<{ name: string; value: number }[]>('/dashboard/distribution'),
  
  getRecentTickets: () => fetchJson<Ticket[]>('/tickets/recent'),
  
  getTickets: () => fetchJson<Ticket[]>('/tickets'),
  
  getCustomers: () => fetchJson<User[]>('/users'),
  
  getTopologies: () => fetchJson<any[]>('/topologies'),
  
  getTableData: (tableName: string) => fetchJson<any[]>(`/database/tables/${tableName}`),
  
  getTicketLogs: (ticketId?: string) => {
    const query = ticketId ? `?ticketId=${ticketId}` : '';
    return fetchJson<TicketLog[]>(`/logs${query}`);
  },
  
  updateTicketStatus: (ticketId: string, status: string) => 
    fetchJson<boolean>(`/tickets/${ticketId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
  
  searchUsers: (query: string) => fetchJson<User[]>(`/search/users?q=${encodeURIComponent(query)}`),
  
  searchGlobal: (query: string) => fetchJson<{ users: User[]; tickets: any[]; pages: any[] }>(`/search?q=${encodeURIComponent(query)}`),

  getDevices: () => fetchJson<Device[]>('/devices'),
};
