export interface SearchResult {
  symbol: string;
  name: string;
  type: string;
  region: string;
}

export interface QuoteData {
  'Meta Data': {
    '1. Information': string;
    '2. Symbol': string;
    '3. Last Refreshed': string;
    '4. Output Size': string;
    '5. Time Zone': string;
  };
  'Time Series (Daily)': {
    [date: string]: {
      '1. open': string;
      '2. high': string;
      '3. low': string;
      '4. close': string;
      '5. volume': string;
    };
  };
}

// Local stock data - no backend required
const stockList: SearchResult[] = [
  // Tech Giants
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', type: 'Equity', region: 'USD' },
  { symbol: 'GOOGL', name: 'Alphabet Inc. Class A', type: 'Equity', region: 'USD' },
  { symbol: 'GOOG', name: 'Alphabet Inc. Class C', type: 'Equity', region: 'USD' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'TSLA', name: 'Tesla Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'META', name: 'Meta Platforms Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', type: 'Equity', region: 'USD' },
  { symbol: 'NFLX', name: 'Netflix Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'CRM', name: 'Salesforce Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'ORCL', name: 'Oracle Corporation', type: 'Equity', region: 'USD' },
  { symbol: 'ADBE', name: 'Adobe Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'INTC', name: 'Intel Corporation', type: 'Equity', region: 'USD' },
  { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'UBER', name: 'Uber Technologies Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'SNAP', name: 'Snap Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'SPOT', name: 'Spotify Technology S.A.', type: 'Equity', region: 'USD' },
  { symbol: 'ZM', name: 'Zoom Video Communications Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'SHOP', name: 'Shopify Inc.', type: 'Equity', region: 'USD' },
  
  // Financial Services
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', type: 'Equity', region: 'USD' },
  { symbol: 'BAC', name: 'Bank of America Corporation', type: 'Equity', region: 'USD' },
  { symbol: 'WFC', name: 'Wells Fargo & Company', type: 'Equity', region: 'USD' },
  { symbol: 'V', name: 'Visa Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'MA', name: 'Mastercard Incorporated', type: 'Equity', region: 'USD' },
  
  // Healthcare & Pharma
  { symbol: 'JNJ', name: 'Johnson & Johnson', type: 'Equity', region: 'USD' },
  { symbol: 'PFE', name: 'Pfizer Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'UNH', name: 'UnitedHealth Group Incorporated', type: 'Equity', region: 'USD' },
  
  // Consumer & Retail
  { symbol: 'WMT', name: 'Walmart Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'HD', name: 'The Home Depot Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'PG', name: 'The Procter & Gamble Company', type: 'Equity', region: 'USD' },
  { symbol: 'KO', name: 'The Coca-Cola Company', type: 'Equity', region: 'USD' },
  { symbol: 'PEP', name: 'PepsiCo Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'NKE', name: 'NIKE Inc.', type: 'Equity', region: 'USD' },
  { symbol: 'MCD', name: 'McDonald\'s Corporation', type: 'Equity', region: 'USD' },
  { symbol: 'DIS', name: 'The Walt Disney Company', type: 'Equity', region: 'USD' },
  
  // ETFs
  { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', type: 'ETF', region: 'USD' },
  { symbol: 'QQQ', name: 'Invesco QQQ Trust', type: 'ETF', region: 'USD' },
  { symbol: 'VTI', name: 'Vanguard Total Stock Market ETF', type: 'ETF', region: 'USD' }
];

// Generate realistic price for a stock symbol
function generateStockPrice(symbol: string): number {
  const basePrices: Record<string, number> = {
    'AAPL': 185, 'MSFT': 378, 'GOOGL': 138, 'AMZN': 155, 'TSLA': 248,
    'META': 315, 'NVDA': 875, 'NFLX': 485, 'JPM': 168, 'V': 265,
    'WMT': 164, 'HD': 345, 'PG': 155, 'KO': 59, 'PEP': 171,
    'SPY': 450, 'QQQ': 385, 'VTI': 245
  };
  
  const basePrice = basePrices[symbol] || 100 + Math.random() * 300;
  const volatility = 0.05; // 5% daily volatility
  const randomChange = (Math.random() - 0.5) * 2 * volatility;
  
  return basePrice * (1 + randomChange);
}

// Generate historical price data
function generateHistoricalData(symbol: string, days: number = 100): QuoteData {
  const data: Record<string, any> = {};
  const currentPrice = generateStockPrice(symbol);
  let price = currentPrice;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add realistic price movement
    const dailyChange = (Math.random() - 0.5) * 0.04; // 4% max daily change
    price = Math.max(price * (1 + dailyChange), 1);
    
    const timestamp = date.toISOString().split('T')[0];
    data[timestamp] = {
      '1. open': (price * 0.99).toFixed(2),
      '2. high': (price * 1.02).toFixed(2),
      '3. low': (price * 0.98).toFixed(2),
      '4. close': price.toFixed(2),
      '5. volume': Math.floor(1000000 + Math.random() * 50000000).toString()
    };
  }
  
  return {
    'Meta Data': {
      '1. Information': 'Daily Prices (open, high, low, close) and Volumes',
      '2. Symbol': symbol.toUpperCase(),
      '3. Last Refreshed': new Date().toISOString().split('T')[0],
      '4. Output Size': 'Compact',
      '5. Time Zone': 'US/Eastern'
    },
    'Time Series (Daily)': data
  };
}

// Generate company profile
function generateCompanyProfile(symbol: string) {
  const stockInfo = stockList.find(s => s.symbol === symbol);
  
  return [{
    symbol: symbol,
    companyName: stockInfo?.name || `${symbol} Company`,
    industry: 'Technology',
    website: `https://www.${symbol.toLowerCase()}.com`,
    description: `${symbol} is a leading company in its sector with strong market presence.`,
    ceo: 'John Doe',
    sector: 'Technology',
    country: 'US',
    fullTimeEmployees: '50000',
    price: generateStockPrice(symbol),
    beta: 1.0 + (Math.random() - 0.5) * 0.5,
    volAvg: Math.floor(1000000 + Math.random() * 50000000),
    mktCap: Math.floor(10000000000 + Math.random() * 500000000000),
    lastDiv: Math.random() * 5,
    range: '100-200',
    changes: (Math.random() - 0.5) * 10,
    currency: 'USD',
    exchange: 'NASDAQ Global Select',
    exchangeShortName: 'NASDAQ',
    isEtf: false,
    isActivelyTrading: true,
    isAdr: false,
    isFund: false
  }];
}

// Generate news data
function generateNewsData(symbol: string = '') {
  const sampleNews = [
    {
      source: { id: 'financial-post', name: 'Financial Post' },
      author: 'John Smith',
      title: `${symbol || 'Market'} Shows Strong Performance Amid Economic Uncertainty`,
      description: `Latest analysis shows ${symbol || 'the market'} continuing its upward trend despite global economic challenges.`,
      url: 'https://example.com/news/1',
      urlToImage: 'https://via.placeholder.com/400x200/1a202c/ffffff?text=Financial+News',
      publishedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      content: `Detailed analysis of ${symbol || 'market'} performance and future outlook...`
    },
    {
      source: { id: 'reuters', name: 'Reuters' },
      author: 'Jane Doe',
      title: `Analysts Upgrade ${symbol || 'Tech Sector'} Rating Following Strong Earnings`,
      description: `Major investment firms have upgraded their ratings following better-than-expected quarterly results.`,
      url: 'https://example.com/news/2',
      urlToImage: 'https://via.placeholder.com/400x200/2d3748/ffffff?text=Business+News',
      publishedAt: new Date(Date.now() - Math.random() * 172800000).toISOString(),
      content: `Investment analysts are optimistic about future growth prospects...`
    }
  ];
  
  return {
    status: 'ok',
    totalResults: sampleNews.length,
    articles: sampleNews
  };
}

// Generate technical indicators
function generateTechnicalIndicators(symbol: string, indicator: string) {
  const values: Record<string, any> = {};
  const now = new Date();
  
  for (let i = 50; i >= 0; i--) {
    const date = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const dateString = date.toISOString().split('T')[0];
    
    switch (indicator.toUpperCase()) {
      case 'RSI':
        values[dateString] = {
          'RSI': (30 + Math.random() * 40).toFixed(4) // RSI between 30-70
        };
        break;
      case 'MACD':
        const macd = (Math.random() - 0.5) * 2;
        values[dateString] = {
          'MACD': macd.toFixed(4),
          'MACD_Signal': (macd * 0.8).toFixed(4),
          'MACD_Hist': (macd * 0.2).toFixed(4)
        };
        break;
      case 'SMA':
        values[dateString] = {
          'SMA': (generateStockPrice(symbol) * (0.95 + Math.random() * 0.1)).toFixed(4)
        };
        break;
    }
  }
  
  const responseKey = `Technical Analysis: ${indicator}`;
  return {
    'Meta Data': {
      '1: Symbol': symbol,
      '2: Indicator': `${indicator}(14,close)`,
      '3: Last Refreshed': now.toISOString().split('T')[0],
      '4: Interval': 'daily',
      '5: Time Period': 14,
      '6: Series Type': 'close',
      '7: Time Zone': 'US/Eastern'
    },
    [responseKey]: values
  };
}

class ApiService {
  async searchStocks(query: string): Promise<SearchResult[]> {
    if (!query || query.length < 2) {
      return [];
    }

    // Filter stocks based on query (case-insensitive)
    const searchQuery = query.toLowerCase().trim();
    const filteredStocks = stockList.filter(stock => 
      stock.symbol.toLowerCase().includes(searchQuery) || 
      stock.name.toLowerCase().includes(searchQuery)
    );
    
    // Return first 10 results
    return filteredStocks.slice(0, 10);
  }

  async getStockQuote(symbol: string): Promise<QuoteData | null> {
    return generateHistoricalData(symbol.toUpperCase());
  }

  async getIntradayData(symbol: string, interval: string = '5min') {
    const data: Record<string, any> = {};
    const currentPrice = generateStockPrice(symbol);
    let price = currentPrice;
    const now = new Date();
    
    // Generate last 7 hours of trading data (5-minute intervals)
    for (let i = 84; i >= 0; i--) {
      const time = new Date(now.getTime() - (i * 5 * 60 * 1000));
      const timeString = time.toISOString().slice(0, 16) + ':00';
      
      const change = (Math.random() - 0.5) * 0.01; // 1% max change per 5min
      price = Math.max(price * (1 + change), 1);
      
      data[timeString] = {
        '1. open': (price * 0.999).toFixed(4),
        '2. high': (price * 1.001).toFixed(4),
        '3. low': (price * 0.999).toFixed(4),
        '4. close': price.toFixed(4),
        '5. volume': Math.floor(10000 + Math.random() * 100000).toString()
      };
    }
    
    return {
      'Meta Data': {
        '1. Information': `Intraday (${interval}) open, high, low, close prices and volume`,
        '2. Symbol': symbol.toUpperCase(),
        '3. Last Refreshed': new Date().toISOString(),
        '4. Interval': interval,
        '5. Output Size': 'Compact',
        '6. Time Zone': 'US/Eastern'
      },
      [`Time Series (${interval})`]: data
    };
  }

  async getCompanyProfile(symbol: string) {
    return generateCompanyProfile(symbol.toUpperCase());
  }

  async getNews(symbol?: string) {
    return generateNewsData(symbol?.toUpperCase());
  }

  async getTechnicalIndicator(symbol: string, indicator: string) {
    return generateTechnicalIndicators(symbol.toUpperCase(), indicator);
  }

  async healthCheck() {
    return {
      status: 'OK',
      message: 'QuantSimulate Running with Local Data',
      timestamp: new Date().toISOString(),
      dataSource: 'Local Frontend Data'
    };
  }
}

// Export singleton instance
export const apiService = new ApiService();