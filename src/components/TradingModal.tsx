import React, { useState } from 'react';
import { useStore, type Stock } from '../store/useStore';

interface TradingModalProps {
  stock: Stock;
  onClose: () => void;
}

const TradingModal: React.FC<TradingModalProps> = ({ stock, onClose }) => {
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [shares, setShares] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const { portfolio, getPosition, executeTrade } = useStore();
  
  const currentPosition = getPosition(stock.symbol);
  const shareCount = parseInt(shares) || 0;
  const tradeValue = shareCount * stock.price;
  const maxBuyShares = Math.floor(portfolio.cash / stock.price);
  const maxSellShares = currentPosition?.shares || 0;

  const handleTrade = async () => {
    if (!shareCount || shareCount <= 0) {
      setError('Please enter a valid number of shares');
      return;
    }

    if (tradeType === 'BUY' && tradeValue > portfolio.cash) {
      setError('Insufficient funds');
      return;
    }

    if (tradeType === 'SELL' && shareCount > maxSellShares) {
      setError('Insufficient shares');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      executeTrade(stock.symbol, tradeType, shareCount, stock.price);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Trade execution failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const presetShares = [
    { label: '10', value: '10' },
    { label: '25', value: '25' },
    { label: '50', value: '50' },
    { label: '100', value: '100' },
    { label: 'Max', value: tradeType === 'BUY' ? maxBuyShares.toString() : maxSellShares.toString() },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-panel-strong max-w-md w-full mx-2 sm:mx-4 p-4 sm:p-6 animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary">Trade {stock.symbol}</h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-primary transition-colors cursor-pointer text-lg sm:text-xl"
          >
            ✕
          </button>
        </div>

        {/* Stock Info */}
        <div className="glass-panel p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-text-primary text-sm sm:text-base">{stock.symbol}</h3>
              <p className="text-xs sm:text-sm text-text-secondary truncate">{stock.name}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-3">
              <p className="text-base sm:text-lg font-bold text-text-primary">
                ${stock.price.toFixed(2)}
              </p>
              <p className={`text-xs sm:text-sm ${
                stock.changePercent >= 0 ? 'text-success' : 'text-danger'
              }`}>
                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
              </p>
            </div>
          </div>
        </div>

        {/* Trade Type Toggle */}
        <div className="flex space-x-2 mb-3 sm:mb-4">
          <button
            onClick={() => setTradeType('BUY')}
            className={`flex-1 py-2 px-3 sm:px-4 rounded font-semibold transition-colors cursor-pointer text-sm ${
              tradeType === 'BUY'
                ? 'bg-success text-white'
                : 'bg-bg-accent/30 text-text-secondary hover:bg-bg-accent/50'
            }`}
          >
            BUY
          </button>
          <button
            onClick={() => setTradeType('SELL')}
            disabled={!currentPosition || currentPosition.shares === 0}
            className={`flex-1 py-2 px-3 sm:px-4 rounded font-semibold transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm ${
              tradeType === 'SELL'
                ? 'bg-danger text-white'
                : 'bg-bg-accent/30 text-text-secondary hover:bg-bg-accent/50'
            }`}
          >
            SELL
          </button>
        </div>

        {/* Current Position Info */}
        {currentPosition && (
          <div className="glass-panel p-2 sm:p-3 mb-3 sm:mb-4 text-xs sm:text-sm">
            <p className="text-text-muted">Current Position:</p>
            <p className="text-text-primary">
              {currentPosition.shares} shares @ ${currentPosition.avgPrice.toFixed(2)}
            </p>
            <p className={`${currentPosition.totalReturn >= 0 ? 'text-success' : 'text-danger'}`}>
              P&L: ${currentPosition.totalReturn.toFixed(2)} 
              ({currentPosition.totalReturnPercent.toFixed(2)}%)
            </p>
          </div>
        )}

        {/* Shares Input */}
        <div className="mb-3 sm:mb-4">
          <label className="block text-xs sm:text-sm font-semibold text-text-primary mb-2">
            Number of Shares
          </label>
          
          {/* Preset Buttons */}
          <div className="grid grid-cols-5 gap-1 sm:gap-2 mb-2 sm:mb-3">
            {presetShares.map((preset) => (
              <button
                key={preset.label}
                onClick={() => setShares(preset.value)}
                disabled={preset.value === '0'}
                className={`p-1 sm:p-2 text-xs sm:text-sm rounded border transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  shares === preset.value
                    ? 'bg-primary text-white border-primary'
                    : 'bg-bg-accent/30 text-text-secondary border-bg-accent hover:border-primary'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <input
            type="number"
            value={shares}
            onChange={(e) => setShares(e.target.value)}
            min="1"
            max={tradeType === 'BUY' ? maxBuyShares : maxSellShares}
            className="w-full trading-input text-center text-base sm:text-lg font-semibold"
            placeholder="0"
          />
          
          <p className="text-xs text-text-muted mt-1 text-center">
            Max {tradeType === 'BUY' ? 'Buy' : 'Sell'}: {
              tradeType === 'BUY' ? maxBuyShares : maxSellShares
            } shares
          </p>
        </div>

        {/* Trade Summary */}
        <div className="glass-panel p-3 sm:p-4 mb-3 sm:mb-4">
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">Shares:</span>
              <span className="text-text-primary">{shareCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Price per Share:</span>
              <span className="text-text-primary">${stock.price.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t border-bg-accent/30 pt-2">
              <span className="text-text-primary">Total:</span>
              <span className="text-text-primary">${tradeValue.toFixed(2)}</span>
            </div>
            {tradeType === 'BUY' && (
              <div className="flex justify-between text-xs">
                <span className="text-text-muted">Remaining Cash:</span>
                <span className="text-text-secondary">
                  ${(portfolio.cash - tradeValue).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-danger/20 border border-danger/50 text-danger px-3 py-2 rounded mb-3 sm:mb-4 text-xs sm:text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 sm:space-x-3">
          <button
            onClick={onClose}
            className="flex-1 trading-button bg-bg-accent/50 text-text-secondary hover:bg-bg-accent/70 cursor-pointer text-sm py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleTrade}
            disabled={!shareCount || shareCount <= 0 || isSubmitting}
            className={`flex-1 font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm py-2 ${
              tradeType === 'BUY' 
                ? 'trading-button-success' 
                : 'trading-button-danger'
            }`}
          >
            {isSubmitting ? 'Processing...' : `${tradeType} ${shareCount} Shares`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradingModal;