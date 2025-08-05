declare module 'yfinance' {
  export interface Quote {
    regularMarketPrice?: number;
    regularMarketPreviousClose?: number;
    regularMarketChangePercent?: number;
    regularMarketVolume?: number;
    marketCap?: number;
    trailingAnnualDividendYield?: number;
    trailingPE?: number;
  }

  export interface HistoryRow {
    Date: Date;
    Close: number;
  }

  export interface Ticker {
    quote(): Promise<Quote>;
    history(options: {
      start: string;
      end: string;
      interval: string;
    }): Promise<HistoryRow[]>;
  }

  export function Ticker(symbol: string): Ticker;
} 