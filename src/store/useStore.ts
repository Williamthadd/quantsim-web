import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types
export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume?: number;
  marketCap?: number;
}

export interface Position {
  symbol: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  marketValue: number;
  totalReturn: number;
  totalReturnPercent: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  total: number;
  timestamp: Date;
}

export interface Portfolio {
  cash: number;
  totalValue: number;
  totalReturn: number;
  totalReturnPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface UserSession {
  initialCapital: number;
  startDate: Date;
}

interface AppState {
  // User Session
  userSession: UserSession | null;
  setUserSession: (session: UserSession) => void;
  
  // Portfolio
  portfolio: Portfolio;
  positions: Position[];
  transactions: Transaction[];
  watchlist: Stock[];
  
  // Current Market Data
  selectedStock: Stock | null;
  stockData: Record<string, any>;
  
  // UI State
  isLoading: boolean;
  activeTab: string;
  sidebarOpen: boolean;
  
  // Actions
  initializePortfolio: (initialCapital: number) => void;
  addToWatchlist: (stock: Stock) => void;
  removeFromWatchlist: (symbol: string) => void;
  selectStock: (stock: Stock | null) => void;
  setStockData: (symbol: string, data: any) => void;
  executeTrade: (symbol: string, type: 'BUY' | 'SELL', shares: number, price: number) => void;
  updatePositionPrices: (priceUpdates: Record<string, number>) => void;
  setLoading: (loading: boolean) => void;
  setActiveTab: (tab: string) => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Computed values
  getPosition: (symbol: string) => Position | undefined;
  getPortfolioMetrics: () => {
    sharpeRatio: number;
    maxDrawdown: number;
    beta: number;
    volatility: number;
  };
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial State
      userSession: null,
      portfolio: {
        cash: 0,
        totalValue: 0,
        totalReturn: 0,
        totalReturnPercent: 0,
        dayChange: 0,
        dayChangePercent: 0,
      },
      positions: [],
      transactions: [],
      watchlist: [],
      selectedStock: null,
      stockData: {},
      isLoading: false,
      activeTab: 'dashboard',
      sidebarOpen: true,

      // Actions
      setUserSession: (session) => set({ userSession: session }),

      initializePortfolio: (initialCapital) => {
        set({
          portfolio: {
            cash: initialCapital,
            totalValue: initialCapital,
            totalReturn: 0,
            totalReturnPercent: 0,
            dayChange: 0,
            dayChangePercent: 0,
          },
          positions: [],
          transactions: [],
          userSession: {
            initialCapital,
            startDate: new Date(),
          },
        });
      },

      addToWatchlist: (stock) => {
        const { watchlist } = get();
        if (!watchlist.find(s => s.symbol === stock.symbol)) {
          set({ watchlist: [...watchlist, stock] });
        }
      },

      removeFromWatchlist: (symbol) => {
        const { watchlist } = get();
        set({ watchlist: watchlist.filter(s => s.symbol !== symbol) });
      },

      selectStock: (stock) => set({ selectedStock: stock }),

      setStockData: (symbol, data) => {
        const { stockData } = get();
        set({ stockData: { ...stockData, [symbol]: data } });
      },

      executeTrade: (symbol, type, shares, price) => {
        const { portfolio, positions, transactions, userSession } = get();
        const total = shares * price;
        
        if (!userSession) return;

        // Check if we have enough cash for buy orders
        if (type === 'BUY' && portfolio.cash < total) {
          throw new Error('Insufficient funds');
        }

        // Check if we have enough shares for sell orders
        const currentPosition = positions.find(p => p.symbol === symbol);
        if (type === 'SELL' && (!currentPosition || currentPosition.shares < shares)) {
          throw new Error('Insufficient shares');
        }

        // Create transaction
        const transaction: Transaction = {
          id: Date.now().toString(),
          symbol,
          type,
          shares,
          price,
          total,
          timestamp: new Date(),
        };

        // Update portfolio
        const newCash = type === 'BUY' ? portfolio.cash - total : portfolio.cash + total;
        
        // Update positions
        let newPositions = [...positions];
        const existingPositionIndex = positions.findIndex(p => p.symbol === symbol);

        if (type === 'BUY') {
          if (existingPositionIndex >= 0) {
            // Add to existing position
            const existing = positions[existingPositionIndex];
            const newShares = existing.shares + shares;
            const newAvgPrice = ((existing.shares * existing.avgPrice) + total) / newShares;
            
            newPositions[existingPositionIndex] = {
              ...existing,
              shares: newShares,
              avgPrice: newAvgPrice,
              currentPrice: price,
              marketValue: newShares * price,
              totalReturn: (newShares * price) - (newShares * newAvgPrice),
              totalReturnPercent: ((price - newAvgPrice) / newAvgPrice) * 100,
            };
          } else {
            // Create new position
            newPositions.push({
              symbol,
              name: symbol, // This should be updated with actual company name
              shares,
              avgPrice: price,
              currentPrice: price,
              marketValue: total,
              totalReturn: 0,
              totalReturnPercent: 0,
            });
          }
        } else {
          // SELL
          if (existingPositionIndex >= 0) {
            const existing = positions[existingPositionIndex];
            const newShares = existing.shares - shares;
            
            if (newShares === 0) {
              // Remove position entirely
              newPositions.splice(existingPositionIndex, 1);
            } else {
              // Update position
              newPositions[existingPositionIndex] = {
                ...existing,
                shares: newShares,
                marketValue: newShares * price,
                totalReturn: (newShares * price) - (newShares * existing.avgPrice),
                totalReturnPercent: ((price - existing.avgPrice) / existing.avgPrice) * 100,
              };
            }
          }
        }

        // Calculate new portfolio values
        const totalPositionValue = newPositions.reduce((sum, pos) => sum + pos.marketValue, 0);
        const newTotalValue = newCash + totalPositionValue;
        const newTotalReturn = newTotalValue - userSession.initialCapital;
        const newTotalReturnPercent = (newTotalReturn / userSession.initialCapital) * 100;

        set({
          portfolio: {
            ...portfolio,
            cash: newCash,
            totalValue: newTotalValue,
            totalReturn: newTotalReturn,
            totalReturnPercent: newTotalReturnPercent,
          },
          positions: newPositions,
          transactions: [transaction, ...transactions],
        });
      },

      updatePositionPrices: (priceUpdates) => {
        const { positions, portfolio, userSession } = get();
        if (!userSession) return;

        const updatedPositions = positions.map(position => {
          const newPrice = priceUpdates[position.symbol];
          if (newPrice && newPrice !== position.currentPrice) {
            const marketValue = position.shares * newPrice;
            const totalReturn = marketValue - (position.shares * position.avgPrice);
            const totalReturnPercent = (totalReturn / (position.shares * position.avgPrice)) * 100;

            return {
              ...position,
              currentPrice: newPrice,
              marketValue,
              totalReturn,
              totalReturnPercent,
            };
          }
          return position;
        });

        // Recalculate portfolio totals
        const totalPositionValue = updatedPositions.reduce((sum, pos) => sum + pos.marketValue, 0);
        const newTotalValue = portfolio.cash + totalPositionValue;
        const newTotalReturn = newTotalValue - userSession.initialCapital;
        const newTotalReturnPercent = (newTotalReturn / userSession.initialCapital) * 100;

        set({
          positions: updatedPositions,
          portfolio: {
            ...portfolio,
            totalValue: newTotalValue,
            totalReturn: newTotalReturn,
            totalReturnPercent: newTotalReturnPercent,
          },
        });
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      // Utility functions
      getPosition: (symbol) => {
        const { positions } = get();
        return positions.find(p => p.symbol === symbol);
      },

      getPortfolioMetrics: () => {
        const { transactions, userSession } = get();
        
        // This is a simplified calculation - in a real app you'd want more sophisticated metrics
        const returns = transactions.map(t => t.type === 'BUY' ? -t.total : t.total);
        const avgReturn = returns.length > 0 ? returns.reduce((a, b) => a + b, 0) / returns.length : 0;
        const variance = returns.length > 0 
          ? returns.reduce((acc, ret) => acc + Math.pow(ret - avgReturn, 2), 0) / returns.length 
          : 0;
        const volatility = Math.sqrt(variance);
        
        return {
          sharpeRatio: volatility > 0 ? avgReturn / volatility : 0,
          maxDrawdown: 0, // Would need historical portfolio values
          beta: 1.0, // Would need market comparison
          volatility,
        };
      },
    }),
    {
      name: 'QuantSimulate-storage',
      partialize: (state) => ({
        userSession: state.userSession,
        portfolio: state.portfolio,
        positions: state.positions,
        transactions: state.transactions,
        watchlist: state.watchlist,
      }),
    }
  )
);