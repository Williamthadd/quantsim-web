import React from 'react';
import { useStore } from '../store/useStore';

const Dashboard: React.FC = () => {
  const { portfolio, positions, userSession, selectStock, setActiveTab } = useStore();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const topPositions = positions
    .sort((a, b) => b.marketValue - a.marketValue)
    .slice(0, 5);

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="metric-card">
          <h3 className="text-xs sm:text-sm font-semibold text-text-muted">Total Portfolio Value</h3>
          <p className="text-xl sm:text-2xl font-bold text-text-primary">
            {formatCurrency(portfolio.totalValue)}
          </p>
          <p className={`text-xs sm:text-sm ${portfolio.totalReturn >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(portfolio.totalReturn)} ({formatPercent(portfolio.totalReturnPercent)})
          </p>
        </div>

        <div className="metric-card">
          <h3 className="text-xs sm:text-sm font-semibold text-text-muted">Available Cash</h3>
          <p className="text-xl sm:text-2xl font-bold text-text-primary">
            {formatCurrency(portfolio.cash)}
          </p>
          <p className="text-xs sm:text-sm text-text-secondary">
            {((portfolio.cash / portfolio.totalValue) * 100).toFixed(1)}% of portfolio
          </p>
        </div>

        <div className="metric-card">
          <h3 className="text-xs sm:text-sm font-semibold text-text-muted">Day Change</h3>
          <p className={`text-xl sm:text-2xl font-bold ${portfolio.dayChange >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(portfolio.dayChange)}
          </p>
          <p className={`text-xs sm:text-sm ${portfolio.dayChange >= 0 ? 'text-success' : 'text-danger'}`}>
            {formatPercent(portfolio.dayChangePercent)}
          </p>
        </div>

        <div className="metric-card">
          <h3 className="text-xs sm:text-sm font-semibold text-text-muted">Positions</h3>
          <p className="text-xl sm:text-2xl font-bold text-text-primary">
            {positions.length}
          </p>
          <p className="text-xs sm:text-sm text-text-secondary">
            Active holdings
          </p>
        </div>
      </div>

      {/* Top Positions */}
      <div className="glass-panel p-3 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-3 sm:mb-4">Top Holdings</h2>
        {positions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-text-muted mb-3 sm:mb-4">No positions yet</p>
            <p className="text-xs sm:text-sm text-text-secondary">
              Search for stocks and start trading to see your holdings here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {topPositions.map((position) => (
              <div
                key={position.symbol}
                onClick={() => {
                  // Create stock object and navigate to stock detail
                  const stock = {
                    symbol: position.symbol,
                    name: position.name,
                    price: position.currentPrice,
                    change: position.totalReturn / position.shares,
                    changePercent: position.totalReturnPercent,
                    volume: 0, // We don't have volume data for positions
                  };
                  selectStock(stock);
                  setActiveTab('stock-detail');
                }}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border border-bg-accent/30 hover:border-bg-accent/60 hover:bg-bg-accent/20 transition-all cursor-pointer gap-2 sm:gap-0"
              >
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-3">
                    <h3 className="font-bold text-text-primary">{position.symbol}</h3>
                    <span className="text-xs sm:text-sm text-text-secondary truncate">{position.name}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-text-muted">
                    {position.shares} shares @ {formatCurrency(position.avgPrice)}
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="font-semibold text-text-primary">
                    {formatCurrency(position.marketValue)}
                  </p>
                  <p className={`text-xs sm:text-sm ${position.totalReturn >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(position.totalReturn)} ({formatPercent(position.totalReturnPercent)})
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Portfolio Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="glass-panel p-3 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-3 sm:mb-4">Portfolio Allocation</h2>
          {positions.length === 0 ? (
            <p className="text-center text-text-muted py-6 sm:py-8">No positions to display</p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {positions.map((position) => {
                const allocation = (position.marketValue / portfolio.totalValue) * 100;
                return (
                  <div key={position.symbol} className="space-y-2">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-text-primary font-medium">{position.symbol}</span>
                      <span className="text-text-secondary">{allocation.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-bg-accent/30 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${allocation}%` }}
                      />
                    </div>
                  </div>
                );
              })}
              
              {/* Cash allocation */}
              {portfolio.cash > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-text-primary font-medium">Cash</span>
                    <span className="text-text-secondary">
                      {((portfolio.cash / portfolio.totalValue) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-bg-accent/30 rounded-full h-2">
                    <div
                      className="bg-text-secondary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(portfolio.cash / portfolio.totalValue) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="glass-panel p-3 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-3 sm:mb-4">Performance Metrics</h2>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between">
              <span className="text-text-secondary text-sm">Initial Capital</span>
              <span className="text-text-primary font-semibold text-sm">
                {userSession ? formatCurrency(userSession.initialCapital) : '--'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary text-sm">Current Value</span>
              <span className="text-text-primary font-semibold text-sm">
                {formatCurrency(portfolio.totalValue)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary text-sm">Total Return</span>
              <span className={`font-semibold text-sm ${portfolio.totalReturn >= 0 ? 'text-success' : 'text-danger'}`}>
                <span className="hidden sm:inline">{formatCurrency(portfolio.totalReturn)} </span>({formatPercent(portfolio.totalReturnPercent)})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary text-sm">Session Duration</span>
              <span className="text-text-primary font-semibold text-sm">
                {userSession 
                  ? Math.floor((Date.now() - new Date(userSession.startDate).getTime()) / (1000 * 60 * 60 * 24)) + ' days'
                  : '--'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;