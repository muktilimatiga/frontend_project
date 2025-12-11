
import * as React from 'react';
import { useState, useEffect } from 'react';
import { RefreshCw, Lock, Unlock, User as UserIcon, Search, X, Settings, Scan, ArrowRight, DownloadCloud, Network, Plus, Trash2, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { ModalOverlay, Label, Input, Select, Textarea, Button, Switch, Avatar, cn, Badge } from '../../../../components/ui';
import { ConfigService, CustomerService, UnconfiguredOnt, DataPSB } from '../../../../services/external';
import { useFiberStore } from '../../stores/fiberStore';
import { toast } from 'sonner';
import { supabase } from '../../../../lib/supabaseClient';

interface BatchItem {
    sn: string;
    port: string;
    loading: boolean;
    customer: any | null;
}

export const ConfigModal = ({ isOpen, onClose, type }: { isOpen: boolean, onClose: () => void, type: 'basic' | 'bridge' | 'batch' }) => {
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [isOptionsLoading, setIsOptionsLoading] = useState(false);
  const [isScanLoading, setIsScanLoading] = useState(false);
  const [detectedOnts, setDetectedOnts] = useState<UnconfiguredOnt[]>([]);
  
  // Auto Mode State
  const [psbList, setPsbList] = useState<DataPSB[]>([]);
  const [isPsbLoading, setIsPsbLoading] = useState(false);

  // Batch Mode State
  const [batchQueue, setBatchQueue] = useState<BatchItem[]>([]);
  
  const {
      searchTerm,
      setSearchTerm,
      searchResults,
      searchCustomers,
      resetSearch
  } = useFiberStore();
  
  const [oltOptions, setOltOptions] = useState<string[]>([]);
  const [packageOptions, setPackageOptions] = useState<string[]>([]);
  const [modemOptions, setModemOptions] = useState<string[]>([]);
  
  const [formData, setFormData] = useState({
     olt: '',
     name: '',
     address: '',
     pppoeUser: '',
     pppoePass: '',
     package: '',
     modemType: 'HG8245H5',
     ethLock: false,
     sn: '',
     vlan: '',
  });

  useEffect(() => {
      if (isOpen) {
          const loadOptions = async () => {
              setIsOptionsLoading(true);
              const { data } = await ConfigService.getOptions();
              if (data) {
                  setOltOptions(data.olt_options || []);
                  setModemOptions(data.modem_options || ['HG8245H5', 'F609', 'F670L']);
                  setPackageOptions(data.package_options || ['Generic', 'Home 50', 'Home 100']);
                  
                  if (data.olt_options?.length > 0 && !formData.olt) {
                      setFormData(prev => ({ ...prev, olt: data.olt_options[0] }));
                  }
              }
              setIsOptionsLoading(false);
          };
          loadOptions();
          resetSearch();
          setDetectedOnts([]);
          setMode('manual'); // Reset to manual on open
          setFormData(prev => ({ ...prev, vlan: '' }));
          setBatchQueue([]); // Reset batch queue
      }
  }, [isOpen]);

  useEffect(() => {
     const timer = setTimeout(() => {
        if (isOpen && mode === 'manual' && searchTerm.length > 1 && type === 'basic') {
           searchCustomers(searchTerm);
        }
     }, 400);
     return () => clearTimeout(timer);
  }, [searchTerm, isOpen, mode, type]);

  // Fetch PSB data when switching to Auto mode (only for basic)
  useEffect(() => {
      if (mode === 'auto' && psbList.length === 0 && type === 'basic') {
          fetchPsbData();
      }
  }, [mode, type]);

  const fetchPsbData = async () => {
      setIsPsbLoading(true);
      try {
          const { data, error } = await CustomerService.getPSBData();
          if (data && Array.isArray(data)) {
              setPsbList(data);
              toast.success(`Loaded ${data.length} new registrations`);
          } else {
              setPsbList([]); // Fallback to empty array
              if (error) toast.error(error || "Failed to load registrations");
          }
      } catch (e) {
          console.error(e);
          toast.error("Failed to connect to registration server");
          setPsbList([]); // Fallback to empty array
      } finally {
          setIsPsbLoading(false);
      }
  };

  const handleSelectUser = (user: any) => {
     setFormData(prev => ({
        ...prev,
        name: user.name || '',
        address: user.alamat || '',
        pppoeUser: user.user_pppoe || '',
        pppoePass: user.pppoe_password || '123456', 
     }));
     resetSearch();
     setSearchTerm('');
  };

  const handleSelectPsb = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedId = e.target.value;
      const selected = psbList.find(p => p.user_pppoe === selectedId);
      
      if (selected) {
          setFormData(prev => ({
              ...prev,
              name: selected.name || '',
              address: selected.address || '',
              pppoeUser: selected.user_pppoe || '',
              pppoePass: selected.pppoe_password || '',
              package: selected.paket || prev.package
          }));
      }
  };

  const handleScanOlt = async () => {
      if (!formData.olt) {
          toast.error("Please select an OLT device first");
          return;
      }
      setIsScanLoading(true);
      try {
          const { data } = await ConfigService.detectUnconfiguredOnts(formData.olt);
          
          if (data && data.length > 0) {
              setDetectedOnts(data);
              // Auto-select the first one if field is empty (only for basic/bridge)
              if (!formData.sn && type !== 'batch') {
                  setFormData(prev => ({ ...prev, sn: data[0].sn }));
              }
              toast.success(`Found ${data.length} unconfigured devices`);
          } else {
              setDetectedOnts([]);
              toast.info("No unconfigured devices found");
          }
      } catch (e) {
          console.error(e);
          toast.error("Scan failed, please try again");
      } finally {
          setIsScanLoading(false);
      }
  };

  const handleAddToBatch = async (sn: string) => {
      if (!sn) return;
      if (batchQueue.find(i => i.sn === sn)) {
          toast.warning("Device already in queue");
          return;
      }

      const ont = detectedOnts.find(d => d.sn === sn);
      if (!ont) return;

      const newItem: BatchItem = {
          sn,
          port: `${ont.pon_port}/${ont.pon_slot}`,
          loading: true,
          customer: null
      };

      setBatchQueue(prev => [...prev, newItem]);

      // Simulate Searching Customer by SN
      try {
          // Assuming 'data_fiber' has a column 'onu_sn' to match pending configs
          const { data, error } = await supabase
            .from('data_fiber')
            .select('*')
            .eq('onu_sn', sn)
            .maybeSingle(); // Use maybeSingle to avoid 406 on no rows

          setBatchQueue(prev => prev.map(item => {
              if (item.sn === sn) {
                  return { 
                      ...item, 
                      loading: false, 
                      customer: data ? {
                          name: data.name,
                          address: data.alamat,
                          pppoe: data.user_pppoe,
                          packet: data.paket
                      } : null 
                  };
              }
              return item;
          }));
      } catch (err) {
          console.error("Error finding customer for SN:", sn, err);
          setBatchQueue(prev => prev.map(item => item.sn === sn ? { ...item, loading: false } : item));
      }
  };

  const handleRemoveFromBatch = (sn: string) => {
      setBatchQueue(prev => prev.filter(i => i.sn !== sn));
  };

  const getTitle = () => {
      switch(type) {
          case 'bridge': return 'Bridge Configuration';
          case 'batch': return 'Batch Provisioning';
          default: return 'New Service Configuration';
      }
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} hideCloseButton={true} className="max-w-xl p-0 overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800 shadow-2xl bg-white dark:bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
         <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {getTitle()}
         </h2>
         <div className="flex items-center gap-3">
            {type === 'basic' && (
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 p-0.5 pr-2 rounded-full border border-slate-200 dark:border-zinc-700">
                    <Switch checked={mode === 'auto'} onCheckedChange={(c) => setMode(c ? 'auto' : 'manual')} className="h-4 w-8 scale-75 data-[state=checked]:bg-indigo-600" />
                    <Label className="text-[10px] font-bold uppercase tracking-wider cursor-pointer select-none text-slate-600 dark:text-slate-400" onClick={() => setMode(m => m === 'manual' ? 'auto' : 'manual')}>
                        {mode === 'auto' ? 'Auto' : 'Manual'}
                    </Label>
                </div>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                <X className="h-4 w-4" />
            </button>
         </div>
      </div>

      <div className="p-5 space-y-5 max-h-[85vh] overflow-y-auto bg-white dark:bg-zinc-900">
         {/* Top Row: OLT, Package, Modem */}
         <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
               <Label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">OLT Device</Label>
               <div className="relative">
                   <Select 
                      value={formData.olt} 
                      onChange={e => setFormData({...formData, olt: e.target.value})}
                      disabled={isOptionsLoading}
                      className="text-xs h-9 bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500/20 font-medium"
                   >
                      {oltOptions.length === 0 && <option value="">-- Select --</option>}
                      {oltOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                      ))}
                   </Select>
                   {isOptionsLoading && <RefreshCw className="absolute right-8 top-2.5 h-3.5 w-3.5 animate-spin text-slate-400" />}
               </div>
            </div>
            
            <div className="space-y-1">
               <Label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Package</Label>
               <Select 
                  value={formData.package} 
                  onChange={e => setFormData({...formData, package: e.target.value})}
                  className="text-xs h-9 bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500/20 font-medium"
               >
                  <option value="">Generic</option>
                  {packageOptions.map(pkg => <option key={pkg} value={pkg}>{pkg}</option>)}
               </Select>
            </div>

            <div className="space-y-1">
               <Label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Modem</Label>
               <Select 
                  value={formData.modemType} 
                  onChange={e => setFormData({...formData, modemType: e.target.value})}
                  className="text-xs h-9 bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 focus:ring-2 focus:ring-indigo-500/20 font-medium"
               >
                  {modemOptions.map(m => <option key={m} value={m}>{m}</option>)}
               </Select>
            </div>
         </div>

         {/* BATCH MODE SPECIFIC UI */}
         {type === 'batch' ? (
             <div className="space-y-4">
                 <div className="flex items-end gap-3 p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-200 dark:border-zinc-800">
                     <div className="flex-1 space-y-1.5">
                         <Label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Select Detected SN</Label>
                         <div className="flex gap-2">
                             <Button 
                                variant="outline" 
                                onClick={handleScanOlt}
                                disabled={isScanLoading || !formData.olt}
                                className="bg-white hover:bg-blue-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200 h-9 px-3 shadow-sm shrink-0 text-xs"
                             >
                                 {isScanLoading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Scan className="h-3.5 w-3.5" />}
                             </Button>
                             <Select
                                 className="flex-1 bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 h-9 text-xs font-mono shadow-sm"
                                 onChange={(e) => handleAddToBatch(e.target.value)}
                                 value=""
                             >
                                 <option value="">-- Add Device to Queue --</option>
                                 {detectedOnts
                                    .filter(ont => !batchQueue.find(b => b.sn === ont.sn))
                                    .map(ont => (
                                     <option key={ont.sn} value={ont.sn}>
                                         {ont.sn} (Port {ont.pon_port}/{ont.pon_slot})
                                     </option>
                                 ))}
                             </Select>
                         </div>
                     </div>
                 </div>

                 {/* Batch Queue List */}
                 <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-950 min-h-[200px]">
                     <div className="grid grid-cols-12 gap-2 bg-slate-50 dark:bg-zinc-900 p-2 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-zinc-800">
                         <div className="col-span-3">Serial Number</div>
                         <div className="col-span-2">Port</div>
                         <div className="col-span-6">Customer Match</div>
                         <div className="col-span-1 text-center">Action</div>
                     </div>
                     <div className="max-h-[250px] overflow-y-auto">
                         {batchQueue.length === 0 && (
                             <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-1">
                                 <Layers className="h-6 w-6 opacity-20" />
                                 <p className="text-[10px]">No devices added.</p>
                             </div>
                         )}
                         {batchQueue.map((item) => (
                             <div key={item.sn} className="grid grid-cols-12 gap-2 p-2 border-b border-slate-100 dark:border-zinc-800/50 items-center hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors text-xs">
                                 <div className="col-span-3 font-mono font-medium text-slate-700 dark:text-slate-300 text-[10px]">{item.sn}</div>
                                 <div className="col-span-2 text-slate-500 text-[10px]">{item.port}</div>
                                 <div className="col-span-6">
                                     {item.loading ? (
                                         <div className="flex items-center gap-2 text-slate-400 text-[10px]">
                                             <RefreshCw className="h-3 w-3 animate-spin" /> Finding match...
                                         </div>
                                     ) : item.customer ? (
                                         <div className="flex items-center gap-2">
                                             <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                                 <CheckCircle2 className="h-3 w-3" />
                                             </div>
                                             <div className="overflow-hidden">
                                                 <div className="font-bold text-slate-900 dark:text-white truncate text-[10px]">{item.customer.name}</div>
                                                 <div className="text-[9px] text-slate-500 truncate">{item.customer.address}</div>
                                             </div>
                                         </div>
                                     ) : (
                                         <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded-md w-fit">
                                             <AlertCircle className="h-3 w-3" />
                                             <span className="font-medium text-[9px]">No Match</span>
                                         </div>
                                     )}
                                 </div>
                                 <div className="col-span-1 flex justify-center">
                                     <button onClick={() => handleRemoveFromBatch(item.sn)} className="text-slate-400 hover:text-red-500 transition-colors p-1">
                                         <Trash2 className="h-3.5 w-3.5" />
                                     </button>
                                 </div>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
         ) : (
         /* Basic/Bridge Mode Content */
         <>
             <div className="space-y-4 p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-200 dark:border-zinc-800">
                {/* Bridge Mode: VLAN Input */}
                {type === 'bridge' ? (
                    <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-amber-600 border border-slate-200 dark:border-zinc-700 shadow-sm">
                                <Network className="h-3.5 w-3.5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-white">VLAN Configuration</h3>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Assign VLAN ID for bridge service</p>
                            </div>
                        </div>
                        <div className="relative z-20">
                            <Input 
                                placeholder="VLAN ID (e.g. 100, 200)" 
                                className="bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 focus:border-amber-500 transition-all h-9 text-xs font-mono shadow-sm"
                                value={formData.vlan}
                                onChange={e => setFormData({...formData, vlan: e.target.value})}
                            />
                        </div>
                    </div>
                ) : (
                /* Normal Mode: Customer Selection Logic */
                <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                        <div className="h-7 w-7 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center text-indigo-600 border border-slate-200 dark:border-zinc-700 shadow-sm">
                            {mode === 'auto' ? <DownloadCloud className="h-3.5 w-3.5" /> : <UserIcon className="h-3.5 w-3.5" /> }
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{mode === 'auto' ? 'New Registration' : 'Import Customer'}</h3>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                {mode === 'auto' ? 'Select from pending registrations (API)' : 'Search from CRM database'}
                            </p>
                        </div>
                    </div>
                    
                    {mode === 'manual' ? (
                        <div className="relative z-20">
                           <div className="absolute left-3 top-2.5 pointer-events-none">
                               <Search className="h-3.5 w-3.5 text-slate-400" />
                           </div>
                           <Input 
                              placeholder="Search name, ID or address..." 
                              className="pl-8 bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 focus:border-indigo-500 transition-all h-9 text-xs placeholder:text-slate-400 shadow-sm"
                              value={searchTerm}
                              onChange={e => setSearchTerm(e.target.value)}
                           />
                           {/* Search Dropdown */}
                           {searchResults.length > 0 && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-40 overflow-y-auto z-50 p-1 animate-in fade-in zoom-in-95 duration-100">
                                 {searchResults.map(u => (
                                    <div 
                                       key={u.id}
                                       className="p-2 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer flex items-center gap-3 transition-colors group"
                                       onClick={() => handleSelectUser(u)}
                                    >
                                       <Avatar fallback={u.name?.charAt(0)} className="h-7 w-7 text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-900/50" />
                                       <div className="overflow-hidden">
                                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{u.name}</p>
                                          <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{u.user_pppoe}</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Select 
                                className="bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 text-xs h-9 flex-1 shadow-sm"
                                onChange={handleSelectPsb}
                                disabled={isPsbLoading}
                            >
                                <option value="">-- Select Pending Customer --</option>
                                {psbList.map((p, idx) => (
                                    <option key={p.user_pppoe || idx} value={p.user_pppoe}>
                                        {p.name} - {p.address}
                                    </option>
                                ))}
                            </Select>
                            <Button 
                                variant="outline" 
                                size="icon" 
                                onClick={fetchPsbData} 
                                disabled={isPsbLoading}
                                className="h-9 w-9 shrink-0 bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-700"
                                title="Reload from API"
                            >
                                <RefreshCw className={cn("h-3.5 w-3.5 text-slate-500", isPsbLoading && "animate-spin")} />
                            </Button>
                        </div>
                    )}
                </div>
                )}

                {/* SN Section - Highlighted */}
                <div className="pt-1">
                    <div className="p-3 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl border-2 border-blue-100 dark:border-blue-900/30 relative overflow-hidden group">
                        {/* Decorative Background Icon */}
                        <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                            <Scan className="w-16 h-16 text-blue-600" />
                        </div>
                        
                        <Label className="text-[10px] font-bold text-slate-600 dark:text-slate-300 mb-1.5 block uppercase tracking-wide">Device Serial Number (SN)</Label>
                        <div className="flex gap-2 relative z-10">
                            <div className="relative flex-1">
                                {detectedOnts.length > 0 ? (
                                    <Select
                                        value={formData.sn}
                                        onChange={e => setFormData({...formData, sn: e.target.value})}
                                        className="bg-white dark:bg-zinc-950 border-blue-200 dark:border-blue-800/50 text-xs h-9 font-mono shadow-sm"
                                    >
                                        {detectedOnts.map(ont => (
                                            <option key={ont.sn} value={ont.sn}>
                                                {ont.sn} (Port {ont.pon_port}/{ont.pon_slot})
                                            </option>
                                        ))}
                                    </Select>
                                ) : (
                                    <Input
                                        value={formData.sn}
                                        onChange={e => setFormData({...formData, sn: e.target.value})}
                                        placeholder="e.g. ZTEG12345678"
                                        className="bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 focus:border-blue-500 font-mono text-xs h-9 shadow-sm"
                                    />
                                )}
                            </div>
                            <Button 
                                variant="outline" 
                                onClick={handleScanOlt}
                                disabled={isScanLoading || !formData.olt}
                                className="bg-white hover:bg-blue-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-200 h-9 px-3 text-xs font-semibold shadow-sm"
                            >
                                {isScanLoading ? <RefreshCw className="h-3 w-3 animate-spin mr-1.5" /> : <Scan className="h-3 w-3 mr-1.5" />}
                                Scan OLT
                            </Button>
                        </div>
                    </div>
                </div>
             </div>

             {/* Configuration Details Divider */}
             <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-200 dark:border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-widest text-slate-400">
                    <span className="bg-white dark:bg-zinc-900 px-2 flex items-center gap-1">
                        <Settings className="h-3 w-3" /> Configuration Details
                    </span>
                </div>
             </div>

             {/* Form Fields - Compact Layout */}
             <div className="space-y-4">
                 <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Subscriber Name</Label>
                    <Input 
                       value={formData.name} 
                       onChange={e => setFormData({...formData, name: e.target.value})}
                       placeholder="Full Name"
                       className="bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 h-9 text-sm font-semibold text-slate-900 dark:text-white"
                    />
                 </div>

                 <div className="space-y-1">
                    <Label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Installation Address</Label>
                    <Textarea 
                       value={formData.address} 
                       onChange={e => setFormData({...formData, address: e.target.value})}
                       className="min-h-[60px] bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800 resize-none text-sm font-medium leading-relaxed py-2 text-slate-700 dark:text-slate-200"
                       rows={2}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 dark:bg-zinc-800/50 rounded-xl border border-slate-200 dark:border-zinc-800">
                    <div className="space-y-1">
                       <Label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">PPPoE Username</Label>
                       <Input 
                          value={formData.pppoeUser} 
                          onChange={e => setFormData({...formData, pppoeUser: e.target.value})}
                          placeholder="username"
                          className="bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 h-8 text-xs font-mono shadow-sm"
                       />
                    </div>
                    <div className="space-y-1">
                       <Label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">PPPoE Password</Label>
                       <Input 
                          type="password"
                          value={formData.pppoePass} 
                          onChange={e => setFormData({...formData, pppoePass: e.target.value})}
                          placeholder="••••••"
                          className="bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-700 h-8 text-xs font-mono shadow-sm"
                       />
                    </div>
                 </div>

                 <div className="flex items-center justify-between bg-white dark:bg-zinc-950 p-3 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-sm">
                    <div className="flex items-center gap-2.5">
                       <div className={cn("p-1.5 rounded-lg border", formData.ethLock ? "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-900/20 dark:border-amber-900/50 dark:text-amber-400" : "bg-slate-50 border-slate-200 text-slate-400 dark:bg-zinc-900 dark:border-zinc-800")}>
                          {formData.ethLock ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                       </div>
                       <div className="space-y-0.5">
                           <Label className="cursor-pointer text-xs font-bold text-slate-900 dark:text-white select-none block" onClick={() => setFormData({...formData, ethLock: !formData.ethLock})}>
                               Ethernet Port Lock
                           </Label>
                           <p className="text-[10px] text-slate-500">Secure unused ports on the ONU</p>
                       </div>
                    </div>
                    <Switch 
                       checked={formData.ethLock} 
                       onCheckedChange={c => setFormData({...formData, ethLock: c})}
                       className="data-[state=checked]:bg-amber-500 scale-90"
                    />
                 </div>
             </div>
         </>
         )}

         {/* Footer */}
         <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-zinc-800 mt-2">
            <Button variant="outline" onClick={onClose} className="h-9 px-4 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-300 font-medium text-xs">Cancel</Button>
            <Button onClick={() => { console.log(type === 'batch' ? batchQueue : formData); onClose(); }} className="h-9 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20 text-xs">
               {type === 'batch' ? `Provision ${batchQueue.length} Devices` : 'Provision Service'}
            </Button>
         </div>
      </div>
    </ModalOverlay>
  );
};
