
import React, { useState } from 'react';
import { Database, Download, FileJson, FileText, HardDrive, Archive } from 'lucide-react';
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
