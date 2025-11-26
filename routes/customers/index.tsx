
import * as React from 'react';
import { EnhancedTable, ColumnDef } from '../../components/ui/EnhancedTable';
import { Button, Badge, Avatar } from '../../components/ui';
import { User } from '../../types';
import { Plus, Download } from 'lucide-react';
import { useCustomers } from '../../hooks/useQueries';

export const CustomersPage = () => {
  const { data: customers = [] } = useCustomers();

  const columns: ColumnDef<User>[] = [
    { 
       header: 'Customer', 
       accessorKey: 'name', 
       cell: (u) => (
          <div className="flex items-center gap-3">
             <Avatar src={u.avatarUrl} fallback={u.name.charAt(0)} className="w-9 h-9" />
             <div>
                <div className="font-medium text-slate-900 dark:text-slate-100">{u.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{u.email}</div>
             </div>
          </div>
       )
    },
    { 
       header: 'Role', 
       accessorKey: 'role', 
       cell: (u) => (
          <Badge variant="outline" className="capitalize font-normal bg-slate-50 dark:bg-white/5">
             {u.role}
          </Badge>
       ) 
    },
    { 
       header: 'Location', 
       accessorKey: 'coordinates', 
       cell: (u) => u.coordinates ? (
          <div className="flex flex-col">
             <span className="text-xs font-medium text-slate-700 dark:text-slate-300">New York, USA</span>
             <span className="text-[10px] text-slate-400 font-mono">{u.coordinates.lat.toFixed(4)}, {u.coordinates.lng.toFixed(4)}</span>
          </div>
       ) : <span className="text-xs text-slate-400">N/A</span>
    },
    { 
       header: 'Status', 
       accessorKey: 'id', // Mock status
       cell: () => <Badge variant="success" className="bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/50 font-normal">Active</Badge>
    },
  ];

  return (
    <div className="animate-in fade-in duration-500">
      <EnhancedTable 
         title="Customers"
         data={customers} 
         columns={columns} 
         searchKey="name"
         onEdit={(u) => console.log('Edit', u)}
         onDelete={(u) => console.log('Delete', u)}
         actionButtons={
            <>
               <Button variant="outline" className="bg-white dark:bg-black">
                  <Download className="mr-2 h-4 w-4" /> Export
               </Button>
               <Button className="bg-slate-900 dark:bg-white dark:text-black">
                  <Plus className="mr-2 h-4 w-4" /> Add Customer
               </Button>
            </>
         }
      />
    </div>
  );
};
