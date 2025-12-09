
import * as React from 'react';
import { useState, useEffect } from 'react';
import { RefreshCw, Lock, Unlock, User as UserIcon, Server, List, Search, ChevronDown, ChevronUp, X, Settings } from 'lucide-react';
import { ModalOverlay, Label, Input, Select, Textarea, Button, Switch, Avatar, cn, Badge } from '../../../../components/ui';
import { ConfigService, CustomerService, UnconfiguredOnt, DataPSB } from '../../../../services/external';
import { useFiberStore } from '../../stores/fiberStore';
import { toast } from 'sonner';

export const ConfigModal = ({ isOpen, onClose, type }: { isOpen: boolean, onClose: () => void, type: 'basic' | 'bridge' }) => {
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [isAutoLoading, setIsAutoLoading] = useState(false);
  const [isOptionsLoading, setIsOptionsLoading] = useState(false);
  
  // Fiber Store
  const {
      searchTerm,
      setSearchTerm,
      searchResults,
      isSearching,
      searchCustomers,
      resetSearch
  } = useFiberStore();
  
  // Real config state
  const [oltOptions, setOltOptions] = useState<string[]>([]);
  const [packageOptions, setPackageOptions] = useState<string[]>([]);
  const [modemOptions, setModemOptions] = useState<string[]>([]);
  const [detectedOnts, setDetectedOnts] = useState<UnconfiguredOnt[]>([]);
  const [showManualScan, setShowManualScan] = useState(false);

  // Auto Mode PSB Data
  const [psbData, setPsbData] = useState<DataPSB[]>([]);
  const [isPsbLoading, setIsPsbLoading] = useState(false);

  const [formData, setFormData] = useState({
     olt: '',
     name: '',
     address: '',
     pppoeUser: '',
     pppoePass: '',
     package: '',
     modemType: '',
     ethLock: false,
     interface: 'eth1',
     sn: '',
     port: '',
     slot: ''
  });

  // Fetch OLT Options on Demand
  const fetchOltOptions = async () => {
      setIsOptionsLoading(true);
      const { data } = await ConfigService.getOptions();
      if (data) {
          if (data.olt_options) setOltOptions(data.olt_options);
          
          if (data.modem_options) {
              setModemOptions(data.modem_options);
              if (!formData.modemType && data.modem_options.length > 0) {
                  setFormData(prev => ({ ...prev, modemType: data.modem_options[0] }));
              }
          }

          if (data.package_options) {
              setPackageOptions(data.package_options);
              if (!formData.package && data.package_options.length > 0) {
                  setFormData(prev => ({ ...prev, package: data.package_options[0] }));
              }
          }
          if (data.olt_options.length > 0 && !formData.olt) {
              setFormData(prev => ({ ...prev, olt: data.olt_options[0] }));
          }
          toast.success("Options loaded");
      } else {
          toast.error("Failed to fetch options");
      }
      setIsOptionsLoading(false);
  };

  // Fetch PSB Data
  const fetchPsbData = async () => {
      setIsPsbLoading(true);
      const { data } = await CustomerService.getPSBData();
      if (data) {
          setPsbData(data);
          toast.success(`Loaded ${data.length} pending installations`);
      } else {
          toast.error("Failed to load PSB data");
      }
      setIsPsbLoading(false);
  };

  // Reset on open
  useEffect(() => {
     if(isOpen) {
        setMode('manual');
        resetSearch();
        setDetectedOnts([]);
        setOltOptions([]); 
        setPackageOptions([]);
        setModemOptions([]);
        setPsbData([]);
        setShowManualScan(false);
        setFormData({
            olt: '',
            name: '',
            address: '',
            pppoeUser: '',
            pppoePass: '',
            package: '',
            modemType: '',
            ethLock: false,
            interface: 'eth1',
            sn: '',
            port: '',
            slot: ''
        });
     }
  }, [isOpen]);

  // Search Logic (Global Store)
  useEffect(() => {
     const timer = setTimeout(async () => {
        if (mode === 'manual' && isOpen && searchTerm.length > 1) {
           searchCustomers(searchTerm);
        }
     }, 400);
     return () => clearTimeout(timer);
  }, [searchTerm, mode, isOpen]);

  const handleSelectUser = (user: any) => {
     setFormData(prev => ({
        ...prev,
        name: user.name || '',
        address: user.alamat || '',
        pppoeUser: user.user_pppoe || '',
        pppoePass: user.pppoe_password || '',
        ethLock: false
     }));
     resetSearch();
  };

  const handleScanOnts = async () => {
      if (!formData.olt) {
          toast.error("Please select an OLT first");
          return;
      }
      setIsAutoLoading(true);
      setDetectedOnts([]);
      
      const { data, error } = await ConfigService.detectUnconfiguredOnts(formData.olt);
      
      if (data) {
          setDetectedOnts(data);
          if (data.length === 0) toast.info("No unconfigured ONTs found on this OLT.");
      } else {
          toast.error(error || "Failed to scan OLT");
      }
      setIsAutoLoading(false);
  };

  const handleSelectOnt = (ont: UnconfiguredOnt) => {
      setFormData(prev => ({
          ...prev,
          sn: ont.sn,
          port: ont.pon_port,
          slot: ont.pon_slot,
          interface: `gpon-onu_${ont.pon_slot}/${ont.pon_port}:1` 
      }));
      setShowManualScan(false);
      toast.success(`Selected ONT: ${ont.sn}`);
  };

  const toggleManualScan = () => {
      const newState = !showManualScan;
      setShowManualScan(newState);
      if (newState && detectedOnts.length === 0) {
          handleScanOnts();
      }
  };

  return (
    <ModalOverlay isOpen={isOpen} onClose={onClose} hideCloseButton={true} className="max-w-2xl">
      <div className="space-y-5">
         {/* Custom Header with Separated Controls */}
         <div className="flex items-center justify-between -mx-6 -mt-6 px-6 py-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/50 dark:bg-white/5 rounded-t-3xl">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
               {type === 'basic' ? 'New Service Configuration' : 'New Bridge Configuration'}
            </h2>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white dark:bg-black/20 p-1 rounded-full border border-slate-200 dark:border-white/10 px-2 shadow-sm">
                    <Label className="text-[10px] cursor-pointer text-slate-500 font-bold uppercase tracking-wide select-none" onClick={() => setMode(m => m === 'manual' ? 'auto' : 'manual')}>
                        {mode === 'manual' ? 'Manual' : 'Auto'}
                    </Label>
                    <Switch checked={mode === 'auto'} onCheckedChange={(c) => { setMode(c ? 'auto' : 'manual'); }} className="h-5 w-9" />
                </div>
                
                <div className="h-6 w-px bg-slate-200 dark:bg-white/10" />

                <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-white/10">
                    <X className="h-5 w-5" />
                </Button>
            </div>
         </div>

         {/* 1. OLT & Package & Modem Selection */}
         <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                   <Label>OLT Device</Label>
                   <Button 
                       variant="ghost" 
                       size="sm" 
                       className="h-6 text-[10px] px-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400"
                       onClick={fetchOltOptions}
                       disabled={isOptionsLoading}
                   >
                       <RefreshCw className={cn("h-3 w-3", isOptionsLoading && "animate-spin")} />
                   </Button>
               </div>
               <Select 
                  value={formData.olt} 
                  onChange={e => setFormData({...formData, olt: e.target.value})}
                  disabled={isOptionsLoading}
                  className="text-xs"
               >
                  {oltOptions.length === 0 && <option value="">-- Load --</option>}
                  {oltOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                  ))}
               </Select>
            </div>
            
            <div className="space-y-2">
               <div className="h-6 mb-2 flex items-center"><Label>Package</Label></div>
               <Select 
                  value={formData.package} 
                  onChange={e => setFormData({...formData, package: e.target.value})}
                  className="text-xs"
               >
                  {packageOptions.length === 0 ? (
                      <option value="">Generic</option>
                  ) : (
                      packageOptions.map(pkg => (
                          <option key={pkg} value={pkg}>{pkg}</option>
                      ))
                  )}
               </Select>
            </div>

            <div className="space-y-2">
               <div className="h-6 mb-2 flex items-center"><Label>Modem Type</Label></div>
               <Select 
                  value={formData.modemType} 
                  onChange={e => setFormData({...formData, modemType: e.target.value})}
                  className="text-xs"
               >
                  {modemOptions.length === 0 ? (
                      <>
                        <option value="EG8145V5">EG8145V5</option>
                        <option value="F609">F609</option>
                        <option value="F670L">F670L</option>
                      </>
                  ) : (
                      modemOptions.map(m => (
                          <option key={m} value={m}>{m}</option>
                      ))
                  )}
               </Select>
            </div>
         </div>

         {/* 2. Conditional Scan/Search Area */}
         {mode === 'manual' ? (
             <div className="space-y-3 p-4 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/10 animate-in fade-in slide-in-from-top-2 duration-300 relative">
                {/* CRM Search */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                        <UserIcon className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">Import Customer</p>
                        <p className="text-xs text-slate-500">Search from CRM database</p>
                    </div>
                </div>
                
                <div className="relative">
                   <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                   <Input 
                      placeholder="Search name, ID or address..." 
                      className="pl-9 bg-white dark:bg-black/20"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                   />
                   
                   {/* Dropdown Results */}
                   {searchResults.length > 0 && searchTerm.length > 1 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-md shadow-lg z-20 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                         {searchResults.map(u => (
                            <div 
                               key={u.id}
                               className="p-2 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer flex items-center gap-2 border-b border-slate-50 dark:border-white/5 last:border-0"
                               onClick={() => handleSelectUser(u)}
                            >
                               <Avatar fallback={u.name?.charAt(0) || 'U'} className="h-8 w-8 text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" />
                               <div className="overflow-hidden">
                                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{u.name}</p>
                                  <p className="text-xs text-slate-500 truncate">{u.user_pppoe}</p>
                               </div>
                            </div>
                         ))}
                      </div>
                   )}
                </div>

                {/* Device SN Entry with Scan */}
                <div className="pt-3 border-t border-slate-200 dark:border-white/10 mt-3">
                    <div className="flex items-end gap-2">
                        <div className="space-y-1 flex-1">
                            <Label>Device Serial Number (SN)</Label>
                            <Input
                                value={formData.sn}
                                onChange={e => setFormData({...formData, sn: e.target.value})}
                                placeholder="e.g. ZTEG12345678"
                                className="bg-white dark:bg-black/20 font-mono"
                            />
                        </div>
                        <Button
                            variant="outline"
                            className="w-28"
                            onClick={toggleManualScan}
                            disabled={!formData.olt}
                        >
                            {isAutoLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : showManualScan ? 'Hide' : 'Scan OLT'}
                        </Button>
                    </div>

                    {/* Manual Scan Results */}
                    {showManualScan && (
                        <div className="mt-2 border border-slate-200 dark:border-white/10 rounded-md bg-white dark:bg-black/20 max-h-[160px] overflow-y-auto animate-in slide-in-from-top-1">
                            {isAutoLoading ? (
                                <div className="p-4 text-center text-xs text-slate-500">Scanning connected devices...</div>
                            ) : detectedOnts.length === 0 ? (
                                <div className="p-4 text-center text-xs text-slate-500">No unconfigured devices found.</div>
                            ) : (
                                <div className="divide-y divide-slate-100 dark:divide-white/5">
                                    {detectedOnts.map((ont, idx) => (
                                        <div 
                                            key={idx} 
                                            className="flex items-center justify-between p-2 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                                            onClick={() => handleSelectOnt(ont)}
                                        >
                                            <div className="flex items-center gap-2">
                                                <Server className="h-4 w-4 text-slate-400" />
                                                <span className="text-sm font-mono font-medium text-slate-700 dark:text-slate-200">{ont.sn}</span>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] h-5">{ont.pon_port}/{ont.pon_slot}</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
             </div>
         ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Left: Device Selection (Scan) */}
                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/10 flex flex-col gap-3 h-full">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                <Server className="h-4 w-4" />
                            </div>
                            <div>
                                <Label className="text-sm font-semibold block">Device (ONT)</Label>
                                <p className="text-[10px] text-slate-500">Scan Network</p>
                            </div>
                        </div>
                    </div>
                    
                    <Button 
                        size="sm" 
                        variant="default" 
                        onClick={handleScanOnts} 
                        disabled={isAutoLoading || !formData.olt} 
                        className="bg-indigo-600 hover:bg-indigo-700 text-white h-8 text-xs w-full"
                    >
                        <RefreshCw className={cn("h-3 w-3 mr-2", isAutoLoading && "animate-spin")} />
                        {isAutoLoading ? 'Scanning...' : 'Scan OLT Ports'}
                    </Button>

                    <div className="flex-1 min-h-[80px] max-h-[120px] overflow-y-auto border border-slate-200 dark:border-white/10 rounded-md bg-white dark:bg-black/20 p-1">
                        {detectedOnts.length > 0 ? (
                            <div className="space-y-1">
                                {detectedOnts.map((ont, idx) => (
                                    <div 
                                        key={idx} 
                                        className="flex items-center justify-between p-2 rounded hover:bg-slate-100 dark:hover:bg-white/10 cursor-pointer group text-xs"
                                        onClick={() => handleSelectOnt(ont)}
                                    >
                                        <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{ont.sn}</span>
                                        <Badge variant="outline" className="text-[9px] h-4 px-1">{ont.pon_port}/{ont.pon_slot}</Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex items-center justify-center text-[10px] text-slate-400 text-center px-4">
                                {isAutoLoading ? 'Searching...' : 'Results appear here'}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Customer Selection (PSB) */}
                <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-100 dark:border-white/10 flex flex-col gap-3 h-full">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                                <UserIcon className="h-4 w-4" />
                            </div>
                            <div>
                                <Label className="text-sm font-semibold block">Customer (PSB)</Label>
                                <p className="text-[10px] text-slate-500">Pending Install</p>
                            </div>
                        </div>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-white/10"
                            onClick={fetchPsbData}
                            disabled={isPsbLoading}
                            title="Reload PSB Data"
                        >
                            <RefreshCw className={cn("h-3.5 w-3.5", isPsbLoading && "animate-spin")} />
                        </Button>
                    </div>
                    
                    <Select 
                       value={formData.pppoeUser}
                       onChange={(e) => {
                           const selected = psbData.find(p => p.user_pppoe === e.target.value);
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
                       }}
                       className="text-xs bg-white dark:bg-black/20 w-full"
                       disabled={isPsbLoading}
                    >
                       <option value="">-- Select Customer --</option>
                       {psbData.length > 0 ? (
                           psbData.map((p, i) => (
                               <option key={i} value={p.user_pppoe}>
                                   {p.name}
                               </option>
                           ))
                       ) : (
                           <option value="" disabled>No data (Refresh)</option>
                       )}
                    </Select>
                    
                    {/* Selected Customer Preview */}
                    {formData.pppoeUser && (
                        <div className="text-xs p-2 bg-indigo-50/50 dark:bg-indigo-900/10 rounded border border-indigo-100 dark:border-indigo-900/20 text-indigo-800 dark:text-indigo-300">
                            <span className="font-semibold">{formData.name}</span>
                            <div className="truncate opacity-70 mt-0.5">{formData.address}</div>
                        </div>
                    )}
                </div>
             </div>
         )}

         {/* Divider */}
         <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-black px-2 text-slate-500 font-semibold flex items-center gap-1">
                    <Settings className="h-3 w-3" /> Configuration Details
                </span>
            </div>
         </div>

         {/* 3. Common Form Fields */}
         <div className="space-y-3">
             <div className="space-y-2">
                <Label>Subscriber Name</Label>
                <Input 
                   value={formData.name} 
                   onChange={e => setFormData({...formData, name: e.target.value})}
                   placeholder="Full Name"
                   className="bg-slate-50 dark:bg-black/20"
                />
             </div>

             {formData.sn && (
                 <div className="p-2 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded text-xs text-emerald-700 dark:text-emerald-400 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                     <Badge variant="success" className="h-4 px-1 text-[10px]">Ready</Badge>
                     Configuring device: <span className="font-mono font-bold">{formData.sn}</span>
                     <span className="text-slate-400 ml-auto text-[10px]">Port: {formData.port}/{formData.slot}</span>
                 </div>
             )}

             <div className="space-y-2">
                <Label>Installation Address</Label>
                <Textarea 
                   value={formData.address} 
                   onChange={e => setFormData({...formData, address: e.target.value})}
                   placeholder="Street address, unit, city..."
                   className="min-h-[50px] bg-slate-50 dark:bg-black/20 resize-none"
                   rows={2}
                />
             </div>

             <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-100 dark:border-white/10">
                <div className="space-y-2">
                   <Label>PPPoE Username</Label>
                   <Input 
                      value={formData.pppoeUser} 
                      onChange={e => setFormData({...formData, pppoeUser: e.target.value})}
                      placeholder="username"
                      className="h-8 text-xs bg-white dark:bg-black/20"
                   />
                </div>
                <div className="space-y-2">
                   <Label>PPPoE Password</Label>
                   <Input 
                      type="password"
                      value={formData.pppoePass} 
                      onChange={e => setFormData({...formData, pppoePass: e.target.value})}
                      placeholder="••••••"
                      className="h-8 text-xs bg-white dark:bg-black/20"
                   />
                </div>
             </div>

             {type === 'bridge' && (
                 <div className="space-y-2">
                   <Label>Bridge Interface</Label>
                   <Input 
                      value={formData.interface}
                      onChange={e => setFormData({...formData, interface: e.target.value})}
                      placeholder="e.g. eth1, nas0_1"
                   />
                 </div>
             )}

             <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                   <div className={cn("p-1.5 rounded-full", formData.ethLock ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-slate-100 text-slate-500 dark:bg-white/10")}>
                      {formData.ethLock ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                   </div>
                   <div className="space-y-0.5">
                      <Label className="cursor-pointer text-xs" onClick={() => setFormData({...formData, ethLock: !formData.ethLock})}>Ethernet Port Lock</Label>
                   </div>
                </div>
                <Switch 
                   checked={formData.ethLock} 
                   onCheckedChange={c => setFormData({...formData, ethLock: c})}
                   className="scale-90"
                />
             </div>
         </div>

         <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-white/10">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => { console.log(formData); onClose(); }} className="bg-indigo-600 hover:bg-indigo-700 text-white">
               {type === 'basic' ? 'Provision Service' : 'Configure Bridge'}
            </Button>
         </div>
      </div>
    </ModalOverlay>
  );
};
