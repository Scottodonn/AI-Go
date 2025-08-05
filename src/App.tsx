import React, { useState } from 'react';
import { TrendingUp, DollarSign, Shield } from 'lucide-react';
import { InvestmentForm } from './components/InvestmentForm';
import { RecommendationResults } from './components/RecommendationResults';
import { InvestmentCriteria, InvestmentRecommendation } from './types/investment';
import { InvestmentRecommendationService } from './services/investmentRecommendationService';

function App() {
  const [recommendations, setRecommendations] = useState<InvestmentRecommendation[]>([]);
  const [criteria, setCriteria] = useState<InvestmentCriteria | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (newCriteria: InvestmentCriteria) => {
    setIsLoading(true);
    setCriteria(newCriteria);
    
    // Simulate a brief loading delay for better UX
    setTimeout(() => {
      const newRecommendations = InvestmentRecommendationService.getRecommendations(newCriteria);
      setRecommendations(newRecommendations);
      setIsLoading(false);
    }, 500);
  };

  const handleNewSearch = () => {
    setRecommendations([]);
    setCriteria(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-content">
            <div className="logo">
              <TrendingUp size={32} />
              <span>Smart Investment Guide</span>
              <span style={{ 
                fontSize: '0.875rem', 
                fontWeight: 400, 
                color: 'var(--text-secondary)',
                marginLeft: '0.5rem'
              }}>
                by AI-Go
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        {/* Hero Section */}
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <h1 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 700, 
            marginBottom: '1rem',
            color: 'var(--text-primary)'
          }}>
            Start Your Investment Journey with Confidence
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: '1.6'
          }}>
            Get personalized stock and ETF recommendations based on your budget, timeline, and risk tolerance. 
            Perfect for beginners who want to start investing smartly.
          </p>
        </div>

        {/* Key Features */}
        <div className="info-grid" style={{ marginBottom: '3rem' }}>
          <div className="info-card" style={{ textAlign: 'center' }}>
            <DollarSign size={48} style={{ color: 'var(--primary-color)', margin: '0 auto 1rem' }} />
            <div className="info-title">Personalized Recommendations</div>
            <div className="info-description">
              Get investment suggestions tailored to your specific financial situation and goals.
            </div>
          </div>
          <div className="info-card" style={{ textAlign: 'center' }}>
            <Shield size={48} style={{ color: 'var(--success-color)', margin: '0 auto 1rem' }} />
            <div className="info-title">Risk-Appropriate Portfolios</div>
            <div className="info-description">
              Investments matched to your risk tolerance with clear explanations of what to expect.
            </div>
          </div>
          <div className="info-card" style={{ textAlign: 'center' }}>
            <TrendingUp size={48} style={{ color: 'var(--warning-color)', margin: '0 auto 1rem' }} />
            <div className="info-title">Educational Guidance</div>
            <div className="info-description">
              Learn investing fundamentals with clear explanations and practical next steps.
            </div>
          </div>
        </div>

        {/* Main Application */}
        <div className="main-content">
          <InvestmentForm onSubmit={handleFormSubmit} />
          
          <div>
            {isLoading && (
              <div className="card">
                <div className="loading">
                  <TrendingUp size={24} style={{ marginRight: '0.5rem', animation: 'pulse 2s infinite' }} />
                  Analyzing investments and building your personalized portfolio...
                </div>
              </div>
            )}
            
            {!isLoading && recommendations.length > 0 && criteria && (
              <>
                <RecommendationResults 
                  recommendations={recommendations} 
                  criteria={criteria} 
                />
                <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                  <button 
                    className="button" 
                    onClick={handleNewSearch}
                    style={{ width: 'auto', padding: '0.75rem 2rem' }}
                  >
                    Try Different Criteria
                  </button>
                </div>
              </>
            )}
            
            {!isLoading && !criteria && (
              <div className="card">
                <h2 className="card-title">Investment Recommendations</h2>
                <div className="empty-state">
                  <div className="empty-state-icon">📈</div>
                  <p>Fill out the form to get your personalized investment recommendations.</p>
                  <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Our algorithm will scan our database of stocks and ETFs to find the best matches 
                    for your investment criteria.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Educational Footer */}
        <div className="info-section" style={{ marginTop: '4rem', marginBottom: '3rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-primary)' }}>
            Why Use Our Investment Guide?
          </h2>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-title">📊 Data-Driven Selections</div>
              <div className="info-description">
                Our algorithm analyzes historical performance, fees, volatility, and other key metrics 
                to recommend suitable investments for your profile.
              </div>
            </div>
            <div className="info-card">
              <div className="info-title">🎯 Beginner-Friendly</div>
              <div className="info-description">
                Clear explanations, educational content, and step-by-step guidance make investing 
                accessible for first-time investors.
              </div>
            </div>
            <div className="info-card">
              <div className="info-title">🔄 Diversification Focus</div>
              <div className="info-description">
                Recommendations emphasize diversification across asset classes and sectors to 
                help reduce overall portfolio risk.
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{ 
        background: 'var(--card-bg)', 
        borderTop: '1px solid var(--border-color)',
        padding: '2rem 0',
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        <div className="container">
          <p style={{ marginBottom: '0.5rem' }}>
            <strong>Smart Investment Guide</strong> by AI-Go - Empowering your financial future through intelligent investment recommendations.
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            This tool provides educational content only and should not be considered as personalized financial advice. 
            Always consult with qualified financial professionals before making investment decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;