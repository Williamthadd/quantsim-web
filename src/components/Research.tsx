import React, { useState } from 'react';
import { useStore } from '../store/useStore';

const Research: React.FC = () => {
  const { selectStock, setActiveTab } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');

  const sectors = [
    'all',
    'technology',
    'healthcare',
    'financial',
    'energy',
    'consumer',
    'industrial',
    'materials',
    'utilities',
    'real-estate'
  ];

  const marketAnalysis = [
    {
      title: 'Market Overview',
      items: [
        { label: 'S&P 500', value: '4,783.45', change: '+0.85%', positive: true },
        { label: 'NASDAQ', value: '15,049.32', change: '+1.24%', positive: true },
        { label: 'DOW', value: '37,689.54', change: '+0.43%', positive: true },
        { label: 'VIX', value: '12.34', change: '-2.15%', positive: false },
      ]
    },
    {
      title: 'Top Gainers',
      items: [
        { label: 'NVDA', value: '$875.43', change: '+8.45%', positive: true },
        { label: 'AMD', value: '$198.76', change: '+6.23%', positive: true },
        { label: 'TSLA', value: '$248.91', change: '+5.67%', positive: true },
        { label: 'AAPL', value: '$195.32', change: '+4.12%', positive: true },
      ]
    },
    {
      title: 'Top Losers',
      items: [
        { label: 'META', value: '$512.78', change: '-3.45%', positive: false },
        { label: 'NFLX', value: '$489.23', change: '-2.87%', positive: false },
        { label: 'GOOGL', value: '$142.65', change: '-2.34%', positive: false },
        { label: 'AMZN', value: '$153.89', change: '-1.98%', positive: false },
      ]
    }
  ];

  const trendingStocks = [
    { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology', volume: '45.2M' },
    { symbol: 'TSLA', name: 'Tesla Inc', sector: 'Consumer', volume: '38.7M' },
    { symbol: 'AAPL', name: 'Apple Inc', sector: 'Technology', volume: '42.1M' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology', volume: '28.3M' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', sector: 'Technology', volume: '55.8M' },
    { symbol: 'META', name: 'Meta Platforms Inc', sector: 'Technology', volume: '19.4M' },
  ];

  const handleStockClick = async (symbol: string, name: string) => {
    // Mock stock data for research view
    const mockStock = {
      symbol,
      name,
      price: Math.random() * 500 + 50,
      change: (Math.random() - 0.5) * 20,
      changePercent: (Math.random() - 0.5) * 10,
      volume: Math.floor(Math.random() * 50000000) + 1000000,
    };
    
    selectStock(mockStock);
    setActiveTab('stock-detail');
  };

  const filteredStocks = trendingStocks.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stock.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = selectedSector === 'all' || stock.sector.toLowerCase() === selectedSector;
    return matchesSearch && matchesSector;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Market Research</h1>
        <p className="text-text-secondary">
          Comprehensive market analysis and stock research tools
        </p>
      </div>

      {/* Market Analysis Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {marketAnalysis.map((section) => (
          <div key={section.title} className="glass-panel p-6">
            <h2 className="text-lg font-bold text-text-primary mb-4">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">{item.label}</span>
                  <div className="text-right">
                    <div className="text-text-primary font-semibold text-sm">{item.value}</div>
                    <div className={`text-xs ${item.positive ? 'text-success' : 'text-danger'}`}>
                      {item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search stocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="trading-input w-full"
            />
          </div>
          <div className="md:w-48">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="trading-input w-full cursor-pointer"
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>
                  {sector.charAt(0).toUpperCase() + sector.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Trending Stocks */}
        <h2 className="text-xl font-bold text-text-primary mb-4">Trending Stocks</h2>
        <div className="space-y-3">
          {filteredStocks.map((stock) => (
            <div
              key={stock.symbol}
              onClick={() => handleStockClick(stock.symbol, stock.name)}
              className="flex items-center justify-between p-4 rounded-lg border border-bg-accent/30 hover:border-bg-accent/60 hover:bg-bg-accent/20 transition-all cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="font-bold text-text-primary">{stock.symbol}</h3>
                  <span className="text-sm text-text-secondary">{stock.name}</span>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-xs text-text-muted">{stock.sector}</span>
                  <span className="text-xs text-text-muted">Volume: {stock.volume}</span>
                </div>
              </div>
              <div className="text-primary text-sm font-semibold">
                View Details →
              </div>
            </div>
          ))}
        </div>

        {filteredStocks.length === 0 && (
          <div className="text-center py-8">
            <p className="text-text-muted">No stocks match your search criteria</p>
          </div>
        )}
      </div>

      {/* Economic Indicators */}
      <div className="glass-panel p-6">
        <h2 className="text-xl font-bold text-text-primary mb-4">Economic Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="metric-card">
            <h3 className="text-sm font-semibold text-text-muted">10Y Treasury</h3>
            <p className="text-xl font-bold text-text-primary">4.23%</p>
            <p className="text-sm text-success">+0.05%</p>
          </div>
          <div className="metric-card">
            <h3 className="text-sm font-semibold text-text-muted">USD Index</h3>
            <p className="text-xl font-bold text-text-primary">103.45</p>
            <p className="text-sm text-danger">-0.23%</p>
          </div>
          <div className="metric-card">
            <h3 className="text-sm font-semibold text-text-muted">Gold</h3>
            <p className="text-xl font-bold text-text-primary">$2,043</p>
            <p className="text-sm text-success">+0.78%</p>
          </div>
          <div className="metric-card">
            <h3 className="text-sm font-semibold text-text-muted">Oil (WTI)</h3>
            <p className="text-xl font-bold text-text-primary">$73.21</p>
            <p className="text-sm text-success">+1.24%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;