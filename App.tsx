
import * as React from 'react';
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

// Modular Imports
import { LauncherPage } from './routes/launcher/index';
import { Dashboard } from './routes/dashboard/index';
import { TicketsPage } from './routes/tickets/index';
import { CustomersPage } from './routes/customers/index';
import { TopologyPage } from './routes/topology/index';
import { MapsPage } from './routes/maps/index';
import { DatabasePage } from './routes/database/index';
import { MonitorPage } from './routes/monitor/index';
import { HelpCenterPage } from './routes/help/index';
import { SettingsPage } from './routes/settings/index';
import { LogsPage } from './routes/logs/index';
import { NotFoundPage, Error500Page } from './routes/errors';

// --- TanStack Query Setup ---
const queryClient = new QueryClient();

// --- TanStack Router Setup ---

// 1. Create Root Route (Layout) with Error Handling
const rootRoute = createRootRoute({
  component: AppLayout,
  notFoundComponent: NotFoundPage,
  errorComponent: Error500Page,
});

// 2. Create Child Routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LauncherPage,
});

const overviewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/overview',
  component: Dashboard,
});

const ticketsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tickets',
  component: TicketsPage,
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

const monitorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/monitor',
  component: MonitorPage,
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: HelpCenterPage,
});

const customersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customers',
  component: CustomersPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const logsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/logs',
  component: LogsPage,
});

// 3. Create Route Tree and Router
const routeTree = rootRoute.addChildren([
  indexRoute,
  overviewRoute,
  ticketsRoute,
  topologyRoute,
  mapsRoute,
  databaseRoute,
  monitorRoute,
  helpRoute,
  customersRoute,
  settingsRoute,
  logsRoute
]);

// Initialize memory history to prevent security errors with pushState in sandboxed environments (blobs/iframes)
const memoryHistory = createMemoryHistory({
  initialEntries: ['/'],
});

const router = createRouter({ 
  routeTree,
  history: memoryHistory,
  defaultPreload: 'intent',
} as any);

// --- Main App Component ---
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
