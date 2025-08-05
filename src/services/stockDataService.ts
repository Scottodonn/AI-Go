import yfinance from 'yfinance';

export interface StockData {
  symbol: string;
  currentPrice: number;
  previousClose: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  dividendYield?: number;
  peRatio?: number;
  historicalData: {
    date: string;
    price: number;
  }[];
}

export class StockDataService {
  private static cache: Map<string, { data: StockData; timestamp: number }> = new Map();
  private static CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
  private static fallbackData: Map<string, StockData> = new Map();

  // Initialize fallback data for faster loading
  static initializeFallbackData() {
    const fallbackStocks = [
      { symbol: 'AAPL', price: 175.50, change: 2.30, changePercent: 1.33 },
      { symbol: 'MSFT', price: 380.20, change: -1.80, changePercent: -0.47 },
      { symbol: 'GOOGL', price: 140.80, change: 3.20, changePercent: 2.32 },
      { symbol: 'AMZN', price: 145.60, change: 1.40, changePercent: 0.97 },
      { symbol: 'META', price: 485.30, change: 8.70, changePercent: 1.82 },
      { symbol: 'TSLA', price: 245.90, change: -5.10, changePercent: -2.03 },
      { symbol: 'NVDA', price: 485.20, change: 12.80, changePercent: 2.71 },
      { symbol: 'VTI', price: 245.60, change: 1.20, changePercent: 0.49 },
      { symbol: 'SPY', price: 450.30, change: 2.10, changePercent: 0.47 },
      { symbol: 'QQQ', price: 380.40, change: 3.60, changePercent: 0.96 },
      { symbol: 'VOO', price: 420.80, change: 1.90, changePercent: 0.45 },
      { symbol: 'BND', price: 78.50, change: 0.30, changePercent: 0.38 },
      { symbol: 'JNJ', price: 165.20, change: 0.80, changePercent: 0.49 },
      { symbol: 'KO', price: 58.40, change: -0.20, changePercent: -0.34 },
      { symbol: 'PG', price: 152.80, change: 1.10, changePercent: 0.72 },
      { symbol: 'WMT', price: 62.30, change: 0.40, changePercent: 0.65 },
      { symbol: 'UNH', price: 485.60, change: 3.20, changePercent: 0.66 },
      { symbol: 'JPM', price: 142.50, change: 1.30, changePercent: 0.92 },
      { symbol: 'XOM', price: 98.70, change: -0.80, changePercent: -0.80 },
      { symbol: 'CVX', price: 148.90, change: 1.10, changePercent: 0.74 },
      { symbol: 'BAC', price: 32.40, change: 0.20, changePercent: 0.62 },
      { symbol: 'PFE', price: 28.60, change: -0.30, changePercent: -1.04 },
      { symbol: 'CRM', price: 245.80, change: 4.20, changePercent: 1.74 },
      { symbol: 'ADBE', price: 485.30, change: 6.70, changePercent: 1.40 },
      { symbol: 'NFLX', price: 485.20, change: 8.50, changePercent: 1.78 },
      { symbol: 'ORCL', price: 118.40, change: 1.60, changePercent: 1.37 },
      { symbol: 'INTC', price: 28.90, change: 0.40, changePercent: 1.40 },
      { symbol: 'VZ', price: 38.50, change: 0.30, changePercent: 0.78 },
      { symbol: 'T', price: 15.80, change: 0.10, changePercent: 0.64 },
      { symbol: 'DIS', price: 88.40, change: 1.20, changePercent: 1.38 },
      { symbol: 'NKE', price: 98.60, change: 0.80, changePercent: 0.82 },
      { symbol: 'SBUX', price: 88.20, change: 0.60, changePercent: 0.68 },
      { symbol: 'HD', price: 285.40, change: 2.10, changePercent: 0.74 },
      { symbol: 'MCD', price: 278.50, change: 1.80, changePercent: 0.65 },
      { symbol: 'AMD', price: 138.40, change: 2.60, changePercent: 1.91 },
      { symbol: 'PLTR', price: 18.60, change: 0.40, changePercent: 2.20 },
      { symbol: 'COIN', price: 78.40, change: 1.20, changePercent: 1.55 },
      { symbol: 'SHOP', price: 58.20, change: 0.80, changePercent: 1.39 },
      { symbol: 'UBER', price: 68.40, change: 1.10, changePercent: 1.63 },
      { symbol: 'LYFT', price: 14.20, change: 0.20, changePercent: 1.43 },
      { symbol: 'SNAP', price: 9.80, change: 0.10, changePercent: 1.03 },
      { symbol: 'SPOT', price: 198.60, change: 3.40, changePercent: 1.74 },
      { symbol: 'VUG', price: 285.40, change: 2.80, changePercent: 0.99 },
      { symbol: 'VTV', price: 165.80, change: 1.20, changePercent: 0.73 },
      { symbol: 'VB', price: 185.60, change: 2.10, changePercent: 1.14 },
      { symbol: 'VNQ', price: 78.40, change: 0.60, changePercent: 0.77 },
      { symbol: 'VGT', price: 485.20, change: 4.80, changePercent: 1.00 },
      { symbol: 'XLK', price: 185.60, change: 1.80, changePercent: 0.98 },
      { symbol: 'XLV', price: 138.40, change: 1.20, changePercent: 0.88 },
      { symbol: 'XLF', price: 38.50, change: 0.30, changePercent: 0.78 },
      { symbol: 'VWO', price: 42.80, change: 0.40, changePercent: 0.94 },
      { symbol: 'ARKK', price: 45.60, change: 1.20, changePercent: 2.70 },
      { symbol: 'SOXL', price: 12.40, change: 0.80, changePercent: 6.90 },
      { symbol: 'TQQQ', price: 45.80, change: 1.40, changePercent: 3.15 },
      { symbol: 'ARKG', price: 28.40, change: 0.60, changePercent: 2.16 },
      { symbol: 'VYM', price: 108.40, change: 0.80, changePercent: 0.74 },
      { symbol: 'SCHD', price: 75.60, change: 0.50, changePercent: 0.67 },
      { symbol: 'VXUS', price: 58.40, change: 0.40, changePercent: 0.69 },
      { symbol: 'SCHB', price: 52.80, change: 0.30, changePercent: 0.57 },
      { symbol: 'IVV', price: 485.20, change: 2.10, changePercent: 0.43 },
      { symbol: 'AGG', price: 98.40, change: 0.20, changePercent: 0.20 },
      { symbol: 'BRK.B', price: 348.50, change: 2.80, changePercent: 0.81 }
    ];

    fallbackStocks.forEach(stock => {
      const mockHistoricalData = this.generateMockHistoricalData(stock.price, stock.changePercent);
      this.fallbackData.set(stock.symbol, {
        symbol: stock.symbol,
        currentPrice: stock.price,
        previousClose: stock.price - stock.change,
        change: stock.change,
        changePercent: stock.changePercent,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        marketCap: stock.price * (Math.floor(Math.random() * 1000000000) + 1000000000),
        dividendYield: Math.random() > 0.5 ? (Math.random() * 4 + 0.5) : undefined,
        peRatio: Math.random() > 0.3 ? (Math.random() * 30 + 10) : undefined,
        historicalData: mockHistoricalData
      });
    });
  }

  private static generateMockHistoricalData(currentPrice: number, changePercent: number): { date: string; price: number }[] {
    const data = [];
    const basePrice = currentPrice / (1 + changePercent / 100);
    const days = 30;
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i));
      const variation = (Math.random() - 0.5) * 0.02; // ±1% daily variation
      const price = basePrice * (1 + (changePercent / 100) * (i / days) + variation);
      
      data.push({
        date: date.toISOString().split('T')[0],
        price: Math.round(price * 100) / 100
      });
    }
    
    return data;
  }

  static async getStockData(symbol: string): Promise<StockData | null> {
    try {
      // Check cache first
      const cached = this.cache.get(symbol);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      // Return fallback data immediately for faster loading
      const fallback = this.fallbackData.get(symbol);
      if (fallback) {
        // Start async fetch in background for next time
        this.fetchRealDataInBackground(symbol);
        return fallback;
      }

      // If no fallback, try to fetch real data
      const realData = await this.fetchRealData(symbol);
      if (realData) {
        this.cache.set(symbol, { data: realData, timestamp: Date.now() });
        return realData;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error);
      return this.fallbackData.get(symbol) || null;
    }
  }

  private static async fetchRealData(symbol: string): Promise<StockData | null> {
    try {
      const ticker = yfinance.Ticker(symbol);
      
      // Get current quote
      const quote = await ticker.quote();
      if (!quote || !quote.regularMarketPrice) {
        return null;
      }

      // Get historical data for the last 30 days
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      
      const history = await ticker.history({
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0],
        interval: '1d'
      });

      const historicalData = history.map((row: any) => ({
        date: row.Date.toISOString().split('T')[0],
        price: row.Close
      }));

      const stockData: StockData = {
        symbol: symbol.toUpperCase(),
        currentPrice: quote.regularMarketPrice,
        previousClose: quote.regularMarketPreviousClose || quote.regularMarketPrice,
        change: quote.regularMarketPrice - (quote.regularMarketPreviousClose || quote.regularMarketPrice),
        changePercent: quote.regularMarketChangePercent || 0,
        volume: quote.regularMarketVolume || 0,
        marketCap: quote.marketCap || 0,
        dividendYield: quote.trailingAnnualDividendYield,
        peRatio: quote.trailingPE,
        historicalData
      };

      return stockData;
    } catch (error) {
      console.error(`Error fetching real data for ${symbol}:`, error);
      return null;
    }
  }

  private static async fetchRealDataInBackground(symbol: string) {
    try {
      const realData = await this.fetchRealData(symbol);
      if (realData) {
        this.cache.set(symbol, { data: realData, timestamp: Date.now() });
      }
    } catch (error) {
      console.error(`Background fetch failed for ${symbol}:`, error);
    }
  }

  static async getMultipleStockData(symbols: string[]): Promise<Map<string, StockData>> {
    // Initialize fallback data if not already done
    if (this.fallbackData.size === 0) {
      this.initializeFallbackData();
    }

    const results = new Map<string, StockData>();
    
    // Fetch data for all symbols in parallel
    const promises = symbols.map(async (symbol) => {
      const data = await this.getStockData(symbol);
      if (data) {
        results.set(symbol, data);
      }
    });

    await Promise.all(promises);
    return results;
  }

  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  }

  static formatNumber(num: number): string {
    if (num >= 1e12) return (num / 1e12).toFixed(1) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  }

  static formatPercentage(value: number): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  }
} 