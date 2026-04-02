const { useState, useEffect, useRef } = React;

// Pokemon GIF URLs
const POKEMON_GIFS = {
  150: 'https://play.pokemonshowdown.com/sprites/gen5ani/mewtwo.gif',
  65: 'https://play.pokemonshowdown.com/sprites/gen5ani/alakazam.gif',
  78: 'https://play.pokemonshowdown.com/sprites/gen5ani/rapidash.gif',
  137: 'https://play.pokemonshowdown.com/sprites/gen5ani/porygon.gif',
  39: 'https://play.pokemonshowdown.com/sprites/gen5ani/jigglypuff.gif'
};

// Goals Data
const GOALS_DATA = {
  revenue: {
    current: 0,
    target: 500,
    streams: {
      zma: { current: 0, target: 200 },
      affiliates: { current: 0, target: 100 },
      ads: { current: 0, target: 75 },
      pdftools: { current: 0, target: 100 },
      other: { current: 0, target: 25 }
    }
  },
  trading: {
    winRate: 69,
    totalTrades: 414,
    profitableTrades: 286,
    avgReturn: 0.79,
    maxDrawdown: 20.3,
    status: 'BACKTESTED'
  },
  projects: [
    { name: 'ZMA Website', progress: 95, status: 'LIVE' },
    { name: 'Trading Dashboard', progress: 25, status: 'ACTIVE' },
    { name: 'Zero SaaS', progress: 10, status: 'PLANNING' }
  ]
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({ agents: [], projects: [], kanban: { columns: [] }, chat: [] });
  const [socket, setSocket] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);
  const [serverStatus, setServerStatus] = useState('CONNECTING...');

  useEffect(() => {
    // Try to connect to WebSocket server
    try {
      const newSocket = io('http://localhost:3456', { 
        transports: ['websocket', 'polling'],
        timeout: 5000,
        reconnectionAttempts: 3
      });
      
      newSocket.on('connect', () => {
        setServerStatus('ONLINE');
        console.log('Connected to server');
      });
      
      newSocket.on('disconnect', () => {
        setServerStatus('OFFLINE');
      });
      
      newSocket.on('connect_error', () => {
        setServerStatus('OFFLINE - Standalone Mode');
        // Load default data if server unavailable
        setData({
          agents: GOALS_DATA.projects,
          projects: GOALS_DATA.projects,
          kanban: { columns: [] },
          chat: []
        });
      });
      
      newSocket.on('data', (newData) => {
        setData(newData);
        setServerStatus('ONLINE');
      });
      
      setSocket(newSocket);
      
      return () => newSocket.close();
    } catch (e) {
      setServerStatus('OFFLINE');
    }
  }, []);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [data.chat]);

  const sendMessage = () => { 
    if (!chatInput.trim() || !socket) return; 
    socket.emit('chat-message', chatInput); 
    setChatInput(''); 
  };
  
  const getPokemonGif = (n) => POKEMON_GIFS[n] || '';

  const navItems = [
    { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard' },
    { id: 'goals', icon: 'fa-bullseye', label: '🎯 Goals' },
    { id: 'office', icon: 'fa-building', label: 'Pokemon Office' },
    { id: 'kanban', icon: 'fa-columns', label: 'Kanban' },
    { id: 'projects', icon: 'fa-rocket', label: 'Projects' },
    { id: 'trading', icon: 'fa-chart-line', label: 'Trading 💹' },
    { id: 'chat', icon: 'fa-comments', label: 'Chat' },
    { id: 'console', icon: 'fa-terminal', label: 'Console' }
  ];

  return React.createElement('div', { style: styles.app }, [
    // Header
    React.createElement('header', { style: styles.header, key: 'header' }, [
      React.createElement('div', { style: styles.brand, key: 'brand' }, [
        React.createElement('div', { style: styles.brandLogo, key: 'logo' }, '◈'),
        React.createElement('div', { key: 'text' }, [
          React.createElement('div', { style: styles.brandName, key: 'name' }, 'ZERO COMMAND CENTER'),
          React.createElement('div', { style: styles.brandTagline, key: 'tag' }, 'v4.0 - All Systems Operational')
        ])
      ]),
      React.createElement('div', { style: styles.statusBar, key: 'status' }, [
        React.createElement('div', { 
          style: {...styles.statusIndicator, 
            background: serverStatus.includes('ONLINE') ? 'rgba(0,255,136,0.1)' : 'rgba(255,149,0,0.1)',
            borderColor: serverStatus.includes('ONLINE') ? 'rgba(0,255,136,0.3)' : 'rgba(255,149,0,0.3)',
            color: serverStatus.includes('ONLINE') ? '#00ff88' : '#ff9500'
          }, 
          key: 'server' 
        }, [
          React.createElement('div', { 
            style: {...styles.statusDot, 
              background: serverStatus.includes('ONLINE') ? '#00ff88' : '#ff9500',
              boxShadow: serverStatus.includes('ONLINE') ? '0 0 10px #00ff88' : '0 0 10px #ff9500'
            } 
          }, null),
          React.createElement('span', null, serverStatus)
        ]),
        React.createElement('div', { style: {...styles.statusIndicator, background: 'rgba(0,212,255,0.1)', borderColor: 'rgba(0,212,255,0.3)', color: '#00d4ff'}, key: 'goals' }, [
          React.createElement('i', { className: 'fas fa-bullseye', style: { marginRight: '8px' } }, null),
          React.createElement('span', null, `$${GOALS_DATA.revenue.current}/${GOALS_DATA.revenue.target}`)
        ])
      ])
    ]),

    // Navigation
    React.createElement('nav', { style: styles.navTabs, key: 'nav' },
      navItems.map(item =>
        React.createElement('button', {
          key: item.id,
          style: {...styles.navTab, ...(activeTab === item.id ? styles.navTabActive : {})},
          onClick: () => setActiveTab(item.id)
        }, [
          React.createElement('i', { className: `fas ${item.icon}`, style: { marginRight: '8px' }, key: 'icon' }),
          item.label
        ])
      )
    ),

    // Content
    React.createElement('div', { style: styles.mainContent, key: 'content' }, [
      activeTab === 'dashboard' && React.createElement(Dashboard, { data, setActiveTab, getPokemonGif, key: 'dash' }),
      activeTab === 'goals' && React.createElement(GoalsView, { key: 'goals' }),
      activeTab === 'office' && React.createElement(PokemonOffice, { agents: data.agents || [], getPokemonGif, key: 'office' }),
      activeTab === 'kanban' && React.createElement(KanbanBoard, { columns: data.kanban?.columns || [], key: 'kanban' }),
      activeTab === 'projects' && React.createElement(Projects, { projects: data.projects || [], agents: data.agents || [], getPokemonGif, key: 'proj' }),
      activeTab === 'trading' && React.createElement(Trading, { key: 'trade' }),
      activeTab === 'chat' && React.createElement(Chat, { messages: data.chat || [], agents: data.agents || [], chatInput, setChatInput, sendMessage, chatEndRef, key: 'chat' }),
      activeTab === 'console' && React.createElement(Console, { logs: data.logs || [], key: 'console' })
    ]),

    // Styles
    React.createElement('style', { key: 'styles' }, `
      body { margin: 0; font-family: 'Inter', sans-serif; background: #0a0a0f; color: #e0e0ff; }
      body::before { content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: repeating-linear-gradient(0deg, rgba(0,212,255,0.02), rgba(0,212,255,0.02) 1px, transparent 1px, transparent 2px); pointer-events: none; z-index: 1000; }
    `)
  ]);
}

// Goals View Component
function GoalsView() {
  const revenueProgress = (GOALS_DATA.revenue.current / GOALS_DATA.revenue.target) * 100;
  const totalStreams = Object.values(GOALS_DATA.revenue.streams);
  const streamProgress = totalStreams.reduce((acc, s) => acc + (s.current / s.target), 0) / totalStreams.length * 100;

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s' } }, [
    React.createElement('div', { style: { textAlign: 'center', marginBottom: '30px' }, key: 'title' }, [
      React.createElement('h2', { style: { fontSize: '32px', fontWeight: 700, marginBottom: '10px', background: 'linear-gradient(90deg, #00d4ff, #00ff88)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, '🎯 Goals & Revenue Dashboard'),
      React.createElement('p', { style: { fontSize: '16px', color: '#8b8bb0' } }, 'Track progress toward $500/month target')
    ]),

    // Quick Stats
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }, key: 'stats' }, [
      React.createElement('div', { style: { textAlign: 'center', padding: '20px', background: 'rgba(0,255,136,0.05)', border: '1px solid rgba(0,255,136,0.2)', borderRadius: '12px' }, key: '1' }, [
        React.createElement('div', { style: { fontSize: '36px', fontWeight: 700, color: '#00ff88' } }, `$${GOALS_DATA.revenue.current}`),
        React.createElement('div', { style: { fontSize: '12px', color: '#8b8bb0', marginTop: '5px' } }, 'Current Revenue')
      ]),
      React.createElement('div', { style: { textAlign: 'center', padding: '20px', background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.2)', borderRadius: '12px' }, key: '2' }, [
        React.createElement('div', { style: { fontSize: '36px', fontWeight: 700, color: '#00d4ff' } }, `$${GOALS_DATA.revenue.target}`),
        React.createElement('div', { style: { fontSize: '12px', color: '#8b8bb0', marginTop: '5px' } }, 'Monthly Target')
      ]),
      React.createElement('div', { style: { textAlign: 'center', padding: '20px', background: 'rgba(184,41,221,0.05)', border: '1px solid rgba(184,41,221,0.2)', borderRadius: '12px' }, key: '3' }, [
        React.createElement('div', { style: { fontSize: '36px', fontWeight: 700, color: '#b829dd' } }, `${GOALS_DATA.trading.winRate}%`),
        React.createElement('div', { style: { fontSize: '12px', color: '#8b8bb0', marginTop: '5px' } }, 'Trading Win Rate')
      ]),
      React.createElement('div', { style: { textAlign: 'center', padding: '20px', background: 'rgba(255,149,0,0.05)', border: '1px solid rgba(255,149,0,0.2)', borderRadius: '12px' }, key: '4' }, [
        React.createElement('div', { style: { fontSize: '36px', fontWeight: 700, color: '#ff9500' } }, '3'),
        React.createElement('div', { style: { fontSize: '12px', color: '#8b8bb0', marginTop: '5px' } }, 'Active Projects')
      ])
    ]),

    // Main Cards
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px' }, key: 'cards' }, [
      // Revenue Goal
      React.createElement('div', { style: { background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '16px', padding: '25px' }, key: 'revenue' }, [
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } }, [
          React.createElement('h3', { style: { fontSize: '20px', fontWeight: 600 } }, '💰 Revenue Goal'),
          React.createElement('span', { style: { padding: '6px 12px', background: 'rgba(0,212,255,0.1)', borderRadius: '20px', fontSize: '12px', color: '#00d4ff' } }, 'IN PROGRESS')
        ]),
        React.createElement('div', { style: { fontSize: '42px', fontWeight: 700, marginBottom: '5px', color: '#e0e0ff' } }, `$${GOALS_DATA.revenue.current} / $${GOALS_DATA.revenue.target}`),
        React.createElement('div', { style: { marginBottom: '20px' } }, [
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#8b8bb0' } }, [
            React.createElement('span', null, 'Overall Progress'),
            React.createElement('span', null, `${revenueProgress.toFixed(1)}%`)
          ]),
          React.createElement('div', { style: { height: '10px', background: '#2d2d44', borderRadius: '5px', overflow: 'hidden' } },
            React.createElement('div', { style: { width: `${revenueProgress}%`, height: '100%', background: 'linear-gradient(90deg, #00ff88, #00d4ff)', borderRadius: '5px' } })
          )
        ]),
        React.createElement('div', { style: { borderTop: '1px solid #2d2d44', paddingTop: '15px' } },
          Object.entries(GOALS_DATA.revenue.streams).map(([key, stream], i) =>
            React.createElement('div', { key: i, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < 4 ? '1px solid #2d2d44' : 'none' } }, [
              React.createElement('span', { style: { fontSize: '14px', color: '#e0e0ff', textTransform: 'capitalize' } }, key.replace(/([A-Z])/g, ' $1').trim()),
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } }, [
                React.createElement('span', { style: { fontSize: '14px', fontWeight: 600, color: stream.current > 0 ? '#00ff88' : '#8b8bb0' } }, `$${stream.current}`),
                React.createElement('span', { style: { fontSize: '12px', color: '#8b8bb0' } }, `/ $${stream.target}`)
              ])
            ])
          )
        )
      ]),

      // Trading Strategy
      React.createElement('div', { style: { background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '16px', padding: '25px' }, key: 'trading' }, [
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } }, [
          React.createElement('h3', { style: { fontSize: '20px', fontWeight: 600 } }, '💹 Trading Strategy'),
          React.createElement('span', { style: { padding: '6px 12px', background: 'rgba(0,255,136,0.1)', borderRadius: '20px', fontSize: '12px', color: '#00ff88' } }, GOALS_DATA.trading.status)
        ]),
        React.createElement('div', { style: { fontSize: '48px', fontWeight: 700, marginBottom: '5px', color: '#00ff88' } }, `${GOALS_DATA.trading.winRate}%`),
        React.createElement('div', { style: { fontSize: '14px', color: '#8b8bb0', marginBottom: '20px' } }, 'Win Rate (Backtested)'),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' } }, [
          React.createElement('div', { style: { padding: '15px', background: 'rgba(10,10,15,0.5)', borderRadius: '10px' } }, [
            React.createElement('div', { style: { fontSize: '24px', fontWeight: 700, color: '#00d4ff' } }, GOALS_DATA.trading.totalTrades),
            React.createElement('div', { style: { fontSize: '12px', color: '#8b8bb0' } }, 'Total Trades')
          ]),
          React.createElement('div', { style: { padding: '15px', background: 'rgba(10,10,15,0.5)', borderRadius: '10px' } }, [
            React.createElement('div', { style: { fontSize: '24px', fontWeight: 700, color: '#00ff88' } }, GOALS_DATA.trading.profitableTrades),
            React.createElement('div', { style: { fontSize: '12px', color: '#8b8bb0' } }, 'Profitable')
          ]),
          React.createElement('div', { style: { padding: '15px', background: 'rgba(10,10,15,0.5)', borderRadius: '10px' } }, [
            React.createElement('div', { style: { fontSize: '24px', fontWeight: 700, color: '#00ff88' } }, `+${GOALS_DATA.trading.avgReturn}%`),
            React.createElement('div', { style: { fontSize: '12px', color: '#8b8bb0' } }, 'Avg Return/Trade')
          ]),
          React.createElement('div', { style: { padding: '15px', background: 'rgba(10,10,15,0.5)', borderRadius: '10px' } }, [
            React.createElement('div', { style: { fontSize: '24px', fontWeight: 700, color: '#ff9500' } }, `${GOALS_DATA.trading.maxDrawdown}%`),
            React.createElement('div', { style: { fontSize: '12px', color: '#8b8bb0' } }, 'Max Drawdown')
          ])
        ])
      ]),

      // Projects
      React.createElement('div', { style: { background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '16px', padding: '25px' }, key: 'projects' }, [
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } }, [
          React.createElement('h3', { style: { fontSize: '20px', fontWeight: 600 } }, '🚀 Projects'),
          React.createElement('span', { style: { padding: '6px 12px', background: 'rgba(0,212,255,0.1)', borderRadius: '20px', fontSize: '12px', color: '#00d4ff' } }, `${GOALS_DATA.projects.length} ACTIVE`)
        ]),
        GOALS_DATA.projects.map((proj, i) =>
          React.createElement('div', { key: i, style: { marginBottom: '20px' } }, [
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } }, [
              React.createElement('span', { style: { fontSize: '14px', color: '#e0e0ff' } }, proj.name),
              React.createElement('span', { style: { fontSize: '12px', padding: '4px 10px', borderRadius: '12px', background: proj.status === 'LIVE' ? 'rgba(0,255,136,0.1)' : 'rgba(0,212,255,0.1)', color: proj.status === 'LIVE' ? '#00ff88' : '#00d4ff' } }, proj.status)
            ]),
            React.createElement('div', { style: { height: '8px', background: '#2d2d44', borderRadius: '4px', overflow: 'hidden' } },
              React.createElement('div', { style: { width: `${proj.progress}%`, height: '100%', background: proj.progress > 80 ? '#00ff88' : proj.progress > 50 ? '#00d4ff' : '#ff9500', borderRadius: '4px' } })
            ),
            React.createElement('div', { style: { textAlign: 'right', fontSize: '12px', color: '#8b8bb0', marginTop: '5px' } }, `${proj.progress}%`)
          ])
        )
      ]),

      // Next Actions
      React.createElement('div', { style: { background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '16px', padding: '25px' }, key: 'actions' }, [
        React.createElement('h3', { style: { fontSize: '20px', fontWeight: 600, marginBottom: '20px' } }, '📋 Next Priority Actions'),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } }, [
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(10,10,15,0.5)', borderRadius: '8px' } }, [
            React.createElement('span', { style: { fontSize: '14px' } }, '1. Get first ZMA customer ($19 sale)'),
            React.createElement('span', { style: { padding: '4px 12px', background: 'rgba(255,149,0,0.1)', borderRadius: '12px', fontSize: '11px', color: '#ff9500' } }, 'PENDING')
          ]),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(10,10,15,0.5)', borderRadius: '8px' } }, [
            React.createElement('span', { style: { fontSize: '14px' } }, '2. Start paper trading (Alpaca)'),
            React.createElement('span', { style: { padding: '4px 12px', background: 'rgba(255,149,0,0.1)', borderRadius: '12px', fontSize: '11px', color: '#ff9500' } }, 'PENDING')
          ]),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(10,10,15,0.5)', borderRadius: '8px' } }, [
            React.createElement('span', { style: { fontSize: '14px' } }, '3. Deploy PDF Tools to subdomain'),
            React.createElement('span', { style: { padding: '4px 12px', background: 'rgba(0,255,136,0.1)', borderRadius: '12px', fontSize: '11px', color: '#00ff88' } }, 'READY')
          ]),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(10,10,15,0.5)', borderRadius: '8px' } }, [
            React.createElement('span', { style: { fontSize: '14px' } }, '4. First tweet from @ZeroMethodAI'),
            React.createElement('span', { style: { padding: '4px 12px', background: 'rgba(255,149,0,0.1)', borderRadius: '12px', fontSize: '11px', color: '#ff9500' } }, 'PENDING')
          ]),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(10,10,15,0.5)', borderRadius: '8px' } }, [
            React.createElement('span', { style: { fontSize: '14px' } }, '5. Fix DNS for thezeromethod.com'),
            React.createElement('span', { style: { padding: '4px 12px', background: 'rgba(0,212,255,0.1)', borderRadius: '12px', fontSize: '11px', color: '#00d4ff' } }, 'IN PROGRESS')
          ])
        ])
      ])
    ])
  ]);
}

// Dashboard Component (simplified)
function Dashboard({ data, setActiveTab }) {
  return React.createElement('div', { style: { animation: 'fadeIn 0.3s' } }, [
    React.createElement('div', { style: { textAlign: 'center', marginBottom: '30px' }, key: 'welcome' }, [
      React.createElement('h2', { style: { fontSize: '28px', fontWeight: 700, marginBottom: '12px', background: 'linear-gradient(90deg, #00d4ff, #b829dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Welcome to Command Center'),
      React.createElement('p', { style: { fontSize: '16px', color: '#8b8bb0', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' } }, 'All systems operational. Use the navigation to access Goals, Trading, Projects, and more.')
    ]),
    
    // Quick Stats
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '30px' }, key: 'stats' }, [
      React.createElement('div', { style: { background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '16px', padding: '24px', textAlign: 'center' }, key: '1' }, [
        React.createElement('div', { style: { fontSize: '14px', color: '#8b8bb0', marginBottom: '8px' } }, 'Revenue'),
        React.createElement('div', { style: { fontSize: '32px', fontWeight: 700, color: '#00ff88' } }, `$${GOALS_DATA.revenue.current}`)
      ]),
      React.createElement('div', { style: { background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '16px', padding: '24px', textAlign: 'center' }, key: '2' }, [
        React.createElement('div', { style: { fontSize: '14px', color: '#8b8bb0', marginBottom: '8px' } }, 'Trading Win Rate'),
        React.createElement('div', { style: { fontSize: '32px', fontWeight: 700, color: '#00d4ff' } }, `${GOALS_DATA.trading.winRate}%`)
      ]),
      React.createElement('div', { style: { background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '16px', padding: '24px', textAlign: 'center' }, key: '3' }, [
        React.createElement('div', { style: { fontSize: '14px', color: '#8b8bb0', marginBottom: '8px' } }, 'Active Projects'),
        React.createElement('div', { style: { fontSize: '32px', fontWeight: 700, color: '#b829dd' } }, GOALS_DATA.projects.length)
      ]),
      React.createElement('div', { style: { background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '16px', padding: '24px', textAlign: 'center' }, key: '4' }, [
        React.createElement('div', { style: { fontSize: '14px', color: '#8b8bb0', marginBottom: '8px' } }, 'Target'),
        React.createElement('div', { style: { fontSize: '32px', fontWeight: 700, color: '#ff9500' } }, `$${GOALS_DATA.revenue.target}`)
      ])
    ]),

    // Quick Actions
    React.createElement('div', { style: { textAlign: 'center' }, key: 'actions' }, [
      React.createElement('button', {
        onClick: () => setActiveTab('goals'),
        style: { 
          padding: '14px 28px', 
          background: 'linear-gradient(135deg, #00d4ff, #b829dd)', 
          border: 'none', 
          borderRadius: '12px', 
          color: '#fff', 
          fontSize: '16px', 
          fontWeight: 600,
          cursor: 'pointer',
          marginRight: '15px'
        }
      }, '🎯 View Goals'),
      React.createElement('button', {
        onClick: () => setActiveTab('trading'),
        style: { 
          padding: '14px 28px', 
          background: 'linear-gradient(135deg, #00ff88, #00cc6a)', 
          border: 'none', 
          borderRadius: '12px', 
          color: '#0a0a0f', 
          fontSize: '16px', 
          fontWeight: 600,
          cursor: 'pointer'
        }
      }, '💹 View Trading')
    ])
  ]);
}

// Placeholder Components
function PokemonOffice({ agents, getPokemonGif }) {
  return React.createElement('div', { style: { textAlign: 'center', padding: '40px' } }, [
    React.createElement('h2', { style: { color: '#00d4ff' } }, '🏢 Pokemon Office'),
    React.createElement('p', { style: { color: '#8b8bb0' } }, 'Team dashboard with live agents')
  ]);
}

function KanbanBoard({ columns }) {
  return React.createElement('div', { style: { textAlign: 'center', padding: '40px' } }, [
    React.createElement('h2', { style: { color: '#00d4ff' } }, '📋 Kanban Board'),
    React.createElement('p', { style: { color: '#8b8bb0' } }, 'Task management system')
  ]);
}

function Projects({ projects, agents, getPokemonGif }) {
  return React.createElement('div', { style: { textAlign: 'center', padding: '40px' } }, [
    React.createElement('h2', { style: { color: '#00d4ff' } }, '🚀 Projects'),
    React.createElement('p', { style: { color: '#8b8bb0' } }, `${GOALS_DATA.projects.length} projects tracked`)
  ]);
}

function Trading() {
  return React.createElement('div', { style: { padding: '30px' } }, [
    React.createElement('h2', { style: { color: '#00d4ff', textAlign: 'center', marginBottom: '30px' } }, '💹 Trading Dashboard'),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' } }, [
      React.createElement('div', { style: { background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '16px', padding: '24px', textAlign: 'center' } }, [
        React.createElement('div', { style: { fontSize: '14px', color: '#8b8bb0' } }, 'AAPL'),
        React.createElement('div', { style: { fontSize: '24px', fontWeight: 700, color: '#00ff88' } }, '$185.50'),
        React.createElement('div', { style: { fontSize: '12px', color: '#00ff88' } }, '+1.2%')
      ]),
      React.createElement('div', { style: { background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '16px', padding: '24px', textAlign: 'center' } }, [
        React.createElement('div', { style: { fontSize: '14px', color: '#8b8bb0' } }, 'GOOGL'),
        React.createElement('div', { style: { fontSize: '24px', fontWeight: 700, color: '#ff3366' } }, '$142.30'),
        React.createElement('div', { style: { fontSize: '12px', color: '#ff3366' } }, '-0.5%')
      ]),
      React.createElement('div', { style: { background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '16px', padding: '24px', textAlign: 'center' } }, [
        React.createElement('div', { style: { fontSize: '14px', color: '#8b8bb0' } }, 'TSLA'),
        React.createElement('div', { style: { fontSize: '24px', fontWeight: 700, color: '#00ff88' } }, '$245.60'),
        React.createElement('div', { style: { fontSize: '12px', color: '#00ff88' } }, '+3.1%')
      ])
    ]),
    React.createElement('div', { style: { marginTop: '30px', padding: '20px', background: 'rgba(0,255,136,0.05)', borderRadius: '12px', textAlign: 'center' } }, [
      React.createElement('p', { style: { color: '#00ff88', fontSize: '18px' } }, `✅ Strategy Backtested: ${GOALS_DATA.trading.winRate}% Win Rate`)
    ])
  ]);
}

function Chat({ messages, agents, chatInput, setChatInput, sendMessage, chatEndRef }) {
  return React.createElement('div', { style: { textAlign: 'center', padding: '40px' } }, [
    React.createElement('h2', { style: { color: '#00d4ff' } }, '💬 Chat'),
    React.createElement('p', { style: { color: '#8b8bb0' } }, 'Team communication system')
  ]);
}

function Console({ logs }) {
  return React.createElement('div', { style: { textAlign: 'center', padding: '40px' } }, [
    React.createElement('h2', { style: { color: '#00d4ff' } }, '💻 Console'),
    React.createElement('p', { style: { color: '#8b8bb0' } }, 'System logs and events')
  ]);
}

// Styles
const styles = {
  app: { minHeight: '100vh', background: '#0a0a0f' },
  header: { background: 'linear-gradient(180deg, #12121a, #0a0a0f)', borderBottom: '1px solid #2d2d44', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  brand: { display: 'flex', alignItems: 'center', gap: '12px' },
  brandLogo: { width: '44px', height: '44px', background: 'linear-gradient(135deg, #00d4ff, #b829dd)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', boxShadow: '0 0 25px rgba(0,212,255,0.4)' },
  brandName: { fontSize: '22px', fontWeight: 800, background: 'linear-gradient(90deg, #00d4ff, #b829dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  brandTagline: { fontSize: '11px', color: '#8b8bb0', fontFamily: 'JetBrains Mono, monospace' },
  statusBar: { display: 'flex', gap: '16px', alignItems: 'center' },
  statusIndicator: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', border: '1px solid', borderRadius: '20px', fontSize: '12px' },
  statusDot: { width: '8px', height: '8px', borderRadius: '50%', animation: 'pulse 1s infinite' },
  navTabs: { display: 'flex', background: '#12121a', borderBottom: '1px solid #2d2d44', padding: '0 24px', gap: '4px', overflowX: 'auto' },
  navTab: { padding: '16px 24px', background: 'transparent', border: 'none', color: '#8b8bb0', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', cursor: 'pointer', borderBottom: '3px solid transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center' },
  navTabActive: { color: '#00d4ff', borderBottomColor: '#00d4ff', background: 'linear-gradient(180deg, transparent, rgba(0,212,255,0.05))' },
  mainContent: { padding: '24px', maxWidth: '1800px', margin: '0 auto' }
};

// Render
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));
