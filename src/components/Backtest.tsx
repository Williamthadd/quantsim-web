import React, { useState } from 'react';
import { useStore } from '../store/useStore';

interface BacktestResult {
  totalReturn: number;
  totalReturnPercent: number;
  sharpeRatio: number;
  maxDrawdown: number;
  winRate: number;
  totalTrades: number;
  avgTrade: number;
  bestTrade: number;
  worstTrade: number;
  volatility: number;
}

const Backtest: React.FC = () => {
  const { portfolio } = useStore();
  const [strategy, setStrategy] = useState('buy-hold');
  const [symbol, setSymbol] = useState('SPY');
  const [startDate, setStartDate] = useState('2023-01-01');
  const [endDate, setEndDate] = useState('2024-01-01');
  const [initialCapital, setInitialCapital] = useState(100000);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BacktestResult | null>(null);

  const strategies = [
    { id: 'buy-hold', name: 'Buy & Hold', description: 'Simple buy and hold strategy' },
    { id: 'sma-crossover', name: 'SMA Crossover', description: '50/200 day SMA crossover strategy' },
    { id: 'rsi-oversold', name: 'RSI Oversold', description: 'Buy when RSI < 30, sell when RSI > 70' },
    { id: 'macd-signal', name: 'MACD Signal', description: 'Trade on MACD signal line crossovers' },
    { id: 'momentum', name: 'Momentum', description: 'Follow price momentum trends' },
  ];

  const popularSymbols = ['SPY', 'QQQ', 'AAPL', 'MSFT', 'NVDA', 'TSLA', 'GOOGL', 'AMZN', 'META', 'NFLX'];

  const runBacktest = async () => {
    setIsRunning(true);
    
    // Simulate backtest running
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock results
    const mockResults: BacktestResult = {
      totalReturn: Math.random() * 50000 - 10000,
      totalReturnPercent: (Math.random() - 0.3) * 100,
      sharpeRatio: Math.random() * 3,
      maxDrawdown: -Math.random() * 30,
      winRate: 40 + Math.random() * 40,
      totalTrades: Math.floor(Math.random() * 100) + 20,
      avgTrade: (Math.random() - 0.5) * 1000,
      bestTrade: Math.random() * 5000 + 500,
      worstTrade: -(Math.random() * 3000 + 300),
      volatility: Math.random() * 40 + 10,
    };
    
    setResults(mockResults);
    setIsRunning(false);
  };

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
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Strategy Backtesting</h1>
        <p className="text-text-secondary">
          Test your trading strategies against historical market data
        </p>
      </div>

      {/* Backtest Configuration */}
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4">Configure Backtest</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strategy Selection */}
          <div className="space-y-4">
            <div>
              <label className="block text-text-secondary text-sm font-semibold mb-2">
                Trading Strategy
              </label>
              <select
                value={strategy}
                onChange={(e) => setStrategy(e.target.value)}
                className="trading-input w-full cursor-pointer"
              >
                {strategies.map(strat => (
                  <option key={strat.id} value={strat.id}>
                    {strat.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-text-muted mt-1">
                {strategies.find(s => s.id === strategy)?.description}
              </p>
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-semibold mb-2">
                Symbol
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="Enter symbol"
                  className="trading-input flex-1 w-full sm:w-auto"
                />
                <select
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="trading-input cursor-pointer w-full sm:w-auto sm:min-w-[120px]"
                >
                  <option value="">Popular</option>
                  {popularSymbols.map(sym => (
                    <option key={sym} value={sym}>{sym}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-semibold mb-2">
                Initial Capital
              </label>
              <input
                type="number"
                value={initialCapital}
                onChange={(e) => setInitialCapital(Number(e.target.value))}
                className="trading-input w-full"
                min="1000"
                step="1000"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-4">
            <div>
              <label className="block text-text-secondary text-sm font-semibold mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="trading-input w-full cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-text-secondary text-sm font-semibold mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="trading-input w-full cursor-pointer"
              />
            </div>

            <div className="pt-4">
              <button
                onClick={runBacktest}
                disabled={isRunning}
                className="trading-button-primary w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRunning ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>Running Backtest...</span>
                  </div>
                ) : (
                  'Run Backtest'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      {results && (
        <div className="space-y-6">
          {/* Performance Summary */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-bold text-text-primary mb-4">Backtest Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="metric-card">
                <h3 className="text-sm font-semibold text-text-muted">Total Return</h3>
                <p className="text-xl font-bold text-text-primary">
                  {formatCurrency(results.totalReturn)}
                </p>
                <p className={`text-sm ${results.totalReturnPercent >= 0 ? 'text-success' : 'text-danger'}`}>
                  {formatPercent(results.totalReturnPercent)}
                </p>
              </div>

              <div className="metric-card">
                <h3 className="text-sm font-semibold text-text-muted">Sharpe Ratio</h3>
                <p className="text-xl font-bold text-text-primary">
                  {results.sharpeRatio.toFixed(2)}
                </p>
                <p className="text-sm text-text-secondary">Risk-adjusted return</p>
              </div>

              <div className="metric-card">
                <h3 className="text-sm font-semibold text-text-muted">Max Drawdown</h3>
                <p className="text-xl font-bold text-danger">
                  {formatPercent(results.maxDrawdown)}
                </p>
                <p className="text-sm text-text-secondary">Largest loss period</p>
              </div>

              <div className="metric-card">
                <h3 className="text-sm font-semibold text-text-muted">Win Rate</h3>
                <p className="text-xl font-bold text-text-primary">
                  {results.winRate.toFixed(1)}%
                </p>
                <p className="text-sm text-text-secondary">Winning trades</p>
              </div>
            </div>
          </div>

          {/* Detailed Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">Trade Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Trades</span>
                  <span className="text-text-primary font-semibold">{results.totalTrades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Average Trade</span>
                  <span className={`font-semibold ${results.avgTrade >= 0 ? 'text-success' : 'text-danger'}`}>
                    {formatCurrency(results.avgTrade)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Best Trade</span>
                  <span className="text-success font-semibold">
                    {formatCurrency(results.bestTrade)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Worst Trade</span>
                  <span className="text-danger font-semibold">
                    {formatCurrency(results.worstTrade)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Volatility</span>
                  <span className="text-text-primary font-semibold">
                    {results.volatility.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6">
              <h3 className="text-lg font-bold text-text-primary mb-4">Strategy Parameters</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Strategy</span>
                  <span className="text-text-primary font-semibold">
                    {strategies.find(s => s.id === strategy)?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Symbol</span>
                  <span className="text-text-primary font-semibold">{symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Period</span>
                  <span className="text-text-primary font-semibold">
                    {startDate} to {endDate}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Initial Capital</span>
                  <span className="text-text-primary font-semibold">
                    {formatCurrency(initialCapital)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Final Value</span>
                  <span className="text-text-primary font-semibold">
                    {formatCurrency(initialCapital + results.totalReturn)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Comparison with Current Portfolio */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-text-primary mb-4">Portfolio Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-text-secondary font-semibold mb-2">Backtest Strategy</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Return</span>
                    <span className={`font-semibold ${results.totalReturnPercent >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatPercent(results.totalReturnPercent)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Sharpe</span>
                    <span className="text-text-primary">{results.sharpeRatio.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-text-secondary font-semibold mb-2">Current Portfolio</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Return</span>
                    <span className={`font-semibold ${portfolio.totalReturnPercent >= 0 ? 'text-success' : 'text-danger'}`}>
                      {formatPercent(portfolio.totalReturnPercent)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Value</span>
                    <span className="text-text-primary">{formatCurrency(portfolio.totalValue)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="glass-panel p-6">
        <h3 className="text-lg font-bold text-text-primary mb-4">Strategy Descriptions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strategies.map(strat => (
            <div key={strat.id} className="border border-bg-accent/30 rounded-lg p-4">
              <h4 className="font-semibold text-text-primary mb-2">{strat.name}</h4>
              <p className="text-sm text-text-secondary">{strat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Backtest;