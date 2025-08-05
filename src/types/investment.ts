export type RiskLevel = 'low' | 'medium' | 'high';
export type TimePeriod = 'short-term' | 'mid-term' | 'long-term';
export type InvestmentType = 'stock' | 'etf';

export interface Investment {
  id: string;
  symbol: string;
  name: string;
  type: InvestmentType;
  sector: string;
  riskLevel: RiskLevel;
  suitableTimePeriods: TimePeriod[];
  minimumInvestment: number;
  expectedAnnualReturn: {
    conservative: number;
    average: number;
    optimistic: number;
  };
  description: string;
  dividendYield?: number;
  expenseRatio?: number; // For ETFs
  marketCap?: string; // For stocks
  volatility: number; // 0-100 scale
}

export interface InvestmentCriteria {
  amount: number;
  timePeriod: TimePeriod;
  riskLevel: RiskLevel;
}

export interface InvestmentRecommendation {
  investment: Investment;
  allocationPercentage: number;
  recommendedAmount: number;
  reasoning: string;
}