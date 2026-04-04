// Core Trading Bot
const EventEmitter = require('events');
const axios = require('axios');

class TradingBot extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      mode: config.mode || 'paper', // 'paper' or 'live'
      initialBalance: config.initialBalance || 10000,
      maxPositionSize: config.maxPositionSize || 0.1, // 10% of portfolio
      maxDailyLoss: config.maxDailyLoss || 0.02, // 2% daily loss limit
      symbols: config.symbols || ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA'],
      ...config
    };
    
    this.positions = new Map();
    this.balance = this.config.initialBalance;
    this.dailyStats = {
      trades: 0,
      profit: 0,
      loss: 0,
      startBalance: this.config.initialBalance
    };
    
    this.isRunning = false;
    this.strategy = null;
    this.dataInterval = null;
  }

  async start(strategyName = 'momentum') {
    if (this.isRunning) {
      console.log('⚠️ Trading bot already running');
      return;
    }
    
    console.log(`🚀 Starting Trading Bot (${this.config.mode} mode)`);
    console.log(`💰 Initial Balance: $${this.config.initialBalance.toFixed(2)}`);
    console.log(`📊 Trading Symbols: ${this.config.symbols.join(', ')}`);
    
    // Load strategy
    this.strategy = this.loadStrategy(strategyName);
    
    this.isRunning = true;
    this.emit('started', { balance: this.balance, mode: this.config.mode });
    
    // Start data collection
    this.startDataCollection();
    
    // Start trading loop
    this.tradingLoop();
    
    console.log('✅ Trading bot started successfully');
  }

  stop() {
    if (!this.isRunning) return;
    
    console.log('🛑 Stopping Trading Bot...');
    this.isRunning = false;
    
    if (this.dataInterval) {
      clearInterval(this.dataInterval);
    }
    
    this.emit('stopped', { 
      finalBalance: this.balance,
      totalReturn: ((this.balance - this.config.initialBalance) / this.config.initialBalance * 100).toFixed(2) + '%'
    });
    
    console.log('✅ Trading bot stopped');
  }

  loadStrategy(strategyName) {
    try {
      const Strategy = require(`./strategies/${strategyName}`);
      return new Strategy(this.config);
    } catch (error) {
      console.error(`❌ Failed to load strategy ${strategyName}:`, error.message);
      // Fallback to momentum
      const MomentumStrategy = require('./strategies/momentum');
      return new MomentumStrategy(this.config);
    }
  }

  async startDataCollection() {
    // Collect market data every 30 seconds
    this.dataInterval = setInterval(async () => {
      if (!this.isRunning) return;
      
      for (const symbol of this.config.symbols) {
        try {
          const data = await this.fetchMarketData(symbol);
          this.emit('marketData', { symbol, ...data });
          
          // Check for trading signals
          await this.checkSignals(symbol, data);
        } catch (error) {
          console.error(`❌ Error fetching data for ${symbol}:`, error.message);
        }
      }
    }, 30000);
  }

  async fetchMarketData(symbol) {
    // Using Yahoo Finance API (free)
    try {
      const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`);
      const result = response.data.chart.result[0];
      
      const prices = result.indicators.quote[0].close;
      const currentPrice = prices[prices.length - 1];
      const previousPrice = prices[prices.length - 2] || currentPrice;
      
      // Calculate simple indicators
      const sma20 = this.calculateSMA(prices.slice(-20));
      const sma50 = this.calculateSMA(prices.slice(-50));
      
      return {
        price: currentPrice,
        change: ((currentPrice - previousPrice) / previousPrice * 100),
        volume: result.indicators.quote[0].volume.slice(-1)[0],
        sma20,
        sma50,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      // Return mock data if API fails
      return {
        price: 150 + Math.random() * 50,
        change: (Math.random() - 0.5) * 2,
        volume: Math.floor(Math.random() * 1000000),
        sma20: 145,
        sma50: 140,
        timestamp: new Date().toISOString()
      };
    }
  }

  calculateSMA(prices) {
    const validPrices = prices.filter(p => p !== null && p !== undefined);
    if (validPrices.length === 0) return 0;
    return validPrices.reduce((sum, price) => sum + price, 0) / validPrices.length;
  }

  async checkSignals(symbol, data) {
    if (!this.strategy) return;
    
    const signal = this.strategy.analyze(symbol, data, this.positions.get(symbol));
    
    if (signal.action === 'buy') {
      await this.buy(symbol, data.price, signal.reason);
    } else if (signal.action === 'sell') {
      await this.sell(symbol, data.price, signal.reason);
    }
  }

  async buy(symbol, price, reason) {
    // Check if we already have a position
    if (this.positions.has(symbol)) {
      console.log(`⚠️ Already holding ${symbol}, skipping buy`);
      return;
    }
    
    // Calculate position size (max 10% of portfolio)
    const maxPositionValue = this.balance * this.config.maxPositionSize;
    const quantity = Math.floor(maxPositionValue / price);
    
    if (quantity < 1) {
      console.log(`⚠️ Insufficient funds to buy ${symbol}`);
      return;
    }
    
    const totalCost = quantity * price;
    
    // Check daily loss limit
    if (this.dailyStats.loss > this.config.maxDailyLoss * this.config.initialBalance) {
      console.log(`🛑 Daily loss limit reached. No new positions.`);
      return;
    }
    
    // Execute buy
    this.balance -= totalCost;
    const position = {
      symbol,
      quantity,
      entryPrice: price,
      entryTime: new Date().toISOString(),
      totalCost,
      currentPrice: price,
      unrealizedPnL: 0
    };
    
    this.positions.set(symbol, position);
    
    const trade = {
      id: `trade-${Date.now()}`,
      symbol,
      action: 'buy',
      quantity,
      price,
      totalCost,
      timestamp: new Date().toISOString(),
      reason,
      mode: this.config.mode
    };
    
    this.emit('trade', trade);
    this.emit('positionOpened', position);
    this.dailyStats.trades++;
    
    console.log(`🟢 BOUGHT ${quantity} ${symbol} @ $${price.toFixed(2)} (${reason})`);
    console.log(`   Cost: $${totalCost.toFixed(2)} | Balance: $${this.balance.toFixed(2)}`);
  }

  async sell(symbol, price, reason) {
    const position = this.positions.get(symbol);
    if (!position) {
      console.log(`⚠️ No position in ${symbol} to sell`);
      return;
    }
    
    const totalValue = position.quantity * price;
    const realizedPnL = totalValue - position.totalCost;
    
    // Execute sell
    this.balance += totalValue;
    
    const trade = {
      id: `trade-${Date.now()}`,
      symbol,
      action: 'sell',
      quantity: position.quantity,
      price,
      totalValue,
      realizedPnL,
      timestamp: new Date().toISOString(),
      reason,
      mode: this.config.mode
    };
    
    this.emit('trade', trade);
    this.emit('positionClosed', { ...position, exitPrice: price, realizedPnL });
    
    // Update daily stats
    if (realizedPnL > 0) {
      this.dailyStats.profit += realizedPnL;
    } else {
      this.dailyStats.loss += Math.abs(realizedPnL);
    }
    
    this.positions.delete(symbol);
    this.dailyStats.trades++;
    
    const emoji = realizedPnL >= 0 ? '🔴' : '🔴';
    console.log(`${emoji} SOLD ${position.quantity} ${symbol} @ $${price.toFixed(2)} (${reason})`);
    console.log(`   P&L: $${realizedPnL.toFixed(2)} | Balance: $${this.balance.toFixed(2)}`);
  }

  tradingLoop() {
    // Update positions every 10 seconds
    setInterval(() => {
      if (!this.isRunning) return;
      
      // Update unrealized P&L
      for (const [symbol, position] of this.positions) {
        this.fetchMarketData(symbol).then(data => {
          position.currentPrice = data.price;
          position.unrealizedPnL = (data.price - position.entryPrice) * position.quantity;
          this.emit('positionUpdate', position);
        });
      }
      
      // Emit portfolio update
      const totalValue = this.balance + Array.from(this.positions.values())
        .reduce((sum, pos) => sum + (pos.quantity * pos.currentPrice), 0);
      
      this.emit('portfolioUpdate', {
        balance: this.balance,
        positions: Array.from(this.positions.values()),
        totalValue,
        dailyReturn: ((totalValue - this.dailyStats.startBalance) / this.dailyStats.startBalance * 100).toFixed(2),
        dailyStats: this.dailyStats
      });
    }, 10000);
  }

  getStatus() {
    const totalValue = this.balance + Array.from(this.positions.values())
      .reduce((sum, pos) => sum + (pos.quantity * pos.currentPrice), 0);
    
    return {
      isRunning: this.isRunning,
      mode: this.config.mode,
      balance: this.balance,
      positions: Array.from(this.positions.values()),
      totalValue,
      totalReturn: ((totalValue - this.config.initialBalance) / this.config.initialBalance * 100).toFixed(2) + '%',
      dailyStats: this.dailyStats
    };
  }
}

module.exports = TradingBot;