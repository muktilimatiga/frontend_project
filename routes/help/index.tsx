
import * as React from 'react';
import { useState, useMemo, Fragment } from 'react';
import { 
  Search, 
  Plus, 
  FolderOpen, 
  FileText, 
  Trash2,
  Edit2,
  ChevronRight,
  ChevronDown,
  Tag,
  MessageSquare
} from 'lucide-react';
import { 
  Input, 
  Button, 
  Badge, 
  ModalOverlay, 
  Label, 
  Select, 
  cn 
} from '../../components/ui';

// --- Types & Mock Data ---

interface Template {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  content: string;
  tags: string[];
  usageCount: number;
}

const INITIAL_TEMPLATES: Template[] = [
  // Customer Service -> General
  { 
    id: '1', 
    title: 'General Greeting', 
    category: 'Customer Service',
    subcategory: 'General',
    content: "Hi {name}, thanks for contacting Nexus Support! My name is {agent}. How can I help you today?", 
    tags: ['greeting', 'intro'],
    usageCount: 1240 
  },
  { 
    id: '2', 
    title: 'Closing Ticket', 
    category: 'Customer Service',
    subcategory: 'General',
    content: "I haven't heard back from you in a while, so I'll be closing this ticket. If you still need help, just reply to this email to reopen it. Have a great day!", 
    tags: ['closing', 'follow-up'],
    usageCount: 430 
  },
  // Customer Service -> Billing
  { 
    id: '3', 
    title: 'Invoice Explanation', 
    category: 'Customer Service',
    subcategory: 'Billing',
    content: "I've reviewed your latest invoice. The extra charge corresponds to the pro-rated upgrade you requested on {date}. Does that clarify things?", 
    tags: ['billing', 'invoice'],
    usageCount: 85 
  },
  // Broadband -> Troubleshooting
  { 
    id: '5', 
    title: 'ONT Restart Instructions', 
    category: 'Broadband Technical',
    subcategory: 'Troubleshooting',
    content: "Please locate your Optical Network Terminal (white box). Unplug the power cable, wait 30 seconds, and plug it back in. Wait for the 'PON' light to turn solid green.", 
    tags: ['hardware', 'restart'],
    usageCount: 890 
  },
  { 
    id: '6', 
    title: 'Slow Speed Diagnosis', 
    category: 'Broadband Technical',
    subcategory: 'Troubleshooting',
    content: "To diagnose the speed issue, please connect a computer directly to the router via Ethernet cable and run a speed test at speed.nexus.com. Let me know the results.", 
    tags: ['speed', 'diagnosis'],
    usageCount: 310 
  },
];

// --- Components ---

const CategoryHeader = ({ label, isOpen, onClick, count }: { label: string, isOpen: boolean, onClick: () => void, count: number }) => (
  <div 
    onClick={onClick}
    className="flex items-center gap-2 py-3 px-4 cursor-pointer text-muted-foreground hover:text-foreground transition-colors select-none group"
  >
    <div className={cn("transition-transform duration-200 text-muted-foreground/50 group-hover:text-foreground", isOpen && "rotate-90")}>
        <ChevronRight className="h-4 w-4" />
    </div>
    <span className="font-semibold text-sm tracking-tight">{label}</span>
    <span className="ml-auto text-[10px] bg-accent text-accent-foreground px-2 py-0.5 rounded-full font-medium">{count}</span>
  </div>
);

const SubcategoryHeader = ({ label, isOpen, onClick }: { label: string, isOpen: boolean, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="flex items-center gap-3 py-2 px-4 pl-10 cursor-pointer text-muted-foreground hover:text-foreground transition-colors select-none group"
  >
    <FolderOpen className={cn("h-4 w-4 text-muted-foreground/70 group-hover:text-primary transition-colors", isOpen && "text-primary")} />
    <span className="text-sm font-medium">{label}</span>
  </div>
);

const TemplateRow = ({ template, onEdit, onDelete }: { template: Template, onEdit: () => void, onDelete: () => void }) => {
  return (
    <div className="group relative flex items-center gap-4 py-3 px-4 pl-16 border-l border-transparent hover:bg-accent/50 hover:border-primary/20 transition-all cursor-pointer">
      {/* Icon */}
      <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors">
         <FileText className="h-4 w-4" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
         <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium text-foreground truncate">{template.title}</h4>
            {template.usageCount > 500 && (
               <Badge variant="secondary" className="h-4 px-1 text-[9px] bg-primary/10 text-primary hover:bg-primary/20 border-0">Popular</Badge>
            )}
         </div>
         <p className="text-xs text-muted-foreground truncate max-w-[90%] mt-0.5">{template.content}</p>
      </div>

      {/* Tags */}
      <div className="hidden md:flex gap-2 items-center">
         {template.tags.map(tag => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground font-medium border border-border">
               {tag}
            </span>
         ))}
      </div>

      {/* Actions (Hover) */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 bg-background/80 backdrop-blur-sm p-1 rounded-md shadow-sm">
         <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
            <Edit2 className="h-3.5 w-3.5" />
         </Button>
         <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(); }}>
            <Trash2 className="h-3.5 w-3.5" />
         </Button>
      </div>
    </div>
  );
};

const TemplateModal = ({ 
  isOpen, 
  onClose, 
  initialData, 
  onSave 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  initialData?: Template | null,
  onSave: (data: Partial<Template>) => void
}) => {
   const [formData, setFormData] = useState<Partial<Template>>({
      title: '',
      category: 'Customer Service',
      subcategory: '',
      content: '',
      tags: []
   });

   React.useEffect(() => {
      if (isOpen) {
         setFormData(initialData || { title: '', category: 'Customer Service', subcategory: '', content: '', tags: [] });
      }
   }, [isOpen, initialData]);

   const handleSubmit = () => {
      onSave(formData);
      onClose();
   };

   return (
      <ModalOverlay isOpen={isOpen} onClose={onClose}>
         <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-foreground">
                    {initialData ? 'Edit Template' : 'New Template'}
                </h2>
                <p className="text-sm text-muted-foreground">Create a canned response for your team.</p>
            </div>

            <div className="space-y-4">
               <div className="space-y-2">
                  <Label>Title</Label>
                  <Input 
                     value={formData.title}
                     onChange={e => setFormData({...formData, title: e.target.value})}
                     className="bg-secondary/50 border-border"
                     placeholder="e.g. Greeting"
                  />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                     <Label>Category</Label>
                     <Select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="bg-secondary/50 border-border"
                     >
                        <option value="Customer Service">Customer Service</option>
                        <option value="Broadband Technical">Broadband Technical</option>
                     </Select>
                  </div>
                  <div className="space-y-2">
                     <Label>Subcategory</Label>
                     <Input 
                        value={formData.subcategory}
                        onChange={e => setFormData({...formData, subcategory: e.target.value})}
                        className="bg-secondary/50 border-border"
                        placeholder="e.g. Billing"
                     />
                  </div>
               </div>

               <div className="space-y-2">
                  <Label>Response Content</Label>
                  <textarea 
                     className="flex w-full rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[120px] resize-none font-mono"
                     value={formData.content}
                     onChange={e => setFormData({...formData, content: e.target.value})}
                     placeholder="Type your message..."
                  />
                  <div className="text-[10px] text-muted-foreground flex gap-2">
                     <span>{'{name}'}</span>
                     <span>{'{agent}'}</span>
                     <span>{'{date}'}</span>
                  </div>
               </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
               <Button variant="outline" onClick={onClose} className="border-border text-foreground hover:bg-accent hover:text-accent-foreground">Cancel</Button>
               <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90">Save Template</Button>
            </div>
         </div>
      </ModalOverlay>
   );
};

export const HelpCenterPage = () => {
   const [templates, setTemplates] = useState<Template[]>(INITIAL_TEMPLATES);
   const [searchQuery, setSearchQuery] = useState('');
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
   const [expanded, setExpanded] = useState<Record<string, boolean>>({
      'Customer Service': true,
      'Broadband Technical': true,
      'Customer Service-General': true
   });

   const toggle = (key: string) => setExpanded(prev => ({ ...prev, [key]: !prev[key] }));

   const hierarchy = useMemo(() => {
      const groups: Record<string, Record<string, Template[]>> = {};
      templates.forEach(t => {
         if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return;
         if (!groups[t.category]) groups[t.category] = {};
         if (!groups[t.category][t.subcategory]) groups[t.category][t.subcategory] = [];
         groups[t.category][t.subcategory].push(t);
      });
      return groups;
   }, [searchQuery, templates]);

   return (
      <div className="max-w-5xl mx-auto space-y-8 pb-20 pt-6 animate-in fade-in duration-500">
         <TemplateModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            initialData={editingTemplate}
            onSave={(data) => {
                if (editingTemplate) {
                    setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? { ...t, ...data } as Template : t));
                } else {
                    setTemplates(prev => [...prev, { ...data, id: Date.now().toString(), usageCount: 0 } as Template]);
                }
            }}
         />

         {/* Header */}
         <div className="flex items-center justify-between">
            <div className="space-y-1">
               <h1 className="text-2xl font-bold tracking-tight text-foreground">Help Center</h1>
               <p className="text-sm text-muted-foreground">Manage your support templates and canned responses.</p>
            </div>
            <Button onClick={() => { setEditingTemplate(null); setIsModalOpen(true); }} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-full px-6">
               <Plus className="mr-2 h-4 w-4" /> Add Template
            </Button>
         </div>

         {/* Search */}
         <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <Input 
                placeholder="Search templates..." 
                className="pl-11 h-12 bg-secondary/50 border-transparent focus:bg-secondary focus:border-primary/50 text-base rounded-xl transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
         </div>

         {/* Content Tree */}
         <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            {Object.keys(hierarchy).length === 0 ? (
               <div className="py-20 text-center flex flex-col items-center justify-center">
                  <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                     <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-foreground font-medium">No templates found</h3>
                  <p className="text-muted-foreground text-sm mt-1">Try adjusting your search query.</p>
               </div>
            ) : (
               <div className="divide-y divide-border">
                  {Object.entries(hierarchy).map(([category, subcategories]) => (
                     <Fragment key={category}>
                        <CategoryHeader 
                           label={category} 
                           isOpen={!!expanded[category]} 
                           onClick={() => toggle(category)}
                           count={Object.values(subcategories).flat().length}
                        />
                        
                        {expanded[category] && (
                           <div className="bg-secondary/20 pb-2">
                              {Object.entries(subcategories).map(([subcategory, items]) => {
                                 const subKey = `${category}-${subcategory}`;
                                 return (
                                    <Fragment key={subKey}>
                                       <SubcategoryHeader 
                                          label={subcategory}
                                          isOpen={!!expanded[subKey]}
                                          onClick={() => toggle(subKey)}
                                       />
                                       
                                       {expanded[subKey] && (
                                          <div className="space-y-1 mb-2">
                                             {items.map(template => (
                                                <TemplateRow 
                                                   key={template.id} 
                                                   template={template} 
                                                   onEdit={() => { setEditingTemplate(template); setIsModalOpen(true); }}
                                                   onDelete={() => setTemplates(prev => prev.filter(t => t.id !== template.id))}
                                                />
                                             ))}
                                          </div>
                                       )}
                                    </Fragment>
                                 );
                              })}
                           </div>
                        )}
                     </Fragment>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
};
