const { useState, useEffect, useRef } = React;

// Pokemon GIF URLs
const POKEMON_GIFS = {
  150: 'https://play.pokemonshowdown.com/sprites/gen5ani/mewtwo.gif',
  65: 'https://play.pokemonshowdown.com/sprites/gen5ani/alakazam.gif',
  78: 'https://play.pokemonshowdown.com/sprites/gen5ani/rapidash.gif',
  137: 'https://play.pokemonshowdown.com/sprites/gen5ani/porygon.gif',
  39: 'https://play.pokemonshowdown.com/sprites/gen5ani/jigglypuff.gif'
};

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({ agents: [], projects: [], cronJobs: [], kanban: { columns: [] }, chat: [], logs: [] });
  const [socket, setSocket] = useState(null);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io();
    setSocket(newSocket);
    newSocket.on('data', (newData) => setData(newData));
    return () => newSocket.close();
  }, []);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), [data.chat]);

  const sendMessage = () => { if (!chatInput.trim() || !socket) return; socket.emit('chat-message', chatInput); setChatInput(''); };
  const getPokemonGif = (n) => POKEMON_GIFS[n] || '';

  const navItems = [
    { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard' },
    { id: 'office', icon: 'fa-building', label: 'Pokemon Office' },
    { id: 'kanban', icon: 'fa-columns', label: 'Kanban' },
    { id: 'projects', icon: 'fa-rocket', label: 'Projects' },
    { id: 'cron', icon: 'fa-clock', label: 'Cron Jobs' },
    { id: 'chat', icon: 'fa-comments', label: 'Chat' },
    { id: 'trading', icon: 'fa-chart-line', label: 'Trading 💹' },
    { id: 'console', icon: 'fa-terminal', label: 'Console' }
  ];

  return React.createElement('div', { style: styles.app }, [
    // Header
    React.createElement('header', { style: styles.header, key: 'header' }, [
      React.createElement('div', { style: styles.brand, key: 'brand' }, [
        React.createElement('div', { style: styles.brandLogo, key: 'logo' }, '◈'),
        React.createElement('div', { key: 'text' }, [
          React.createElement('div', { style: styles.brandName, key: 'name' }, 'ZERO COMMAND CENTER PRO'),
          React.createElement('div', { style: styles.brandTagline, key: 'tag' }, 'React Edition v3.0')
        ])
      ]),
      React.createElement('div', { style: styles.statusBar, key: 'status' }, [
        React.createElement('div', { style: styles.statusIndicator, key: 'online' }, [
          React.createElement('div', { style: styles.statusDot }, null),
          React.createElement('span', null, 'SERVER ONLINE')
        ]),
        React.createElement('div', { style: {...styles.statusIndicator, background: 'rgba(0,212,255,0.1)', borderColor: 'rgba(0,212,255,0.3)', color: '#00d4ff'}, key: 'agents' }, [
          React.createElement('i', { className: 'fas fa-users', style: { marginRight: '8px' } }, null),
          React.createElement('span', null, `${data.agents?.filter(a => a.status === 'active').length || 0} Active`)
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
      activeTab === 'office' && React.createElement(PokemonOffice, { agents: data.agents || [], getPokemonGif, key: 'office' }),
      activeTab === 'kanban' && React.createElement(KanbanBoard, { columns: data.kanban?.columns || [], key: 'kanban' }),
      activeTab === 'projects' && React.createElement(Projects, { projects: data.projects || [], agents: data.agents || [], getPokemonGif, key: 'proj' }),
      activeTab === 'cron' && React.createElement(CronJobs, { cronJobs: data.cronJobs || [], key: 'cron' }),
      activeTab === 'chat' && React.createElement(Chat, { messages: data.chat || [], agents: data.agents || [], chatInput, setChatInput, sendMessage, chatEndRef, key: 'chat' }),
      activeTab === 'trading' && React.createElement(Trading, { key: 'trade' }),
      activeTab === 'console' && React.createElement(Console, { logs: data.logs || [], key: 'console' })
    ]),

    // Styles
    React.createElement('style', { key: 'styles' }, `
      body { margin: 0; font-family: 'Inter', sans-serif; background: #0a0a0f; color: #e0e0ff; }
      body::before { content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: repeating-linear-gradient(0deg, rgba(0,212,255,0.02), rgba(0,212,255,0.02) 1px, transparent 1px, transparent 2px); pointer-events: none; z-index: 1000; }
    `)
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
  statusIndicator: { display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(0,255,136,0.1)', border: '1px solid rgba(0,255,136,0.3)', borderRadius: '20px', fontSize: '12px', color: '#00ff88' },
  statusDot: { width: '8px', height: '8px', background: '#00ff88', borderRadius: '50%', animation: 'pulse 1s infinite' },
  navTabs: { display: 'flex', background: '#12121a', borderBottom: '1px solid #2d2d44', padding: '0 24px', gap: '4px', overflowX: 'auto' },
  navTab: { padding: '16px 24px', background: 'transparent', border: 'none', color: '#8b8bb0', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', cursor: 'pointer', borderBottom: '3px solid transparent', transition: 'all 0.2s', display: 'flex', alignItems: 'center' },
  navTabActive: { color: '#00d4ff', borderBottomColor: '#00d4ff', background: 'linear-gradient(180deg, transparent, rgba(0,212,255,0.05))' },
  mainContent: { padding: '24px', maxWidth: '1800px', margin: '0 auto' }
};

// Dashboard Component
function Dashboard({ data, setActiveTab }) {
  const stats = [
    { label: 'Active Agents', value: data.agents?.filter(a => a.status === 'active').length || 0, icon: 'fa-robot', color: '#00ff88' },
    { label: 'Projects', value: data.projects?.length || 0, icon: 'fa-rocket', color: '#00d4ff' },
    { label: 'Cron Jobs', value: data.cronJobs?.length || 0, icon: 'fa-clock', color: '#ff9500' },
    { label: 'Tasks', value: data.kanban?.columns?.reduce((acc, c) => acc + (c.tasks?.length || 0), 0) || 0, icon: 'fa-columns', color: '#b829dd' }
  ];

  const quickLinks = [
    { label: 'Website', icon: 'fa-globe', url: 'https://polite-swan-051790.netlify.app' },
    { label: 'GitHub', icon: 'fab fa-github', url: 'https://github.com/jnprollama-ai/zero-method-website' },
    { label: 'Netlify', icon: 'fa-cloud', url: 'https://app.netlify.com/sites/polite-swan-051790' },
    { label: 'Stripe', icon: 'fab fa-stripe', url: 'https://dashboard.stripe.com' },
    { label: 'Pokemon Office', icon: 'fa-building', action: () => setActiveTab('office') },
    { label: 'Trading 💹', icon: 'fa-chart-line', action: () => setActiveTab('trading') }
  ];

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s' } }, [
    // Stats Grid
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }, key: 'stats' },
      stats.map((stat, i) =
        React.createElement('div', {
          key: i,
          style: { background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '16px', padding: '24px', transition: 'all 0.3s', cursor: 'pointer' },
          onMouseEnter: (e) => { e.currentTarget.style.borderColor = stat.color; e.currentTarget.style.transform = 'translateY(-4px)'; },
          onMouseLeave: (e) => { e.currentTarget.style.borderColor = '#2d2d44'; e.currentTarget.style.transform = 'translateY(0)'; }
        }, [
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }, key: 'head' }, [
            React.createElement('div', { key: 'text' }, [
              React.createElement('div', { style: { fontSize: '12px', color: '#8b8bb0', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' } }, stat.label),
              React.createElement('div', { style: { fontSize: '36px', fontWeight: 800, color: '#e0e0ff', fontFamily: 'JetBrains Mono, monospace' } }, stat.value)
            ]),
            React.createElement('div', { style: { width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', background: `${stat.color}20`, border: `2px solid ${stat.color}50`, color: stat.color }, key: 'icon' },
              React.createElement('i', { className: `fas ${stat.icon}` }, null)
            )
          ])
        ])
      )
    ),

    // Quick Links
    React.createElement('div', { style: { display: 'flex', gap: '12px', flexWrap: 'wrap' }, key: 'links' },
      quickLinks.map((link, i) =
        link.url 
          ? React.createElement('a', {
              key: i,
              href: link.url,
              target: '_blank',
              style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 24px', background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '12px', color: '#e0e0ff', textDecoration: 'none', fontSize: '14px', transition: 'all 0.2s' },
              onMouseEnter: (e) => { e.currentTarget.style.borderColor = '#00d4ff'; e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; },
              onMouseLeave: (e) => { e.currentTarget.style.borderColor = '#2d2d44'; e.currentTarget.style.background = 'linear-gradient(145deg, #12121a, #1a1a2e)'; }
            }, [
              React.createElement('i', { className: link.icon, style: { fontSize: '18px', color: '#00d4ff' }, key: 'icon' }),
              link.label
            ])
          : React.createElement('button', {
              key: i,
              onClick: link.action,
              style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 24px', background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '12px', color: '#e0e0ff', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s' },
              onMouseEnter: (e) => { e.currentTarget.style.borderColor = '#00d4ff'; e.currentTarget.style.background = 'rgba(0,212,255,0.1)'; },
              onMouseLeave: (e) => { e.currentTarget.style.borderColor = '#2d2d44'; e.currentTarget.style.background = 'linear-gradient(145deg, #12121a, #1a1a2e)'; }
            }, [
              React.createElement('i', { className: link.icon, style: { fontSize: '18px', color: '#00d4ff' }, key: 'icon' }),
              link.label
            ])
      )
    ),

    // Welcome Message
    React.createElement('div', { style: { marginTop: '40px', padding: '32px', background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '16px', textAlign: 'center' }, key: 'welcome' }, [
      React.createElement('h2', { style: { fontSize: '28px', fontWeight: 700, marginBottom: '12px', background: 'linear-gradient(90deg, #00d4ff, #b829dd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }, key: 'title' }, 'Welcome to Command Center PRO'),
      React.createElement('p', { style: { fontSize: '16px', color: '#8b8bb0', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }, key: 'desc' },
        'Your ultimate control hub with live Pokemon office, Kanban board, project management, trading dashboard, and real-time monitoring.'
      )
    ])
  ]);
}

// Pokemon Office Component
function PokemonOffice({ agents, getPokemonGif }) {
  return React.createElement('div', { style: { animation: 'fadeIn 0.3s' } }, [
    React.createElement('div', { style: { textAlign: 'center', marginBottom: '24px' }, key: 'title' }, [
      React.createElement('h2', { style: { fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#00d4ff' } }, '🏢 Pokemon Office'),
      React.createElement('p', { style: { fontSize: '14px', color: '#8b8bb0' } }, 'Live animated office with your team')
    ]),

    React.createElement('div', { 
      style: { 
        background: 'linear-gradient(145deg, #12121a, #1a1a2e)', 
        border: '1px solid #2d2d44', 
        borderRadius: '20px', 
        padding: '40px',
        minHeight: '500px',
        position: 'relative'
      }, 
      key: 'office' 
    }, [
      // Office Grid
      React.createElement('div', { 
        style: { 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: '30px',
          alignItems: 'end'
        }, 
        key: 'grid' 
      },
        agents?.map((agent, i) =
          React.createElement('div', {
            key: agent.id,
            style: { 
              textAlign: 'center',
              padding: '20px',
              background: 'rgba(0,212,255,0.05)',
              borderRadius: '16px',
              border: '1px solid rgba(0,212,255,0.2)',
              transition: 'all 0.3s',
              cursor: 'pointer'
            },
            onMouseEnter: (e) => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.borderColor = '#00d4ff'; },
            onMouseLeave: (e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)'; }
          }, [
            // Pokemon GIF
            React.createElement('img', {
              src: getPokemonGif(agent.number),
              alt: agent.pokemon,
              style: { 
                width: '80px', 
                height: '80px', 
                objectFit: 'contain',
                marginBottom: '12px',
                imageRendering: 'pixelated'
              },
              key: 'gif'
            }),
            React.createElement('h4', { style: { fontSize: '16px', fontWeight: 600, color: '#e0e0ff', marginBottom: '4px' }, key: 'name' }, agent.name),
            React.createElement('span', { style: { fontSize: '12px', color: '#8b8bb0', display: 'block', marginBottom: '8px' }, key: 'role' }, agent.role),
            React.createElement('div', { 
              style: { 
                padding: '6px 12px', 
                background: agent.status === 'active' ? 'rgba(0,255,136,0.15)' : 'rgba(255,149,0,0.15)', 
                borderRadius: '20px',
                fontSize: '11px',
                color: agent.status === 'active' ? '#00ff88' : '#ff9500',
                display: 'inline-block'
              }, 
              key: 'status' 
            }, agent.status.toUpperCase()),
            React.createElement('div', { style: { marginTop: '12px' }, key: 'hp' }, [
              React.createElement('div', { style: { fontSize: '11px', color: '#8b8bb0', marginBottom: '4px' } }, `HP: ${agent.hp}/${agent.maxHp}`),
              React.createElement('div', { style: { height: '6px', background: '#2d2d44', borderRadius: '3px', overflow: 'hidden' } },
                React.createElement('div', { 
                  style: { 
                    width: `${(agent.hp / agent.maxHp) * 100}%`, 
                    height: '100%', 
                    background: agent.hp > 50 ? '#00ff88' : agent.hp > 25 ? '#ff9500' : '#ff3366',
                    borderRadius: '3px',
                    transition: 'width 0.5s'
                  } 
                }, null)
              )
            ]),
            React.createElement('div', { style: { marginTop: '8px', fontSize: '12px', color: '#00d4ff' }, key: 'task' }, agent.task)
          ])
        )
      )
    ])
  ]);
}

// Kanban Board Component
function KanbanBoard({ columns }) {
  const colColors = { todo: '#ff9500', progress: '#00d4ff', review: '#b829dd', done: '#00ff88' };

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s' } }, [
    React.createElement('div', { style: { textAlign: 'center', marginBottom: '24px' }, key: 'title' }, [
      React.createElement('h2', { style: { fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#00d4ff' } }, '📋 Kanban Board'),
      React.createElement('p', { style: { fontSize: '14px', color: '#8b8bb0' } }, 'Drag tasks to manage workflow')
    ]),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: `repeat(${columns?.length || 1}, 1fr)`, gap: '20px' }, key: 'board' },
      (columns || []).map(col =
        React.createElement('div', { 
          key: col.id,
          style: { 
            background: 'linear-gradient(145deg, #12121a, #1a1a2e)', 
            border: '1px solid #2d2d44', 
            borderRadius: '16px', 
            padding: '20px',
            minHeight: '400px'
          } 
        }, [
          React.createElement('div', { 
            style: { 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: `2px solid ${colColors[col.id] || '#00d4ff'}`
            }, 
            key: 'header' 
          }, [
            React.createElement('h3', { style: { fontSize: '14px', fontWeight: 600, color: '#e0e0ff' } }, col.title),
            React.createElement('span', { style: { 
              padding: '4px 10px', 
              background: `${colColors[col.id]}20`, 
              borderRadius: '12px',
              fontSize: '12px',
              color: colColors[col.id]
            } }, col.tasks?.length || 0)
          ]),
          
          React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' }, key: 'tasks' },
            (col.tasks || []).map((task, i) =
              React.createElement('div', {
                key: i,
                style: { 
                  padding: '16px',
                  background: 'rgba(10,10,15,0.5)',
                  borderRadius: '12px',
                  border: '1px solid #2d2d44',
                  cursor: 'grab',
                  transition: 'all 0.2s'
                },
                onMouseEnter: (e) => { e.currentTarget.style.borderColor = '#00d4ff'; e.currentTarget.style.transform = 'translateY(-2px)'; },
                onMouseLeave: (e) => { e.currentTarget.style.borderColor = '#2d2d44'; e.currentTarget.style.transform = 'translateY(0)'; }
              }, [
                React.createElement('div', { style: { fontSize: '14px', color: '#e0e0ff', marginBottom: '8px', fontWeight: 500 }, key: 'title' }, task.title),
                React.createElement('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }, key: 'tags' },
                  (task.tags || []).map((tag, j) =
                    React.createElement('span', { 
                      key: j,
                      style: { 
                        padding: '4px 8px', 
                        background: 'rgba(0,212,255,0.1)', 
                        borderRadius: '4px',
                        fontSize: '10px',
                        color: '#00d4ff'
                      } 
                    }, tag)
                  )
                ),
                React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, key: 'footer' }, [
                  React.createElement('span', { 
                    style: { 
                      padding: '4px 8px', 
                      background: task.priority === 'high' ? 'rgba(255,51,102,0.15)' : 'rgba(255,149,0,0.15)', 
                      borderRadius: '4px',
                      fontSize: '10px',
                      color: task.priority === 'high' ? '#ff3366' : '#ff9500'
                    } 
                  }, task.priority?.toUpperCase()),
                  React.createElement('span', { style: { fontSize: '11px', color: '#8b8bb0' } }, task.assignee)
                ])
              ])
            )
          )
        ])
      )
    )
  ]);
}

// Projects Component
function Projects({ projects, agents, getPokemonGif }) {
  const [expandedProject, setExpandedProject] = useState(null);

  const getStatusColor = (status) => {
    const colors = { live: '#00ff88', active: '#00d4ff', planning: '#ff9500', paused: '#8b8bb0' };
    return colors[status] || '#8b8bb0';
  };

  return React.createElement('div', { style: { animation: 'fadeIn 0.3s' } }, [
    React.createElement('div', { style: { textAlign: 'center', marginBottom: '24px' }, key: 'title' }, [
      React.createElement('h2', { style: { fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#00d4ff' } }, '🚀 Projects'),
      React.createElement('p', { style: { fontSize: '14px', color: '#8b8bb0' } }, 'Manage your active projects')
    ]),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }, key: 'grid' },
      (projects || []).map(project =
        React.createElement('div', {
          key: project.id,
          style: { 
            background: 'linear-gradient(145deg, #12121a, #1a1a2e)', 
            border: '1px solid #2d2d44', 
            borderRadius: '16px', 
            padding: '24px',
            transition: 'all 0.3s',
            cursor: 'pointer'
          },
          onClick: () => setExpandedProject(expandedProject === project.id ? null : project.id),
          onMouseEnter: (e) => { e.currentTarget.style.borderColor = '#00d4ff'; e.currentTarget.style.transform = 'translateY(-4px)'; },
          onMouseLeave: (e) => { e.currentTarget.style.borderColor = '#2d2d44'; e.currentTarget.style.transform = 'translateY(0)'; }
        }, [
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }, key: 'header' }, [
            React.createElement('div', { key: 'title' }, [
              React.createElement('h3', { style: { fontSize: '18px', fontWeight: 600, color: '#e0e0ff', marginBottom: '4px' } }, project.name),
              React.createElement('span', { 
                style: { 
                  padding: '4px 12px', 
                  background: `${getStatusColor(project.status)}20`, 
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: getStatusColor(project.status),
                  textTransform: 'uppercase'
                } 
              }, project.status)
            ]),
            React.createElement('div', { style: { display: 'flex', gap: '-8px' }, key: 'team' },
              (project.team || []).map((memberId, i) =
                React.createElement('img', {
                  key: i,
                  src: getPokemonGif(agents?.find(a => a.id === memberId)?.number || 150),
                  style: { 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%',
                    border: '2px solid #2d2d44',
                    marginLeft: i > 0 ? '-8px' : '0'
                  }
                })
              )
            )
          ]),

          React.createElement('p', { style: { fontSize: '14px', color: '#8b8bb0', marginBottom: '16px', lineHeight: '1.5' }, key: 'desc' }, project.desc),

          // Progress Bar
          React.createElement('div', { style: { marginBottom: '16px' }, key: 'progress' }, [
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }, key: 'labels' }, [
              React.createElement('span', { style: { fontSize: '12px', color: '#8b8bb0' } }, 'Progress'),
              React.createElement('span', { style: { fontSize: '12px', color: '#00d4ff', fontWeight: 600 } }, `${project.progress}%`)
            ]),
            React.createElement('div', { style: { height: '8px', background: '#2d2d44', borderRadius: '4px', overflow: 'hidden' } },
              React.createElement('div', { 
                style: { 
                  width: `${project.progress}%`, 
                  height: '100%', 
                  background: `linear-gradient(90deg, #00d4ff, #b829dd)`,
                  borderRadius: '4px',
                  transition: 'width 0.5s'
                } 
              }, null)
            )
          ]),

          // Expanded Details
          expandedProject === project.id && React.createElement('div', { style: { marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #2d2d44' }, key: 'details' }, [
            React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '20px' }, key: 'info' }, [
              React.createElement('div', { key: 'start' }, [
                React.createElement('div', { style: { fontSize: '11px', color: '#8b8bb0', marginBottom: '4px' } }, 'Start Date'),
                React.createElement('div', { style: { fontSize: '14px', color: '#e0e0ff' } }, project.details?.startDate)
              ]),
              React.createElement('div', { key: 'deadline' }, [
                React.createElement('div', { style: { fontSize: '11px', color: '#8b8bb0', marginBottom: '4px' } }, 'Deadline'),
                React.createElement('div', { style: { fontSize: '14px', color: '#e0e0ff' } }, project.details?.deadline)
              ]),
              React.createElement('div', { key: 'budget' }, [
                React.createElement('div', { style: { fontSize: '11px', color: '#8b8bb0', marginBottom: '4px' } }, 'Budget'),
                React.createElement('div', { style: { fontSize: '14px', color: '#00ff88' } }, project.details?.budget)
              ]),
              React.createElement('div', { key: 'revenue' }, [
                React.createElement('div', { style: { fontSize: '11px', color: '#8b8bb0', marginBottom: '4px' } }, 'Revenue'),
                React.createElement('div', { style: { fontSize: '14px', color: '#00d4ff' } }, project.details?.revenue || '$0')
              ])
            ]),

            // Milestones
            React.createElement('div', { style: { marginBottom: '20px' }, key: 'milestones' }, [
              React.createElement('h4', { style: { fontSize: '14px', fontWeight: 600, color: '#e0e0ff', marginBottom: '12px' } }, 'Milestones'),
              React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
                (project.details?.milestones || []).map((m, i) =
                  React.createElement('div', { 
                    key: i,
                    style: { 
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      background: m.complete ? 'rgba(0,255,136,0.1)' : 'rgba(10,10,15,0.5)',
                      borderRadius: '8px',
                      border: `1px solid ${m.complete ? '#00ff88' : '#2d2d44'}`
                    } 
                  }, [
                    React.createElement('i', { 
                      className: m.complete ? 'fas fa-check-circle' : 'fas fa-circle',
                      style: { color: m.complete ? '#00ff88' : '#8b8bb0' }
                    }, null),
                    React.createElement('span', { style: { fontSize: '13px', color: m.complete ? '#00ff88' : '#e0e0ff' } }, m.name)
                  ])
                )
              )
            ]),

            // Proposal
            project.proposal && React.createElement('div', { style: { padding: '16px', background: 'rgba(0,212,255,0.05)', borderRadius: '12px', border: '1px solid rgba(0,212,255,0.2)' }, key: 'proposal' }, [
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' } }, [
                React.createElement('h4', { style: { fontSize: '14px', fontWeight: 600, color: '#00d4ff' } }, '📋 Proposal: ' + project.proposal.title),
                project.proposal.approved === true && React.createElement('span', { style: { padding: '4px 12px', background: 'rgba(0,255,136,0.2)', borderRadius: '12px', fontSize: '11px', color: '#00ff88' } }, 'APPROVED'),
                project.proposal.approved === false && React.createElement('span', { style: { padding: '4px 12px', background: 'rgba(255,51,102,0.2)', borderRadius: '12px', fontSize: '11px', color: '#ff3366' } }, 'REJECTED'),
                project.proposal.approved === null && React.createElement('span', { style: { padding: '4px 12px', background: 'rgba(255,149,0,0.2)', borderRadius: '12px', fontSize: '11px', color: '#ff9500' } }, 'PENDING')
              ]),
              React.createElement('p', { style: { fontSize: '13px', color: '#8b8bb0', marginBottom: '12px' } }, project.proposal.description),
              React.createElement('div', { style: { display: 'flex', gap: '16px', marginBottom: '12px' } }, [
                React.createElement('span', { style: { fontSize: '12px', color: '#e0e0ff' } }, [
                  React.createElement('i', { className: 'fas fa-dollar-sign', style: { color: '#00ff88', marginRight: '4px' } }, null),
                  `Cost: ${project.proposal.cost}`
                ]),
                React.createElement('span', { style: { fontSize: '12px', color: '#e0e0ff' } }, [
                  React.createElement('i', { className: 'fas fa-clock', style: { color: '#00d4ff', marginRight: '4px' } }, null),
                  `Timeline: ${project.proposal.timeline}`
                ])
              ]),
              project.proposal.approved === null && React.createElement('div', { style: { display: 'flex', gap: '12px' } }, [
                React.createElement('button', { 
                  style: { flex: 1, padding: '10px', background: 'linear-gradient(135deg, #00ff88, #00cc6a)', border: 'none', borderRadius: '8px', color: '#0a0a0f', fontWeight: 600, cursor: 'pointer' },
                  onClick: (e) => { e.stopPropagation(); }
                }, '✓ Approve'),
                React.createElement('button', { 
                  style: { flex: 1, padding: '10px', background: 'transparent', border: '1px solid #ff3366', borderRadius: '8px', color: '#ff3366', fontWeight: 600, cursor: 'pointer' },
                  onClick: (e) => { e.stopPropagation(); }
                }, '✗ Reject')
              ])
            ])
          ])
        ])
      )
    )
  ]);
}

// Cron Jobs Component
function CronJobs({ cronJobs }) {
  return React.createElement('div', { style: { animation: 'fadeIn 0.3s' } }, [
    React.createElement('div', { style: { textAlign: 'center', marginBottom: '24px' }, key: 'title' }, [
      React.createElement('h2', { style: { fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#00d4ff' } }, '⏰ Cron Jobs'),
      React.createElement('p', { style: { fontSize: '14px', color: '#8b8bb0' } }, 'Scheduled tasks and automation')
    ]),

    React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px' }, key: 'list' },
      (cronJobs || []).map(job =
        React.createElement('div', {
          key: job.id,
          style: { 
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            padding: '20px 24px',
            background: 'linear-gradient(145deg, #12121a, #1a1a2e)', 
            border: '1px solid #2d2d44', 
            borderRadius: '12px',
            transition: 'all 0.2s',
            cursor: 'pointer'
          },
          onMouseEnter: (e) => { e.currentTarget.style.borderColor = '#00d4ff'; },
          onMouseLeave: (e) => { e.currentTarget.style.borderColor = '#2d2d44'; }
        }, [
          React.createElement('div', { 
            style: { 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%',
              background: job.status === 'active' ? '#00ff88' : '#ff9500',
              boxShadow: job.status === 'active' ? '0 0 10px #00ff88' : '0 0 10px #ff9500',
              animation: 'pulse 2s infinite'
            }, 
            key: 'status' 
          }, null),

          React.createElement('div', { style: { flex: 1 }, key: 'info' }, [
            React.createElement('h4', { style: { fontSize: '16px', fontWeight: 600, color: '#e0e0ff', marginBottom: '4px' } }, job.name),
            React.createElement('p', { style: { fontSize: '13px', color: '#8b8bb0' } }, job.description)
          ]),

          React.createElement('div', { style: { textAlign: 'center' }, key: 'schedule' }, [
            React.createElement('div', { style: { fontSize: '12px', color: '#8b8bb0', marginBottom: '4px' } }, 'Schedule'),
            React.createElement('code', { style: { fontSize: '14px', color: '#00d4ff', fontFamily: 'JetBrains Mono, monospace' } }, job.schedule)
          ]),

          React.createElement('div', { style: { textAlign: 'center' }, key: 'next' }, [
            React.createElement('div', { style: { fontSize: '12px', color: '#8b8bb0', marginBottom: '4px' } }, 'Next Run'),
            React.createElement('div', { style: { fontSize: '13px', color: '#e0e0ff' } }, job.nextRun)
          ]),

          React.createElement('div', { style: { display: 'flex', gap: '8px' }, key: 'actions' }, [
            React.createElement('button', { 
              style: { 
                padding: '8px 16px', 
                background: 'rgba(0,212,255,0.1)', 
                border: '1px solid rgba(0,212,255,0.3)', 
                borderRadius: '8px',
                color: '#00d4ff',
                fontSize: '12px',
                cursor: 'pointer'
              } 
            }, '▶ Run'),
            React.createElement('button', { 
              style: { 
                padding: '8px 16px', 
                background: job.status === 'active' ? 'rgba(255,149,0,0.1)' : 'rgba(0,255,136,0.1)', 
                border: `1px solid ${job.status === 'active' ? 'rgba(255,149,0,0.3)' : 'rgba(0,255,136,0.3)'}`, 
                borderRadius: '8px',
                color: job.status === 'active' ? '#ff9500' : '#00ff88',
                fontSize: '12px',
                cursor: 'pointer'
              } 
            }, job.status === 'active' ? '⏸ Pause' : '▶ Resume')
          ])
        ])
      )
    )
  ]);
}

// Chat Component
function Chat({ messages, agents, chatInput, setChatInput, sendMessage, chatEndRef }) {
  return React.createElement('div', { style: { animation: 'fadeIn 0.3s', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 200px)' } }, [
    React.createElement('div', { style: { textAlign: 'center', marginBottom: '16px' }, key: 'title' }, [
      React.createElement('h2', { style: { fontSize: '24px', fontWeight: 700, marginBottom: '4px', color: '#00d4ff' } }, '💬 Chat with Agents'),
      React.createElement('p', { style: { fontSize: '14px', color: '#8b8bb0' } }, 'Communicate with your Pokemon team')
    ]),

    React.createElement('div', { 
      style: { 
        flex: 1,
        background: 'linear-gradient(145deg, #12121a, #1a1a2e)', 
        border: '1px solid #2d2d44', 
        borderRadius: '16px', 
        padding: '20px',
        overflowY: 'auto',
        marginBottom: '16px'
      }, 
      key: 'messages' 
    }, [
      ...(messages || []).map((msg, i) =
        React.createElement('div', {
          key: i,
          style: { 
            display: 'flex',
            gap: '12px',
            marginBottom: '16px',
            justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
          }
        }, [
          msg.sender !== 'user' && msg.agent && React.createElement('img', {
            src: agents?.find(a => a.id === msg.agent)?.sprite || '',
            style: { width: '40px', height: '40px', borderRadius: '50%' },
            key: 'avatar'
          }),
          React.createElement('div', {
            style: { 
              maxWidth: '70%',
              padding: '12px 16px',
              borderRadius: '12px',
              background: msg.sender === 'user' ? 'rgba(0,212,255,0.2)' : msg.sender === 'system' ? 'rgba(255,149,0,0.1)' : 'rgba(10,10,15,0.5)',
              border: `1px solid ${msg.sender === 'user' ? 'rgba(0,212,255,0.3)' : msg.sender === 'system' ? 'rgba(255,149,0,0.3)' : '#2d2d44'}`,
              color: '#e0e0ff',
              fontSize: '14px'
            },
            key: 'bubble'
          }, [
            msg.sender !== 'user' && React.createElement('div', { style: { fontSize: '11px', color: '#8b8bb0', marginBottom: '4px' } }, 
              msg.sender === 'system' ? 'System' : agents?.find(a => a.id === msg.agent)?.name || 'Agent'
            ),
            msg.message
          ])
        ])
      ),
      React.createElement('div', { ref: chatEndRef, key: 'end' })
    ]),

    React.createElement('div', { style: { display: 'flex', gap: '12px' }, key: 'input' }, [
      React.createElement('input', {
        type: 'text',
        placeholder: 'Type a message...',
        value: chatInput,
        onChange: (e) => setChatInput(e.target.value),
        onKeyPress: (e) => e.key === 'Enter' && sendMessage(),
        style: { 
          flex: 1,
          padding: '16px 20px',
          background: 'rgba(10,10,15,0.5)',
          border: '1px solid #2d2d44',
          borderRadius: '12px',
          color: '#e0e0ff',
          fontSize: '14px',
          outline: 'none'
        },
        key: 'field'
      }),
      React.createElement('button', {
        onClick: sendMessage,
        style: { 
          padding: '16px 24px',
          background: 'linear-gradient(135deg, #00d4ff, #b829dd)',
          border: 'none',
          borderRadius: '12px',
          color: '#0a0a0f',
          fontWeight: 600,
          cursor: 'pointer',
          fontSize: '14px'
        },
        key: 'send'
      }, 'Send')
    ])
  ]);
}

// Console Component
function Console({ logs }) {
  return React.createElement('div', { style: { animation: 'fadeIn 0.3s' } }, [
    React.createElement('div', { style: { textAlign: 'center', marginBottom: '24px' }, key: 'title' }, [
      React.createElement('h2', { style: { fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#00d4ff' } }, '💻 System Console'),
      React.createElement('p', { style: { fontSize: '14px', color: '#8b8bb0' } }, 'Real-time system logs and events')
    ]),

    React.createElement('div', { 
      style: { 
        background: '#0d0d12', 
        border: '1px solid #2d2d44', 
        borderRadius: '12px', 
        padding: '20px',
        fontFamily: 'JetBrains Mono, monospace',
        minHeight: '500px'
      }, 
      key: 'terminal' 
    }, [
      (logs?.length || 0) === 0 && React.createElement('div', { style: { color: '#8b8bb0', textAlign: 'center', padding: '40px' } }, [
        React.createElement('i', { className: 'fas fa-terminal', style: { fontSize: '48px', marginBottom: '16px', display: 'block' } }, null),
        'No logs yet. System is ready.'
      ]),
      ...(logs || []).map((log, i) =
        React.createElement('div', { 
          key: i,
          style: { 
            padding: '8px 0',
            borderBottom: '1px solid rgba(45,45,68,0.3)',
            fontSize: '13px',
            display: 'flex',
            gap: '16px'
          } 
        }, [
          React.createElement('span', { style: { color: '#8b8bb0', minWidth: '180px' } }, new Date(log.time).toLocaleString()),
          React.createElement('span', { 
            style: { 
              color: log.level === 'error' ? '#ff3366' : log.level === 'success' ? '#00ff88' : log.level === 'warning' ? '#ff9500' : '#00d4ff',
              minWidth: '60px',
              textTransform: 'uppercase'
            } 
          }, `[${log.level}]`),
          React.createElement('span', { style: { color: '#e0e0ff' } }, log.message)
        ])
      )
    ])
  ]);
}

// Trading Component (placeholder for now)
function Trading() {
  return React.createElement('div', { style: { animation: 'fadeIn 0.3s' } }, [
    React.createElement('div', { style: { textAlign: 'center', marginBottom: '24px' }, key: 'title' }, [
      React.createElement('h2', { style: { fontSize: '24px', fontWeight: 700, marginBottom: '8px', color: '#00d4ff' } }, '💹 Trading Dashboard'),
      React.createElement('p', { style: { fontSize: '14px', color: '#8b8bb0' } }, 'Coming soon - Full trading integration')
    ]),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }, key: 'grid' }, [
      React.createElement('div', { style: { background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '16px', padding: '24px', textAlign: 'center' }, key: '1' }, [
        React.createElement('i', { className: 'fas fa-chart-line', style: { fontSize: '48px', color: '#00ff88', marginBottom: '16px' } }, null),
        React.createElement('h3', { style: { fontSize: '18px', color: '#e0e0ff', marginBottom: '8px' } }, 'Live Charts'),
        React.createElement('p', { style: { fontSize: '14px', color: '#8b8bb0' } }, 'Real-time candlestick charts')
      ]),
      React.createElement('div', { style: { background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '16px', padding: '24px', textAlign: 'center' }, key: '2' }, [
        React.createElement('i', { className: 'fas fa-bolt', style: { fontSize: '48px', color: '#00d4ff', marginBottom: '16px' } }, null),
        React.createElement('h3', { style: { fontSize: '18px', color: '#e0e0ff', marginBottom: '8px' } }, 'Order Execution'),
        React.createElement('p', { style: { fontSize: '14px', color: '#8b8bb0' } }, 'Instant trade execution')
      ]),
      React.createElement('div', { style: { background: 'linear-gradient(145deg, #12121a, #1a1a2e)', border: '1px solid #2d2d44', borderRadius: '16px', padding: '24px', textAlign: 'center' }, key: '3' }, [
        React.createElement('i', { className: 'fas fa-robot', style: { fontSize: '48px', color: '#b829dd', marginBottom: '16px' } }, null),
        React.createElement('h3', { style: { fontSize: '18px', color: '#e0e0ff', marginBottom: '8px' } }, 'AI Trading Bot'),
        React.createElement('p', { style: { fontSize: '14px', color: '#8b8bb0' } }, 'Automated strategies')
      ])
    ])
  ]);
}

// Render
ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(App));