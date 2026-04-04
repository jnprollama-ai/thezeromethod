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

// Load or initialize status
function loadStatus() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error loading status:', err);
  }
  return require('./data/default-status.json');
}

function saveStatus(status) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(status, null, 2));
  } catch (err) {
    console.error('Error saving status:', err);
  }
}

let currentStatus = loadStatus();

// Routes for each page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/agents', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'agents.html'));
});

app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'projects.html'));
});

app.get('/blogs', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'blogs.html'));
});

app.get('/social', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'social.html'));
});

app.get('/saas', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'saas.html'));
});

app.get('/trading', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'trading.html'));
});

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

app.post('/api/log-progress', (req, res) => {
  const { date, content, author = 'System' } = req.body;
  const entry = {
    id: Date.now().toString(),
    date: date || new Date().toISOString(),
    content,
    author
  };
  
  currentStatus.dailyProgress.unshift(entry);
  if (currentStatus.dailyProgress.length > 30) {
    currentStatus.dailyProgress = currentStatus.dailyProgress.slice(0, 30);
  }
  
  currentStatus.lastUpdated = new Date().toISOString();
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  res.json(entry);
});

app.post('/api/blog-drafts/comment', (req, res) => {
  const { draftId, comment, author = 'Reviewer' } = req.body;
  const draft = currentStatus.blogDrafts.find(d => d.id === draftId);
  
  if (!draft) {
    return res.status(404).json({ error: 'Draft not found' });
  }
  
  const commentObj = {
    id: Date.now().toString(),
    comment,
    author,
    timestamp: new Date().toISOString()
  };
  
  draft.comments.push(commentObj);
  currentStatus.lastUpdated = new Date().toISOString();
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  res.json(commentObj);
});

app.post('/api/blog-drafts/approve', (req, res) => {
  const { draftId } = req.body;
  const draft = currentStatus.blogDrafts.find(d => d.id === draftId);
  
  if (!draft) {
    return res.status(404).json({ error: 'Draft not found' });
  }
  
  draft.status = 'approved';
  draft.approvedAt = new Date().toISOString();
  currentStatus.lastUpdated = new Date().toISOString();
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  res.json({ message: 'Draft approved', draft });
});

// Socket.io
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('statusUpdate', currentStatus);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`🌀 Command Center v2.0 running on http://localhost:${PORT}`);
  console.log('Navigation: Home | Agents | Projects | Blogs | Social | SaaS | Trading');
});