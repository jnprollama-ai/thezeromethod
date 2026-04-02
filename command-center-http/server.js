const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3456;
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data if not exists
if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
        agents: [
            { id: 'zero', name: 'Zero', pokemon: 'Mewtwo', number: 150, role: 'Commander', type: 'Psychic', status: 'active', task: 'Coordinating operations', hp: 100, maxHp: 100, level: 50, x: 350, y: 250 },
            { id: 'research', name: 'Research', pokemon: 'Alakazam', number: 65, role: 'Analyst', type: 'Psychic', status: 'busy', task: 'Market research', hp: 85, maxHp: 100, level: 45, x: 100, y: 250 },
            { id: 'content', name: 'Content', pokemon: 'Rapidash', number: 78, role: 'Creator', type: 'Fire', status: 'active', task: 'Website content', hp: 90, maxHp: 100, level: 42, x: 600, y: 250 },
            { id: 'seo', name: 'SEO', pokemon: 'Porygon', number: 137, role: 'Optimizer', type: 'Digital', status: 'active', task: 'SEO analysis', hp: 95, maxHp: 100, level: 38, x: 220, y: 120 },
            { id: 'social', name: 'Social', pokemon: 'Jigglypuff', number: 39, role: 'Engager', type: 'Fairy', status: 'active', task: 'Social media', hp: 80, maxHp: 100, level: 35, x: 480, y: 120 }
        ],
        projects: [
            { id: 1, name: 'Zero Method Website', status: 'live', progress: 95, team: ['zero', 'content', 'seo'], description: 'AI Productivity Suite with Stripe checkout', revenue: 0, visitors: 0 },
            { id: 2, name: 'Trading Dashboard', status: 'active', progress: 25, team: ['research', 'zero'], description: 'Real-time trading analytics', revenue: 0, visitors: 0 },
            { id: 3, name: 'Zero SaaS Suite', status: 'planning', progress: 10, team: ['research', 'content'], description: '7-tool productivity suite', revenue: 0, visitors: 0 }
        ],
        revenue: { total: 0, bySource: {}, daily: [], weekly: [], monthly: [] },
        trading: { watchlist: ['AAPL', 'GOOGL', 'TSLA', 'BTC'], positions: [] },
        kanban: { columns: ['todo', 'progress', 'review', 'done'] }
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    console.log('✅ Initial data created');
}

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
    const pathname = parsedUrl.pathname;
    
    // API Routes
    if (pathname === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(getData()));
        return;
    }
    
    if (pathname === '/api/agents') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(getData().agents));
        return;
    }
    
    // Static files
    const ext = path.extname(pathname).toLowerCase();
    const filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('Not found');
            return;
        }
        
        res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
        res.end(data);
    });
});

function getData() {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
        return {
            agents: data.agents.map(agent => ({
                ...agent,
                isMoving: Math.random() > 0.7,
                direction: Math.random() > 0.5 ? 'right' : 'left'
            })),
            projects: data.projects,
            revenue: {
                ...data.revenue,
                current: data.revenue.total,
                streams: calculateRevenueStreams(data.revenue.bySource)
            },
            trading: data.trading,
            kanban: data.kanban
        };
    } catch (e) {
        return { agents: [], projects: [], revenue: { current: 0, streams: {} }, trading: { watchlist: [], positions: [] }, kanban: { columns: [] } };
    }
}

function calculateRevenueStreams(bySource) {
    const streams = { zma: 0, affiliates: 0, ads: 0, pdftools: 0, other: 0 };
    for (const [source, amount] of Object.entries(bySource)) {
        if (source === 'zma') streams.zma = amount;
        else if (source === 'affiliates') streams.affiliates = amount;
        else if (source === 'ads') streams.ads = amount;
        else streams.other += amount;
    }
    return streams;
}

// Simulate live updates
setInterval(() => {
    const data = getData();
    // Simulate agent movement
    data.agents.forEach(agent => {
        if (Math.random() > 0.6) {
            agent.x += (Math.random() - 0.5) * 10;
            agent.y += (Math.random() - 0.5) * 10;
            agent.isMoving = true;
        } else {
            agent.isMoving = false;
        }
    });
    
    // Save updated data
    fs.writeFileSync(DATA_FILE, JSON.stringify({
        ...JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')),
        agents: data.agents
    })));
}, 2000);

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     ◈ ZERO COMMAND CENTER HTTP SERVER                      ║
║                                                                ║
║     🌐 Serving static files + JSON API                          ║
║     💾 SQLite persistence in data.json                          ║
║     🔄 Live updates every 2 seconds                           ║
║                                                                ║
║     http://localhost:${PORT}                                      ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
`);

server.listen(PORT, () => {
    console.log(`✅ Command Center running on port ${PORT}`);
});
