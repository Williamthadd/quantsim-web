// Use environment variable for API base URL, fallback to localhost for development
const BASE_URL = import.meta.env.PROD 
  ? '/api'  // In production, API is served from same origin
  : 'http://localhost:3001/api';  // In development, connect to local backend

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

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      // Add cache busting parameter to prevent browser caching
      const separator = endpoint.includes('?') ? '&' : '?';
      const cacheBuster = `${separator}_t=${Date.now()}`;
      
      const response = await fetch(`${BASE_URL}${endpoint}${cacheBuster}`, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          ...options?.headers
        },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async searchStocks(query: string): Promise<SearchResult[]> {
    try {
      console.log(`📞 API: Searching for "${query}"`);
      const endpoint = `/search?q=${encodeURIComponent(query)}`;
      console.log(`🌐 API: Calling endpoint: ${endpoint}`);
      
      const data = await this.request<SearchResult[]>(endpoint);
      
      console.log(`📊 API: Got ${data.length || 0} results for "${query}"`);
      if (data && data.length > 0) {
        console.log(`📊 API: First result: ${data[0].symbol} - ${data[0].name}`);
      }
      
      return data || [];
    } catch (error) {
      console.error(`🚨 API: Stock search failed for "${query}":`, error);
      return [];
    }
  }

  async getStockQuote(symbol: string): Promise<QuoteData | null> {
    try {
      const data = await this.request<QuoteData>(`/quote/${symbol}`);
      return data;
    } catch (error) {
      console.error('Stock quote failed:', error);
      return null;
    }
  }

  async getIntradayData(symbol: string, interval: string = '5min') {
    try {
      const data = await this.request(`/intraday/${symbol}?interval=${interval}`);
      return data;
    } catch (error) {
      console.error('Intraday data failed:', error);
      return null;
    }
  }

  async getCompanyProfile(symbol: string) {
    try {
      const data = await this.request(`/profile/${symbol}`);
      return data;
    } catch (error) {
      console.error('Company profile failed:', error);
      return null;
    }
  }

  async getNews(symbol?: string) {
    try {
      const endpoint = symbol ? `/news/${symbol}` : '/news';
      const data = await this.request(endpoint);
      return data;
    } catch (error) {
      console.error('News fetch failed:', error);
      return null;
    }
  }

  async getTechnicalIndicator(symbol: string, indicator: string, interval: string = 'daily') {
    try {
      const data = await this.request(`/indicators/${symbol}/${indicator}?interval=${interval}`);
      return data;
    } catch (error) {
      console.error('Technical indicator failed:', error);
      return null;
    }
  }

  async healthCheck() {
    try {
      const data = await this.request('/health');
      return data;
    } catch (error) {
      console.error('Health check failed:', error);
      return null;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();