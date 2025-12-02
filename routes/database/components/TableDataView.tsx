
import * as React from 'react';
import { useMemo, useState } from 'react';
import { Download, ArrowLeft, Plus, Filter, RefreshCw, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { Button, Card, CardContent, cn, Badge } from '../../../components/ui';
import { EnhancedTable, ColumnDef } from '../../../components/ui/EnhancedTable';
import { useSupabaseTableData } from '../../../hooks/useSupabaseTableData';
import { supabase } from '../../../lib/supabaseClient';
import { RowEditorModal } from './RowEditorModal';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';
import { useLogActivity } from '../../../hooks/useQueries';

interface TableDataViewProps {
  tableName: string;
  onBack: () => void;
}

export const TableDataView = ({ tableName, onBack }: TableDataViewProps) => {
  const { data, loading, error, refetch } = useSupabaseTableData(tableName);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<any | null>(null);
  
  const logActivity = useLogActivity();

  // Stats (Dynamic based on real data)
  const stats = useMemo(() => [
     { label: 'Total Records', value: data.length >= 100 ? '100+ (Limit)' : data.length, color: 'bg-indigo-500' },
     { label: 'Columns', value: data.length > 0 ? Object.keys(data[0]).length : 0, color: 'bg-emerald-500' },
     { label: 'Status', value: error ? 'Error' : 'Live', color: error ? 'bg-red-500' : 'bg-blue-500' },
  ], [data, error]);

  // Derived column keys for the editor and export logic
  const allKeys = useMemo(() => {
      if (data.length === 0) return [];
      return Array.from(new Set(
        data.slice(0, 5).flatMap((row: any) => Object.keys(row))
      )) as string[];
  }, [data]);

  // Automatic Column Generation for Table
  const columns: ColumnDef<any>[] = useMemo(() => {
    if (data.length === 0) {
        return [{ header: 'ID', accessorKey: 'id' }];
    }
    
    // Filter out sensitive columns completely from the UI
    const safeKeys = allKeys.filter(key => 
        !['password', 'secret', 'token', 'hash', 'encrypted'].some(s => key.toLowerCase().includes(s))
    );

    // Map keys to Column Definitions with Smart Rendering
    return safeKeys.map((key): ColumnDef<any> => ({
      header: key.replace(/_/g, ' '), 
      accessorKey: key,
      className: 'min-w-[150px]', 
      cell: (row: any) => {
         const val = row[key];

         // Handle Null/Undefined
         if (val === null || val === undefined) {
             return <span className="text-slate-300 dark:text-slate-600 text-xs italic">null</span>;
         }

         // Handle Booleans
         if (typeof val === 'boolean') {
             return (
                <Badge variant={val ? 'success' : 'secondary'} className="h-5 text-[10px] px-1.5">
                    {val ? 'TRUE' : 'FALSE'}
                </Badge>
             );
         }

         // Handle Status-like strings (simple heuristic)
         if (key === 'status' || key === 'role' || key === 'state') {
             const s = String(val).toLowerCase();
             let color = "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300";
             if (['active', 'online', 'open', 'success', 'resolved'].some(x => s.includes(x))) 
                color = "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400";
             if (['warning', 'pending', 'process', 'draft'].some(x => s.includes(x))) 
                color = "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
             if (['error', 'offline', 'closed', 'deleted', 'banned'].some(x => s.includes(x))) 
                color = "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
             
             return <Badge variant="secondary" className={cn("capitalize font-normal whitespace-nowrap", color)}>{String(val)}</Badge>;
         }

         // Handle Dates (Heuristic: ISO strings or keys containing 'at'/'date')
         if (
             (typeof val === 'string' && val.length > 10 && (key.endsWith('_at') || key.includes('date'))) ||
             (val instanceof Date)
         ) {
             const date = new Date(val);
             if (!isNaN(date.getTime())) {
                 return <span className="text-slate-500 dark:text-slate-400 font-mono text-xs whitespace-nowrap">{date.toLocaleString()}</span>;
             }
         }

         // Handle Objects/Arrays
         if (typeof val === 'object') {
             const str = JSON.stringify(val);
             return (
                <div className="group relative">
                    <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 truncate max-w-[200px] block cursor-help opacity-80 group-hover:opacity-100">
                        {str}
                    </span>
                    <div className="absolute left-0 bottom-full mb-1 hidden group-hover:block bg-slate-900 text-white text-[10px] p-2 rounded shadow-xl z-50 whitespace-pre-wrap max-w-xs font-mono">
                        {JSON.stringify(val, null, 2)}
                    </div>
                </div>
             );
         }

         return <span className="truncate max-w-[300px] block text-slate-700 dark:text-slate-300" title={String(val)}>{String(val)}</span>;
      }
    }));
  }, [data, allKeys]);

  // --- Handlers ---

  const handleExportXLSX = () => {
    try {
        const wb = XLSX.utils.book_new();
        
        // Dynamic detection of grouping keys using allKeys to be safer
        const groupKey = ['service', 'services', 'service_name', 'category', 'type', 'group'].find(k => 
            allKeys.includes(k)
        );

        if (groupKey) {
            // Group data
            const groupedData: Record<string, any[]> = {};
            data.forEach((row) => {
                const rawKey = row[groupKey];
                const key = (rawKey === null || rawKey === undefined) ? 'Uncategorized' : String(rawKey);
                if (!groupedData[key]) {
                    groupedData[key] = [];
                }
                groupedData[key].push(row);
            });

            // Create sheets
            const usedSheetNames = new Set<string>();
            
            Object.entries(groupedData).forEach(([sheetName, rows]) => {
                let safeSheetName = sheetName.replace(/[:\\\/?*\[\]]/g, '').substring(0, 31) || 'Sheet';
                let uniqueName = safeSheetName;
                let counter = 1;
                while (usedSheetNames.has(uniqueName.toLowerCase())) {
                    const suffix = `_${counter}`;
                    uniqueName = safeSheetName.substring(0, 31 - suffix.length) + suffix;
                    counter++;
                }
                
                usedSheetNames.add(uniqueName.toLowerCase());
                const ws = XLSX.utils.json_to_sheet(rows);
                XLSX.utils.book_append_sheet(wb, ws, uniqueName);
            });
            
            toast.success(`Exported grouped by ${groupKey}`);
        } else {
            const ws = XLSX.utils.json_to_sheet(data);
            XLSX.utils.book_append_sheet(wb, ws, tableName.substring(0, 31));
            toast.success("Exported single sheet");
        }

        XLSX.writeFile(wb, `${tableName}_${new Date().toISOString().split('T')[0]}.xlsx`);
        
        logActivity.mutate({
            level: 'info',
            source: 'Database',
            message: `Exported table ${tableName} to XLSX`,
            user: 'Admin'
        });

    } catch (e: any) {
        console.error("Export failed", e);
        toast.error("Failed to export data", { description: e.message });
    }
  };

  const handleInsertClick = () => {
    setEditingRow(null);
    setIsEditorOpen(true);
  };

  const handleEditClick = (row: any) => {
    setEditingRow(row);
    setIsEditorOpen(true);
  };

  const handleSaveRow = async (formData: any) => {
    try {
        let error;
        if (!editingRow) {
            if (!formData.id) delete formData.id; 
        }

        if (editingRow) {
            const { error: err } = await supabase
                .from(tableName)
                .update(formData)
                .eq('id', editingRow.id);
            error = err;
        } else {
            const { error: err } = await supabase
                .from(tableName)
                .insert([formData]);
            error = err;
        }

        if (error) throw error;
        
        toast.success(editingRow ? 'Row updated' : 'Row inserted');
        
        // Log action
        logActivity.mutate({
            level: 'success',
            source: 'Database',
            message: editingRow ? `Updated row in ${tableName}` : `Inserted row into ${tableName}`,
            user: 'Admin',
            metadata: { table: tableName, recordId: editingRow?.id }
        });

        refetch();
    } catch (err: any) {
        console.error(err);
        toast.error(`Operation failed: ${err.message || 'Unknown error'}`);
        
        logActivity.mutate({
            level: 'error',
            source: 'Database',
            message: `Failed to ${editingRow ? 'update' : 'insert'} in ${tableName}`,
            user: 'Admin',
            metadata: { error: err.message }
        });
    }
  };

  const handleDeleteRow = async (row: any) => {
    if (!confirm(`Are you sure you want to delete this row (ID: ${row.id})?`)) return;

    try {
        const { error } = await supabase
            .from(tableName)
            .delete()
            .eq('id', row.id);
        
        if (error) throw error;
        
        toast.success("Row deleted");
        
        logActivity.mutate({
            level: 'warning',
            source: 'Database',
            message: `Deleted row from ${tableName}`,
            user: 'Admin',
            metadata: { table: tableName, recordId: row.id }
        });

        refetch();
    } catch (err: any) {
        console.error(err);
        toast.error(`Delete failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      
      <RowEditorModal 
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        onSave={handleSaveRow}
        initialData={editingRow}
        columns={allKeys}
        tableName={tableName}
      />

      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
               <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
               <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2 font-mono">
                  {tableName}
               </h2>
               <p className="text-xs text-slate-500">Raw Data Viewer</p>
            </div>
         </div>
         <div className="flex gap-2">
            <Button variant="ghost" className="bg-white dark:bg-black" onClick={refetch}>
               <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} /> 
               Refresh
            </Button>
            <Button variant="outline" className="bg-white dark:bg-black" onClick={handleExportXLSX}>
               <FileSpreadsheet className="mr-2 h-4 w-4 text-emerald-600" /> Export XLSX
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white" onClick={handleInsertClick}>
               <Plus className="mr-2 h-4 w-4" /> Insert Row
            </Button>
         </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
         {stats.map((stat, i) => (
            <Card key={i} className="dark:bg-[#121214] dark:border-white/5">
               <CardContent className="p-4 flex items-center justify-between">
                  <div>
                     <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
                     <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={cn("h-2 w-2 rounded-full", stat.color)} />
               </CardContent>
            </Card>
         ))}
      </div>

      {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 p-4 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-400">
              <AlertCircle className="h-5 w-5" />
              <div>
                  <p className="font-semibold">Failed to load data</p>
                  <p className="text-xs opacity-90">{error}</p>
              </div>
          </div>
      )}

      <div className="bg-white dark:bg-[#121214] border border-slate-200 dark:border-white/5 rounded-3xl overflow-hidden shadow-sm">
         {loading && data.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-2">
               <RefreshCw className="h-6 w-6 animate-spin" />
               <p>Loading data...</p>
            </div>
         ) : (
            <EnhancedTable 
               data={data} 
               columns={columns} 
               searchKey="id"
               onEdit={handleEditClick}
               onDelete={handleDeleteRow}
            />
         )}
      </div>
    </div>
  );
};
