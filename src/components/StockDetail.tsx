import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import TradingModal from './TradingModal';
import ChartComponent from './ChartComponent';

const StockDetail: React.FC = () => {
  const { selectedStock, addToWatchlist, watchlist } = useStore();
  const [showTradingModal, setShowTradingModal] = useState(false);

  const isInWatchlist = selectedStock ? watchlist.some(s => s.symbol === selectedStock.symbol) : false;

  if (!selectedStock) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64">
        <div className="text-center p-4">
          <h2 className="text-lg sm:text-xl text-text-primary mb-2">No Stock Selected</h2>
          <p className="text-text-secondary text-sm">Search for a stock to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      <div className="glass-panel p-3 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3 sm:gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-text-primary">{selectedStock.symbol}</h1>
            <p className="text-text-secondary text-sm sm:text-base truncate">{selectedStock.name}</p>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {!isInWatchlist && (
              <button
                onClick={() => selectedStock && addToWatchlist(selectedStock)}
                className="trading-button bg-bg-accent/50 text-text-secondary hover:bg-bg-accent/70 cursor-pointer text-sm px-3 py-2"
              >
                + Watch
              </button>
            )}
            <button
              onClick={() => setShowTradingModal(true)}
              className="trading-button-primary cursor-pointer text-sm px-4 py-2"
            >
              Trade
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:space-x-4 gap-2 sm:gap-0">
          <span className="text-2xl sm:text-3xl font-bold text-text-primary">
            ${selectedStock.price?.toFixed(2) || '--'}
          </span>
          <span className={`text-base sm:text-lg font-semibold ${
            selectedStock.changePercent > 0 ? 'text-success' : 
            selectedStock.changePercent < 0 ? 'text-danger' : 'text-text-secondary'
          }`}>
            {selectedStock.change?.toFixed(2) || '--'} ({selectedStock.changePercent > 0 ? '+' : ''}
            {selectedStock.changePercent?.toFixed(2) || '--'}%)
          </span>
        </div>
        
        {selectedStock.volume && (
          <p className="text-xs sm:text-sm text-text-muted mt-2">
            Volume: {selectedStock.volume.toLocaleString()}
          </p>
        )}
      </div>

      <div className="glass-panel p-3 sm:p-6">
        <ChartComponent stock={selectedStock} height={300} />
      </div>
      
      {/* Trading Modal */}
      {showTradingModal && selectedStock && (
        <TradingModal
          stock={selectedStock}
          onClose={() => setShowTradingModal(false)}
        />
      )}
    </div>
  );
};

export default StockDetail;