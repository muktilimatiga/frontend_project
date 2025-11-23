import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Input } from '../../../components/ui';
import { MockService } from '../../../mock';
import { User } from '../../../types';

interface MapSearchProps {
  onSelectUser: (user: User) => void;
}

export const MapSearch = ({ onSelectUser }: MapSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const { data: customers = [] } = useQuery({ queryKey: ['customers'], queryFn: MockService.getCustomers });

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
       const lower = searchQuery.toLowerCase();
       setFilteredUsers(customers.filter(c => 
          c.name.toLowerCase().includes(lower) || 
          c.email.toLowerCase().includes(lower)
       ));
    } else {
       setFilteredUsers([]);
    }
  }, [searchQuery, customers]);

  const handleSelect = (u: User) => {
     onSelectUser(u);
     setSearchQuery('');
     setFilteredUsers([]);
  };

  return (
     <div className="relative w-72 z-20">
       <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Find customer on map..." 
            className="pl-8 bg-white dark:bg-black h-9 text-sm" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
       </div>
       {filteredUsers.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-white dark:bg-black border border-slate-200 dark:border-white/10 rounded-md shadow-lg max-h-60 overflow-y-auto">
             {filteredUsers.map(u => (
                <div 
                  key={u.id} 
                  className="p-2 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer text-sm flex items-center gap-2"
                  onClick={() => handleSelect(u)}
                >
                   <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-white/10 flex items-center justify-center text-[10px] text-slate-600 dark:text-slate-300">{u.name.charAt(0)}</div>
                   <div>
                      <div className="font-medium text-slate-900 dark:text-slate-200">{u.name}</div>
                      {u.coordinates && <div className="text-[10px] text-slate-500">{u.coordinates.lat.toFixed(3)}, {u.coordinates.lng.toFixed(3)}</div>}
                   </div>
                </div>
             ))}
          </div>
       )}
     </div>
  );
};