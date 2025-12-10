import * as React from 'react';
import { forwardRef, useState, useEffect, useRef, createContext, useContext } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Card Components (Matte / Clean) ---
export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all duration-200",
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
  <h3 ref={ref} className={cn("font-semibold text-lg leading-none tracking-tight", className)} {...props} />
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
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = "Separator"

// --- Badge (Flat) ---
export const Badge = ({ children, variant = 'default', className, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'success' | 'warning' }) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 border-transparent",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
    outline: "text-foreground border-border bg-transparent",
    destructive: "bg-danger/10 text-danger border-danger/20 hover:bg-danger/20",
    success: "bg-success/10 text-success border-success/20 hover:bg-success/20",
    warning: "bg-warning/10 text-warning border-warning/20 hover:bg-warning/20",
  };
  return (
    <div className={cn("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none", variants[variant], className)} {...props}>
      {children}
    </div>
  );
};

// --- Button (Solid / No Glow) ---
export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'ghost' | 'outline' | 'secondary' | 'destructive', size?: 'sm' | 'default' | 'icon' }>(({ className, variant = 'default', size = 'default', ...props }, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
    ghost: "hover:bg-accent hover:text-accent-foreground text-foreground-secondary",
    outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground text-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-danger text-white hover:bg-danger/90 shadow-sm",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3 text-xs",
    icon: "h-10 w-10"
  };
  return (
    <button
      ref={ref}
      className={cn("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)}
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
        "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        checked ? "bg-primary" : "bg-input",
        className
      )}
      ref={ref}
      {...props}
    >
      <span
        className={cn(
          "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-sm ring-0 transition-transform",
          checked ? "translate-x-5" : "translate-x-0"
        )}
      />
    </button>
  );
});
Switch.displayName = "Switch";

// --- Input (Bordered) ---
export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", 
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", 
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)} {...props} />
));
Label.displayName = "Label";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...props }, ref) => (
  <div className="relative">
    <select
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50", 
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
));
Select.displayName = "Select";

export const Tooltip = ({ text, children }: { text: string, children?: React.ReactNode }) => {
  return (
    <div className="group relative flex items-center">
      {children}
      <div className="absolute left-full ml-2 hidden whitespace-nowrap rounded-md bg-foreground text-background px-2 py-1 text-xs opacity-0 transition-opacity group-hover:block group-hover:opacity-100 z-50 shadow-md">
        {text}
      </div>
    </div>
  );
};

export const Avatar = ({ src, fallback, className }: { src?: string, fallback: string, className?: string }) => (
  <div className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border", className)}>
    {src ? (
      <img className="aspect-square h-full w-full object-cover" src={src} alt="Avatar" />
    ) : (
      <div className="flex h-full w-full items-center justify-center bg-secondary text-secondary-foreground text-sm font-medium">
        {fallback}
      </div>
    )}
  </div>
);

// --- Modal Primitive ---
export const ModalOverlay = ({ children, isOpen, onClose, className, hideCloseButton }: { children?: React.ReactNode, isOpen: boolean, onClose: () => void, className?: string, hideCloseButton?: boolean }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="absolute inset-0" onClick={onClose} />
      <div className={cn("relative z-50 w-full max-w-lg rounded-xl bg-background border border-border shadow-lg animate-in zoom-in-95 duration-200", className)} onClick={e => e.stopPropagation()}>
        {children}
        {!hideCloseButton && (
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <span className="sr-only">Close</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><line x1="18" x2="6" y1="6" y2="18"></line><line x1="6" x2="18" y1="6" y2="18"></line></svg>
          </button>
        )}
      </div>
    </div>
  );
};

// --- Command, DropdownMenu, Table (Standard components adapted via theme colors) ---

export const Command = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className)} {...props} />
));
Command.displayName = "Command";

export const CommandInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4 shrink-0 opacity-50"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
    <input
      ref={ref}
      className={cn("flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className)}
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
    className={cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer", className)}
    {...props}
  />
));
CommandItem.displayName = "CommandItem";

// ... Dropdown Menu
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
  }

  return (
    <div 
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in zoom-in-95 duration-100", 
        positionClasses, 
        className
      )}
      {...props}
    >
      <div className="p-1">{children}</div>
    </div>
  );
};

export const DropdownMenuItem = ({ children, onClick, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    const { setIsOpen } = useContext(DropdownMenuContext);
  return (
    <div
      className={cn("relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className)}
      onClick={(e) => {
        e.stopPropagation();
        if(onClick) onClick(e);
        setIsOpen(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export const DropdownMenuLabel = ({ children, className }: { children?: React.ReactNode, className?: string }) => (
    <div className={cn("px-2 py-1.5 text-sm font-semibold", className)}>
        {children}
    </div>
);

export const DropdownMenuSeparator = ({ className }: { className?: string }) => (
    <div className={cn("-mx-1 my-1 h-px bg-border", className)} />
);

// --- Table Primitives ---

export const Table = forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
))
Table.displayName = "Table"

export const TableHeader = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

export const TableBody = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
))
TableBody.displayName = "TableBody"

export const TableFooter = forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn("bg-muted/50 font-medium [&>tr]:last:border-b-0", className)} {...props} />
))
TableFooter.displayName = "TableFooter"

export const TableRow = forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className)} {...props} />
))
TableRow.displayName = "TableRow"

export const TableHead = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0", className)} {...props} />
))
TableHead.displayName = "TableHead"

export const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
))
TableCell.displayName = "TableCell"

export const TableCaption = forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
))
TableCaption.displayName = "TableCaption"