
import * as React from 'react';
import { useState } from 'react';
import { Database, Download, FileJson, FileText, HardDrive, Archive, Plus, Trash2, Table } from 'lucide-react';
import { ModalOverlay, Button, Label, Input, Select, Switch, cn } from '../../../components/ui';

// --- Backup Modal ---
export const BackupModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [backupName, setBackupName] = useState(`backup_${new Date().toISOString().split('T')[0]}_v1`);
  const [isCompressed, setIsCompressed] = useState(true);

  const handleBackup = () => {
    // Mock backup process
    console.log('Starting backup:', { backupName, isCompressed });
    onClose();
    // In a real app, trigger a toast notification here
    alert(`Backup "${backupName}" started successfully.`);
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
           <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Database className="h-5 w-5" />
           </div>
           <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">New Backup</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Create a snapshot of your current database.</p>
           </div>
        </div>

        <div className="space-y-3">
            <div className="space-y-2">
               <Label>Backup Name</Label>
               <Input 
                  value={backupName} 
                  onChange={(e) => setBackupName(e.target.value)} 
                  placeholder="e.g. weekly_full_backup"
               />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <Label>Backup Type</Label>
                  <Select>
                     <option value="full">Full Backup</option>
                     <option value="incremental">Incremental</option>
                     <option value="schema">Schema Only</option>
                  </Select>
               </div>
               <div className="space-y-2">
                  <Label>Storage Location</Label>
                  <Select>
                     <option value="local">Local Storage</option>
                     <option value="s3">Amazon S3</option>
                     <option value="gcs">Google Cloud Storage</option>
                  </Select>
               </div>
            </div>

            <div className="flex items-center justify-between bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-100 dark:border-white/10">
               <div className="flex items-center gap-3">
                  <Archive className="h-5 w-5 text-slate-400" />
                  <div className="space-y-0.5">
                     <Label className="text-base cursor-pointer" onClick={() => setIsCompressed(!isCompressed)}>Compression</Label>
                     <p className="text-xs text-slate-500">Reduce file size using GZIP.</p>
                  </div>
               </div>
               <Switch checked={isCompressed} onCheckedChange={setIsCompressed} />
            </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleBackup} className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-600 dark:hover:bg-emerald-700">
               Start Backup
            </Button>
        </div>
      </div>
    </ModalOverlay>
  );
};

// --- Export Modal ---
export const ExportModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [format, setFormat] = useState('sql');
  const [scope, setScope] = useState('all');

  const handleExport = () => {
    console.log('Exporting:', { format, scope });
    onClose();
    alert(`Database export (${format.toUpperCase()}) initiated.`);
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4">
           <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Download className="h-5 w-5" />
           </div>
           <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Export Data</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Download database content or schema.</p>
           </div>
        </div>

        <div className="space-y-4">
            <div className="space-y-2">
               <Label>Export Format</Label>
               <div className="grid grid-cols-3 gap-2">
                  {[
                     { id: 'sql', label: 'SQL Dump', icon: Database },
                     { id: 'csv', label: 'CSV', icon: FileText },
                     { id: 'json', label: 'JSON', icon: FileJson },
                  ].map((item) => (
                     <div 
                        key={item.id}
                        onClick={() => setFormat(item.id)}
                        className={cn(
                           "flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all",
                           format === item.id 
                              ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-500 dark:text-indigo-300"
                              : "border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
                        )}
                     >
                        <item.icon className="h-5 w-5 mb-1" />
                        <span className="text-xs font-medium">{item.label}</span>
                     </div>
                  ))}
               </div>
            </div>

            <div className="space-y-2">
               <Label>Export Scope</Label>
               <Select value={scope} onChange={(e) => setScope(e.target.value)}>
                  <option value="all">Entire Database (All Tables)</option>
                  <option value="schema">Schema Only (No Data)</option>
                  <option value="users">Users Table Only</option>
                  <option value="logs">Logs Only</option>
               </Select>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-3 rounded-md">
               <p className="text-xs text-amber-800 dark:text-amber-200">
                  <strong>Note:</strong> Large exports may take several minutes to process. You will be notified when the download is ready.
               </p>
            </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleExport}>
               Export Data
            </Button>
        </div>
      </div>
    </ModalOverlay>
  );
};

// --- Create Table Modal ---
export const CreateTableModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState([
    { name: 'id', type: 'int8', isPrimary: true },
    { name: 'created_at', type: 'timestamptz', isPrimary: false }
  ]);

  const addColumn = () => {
    setColumns([...columns, { name: '', type: 'text', isPrimary: false }]);
  };

  const updateColumn = (index: number, field: string, value: any) => {
    const newCols = [...columns];
    newCols[index] = { ...newCols[index], [field]: value };
    setColumns(newCols);
  };

  const removeColumn = (index: number) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    console.log('Creating table:', tableName, columns);
    // In a real app, this would make a request to Supabase Management API or execute raw SQL via RPC
    alert(`Request to create table "${tableName}" with ${columns.length} columns sent.`);
    onClose();
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} className="max-w-2xl">
        <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-white/10 pb-4 mb-4">
               <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Table className="h-5 w-5" />
               </div>
               <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Create New Table</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Define your schema structure.</p>
               </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                   <Label>Table Name</Label>
                   <Input 
                      value={tableName} 
                      onChange={e => setTableName(e.target.value)} 
                      placeholder="e.g. products" 
                      autoFocus
                   />
                </div>

                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                      <Label>Columns</Label>
                      <Button size="sm" variant="ghost" onClick={addColumn} className="h-7 text-xs">
                         <Plus className="h-3 w-3 mr-1"/> Add Column
                      </Button>
                   </div>
                   <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg p-3 max-h-[300px] overflow-y-auto space-y-2">
                      {columns.map((col, i) => (
                          <div key={i} className="flex gap-2 items-center animate-in slide-in-from-left-2 duration-200">
                              <Input 
                                 value={col.name} 
                                 onChange={e => updateColumn(i, 'name', e.target.value)} 
                                 placeholder="Column Name" 
                                 className="flex-1 h-9"
                                 disabled={i === 0} // Lock ID
                              />
                              <Select 
                                 value={col.type} 
                                 onChange={e => updateColumn(i, 'type', e.target.value)} 
                                 className="w-32 h-9"
                                 disabled={i === 0}
                              >
                                  <option value="int8">int8</option>
                                  <option value="text">text</option>
                                  <option value="boolean">boolean</option>
                                  <option value="timestamptz">timestamp</option>
                                  <option value="jsonb">jsonb</option>
                                  <option value="uuid">uuid</option>
                              </Select>
                              <div className="w-8 flex justify-center">
                                 {i > 1 ? (
                                    <Button 
                                       size="icon" 
                                       variant="ghost" 
                                       className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" 
                                       onClick={() => removeColumn(i)}
                                    >
                                       <Trash2 className="h-4 w-4" />
                                    </Button>
                                 ) : (
                                    <span className="text-[10px] text-slate-400 font-mono">REQ</span>
                                 )}
                              </div>
                          </div>
                      ))}
                   </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-white/10 mt-4">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleCreate} disabled={!tableName}>Create Table</Button>
            </div>
        </div>
    </ModalOverlay>
  );
};
