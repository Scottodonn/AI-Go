import { Investment, InvestmentCriteria, InvestmentRecommendation, RiskLevel, TimePeriod } from '../types/investment';
import { investmentDatabase } from '../data/investmentDatabase';

export class InvestmentRecommendationService {
  /**
   * Gets investment recommendations based on user criteria
   */
  static getRecommendations(criteria: InvestmentCriteria): InvestmentRecommendation[] {
    const { amount, timePeriod, riskLevel } = criteria;
    
    // Filter investments based on criteria
    const filteredInvestments = this.filterInvestments(criteria);
    
    // Score and rank investments
    const scoredInvestments = this.scoreInvestments(filteredInvestments, criteria);
    
    // Create portfolio recommendations
    const recommendations = this.createPortfolioRecommendations(scoredInvestments, criteria);
    
    return recommendations;
  }

  /**
   * Filters investments based on user criteria
   */
  private static filterInvestments(criteria: InvestmentCriteria): Investment[] {
    const { amount, timePeriod, riskLevel } = criteria;
    
    return investmentDatabase.filter(investment => {
      // Check if investment amount is sufficient
      const canAfford = investment.minimumInvestment <= amount;
      
      // Check if time period is suitable
      const timePeriodMatch = investment.suitableTimePeriods.includes(timePeriod);
      
      // Check risk level compatibility (allow lower risk than requested)
      const riskCompatible = this.isRiskCompatible(investment.riskLevel, riskLevel);
      
      return canAfford && timePeriodMatch && riskCompatible;
    });
  }

  /**
   * Checks if investment risk level is compatible with user preference
   */
  private static isRiskCompatible(investmentRisk: RiskLevel, userRisk: RiskLevel): boolean {
    const riskLevels = { 'low': 1, 'medium': 2, 'high': 3 };
    return riskLevels[investmentRisk] <= riskLevels[userRisk];
  }

  /**
   * Scores investments based on how well they match user criteria
   */
  private static scoreInvestments(investments: Investment[], criteria: InvestmentCriteria): Array<Investment & { score: number }> {
    return investments.map(investment => {
      let score = 0;
      
      // Base score for risk/return profile
      const expectedReturn = this.getExpectedReturn(investment, criteria.riskLevel);
      score += expectedReturn * 10;
      
      // Bonus for exact risk match
      if (investment.riskLevel === criteria.riskLevel) {
        score += 20;
      }
      
      // Bonus for diversification (ETFs generally better for beginners)
      if (investment.type === 'etf') {
        score += 15;
      }
      
      // Bonus for low fees (ETFs)
      if (investment.expenseRatio && investment.expenseRatio < 0.1) {
        score += 10;
      }
      
      // Penalty for high volatility if user chose low risk
      if (criteria.riskLevel === 'low' && investment.volatility > 30) {
        score -= 15;
      }
      
      // Bonus for dividend yield if conservative investor
      if (criteria.riskLevel === 'low' && investment.dividendYield && investment.dividendYield > 2) {
        score += 10;
      }
      
      // Time period compatibility bonus
      if (investment.suitableTimePeriods.includes(criteria.timePeriod)) {
        score += 10;
      }
      
      return { ...investment, score };
    }).sort((a, b) => b.score - a.score);
  }

  /**
   * Gets expected return based on user risk tolerance
   */
  private static getExpectedReturn(investment: Investment, riskLevel: RiskLevel): number {
    switch (riskLevel) {
      case 'low':
        return investment.expectedAnnualReturn.conservative;
      case 'medium':
        return investment.expectedAnnualReturn.average;
      case 'high':
        return investment.expectedAnnualReturn.optimistic;
    }
  }

  /**
   * Creates portfolio recommendations with allocation percentages
   */
  private static createPortfolioRecommendations(
    scoredInvestments: Array<Investment & { score: number }>,
    criteria: InvestmentCriteria
  ): InvestmentRecommendation[] {
    const recommendations: InvestmentRecommendation[] = [];
    const maxRecommendations = criteria.amount < 1000 ? 3 : criteria.amount < 5000 ? 5 : 7;
    
    // Select top investments
    const selectedInvestments = scoredInvestments.slice(0, maxRecommendations);
    
    if (selectedInvestments.length === 0) {
      return [];
    }
    
    // Calculate allocations based on investment strategy
    const allocations = this.calculateAllocations(selectedInvestments, criteria);
    
    selectedInvestments.forEach((investment, index) => {
      const allocation = allocations[index];
      const recommendedAmount = Math.round(criteria.amount * (allocation / 100));
      
      // Only include if we can afford minimum investment
      if (recommendedAmount >= investment.minimumInvestment) {
        recommendations.push({
          investment,
          allocationPercentage: allocation,
          recommendedAmount,
          reasoning: this.generateReasoning(investment, criteria, allocation)
        });
      }
    });
    
    // Rebalance if some investments were excluded
    return this.rebalanceAllocations(recommendations, criteria.amount);
  }

  /**
   * Calculates allocation percentages based on investment strategy
   */
  private static calculateAllocations(
    investments: Array<Investment & { score: number }>,
    criteria: InvestmentCriteria
  ): number[] {
    const count = investments.length;
    
    if (count === 1) {
      return [100];
    }
    
    // Different allocation strategies based on risk level
    switch (criteria.riskLevel) {
      case 'low':
        // Conservative: Heavy weighting on top choices, prefer bonds/stable ETFs
        return this.getConservativeAllocation(count);
      case 'medium':
        // Balanced: Moderate weighting on top choices
        return this.getBalancedAllocation(count);
      case 'high':
        // Aggressive: More equal weighting to allow for higher risk/reward
        return this.getAggressiveAllocation(count);
    }
  }

  private static getConservativeAllocation(count: number): number[] {
    switch (count) {
      case 2: return [70, 30];
      case 3: return [50, 30, 20];
      case 4: return [40, 30, 20, 10];
      case 5: return [35, 25, 20, 15, 5];
      default: return [30, 20, 15, 15, 10, 5, 5];
    }
  }

  private static getBalancedAllocation(count: number): number[] {
    switch (count) {
      case 2: return [60, 40];
      case 3: return [45, 35, 20];
      case 4: return [35, 30, 20, 15];
      case 5: return [30, 25, 20, 15, 10];
      default: return [25, 20, 18, 15, 12, 5, 5];
    }
  }

  private static getAggressiveAllocation(count: number): number[] {
    switch (count) {
      case 2: return [55, 45];
      case 3: return [40, 35, 25];
      case 4: return [30, 25, 25, 20];
      case 5: return [25, 20, 20, 20, 15];
      default: return [20, 18, 16, 16, 15, 8, 7];
    }
  }

  /**
   * Generates reasoning for each recommendation
   */
  private static generateReasoning(
    investment: Investment,
    criteria: InvestmentCriteria,
    allocation: number
  ): string {
    const reasons = [];
    
    if (investment.type === 'etf') {
      reasons.push('Provides instant diversification, reducing risk');
    }
    
    if (investment.riskLevel === criteria.riskLevel) {
      reasons.push(`Matches your ${criteria.riskLevel} risk tolerance`);
    } else if (investment.riskLevel === 'low' && criteria.riskLevel !== 'low') {
      reasons.push('Adds stability to your portfolio');
    }
    
    if (investment.suitableTimePeriods.includes(criteria.timePeriod)) {
      reasons.push(`Suitable for ${criteria.timePeriod.replace('-', ' ')} investing`);
    }
    
    if (investment.dividendYield && investment.dividendYield > 2) {
      reasons.push(`Provides ${investment.dividendYield}% dividend income`);
    }
    
    if (investment.expenseRatio && investment.expenseRatio < 0.1) {
      reasons.push('Low fees maximize your returns');
    }
    
    if (allocation > 30) {
      reasons.push('Core holding for your portfolio');
    } else if (allocation > 15) {
      reasons.push('Important component for diversification');
    } else {
      reasons.push('Provides additional diversification');
    }
    
    return reasons.join('. ') + '.';
  }

  /**
   * Rebalances allocations to ensure they sum to 100%
   */
  private static rebalanceAllocations(
    recommendations: InvestmentRecommendation[],
    totalAmount: number
  ): InvestmentRecommendation[] {
    if (recommendations.length === 0) return [];
    
    const currentTotal = recommendations.reduce((sum, rec) => sum + rec.allocationPercentage, 0);
    
    if (Math.abs(currentTotal - 100) < 1) {
      return recommendations; // Close enough
    }
    
    // Proportionally adjust allocations
    const adjustmentFactor = 100 / currentTotal;
    let runningTotal = 0;
    
    return recommendations.map((rec, index) => {
      let adjustedAllocation = rec.allocationPercentage * adjustmentFactor;
      
      // Round to nearest integer, but ensure last item gets remainder
      if (index === recommendations.length - 1) {
        adjustedAllocation = 100 - runningTotal;
      } else {
        adjustedAllocation = Math.round(adjustedAllocation);
        runningTotal += adjustedAllocation;
      }
      
      return {
        ...rec,
        allocationPercentage: adjustedAllocation,
        recommendedAmount: Math.round(totalAmount * (adjustedAllocation / 100))
      };
    });
  }

  /**
   * Gets educational information about time periods
   */
  static getTimePeriodInfo(): Record<TimePeriod, { duration: string; description: string }> {
    return {
      'short-term': {
        duration: '1-2 years',
        description: 'Best for emergency funds or money you\'ll need soon. Lower risk, lower returns.'
      },
      'mid-term': {
        duration: '3-7 years',
        description: 'Good for goals like buying a house or car. Balanced risk and return potential.'
      },
      'long-term': {
        duration: '8+ years',
        description: 'Ideal for retirement or long-term wealth building. Higher growth potential over time.'
      }
    };
  }

  /**
   * Gets educational information about risk levels
   */
  static getRiskLevelInfo(): Record<RiskLevel, { description: string; expectedReturn: string; volatility: string }> {
    return {
      'low': {
        description: 'Conservative approach with focus on preserving capital and steady income.',
        expectedReturn: '3-6% annually',
        volatility: 'Low price swings, more predictable returns'
      },
      'medium': {
        description: 'Balanced approach seeking moderate growth with reasonable stability.',
        expectedReturn: '6-10% annually',
        volatility: 'Moderate price swings, some ups and downs expected'
      },
      'high': {
        description: 'Aggressive approach targeting maximum growth, accepting significant volatility.',
        expectedReturn: '10-15%+ annually (with higher risk of losses)',
        volatility: 'High price swings, expect significant ups and downs'
      }
    };
  }
}