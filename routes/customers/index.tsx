import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, Button, DataTable, ColumnDef, Badge } from '../../components/ui';
import { MockService } from '../../mock';
import { User } from '../../types';

export const CustomersPage = () => {
  const { data: customers = [], isLoading } = useQuery({ queryKey: ['customers'], queryFn: MockService.getCustomers });

  const columns: ColumnDef<User>[] = [
    { header: 'User', accessorKey: 'name', cell: (u) => (
       <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-xs font-bold">{u.name.charAt(0)}</div>
          <div>
             <div className="font-medium">{u.name}</div>
             <div className="text-xs text-slate-500 dark:text-slate-400">{u.email}</div>
          </div>
       </div>
    )},
    { header: 'Role', accessorKey: 'role', cell: (u) => <Badge variant="outline">{u.role}</Badge> },
    { header: 'Location', accessorKey: 'coordinates', cell: (u) => u.coordinates ? <span className="text-xs text-slate-500 font-mono dark:text-slate-400">{u.coordinates.lat.toFixed(4)}, {u.coordinates.lng.toFixed(4)}</span> : <span className="text-xs text-slate-400 dark:text-slate-600">N/A</span> },
    { header: 'ID', accessorKey: 'id', className: 'text-xs text-slate-400 font-mono' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Customers</h1>
           <p className="text-slate-500 dark:text-slate-400">View and manage user accounts.</p>
        </div>
        <Button>Add Customer</Button>
      </div>
      <Card className="dark:bg-black dark:border-white/20">
         <CardContent className="pt-6">
            {isLoading ? <div className="p-8 text-center text-slate-500">Loading customers...</div> : (
              <DataTable 
                 data={customers} 
                 columns={columns} 
                 searchKey="name" 
                 onEdit={(u) => console.log('Edit', u)}
                 onDelete={(u) => console.log('Delete', u)}
              />
            )}
         </CardContent>
      </Card>
    </div>
  );
};