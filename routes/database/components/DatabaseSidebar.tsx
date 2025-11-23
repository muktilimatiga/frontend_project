import React from 'react';
import { Activity, Server, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button } from '../../../components/ui';

export const DatabaseSidebar = () => {
  return (
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
       
       <Card className="dark:bg-black dark:border-white/20">
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
  );
};