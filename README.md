# Smart Investment Guide

A comprehensive web application that helps people who have never invested in stocks before make informed investment decisions. Built with React, TypeScript, and modern web technologies.

## Features

### 🎯 **Personalized Recommendations**
- **Investment Amount**: Support for any investment amount from $50 to unlimited
- **Time Horizon**: Short-term (1-2 years), Mid-term (3-7 years), Long-term (8+ years)
- **Risk Tolerance**: Low, Medium, High risk levels with detailed explanations

### 📊 **Comprehensive Database**
- **20+ Stocks and ETFs**: Carefully curated selection of investments
- **Real Market Data**: Actual tickers with current expense ratios, dividend yields, and expected returns
- **Diverse Asset Classes**: Bonds, broad market ETFs, growth stocks, value stocks, international markets, REITs, and more

### 🧠 **Intelligent Filtering Algorithm**
- **Multi-Criteria Analysis**: Filters investments based on amount, time period, and risk level
- **Smart Scoring System**: Ranks investments using factors like expected returns, fees, volatility, and diversification
- **Portfolio Optimization**: Creates balanced portfolios with appropriate allocation percentages

### 🎓 **Educational Content**
- **Beginner-Friendly Explanations**: Clear descriptions of risk levels and time horizons
- **Investment Education**: Key concepts like diversification, time in market, and emergency funds
- **Next Steps Guidance**: Practical advice on choosing brokers, opening accounts, and dollar-cost averaging

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Modern CSS with CSS variables and responsive design
- **Icons**: Lucide React for beautiful, consistent icons
- **State Management**: React hooks for simple, effective state management

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-investment-guide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Building for Production

```bash
npm run build
npm run preview
```

## How It Works

### 1. **User Input Collection**
Users provide three key pieces of information:
- **Investment Amount**: How much they want to invest
- **Time Horizon**: When they'll need the money back
- **Risk Tolerance**: How much volatility they're comfortable with

### 2. **Database Filtering**
The algorithm filters our comprehensive database of stocks and ETFs based on:
- **Affordability**: Investment minimums they can meet
- **Time Suitability**: Investments appropriate for their timeline
- **Risk Compatibility**: Investments matching or below their risk tolerance

### 3. **Intelligent Scoring**
Each qualifying investment receives a score based on:
- **Expected returns** for their risk level
- **Diversification benefits** (ETFs preferred for beginners)
- **Fee structure** (lower fees get higher scores)
- **Volatility match** with user preferences
- **Dividend income** for conservative investors

### 4. **Portfolio Construction**
The system creates a diversified portfolio with:
- **Strategic allocation** based on risk tolerance
- **Rebalancing** to ensure 100% allocation
- **Minimum investment requirements** respected
- **Clear reasoning** for each recommendation

## Investment Database

Our database includes carefully selected investments across multiple categories:

### **Low Risk Options**
- **Bond ETFs**: Vanguard Total Bond Market (BND)
- **Broad Market ETFs**: Vanguard Total Stock Market (VTI), S&P 500 (SPY)
- **International Diversification**: Vanguard Total International (VXUS)
- **Defensive Stocks**: Johnson & Johnson (JNJ), Coca-Cola (KO), Procter & Gamble (PG)

### **Medium Risk Options**
- **Growth/Value ETFs**: Vanguard Growth (VUG), Vanguard Value (VTV)
- **Small Cap Exposure**: Vanguard Small-Cap (VB)
- **Real Estate**: Vanguard Real Estate ETF (VNQ)
- **Quality Stocks**: Microsoft (MSFT), Apple (AAPL), Alphabet (GOOGL)

### **High Risk Options**
- **Technology ETFs**: Invesco QQQ (QQQ)
- **Innovation Focus**: ARK Innovation ETF (ARKK)
- **Emerging Markets**: Vanguard Emerging Markets (VWO)
- **Growth Stocks**: Tesla (TSLA), NVIDIA (NVDA), AMD (AMD)

## Key Features of the Algorithm

### **Risk-Appropriate Filtering**
- Users can only see investments at or below their selected risk level
- Conservative investors are steered toward stable, dividend-paying investments
- Aggressive investors get access to high-growth potential options

### **Time Horizon Matching**
- Short-term investors see bonds and stable ETFs
- Long-term investors get access to growth stocks and emerging markets
- Mid-term investors receive balanced options

### **Smart Portfolio Allocation**
- **Conservative**: Heavy weighting on top choices (70/30, 50/30/20)
- **Balanced**: Moderate distribution (60/40, 45/35/20)
- **Aggressive**: More equal weighting for diversification (55/45, 40/35/25)

## Educational Philosophy

This application is designed with financial education as a core principle:

### **Learning-First Approach**
- Every recommendation includes detailed reasoning
- Risk levels are thoroughly explained with expected returns and volatility
- Time horizons include specific year ranges and use cases

### **Beginner-Friendly Design**
- No financial jargon without explanation
- Clear visual hierarchy and intuitive interface
- Progressive disclosure of complex information

### **Responsible Investing**
- Emphasis on emergency funds before investing
- Diversification principles clearly explained
- Disclaimer about the educational nature of recommendations

## Customization and Extension

The application is designed to be easily extensible:

### **Adding New Investments**
Add entries to `src/data/investmentDatabase.ts` with:
- Complete investment details (symbol, name, type, sector)
- Risk profile and suitable time periods
- Expected returns and key metrics
- Descriptive information for users

### **Modifying the Algorithm**
Adjust scoring logic in `src/services/investmentRecommendationService.ts`:
- Change weighting factors for different criteria
- Modify allocation strategies
- Add new filtering rules

### **UI Customization**
Update styles in `src/index.css`:
- CSS variables for consistent theming
- Responsive design utilities
- Component-specific styling

## Disclaimer

**Important**: This application provides educational content only and should not be considered as personalized financial advice. Past performance does not guarantee future results. All investments carry risk including potential loss of principal. Users should consult with qualified financial professionals before making investment decisions.

## Contributing

This project was built to help people start their investment journey with confidence. Contributions that improve the educational value, user experience, or investment database are welcome.

## License

This project is part of AI-Go's financial services platform, designed to facilitate financial transactions and provide educational resources in the Capital Markets sector.

---

**AI-Go** - Facilitating financial transactions and private funding in the Capital Markets through highly developed algorithms with client-tailored specifications.
