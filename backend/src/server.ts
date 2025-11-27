import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { 
  MOCK_USERS, 
  MOCK_DEVICES, 
  getDashboardStats, 
  getTrafficData, 
  getAllTickets, 
  getAllLogs, 
  updateTicket, 
  searchGlobalData,
  addTicket,
  addLog
} from './data';
import { Ticket, TicketLog } from './types';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins for dev
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 4000;

app.use(cors() as any);
app.use(express.json() as any);

// --- REST API Endpoints ---

// Dashboard
app.get('/api/dashboard/stats', (req, res) => {
  res.json(getDashboardStats());
});

app.get('/api/dashboard/traffic', (req, res) => {
  res.json(getTrafficData());
});

app.get('/api/dashboard/distribution', (req, res) => {
  res.json([
    { name: 'Technical', value: 45 },
    { name: 'Billing', value: 25 },
    { name: 'Feature', value: 20 },
    { name: 'General', value: 10 },
  ]);
});

// Tickets
app.get('/api/tickets/recent', (req, res) => {
  res.json(getAllTickets().slice(0, 10));
});

app.get('/api/tickets', (req, res) => {
  res.json(getAllTickets());
});

app.patch('/api/tickets/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const success = updateTicket(id, { status });
  if (success) {
      console.log(`Updated ticket ${id} to ${status}`);
      res.json(true);
  } else {
      res.status(404).json({ error: "Ticket not found" });
  }
});

// Users
app.get('/api/users', (req, res) => {
  res.json(MOCK_USERS);
});

app.get('/api/search/users', (req, res) => {
  const q = (req.query.q as string) || '';
  const users = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(q.toLowerCase()) || 
    u.email.toLowerCase().includes(q.toLowerCase())
  );
  res.json(users);
});

// Search
app.get('/api/search', (req, res) => {
  const q = (req.query.q as string) || '';
  res.json(searchGlobalData(q));
});

// Logs
app.get('/api/logs', (req, res) => {
  const ticketId = req.query.ticketId as string;
  let logs = getAllLogs();
  if (ticketId) {
    logs = logs.filter(l => l.ticketId === ticketId);
  }
  res.json(logs);
});

// Devices
app.get('/api/devices', (req, res) => {
  res.json(MOCK_DEVICES);
});

// Topologies (Static for now)
app.get('/api/topologies', (req, res) => {
  res.json([
     { id: 'topo-1', name: 'HQ Main Network', nodes: 24, status: 'Active', updatedAt: new Date().toISOString() },
     { id: 'topo-2', name: 'Branch Office A - Backup', nodes: 8, status: 'Draft', updatedAt: new Date(Date.now() - 86400000).toISOString() },
     { id: 'topo-3', name: 'Data Center Zone 1', nodes: 156, status: 'Active', updatedAt: new Date(Date.now() - 172800000).toISOString() },
     { id: 'topo-4', name: 'Guest Wi-Fi Grid', nodes: 12, status: 'Maintenance', updatedAt: new Date(Date.now() - 432000000).toISOString() },
     { id: 'topo-5', name: 'Proposed Expansion', nodes: 45, status: 'Draft', updatedAt: new Date(Date.now() - 604800000).toISOString() },
  ]);
});

// Database Tables (Mock)
app.get('/api/database/tables/:tableName', (req, res) => {
   const { tableName } = req.params;
   // Return generic data
   const data = Array.from({ length: 15 }).map((_, i) => ({
       id: i + 1,
       name: `${tableName}_record_${i}`,
       status: i % 2 === 0 ? 'active' : 'archived',
       created_at: new Date().toISOString(),
       metadata: JSON.stringify({ version: 1, checked: true })
    }));
    res.json(data);
});

// --- Socket.IO Simulation Loop ---

const SIM_TITLES = [
  "Payment gateway timeout",
  "User profile 404 error",
  "Dashboard charts not loading",
  "Export to PDF failed",
  "Mobile view navigation broken",
  "Slow API response on /users",
  "Password reset email delayed",
];
const SIM_NAMES = ["Alex Carter", "Sarah Jones", "Mike Chen", "Emma Wilson", "System"];
const SIM_MESSAGES = [
  "Customer replied via email.",
  "Internal note added.",
  "Escalated to engineering.",
  "Pending customer response.",
  "Patch verification passed.",
];

let logIdCounter = 1000;
let ticketIdCounter = 3000;

setInterval(() => {
    // 1. Randomly add a new log
    if (Math.random() < 0.3) {
      const newLog: TicketLog = {
        id: `L-${logIdCounter++}`,
        ticketId: `T-${Math.floor(Math.random() * 5) + 1020}`, 
        userId: Math.random() > 0.8 ? 'sys' : 'u2',
        userName: SIM_NAMES[Math.floor(Math.random() * SIM_NAMES.length)],
        message: SIM_MESSAGES[Math.floor(Math.random() * SIM_MESSAGES.length)],
        createdAt: new Date().toISOString()
      };
      addLog(newLog);
      io.emit('NEW_LOG', { type: 'NEW_LOG', payload: newLog });
    }

    // 2. Randomly add a new ticket
    if (Math.random() < 0.2) {
       const newTicket: Ticket = {
           id: `T-${ticketIdCounter++}`,
           title: SIM_TITLES[Math.floor(Math.random() * SIM_TITLES.length)],
           status: 'open',
           priority: Math.random() > 0.6 ? 'high' : 'medium',
           assigneeId: null,
           createdAt: new Date().toISOString()
       };
       addTicket(newTicket);
       io.emit('NEW_TICKET', { type: 'NEW_TICKET', payload: newTicket });
    }
}, 3000);

httpServer.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
