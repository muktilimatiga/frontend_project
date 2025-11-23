import React from 'react';
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  createMemoryHistory,
} from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppLayout } from './components/Layout';
import { Dashboard } from './routes/dashboard';
import { TopologyPage, MapsPage, DatabasePage, HelpCenterPage } from './routes/pages';
import { Button } from './components/ui';

// --- TanStack Query Setup ---
const queryClient = new QueryClient();

// --- TanStack Router Setup ---

// 1. Create Root Route (Layout)
const rootRoute = createRootRoute({
  component: AppLayout,
});

// 2. Create Child Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Dashboard,
});

const ticketsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tickets',
  component: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Tickets</h2>
        <Button>New Ticket</Button>
      </div>
      <div className="rounded-md border border-slate-200 bg-white p-8 text-center text-slate-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
        Ticket list placeholder view.
      </div>
    </div>
  ),
});

const topologyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/topology',
  component: TopologyPage,
});

const mapsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/maps',
  component: MapsPage,
});

const databaseRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/database',
  component: DatabasePage,
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: HelpCenterPage,
});

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: () => <div className="p-4 text-slate-500">Customers view placeholder.</div>,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => <div className="p-4 text-slate-500">Settings view placeholder.</div>,
});

// 3. Create Route Tree and Router
const routeTree = rootRoute.addChildren([
  indexRoute, 
  ticketsRoute,
  topologyRoute,
  mapsRoute,
  databaseRoute,
  helpRoute,
  customersRoute,
  settingsRoute
]);

// Initialize memory history to prevent security errors with pushState in sandboxed environments (blobs/iframes)
const memoryHistory = createMemoryHistory({
  initialEntries: ['/'],
});

const router = createRouter({ 
  routeTree,
  history: memoryHistory,
} as any);

// --- Main App Component ---
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
