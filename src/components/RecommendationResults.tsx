import React from 'react';
import { InvestmentRecommendation, InvestmentCriteria } from '../types/investment';

interface RecommendationResultsProps {
  recommendations: InvestmentRecommendation[];
  criteria: InvestmentCriteria;
}

export const RecommendationResults: React.FC<RecommendationResultsProps> = ({ 
  recommendations, 
  criteria 
}) => {
  if (recommendations.length === 0) {
    return (
      <div className="card">
        <h2 className="card-title">Investment Recommendations</h2>
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <p>No suitable investments found for your criteria. Try adjusting your investment amount or risk tolerance.</p>
        </div>
      </div>
    );
  }

  const totalAllocated = recommendations.reduce((sum, rec) => sum + rec.recommendedAmount, 0);
  const portfolioSummary = {
    totalValue: totalAllocated,
    etfCount: recommendations.filter(r => r.investment.type === 'etf').length,
    stockCount: recommendations.filter(r => r.investment.type === 'stock').length,
    averageExpectedReturn: recommendations.reduce((sum, rec) => 
      sum + (rec.investment.expectedAnnualReturn.average * rec.allocationPercentage / 100), 0
    )
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

  return (
    <div className="card">
      <h2 className="card-title">Your Personalized Investment Recommendations</h2>
      
      {/* Portfolio Summary */}
      <div className="alert alert-info">
        <strong>Portfolio Summary:</strong> {recommendations.length} investments • 
        {portfolioSummary.etfCount} ETFs • {portfolioSummary.stockCount} Stocks • 
        Expected Return: ~{formatPercentage(portfolioSummary.averageExpectedReturn)} annually
      </div>

      {/* Investment Breakdown */}
      <div className="recommendation-list">
        {recommendations.map((recommendation, index) => {
          const { investment } = recommendation;
          return (
            <div key={investment.id} className="recommendation-item">
              {/* Header */}
              <div className="recommendation-header">
                <div className="recommendation-info">
                  <div className="recommendation-symbol">
                    {investment.symbol}
                    <span className={`badge badge-${investment.type}`} style={{ marginLeft: '0.5rem' }}>
                      {investment.type.toUpperCase()}
                    </span>
                    <span className={`badge badge-${investment.riskLevel}`} style={{ marginLeft: '0.25rem' }}>
                      {investment.riskLevel} risk
                    </span>
                  </div>
                  <div className="recommendation-name">{investment.name}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {investment.sector}
                  </div>
                </div>
                <div className="recommendation-allocation">
                  <div className="allocation-percentage">
                    {recommendation.allocationPercentage}%
                  </div>
                  <div className="allocation-amount">
                    {formatCurrency(recommendation.recommendedAmount)}
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="recommendation-details">
                <div className="detail-item">
                  <div className="detail-label">Expected Return</div>
                  <div className="detail-value">
                    {formatPercentage(investment.expectedAnnualReturn.average)}
                  </div>
                </div>
                
                {investment.dividendYield && (
                  <div className="detail-item">
                    <div className="detail-label">Dividend Yield</div>
                    <div className="detail-value">
                      {formatPercentage(investment.dividendYield)}
                    </div>
                  </div>
                )}
                
                {investment.expenseRatio && (
                  <div className="detail-item">
                    <div className="detail-label">Expense Ratio</div>
                    <div className="detail-value">
                      {formatPercentage(investment.expenseRatio)}
                    </div>
                  </div>
                )}
                
                <div className="detail-item">
                  <div className="detail-label">Volatility</div>
                  <div className="detail-value">
                    {investment.volatility < 20 ? 'Low' : 
                     investment.volatility < 40 ? 'Medium' : 'High'}
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-label">Min Investment</div>
                  <div className="detail-value">
                    {formatCurrency(investment.minimumInvestment)}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ 
                marginBottom: '1rem', 
                fontSize: '0.875rem', 
                color: 'var(--text-secondary)',
                lineHeight: '1.5'
              }}>
                {investment.description}
              </div>

              {/* Reasoning */}
              <div className="recommendation-reasoning">
                Why this investment: {recommendation.reasoning}
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Steps */}
      <div className="info-section" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Next Steps</h3>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-title">🏦 Choose a Broker</div>
            <div className="info-description">
              Research online brokers like Fidelity, Schwab, or Vanguard. Look for low fees and good research tools.
            </div>
          </div>
          <div className="info-card">
            <div className="info-title">📋 Open an Account</div>
            <div className="info-description">
              Consider opening a taxable investment account or IRA depending on your goals and timeline.
            </div>
          </div>
          <div className="info-card">
            <div className="info-title">🎯 Dollar-Cost Average</div>
            <div className="info-description">
              Consider investing gradually over time rather than all at once to reduce timing risk.
            </div>
          </div>
          <div className="info-card">
            <div className="info-title">📚 Keep Learning</div>
            <div className="info-description">
              Continue educating yourself about investing through books, courses, and reputable financial websites.
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimers */}
      <div className="alert alert-warning" style={{ marginTop: '2rem' }}>
        <strong>Important Disclaimers:</strong> This is educational content only and not personalized financial advice. 
        Past performance doesn't guarantee future results. Consider consulting with a qualified financial advisor. 
        All investments carry risk including potential loss of principal.
      </div>
    </div>
  );
};