
import * as React from 'react';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, ArrowLeft, Plus, Filter } from 'lucide-react';
import { Button, Card, CardContent, cn } from '../../../components/ui';
import { EnhancedTable, ColumnDef } from '../../../components/ui/EnhancedTable';
import { MockService } from '../../../mock';

interface TableDataViewProps {
  tableName: string;
  onBack: () => void;
}

export const TableDataView = ({ tableName, onBack }: TableDataViewProps) => {
  const { data = [], isLoading } = useQuery({ 
     queryKey: ['tableData', tableName], 
     queryFn: () => MockService.getTableData(tableName) 
  });

  // Stats Mock
  const stats = [
     { label: 'Total Records', value: data.length + 120, color: 'bg-indigo-500' },
     { label: 'Recent Additions', value: 24, color: 'bg-emerald-500' },
     { label: 'Storage Used', value: '45 MB', color: 'bg-amber-500' },
     { label: 'Last Updated', value: 'Just now', color: 'bg-blue-500' },
  ];

  // Dynamic columns based on the first item
  const columns: ColumnDef<any>[] = useMemo(() => {
    if (data.length === 0) return [];
    const keys = Object.keys(data[0]);
    return keys.slice(0, 6).map(key => ({
      header: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
      accessorKey: key,
      cell: (row) => {
         const val = row[key];
         if (key === 'status') {
             const s = String(val).toLowerCase();
             let color = "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300";
             if (s.includes('pending')) color = "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300";
             if (s.includes('complete') || s.includes('active')) color = "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300";
             return <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${color}`}>{String(val)}</span>
         }
         if (typeof val === 'object') return JSON.stringify(val).slice(0, 20) + '...';
         return <span className="text-slate-700 dark:text-slate-300">{String(val)}</span>;
      }
    }));
  }, [data]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
       <div className="flex items-center gap-3 mb-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
             <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
             <h2 className="text-2xl font-bold capitalize text-slate-900 dark:text-white">All {tableName}</h2>
             <p className="text-xs text-slate-500 dark:text-slate-400">Manage {tableName} records directly.</p>
          </div>
       </div>

       {/* Stats Row */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
             <Card key={idx} className="dark:bg-black dark:border-white/20 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                   <div className="flex items-center gap-2 mb-2">
                      <div className={cn("w-2 h-2 rounded-full", stat.color)} />
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{stat.label}</p>
                   </div>
                   <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </CardContent>
             </Card>
          ))}
       </div>

       {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading data...</div>
       ) : (
          <EnhancedTable 
             data={data} 
             columns={columns} 
             searchKey="id" 
             onEdit={(row) => console.log('Edit', row)}
             onDelete={(row) => console.log('Delete', row)}
             actionButtons={
                <>
                   <Button variant="outline" className="bg-white dark:bg-black">
                      <Filter className="mr-2 h-4 w-4" /> Filter
                   </Button>
                   <Button variant="outline" className="bg-white dark:bg-black">
                      <Download className="mr-2 h-4 w-4" /> Export
                   </Button>
                   <Button className="bg-slate-900 dark:bg-white dark:text-black">
                      <Plus className="mr-2 h-4 w-4" /> Add Record
                   </Button>
                </>
             }
          />
       )}
    </div>
  );
};
