'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (query: string) => void;
  debounceMs?: number;
}

export function SearchBar({
  onSearch,
  debounceMs = 300,
  className = '',
  placeholder = 'Ara...',
  ...props
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      onSearch(query);
    }, debounceMs);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, debounceMs, onSearch]);

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className={cn(
      'relative flex items-center',
      className
    )}>
      <div className="absolute left-3 text-gray-400">
        <FiSearch className="w-5 h-5" />
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cn(
          'w-full h-10 pl-10 pr-10',
          'bg-gray-800/50 backdrop-blur-sm',
          'border border-gray-700/50',
          'rounded-lg',
          'text-white placeholder-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500/50',
          'transition-all duration-200'
        )}
        placeholder={placeholder}
        {...props}
      />
      {query && (
        <button
          onClick={handleClear}
          className={cn(
            'absolute right-3',
            'text-gray-400 hover:text-white',
            'transition-colors duration-200'
          )}
          type="button"
        >
          <FiX className="w-5 h-5" />
        </button>
      )}
    </div>
  );
} 