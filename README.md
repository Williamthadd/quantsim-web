# QuantSimulate - Pure Frontend Trading Simulation

QuantSimulate is a comprehensive stock trading simulation platform built with React and TypeScript. **This is a 100% frontend-only application with no backend dependencies - all data is generated locally in the browser.**

## 🚀 Features

- **100% Frontend**: No backend, no server, no external dependencies
- **Instant Setup**: Just `npm install` and `npm run dev`
- **Local Data Generation**: All stock data generated in the browser
- **No APIs Required**: Works completely offline
- **Realistic Data**: Generated stock prices, charts, and news with realistic patterns
- **Stock Search**: Search from 40+ pre-loaded popular stocks
- **Interactive Charts**: Advanced charting with realistic historical data
- **Technical Analysis**: RSI, MACD, SMA indicators with calculated values
- **News Simulation**: Sample financial news articles
- **Portfolio Management**: Track your virtual investments
- **Backtesting**: Test trading strategies
- **Responsive Design**: Works on desktop and mobile

## 🏗️ Architecture

This is a pure frontend application with no backend dependencies:

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── services/       # Local data generators
│   ├── store/          # Zustand state management
│   └── ...
├── dist/            # Built application
└── package.json     # Frontend dependencies only
```

## 🛠️ Setup

### Prerequisites
- Node.js (v18 or later)
- **That's it!** No backend, no APIs, no configuration needed

### Installation

1. **Clone and install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development:**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 in your browser

3. **Production build:**
   ```bash
   npm run build
   npm run preview
   ```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📊 Local Data Generation

All data is generated locally in the browser:

- **Stock Prices**: Realistic price movements with volatility simulation
- **Historical Data**: 100+ days of OHLCV data for charts
- **Company Profiles**: Mock company information with realistic metrics
- **Financial News**: Sample news articles with realistic content and timestamps
- **Technical Indicators**: RSI, MACD, SMA calculations with historical context
- **Search Results**: 40+ popular stocks (AAPL, MSFT, TSLA, etc.)

## 🔧 Deployment

Since this is a pure frontend application, you can deploy it anywhere that serves static files:

**Vercel/Netlify:**
```bash
npm run build
# Upload dist/ folder
```

**GitHub Pages:**
```bash
npm run build
# Push dist/ contents to gh-pages branch
```

**Static File Server:**
```bash
npm run build
npm run preview  # Local preview
# Serve dist/ folder with any static file server
```

## 🎯 Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Zustand for state management
- React Query for data fetching
- Lightweight Charts for visualization

**Backend:**
- Pure frontend application - no backend required!

## 📊 Data Sources

- **All data generated locally in the browser**
- **Stock Data**: Realistic price simulation with mathematical models
- **Company Info**: Pre-programmed company profiles
- **News**: Template-based news generation
- **Stock List**: 40+ pre-loaded popular stocks
- **Technical Indicators**: Real-time calculation using financial formulas

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Note**: This pure frontend architecture enables instant deployment to any static hosting platform without any server setup or configuration.
