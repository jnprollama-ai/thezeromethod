// Mean Reversion Strategy
class MeanReversionStrategy {
  constructor(config = {}) {
    this.config = {
      bollingerPeriod: config.bollingerPeriod || 20,
      bollingerStdDev: config.bollingerStdDev || 2,
      oversoldThreshold: config.oversoldThreshold || 30,
      overboughtThreshold: config.overboughtThreshold || 70,
      ...config
    };
    
    this.priceHistory = new Map();
    this.signals = new Map();
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
    if (history.length < this.config.bollingerPeriod) {
      return { action: 'hold', reason: 'Insufficient data' };
    }

    // Calculate Bollinger Bands
    const sma = this.calculateSMA(history, this.config.bollingerPeriod);
    const stdDev = this.calculateStdDev(history, this.config.bollingerPeriod);
    
    const upperBand = sma + (stdDev * this.config.bollingerStdDev);
    const lowerBand = sma - (stdDev * this.config.bollingerStdDev);
    
    const currentPrice = data.price;
    const position = (currentPrice - lowerBand) / (upperBand - lowerBand);

    // Check cooldown
    const lastSignal = this.signals.get(symbol);
    if (lastSignal) {
      const timeSinceLastSignal = Date.now() - lastSignal.timestamp;
      if (timeSinceLastSignal < 300000) { // 5 minute cooldown
        return { action: 'hold', reason: 'Cooldown period' };
      }
    }

    if (!currentPosition) {
      // Buy when price hits lower band (oversold)
      if (position < 0.1 || currentPrice < lowerBand) {
        this.signals.set(symbol, { action: 'buy', timestamp: Date.now() });
        return {
          action: 'buy',
          reason: `Mean reversion: Price below lower Bollinger Band ($${lowerBand.toFixed(2)})`,
          confidence: Math.min((lowerBand - currentPrice) / currentPrice * 100, 1)
        };
      }
    } else {
      const entryPrice = currentPosition.entryPrice;
      const unrealizedPnL = ((currentPrice - entryPrice) / entryPrice) * 100;
      
      // Take profit when price returns to mean (SMA)
      if (currentPrice >= sma * 0.99 && unrealizedPnL > 0) {
        this.signals.set(symbol, { action: 'sell', timestamp: Date.now() });
        return {
          action: 'sell',
          reason: `Mean reversion complete: Price returned to SMA ($${sma.toFixed(2)})`,
          confidence: 1
        };
      }
      
      // Stop loss
      if (unrealizedPnL <= -3) {
        this.signals.set(symbol, { action: 'sell', timestamp: Date.now() });
        return {
          action: 'sell',
          reason: `Stop loss: ${unrealizedPnL.toFixed(2)}%`,
          confidence: 1
        };
      }
      
      // Sell if price hits upper band (overbought)
      if (position > 0.9 || currentPrice > upperBand) {
        this.signals.set(symbol, { action: 'sell', timestamp: Date.now() });
        return {
          action: 'sell',
          reason: `Overbought: Price above upper Bollinger Band ($${upperBand.toFixed(2)})`,
          confidence: 0.8
        };
      }
    }

    return { action: 'hold', reason: 'No clear signal' };
  }

  calculateSMA(history, period) {
    const prices = history.slice(-period).map(h => h.price);
    return prices.reduce((sum, p) => sum + p, 0) / period;
  }

  calculateStdDev(history, period) {
    const prices = history.slice(-period).map(h => h.price);
    const mean = prices.reduce((sum, p) => sum + p, 0) / period;
    const squaredDiffs = prices.map(p => Math.pow(p - mean, 2));
    const avgSquaredDiff = squaredDiffs.reduce((sum, sq) => sum + sq, 0) / period;
    return Math.sqrt(avgSquaredDiff);
  }

  getName() {
    return 'Mean Reversion Strategy';
  }

  getDescription() {
    return 'Buy when price is oversold (below lower Bollinger Band), sell when it returns to mean or becomes overbought.';
  }
}

module.exports = MeanReversionStrategy;