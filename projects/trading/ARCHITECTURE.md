# Trading Dashboard Architecture

## Overview
A lightweight automated trading system with bot capabilities, focused on simplicity and risk management.

## Core Components

### 1. Trading Bot Engine
- Strategy execution engine
- Position management
- Order routing (paper trading first)
- Risk controls

### 2. Market Data Module
- Real-time price feeds
- Historical data storage
- Technical indicators
- WebSocket connections

### 3. Strategy System
- Rule-based strategies
- Configurable parameters
- Backtesting capability
- Performance tracking

### 4. Dashboard Interface
- Real-time P&L
- Open positions
- Bot status
- Strategy configuration

## Architecture Decisions

### Backend
- **Node.js + Express**: For trading engine and API
- **Socket.io**: Real-time data to frontend
- **SQLite**: Lightweight position/trade storage
- **Puppeteer/Playwright**: Web scraping for data (free alternative to paid APIs)

### Frontend
- **Command Center integration**: Add Trading tab
- **Real-time charts**: Lightweight charting library
- **Bot controls**: Start/stop/configure

### Data Sources
- **Yahoo Finance API**: Free market data
- **Alpha Vantage**: Free tier available
- **Web scraping**: Backup data source

## Risk Management
- Max position size limits
- Daily loss limits
- Stop-loss orders
- Portfolio diversification rules

## Phase 1: MVP Features
1. Paper trading simulation
2. Basic momentum strategy
3. Position tracking
4. Simple dashboard
5. Manual trade execution

## Phase 2: Auto-Trading
1. Automated entry/exit
2. Multiple strategies
3. Backtesting engine
4. Performance analytics

## Security
- No real money until thoroughly tested
- Paper trading validation required
- Configurable risk limits
- Audit logging

## File Structure
```
trading/
├── server/
│   ├── index.js              # Main trading server
│   ├── bot/
│   │   ├── trading-bot.js    # Core bot logic
│   │   ├── strategies/
│   │   │   ├── momentum.js   # Momentum strategy
│   │   │   └── mean-reversion.js
│   │   └── risk-manager.js   # Risk controls
│   ├── data/
│   │   ├── market-data.js    # Data feeds
│   │   └── indicators.js     # Technical indicators
│   └── api/
│       ├── positions.js      # Position API
│       └── trades.js         # Trade API
├── dashboard/
│   └── trading-dashboard.html
└── config/
    └── trading-config.json
```
