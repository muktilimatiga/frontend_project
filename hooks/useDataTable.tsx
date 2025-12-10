
import { useState, useMemo, useEffect } from 'react';

export interface DataTableProps<T> {
  data: T[];
  searchKey?: keyof T | '*';
  pageSize?: number;
}

export function useDataTable<T extends { id: string | number }>({ data, searchKey, pageSize = 9 }: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<keyof T | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search]);

  // Filter
  const filteredData = useMemo(() => {
    if (!search) return data;
    const lowerSearch = search.toLowerCase();

    return data.filter(item => {
      // Wildcard search across all values
      if (searchKey === '*') {
        return Object.values(item).some(val => {
          if (val === null || val === undefined) return false;
          if (typeof val === 'object') {
             try {
                return JSON.stringify(val).toLowerCase().includes(lowerSearch);
             } catch (e) {
                return false;
             }
          }
          return String(val).toLowerCase().includes(lowerSearch);
        });
      }
      // Specific column search
      if (searchKey) {
        const val = item[searchKey as keyof T];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(lowerSearch);
      }
      return true;
    });
  }, [data, search, searchKey]);

  // Sort
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      // Handle nulls/undefined
      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDir]);

  // Paginate
  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, page, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const handleSort = (key: keyof T) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedData.map(item => item.id)));
    }
  };

  const toggleSelectRow = (id: string | number) => {
    const newSet = new Set(selectedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedRows(newSet);
  };

  return {
    data: paginatedData,
    search,
    setSearch,
    sortKey,
    sortDir,
    handleSort,
    page,
    setPage,
    totalPages,
    selectedRows,
    setSelectedRows,
    toggleSelectAll,
    toggleSelectRow,
    totalCount: filteredData.length
  };
}
