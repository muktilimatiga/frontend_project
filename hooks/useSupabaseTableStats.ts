
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface TableStat {
  id: string;
  name: string;
  rowCount: number;
  size: string; // Mocked for now as we can't easily get this from client
  lastSynced: string;
  status: 'active' | 'archived' | 'error';
}

export const useSupabaseTableStats = () => {
  const [tables, setTables] = useState<TableStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      
      // Defined tables based on the provided schema
      const knownTables = ['log_komplain', 'snmp', 'data_fiber', 'snmp_devices', 'users', 'log_metro', 'customers_view'];
      const stats: TableStat[] = [];

      // Check if Supabase is configured
      const isMock = !supabase || (supabase['supabaseUrl'] && supabase['supabaseUrl'].includes('placeholder'));

      if (isMock) {
          // Return mock stats
          await new Promise(resolve => setTimeout(resolve, 800));
          const mockStats = knownTables.map(name => ({
              id: name,
              name: name,
              rowCount: Math.floor(Math.random() * 500) + 50,
              size: 'Mock',
              lastSynced: 'Just now',
              status: 'active' as const
          }));
          setTables(mockStats);
          setLoading(false);
          return;
      }

      for (const tableName of knownTables) {
        try {
          // Fetch count only (head: true) for performance
          const { count, error } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true });

          if (!error) {
            stats.push({
              id: tableName,
              name: tableName,
              rowCount: count || 0,
              size: 'Live', // Placeholder since real size requires admin API
              lastSynced: 'Synced',
              status: 'active'
            });
          } else {
             console.warn(`Skipping table ${tableName}:`, error.message);
             // Add as error state so user knows it exists but failed
             stats.push({
                id: tableName,
                name: tableName,
                rowCount: 0,
                size: 'N/A',
                lastSynced: 'Error',
                status: 'error'
             });
          }
        } catch (e) {
          console.error(`Error fetching stats for ${tableName}`, e);
        }
      }

      setTables(stats);
      setLoading(false);
    };

    fetchStats();
  }, []);

  return { tables, loading };
};
