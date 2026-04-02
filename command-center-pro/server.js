const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { exec } = require('child_process');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" }});

const PORT = process.env.PORT || 3456;
const AUTO_UPDATE_ENABLED = process.env.AUTO_UPDATE !== 'false';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client', 'public')));
app.use(cors());

// Pokemon GIF URLs
const POKEMON_GIFS = {
    150: 'https://play.pokemonshowdown.com/sprites/gen5ani/mewtwo.gif',
    65: 'https://play.pokemonshowdown.com/sprites/gen5ani/alakazam.gif',
    78: 'https://play.pokemonshowdown.com/sprites/gen5ani/rapidash.gif',
    137: 'https://play.pokemonshowdown.com/sprites/gen5ani/porygon.gif',
    39: 'https://play.pokemonshowdown.com/sprites/gen5ani/jigglypuff.gif'
};

// Live Data Store
const liveData = {
    version: '4.0.0',
    lastUpdated: new Date().toISOString(),
    agents: [
        { id: 'zero', name: 'Zero', pokemon: 'Mewtwo', number: 150, role: 'Commander', type: 'Psychic', status: 'active', task: 'Coordinating operations', hp: 100, maxHp: 100, level: 50, x: 350, y: 250, direction: 'down', isMoving: false, message: null },
        { id: 'research', name: 'Research', pokemon: 'Alakazam', number: 65, role: 'Analyst', type: 'Psychic', status: 'busy', task: 'Market research', hp: 85, maxHp: 100, level: 45, x: 100, y: 250, direction: 'down', isMoving: false, message: null },
        { id: 'content', name: 'Content', pokemon: 'Rapidash', number: 78, role: 'Creator', type: 'Fire', status: 'active', task: 'Website content', hp: 90, maxHp: 100, level: 42, x: 600, y: 250, direction: 'down', isMoving: false, message: null },
        { id: 'seo', name: 'SEO', pokemon: 'Porygon', number: 137, role: 'Optimizer', type: 'Digital', status: 'active', task: 'SEO analysis', hp: 95, maxHp: 100, level: 38, x: 220, y: 120, direction: 'down', isMoving: false, message: null },
        { id: 'social', name: 'Social', pokemon: 'Jigglypuff', number: 39, role: 'Engager', type: 'Fairy', status: 'active', task: 'Social media', hp: 80, maxHp: 100, level: 35, x: 480, y: 120, direction: 'down', isMoving: false, message: null }
    ],
    projects: [
        { id: 1, name: 'Zero Method Website', status: 'live', progress: 95, team: ['zero', 'content', 'seo'], desc: 'AI Productivity Suite with Stripe checkout', details: { revenue: 0, visitors: 0, conversions: 0 } },
        { id: 2, name: 'Trading Dashboard', status: 'active', progress: 25, team: ['research', 'zero'], desc: 'Real-time trading analytics', details: { trades: 0, pnl: 0 } },
        { id: 3, name: 'Zero SaaS Suite', status: 'planning', progress: 10, team: ['research', 'content'], desc: '7-tool productivity suite', details: { mrr: 0, users: 0 } }
    ],
    metrics: {
        website: { visitors: 0, pageViews: 0 },
        revenue: { daily: 0, weekly: 0, monthly: 0, total: 0 },
        social: { twitter: { followers: 0 }, linkedin: { followers: 0 } },
        tasks: { completed: 0, pending: 0 }
    },
    trading: {
        portfolio: { totalValue: 0, dayChange: 0 },
        positions: [],
        watchlist: [
            { symbol: 'AAPL', price: 185.50, change: 1.2 },
            { symbol: 'GOOGL', price: 142.30, change: -0.5 },
            { symbol: 'TSLA', price: 245.60, change: 3.1 },
            { symbol: 'BTC', price: 68200, change: 2.5 }
        ],
        alerts: []
    },
    kanban: {
        columns: [
            { id: 'todo', title: '📋 To Do', color: '#ff9500', tasks: [
                { id: 't1', title: 'Design SaaS landing', assignee: 'content', priority: 'high' },
                { id: 't2', title: 'Research competitors', assignee: 'research', priority: 'medium' }
            ]},
            { id: 'progress', title: '🔄 In Progress', color: '#00d4ff', tasks: [
                { id: 't3', title: 'Build Pokemon Office', assignee: 'zero', priority: 'high' }
            ]},
            { id: 'review', title: '👀 Review', color: '#b829dd', tasks: []},
            { id: 'done', title: '✅ Done', color: '#00ff88', tasks: []}
        ]
    },
    chat: [
        { id: 1, sender: 'system', message: 'Command Center v4.0 initialized 🎮', timestamp: new Date().toISOString() }
    ],
    logs: [],
    updates: { pending: false, lastCheck: new Date().toISOString(), version: '4.0.0' }
};

// Simulate movement
function simulateMovement() {
    liveData.agents.forEach(agent => {
        if (Math.random() > 0.6) {
            const moveX = (Math.random() - 0.5) * 30;
            const moveY = (Math.random() - 0.5) * 30;
            agent.x = Math.max(50, Math.min(700, agent.x + moveX));
            agent.y = Math.max(50, Math.min(350, agent.y + moveY));
            agent.isMoving = true;
            agent.direction = moveX > 0 ? 'right' : 'left';
        } else {
            agent.isMoving = false;
        }
        if (agent.hp < agent.maxHp && Math.random() > 0.8) {
            agent.hp = Math.min(agent.maxHp, agent.hp + 1);
        }
    });
}

// Auto-update function
function checkForUpdates() {
    if (!AUTO_UPDATE_ENABLED) return;
    
    exec('git fetch origin && git status -uno', { cwd: __dirname }, (error, stdout) => {
        if (error) {
            console.log('Update check failed:', error);
            return;
        }
        
        if (stdout.includes('Your branch is behind')) {
            liveData.updates.pending = true;
            console.log('📦 Update available! Restart to apply.');
            io.emit('notification', { type: 'update', message: 'Update available! Click restart to apply.' });
        }
        
        liveData.updates.lastCheck = new Date().toISOString();
    });
}

// Apply update
function applyUpdate() {
    console.log('🔄 Applying update...');
    exec('git pull origin main && npm install', { cwd: __dirname }, (error) => {
        if (error) {
            console.error('Update failed:', error);
            return;
        }
        console.log('✅ Update complete. Restarting...');
        process.exit(0); // Process manager will restart
    });
}

// Simulate trading data
function simulateTrading() {
    liveData.trading.watchlist.forEach(stock => {
        const change = (Math.random() - 0.5) * 2;
        stock.price += change;
        stock.change = change;
    });
    
    // Update portfolio
    const totalValue = liveData.trading.positions.reduce((sum, pos) => sum + (pos.price * pos.quantity), 0);
    liveData.trading.portfolio.totalValue = totalValue;
    liveData.trading.portfolio.dayChange = (Math.random() - 0.5) * 100;
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'public', 'index.html'));
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', version: liveData.version, uptime: process.uptime() });
});

app.get('/api/status', (req, res) => {
    res.json(liveData);
});

// Update check endpoint
app.post('/api/update', (req, res) => {
    if (req.body.action === 'check') {
        checkForUpdates();
        res.json({ checking: true });
    } else if (req.body.action === 'apply') {
        applyUpdate();
        res.json({ updating: true });
    } else {
        res.json({ updates: liveData.updates });
    }
});

// Socket.io
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    socket.emit('data', liveData);
    
    socket.on('chat-message', (message) => {
        liveData.chat.push({
            id: Date.now(),
            sender: 'user',
            message: message,
            timestamp: new Date().toISOString()
        });
        
        // Auto-respond
        setTimeout(() => {
            const agent = liveData.agents[Math.floor(Math.random() * liveData.agents.length)];
            liveData.chat.push({
                id: Date.now(),
                sender: 'agent',
                agent: agent.id,
                message: `${agent.name}: Task acknowledged! ⚡`,
                timestamp: new Date().toISOString()
            });
            io.emit('data', liveData);
        }, 1000);
        
        io.emit('data', liveData);
    });
    
    socket.on('assign-task', ({ agentId, taskTitle }) => {
        const agent = liveData.agents.find(a => a.id === agentId);
        if (agent) {
            agent.task = taskTitle;
            agent.status = 'busy';
            io.emit('data', liveData);
        }
    });
    
    socket.on('move-task', ({ taskId, fromColumn, toColumn }) => {
        const from = liveData.kanban.columns.find(c => c.id === fromColumn);
        const to = liveData.kanban.columns.find(c => c.id === toColumn);
        const task = from.tasks.find(t => t.id === taskId);
        
        if (task && from && to) {
            from.tasks = from.tasks.filter(t => t.id !== taskId);
            to.tasks.push(task);
            io.emit('data', liveData);
        }
    });
    
    socket.on('add-trade', (trade) => {
        liveData.trading.positions.push({
            id: uuidv4(),
            ...trade,
            timestamp: new Date().toISOString()
        });
        io.emit('data', liveData);
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Simulation loops
setInterval(() => {
    simulateMovement();
    io.emit('data', liveData);
}, 2000);

setInterval(() => {
    simulateTrading();
}, 5000);

// Auto-update check every 5 minutes
setInterval(checkForUpdates, 5 * 60 * 1000);

// Logging
setInterval(() => {
    liveData.logs.push({
        time: new Date().toISOString(),
        level: 'info',
        message: `System heartbeat - ${liveData.agents.filter(a => a.status === 'active').length} agents active`
    });
    if (liveData.logs.length > 100) liveData.logs = liveData.logs.slice(-100);
}, 10000);

server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                               ║
║     ◈ ZERO COMMAND CENTER v4.0 - AUTO-UPDATE ENABLED          ║
║                                                               ║
║     🎮 Pokemon Office    💬 Live Chat    📊 Trading Module      ║
║     📋 Kanban Board      📈 Live Metrics    🔄 Auto-Update   ║
║                                                               ║
║     URL: http://localhost:${PORT}                              ║
║     Auto-Update: ${AUTO_UPDATE_ENABLED ? 'ENABLED' : 'DISABLED'}                        ║
║                                                               ║
║     To update: POST /api/update {action: "apply"}             ║
║                                                               ║
╚══════════════════════════════════════════════════════════════╝
    `);
    
    // Initial update check
    checkForUpdates();
});

module.exports = { app, server, io };
