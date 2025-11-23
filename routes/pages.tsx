import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '../components/ui';
import { Search, Server, Database, Activity, Share2, MapPin, Globe, LifeBuoy, Book, MessageCircle, FileText } from 'lucide-react';

// --- Topology Page ---
export const TopologyPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Network Topology</h1>
          <p className="text-slate-500 dark:text-slate-400">Visualizing infrastructure nodes and connections.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline">Export Map</Button>
           <Button>Add Node</Button>
        </div>
      </div>

      <Card className="h-[600px] relative overflow-hidden bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center border-dashed">
        <div className="absolute inset-0 grid grid-cols-[repeat(20,minmax(0,1fr))] grid-rows-[repeat(20,minmax(0,1fr))] opacity-[0.05] pointer-events-none">
           {Array.from({ length: 400 }).map((_, i) => (
             <div key={i} className="border-[0.5px] border-slate-500" />
           ))}
        </div>
        
        {/* Mock Nodes */}
        <div className="relative w-full h-full max-w-3xl max-h-96">
           {/* Central Hub */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
              <div className="h-16 w-16 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20 animate-pulse">
                 <Server className="h-8 w-8 text-white" />
              </div>
              <span className="mt-2 text-sm font-semibold text-slate-900 dark:text-white bg-white dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">Core Switch</span>
           </div>

           {/* Satellites */}
           {[0, 72, 144, 216, 288].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x = Math.cos(rad) * 150;
              const y = Math.sin(rad) * 150;
              return (
                <div key={i} className="absolute top-1/2 left-1/2 flex flex-col items-center transition-all duration-1000" style={{ transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}>
                   {/* Connection Line (Pseudo) */}
                   <div className="absolute top-1/2 left-1/2 w-[150px] h-[2px] bg-slate-300 dark:bg-slate-700 origin-left -z-10" 
                        style={{ transform: `rotate(${deg + 180}deg) translate(0, -50%)`, width: '150px', left: '0', top: '2rem' }} />
                   
                   <div className="h-12 w-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-sm hover:border-indigo-500 hover:scale-110 transition-all cursor-pointer">
                      <Share2 className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                   </div>
                   <span className="mt-2 text-xs font-medium text-slate-500">Node-{100 + i}</span>
                </div>
              );
           })}
        </div>
      </Card>
    </div>
  );
};

// --- Maps Page ---
export const MapsPage = () => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Geographic Distribution</h1>
           <p className="text-slate-500 dark:text-slate-400">Live server locations and latency zones.</p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-1">
           <Button variant="ghost" size="sm" className="bg-slate-100 dark:bg-slate-800">World</Button>
           <Button variant="ghost" size="sm">USA</Button>
           <Button variant="ghost" size="sm">Europe</Button>
        </div>
      </div>

      <Card className="h-[600px] bg-indigo-50 dark:bg-[#0f172a] relative overflow-hidden border-0 shadow-inner">
         {/* Abstract Map Background */}
         <div className="absolute inset-0 opacity-20 dark:opacity-10 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-indigo-300 dark:fill-indigo-900">
               <path d="M10,20 Q20,5 30,20 T50,20 T70,20 T90,20 V80 H10 Z" />
               <path d="M0,40 Q25,25 50,40 T100,40 V100 H0 Z" transform="translate(0, 10)" />
            </svg>
         </div>

         {/* Pins */}
         <div className="absolute top-1/3 left-1/4 animate-bounce duration-[2000ms]">
            <MapPin className="h-8 w-8 text-red-500 drop-shadow-md" />
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[2px]" />
         </div>
         <div className="absolute top-1/2 left-1/2 animate-bounce duration-[2500ms]">
            <MapPin className="h-8 w-8 text-indigo-500 drop-shadow-md" />
         </div>
         <div className="absolute bottom-1/3 right-1/3 animate-bounce duration-[3000ms]">
            <MapPin className="h-8 w-8 text-emerald-500 drop-shadow-md" />
         </div>
         
         <div className="absolute bottom-6 right-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800">
            <h4 className="font-semibold text-sm mb-2">Region Status</h4>
            <div className="space-y-2 text-xs">
               <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>North America (Active)</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-indigo-500" />
                  <span>Europe (Active)</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span>Asia Pacific (High Latency)</span>
               </div>
            </div>
         </div>
      </Card>
    </div>
  );
};

// --- Database Page ---
export const DatabasePage = () => {
  const tables = [
    { name: 'users', rows: 12405, size: '45 MB', lastUpdated: '2 mins ago' },
    { name: 'tickets', rows: 84320, size: '128 MB', lastUpdated: '1 min ago' },
    { name: 'logs', rows: 1542001, size: '2.4 GB', lastUpdated: 'Just now' },
    { name: 'configs', rows: 540, size: '1.2 MB', lastUpdated: '4 hours ago' },
    { name: 'sessions', rows: 45, size: '0.5 MB', lastUpdated: 'Live' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Database Management</h1>
            <p className="text-slate-500 dark:text-slate-400">Schema overview and maintenance tools.</p>
         </div>
         <Button><Database className="mr-2 h-4 w-4" /> New Backup</Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
         {/* Main Tables List */}
         <div className="md:col-span-2 space-y-4">
            <Card>
               <CardHeader>
                  <CardTitle className="text-base">Public Schema Tables</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-1">
                     {tables.map((table) => (
                        <div key={table.name} className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-md transition-colors cursor-pointer group">
                           <div className="flex items-center gap-3">
                              <Database className="h-4 w-4 text-slate-400 group-hover:text-indigo-500" />
                              <div>
                                 <p className="font-medium text-sm text-slate-900 dark:text-slate-200">{table.name}</p>
                                 <p className="text-xs text-slate-500">{table.lastUpdated}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-sm font-mono text-slate-700 dark:text-slate-300">{table.rows.toLocaleString()}</p>
                              <p className="text-xs text-slate-400">{table.size}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Sidebar / Stats */}
         <div className="space-y-4">
            <Card className="bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-900/30">
               <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                     <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                     <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Healthy</h3>
                  </div>
                  <p className="text-sm text-emerald-800 dark:text-emerald-200">Database cluster is operating within normal parameters.</p>
                  <div className="mt-4 text-2xl font-bold text-emerald-900 dark:text-emerald-100">99.99%</div>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">Uptime this month</p>
               </CardContent>
            </Card>
            
            <Card>
               <CardHeader>
                  <CardTitle className="text-sm">Quick Actions</CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-xs"><Server className="mr-2 h-3 w-3" /> Rotate Credentials</Button>
                  <Button variant="outline" className="w-full justify-start text-xs"><Activity className="mr-2 h-3 w-3" /> View Query Logs</Button>
                  <Button variant="outline" className="w-full justify-start text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"><Database className="mr-2 h-3 w-3" /> Flush Cache</Button>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
};

// --- Help Center Page ---
export const HelpCenterPage = () => {
   return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-5 duration-500">
         <div className="text-center space-y-4 py-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">How can we help you?</h1>
            <div className="relative max-w-lg mx-auto">
               <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
               <Input className="pl-10 h-12 text-lg shadow-md border-slate-200 dark:border-slate-800" placeholder="Search for answers..." />
            </div>
         </div>

         <div className="grid md:grid-cols-3 gap-6">
            <Card className="hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors cursor-pointer">
               <CardContent className="p-6 space-y-3 text-center">
                  <div className="h-12 w-12 mx-auto bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                     <Book className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Documentation</h3>
                  <p className="text-sm text-slate-500">Guides and reference materials for configuration.</p>
               </CardContent>
            </Card>
            <Card className="hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors cursor-pointer">
               <CardContent className="p-6 space-y-3 text-center">
                  <div className="h-12 w-12 mx-auto bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                     <MessageCircle className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Community Forum</h3>
                  <p className="text-sm text-slate-500">Connect with other users and share solutions.</p>
               </CardContent>
            </Card>
            <Card className="hover:border-indigo-200 dark:hover:border-indigo-800 transition-colors cursor-pointer">
               <CardContent className="p-6 space-y-3 text-center">
                  <div className="h-12 w-12 mx-auto bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
                     <LifeBuoy className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Contact Support</h3>
                  <p className="text-sm text-slate-500">Get in touch with our technical support team.</p>
               </CardContent>
            </Card>
         </div>

         <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Popular Articles</h2>
            <div className="grid gap-2">
               {['Setting up your first bridge config', 'Understanding topology nodes', 'Database backup best practices', 'Troubleshooting API latency'].map((article, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg hover:shadow-sm transition-shadow cursor-pointer">
                     <div className="flex items-center gap-3">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{article}</span>
                     </div>
                     <ChevronRightIcon className="h-4 w-4 text-slate-400" />
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};

function ChevronRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
