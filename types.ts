import { z } from 'zod';
import React from 'react';

// --- Database Schema Proposal ---
/*
  Proposed SQL Schema (PostgreSQL/Prisma style):

  model User {
    id        String   @id @default(uuid())
    name      String
    email     String   @unique
    role      String   // 'admin', 'agent', 'user'
    avatarUrl String?
    lat       Float?
    lng       Float?
    tickets   Ticket[]
    logs      TicketLog[]
  }

  model Ticket {
    id          String      @id @default(uuid())
    title       String
    status      String      // 'open', 'in_progress', 'resolved', 'closed'
    priority    String      // 'low', 'medium', 'high', 'critical'
    assigneeId  String?
    assignee    User?       @relation(fields: [assigneeId], references: [id])
    createdAt   DateTime    @default(now())
    updatedAt   DateTime    @updatedAt
    logs        TicketLog[]
  }

  model TicketLog {
    id        String   @id @default(uuid())
    ticketId  String
    ticket    Ticket   @relation(fields: [ticketId], references: [id])
    userId    String
    user      User     @relation(fields: [userId], references: [id])
    message   String
    createdAt DateTime @default(now())
  }
*/

// --- Zod Schemas ---

export const UserSchema = z.object({
  id: z.string().uuid(),
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
  createdAt: z.string().datetime(), // ISO string for frontend
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
  avgResponseTime: z.string(), // e.g. "2h 15m"
});

export const TrafficDataSchema = z.array(z.object({
  name: z.string(),
  value: z.number(),
}));

// --- TypeScript Interfaces inferred from Zod ---
export type User = z.infer<typeof UserSchema>;
export type Ticket = z.infer<typeof TicketSchema>;
export type TicketLog = z.infer<typeof TicketLogSchema>;
export type DashboardStats = z.infer<typeof DashboardStatsSchema>;
export type TrafficData = z.infer<typeof TrafficDataSchema>;

// --- App Types ---
export type NavItem = {
  label: string;
  icon: React.ElementType;
  to: string;
};

// --- Realtime Types ---
export type RealtimeEvent = 
  | { type: 'NEW_TICKET'; payload: Ticket }
  | { type: 'NEW_LOG'; payload: TicketLog };