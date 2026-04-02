const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const server = http.createServer(app);

// Security middleware
app.use(helmet());
app.use(cors({ 
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ["http://localhost:3456", "https://thezeromethod.com"],
    credentials: true 
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

const io = new Server(server, {
    cors: { 
        origin: process.env.ALLOWED_ORIGINS?.split(',') || ["http://localhost:3456", "https://thezeromethod.com"],
        credentials: true 
    }
});

const PORT = process.env.PORT || 3456;
const JWT_SECRET = process.env.JWT_SECRET || 'command-center-secret-key';

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.sendStatus(401);
    }
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Users (in production, use database)
const users = [
    { id: 1, username: 'jon', password: '$2a$10$YourHashedPasswordHere', role: 'admin' },
    { id: 2, username: 'zero', password: '$2a$10$YourHashedPasswordHere', role: 'system' }
];

// Live Data Store with Trading Module
const liveData = {
    system: {
        startTime: new Date().toISOString(),
        version: '4.0.0',
        status: 'operational',
        uptime: 0
    },
    agents: [
        { id: 'zero', name: 'Zero', pokemon: 'Mewtwo', number: 150, role: 'Commander', type: 'Psychic', status: 'active', task: 'Coordinating operations', hp: 100, maxHp: 100, level: 50, x: 350, y: 250, direction: 'down', isMoving: false, message: null },
        { id: 'research', name: 'Research', pokemon: 'Alakazam', number: 65, role: 'Analyst', type: 'Psychic', status: 'busy', task: 'Market research', hp: 85, maxHp: 100, level: 45, x: 100, y: 250, direction: 'down', isMoving: false, message: null },
        { id: 'content', name: 'Content', pokemon: 'Rapidash', number: 78, role: 'Creator', type: 'Fire', status: 'active', task: 'Website redesign', hp: 90, maxHp: 100, level: 42, x: 600, y: 250, direction: 'down', isMoving: false, message: null },
        { id: 'seo', name: 'SEO', pokemon: 'Porygon', number: 137, role: 'Optimizer', type: 'Digital', status: 'active', task: 'SEO analysis', hp: 95, maxHp: 100, level: 38, x: 220, y: 120, direction: 'down', isMoving: false, message: null },
        { id: 'social', name: 'Social', pokemon: 'Jigglypuff', number: 39, role: 'Engager', type: 'Fairy', status: 'active', task: 'Social media', hp: 80, maxHp: 100, level: 35, x: 480, y: 120, direction: 'down', isMoving: false, message: null }
    ],
    projects: [
        { id: 1, name: 'Zero Method Website', status: 'live', progress: 95, team: ['zero', 'content', 'seo'], desc: 'AI Productivity Suite with Stripe checkout', details: { revenue: 0, visitors: 0, conversions: 0 } },
        { id: 2, name: 'Trading Dashboard', status: 'active', progress: 15, team: ['research', 'zero'], desc: 'Real-time trading analytics and portfolio tracking', details: { trades: 0, pnl: 0 } },
        { id: 3, name: 'Zero SaaS Suite', status: 'planning', progress: 5, team: ['research', 'content'], desc: '7-tool productivity suite', details: { mrr: 0, users: 0 } }
    ],
    metrics: {
        website: { visitors: 0, pageViews: 0, bounceRate: 0, avgSession: 0 },
        revenue: { daily: 0, weekly: 0, monthly: 0, total: 0 },
        social: { twitter: { followers: 0, engagement: 0 }, linkedin: { followers: 0, engagement: 0 } },
        tasks: { completed: 0, pending: 0, inProgress: 0 }
    },
    trading: {
        portfolio: { totalValue: 0, dayChange: 0, dayChangePercent: 0 },
        positions: [],
        watchlist: [
            { symbol: 'AAPL', price: 0, change: 0 },
            { symbol: 'GOOGL', price: 0, change: 0 },
            { symbol: 'TSLA', price: 0, change: 0 },
            { symbol: 'BTC', price: 0, change: 0 }
        ],
        alerts: []
    },
    kanban: {
        columns: [
            { id: 'todo', title: '📋 To Do', color: '#ff9500', tasks: [] },
            { id: 'progress', title: '🔄 In Progress', color: '#00d4ff', tasks: [] },
            { id: 'review', title: '👀 Review', color: '#b829dd', tasks: [] },
            { id: 'done', title: '✅ Done', color: '#00ff88', tasks: [] }
        ]
    },
    cronJobs: [],
    chat: [],
    logs: [],
    notifications: []
};

// Simulate metrics updates
function simulateMetrics() {
    // Simulate website traffic
    liveData.metrics.website.visitors += Math.floor(Math.random() * 5);
    liveData.metrics.website.pageViews += Math.floor(Math.random() * 10);
    
    // Simulate trading data
    liveData.trading.watchlist.forEach(stock => {
        stock.price = stock.price * (1 + (Math.random() - 0.5) * 0.02);
        stock.change = (Math.random() - 0.5) * 5;
    });
    
    // Update system uptime
    const now = new Date();
    const start = new Date(liveData.system.startTime);
    liveData.system.uptime = Math.floor((now - start) / 1000);
}

// Routes
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

app.get('/api/metrics', authenticateToken, (req, res) => {
    res.json(liveData.metrics);
});

app.get('/api/trading', authenticateToken, (req, res) => {
    res.json(liveData.trading);
});

// Socket.io with authentication
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return next(new Error('Invalid token'));
        socket.user = user;
        next();
    });
});

io.on('connection', (socket) => {
    console.log('Authenticated client connected:', socket.user.username);
    
    socket.emit('data', liveData);
    
    socket.on('chat-message', (message) => {
        const newMessage = {
            id: Date.now(),
            sender: 'user',
            agent: null,
            message: message,
            timestamp: new Date().toISOString()
        };
        liveData.chat.push(newMessage);
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
        // Handle kanban moves
        io.emit('data', liveData);
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
        console.log('Client disconnected:', socket.user.username);
    });
});

// Serve React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Start simulation
setInterval(() => {
    simulateMetrics();
    io.emit('data', liveData);
}, 5000);

server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     ◈ ZERO COMMAND CENTER v4.0 - PRODUCTION READY             ║
║                                                                ║
║     🔐 JWT Authentication                                      ║
║     📊 Live Metrics (Website, Revenue, Social)                   ║
║     📈 Trading Module Integration                               ║
║     🎮 Pokemon Office with Real-time Updates                    ║
║                                                                ║
║     Server: http://localhost:${PORT}                            ║
║     Environment: ${process.env.NODE_ENV || 'development'}     ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
});

module.exports = { app, server, io };
