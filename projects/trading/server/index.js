// Trading Bot Server
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const TradingBot = require('./bot/trading-bot');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const PORT = process.env.TRADING_PORT || 3457;

// Store trading bot instance
let tradingBot = null;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dashboard')));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../dashboard', 'trading-dashboard.html'));
});

// Bot API endpoints
app.get('/api/bot/status', (req, res) => {
  if (!tradingBot) {
    return res.json({ isRunning: false, mode: 'paper' });
  }
  res.json(tradingBot.getStatus());
});

app.post('/api/bot/start', (req, res) => {
  try {
    const { strategy = 'momentum', config = {} } = req.body;
    
    if (!tradingBot) {
      tradingBot = new TradingBot({
        mode: 'paper', // Always start in paper trading mode
        initialBalance: config.initialBalance || 10000,
        symbols: config.symbols || ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA']
      });
      
      // Setup event listeners
      tradingBot.on('trade', (trade) => {
        io.emit('trade', trade);
      });
      
      tradingBot.on('positionOpened', (position) => {
        io.emit('positionOpened', position);
      });
      
      tradingBot.on('positionClosed', (position) => {
        io.emit('positionClosed', position);
      });
      
      tradingBot.on('positionUpdate', (position) => {
        io.emit('positionUpdate', position);
      });
      
      tradingBot.on('portfolioUpdate', (portfolio) => {
        io.emit('portfolioUpdate', portfolio);
      });
      
      tradingBot.on('marketData', (data) => {
        io.emit('marketData', data);
      });
    }
    
    tradingBot.start(strategy);
    res.json({ success: true, message: 'Trading bot started', strategy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/bot/stop', (req, res) => {
  if (!tradingBot) {
    return res.status(400).json({ success: false, error: 'Bot not running' });
  }
  
  tradingBot.stop();
  res.json({ success: true, message: 'Trading bot stopped' });
});

app.post('/api/bot/manual-trade', (req, res) => {
  if (!tradingBot) {
    return res.status(400).json({ success: false, error: 'Bot not running' });
  }
  
  const { symbol, action, quantity } = req.body;
  
  // Get current price
  tradingBot.fetchMarketData(symbol).then(data => {
    if (action === 'buy') {
      tradingBot.buy(symbol, data.price, 'Manual trade');
      res.json({ success: true, message: `Buy order placed for ${symbol}` });
    } else if (action === 'sell') {
      tradingBot.sell(symbol, data.price, 'Manual trade');
      res.json({ success: true, message: `Sell order placed for ${symbol}` });
    } else {
      res.status(400).json({ success: false, error: 'Invalid action' });
    }
  }).catch(error => {
    res.status(500).json({ success: false, error: error.message });
  });
});

// Strategy API
app.get('/api/strategies', (req, res) => {
  res.json([
    {
      name: 'momentum',
      displayName: 'Momentum Strategy',
      description: 'Buy on upward momentum with volume confirmation. Sell on take profit, stop loss, or momentum reversal.',
      parameters: {
        momentumThreshold: { type: 'number', default: 2, min: 0.5, max: 10 },
        minVolume: { type: 'number', default: 100000, min: 50000, max: 1000000 }
      }
    },
    {
      name: 'mean-reversion',
      displayName: 'Mean Reversion Strategy',
      description: 'Buy when price is oversold (below lower Bollinger Band), sell when it returns to mean.',
      parameters: {
        bollingerPeriod: { type: 'number', default: 20, min: 10, max: 50 },
        bollingerStdDev: { type: 'number', default: 2, min: 1, max: 3 }
      }
    }
  ]);
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('📊 Trading Dashboard connected');
  
  // Send current status
  if (tradingBot) {
    socket.emit('botStatus', tradingBot.getStatus());
  } else {
    socket.emit('botStatus', { isRunning: false, mode: 'paper' });
  }
  
  socket.on('disconnect', () => {
    console.log('📊 Trading Dashboard disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`📊 Trading Bot Server running on http://localhost:${PORT}`);
  console.log(`💰 Mode: PAPER TRADING (simulated)`);
  console.log(`🤖 Ready to start automated trading`);
});

module.exports = { app, server, io };