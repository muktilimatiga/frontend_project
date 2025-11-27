import { z } from 'zod';

// --- Zod Schemas ---

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'agent', 'user']),
  avatarUrl: z.string().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number(),
  }).optional(),
});

export const TicketStatusSchema = z.enum(['open', 'in_progress', 'resolved', 'closed']);
export const TicketPrioritySchema = z.enum(['low', 'medium', 'high', 'critical']);

export const TicketSchema = z.object({
  id: z.string(),
  title: z.string().min(5, "Title must be at least 5 characters"),
  status: TicketStatusSchema,
  priority: TicketPrioritySchema,
  assigneeId: z.string().nullable(),
  createdAt: z.string().datetime(),
});

export const TicketLogSchema = z.object({
  id: z.string(),
  ticketId: z.string(),
  userId: z.string(),
  userName: z.string(),
  message: z.string(),
  createdAt: z.string().datetime(),
});

export const DashboardStatsSchema = z.object({
  totalTickets: z.number(),
  openTickets: z.number(),
  resolvedTickets: z.number(),
  avgResponseTime: z.string(),
});

export const TrafficDataSchema = z.array(z.object({
  name: z.string(),
  value: z.number(),
}));

// --- Types ---
export type User = z.infer<typeof UserSchema>;
export type Ticket = z.infer<typeof TicketSchema>;
export type TicketLog = z.infer<typeof TicketLogSchema>;
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
export type TrafficData = z.infer<typeof TrafficDataSchema>;

export interface Device {
  id: string;
  name: string;
  ip: string;
  status: 'online' | 'offline' | 'warning';
  folder: string;
  type: string;
  ping: number;
}
