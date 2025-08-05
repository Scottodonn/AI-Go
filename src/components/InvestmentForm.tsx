import React, { useState } from 'react';
import { InvestmentCriteria, TimePeriod, RiskLevel } from '../types/investment';
import { InvestmentRecommendationService } from '../services/investmentRecommendationService';

interface InvestmentFormProps {
  onSubmit: (criteria: InvestmentCriteria) => void;
  isLoading: boolean;
}

export const InvestmentForm: React.FC<InvestmentFormProps> = ({ onSubmit, isLoading }) => {
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

  if (isLoading) {
    return (
      <div className="investment-form">
        <div className="loading">
          Analyzing investments and building your personalized portfolio...
        </div>
      </div>
    );
  }

  return (
    <div className="investment-form">
      <h2 className="form-title">Investment Preferences</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Row 1: Amount */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Investment Amount
            </label>
            <input
              type="number"
              id="amount"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount in USD"
              min="1"
              step="1"
            />
          </div>
        </div>

        {/* Row 2: Time Period */}
        <div className="options-row">
          <label className="options-label">Time Period</label>
          <div className="options-container">
            {(Object.entries(timePeriodInfo) as [TimePeriod, typeof timePeriodInfo[TimePeriod]][]).map(([period, info]) => (
              <div
                key={period}
                className={`option-box ${timePeriod === period ? 'selected' : ''}`}
                onClick={() => setTimePeriod(period)}
              >
                <div className="option-title">
                  {period.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <div className="option-description">
                  {info.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Risk Tolerance */}
        <div className="options-row">
          <label className="options-label">Risk Tolerance</label>
          <div className="options-container">
            {(Object.entries(riskLevelInfo) as [RiskLevel, typeof riskLevelInfo[RiskLevel]][]).map(([risk, info]) => (
              <div
                key={risk}
                className={`option-box ${riskLevel === risk ? 'selected' : ''}`}
                onClick={() => setRiskLevel(risk)}
              >
                <div className="option-title">
                  {risk.charAt(0).toUpperCase() + risk.slice(1)} Risk
                </div>
                <div className="option-description">
                  {info.expectedReturn}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="submit-button"
          disabled={!isFormValid}
        >
          Get Recommendations
        </button>
      </form>
    </div>
  );
};