import * as React from 'react';
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, ArrowLeft } from 'lucide-react';
import { Button, DataTable, ColumnDef, Card, CardContent } from '../../../components/ui';
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

  // Dynamic columns based on the first item
  const columns: ColumnDef<any>[] = useMemo(() => {
    if (data.length === 0) return [];
    const keys = Object.keys(data[0]);
    return keys.slice(0, 6).map(key => ({
      header: key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' '),
      accessorKey: key,
      cell: (row) => {
         const val = row[key];
         if (typeof val === 'object') return JSON.stringify(val).slice(0, 20) + '...';
         return String(val);
      }
    }));
  }, [data]);

  const handleExport = () => {
    // Simulated Export
    const header = columns.map(c => c.header).join(',');
    const rows = data.map(row => columns.map(c => JSON.stringify(row[c.accessorKey as string])).join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [header, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${tableName}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
       <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
             </Button>
             <div>
                <h2 className="text-xl font-bold capitalize text-slate-900 dark:text-white">{tableName}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Viewing {data.length} rows</p>
             </div>
          </div>
          <Button variant="outline" onClick={handleExport}>
             <Download className="mr-2 h-4 w-4" /> Export XLSX
          </Button>
       </div>

       <Card className="dark:bg-black dark:border-white/20">
          <CardContent className="pt-6">
             {isLoading ? <div className="p-8 text-center text-slate-500">Loading data...</div> : (
                <DataTable 
                   data={data} 
                   columns={columns} 
                   searchKey="id" 
                />
             )}
          </CardContent>
       </Card>
    </div>
  );
};