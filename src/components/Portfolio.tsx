import React from 'react';
import { useStore } from '../store/useStore';

const Portfolio: React.FC = () => {
  const { positions, transactions, portfolio } = useStore();

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

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Portfolio Summary */}
      <div className="glass-panel p-3 sm:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-4 sm:mb-6">Portfolio Overview</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center">
            <p className="text-text-muted text-xs sm:text-sm">Total Value</p>
            <p className="text-xl sm:text-2xl font-bold text-text-primary">
              {formatCurrency(portfolio.totalValue)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-text-muted text-xs sm:text-sm">Total Return</p>
            <p className={`text-xl sm:text-2xl font-bold ${
              portfolio.totalReturn >= 0 ? 'text-success' : 'text-danger'
            }`}>
              {formatCurrency(portfolio.totalReturn)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-text-muted text-xs sm:text-sm">Return %</p>
            <p className={`text-xl sm:text-2xl font-bold ${
              portfolio.totalReturnPercent >= 0 ? 'text-success' : 'text-danger'
            }`}>
              {formatPercent(portfolio.totalReturnPercent)}
            </p>
          </div>
        </div>
      </div>

      {/* Positions */}
      <div className="glass-panel p-3 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-3 sm:mb-4">Current Positions</h2>
        
        {positions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-text-muted">No positions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-bg-accent">
                  <th className="text-left p-2 sm:p-3 text-text-muted text-xs sm:text-sm">Symbol</th>
                  <th className="text-right p-2 sm:p-3 text-text-muted text-xs sm:text-sm">Shares</th>
                  <th className="text-right p-2 sm:p-3 text-text-muted text-xs sm:text-sm hidden sm:table-cell">Avg Price</th>
                  <th className="text-right p-2 sm:p-3 text-text-muted text-xs sm:text-sm">Current</th>
                  <th className="text-right p-2 sm:p-3 text-text-muted text-xs sm:text-sm">Value</th>
                  <th className="text-right p-2 sm:p-3 text-text-muted text-xs sm:text-sm">P&L</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position) => (
                  <tr key={position.symbol} className="border-b border-bg-accent/30">
                    <td className="p-2 sm:p-3">
                      <div>
                        <p className="font-semibold text-text-primary text-sm">{position.symbol}</p>
                        <p className="text-xs text-text-secondary truncate max-w-[100px] sm:max-w-none">{position.name}</p>
                      </div>
                    </td>
                    <td className="p-2 sm:p-3 text-right text-text-primary text-sm">{position.shares}</td>
                    <td className="p-2 sm:p-3 text-right text-text-primary text-sm hidden sm:table-cell">
                      {formatCurrency(position.avgPrice)}
                    </td>
                    <td className="p-2 sm:p-3 text-right text-text-primary text-sm">
                      {formatCurrency(position.currentPrice)}
                    </td>
                    <td className="p-2 sm:p-3 text-right text-text-primary font-semibold text-sm">
                      {formatCurrency(position.marketValue)}
                    </td>
                    <td className={`p-2 sm:p-3 text-right font-semibold text-sm ${
                      position.totalReturn >= 0 ? 'text-success' : 'text-danger'
                    }`}>
                      <div className="text-right">
                        <div className="hidden sm:block">{formatCurrency(position.totalReturn)}</div>
                        <div>{formatPercent(position.totalReturnPercent)}</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="glass-panel p-3 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-text-primary mb-3 sm:mb-4">Recent Transactions</h2>
        
        {transactions.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-text-muted">No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-bg-accent">
                  <th className="text-left p-2 sm:p-3 text-text-muted text-xs sm:text-sm">Date</th>
                  <th className="text-left p-2 sm:p-3 text-text-muted text-xs sm:text-sm">Symbol</th>
                  <th className="text-center p-2 sm:p-3 text-text-muted text-xs sm:text-sm">Type</th>
                  <th className="text-right p-2 sm:p-3 text-text-muted text-xs sm:text-sm">Shares</th>
                  <th className="text-right p-2 sm:p-3 text-text-muted text-xs sm:text-sm hidden sm:table-cell">Price</th>
                  <th className="text-right p-2 sm:p-3 text-text-muted text-xs sm:text-sm">Total</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 20).map((transaction) => (
                  <tr key={transaction.id} className="border-b border-bg-accent/30">
                    <td className="p-2 sm:p-3 text-text-secondary text-xs sm:text-sm">
                      {new Date(transaction.timestamp).toLocaleDateString()}
                    </td>
                    <td className="p-2 sm:p-3 text-text-primary font-semibold text-sm">
                      {transaction.symbol}
                    </td>
                    <td className="p-2 sm:p-3 text-center">
                      <span className={`px-1 sm:px-2 py-1 rounded text-xs font-semibold ${
                        transaction.type === 'BUY' 
                          ? 'bg-success/20 text-success' 
                          : 'bg-danger/20 text-danger'
                      }`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="p-2 sm:p-3 text-right text-text-primary text-sm">
                      {transaction.shares}
                    </td>
                    <td className="p-2 sm:p-3 text-right text-text-primary text-sm hidden sm:table-cell">
                      {formatCurrency(transaction.price)}
                    </td>
                    <td className="p-2 sm:p-3 text-right text-text-primary font-semibold text-sm">
                      {formatCurrency(transaction.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;