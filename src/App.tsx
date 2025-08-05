import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { InvestmentForm } from './components/InvestmentForm';
import { InvestmentCarousel } from './components/InvestmentCarousel';
import { InvestmentCriteria, InvestmentRecommendation } from './types/investment';
import { InvestmentRecommendationService } from './services/investmentRecommendationService';

function App() {
  const [recommendations, setRecommendations] = useState<InvestmentRecommendation[]>([]);
  const [criteria, setCriteria] = useState<InvestmentCriteria | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleFormSubmit = async (newCriteria: InvestmentCriteria) => {
    setIsLoading(true);
    setCriteria(newCriteria);
    
    // Simulate loading delay
    setTimeout(() => {
      const newRecommendations = InvestmentRecommendationService.getRecommendations(newCriteria);
      setRecommendations(newRecommendations);
      setIsLoading(false);
      setShowForm(false);
    }, 800);
  };

  const handleNewSearch = () => {
    setRecommendations([]);
    setCriteria(null);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="logo">
            <div className="logo-icon">
              <TrendingUp size={20} />
            </div>
            <div className="logo-text">
              <div className="logo-title">AI Investor V1</div>
              <div className="logo-attribution">by Scott O'Donnell • Made with Cursor</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container">
        {showForm && (
          <InvestmentForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        )}
        
        {!showForm && recommendations.length > 0 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Investment Recommendations
              </h2>
              <button 
                onClick={handleNewSearch}
                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
              >
                New Search
              </button>
            </div>
            <InvestmentCarousel recommendations={recommendations} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;