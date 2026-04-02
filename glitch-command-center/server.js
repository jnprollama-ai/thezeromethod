const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const DB_PATH = '.data/command-center.db';

// Initialize SQLite database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) console.error('Database error:', err);
  else console.log('✅ Connected to SQLite');
});

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY, name TEXT, pokemon TEXT, number INTEGER,
    role TEXT, type TEXT, status TEXT, task TEXT, hp INTEGER, max_hp INTEGER,
    level INTEGER, x REAL, y REAL
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS revenue (
    id INTEGER PRIMARY KEY AUTOINCREMENT, date TEXT, source TEXT, amount REAL
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY, name TEXT, status TEXT, progress INTEGER,
    team TEXT, description TEXT
  )`);

  // Insert default agents if empty
  db.get('SELECT COUNT(*) as count FROM agents', (err, row) => {
    if (row.count === 0) {
      const agents = [
        ['zero', 'Zero', 'Mewtwo', 150, 'Commander', 'Psychic', 'active', 'Coordinating', 100, 100, 50, 350, 250],
        ['research', 'Research', 'Alakazam', 65, 'Analyst', 'Psychic', 'busy', 'Market research', 85, 100, 45, 100, 250],
        ['content', 'Content', 'Rapidash', 78, 'Creator', 'Fire', 'active', 'Content', 90, 100, 42, 600, 250],
        ['seo', 'SEO', 'Porygon', 137, 'Optimizer', 'Digital', 'active', 'SEO analysis', 95, 100, 38, 220, 120],
        ['social', 'Social', 'Jigglypuff', 39, 'Engager', 'Fairy', 'active', 'Social media', 80, 100, 35, 480, 120]
      ];
      const stmt = db.prepare('INSERT INTO agents VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)');
      agents.forEach(a => stmt.run(a));
      stmt.finalize();
    }
  });

  // Insert default projects
  db.get('SELECT COUNT(*) as count FROM projects', (err, row) => {
    if (row.count === 0) {
      db.run(`INSERT INTO projects VALUES 
        (1, 'Zero Method Website', 'live', 95, 'zero,content,seo', 'AI Productivity Suite'),
        (2, 'Trading Dashboard', 'active', 25, 'research,zero', 'Real-time trading'),
        (3, 'Zero SaaS Suite', 'planning', 10, 'research,content', '7-tool suite')`);
    }
  });
});

// API Routes
app.get('/api/status', (req, res) => {
  db.all('SELECT * FROM agents', [], (err, agents) => {
    if (err) return res.status(500).json({ error: err });
    
    db.all('SELECT * FROM projects', [], (err, projects) => {
      if (err) return res.status(500).json({ error: err });
      
      db.get('SELECT COALESCE(SUM(amount), 0) as total FROM revenue', [], (err, rev) => {
        if (err) return res.status(500).json({ error: err });
        
        res.json({
          agents: agents.map(a => ({ ...a, isMoving: Math.random() > 0.7 })),
          projects: projects,
          revenue: { current: rev.total, target: 500 },
          timestamp: new Date().toISOString()
        });
      });
    });
  });
});

app.post('/api/revenue', (req, res) => {
  const { amount, source } = req.body;
  db.run('INSERT INTO revenue (date, source, amount) VALUES (?, ?, ?)',
    [new Date().toISOString(), source || 'manual', amount],
    function(err) {
      if (err) return res.status(500).json({ error: err });
      io.emit('update');
      res.json({ success: true, id: this.lastID });
    });
});

// Socket.IO
io.on('connection', (socket) => {
  console.log('Client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Broadcast updates every 5 seconds
setInterval(() => {
  io.emit('update');
}, 5000);

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║  ◈ ZERO COMMAND CENTER - GLITCH EDITION                      ║
║                                                                ║
║  ✅ Live at: http://localhost:${PORT}                           ║
║  💾 SQLite persistence enabled                                  ║
║  🔄 Real-time updates active                                    ║
╚══════════════════════════════════════════════════════════════╝
  `);
});
