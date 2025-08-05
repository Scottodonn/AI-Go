import React, { useState } from 'react';
import { InvestmentCriteria, TimePeriod, RiskLevel } from '../types/investment';
import { InvestmentRecommendationService } from '../services/investmentRecommendationService';

interface InvestmentFormProps {
  onSubmit: (criteria: InvestmentCriteria) => void;
}

export const InvestmentForm: React.FC<InvestmentFormProps> = ({ onSubmit }) => {
  const [amount, setAmount] = useState<string>('');
  const [timePeriod, setTimePeriod] = useState<TimePeriod | ''>('');
  const [riskLevel, setRiskLevel] = useState<RiskLevel | ''>('');

  const timePeriodInfo = InvestmentRecommendationService.getTimePeriodInfo();
  const riskLevelInfo = InvestmentRecommendationService.getRiskLevelInfo();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !timePeriod || !riskLevel) {
      return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      return;
    }

    onSubmit({
      amount: numericAmount,
      timePeriod: timePeriod as TimePeriod,
      riskLevel: riskLevel as RiskLevel
    });
  };

  const isFormValid = amount && timePeriod && riskLevel && parseFloat(amount) > 0;

  return (
    <div className="card">
      <h2 className="card-title">Investment Preferences</h2>
      
      <div className="alert alert-info">
        <strong>New to investing?</strong> This tool will help you build a personalized portfolio 
        based on your financial situation and goals. All recommendations are educational and not financial advice.
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            How much would you like to invest?
          </label>
          <input
            type="number"
            id="amount"
            className="form-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount in USD (e.g., 1000)"
            min="1"
            step="1"
          />
          {amount && parseFloat(amount) < 50 && (
            <div className="alert alert-warning" style={{ marginTop: '0.5rem' }}>
              Consider starting with at least $50 to have meaningful diversification options.
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="form-label">Investment Time Horizon</label>
          <div className="radio-group">
            {(Object.entries(timePeriodInfo) as [TimePeriod, typeof timePeriodInfo[TimePeriod]][]).map(([period, info]) => (
              <div
                key={period}
                className={`radio-option ${timePeriod === period ? 'selected' : ''}`}
                onClick={() => setTimePeriod(period)}
              >
                <input
                  type="radio"
                  className="radio-input"
                  name="timePeriod"
                  value={period}
                  checked={timePeriod === period}
                  onChange={() => setTimePeriod(period)}
                />
                <div className="radio-content">
                  <div className="radio-title">
                    {period.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({info.duration})
                  </div>
                  <div className="radio-description">{info.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Risk Tolerance</label>
          <div className="radio-group">
            {(Object.entries(riskLevelInfo) as [RiskLevel, typeof riskLevelInfo[RiskLevel]][]).map(([risk, info]) => (
              <div
                key={risk}
                className={`radio-option ${riskLevel === risk ? 'selected' : ''}`}
                onClick={() => setRiskLevel(risk)}
              >
                <input
                  type="radio"
                  className="radio-input"
                  name="riskLevel"
                  value={risk}
                  checked={riskLevel === risk}
                  onChange={() => setRiskLevel(risk)}
                />
                <div className="radio-content">
                  <div className="radio-title">
                    {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
                    <span className={`badge badge-${risk}`} style={{ marginLeft: '0.5rem' }}>
                      {info.expectedReturn}
                    </span>
                  </div>
                  <div className="radio-description">
                    {info.description} {info.volatility}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="button"
          disabled={!isFormValid}
        >
          Get Investment Recommendations
        </button>
      </form>

      <div className="info-section" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>Important Considerations</h3>
        <div className="info-grid">
          <div className="info-card">
            <div className="info-title">🛡️ Emergency Fund First</div>
            <div className="info-description">
              Before investing, ensure you have 3-6 months of expenses saved for emergencies.
            </div>
          </div>
          <div className="info-card">
            <div className="info-title">📈 Diversification</div>
            <div className="info-description">
              Don't put all your money in one investment. Spread risk across different assets.
            </div>
          </div>
          <div className="info-card">
            <div className="info-title">⏰ Time in Market</div>
            <div className="info-description">
              Generally, time in the market beats timing the market. Stay invested for the long term.
            </div>
          </div>
          <div className="info-card">
            <div className="info-title">💰 Start Small</div>
            <div className="info-description">
              Begin with amounts you're comfortable with and gradually increase as you learn.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};