// Technical indicators calculation service
// This would normally call Python scripts, but for demo we'll implement in JS

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  sma20: number;
  ema12: number;
  bollinger: {
    upper: number;
    middle: number;
    lower: number;
  };
}

export class TechnicalAnalysisService {
  
  static calculateSMA(data: number[], period: number): number[] {
    if (data.length < period) return [];
    
    const sma = [];
    for (let i = period - 1; i < data.length; i++) {
      const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
      sma.push(sum / period);
    }
    return sma;
  }

  static calculateEMA(data: number[], period: number): number[] {
    if (data.length < period) return [];
    
    const alpha = 2 / (period + 1);
    const ema = [data.slice(0, period).reduce((a, b) => a + b, 0) / period];
    
    for (let i = period; i < data.length; i++) {
      const emaValue = alpha * data[i] + (1 - alpha) * ema[ema.length - 1];
      ema.push(emaValue);
    }
    return ema;
  }

  static calculateRSI(data: number[], period: number = 14): number[] {
    if (data.length < period + 1) return [];
    
    const deltas = [];
    for (let i = 1; i < data.length; i++) {
      deltas.push(data[i] - data[i - 1]);
    }
    
    const gains = deltas.map(delta => delta > 0 ? delta : 0);
    const losses = deltas.map(delta => delta < 0 ? -delta : 0);
    
    let avgGain = gains.slice(0, period).reduce((a, b) => a + b, 0) / period;
    let avgLoss = losses.slice(0, period).reduce((a, b) => a + b, 0) / period;
    
    const rsi = [];
    
    for (let i = period; i < gains.length; i++) {
      if (avgLoss === 0) {
        rsi.push(100);
      } else {
        const rs = avgGain / avgLoss;
        const rsiValue = 100 - (100 / (1 + rs));
        rsi.push(rsiValue);
      }
      
      avgGain = (avgGain * (period - 1) + gains[i]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
    }
    
    return rsi;
  }

  static calculateMACD(data: number[], fastPeriod: number = 12, slowPeriod: number = 26, signalPeriod: number = 9) {
    if (data.length < slowPeriod) return { macd: [], signal: [], histogram: [] };
    
    const fastEMA = this.calculateEMA(data, fastPeriod);
    const slowEMA = this.calculateEMA(data, slowPeriod);
    
    const startIdx = slowPeriod - fastPeriod;
    const fastEMAAligned = fastEMA.slice(startIdx);
    
    const macdLine = fastEMAAligned.map((fast, i) => fast - slowEMA[i]);
    
    const signalLine = this.calculateEMA(macdLine, signalPeriod);
    
    const histogram = [];
    const signalStart = macdLine.length - signalLine.length;
    for (let i = 0; i < signalLine.length; i++) {
      histogram.push(macdLine[signalStart + i] - signalLine[i]);
    }
    
    return {
      macd: macdLine,
      signal: signalLine,
      histogram: histogram
    };
  }

  static calculateBollingerBands(data: number[], period: number = 20, stdDev: number = 2) {
    if (data.length < period) return { upper: [], middle: [], lower: [] };
    
    const sma = this.calculateSMA(data, period);
    const upper = [];
    const lower = [];
    
    for (let i = period - 1; i < data.length; i++) {
      const subset = data.slice(i - period + 1, i + 1);
      const mean = subset.reduce((a, b) => a + b, 0) / subset.length;
      const variance = subset.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / subset.length;
      const std = Math.sqrt(variance);
      const smaVal = sma[i - period + 1];
      
      upper.push(smaVal + (stdDev * std));
      lower.push(smaVal - (stdDev * std));
    }
    
    return {
      upper,
      middle: sma,
      lower
    };
  }

  // Generate mock price data for calculations
  static generateMockPriceData(currentPrice: number, days: number = 100): number[] {
    const data = [currentPrice];
    
    for (let i = 1; i < days; i++) {
      const volatility = currentPrice * 0.02;
      const randomChange = (Math.random() - 0.5) * volatility;
      const newPrice = data[i - 1] + randomChange;
      data.push(Math.max(0, newPrice));
    }
    
    return data;
  }

  // Calculate all indicators for a stock
  static calculateIndicators(currentPrice: number): TechnicalIndicators {
    // Generate mock historical data
    const priceData = this.generateMockPriceData(currentPrice, 100);
    
    // Calculate indicators
    const rsiValues = this.calculateRSI(priceData);
    const macdData = this.calculateMACD(priceData);
    const sma20Values = this.calculateSMA(priceData, 20);
    const ema12Values = this.calculateEMA(priceData, 12);
    const bollingerData = this.calculateBollingerBands(priceData);
    
    return {
      rsi: rsiValues.length > 0 ? rsiValues[rsiValues.length - 1] : 50,
      macd: {
        macd: macdData.macd.length > 0 ? macdData.macd[macdData.macd.length - 1] : 0,
        signal: macdData.signal.length > 0 ? macdData.signal[macdData.signal.length - 1] : 0,
        histogram: macdData.histogram.length > 0 ? macdData.histogram[macdData.histogram.length - 1] : 0,
      },
      sma20: sma20Values.length > 0 ? sma20Values[sma20Values.length - 1] : currentPrice,
      ema12: ema12Values.length > 0 ? ema12Values[ema12Values.length - 1] : currentPrice,
      bollinger: {
        upper: bollingerData.upper.length > 0 ? bollingerData.upper[bollingerData.upper.length - 1] : currentPrice * 1.02,
        middle: bollingerData.middle.length > 0 ? bollingerData.middle[bollingerData.middle.length - 1] : currentPrice,
        lower: bollingerData.lower.length > 0 ? bollingerData.lower[bollingerData.lower.length - 1] : currentPrice * 0.98,
      }
    };
  }
}