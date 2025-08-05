import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, DollarSign, Calendar, AlertTriangle } from 'lucide-react';
import { InvestmentRecommendation } from '../types/investment';
import { StockDataService, StockData } from '../services/stockDataService';

interface InvestmentCarouselProps {
  recommendations: InvestmentRecommendation[];
}

type TimeFrame = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';

export const InvestmentCarousel: React.FC<InvestmentCarouselProps> = ({ recommendations }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeframes, setTimeframes] = useState<Record<string, TimeFrame>>({});
  const [selectedGraphPoint, setSelectedGraphPoint] = useState<{
    investmentId: string;
    pointIndex: number;
    price: number;
    date: string;
  } | null>(null);
  const [stockData, setStockData] = useState<Map<string, StockData>>(new Map());
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  // Fetch real-time stock data
  useEffect(() => {
    const fetchStockData = async () => {
      const symbols = recommendations.map(rec => rec.investment.symbol);
      const data = await StockDataService.getMultipleStockData(symbols);
      setStockData(data);
    };

    if (recommendations.length > 0) {
      fetchStockData();
    }
  }, [recommendations]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === recommendations.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? recommendations.length - 1 : prevIndex - 1
    );
  };

  const handleTimeframeChange = (investmentId: string, timeframe: TimeFrame) => {
    setTimeframes(prev => ({
      ...prev,
      [investmentId]: timeframe
    }));
    setSelectedGraphPoint(null); // Reset selection when timeframe changes
  };

  const getGraphPointPrice = (stockData: StockData, pointIndex: number) => {
    if (!stockData.historicalData || pointIndex >= stockData.historicalData.length) {
      return stockData.currentPrice;
    }
    return stockData.historicalData[pointIndex].price;
  };

  const getGraphPointDate = (timeframe: TimeFrame, pointIndex: number) => {
    const timeframeLabels = {
      '1D': ['9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM'],
      '1W': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      '1M': ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      '3M': ['Jan', 'Feb', 'Mar'],
      '1Y': ['Q1', 'Q2', 'Q3', 'Q4'],
      '5Y': ['2020', '2021', '2022', '2023', '2024']
    };
    
    const labels = timeframeLabels[timeframe] || ['Point 1', 'Point 2', 'Point 3', 'Point 4'];
    return labels[Math.min(pointIndex, labels.length - 1)];
  };

  const handleGraphPointClick = (investmentId: string, pointIndex: number, stockData: StockData) => {
    const price = getGraphPointPrice(stockData, pointIndex);
    const currentTimeframe = timeframes[investmentId] || '1M';
    const date = getGraphPointDate(currentTimeframe, pointIndex);
    
    setSelectedGraphPoint({
      investmentId,
      pointIndex,
      price,
      date
    });
  };

  const generateGraphData = (stockData: StockData, timeframe: TimeFrame) => {
    if (!stockData.historicalData || stockData.historicalData.length === 0) {
      // Fallback to mock data if no historical data
      const isPositive = stockData.change >= 0;
      const patterns = {
        '1D': isPositive ? [0.2, 0.4, 0.3, 0.6, 0.8, 1.0] : [1.0, 0.8, 0.6, 0.4, 0.2, 0.1],
        '1W': isPositive ? [0.1, 0.3, 0.5, 0.7, 0.9, 1.0] : [1.0, 0.7, 0.5, 0.3, 0.2, 0.1],
        '1M': isPositive ? [0.2, 0.4, 0.3, 0.6, 0.8, 1.0] : [1.0, 0.8, 0.6, 0.4, 0.2, 0.1],
        '3M': isPositive ? [0.1, 0.4, 0.2, 0.6, 0.8, 1.0] : [1.0, 0.6, 0.4, 0.3, 0.2, 0.1],
        '1Y': isPositive ? [0.2, 0.5, 0.3, 0.7, 0.9, 1.0] : [1.0, 0.7, 0.5, 0.3, 0.2, 0.1],
        '5Y': isPositive ? [0.1, 0.3, 0.5, 0.7, 0.9, 1.0] : [1.0, 0.8, 0.6, 0.4, 0.2, 0.1]
      };
      return patterns[timeframe] || patterns['1M'];
    }

    // Use real historical data
    const data = stockData.historicalData;
    const minPrice = Math.min(...data.map(d => d.price));
    const maxPrice = Math.max(...data.map(d => d.price));
    const range = maxPrice - minPrice;

    return data.map(point => {
      if (range === 0) return 0.5;
      return (point.price - minPrice) / range;
    });
  };

  if (recommendations.length === 0) {
    return (
      <div className="investment-form">
        <div className="loading">
          No suitable investments found for your criteria.
        </div>
      </div>
    );
  }

  const timeframesList: TimeFrame[] = ['1D', '1W', '1M', '3M', '1Y', '5Y'];

  return (
    <div className="carousel-container">
      <button 
        className="carousel-nav prev" 
        onClick={prevSlide}
        aria-label="Previous"
      >
        <ChevronLeft size={20} />
      </button>

      <div className="carousel-track" style={{ 
        transform: `translateX(-${currentIndex * 340}px)` 
      }}>
        {recommendations.map((recommendation, index) => {
          const { investment } = recommendation;
          const stockDataItem = stockData.get(investment.symbol);
          const currentTimeframe = timeframes[investment.id] || '1M';
          const graphData = stockDataItem ? generateGraphData(stockDataItem, currentTimeframe) : [];
          const isSelected = selectedGraphPoint?.investmentId === investment.id;
          const isLoading = loading[investment.symbol];
          
          return (
            <div key={investment.id} className="carousel-card">
              {/* Header with Symbol and Type */}
              <div className="card-header">
                <div>
                  <div className="card-symbol">
                    {investment.symbol}
                  </div>
                  <div className="card-company">
                    {investment.name}
                  </div>
                </div>
                <div className="card-type">
                  {investment.type.toUpperCase()}
                </div>
              </div>

              {/* Real-time Price and Change */}
              {stockDataItem ? (
                <>
                  <div className="card-price">
                    {StockDataService.formatCurrency(stockDataItem.currentPrice)}
                  </div>
                  <div className={`card-change ${stockDataItem.change >= 0 ? 'positive' : 'negative'}`}>
                    {stockDataItem.change >= 0 ? '+' : ''}{StockDataService.formatCurrency(stockDataItem.change)} 
                    ({StockDataService.formatPercentage(stockDataItem.changePercent)})
                  </div>
                </>
              ) : (
                <div className="card-loading">
                  <div className="loading-spinner"></div>
                  <span>Loading real-time data...</span>
                </div>
              )}

              {/* Interactive Graph */}
              <div className="card-graph-container">
                <div className="graph-header">
                  <div className="graph-title">Price Trend</div>
                  <div className="graph-timeframe">
                    {timeframesList.map((timeframe) => (
                      <button
                        key={timeframe}
                        className={`timeframe-btn ${currentTimeframe === timeframe ? 'active' : ''}`}
                        onClick={() => handleTimeframeChange(investment.id, timeframe)}
                      >
                        {timeframe}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="card-graph">
                  <svg width="100%" height="100%" viewBox="0 0 100 20" preserveAspectRatio="none">
                                         {graphData.length > 0 && (
                       <polyline
                         points={graphData.map((y, x) => `${x * (100 / (graphData.length - 1))},${20 - y * 18}`).join(' ')}
                         fill="none"
                         stroke={(stockDataItem?.change ?? 0) >= 0 ? '#10b981' : '#ef4444'}
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       />
                     )}
                     {/* Clickable points on the graph */}
                     {graphData.map((y, x) => (
                       <circle
                         key={x}
                         cx={x * (100 / (graphData.length - 1))}
                         cy={20 - y * 18}
                         r="1.5"
                         fill={(stockDataItem?.change ?? 0) >= 0 ? '#10b981' : '#ef4444'}
                         className="graph-point"
                         style={{ cursor: 'pointer' }}
                         onClick={() => stockDataItem && handleGraphPointClick(investment.id, x, stockDataItem)}
                       />
                     ))}
                  </svg>
                </div>

                {/* Static tooltip showing selected point */}
                {isSelected && selectedGraphPoint && (
                  <div className="graph-info">
                    <div className="graph-info-price">
                      {StockDataService.formatCurrency(selectedGraphPoint.price)}
                    </div>
                    <div className="graph-info-date">
                      {selectedGraphPoint.date}
                    </div>
                  </div>
                )}
              </div>

              {/* Investment Details - Beginner Friendly */}
              <div className="card-details">
                <div className="detail-item">
                  <div className="detail-icon">
                    <DollarSign size={16} />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Recommended Amount</div>
                    <div className="detail-value">
                      {StockDataService.formatCurrency(recommendation.recommendedAmount)}
                    </div>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">
                    <TrendingUp size={16} />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Expected Return</div>
                    <div className="detail-value">
                      {investment.expectedAnnualReturn.average}% per year
                    </div>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">
                    <Calendar size={16} />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Time Horizon</div>
                    <div className="detail-value">
                      {recommendation.allocationPercentage}% of portfolio
                    </div>
                  </div>
                </div>
                
                <div className="detail-item">
                  <div className="detail-icon">
                    <AlertTriangle size={16} />
                  </div>
                  <div className="detail-content">
                    <div className="detail-label">Risk Level</div>
                    <div className="detail-value">
                      {investment.riskLevel.charAt(0).toUpperCase() + investment.riskLevel.slice(1)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sector and Additional Info */}
              <div className="card-sector">
                <span className="sector-label">Sector:</span> {investment.sector}
                {stockDataItem?.dividendYield && (
                  <span className="dividend-yield">
                    • Dividend: {stockDataItem.dividendYield.toFixed(2)}%
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button 
        className="carousel-nav next" 
        onClick={nextSlide}
        aria-label="Next"
      >
        <ChevronRight size={20} />
      </button>

      {/* Carousel Indicators */}
      <div className="carousel-indicators">
        {recommendations.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}; 