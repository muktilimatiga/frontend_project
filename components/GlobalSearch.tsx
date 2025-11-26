
import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { LayoutDashboard, Ticket as TicketIcon, Search } from 'lucide-react';
import { useAppStore } from '../store';
import { MockService } from '../mock';
import { Command, CommandInput, CommandList, CommandItem } from './ui';

export const GlobalSearch = () => {
  const { isSearchOpen, setSearchOpen } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{users: any[], tickets: any[], pages: any[]} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const delaySearch = setTimeout(async () => {
      if (searchQuery.length > 1) {
        const results = await MockService.searchGlobal(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults(null);
      }
    }, 300);
    return () => clearTimeout(delaySearch);
  }, [searchQuery]);

  const handleSelect = (type: string, idOrPath: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    if (type === 'page') {
      navigate({ to: idOrPath });
    } else {
      console.log(`Navigating to ${type}: ${idOrPath}`);
    }
  };

  if (!isSearchOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/20 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
      <div className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[100] rounded-xl shadow-2xl border border-slate-200 bg-white dark:border-white/20 dark:bg-black overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <Command className="h-full">
            <CommandInput 
            placeholder="Search tickets, users, pages..." 
            autoFocus
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-none focus:ring-0"
            />
            <CommandList className="max-h-[400px] border-t border-slate-100 dark:border-white/10">
            {!searchQuery && <div className="p-8 text-sm text-slate-500 text-center">Type to search across the platform...</div>}
            
            {searchResults?.pages?.length ? (
                <div className="p-2">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 mb-2 uppercase tracking-wider">Pages</p>
                    {searchResults.pages.map((page: any) => (
                        <CommandItem key={page.to} onClick={() => handleSelect('page', page.to)} className="rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-slate-100 dark:bg-white/10 rounded-md">
                                <LayoutDashboard className="h-4 w-4 text-slate-500 dark:text-slate-300" />
                            </div>
                            <span>{page.title}</span>
                        </div>
                        </CommandItem>
                    ))}
                </div>
            ) : null}

            {searchResults?.users?.length ? (
                <div className="p-2 border-t border-slate-100 dark:border-white/10">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 mb-2 uppercase tracking-wider">Users</p>
                    {searchResults.users.map((user: any) => (
                        <CommandItem key={user.id} onClick={() => handleSelect('user', user.id)} className="rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300">
                                {user.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{user.name}</span>
                                <span className="text-xs text-slate-400">{user.email}</span>
                            </div>
                        </div>
                        </CommandItem>
                    ))}
                </div>
            ) : null}

            {searchResults?.tickets?.length ? (
                <div className="p-2 border-t border-slate-100 dark:border-white/10">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 px-2 mb-2 uppercase tracking-wider">Tickets</p>
                    {searchResults.tickets.map((t: any) => (
                        <CommandItem key={t.id} onClick={() => handleSelect('ticket', t.id)} className="rounded-lg">
                        <div className="flex items-center gap-3">
                            <TicketIcon className="h-4 w-4 text-slate-400" />
                            <span className="font-mono text-xs bg-slate-100 px-1.5 py-0.5 rounded dark:bg-white/20 dark:text-white">{t.id}</span>
                            <span className="truncate text-sm">{t.title}</span>
                        </div>
                        </CommandItem>
                    ))}
                </div>
            ) : null}

            {searchQuery && !searchResults?.pages?.length && !searchResults?.users?.length && !searchResults?.tickets?.length && (
                <div className="p-8 text-sm text-slate-500 text-center">No results found for "{searchQuery}"</div>
            )}
            </CommandList>
        </Command>
      </div>
    </>
  );
};
