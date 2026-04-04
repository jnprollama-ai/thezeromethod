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
  return {
    "lastUpdated": new Date().toISOString(),
    "website": {
      "status": "operational",
      "uptime": "99.9%",
      "lastCheck": new Date().toISOString()
    },
    "agents": [
      {
        "id": "zero",
        "name": "Zero",
        "pokemon": "Mewtwo",
        "role": "Commander",
        "status": "active",
        "task": "Strategic oversight"
      },
      {
        "id": "research",
        "name": "Research Agent",
        "pokemon": "Alakazam",
        "role": "Analyst",
        "status": "idle",
        "task": "Competitor analysis complete"
      },
      {
        "id": "content",
        "name": "Content Agent",
        "pokemon": "Rapidash",
        "role": "Creator",
        "status": "active",
        "task": "Blog post drafted"
      },
      {
        "id": "seo",
        "name": "SEO Agent",
        "pokemon": "Porygon",
        "role": "Optimizer",
        "status": "idle",
        "task": "Monitoring rankings"
      },
      {
        "id": "social",
        "name": "Social Agent",
        "pokemon": "Jigglypuff",
        "role": "Engager",
        "status": "active",
        "task": "Social media content ready"
      }
    ],
    "projects": {
      "zma": {
        "name": "Zero Marketing Agency",
        "status": "validation",
        "progress": 65,
        "revenue": 0,
        "tasks": [
          {
            "name": "Website Live",
            "done": true
          },
          {
            "name": "Product Created",
            "done": true
          },
          {
            "name": "Content Strategy",
            "done": true
          },
          {
            "name": "Social Media Content",
            "done": true
          },
          {
            "name": "Blog Posts",
            "done": false
          },
          {
            "name": "Traffic Generation",
            "done": false
          },
          {
            "name": "First Sale",
            "done": false
          }
        ]
      },
      "trading": {
        "name": "Trading Dashboard",
        "status": "planning",
        "progress": 10,
        "revenue": 0,
        "tasks": [
          {
            "name": "Concept Defined",
            "done": true
          },
          {
            "name": "Architecture Design",
            "done": false
          },
          {
            "name": "MVP Development",
            "done": false
          }
        ]
      },
      "saas": {
        "name": "Zero SaaS",
        "status": "research",
        "progress": 5,
        "revenue": 0,
        "tasks": [
          {
            "name": "Market Validation",
            "done": false
          },
          {
            "name": "Competitive Analysis",
            "done": false
          },
          {
            "name": "Feature Planning",
            "done": false
          }
        ]
      }
    },
    "metrics": {
      "websiteVisits": 0,
      "emailSignups": 0,
      "socialFollowers": 0,
      "contentPieces": 3
    },
    "dailyProgress": [
      {
        "id": Date.now().toString(),
        "date": new Date().toISOString(),
        "content": "Initialized Command Center",
        "author": "System"
      }
    ],
    "upcomingProjects": [
      {
        "id": "trading",
        "name": "Trading Dashboard",
        "description": "Real-time market data visualization and portfolio tracking",
        "status": "planning",
        "timeline": "Months 2-3",
        "dependencies": [
          "zma"
        ],
        "estimatedTokens": 200000,
        "estimatedBudget": 100
      },
      {
        "id": "saas",
        "name": "Zero SaaS",
        "description": "AI-powered tools for solopreneurs and small businesses",
        "status": "research",
        "timeline": "Months 4-6",
        "dependencies": [
          "zma"
        ],
        "estimatedTokens": 500000,
        "estimatedBudget": 250
      },
      {
        "id": "content-automation",
        "name": "Content Automation",
        "description": "Automate blog and social media content creation",
        "status": "planning",
        "timeline": "Month 2",
        "dependencies": [],
        "progress": 0,
        "revenue": 0,
        "tasks": []
      }
    ],
    "blogDrafts": [
      {
        "id": "prompt-engineering-basics",
        "title": "AI Prompt Engineering Basics for Non-Technical Professionals",
        "status": "draft",
        "author": "Zero",
        "lastModified": new Date().toISOString(),
        "filePath": "blog_draft_prompt_engineering.md",
        "comments": []
      }
    ],
    "socialMediaContent": [
      {
        "id": "social-1",
        "platform": "twitter",
        "content": "Did you know that AI prompt engineering can save professionals 5+ hours per week? Our new guide breaks down the essentials for non-technical users.",
        "status": "draft",
        "scheduledDate": null,
        "postedDate": null,
        "engagement": null
      },
      {
        "id": "social-2",
        "platform": "linkedin",
        "content": "The future of work is here: AI-powered productivity tools that don't require technical expertise. Learn how to leverage these tools effectively.",
        "status": "approved",
        "scheduledDate": new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        "postedDate": null,
        "engagement": null
      }
    ],
    "tradingNews": [
      {
        "id": "news-1",
        "title": "Bitcoin ETF Approval Rumors Continue to Boost Crypto Markets",
        "source": "Crypto Daily",
        "date": new Date().toISOString(),
        "impact": "positive",
        "summary": "Regulatory developments continue to drive optimism in the cryptocurrency markets as institutional adoption accelerates."
      },
      {
        "id": "news-2",
        "title": "Tech Stocks Rally Amid AI Innovation Surge",
        "source": "Market Watch",
        "date": new Date().toISOString(),
        "impact": "positive",
        "summary": "Major tech companies are reporting strong earnings driven by AI integration, leading to broad market gains."
      }
    ]
  };
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

app.post('/api/blog-drafts/create', (req, res) => {
  const { title, content, author = 'System' } = req.body;
  const draft = {
    id: `draft-${Date.now()}`,
    title,
    content,
    status: 'draft',
    author,
    lastModified: new Date().toISOString(),
    comments: []
  };
  
  currentStatus.blogDrafts.push(draft);
  currentStatus.lastUpdated = new Date().toISOString();
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  res.json(draft);
});

app.post('/api/social-media-content/create', (req, res) => {
  const { platform, content } = req.body;
  const post = {
    id: `post-${Date.now()}`,
    platform,
    content,
    status: 'draft',
    scheduledDate: null,
    postedDate: null,
    engagement: null
  };
  
  currentStatus.socialMediaContent.push(post);
  currentStatus.lastUpdated = new Date().toISOString();
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  res.json(post);
});

app.post('/api/social-media-content/approve', (req, res) => {
  const { postId } = req.body;
  const post = currentStatus.socialMediaContent.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  post.status = 'approved';
  post.lastModified = new Date().toISOString();
  currentStatus.lastUpdated = new Date().toISOString();
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  res.json({ message: 'Post approved', post });
});

app.post('/api/social-media-content/schedule', (req, res) => {
  const { postId, scheduledDate } = req.body;
  const post = currentStatus.socialMediaContent.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  post.scheduledDate = scheduledDate;
  post.status = 'scheduled';
  post.lastModified = new Date().toISOString();
  currentStatus.lastUpdated = new Date().toISOString();
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  res.json({ message: 'Post scheduled', post });
});

app.post('/api/projects/update', (req, res) => {
  const { projectId, updates } = req.body;
  if (currentStatus.projects[projectId]) {
    currentStatus.projects[projectId] = { 
      ...currentStatus.projects[projectId], 
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    currentStatus.lastUpdated = new Date().toISOString();
    saveStatus(currentStatus);
    io.emit('statusUpdate', currentStatus);
    res.json(currentStatus.projects[projectId]);
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

app.post('/api/projects/task/update', (req, res) => {
  const { projectId, taskName, done } = req.body;
  if (currentStatus.projects[projectId]) {
    const task = currentStatus.projects[projectId].tasks.find(t => t.name === taskName);
    if (task) {
      task.done = done;
      // Calculate progress based on completed tasks
      const totalTasks = currentStatus.projects[projectId].tasks.length;
      const completedTasks = currentStatus.projects[projectId].tasks.filter(t => t.done).length;
      currentStatus.projects[projectId].progress = Math.round((completedTasks / totalTasks) * 100);
      currentStatus.lastUpdated = new Date().toISOString();
      saveStatus(currentStatus);
      io.emit('statusUpdate', currentStatus);
      res.json({ message: 'Task updated', task });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
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