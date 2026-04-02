// Trading Dashboard Component
// Amazing visualization for Command Center

const TRADING_SYMBOLS = [
  { symbol: 'BTCUSD', name: 'Bitcoin', type: 'crypto', price: 67234.56, change: 2.34, volume: '32.5B' },
  { symbol: 'ETHUSD', name: 'Ethereum', type: 'crypto', price: 3456.78, change: -1.23, volume: '15.2B' },
  { symbol: 'AAPL', name: 'Apple Inc.', type: 'stock', price: 178.35, change: 0.87, volume: '45.3M' },
  { symbol: 'TSLA', name: 'Tesla', type: 'stock', price: 234.56, change: -2.45, volume: '89.1M' },
  { symbol: 'EURUSD', name: 'EUR/USD', type: 'forex', price: 1.0845, change: 0.12, volume: '125.4B' },
  { symbol: 'GBPUSD', name: 'GBP/USD', type: 'forex', price: 1.2654, change: -0.08, volume: '98.7B' },
  { symbol: 'SOLUSD', name: 'Solana', type: 'crypto', price: 145.67, change: 5.67, volume: '4.2B' },
  { symbol: 'NVDA', name: 'NVIDIA', type: 'stock', price: 892.34, change: 3.21, volume: '67.8M' }
];

const TRADING_NEWS = [
  { time: '2m ago', headline: 'Bitcoin breaks $67k resistance level', sentiment: 'bullish' },
  { time: '15m ago', headline: 'Fed signals potential rate cuts in Q3', sentiment: 'bullish' },
  { time: '1h ago', headline: 'Tesla announces new factory location', sentiment: 'neutral' },
  { time: '2h ago', headline: 'Ethereum network upgrade postponed', sentiment: 'bearish' },
  { time: '3h ago', headline: 'Tech stocks rally on AI optimism', sentiment: 'bullish' }
];

// Generate random chart data
function generateChartData(points = 50, trend = 'neutral') {
  const data = [];
  let price = 100;
  
  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * 5;
    if (trend === 'up') price += Math.abs(change);
    else if (trend === 'down') price -= Math.abs(change);
    else price += change;
    
    data.push({
      time: i,
      open: price - change/2,
      high: price + Math.abs(change),
      low: price - Math.abs(change),
      close: price
    });
  }
  return data;
}

// Trading Component
function Trading({ socket }) {
  const [activeSymbol, setActiveSymbol] = useState(TRADING_SYMBOLS[0]);
  const [chartData, setChartData] = useState(generateChartData(100, 'up'));
  const [timeframe, setTimeframe] = useState('1H');
  const [orderType, setOrderType] = useState('market');
  const [orderAmount, setOrderAmount] = useState('');
  const [positions, setPositions] = useState([
    { symbol: 'BTCUSD', qty: 0.5, entry: 65432.10, current: 67234.56, pnl: 901.23, type: 'long' },
    { symbol: 'AAPL', qty: 100, entry: 175.20, current: 178.35, pnl: 315.00, type: 'long' },
    { symbol: 'TSLA', qty: -20, entry: 240.00, current: 234.56, pnl: 108.80, type: 'short' }
  ]);
  
  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const last = prev[prev.length - 1];
        const change = (Math.random() - 0.5) * 2;
        const newPrice = last.close + change;
        return [...prev.slice(1), {
          time: last.time + 1,
          open: last.close,
          high: Math.max(last.close, newPrice) + Math.random(),
          low: Math.min(last.close, newPrice) - Math.random(),
          close: newPrice
        }];
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const totalPnL = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  
  return React.createElement('div', { className: 'trading-dashboard' }, [
    React.createElement('style', { key: 'styles' }, `
      .trading-dashboard {
        display: grid;
        grid-template-columns: 280px 1fr 320px;
        gap: 20px;
        height: calc(100vh - 200px);
      }
      
      .trading-panel {
        background: linear-gradient(145deg, #12121a, #1a1a2e);
        border: 1px solid #2d2d44;
        border-radius: 16px;
        padding: 20px;
        overflow: hidden;
      }
      
      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 12px;
        border-bottom: 1px solid #2d2d44;
      }
      
      .panel-title {
        font-size: 14px;
        font-weight: 600;
        color: #e0e0ff;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      
      /* Price Ticker */
      .price-ticker {
        display: flex;
        gap: 4px;
        margin-bottom: 20px;
        padding: 12px;
        background: rgba(0,212,255,0.05);
        border-radius: 12px;
        border: 1px solid rgba(0,212,255,0.1);
        overflow-x: auto;
      }
      
      .ticker-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: rgba(10,10,15,0.5);
        border-radius: 8px;
        white-space: nowrap;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
      }
      
      .ticker-item:hover {
        border-color: #00d4ff;
        background: rgba(0,212,255,0.1);
      }
      
      .ticker-item.active {
        border-color: #00d4ff;
        background: rgba(0,212,255,0.15);
      }
      
      .ticker-symbol {
        font-weight: 600;
        color: #e0e0ff;
        font-size: 13px;
      }
      
      .ticker-price {
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        color: #00d4ff;
      }
      
      .ticker-change {
        font-size: 11px;
        padding: 2px 6px;
        border-radius: 4px;
        font-family: 'JetBrains Mono', monospace;
      }
      
      .ticker-change.up {
        background: rgba(0,255,136,0.2);
        color: #00ff88;
      }
      
      .ticker-change.down {
        background: rgba(255,51,102,0.2);
        color: #ff3366;
      }
      
      /* Watchlist */
      .watchlist-item {
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 12px;
        padding: 12px;
        margin-bottom: 8px;
        background: rgba(10,10,15,0.3);
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
      }
      
      .watchlist-item:hover {
        border-color: #00d4ff;
        background: rgba(0,212,255,0.05);
      }
      
      .watchlist-item.active {
        border-color: #00d4ff;
        background: rgba(0,212,255,0.1);
      }
      
      .watchlist-info h4 {
        font-size: 13px;
        color: #e0e0ff;
        margin-bottom: 2px;
      }
      
      .watchlist-info span {
        font-size: 11px;
        color: #8b8bb0;
      }
      
      .watchlist-price {
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        color: #e0e0ff;
        text-align: right;
      }
      
      .watchlist-change {
        font-family: 'JetBrains Mono', monospace;
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 6px;
        min-width: 60px;
        text-align: center;
      }
      
      .watchlist-change.up {
        background: rgba(0,255,136,0.15);
        color: #00ff88;
      }
      
      .watchlist-change.down {
        background: rgba(255,51,102,0.15);
        color: #ff3366;
      }
      
      /* Chart Section */
      .chart-container {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      
      .chart-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      
      .chart-symbol {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      
      .chart-symbol h2 {
        font-size: 24px;
        font-weight: 700;
        color: #e0e0ff;
      }
      
      .chart-symbol span {
        font-size: 12px;
        color: #8b8bb0;
        padding: 4px 8px;
        background: rgba(0,212,255,0.1);
        border-radius: 6px;
      }
      
      .chart-price {
        text-align: right;
      }
      
      .chart-price .price {
        font-size: 32px;
        font-weight: 700;
        font-family: 'JetBrains Mono', monospace;
        color: #00d4ff;
      }
      
      .chart-price .change {
        font-size: 14px;
        margin-top: 4px;
      }
      
      .timeframe-selector {
        display: flex;
        gap: 4px;
      }
      
      .timeframe-btn {
        padding: 6px 12px;
        background: transparent;
        border: 1px solid #2d2d44;
        color: #8b8bb0;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
      }
      
      .timeframe-btn:hover {
        border-color: #00d4ff;
        color: #00d4ff;
      }
      
      .timeframe-btn.active {
        background: rgba(0,212,255,0.15);
        border-color: #00d4ff;
        color: #00d4ff;
      }
      
      /* Candlestick Chart */
      .candlestick-chart {
        flex: 1;
        background: rgba(10,10,15,0.3);
        border-radius: 12px;
        padding: 16px;
        position: relative;
        min-height: 400px;
      }
      
      .chart-svg {
        width: 100%;
        height: 100%;
      }
      
      .candle {
        transition: all 0.3s;
      }
      
      .candle:hover {
        opacity: 0.8;
      }
      
      /* Order Panel */
      .order-panel {
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      
      .order-type-selector {
        display: flex;
        gap: 8px;
      }
      
      .order-type-btn {
        flex: 1;
        padding: 10px;
        background: transparent;
        border: 1px solid #2d2d44;
        color: #8b8bb0;
        border-radius: 8px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.2s;
      }
      
      .order-type-btn.active {
        background: rgba(0,212,255,0.15);
        border-color: #00d4ff;
        color: #00d4ff;
      }
      
      .order-input {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      
      .order-input label {
        font-size: 12px;
        color: #8b8bb0;
      }
      
      .order-input input {
        padding: 12px;
        background: rgba(10,10,15,0.5);
        border: 1px solid #2d2d44;
        border-radius: 8px;
        color: #e0e0ff;
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
      }
      
      .order-input input:focus {
        outline: none;
        border-color: #00d4ff;
      }
      
      .order-buttons {
        display: flex;
        gap: 12px;
      }
      
      .buy-btn, .sell-btn {
        flex: 1;
        padding: 14px;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 14px;
      }
      
      .buy-btn {
        background: linear-gradient(135deg, #00ff88, #00cc6a);
        color: #0a0a0f;
      }
      
      .sell-btn {
        background: linear-gradient(135deg, #ff3366, #cc2952);
        color: white;
      }
      
      .buy-btn:hover, .sell-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.3);
      }
      
      /* Positions Panel */
      .positions-list {
        margin-top: 16px;
      }
      
      .position-item {
        display: grid;
        grid-template-columns: 1fr auto auto;
        gap: 12px;
        padding: 12px;
        margin-bottom: 8px;
        background: rgba(10,10,15,0.3);
        border-radius: 10px;
        border-left: 3px solid transparent;
      }
      
      .position-item.long {
        border-left-color: #00ff88;
      }
      
      .position-item.short {
        border-left-color: #ff3366;
      }
      
      .position-info h4 {
        font-size: 13px;
        color: #e0e0ff;
      }
      
      .position-info span {
        font-size: 11px;
        color: #8b8bb0;
      }
      
      .position-qty {
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        color: #e0e0ff;
      }
      
      .position-pnl {
        font-family: 'JetBrains Mono', monospace;
        font-size: 13px;
        padding: 4px 8px;
        border-radius: 6px;
      }
      
      .position-pnl.positive {
        background: rgba(0,255,136,0.15);
        color: #00ff88;
      }
      
      .position-pnl.negative {
        background: rgba(255,51,102,0.15);
        color: #ff3366;
      }
      
      .total-pnl {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        margin-top: 16px;
        background: rgba(10,10,15,0.5);
        border-radius: 10px;
      }
      
      .total-pnl span {
        font-size: 14px;
        color: #8b8bb0;
      }
      
      .total-pnl .value {
        font-size: 20px;
        font-weight: 700;
        font-family: 'JetBrains Mono', monospace;
      }
      
      /* News Feed */
      .news-item {
        padding: 12px;
        margin-bottom: 8px;
        background: rgba(10,10,15,0.3);
        border-radius: 10px;
        border-left: 3px solid transparent;
      }
      
      .news-item.bullish { border-left-color: #00ff88; }
      .news-item.bearish { border-left-color: #ff3366; }
      .news-item.neutral { border-left-color: #8b8bb0; }
      
      .news-time {
        font-size: 11px;
        color: #8b8bb0;
        margin-bottom: 4px;
      }
      
      .news-headline {
        font-size: 13px;
        color: #e0e0ff;
        line-height: 1.4;
      }
      
      /* Metrics Grid */
      .metrics-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
        margin-top: 16px;
      }
      
      .metric-item {
        padding: 12px;
        background: rgba(10,10,15,0.3);
        border-radius: 10px;
        text-align: center;
      }
      
      .metric-label {
        font-size: 11px;
        color: #8b8bb0;
        margin-bottom: 4px;
      }
      
      .metric-value {
        font-size: 16px;
        font-weight: 600;
        font-family: 'JetBrains Mono', monospace;
        color: #e0e0ff;
      }
    `),
    
    // Price Ticker
    React.createElement('div', { className: 'price-ticker', key: 'ticker' },
      TRADING_SYMBOLS.map(symbol =>
        React.createElement('div', {
          key: symbol.symbol,
          className: `ticker-item ${activeSymbol.symbol === symbol.symbol ? 'active' : ''}`,
          onClick: () => {
            setActiveSymbol(symbol);
            setChartData(generateChartData(100, symbol.change > 0 ? 'up' : 'down'));
          }
        }, [
          React.createElement('span', { className: 'ticker-symbol', key: 'sym' }, symbol.symbol),
          React.createElement('span', { className: 'ticker-price', key: 'price' }, 
            symbol.price.toLocaleString('en-US', { minimumFractionDigits: symbol.type === 'forex' ? 4 : 2 })
          ),
          React.createElement('span', { 
            className: `ticker-change ${symbol.change >= 0 ? 'up' : 'down'}`,
            key: 'change' 
          }, `${symbol.change >= 0 ? '+' : ''}${symbol.change}%`)
        ])
      )
    ),
    
    // Left Panel - Watchlist
    React.createElement('div', { className: 'trading-panel', key: 'watchlist' }, [
      React.createElement('div', { className: 'panel-header', key: 'header' }, [
        React.createElement('span', { className: 'panel-title', key: 'title' }, '📊 Watchlist'),
        React.createElement('i', { className: 'fas fa-ellipsis-v', style: { color: '#8b8bb0', cursor: 'pointer' }, key: 'menu' })
      ]),
      
      // Watchlist Items
      ...TRADING_SYMBOLS.map(symbol =
        React.createElement('div', {
          key: symbol.symbol,
          className: `watchlist-item ${activeSymbol.symbol === symbol.symbol ? 'active' : ''}`,
          onClick: () => {
            setActiveSymbol(symbol);
            setChartData(generateChartData(100, symbol.change > 0 ? 'up' : 'down'));
          }
        }, [
          React.createElement('div', { className: 'watchlist-info', key: 'info' }, [
            React.createElement('h4', { key: 'name' }, symbol.name),
            React.createElement('span', { key: 'type' }, `${symbol.type} • Vol: ${symbol.volume}`)
          ]),
          React.createElement('div', { className: 'watchlist-price', key: 'price' },
            symbol.price.toLocaleString('en-US', { minimumFractionDigits: symbol.type === 'forex' ? 4 : 2 })
          ),
          React.createElement('div', { 
            className: `watchlist-change ${symbol.change >= 0 ? 'up' : 'down'}`,
            key: 'change'
          }, `${symbol.change >= 0 ? '+' : ''}${symbol.change}%`)
        ])
      ),
      
      // Market Metrics
      React.createElement('div', { className: 'panel-header', style: { marginTop: '24px' }, key: 'metrics-header' },
        React.createElement('span', { className: 'panel-title' }, '📈 Market Metrics')
      ),
      
      React.createElement('div', { className: 'metrics-grid', key: 'metrics' }, [
        React.createElement('div', { className: 'metric-item', key: 'vol' }, [
          React.createElement('div', { className: 'metric-label' }, '24h Volume'),
          React.createElement('div', { className: 'metric-value' }, '$2.4T')
        ]),
        React.createElement('div', { className: 'metric-item', key: 'dom' }, [
          React.createElement('div', { className: 'metric-label' }, 'BTC Dominance'),
          React.createElement('div', { className: 'metric-value' }, '52.3%')
        ]),
        React.createElement('div', { className: 'metric-item', key: 'fear' }, [
          React.createElement('div', { className: 'metric-label' }, 'Fear & Greed'),
          React.createElement('div', { className: 'metric-value', style: { color: '#00ff88' } }, '78')
        ]),
        React.createElement('div', { className: 'metric-item', key: 'liquid' }, [
          React.createElement('div', { className: 'metric-label' }, 'Liquidations'),
          React.createElement('div', { className: 'metric-value', style: { color: '#ff3366' } }, '$45.2M')
        ])
      ])
    ]),
    
    // Center Panel - Chart
    React.createElement('div', { className: 'trading-panel chart-container', key: 'chart' }, [
      React.createElement('div', { className: 'chart-header', key: 'header' }, [
        React.createElement('div', { className: 'chart-symbol', key: 'symbol' }, [
          React.createElement('h2', { key: 'name' }, activeSymbol.name),
          React.createElement('span', { key: 'type' }, activeSymbol.type.toUpperCase())
        ]),
        React.createElement('div', { className: 'chart-price', key: 'price' }, [
          React.createElement('div', { className: 'price' }, 
            activeSymbol.price.toLocaleString('en-US', { minimumFractionDigits: activeSymbol.type === 'forex' ? 4 : 2 })
          ),
          React.createElement('div', { 
            className: `change ${activeSymbol.change >= 0 ? 'up' : 'down'}`,
            key: 'change'
          }, [
            React.createElement('i', { className: `fas fa-caret-${activeSymbol.change >= 0 ? 'up' : 'down'}` }),
            ` ${Math.abs(activeSymbol.change)}%`
          ])
        ])
      ]),
      
      // Timeframe Selector
      React.createElement('div', { className: 'timeframe-selector', key: 'timeframe' },
        ['1m', '5m', '15m', '1H', '4H', '1D', '1W'].map(tf =
          React.createElement('button', {
            key: tf,
            className: `timeframe-btn ${timeframe === tf ? 'active' : ''}`,
            onClick: () => setTimeframe(tf)
          }, tf)
        )
      ),
      
      // Candlestick Chart (SVG)
      React.createElement('div', { className: 'candlestick-chart', key: 'chart-area' },
        React.createElement(CandlestickChart, { data: chartData })
      ),
      
      // News Feed
      React.createElement('div', { style: { marginTop: '20px' }, key: 'news' }, [
        React.createElement('div', { className: 'panel-header', key: 'news-header' },
          React.createElement('span', { className: 'panel-title' }, '🔥 Breaking News')
        ),
        ...TRADING_NEWS.map((news, i) =
          React.createElement('div', {
            key: i,
            className: `news-item ${news.sentiment}`
          }, [
            React.createElement('div', { className: 'news-time', key: 'time' }, news.time),
            React.createElement('div', { className: 'news-headline', key: 'headline' }, news.headline)
          ])
        )
      ])
    ]),
    
    // Right Panel - Order & Positions
    React.createElement('div', { className: 'trading-panel', key: 'order' }, [
      // Order Entry
      React.createElement('div', { className: 'panel-header', key: 'order-header' },
        React.createElement('span', { className: 'panel-title' }, '💰 Order Entry')
      ),
      
      React.createElement('div', { className: 'order-type-selector', key: 'order-types' },
        ['market', 'limit', 'stop'].map(type =
          React.createElement('button', {
            key: type,
            className: `order-type-btn ${orderType === type ? 'active' : ''}`,
            onClick: () => setOrderType(type)
          }, type.toUpperCase())
        )
      ),
      
      React.createElement('div', { className: 'order-input', key: 'input' }, [
        React.createElement('label', { key: 'label' }, `Amount (${activeSymbol.symbol})`),
        React.createElement('input', {
          key: 'field',
          type: 'number',
          placeholder: '0.00',
          value: orderAmount,
          onChange: (e) => setOrderAmount(e.target.value)
        })
      ]),
      
      React.createElement('div', { className: 'order-buttons', key: 'buttons' }, [
        React.createElement('button', { className: 'buy-btn', key: 'buy' }, [
          React.createElement('i', { className: 'fas fa-arrow-up', key: 'icon' }),
          ' BUY'
        ]),
        React.createElement('button', { className: 'sell-btn', key: 'sell' }, [
          React.createElement('i', { className: 'fas fa-arrow-down', key: 'icon' }),
          ' SELL'
        ])
      ]),
      
      // Positions
      React.createElement('div', { className: 'panel-header', style: { marginTop: '24px' }, key: 'pos-header' },
        React.createElement('span', { className: 'panel-title' }, '📂 Positions')
      ),
      
      React.createElement('div', { className: 'positions-list', key: 'positions' },
        positions.map((pos, i) =
          React.createElement('div', {
            key: i,
            className: `position-item ${pos.type}`
          }, [
            React.createElement('div', { className: 'position-info', key: 'info' }, [
              React.createElement('h4', { key: 'sym' }, pos.symbol),
              React.createElement('span', { key: 'entry' }, `Entry: $${pos.entry}`)
            ]),
            React.createElement('div', { className: 'position-qty', key: 'qty' },
              `${pos.qty > 0 ? '+' : ''}${pos.qty}`
            ),
            React.createElement('div', { 
              className: `position-pnl ${pos.pnl >= 0 ? 'positive' : 'negative'}`,
              key: 'pnl'
            }, `${pos.pnl >= 0 ? '+' : ''}$${pos.pnl.toFixed(2)}`)
          ])
        )
      ),
      
      // Total P&L
      React.createElement('div', { className: 'total-pnl', key: 'total' }, [
        React.createElement('span', { key: 'label' }, 'Total P&L'),
        React.createElement('div', { 
          className: 'value',
          style: { color: totalPnL >= 0 ? '#00ff88' : '#ff3366' },
          key: 'value'
        }, `${totalPnL >= 0 ? '+' : ''}$${totalPnL.toFixed(2)}`)
      ])
    ])
  ]);
}

// Candlestick Chart Component
function CandlestickChart({ data }) {
  const svgRef = React.useRef(null);
  
  React.useEffect(() => {
    if (!svgRef.current) return;
    
    const svg = svgRef.current;
    const width = svg.clientWidth;
    const height = svg.clientHeight;
    const padding = 40;
    
    // Calculate scales
    const prices = data.flatMap(d => [d.high, d.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    
    const candleWidth = (width - padding * 2) / data.length * 0.7;
    const candleSpacing = (width - padding * 2) / data.length;
    
    // Clear SVG
    svg.innerHTML = '';
    
    // Draw grid lines
    for (let i = 0; i <= 5; i++) {
      const y = padding + (height - padding * 2) * i / 5;
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', padding);
      line.setAttribute('y1', y);
      line.setAttribute('x2', width - padding);
      line.setAttribute('y2', y);
      line.setAttribute('stroke', '#2d2d44');
      line.setAttribute('stroke-width', '1');
      line.setAttribute('stroke-dasharray', '4,4');
      svg.appendChild(line);
      
      // Price label
      const price = maxPrice - (priceRange * i / 5);
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', width - padding + 5);
      text.setAttribute('y', y + 4);
      text.setAttribute('fill', '#8b8bb0');
      text.setAttribute('font-size', '10');
      text.setAttribute('font-family', 'JetBrains Mono, monospace');
      text.textContent = price.toFixed(2);
      svg.appendChild(text);
    }
    
    // Draw candles
    data.forEach((candle, i) => {
      const x = padding + i * candleSpacing + candleSpacing / 2;
      const isBullish = candle.close >= candle.open;
      const color = isBullish ? '#00ff88' : '#ff3366';
      
      // Wick
      const wick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      wick.setAttribute('x1', x);
      wick.setAttribute('y1', padding + (maxPrice - candle.high) / priceRange * (height - padding * 2));
      wick.setAttribute('x2', x);
      wick.setAttribute('y2', padding + (maxPrice - candle.low) / priceRange * (height - padding * 2));
      wick.setAttribute('stroke', color);
      wick.setAttribute('stroke-width', '1');
      svg.appendChild(wick);
      
      // Body
      const bodyHeight = Math.abs(candle.close - candle.open) / priceRange * (height - padding * 2);
      const bodyY = padding + (maxPrice - Math.max(candle.close, candle.open)) / priceRange * (height - padding * 2);
      
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', x - candleWidth / 2);
      rect.setAttribute('y', bodyY);
      rect.setAttribute('width', candleWidth);
      rect.setAttribute('height', Math.max(bodyHeight, 2));
      rect.setAttribute('fill', color);
      rect.setAttribute('rx', '2');
      rect.setAttribute('class', 'candle');
      svg.appendChild(rect);
    });
  }, [data]);
  
  return React.createElement('svg', {
    ref: svgRef,
    className: 'chart-svg',
    viewBox: `0 0 100 100`,
    preserveAspectRatio: 'none'
  });
}

// Export for use in main app
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Trading, CandlestickChart };
}