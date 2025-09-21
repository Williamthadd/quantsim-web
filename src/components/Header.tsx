import React from 'react';
import { useStore } from '../store/useStore';
import StockSearch from './StockSearch';

const Header: React.FC = () => {
  const { portfolio, userSession } = useStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  return (
    <header className="glass-panel border-b border-bg-accent/50 p-2 sm:p-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="w-full lg:flex-1 lg:max-w-md">
          <StockSearch />
        </div>

        {/* Portfolio Summary */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm">
          <div className="text-center sm:text-right min-w-0">
            <p className="text-text-muted">Total Value</p>
            <p className="font-bold text-text-primary truncate">
              {formatCurrency(portfolio.totalValue)}
            </p>
          </div>

          <div className="text-center sm:text-right min-w-0">
            <p className="text-text-muted">P&L</p>
            <p
              className={`font-bold truncate ${
                portfolio.totalReturn >= 0 ? 'text-success' : 'text-danger'
              }`}
            >
              {formatCurrency(portfolio.totalReturn)} ({formatPercent(portfolio.totalReturnPercent)})
            </p>
          </div>

          <div className="text-center sm:text-right min-w-0">
            <p className="text-text-muted">Cash</p>
            <p className="font-bold text-text-primary truncate">
              {formatCurrency(portfolio.cash)}
            </p>
          </div>

          <div className="text-center sm:text-right min-w-0 hidden sm:block">
            <p className="text-text-muted">Day Change</p>
            <p
              className={`font-bold truncate ${
                portfolio.dayChange >= 0 ? 'text-success' : 'text-danger'
              }`}
            >
              {formatCurrency(portfolio.dayChange)} ({formatPercent(portfolio.dayChangePercent)})
            </p>
          </div>

          {/* User Session Info */}
          {userSession && (
            <div className="text-center sm:text-right border-l border-bg-accent/50 pl-3 sm:pl-6 hidden md:block">
              <p className="text-text-muted">Session Start</p>
              <p className="text-text-secondary">
                {new Date(userSession.startDate).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;