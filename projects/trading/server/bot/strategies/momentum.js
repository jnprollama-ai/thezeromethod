// Momentum Trading Strategy
class MomentumStrategy {
  constructor(config = {}) {
    this.config = {
      minVolume: config.minVolume || 100000,
      momentumThreshold: config.momentumThreshold || 2, // 2% price change
      rsiPeriod: config.rsiPeriod || 14,
      ...config
    };
    
    this.priceHistory = new Map(); // Store price history for each symbol
    this.signals = new Map(); // Store recent signals to avoid over-trading
  }

  analyze(symbol, data, currentPosition) {
    // Update price history
    if (!this.priceHistory.has(symbol)) {
      this.priceHistory.set(symbol, []);
    }
    
    const history = this.priceHistory.get(symbol);
    history.push({
      price: data.price,
      volume: data.volume,
      timestamp: data.timestamp
    });
    
    // Keep only last 50 data points
    if (history.length > 50) {
      history.shift();
    }

    // Check if we have enough data
    if (history.length < 20) {
      return { action: 'hold', reason: 'Insufficient data' };
    }

    // Check for recent signals (cooldown period)
    const lastSignal = this.signals.get(symbol);
    if (lastSignal) {
      const timeSinceLastSignal = Date.now() - lastSignal.timestamp;
      if (timeSinceLastSignal < 300000) { // 5 minute cooldown
        return { action: 'hold', reason: 'Cooldown period' };
      }
    }

    // Calculate momentum indicators
    const momentum = this.calculateMomentum(history);
    const volumeSpike = this.detectVolumeSpike(history);
    const trend = this.detectTrend(history);
    
    // Generate signals
    if (!currentPosition) {
      // Buy conditions
      if (momentum > this.config.momentumThreshold && 
          volumeSpike && 
          trend === 'upward') {
        
        this.signals.set(symbol, { action: 'buy', timestamp: Date.now() });
        return {
          action: 'buy',
          reason: `Momentum breakout: +${momentum.toFixed(2)}% with volume spike`,
          confidence: Math.min(momentum / 5, 1) // Confidence 0-1
        };
      }
    } else {
      // Sell conditions
      const entryPrice = currentPosition.entryPrice;
      const currentPrice = data.price;
      const unrealizedPnL = ((currentPrice - entryPrice) / entryPrice) * 100;
      
      // Take profit (3% gain)
      if (unrealizedPnL >= 3) {
        this.signals.set(symbol, { action: 'sell', timestamp: Date.now() });
        return {
          action: 'sell',
          reason: `Take profit: +${unrealizedPnL.toFixed(2)}%`,
          confidence: 1
        };
      }
      
      // Stop loss (2% loss)
      if (unrealizedPnL <= -2) {
        this.signals.set(symbol, { action: 'sell', timestamp: Date.now() });
        return {
          action: 'sell',
          reason: `Stop loss: ${unrealizedPnL.toFixed(2)}%`,
          confidence: 1
        };
      }
      
      // Momentum reversal
      if (momentum < -1.5 && trend === 'downward') {
        this.signals.set(symbol, { action: 'sell', timestamp: Date.now() });
        return {
          action: 'sell',
          reason: `Momentum reversal: ${momentum.toFixed(2)}%`,
          confidence: 0.7
        };
      }
    }

    return { action: 'hold', reason: 'No clear signal' };
  }

  calculateMomentum(history) {
    if (history.length < 10) return 0;
    
    const recent = history.slice(-5); // Last 5 periods
    const older = history.slice(-15, -5); // 10 periods before that
    
    const recentAvg = recent.reduce((sum, h) => sum + h.price, 0) / recent.length;
    const olderAvg = older.reduce((sum, h) => sum + h.price, 0) / older.length;
    
    return ((recentAvg - olderAvg) / olderAvg) * 100;
  }

  detectVolumeSpike(history) {
    if (history.length < 20) return false;
    
    const current = history[history.length - 1].volume;
    const avgVolume = history.slice(-20).reduce((sum, h) => sum + h.volume, 0) / 20;
    
    return current > avgVolume * 1.5; // 50% above average
  }

  detectTrend(history) {
    if (history.length < 20) return 'neutral';
    
    const prices = history.slice(-20).map(h => h.price);
    const firstHalf = prices.slice(0, 10);
    const secondHalf = prices.slice(10);
    
    const firstAvg = firstHalf.reduce((sum, p) => sum + p, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, p) => sum + p, 0) / secondHalf.length;
    
    const change = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    if (change > 1) return 'upward';
    if (change < -1) return 'downward';
    return 'neutral';
  }

  // Calculate Simple Moving Average
  calculateSMA(history, period) {
    if (history.length < period) return null;
    
    const prices = history.slice(-period).map(h => h.price);
    return prices.reduce((sum, p) => sum + p, 0) / period;
  }

  // Calculate RSI (Relative Strength Index)
  calculateRSI(history, period = 14) {
    if (history.length < period + 1) return null;
    
    const prices = history.slice(-period - 1).map(h => h.price);
    let gains = 0;
    let losses = 0;
    
    for (let i = 1; i < prices.length; i++) {
      const change = prices[i] - prices[i - 1];
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }
    
    const avgGain = gains / period;
    const avgLoss = losses / period;
    
    if (avgLoss === 0) return 100;
    
    const rs = avgGain / avgLoss;
    return 100 - (100 / (1 + rs));
  }

  getName() {
    return 'Momentum Strategy';
  }

  getDescription() {
    return 'Buy on upward momentum with volume confirmation. Sell on take profit, stop loss, or momentum reversal.';
  }
}

module.exports = MomentumStrategy;