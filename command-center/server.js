const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3456;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Data storage
const DATA_FILE = path.join(__dirname, 'data', 'status.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Default status data
const defaultStatus = {
  lastUpdated: new Date().toISOString(),
  website: {
    status: 'operational',
    uptime: '99.9%',
    lastCheck: new Date().toISOString()
  },
  agents: [
    { id: 'zero', name: 'Zero', pokemon: 'Mewtwo', role: 'Commander', status: 'active', task: 'Strategic oversight' },
    { id: 'research', name: 'Research Agent', pokemon: 'Alakazam', role: 'Analyst', status: 'idle', task: 'Competitor analysis complete' },
    { id: 'content', name: 'Content Agent', pokemon: 'Rapidash', role: 'Creator', status: 'active', task: 'Blog post drafted' },
    { id: 'seo', name: 'SEO Agent', pokemon: 'Porygon', role: 'Optimizer', status: 'idle', task: 'Monitoring rankings' },
    { id: 'social', name: 'Social Agent', pokemon: 'Jigglypuff', role: 'Engager', status: 'active', task: 'Social media content ready' }
  ],
  projects: {
    zma: {
      name: 'Zero Marketing Agency',
      status: 'validation',
      progress: 65,
      revenue: 0,
      tasks: [
        { name: 'Website Live', done: true },
        { name: 'Product Created', done: true },
        { name: 'Content Strategy', done: true },
        { name: 'Social Media Content', done: true },
        { name: 'Blog Posts', done: false },
        { name: 'Traffic Generation', done: false },
        { name: 'First Sale', done: false }
      ]
    },
    trading: {
      name: 'Trading Dashboard',
      status: 'planning',
      progress: 10,
      revenue: 0,
      tasks: [
        { name: 'Concept Defined', done: true },
        { name: 'Architecture Design', done: false },
        { name: 'MVP Development', done: false }
      ]
    }
  },
  metrics: {
    websiteVisits: 0,
    emailSignups: 0,
    socialFollowers: 0,
    contentPieces: 3
  }
};

// Load or initialize status
function loadStatus() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return { ...defaultStatus, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error loading status:', err);
  }
  return defaultStatus;
}

// Save status
function saveStatus(status) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(status, null, 2));
  } catch (err) {
    console.error('Error saving status:', err);
  }
}

let currentStatus = loadStatus();

// API Routes
app.get('/api/status', (req, res) => {
  res.json(currentStatus);
});

app.post('/api/status', (req, res) => {
  currentStatus = { ...currentStatus, ...req.body, lastUpdated: new Date().toISOString() };
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  res.json(currentStatus);
});

app.post('/api/update-agent', (req, res) => {
  const { id, updates } = req.body;
  const agent = currentStatus.agents.find(a => a.id === id);
  if (agent) {
    Object.assign(agent, updates);
    currentStatus.lastUpdated = new Date().toISOString();
    saveStatus(currentStatus);
    io.emit('statusUpdate', currentStatus);
    res.json(agent);
  } else {
    res.status(404).json({ error: 'Agent not found' });
  }
});

app.post('/api/update-project', (req, res) => {
  const { id, updates } = req.body;
  if (currentStatus.projects[id]) {
    Object.assign(currentStatus.projects[id], updates);
    currentStatus.lastUpdated = new Date().toISOString();
    saveStatus(currentStatus);
    io.emit('statusUpdate', currentStatus);
    res.json(currentStatus.projects[id]);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('statusUpdate', currentStatus);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`🌀 Command Center running on http://localhost:${PORT}`);
});
