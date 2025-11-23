import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronLeft, ChevronRight, MoreHorizontal, ArrowUpDown } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Card Components ---
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-[#09090b] dark:text-slate-50", className)} {...props} />
));
Card.displayName = "Card";

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

// --- Badge ---
export const Badge = ({ children, variant = 'default', className }: { children?: React.ReactNode, variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'success' | 'warning', className?: string }) => {
  const variants = {
    default: "bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
    outline: "text-slate-950 border border-slate-200 dark:text-slate-50 dark:border-slate-700",
    destructive: "bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900/50 dark:text-red-50 dark:border dark:border-red-900 dark:hover:bg-red-900/90",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-50 dark:border dark:border-emerald-900 dark:hover:bg-emerald-900/90",
    warning: "bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-900/50 dark:text-amber-50 dark:border dark:border-amber-900 dark:hover:bg-amber-900/90",
  };
  return (
    <div className={cn("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 border-transparent", variants[variant], className)}>
      {children}
    </div>
  );
};

// --- Button ---
export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive', size?: 'sm' | 'default' | 'icon' }>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variants = {
    default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
    ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
    outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
    destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
  };
  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    icon: "h-9 w-9"
  };
  return (
    <button
      ref={ref}
      className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
Button.displayName = "Button";

// --- Switch ---
export const Switch = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { checked: boolean, onCheckedChange: (checked: boolean) => void }>(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-slate-300 dark:focus-visible:ring-offset-slate-950",
        checked ? "bg-slate-900 dark:bg-slate-50" : "bg-slate-200 dark:bg-slate-800",
        className
      )}
      ref={ref}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform dark:bg-slate-950",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
});
Switch.displayName = "Switch";

// --- Input ---
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn("flex h-9 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 text-sm text-slate-900 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950/50 dark:placeholder:text-slate-500 dark:text-slate-50 dark:focus-visible:ring-slate-300", className)}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn("flex min-h-[60px] w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950/50 dark:placeholder:text-slate-500 dark:text-slate-50 dark:focus-visible:ring-slate-300", className)}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

// --- Label ---
export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-sm font-medium leading-none text-slate-900 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-200", className)} {...props} />
));
Label.displayName = "Label";

// --- Select (Native wrapper) ---
export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...props }, ref) => (
  <div className="relative">
    <select
      className={cn("flex h-9 w-full items-center justify-between rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm text-slate-900 shadow-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950/50 dark:text-slate-50 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus:ring-slate-300", className)}
      ref={ref}
      {...props}
    />
  </div>
));
Select.displayName = "Select";

// --- Tooltip (Simplified) ---
export const Tooltip = ({ text, children }: { text: string, children?: React.ReactNode }) => {
  return (
    <div className="group relative flex items-center">
      {children}
      <div className="absolute left-full ml-2 hidden whitespace-nowrap rounded bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100 z-50 dark:bg-slate-50 dark:text-slate-900">
        {text}
      </div>
    </div>
  );
};

// --- Avatar ---
export const Avatar = ({ src, fallback, className }: { src?: string, fallback: string, className?: string }) => (
  <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}>
    {src ? (
      <img className="aspect-square h-full w-full object-cover" src={src} alt="Avatar" />
    ) : (
      <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 font-semibold">
        {fallback}
      </div>
    )}
  </div>
);

// --- Modal Primitive ---
export const ModalOverlay = ({ children, isOpen, onClose, className }: { children: React.ReactNode, isOpen: boolean, onClose: () => void, className?: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className={cn("relative z-50 w-full max-w-lg rounded-lg bg-white text-slate-900 p-6 shadow-lg animate-in zoom-in-95 duration-200 dark:bg-[#09090b] dark:text-slate-50 dark:border dark:border-slate-800", className)} onClick={e => e.stopPropagation()}>
        {children}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:text-slate-400"
        >
          <span className="sr-only">Close</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
        </button>
      </div>
    </div>
  );
};

// --- Command Palette Primitives (Simplified) ---
export const Command = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-slate-950 dark:bg-slate-950 dark:text-slate-50", className)} {...props} />
));
Command.displayName = "Command";

export const CommandInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b border-slate-200 px-3 dark:border-slate-800" cmdk-input-wrapper="">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 shrink-0 opacity-50"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
    <input
      ref={ref}
      className={cn("flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-slate-400", className)}
      {...props}
    />
  </div>
));
CommandInput.displayName = "CommandInput";

export const CommandList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)} {...props} />
));
CommandList.displayName = "CommandList";

export const CommandItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer", className)}
    {...props}
  />
));
CommandItem.displayName = "CommandItem";


// --- Dropdown Menu (Simplified Context-based) ---
const DropdownMenuContext = React.createContext<{ isOpen: boolean; setIsOpen: (v: boolean) => void }>({ isOpen: false, setIsOpen: () => {} });

export const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <DropdownMenuContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left" ref={containerRef}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

export const DropdownMenuTrigger = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, setIsOpen } = React.useContext(DropdownMenuContext);
  return (
    <div onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className="cursor-pointer inline-flex">
      {children}
    </div>
  );
};

export const DropdownMenuContent = ({ children, className, align = 'end' }: { children: React.ReactNode, className?: string, align?: 'start' | 'end' }) => {
  const { isOpen } = React.useContext(DropdownMenuContext);
  if (!isOpen) return null;
  return (
    <div className={cn("absolute z-50 mt-2 w-48 rounded-md border border-slate-200 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100 dark:border-white/10 dark:bg-[#09090b]", align === 'end' ? 'right-0 origin-top-right' : 'left-0 origin-top-left', className)}>
      <div className="py-1">{children}</div>
    </div>
  );
};

export const DropdownMenuItem = ({ children, onClick, className }: { children: React.ReactNode, onClick?: (e: React.MouseEvent) => void, className?: string }) => {
    const { setIsOpen } = React.useContext(DropdownMenuContext);
  return (
    <div
      className={cn("block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900 cursor-pointer dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white flex items-center gap-2", className)}
      onClick={(e) => {
        e.stopPropagation();
        if(onClick) onClick(e);
        setIsOpen(false);
      }}
    >
      {children}
    </div>
  );
};

export const DropdownMenuLabel = ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div className={cn("px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400", className)}>
        {children}
    </div>
);

export const DropdownMenuSeparator = ({ className }: { className?: string }) => (
    <div className={cn("h-px my-1 bg-slate-100 dark:bg-white/10", className)} />
);


// --- Table Primitives ---

export const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
))
Table.displayName = "Table"

export const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b dark:border-slate-800", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
))
TableBody.displayName = "TableBody"

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn("bg-slate-900 font-medium text-slate-50 dark:bg-slate-50 dark:text-slate-900", className)} {...props} />
))
TableFooter.displayName = "TableFooter"

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("border-b transition-colors hover:bg-slate-100/50 data-[state=selected]:bg-slate-100 dark:hover:bg-slate-800/50 dark:data-[state=selected]:bg-slate-800 dark:border-slate-800", className)} {...props} />
))
TableRow.displayName = "TableRow"

export const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400", className)} {...props} />
))
TableHead.displayName = "TableHead"

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
))
TableCell.displayName = "TableCell"

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-slate-500 dark:text-slate-400", className)} {...props} />
))
TableCaption.displayName = "TableCaption"


// --- DataTable Component ---

export type ColumnDef<T> = {
  header: string;
  accessorKey: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
};

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  searchKey?: keyof T;
}

export function DataTable<T extends { id: string | number }>({ data, columns, onEdit, onDelete, searchKey }: DataTableProps<T>) {
  const [sortKey, setSortKey] = React.useState<keyof T | null>(null);
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('asc');
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  
  const pageSize = 10;

  // Filter
  const filteredData = React.useMemo(() => {
    if (!search || !searchKey) return data;
    return data.filter(item => String(item[searchKey]).toLowerCase().includes(search.toLowerCase()));
  }, [data, search, searchKey]);

  // Sort
  const sortedData = React.useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDir]);

  // Paginate
  const paginatedData = React.useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
         {searchKey && (
            <div className="relative max-w-sm w-full">
              <input 
                 className="flex h-9 w-full rounded-md border border-slate-300 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:text-slate-50 dark:focus-visible:ring-slate-300" 
                 placeholder="Search..."
                 value={search}
                 onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
         )}
      </div>
      <div className="rounded-md border border-slate-200 dark:border-slate-800">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, i) => (
                <TableHead 
                   key={i} 
                   className={cn("cursor-pointer hover:text-slate-700 dark:hover:text-slate-200", col.className)}
                   onClick={() => handleSort(col.accessorKey)}
                >
                   <div className="flex items-center gap-1">
                      {col.header}
                      <ArrowUpDown className="h-3 w-3" />
                   </div>
                </TableHead>
              ))}
              {(onEdit || onDelete) && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
               <TableRow>
                  <TableCell colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="h-24 text-center">
                     No results.
                  </TableCell>
               </TableRow>
            ) : (
               paginatedData.map((item) => (
                 <TableRow key={item.id}>
                   {columns.map((col, i) => (
                     <TableCell key={i} className={col.className}>
                       {col.cell ? col.cell(item) : String(item[col.accessorKey])}
                     </TableCell>
                   ))}
                   {(onEdit || onDelete) && (
                     <TableCell className="text-right">
                       <DropdownMenu>
                           <DropdownMenuTrigger>
                               <Button variant="ghost" className="h-8 w-8 p-0">
                                   <span className="sr-only">Open menu</span>
                                   <MoreHorizontal className="h-4 w-4" />
                               </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                               <DropdownMenuLabel>Actions</DropdownMenuLabel>
                               <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(item.id))}>Copy ID</DropdownMenuItem>
                               <DropdownMenuSeparator />
                               {onEdit && <DropdownMenuItem onClick={() => onEdit(item)}>Edit Details</DropdownMenuItem>}
                               {onDelete && <DropdownMenuItem onClick={() => onDelete(item)} className="text-red-600 dark:text-red-400">Delete</DropdownMenuItem>}
                           </DropdownMenuContent>
                       </DropdownMenu>
                     </TableCell>
                   )}
                 </TableRow>
               ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <span className="text-sm text-slate-600 dark:text-slate-400">Page {page} of {totalPages || 1}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}