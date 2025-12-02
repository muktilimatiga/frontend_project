import * as React from 'react';
import { forwardRef, useState, useEffect, useRef, createContext, useContext, useMemo } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ChevronLeft, ChevronRight, MoreHorizontal, ArrowUpDown } from 'lucide-react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Card Components (Updated for Soft/Neon aesthetic) ---
export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "rounded-3xl border border-transparent bg-white text-slate-900 shadow-soft transition-all duration-300", 
      // Dark Mode: Remove harsh borders, use subtle background + inner glow potential
      "dark:border-white/5 dark:bg-[#121214] dark:text-zinc-50 dark:shadow-none",
      // Hover State (Subtle lift)
      "hover:shadow-lg hover:-translate-y-0.5",
      className
    )} 
    {...props} 
  />
));
Card.displayName = "Card";

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-bold text-lg leading-none tracking-tight", className)} {...props} />
));
CardTitle.displayName = "CardTitle";

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

// --- Separator ---
export const Separator = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' }>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "shrink-0 bg-slate-100 dark:bg-zinc-800",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = "Separator"

// --- Badge ---
export const Badge = ({ children, variant = 'default', className, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'success' | 'warning' }) => {
  const variants = {
    default: "bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-indigo-600 dark:text-white",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-zinc-800 dark:text-zinc-300",
    outline: "text-slate-950 border border-slate-200 dark:text-slate-300 dark:border-zinc-700",
    destructive: "bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-red-900/50 dark:text-red-200",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-200",
    warning: "bg-amber-500 text-white hover:bg-amber-600 dark:bg-amber-900/50 dark:text-amber-200",
  };
  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 border-transparent", variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

// --- Button ---
export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive', size?: 'sm' | 'default' | 'icon' }>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variants = {
    default: "bg-slate-900 text-slate-50 hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 shadow-sm",
    ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-white/10 dark:hover:text-slate-50",
    outline: "border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 dark:border-white/10 dark:bg-transparent dark:hover:bg-white/5 dark:hover:text-slate-50",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-zinc-800 dark:text-slate-50",
    destructive: "bg-red-500 text-slate-50 hover:bg-red-600 dark:bg-red-900/50 dark:text-red-200 dark:hover:bg-red-900/80",
  };
  const sizes = {
    default: "h-10 px-5 py-2",
    sm: "h-8 rounded-lg px-3 text-xs",
    icon: "h-10 w-10"
  };
  return (
    <button
      ref={ref}
      className={cn("inline-flex items-center justify-center rounded-2xl text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)}
      {...props}
    />
  );
});
Button.displayName = "Button";

// --- Switch ---
export const Switch = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { checked: boolean, onCheckedChange: (checked: boolean) => void }>(({ className, checked, onCheckedChange, ...props }, ref) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-slate-300 dark:focus-visible:ring-offset-slate-950",
        checked ? "bg-slate-900 dark:bg-indigo-600" : "bg-slate-200 dark:bg-zinc-700",
        className
      )}
      ref={ref}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform dark:bg-white",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
});
Switch.displayName = "Switch";

// --- Input ---
export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn("flex h-10 w-full rounded-2xl border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-zinc-900/50 dark:placeholder:text-zinc-600 dark:text-slate-50 dark:focus-visible:ring-white", className)}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn("flex min-h-[60px] w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-zinc-900/50 dark:placeholder:text-zinc-600 dark:text-slate-50 dark:focus-visible:ring-white", className)}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

// --- Label ---
export const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-sm font-medium leading-none text-slate-700 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-slate-300", className)} {...props} />
));
Label.displayName = "Label";

// --- Select (Native wrapper) ---
export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...props }, ref) => (
  <div className="relative">
    <select
      className={cn("flex h-10 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm ring-offset-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-zinc-900/50 dark:text-slate-50 dark:ring-offset-zinc-950 dark:placeholder:text-zinc-600 dark:focus:ring-white", className)}
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
      <div className="absolute left-full ml-2 hidden whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:block group-hover:opacity-100 z-50 dark:bg-zinc-800 dark:text-slate-100 border border-slate-700 shadow-sm">
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
      <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 font-semibold border border-slate-200 dark:border-white/10">
        {fallback}
      </div>
    )}
  </div>
);

// --- Modal Primitive ---
export const ModalOverlay = ({ children, isOpen, onClose, className, hideCloseButton }: { children?: React.ReactNode, isOpen: boolean, onClose: () => void, className?: string, hideCloseButton?: boolean }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className={cn("relative z-50 w-full max-w-lg rounded-3xl bg-white text-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-200 dark:bg-[#121214] dark:text-slate-50 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_60px_-10px_rgba(0,0,0,0.6)] dark:border-transparent", className)} onClick={e => e.stopPropagation()}>
        {children}
        {!hideCloseButton && (
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 opacity-70 ring-offset-white transition-opacity hover:bg-slate-100 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:text-slate-400 dark:hover:bg-zinc-800"
          >
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
          </button>
        )}
      </div>
    </div>
  );
};

// --- Command Palette Primitives (Simplified) ---
export const Command = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white text-slate-950 dark:bg-[#121214] dark:text-slate-50", className)} {...props} />
));
Command.displayName = "Command";

export const CommandInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b border-slate-100 px-3 dark:border-white/10" cmdk-input-wrapper="">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 shrink-0 opacity-50"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
    <input
      ref={ref}
      className={cn("flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-zinc-500", className)}
      {...props}
    />
  </div>
));
CommandInput.displayName = "CommandInput";

export const CommandList = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)} {...props} />
));
CommandList.displayName = "CommandList";

export const CommandItem = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex cursor-default select-none items-center rounded-xl px-2 py-1.5 text-sm outline-none aria-selected:bg-slate-100 aria-selected:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-white/10 dark:aria-selected:text-slate-50 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer", className)}
    {...props}
  />
));
CommandItem.displayName = "CommandItem";


// --- Dropdown Menu (Simplified Context-based) ---
const DropdownMenuContext = createContext<{ isOpen: boolean; setIsOpen: (v: boolean) => void }>({ isOpen: false, setIsOpen: () => {} });

export const DropdownMenu = ({ children, className }: { children?: React.ReactNode, className?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
      <div className={cn("relative inline-block text-left", className)} ref={containerRef}>
        {children}
      </div>
    </DropdownMenuContext.Provider>
  );
};

export const DropdownMenuTrigger = ({ children, className, asChild }: { children?: React.ReactNode, className?: string, asChild?: boolean }) => {
  const { isOpen, setIsOpen } = useContext(DropdownMenuContext);
  
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: React.MouseEvent) => {
        e.stopPropagation();
        const childProps = (children as React.ReactElement<any>).props;
        if (childProps.onClick) childProps.onClick(e);
        setIsOpen(!isOpen);
      },
      className: cn(className, (children as React.ReactElement<any>).props.className)
    });
  }

  return (
    <div onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }} className={cn("cursor-pointer inline-flex", className)}>
      {children}
    </div>
  );
};

export const DropdownMenuContent = ({ 
  children, 
  className, 
  align = 'end', 
  side = 'bottom',
  ...props
}: { 
  children?: React.ReactNode, 
  className?: string, 
  align?: 'start' | 'end' | 'center', 
  side?: 'top' | 'bottom' | 'left' | 'right' 
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { isOpen } = useContext(DropdownMenuContext);
  if (!isOpen) return null;

  let positionClasses = "";
  if (side === 'bottom') {
      positionClasses = "mt-2";
      if (align === 'end') positionClasses += " right-0 origin-top-right";
      else if (align === 'start') positionClasses += " left-0 origin-top-left";
      else if (align === 'center') positionClasses += " left-1/2 -translate-x-1/2 origin-top";
  } else if (side === 'top') {
      positionClasses = "bottom-full mb-2";
      if (align === 'end') positionClasses += " right-0 origin-bottom-right";
      else if (align === 'start') positionClasses += " left-0 origin-bottom-left";
      else if (align === 'center') positionClasses += " left-1/2 -translate-x-1/2 origin-bottom";
  } else if (side === 'right') {
      positionClasses = "left-full ml-2 top-0 origin-top-left";
      if (align === 'center') positionClasses += " -translate-y-1/2 top-1/2";
      if (align === 'end') positionClasses += " bottom-0 top-auto";
  } else if (side === 'left') {
      positionClasses = "right-full mr-2 top-0 origin-top-right";
      if (align === 'center') positionClasses += " -translate-y-1/2 top-1/2";
      if (align === 'end') positionClasses += " bottom-0 top-auto";
  }

  return (
    <div 
      className={cn(
        "absolute z-50 w-48 rounded-2xl border border-slate-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none animate-in fade-in zoom-in-95 duration-100 dark:border-white/5 dark:bg-[#121214] dark:shadow-card-dark", 
        positionClasses, 
        className
      )}
      {...props}
    >
      <div className="py-1">{children}</div>
    </div>
  );
};

export const DropdownMenuItem = ({ children, onClick, className }: { children?: React.ReactNode, onClick?: (e: React.MouseEvent) => void, className?: string }) => {
    const { setIsOpen } = useContext(DropdownMenuContext);
  return (
    <div
      className={cn("block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900 cursor-pointer dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-slate-50 flex items-center gap-2", className)}
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

export const DropdownMenuLabel = ({ children, className }: { children?: React.ReactNode, className?: string }) => (
    <div className={cn("px-4 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400", className)}>
        {children}
    </div>
);

export const DropdownMenuSeparator = ({ className }: { className?: string }) => (
    <div className={cn("h-px my-1 bg-slate-100 dark:bg-white/10", className)} />
);


// --- Table Primitives ---

export const Table = forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
))
Table.displayName = "Table"

export const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b dark:border-white/5", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
))
TableBody.displayName = "TableBody"

export const TableFooter = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn("bg-slate-900 font-medium text-slate-50 dark:bg-slate-50 dark:text-slate-900", className)} {...props} />
))
TableFooter.displayName = "TableFooter"

export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("border-b border-slate-100 transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-100 dark:hover:bg-white/5 dark:data-[state=selected]:bg-white/5 dark:border-white/5", className)} {...props} />
))
TableRow.displayName = "TableRow"

export const TableHead = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium text-slate-500 [&:has([role=checkbox])]:pr-0 dark:text-slate-400", className)} {...props} />
))
TableHead.displayName = "TableHead"

export const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
))
TableCell.displayName = "TableCell"

export const TableCaption = forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-slate-500 dark:text-slate-400", className)} {...props} />
))
TableCaption.displayName = "TableCaption"
