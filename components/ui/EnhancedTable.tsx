
import * as React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal, 
  ArrowUpDown, 
  Edit2, 
  Trash2, 
  Copy, 
  Printer,
  Search
} from 'lucide-react';
import { toast } from 'sonner';
import { useDataTable } from '../../hooks/useDataTable';
import { 
  Button, 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator,
  cn
} from '../ui';

export type ColumnDef<T> = {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
};

interface EnhancedTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchKey?: keyof T | '*';
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onBulkDelete?: (ids: (string | number)[]) => void;
  title?: string;
  actionButtons?: React.ReactNode;
}

export function EnhancedTable<T extends { id: string | number }>({ 
  data, 
  columns, 
  searchKey, 
  onEdit, 
  onDelete,
  onBulkDelete,
  title,
  actionButtons
}: EnhancedTableProps<T>) {
  const {
    data: paginatedData,
    search,
    setSearch,
    sortKey,
    handleSort,
    page,
    setPage,
    totalPages,
    selectedRows,
    setSelectedRows,
    toggleSelectAll,
    toggleSelectRow,
    totalCount
  } = useDataTable({ data, searchKey, pageSize: 9 });

  // Bulk Handlers
  const handleBulkDuplicate = () => {
    toast.success(`Duplicated ${selectedRows.size} items successfully`);
    setSelectedRows(new Set());
  };

  const handleBulkPrint = () => {
    window.print();
    toast.info('Sending to printer...');
  };

  const handleBulkDelete = () => {
    const ids = Array.from(selectedRows) as (string | number)[];
    if (onBulkDelete) {
      onBulkDelete(ids);
    } else {
      // Default behavior if no handler passed
      toast.success(`Deleted ${ids.length} items`);
    }
    setSelectedRows(new Set());
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Table Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         {(title || searchKey) && (
            <div className="flex items-center gap-4 flex-1">
               {title && <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>}
               {searchKey && (
                  <div className="relative max-w-xs w-full">
                     <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 dark:text-slate-500" />
                     <input 
                        className="pl-9 flex h-9 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm shadow-sm transition-colors placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 dark:border-white/10 dark:bg-zinc-900/50 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus-visible:ring-indigo-500" 
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                     />
                  </div>
               )}
            </div>
         )}
         {actionButtons && <div className="flex gap-2">{actionButtons}</div>}
      </div>

      {/* Table Container - Compact & Rounded */}
      <div className="rounded-lg border border-slate-200 bg-white dark:border-white/10 dark:bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-white/5">
              <tr>
                <th className="px-3 py-2 w-[40px] text-center">
                   <input 
                      type="checkbox" 
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:checked:bg-indigo-500 cursor-pointer accent-indigo-600 h-3.5 w-3.5"
                      checked={paginatedData.length > 0 && selectedRows.size === paginatedData.length}
                      onChange={toggleSelectAll}
                   />
                </th>
                {columns.map((col, i) => (
                  <th 
                     key={i} 
                     className={cn(
                        "px-3 py-2 font-medium align-middle whitespace-nowrap text-xs uppercase tracking-wider", 
                        col.sortable !== false && "cursor-pointer hover:text-slate-700 dark:hover:text-slate-200",
                        col.className
                     )}
                     onClick={() => col.sortable !== false && handleSort(col.accessorKey)}
                  >
                     <div className="flex items-center gap-1.5">
                        {col.header}
                        {col.sortable !== false && <ArrowUpDown className="h-3 w-3 opacity-50" />}
                     </div>
                  </th>
                ))}
                {(onEdit || onDelete) && <th className="px-3 py-2 font-medium text-right text-xs uppercase tracking-wider">Action</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {paginatedData.length === 0 ? (
                 <tr>
                    <td colSpan={columns.length + 2} className="p-8 text-center text-slate-500 dark:text-slate-400">
                       No results found.
                    </td>
                 </tr>
              ) : (
                 paginatedData.map((row) => (
                   <tr 
                      key={row.id} 
                      className={cn(
                         "group transition-all hover:bg-slate-50 dark:hover:bg-white/5",
                         selectedRows.has(row.id) && "bg-indigo-50/50 dark:bg-indigo-500/10"
                      )}
                   >
                      <td className="px-3 py-2 text-center">
                         <input 
                            type="checkbox" 
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900 dark:checked:bg-indigo-500 cursor-pointer accent-indigo-600 h-3.5 w-3.5"
                            checked={selectedRows.has(row.id)}
                            onChange={() => toggleSelectRow(row.id)}
                         />
                      </td>
                      {columns.map((col, i) => (
                        <td key={i} className={cn("px-3 py-2 align-middle text-slate-700 dark:text-slate-300 text-sm", col.className)}>
                          {col.cell ? col.cell(row) : String(row[col.accessorKey])}
                        </td>
                      ))}
                      {(onEdit || onDelete) && (
                        <td className="px-3 py-2 text-right">
                           <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {onEdit && (
                                <button 
                                   onClick={() => onEdit(row)}
                                   className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors dark:hover:bg-indigo-500/20 dark:hover:text-indigo-400"
                                >
                                   <Edit2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {onDelete && (
                                <button 
                                   onClick={() => onDelete(row)}
                                   className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors dark:hover:bg-red-900/20 dark:hover:text-red-400"
                                >
                                   <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <DropdownMenu>
                                 <DropdownMenuTrigger>
                                    <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors dark:hover:bg-slate-800 dark:hover:text-slate-200">
                                       <MoreHorizontal className="w-3.5 h-3.5" />
                                    </button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => {
                                      navigator.clipboard.writeText(String(row.id));
                                      toast.success("ID copied to clipboard");
                                    }}>Copy ID</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
                           </div>
                        </td>
                      )}
                   </tr>
                 ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-3 py-2 border-t border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/5">
           <div className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
              Showing <span className="font-medium text-slate-900 dark:text-white">{(page - 1) * 9 + 1}-{Math.min(page * 9, totalCount)}</span> of <span className="font-medium text-slate-900 dark:text-white">{totalCount}</span> entries
           </div>
           <div className="flex items-center gap-2 ml-auto">
              <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={() => setPage(p => Math.max(1, p - 1))}
                 disabled={page === 1}
                 className="h-7 text-xs bg-white dark:bg-white/5 dark:border-white/10 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10"
              >
                 <ChevronLeft className="w-3 h-3 mr-1" /> Previous
              </Button>
              <div className="flex gap-1">
                 {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => (
                    <button
                       key={i + 1}
                       onClick={() => setPage(i + 1)}
                       className={cn(
                          "w-7 h-7 flex items-center justify-center rounded text-xs font-medium transition-colors",
                          page === i + 1 
                             ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20" 
                             : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/10 dark:hover:text-white"
                       )}
                    >
                       {i + 1}
                    </button>
                 ))}
                 {totalPages > 5 && <span className="flex items-center px-1 text-slate-400 text-xs">...</span>}
              </div>
              <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                 disabled={page === totalPages || totalPages === 0}
                 className="h-7 text-xs bg-white dark:bg-white/5 dark:border-white/10 dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/10"
              >
                 Next <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
           </div>
        </div>
      </div>

      {/* Floating Bulk Actions */}
      {selectedRows.size > 0 && (
         <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-xl rounded-xl p-2 flex items-center gap-2 animate-in slide-in-from-bottom-10 fade-in duration-300 ring-1 ring-black/5 dark:shadow-glow">
            <div className="bg-slate-900 text-white dark:bg-indigo-600 dark:text-white text-xs font-bold px-3 py-1.5 rounded-lg mr-2">
               {selectedRows.size} Selected
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300"
                onClick={handleBulkDuplicate}
            >
               <Copy className="mr-2 h-3.5 w-3.5" /> Duplicate
            </Button>
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 dark:text-slate-300"
                onClick={handleBulkPrint}
            >
               <Printer className="mr-2 h-3.5 w-3.5" /> Print
            </Button>
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                onClick={handleBulkDelete}
            >
               <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
            </Button>
         </div>
      )}
    </div>
  );
}
