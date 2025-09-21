import React from 'react';
import { useStore } from '../store/useStore';
import StockSearch from './StockSearch';

const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, sidebarOpen, setSidebarOpen, watchlist, removeFromWatchlist } = useStore();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼' },
    { id: 'research', label: 'Research', icon: '🔍' },
    { id: 'backtest', label: 'Backtest', icon: '📈' },
  ];

  return (
    <div className="h-full glass-panel-strong flex flex-col">
      {/* Sidebar Header */}
      <div className="p-2 sm:p-4 border-b border-bg-accent/50">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <h2 className="text-base sm:text-lg font-bold text-primary">QuantSimulate</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 sm:p-2 hover:bg-bg-accent/50 rounded transition-colors cursor-pointer"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="p-2 sm:p-4">
        {/* Mobile: Show search when sidebar is open */}
        {sidebarOpen && (
          <div className="lg:hidden mb-4">
            <StockSearch />
          </div>
        )}
        
        {/* Mobile: Horizontal layout */}
        <div className="flex lg:hidden space-x-2 overflow-x-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors cursor-pointer text-xs ${
                activeTab === item.id
                  ? 'bg-primary text-white'
                  : 'hover:bg-bg-accent/50 text-text-secondary'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </div>
        
        {/* Desktop: Vertical layout */}
        <div className="hidden lg:flex lg:flex-col space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors cursor-pointer text-base ${
                activeTab === item.id
                  ? 'bg-primary text-white'
                  : 'hover:bg-bg-accent/50 text-text-secondary'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Watchlist - Only show on desktop when sidebar is open */}
      {sidebarOpen && (
        <div className="hidden lg:block flex-1 p-2 sm:p-4 border-t border-bg-accent/50">
          <h3 className="text-xs sm:text-sm font-semibold text-text-primary mb-2 sm:mb-3">Watchlist</h3>
          <div className="space-y-1 sm:space-y-2">
            {watchlist.length === 0 ? (
              <p className="text-xs text-text-muted text-center py-4">
                No stocks in watchlist
              </p>
            ) : (
              watchlist.map((stock) => (
                <div
                  key={stock.symbol}
                  onClick={() => {
                    // Navigate to stock detail when watchlist item is clicked
                    const { selectStock, setActiveTab } = useStore.getState();
                    selectStock(stock);
                    setActiveTab('stock-detail');
                  }}
                  className="flex items-center justify-between p-2 rounded hover:bg-bg-accent/30 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-text-primary truncate">
                      {stock.symbol}
                    </p>
                    <p className="text-xs text-text-secondary truncate">
                      ${stock.price?.toFixed(2) || '--'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <span
                      className={`text-xs ${
                        stock.changePercent > 0
                          ? 'text-success'
                          : stock.changePercent < 0
                          ? 'text-danger'
                          : 'text-text-secondary'
                      }`}
                    >
                      {stock.changePercent > 0 ? '+' : ''}
                      {stock.changePercent?.toFixed(2) || '--'}%
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWatchlist(stock.symbol);
                      }}
                      className="text-text-muted hover:text-danger transition-colors cursor-pointer text-sm"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;