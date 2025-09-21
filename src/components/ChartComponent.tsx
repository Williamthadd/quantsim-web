import React, { useEffect, useRef, useState } from 'react';
import { type Stock } from '../store/useStore';
import { TechnicalAnalysisService, type TechnicalIndicators } from '../services/technicalAnalysis';

interface ChartComponentProps {
  stock: Stock;
  height?: number;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ stock, height = 300 }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [indicators, setIndicators] = useState<TechnicalIndicators | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.innerHTML = '';
    
    // Calculate technical indicators
    const calculatedIndicators = TechnicalAnalysisService.calculateIndicators(stock.price);
    setIndicators(calculatedIndicators);
    
    // Create chart with proper date/price data
    const chartData = generateRealisticChartData(stock.price);
    createStockChart(chartRef.current, chartData, height);
  }, [stock, height]);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-bold text-text-primary">{stock.symbol}</h3>
          <p className="text-xs sm:text-sm text-text-secondary truncate">{stock.name}</p>
        </div>
        <div className="text-left sm:text-right flex-shrink-0">
          <p className="text-lg sm:text-xl font-bold text-text-primary">
            ${stock.price.toFixed(2)}
          </p>
          <p className={`text-xs sm:text-sm ${
            stock.changePercent >= 0 ? 'text-success' : 'text-danger'
          }`}>
            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
          </p>
        </div>
      </div>

      <div 
        ref={chartRef} 
        className="w-full bg-bg-accent/10 rounded-lg border border-bg-accent/30 overflow-hidden"
        style={{ height: `${Math.max(250, height)}px` }}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="glass-panel p-2 sm:p-3">
          <p className="text-xs text-text-muted mb-1">RSI (14)</p>
          <p className="text-base sm:text-lg font-bold text-text-primary">
            {indicators ? indicators.rsi.toFixed(2) : '--'}
          </p>
          <p className={`text-xs ${
            indicators && indicators.rsi > 70 ? 'text-danger' :
            indicators && indicators.rsi < 30 ? 'text-success' : 'text-text-secondary'
          }`}>
            {indicators && indicators.rsi > 70 ? 'Overbought' :
             indicators && indicators.rsi < 30 ? 'Oversold' : 'Neutral'}
          </p>
        </div>
        <div className="glass-panel p-2 sm:p-3">
          <p className="text-xs text-text-muted mb-1">MACD</p>
          <p className="text-base sm:text-lg font-bold text-text-primary">
            {indicators ? indicators.macd.macd.toFixed(3) : '--'}
          </p>
          <p className={`text-xs ${
            indicators && indicators.macd.histogram > 0 ? 'text-success' : 'text-danger'
          }`}>
            Signal: {indicators ? indicators.macd.signal.toFixed(3) : '--'}
          </p>
        </div>
        <div className="glass-panel p-2 sm:p-3">
          <p className="text-xs text-text-muted mb-1">Volume</p>
          <p className="text-base sm:text-lg font-bold text-text-primary">
            {stock.volume ? stock.volume.toLocaleString() : '--'}
          </p>
          <p className="text-xs text-text-secondary">Daily volume</p>
        </div>
      </div>
    </div>
  );
};

function generateRealisticChartData(currentPrice: number) {
  const data = [];
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  let price = currentPrice;
  
  // Generate 30 days of realistic price data
  for (let i = 30; i >= 0; i--) {
    const time = now - (i * oneDay);
    
    // Add some realistic price movement
    const volatility = currentPrice * 0.02;
    const trend = (Math.random() - 0.5) * 0.001; // Slight trending
    const randomChange = (Math.random() - 0.5) * volatility + trend;
    
    price = Math.max(0, price + randomChange);
    
    data.push({
      time: new Date(time),
      value: price,
      date: new Date(time).toLocaleDateString()
    });
  }
  
  return data;
}

function createStockChart(container: HTMLElement, data: Array<{time: Date, value: number, date: string}>, height: number) {
  const width = container.offsetWidth || 800;
  const padding = 50;
  
  const minPrice = Math.min(...data.map(d => d.value));
  const maxPrice = Math.max(...data.map(d => d.value));
  const priceRange = maxPrice - minPrice;
  
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());
  svg.setAttribute('class', 'w-full h-full');
  
  // Create grid lines
  const gridGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  gridGroup.setAttribute('class', 'grid');
  
  // Horizontal grid lines (price levels)
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i / 5) * (height - 2 * padding);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', padding.toString());
    line.setAttribute('y1', y.toString());
    line.setAttribute('x2', (width - padding).toString());
    line.setAttribute('y2', y.toString());
    line.setAttribute('stroke', '#334155');
    line.setAttribute('stroke-width', '0.5');
    line.setAttribute('opacity', '0.3');
    gridGroup.appendChild(line);
    
    // Price labels
    const priceValue = maxPrice - (i / 5) * priceRange;
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', (padding - 10).toString());
    text.setAttribute('y', (y + 4).toString());
    text.setAttribute('text-anchor', 'end');
    text.setAttribute('font-size', '10');
    text.setAttribute('fill', '#94a3b8');
    text.textContent = `$${priceValue.toFixed(2)}`;
    gridGroup.appendChild(text);
  }
  
  // Vertical grid lines (dates)
  const dateInterval = Math.floor(data.length / 6);
  for (let i = 0; i < data.length; i += dateInterval) {
    const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x.toString());
    line.setAttribute('y1', padding.toString());
    line.setAttribute('x2', x.toString());
    line.setAttribute('y2', (height - padding).toString());
    line.setAttribute('stroke', '#334155');
    line.setAttribute('stroke-width', '0.5');
    line.setAttribute('opacity', '0.3');
    gridGroup.appendChild(line);
    
    // Date labels
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', x.toString());
    text.setAttribute('y', (height - padding + 15).toString());
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '10');
    text.setAttribute('fill', '#94a3b8');
    text.textContent = data[i].date.split('/').slice(0, 2).join('/');
    gridGroup.appendChild(text);
  }
  
  svg.appendChild(gridGroup);
  
  // Create price line with gradient fill
  const pathData = data.map((point, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((point.value - minPrice) / priceRange) * (height - 2 * padding);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
  
  // Create gradient definition
  const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
  gradient.setAttribute('id', 'priceGradient');
  gradient.setAttribute('x1', '0%');
  gradient.setAttribute('y1', '0%');
  gradient.setAttribute('x2', '0%');
  gradient.setAttribute('y2', '100%');
  
  const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop1.setAttribute('offset', '0%');
  stop1.setAttribute('stop-color', '#3b82f6');
  stop1.setAttribute('stop-opacity', '0.3');
  
  const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
  stop2.setAttribute('offset', '100%');
  stop2.setAttribute('stop-color', '#3b82f6');
  stop2.setAttribute('stop-opacity', '0.05');
  
  gradient.appendChild(stop1);
  gradient.appendChild(stop2);
  defs.appendChild(gradient);
  svg.appendChild(defs);
  
  // Create filled area
  const areaPath = pathData + ` L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;
  const area = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  area.setAttribute('d', areaPath);
  area.setAttribute('fill', 'url(#priceGradient)');
  svg.appendChild(area);
  
  // Create price line
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', pathData);
  path.setAttribute('stroke', '#3b82f6');
  path.setAttribute('stroke-width', '2');
  path.setAttribute('fill', 'none');
  
  svg.appendChild(path);
  
  // Add interactive points
  data.forEach((point, index) => {
    const x = padding + (index / (data.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((point.value - minPrice) / priceRange) * (height - 2 * padding);
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x.toString());
    circle.setAttribute('cy', y.toString());
    circle.setAttribute('r', '3');
    circle.setAttribute('fill', '#3b82f6');
    circle.setAttribute('stroke', '#1e293b');
    circle.setAttribute('stroke-width', '2');
    circle.setAttribute('opacity', '0');
    circle.setAttribute('class', 'hover:opacity-100 transition-opacity cursor-pointer');
    
    // Add tooltip
    const tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    tooltip.textContent = `${point.date}: $${point.value.toFixed(2)}`;
    circle.appendChild(tooltip);
    
    svg.appendChild(circle);
  });
  
  container.appendChild(svg);
}

export default ChartComponent;