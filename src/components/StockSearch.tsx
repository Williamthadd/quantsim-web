import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../store/useStore';
import { apiService, type SearchResult } from '../services/api';

const StockSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const { selectStock, setActiveTab } = useStore();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update dropdown position when showing results
  useEffect(() => {
    if (showResults && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [showResults]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Search effect with local data
  useEffect(() => {
    const searchStocks = async () => {
      if (query.length < 2) {
        setResults([]);
        setShowResults(false);
        return;
      }

      setIsLoading(true);
      
      // Clear previous results immediately when query changes
      setResults([]);
      
      try {
        const searchResults = await apiService.searchStocks(query);
        
        if (searchResults && searchResults.length > 0) {
          setResults(searchResults.slice(0, 8)); // Limit to 8 results
          setShowResults(true);
        } else {
          setResults([]);
          setShowResults(true); // Still show dropdown with "no results" message
        }
      } catch (error) {
        setResults([]);
        setShowResults(true);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchStocks, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Stable navigation function using useCallback
  const navigateToStock = useCallback((result: SearchResult) => {
    const symbol = result.symbol;
    const name = result.name;
    
    // Create stock object
    const stockData = {
      symbol,
      name,
      price: Math.random() * 500 + 50,
      change: (Math.random() - 0.5) * 20,
      changePercent: (Math.random() - 0.5) * 10,
      volume: Math.floor(Math.random() * 50000000) + 1000000,
    };
    
    // Force immediate store updates
    selectStock(stockData);
    setActiveTab('stock-detail');
    
    // Clear search
    setQuery('');
    setShowResults(false);
  }, [selectStock, setActiveTab]);

  const handleResultClick = useCallback((result: SearchResult, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    // Multiple navigation attempts for reliability
    navigateToStock(result);
    
    // Backup method with delay
    setTimeout(() => {
      navigateToStock(result);
    }, 100);
    
    // Emergency fallback
    setTimeout(() => {
      const symbol = result.symbol;
      const mockStock = {
        symbol,
        name: result.name,
        price: 150 + Math.random() * 300,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 5,
        volume: 1000000 + Math.floor(Math.random() * 10000000),
      };
      selectStock(mockStock);
      setActiveTab('stock-detail');
      setQuery('');
      setShowResults(false);
    }, 300);
  }, [navigateToStock, selectStock, setActiveTab]);

  return (
    <div ref={searchRef} className="relative flex-1 max-w-full sm:max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            const newQuery = e.target.value;
            setQuery(newQuery);
            // Clear results immediately when typing to prevent showing stale results
            if (newQuery !== query) {
              setResults([]);
              setShowResults(false);
            }
          }}
          placeholder="Search stocks (e.g., AAPL, MSFT, TSLA)"
          className="w-full trading-input pl-8 sm:pl-10 pr-4 text-sm sm:text-base"
        />
        <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-primary border-t-transparent" />
          ) : (
            <span className="text-text-muted text-sm sm:text-base">🔍</span>
          )}
        </div>
      </div>

      {/* Search Results Dropdown - Portal with Fixed Positioning to Bypass All Stacking Contexts */}
      {showResults && results.length > 0 && createPortal(
        <div 
          className="glass-panel-strong border-2 border-primary rounded-lg shadow-2xl max-h-96 overflow-y-auto"
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 2147483647, // Maximum safe integer for z-index
            maxHeight: '400px',
            backgroundColor: 'var(--color-bg-secondary)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            border: '3px solid var(--color-primary)',
            borderRadius: '12px'
          }}
        >
          {results.map((result, index) => (
            <div
              key={`${result.symbol}-${index}`}
              onClick={(e) => {
                handleResultClick(result, e);
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                // Immediate backup navigation on mousedown
                navigateToStock(result);
              }}
              onMouseUp={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Another backup navigation
                navigateToStock(result);
              }}
              onTouchStart={() => {
                // Mobile support
                navigateToStock(result);
              }}
              className="flex items-center justify-between p-2 sm:p-3 hover:bg-bg-accent/30 cursor-pointer border-b border-bg-accent/20 last:border-b-0 transition-colors active:bg-bg-accent/50"
              style={{ 
                cursor: 'pointer',
                userSelect: 'none',
                outline: 'none',
                pointerEvents: 'auto',
                touchAction: 'manipulation' // Better mobile support
              }}
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary text-xs sm:text-sm">
                  {result.symbol}
                </p>
                <p className="text-text-secondary text-xs truncate">
                  {result.name}
                </p>
                <div className="flex items-center space-x-1 sm:space-x-2 mt-1">
                  <span className="text-xs text-text-muted">{result.type}</span>
                  <span className="text-xs text-text-muted">•</span>
                  <span className="text-xs text-text-muted">{result.region}</span>
                </div>
              </div>
            </div>
          ))})
        </div>,
        document.body
      )}

      {/* No Results Message - Portal with Fixed Positioning to Bypass All Stacking Contexts */}
      {showResults && results.length === 0 && query.length >= 2 && !isLoading && createPortal(
        <div 
          className="glass-panel border-2 border-primary rounded-lg p-3 sm:p-4"
          style={{
            position: 'fixed',
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownPosition.width}px`,
            zIndex: 2147483647, // Maximum safe integer for z-index
            backgroundColor: 'var(--color-bg-secondary)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.1)',
            border: '3px solid var(--color-primary)',
            borderRadius: '12px'
          }}
        >
          <p className="text-text-muted text-center text-xs sm:text-sm">
            No stocks found for "{query}". Try a different search term.
          </p>
        </div>,
        document.body
      )}
    </div>
  );
};

export default StockSearch;