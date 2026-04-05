const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

// Import Twitter Bot
const TwitterBot = require('../agents/social/twitter-bot');
const twitterBot = new TwitterBot();

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
const BLOG_CONTENT_DIR = path.join(__dirname, 'data', 'blogs');

// Ensure data directories exist
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}
if (!fs.existsSync(BLOG_CONTENT_DIR)) {
  fs.mkdirSync(BLOG_CONTENT_DIR);
}

// Default blog content
const defaultBlogContent = `# AI Prompt Engineering Basics for Non-Technical Professionals

## Introduction

In today's AI-powered world, understanding how to communicate effectively with AI tools is becoming as essential as knowing how to use email. This guide breaks down prompt engineering into simple, actionable concepts that anyone can master.

## What is Prompt Engineering?

Prompt engineering is the art and science of crafting instructions that help AI systems understand exactly what you want. Think of it as learning to ask the right questions to get the best answers.

## Key Principles

### 1. Be Specific
Instead of: "Write about marketing"
Try: "Write a 500-word blog post about email marketing strategies for small businesses, focusing on automation tools"

### 2. Provide Context
Include background information, target audience, and desired tone in your prompts.

### 3. Use Examples
Show the AI what you want by including examples of good outputs.

### 4. Break Complex Tasks
Divide large requests into smaller, manageable steps.

## Common Mistakes to Avoid

- Being too vague in your requests
- Not providing enough context
- Expecting perfect results on the first try
- Not iterating and refining prompts

## Practical Applications

1. **Content Creation**: Generate blog posts, social media content, and emails
2. **Data Analysis**: Ask AI to analyze spreadsheets and create reports
3. **Research**: Quickly summarize articles and documents
4. **Problem Solving**: Brainstorm solutions to business challenges

## Getting Started

Start with these simple prompt templates:

- "Explain [topic] as if I'm a beginner"
- "Create a [type of content] about [subject] for [audience]"
- "Analyze this [data/text] and provide [specific insights]"

## Conclusion

Mastering prompt engineering is like learning a new language—it takes practice, but the payoff is enormous. Start with these basics and gradually build your skills as you discover what works best for your needs.

---

*Ready to dive deeper? Explore our advanced prompt engineering techniques in the next guide.*`;

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
  return getDefaultStatus();
}

function getDefaultStatus() {
  const now = new Date();
  return {
    "lastUpdated": now.toISOString(),
    "website": {
      "status": "operational",
      "uptime": "99.9%",
      "lastCheck": now.toISOString()
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
      },
      {
        "id": "trading",
        "name": "Trading Bot",
        "pokemon": "Gyarados",
        "role": "Trader",
        "status": "idle",
        "task": "Waiting for market signals"
      }
    ],
    "projects": {
      "zma": {
        "name": "Zero Marketing Agency",
        "status": "validation",
        "progress": 65,
        "revenue": 0,
        "description": "AI-powered marketing services and digital products",
        "tasks": [
          { "name": "Website Live", "done": true },
          { "name": "Product Created", "done": true },
          { "name": "Content Strategy", "done": true },
          { "name": "Social Media Content", "done": true },
          { "name": "Blog Posts", "done": false },
          { "name": "Traffic Generation", "done": false },
          { "name": "First Sale", "done": false }
        ],
        "milestones": [
          { "date": "2026-03-15", "title": "Website Launch", "completed": true },
          { "date": "2026-03-31", "title": "Product Creation", "completed": true },
          { "date": "2026-04-15", "title": "First Sale", "completed": false }
        ]
      },
      "trading": {
        "name": "Trading Dashboard",
        "status": "planning",
        "progress": 10,
        "revenue": 0,
        "description": "Automated trading bot with AI strategies",
        "tasks": [
          { "name": "Concept Defined", "done": true },
          { "name": "Architecture Design", "done": false },
          { "name": "MVP Development", "done": false },
          { "name": "Testing Phase", "done": false },
          { "name": "Live Deployment", "done": false }
        ],
        "milestones": [
          { "date": "2026-04-01", "title": "Concept Phase", "completed": true },
          { "date": "2026-04-30", "title": "Architecture", "completed": false },
          { "date": "2026-05-31", "title": "MVP", "completed": false }
        ]
      },
      "saas": {
        "name": "Zero SaaS",
        "status": "research",
        "progress": 5,
        "revenue": 0,
        "description": "AI-powered SaaS tools for solopreneurs",
        "tasks": [
          { "name": "Market Validation", "done": false },
          { "name": "Competitive Analysis", "done": false },
          { "name": "Feature Planning", "done": false },
          { "name": "Prototype Development", "done": false }
        ],
        "milestones": [
          { "date": "2026-04-15", "title": "Market Research", "completed": false },
          { "date": "2026-05-01", "title": "Feature Definition", "completed": false }
        ]
      }
    },
    "metrics": {
      "websiteVisits": 0,
      "emailSignups": 0,
      "socialFollowers": 42,
      "contentPieces": 3
    },
    "dailyProgress": [
      {
        "id": Date.now().toString(),
        "date": now.toISOString(),
        "content": "Initialized Command Center v2.0",
        "author": "System"
      }
    ],
    "blogDrafts": [
      {
        "id": "prompt-engineering-basics",
        "title": "AI Prompt Engineering Basics for Non-Technical Professionals",
        "status": "draft",
        "author": "Zero",
        "lastModified": now.toISOString(),
        "filePath": "blog_prompt_engineering_basics.md",
        "wordCount": 450,
        "readTime": "3 min",
        "tags": ["AI", "Tutorial", "Beginner"],
        "comments": []
      },
      {
        "id": "advanced-prompts",
        "title": "10 Advanced Prompt Techniques for Maximum AI Output",
        "status": "in-progress",
        "author": "Content Agent",
        "lastModified": now.toISOString(),
        "filePath": "blog_advanced_prompts.md",
        "wordCount": 0,
        "readTime": "5 min",
        "tags": ["AI", "Advanced", "Tips"],
        "comments": [
          {
            "id": "1",
            "author": "Jon",
            "comment": "Great draft! Please add more examples for business use cases.",
            "timestamp": now.toISOString()
          }
        ]
      },
      {
        "id": "productivity-guide",
        "title": "The Complete AI Productivity Guide for Busy Professionals",
        "status": "approved",
        "author": "Zero",
        "lastModified": now.toISOString(),
        "filePath": "blog_productivity_guide.md",
        "wordCount": 1200,
        "readTime": "8 min",
        "tags": ["Productivity", "AI", "Guide"],
        "comments": [],
        "approvedAt": now.toISOString(),
        "scheduledPublishDate": new Date(now.getTime() + 86400000).toISOString()
      }
    ],
    "socialMediaContent": [
      {
        "id": "social-1",
        "platform": "twitter",
        "content": "🚀 Did you know AI prompt engineering can save professionals 5+ hours per week?\n\nOur new guide breaks down the essentials for non-technical users.\n\nThread below 👇",
        "status": "approved",
        "scheduledDate": new Date(now.getTime() + 3600000).toISOString(),
        "postedDate": null,
        "engagement": null,
        "hashtags": ["#AI", "#Productivity", "#PromptEngineering"],
        "mediaUrl": null
      },
      {
        "id": "social-2",
        "platform": "linkedin",
        "content": "The future of work is here: AI-powered productivity tools that don't require technical expertise.\n\nLearn how to leverage these tools effectively and stay ahead of the curve.\n\n#AI #Productivity #FutureOfWork",
        "status": "scheduled",
        "scheduledDate": new Date(now.getTime() + 172800000).toISOString(),
        "postedDate": null,
        "engagement": null,
        "hashtags": ["#AI", "#Productivity", "#FutureOfWork"],
        "mediaUrl": null
      },
      {
        "id": "social-3",
        "platform": "twitter",
        "content": "💡 Quick tip: When using AI for content creation, always provide context about your target audience.\n\nResults improve by 300% when AI knows who it's writing for.\n\n#AITips #ContentCreation",
        "status": "published",
        "scheduledDate": new Date(now.getTime() - 86400000).toISOString(),
        "postedDate": new Date(now.getTime() - 86400000).toISOString(),
        "engagement": {
          "likes": 23,
          "retweets": 8,
          "replies": 5,
          "impressions": 1247
        },
        "hashtags": ["#AITips", "#ContentCreation"],
        "mediaUrl": null
      },
      {
        "id": "social-4",
        "platform": "twitter",
        "content": "🎯 New blog post alert: 10 Advanced Prompt Techniques\n\nReady to level up your AI game? Check out our latest guide.\n\nLink in bio! 👆",
        "status": "draft",
        "scheduledDate": null,
        "postedDate": null,
        "engagement": null,
        "hashtags": ["#AI", "#BlogPost"],
        "mediaUrl": null
      }
    ],
    "tradingNews": [
      {
        "id": "news-1",
        "title": "Bitcoin ETF Approval Rumors Continue to Boost Crypto Markets",
        "source": "Crypto Daily",
        "date": now.toISOString(),
        "impact": "positive",
        "summary": "Regulatory developments continue to drive optimism in the cryptocurrency markets as institutional adoption accelerates. Bitcoin surged 3% on renewed ETF speculation.",
        "affectedAssets": ["BTC", "ETH", "SOL"],
        "sentiment": "bullish"
      },
      {
        "id": "news-2",
        "title": "Tech Stocks Rally Amid AI Innovation Surge",
        "source": "Market Watch",
        "date": new Date(now.getTime() - 7200000).toISOString(),
        "impact": "positive",
        "summary": "Major tech companies are reporting strong earnings driven by AI integration. NVIDIA, Microsoft, and Google leading gains as AI adoption accelerates enterprise spending.",
        "affectedAssets": ["NVDA", "MSFT", "GOOGL", "AAPL"],
        "sentiment": "bullish"
      },
      {
        "id": "news-3",
        "title": "Fed Signals Potential Rate Cuts in Q3 2026",
        "source": "Financial Times",
        "date": new Date(now.getTime() - 14400000).toISOString(),
        "impact": "positive",
        "summary": "Federal Reserve officials hint at possible rate reductions as inflation shows signs of cooling. Markets react positively to dovish tone.",
        "affectedAssets": ["SPY", "QQQ", "DOW", "BTC"],
        "sentiment": "bullish"
      },
      {
        "id": "news-4",
        "title": "Ethereum Network Upgrade Delays Concern Developers",
        "source": "CoinDesk",
        "date": new Date(now.getTime() - 21600000).toISOString(),
        "impact": "negative",
        "summary": "Technical challenges push back expected timeline for major Ethereum scalability upgrade. Development team working on solutions.",
        "affectedAssets": ["ETH"],
        "sentiment": "bearish"
      }
    ],
    "tradingBot": {
      "status": "active",
      "strategy": "conservative",
      "riskLevel": "low",
      "lastTrade": new Date(now.getTime() - 3600000).toISOString(),
      "todayTrades": 2,
      "winRate": 72,
      "portfolioValue": 42789.45,
      "dayChange": 2.34,
      "positions": [
        { "asset": "AAPL", "quantity": 10, "avgPrice": 150.00, "currentPrice": 178.23, "pnl": 282.30 },
        { "asset": "MSFT", "quantity": 5, "avgPrice": 320.00, "currentPrice": 412.56, "pnl": 462.80 },
        { "asset": "GOOGL", "quantity": 8, "avgPrice": 125.50, "currentPrice": 142.33, "pnl": 134.64 },
        { "asset": "BTC", "quantity": 0.5, "avgPrice": 58000.00, "currentPrice": 68421.35, "pnl": 5210.68 }
      ]
    },
    "saasTools": [
      {
        "id": "pdf-tools",
        "name": "PDF Tools",
        "description": "Merge, split, compress, and convert PDFs",
        "status": "operational",
        "users": 142,
        "revenue": 247,
        "rating": 4.7,
        "uptime": 99.9,
        "features": ["Merge PDFs", "Split PDFs", "Compress PDFs", "Convert to Word", "OCR Text"],
        "usageToday": 89,
        "popularFeature": "Merge PDFs"
      },
      {
        "id": "image-tools",
        "name": "Image Tools",
        "description": "Resize, compress, convert, and edit images",
        "status": "beta",
        "users": 23,
        "revenue": 0,
        "rating": 4.2,
        "uptime": 98.5,
        "features": ["Resize Images", "Compress Images", "Remove Background", "Add Watermark", "Convert Format"],
        "usageToday": 12,
        "popularFeature": "Remove Background"
      },
      {
        "id": "calculator-suite",
        "name": "Calculator Suite",
        "description": "Financial and business calculators",
        "status": "planning",
        "users": 0,
        "revenue": 0,
        "rating": 0,
        "uptime": 0,
        "features": ["ROI Calculator", "Loan Calculator", "Break-even Analysis", "Compound Interest", "Currency Converter"],
        "usageToday": 0,
        "popularFeature": null
      },
      {
        "id": "url-shortener",
        "name": "URL Shortener",
        "description": "Custom short links with analytics",
        "status": "planning",
        "users": 0,
        "revenue": 0,
        "rating": 0,
        "uptime": 0,
        "features": ["Custom Links", "Click Analytics", "QR Codes", "Link Expiration", "API Access"],
        "usageToday": 0,
        "popularFeature": null
      }
    ]
  };
}

function saveStatus(status) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(status, null, 2));
    
    // Save blog content separately
    if (status.blogDrafts) {
      status.blogDrafts.forEach(draft => {
        if (draft.filePath) {
          const contentPath = path.join(BLOG_CONTENT_DIR, draft.filePath);
          if (!fs.existsSync(contentPath) && draft.id === 'prompt-engineering-basics') {
            fs.writeFileSync(contentPath, defaultBlogContent);
          }
        }
      });
    }
  } catch (err) {
    console.error('Error saving status:', err);
  }
}

let currentStatus = loadStatus();

// Save initial blog content
if (!fs.existsSync(path.join(BLOG_CONTENT_DIR, 'blog_prompt_engineering_basics.md'))) {
  fs.writeFileSync(path.join(BLOG_CONTENT_DIR, 'blog_prompt_engineering_basics.md'), defaultBlogContent);
}

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

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
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

// Blog content API
app.get('/api/blog-content/:id', (req, res) => {
  const draft = currentStatus.blogDrafts.find(d => d.id === req.params.id);
  if (draft && draft.filePath) {
    const contentPath = path.join(BLOG_CONTENT_DIR, draft.filePath);
    if (fs.existsSync(contentPath)) {
      const content = fs.readFileSync(contentPath, 'utf8');
      res.json({ content });
    } else {
      // Return default content for demo
      res.json({ content: defaultBlogContent });
    }
  } else {
    res.status(404).json({ error: 'Draft not found' });
  }
});

app.post('/api/blog-content/:id', (req, res) => {
  const { content } = req.body;
  const draft = currentStatus.blogDrafts.find(d => d.id === req.params.id);
  if (draft) {
    const filePath = draft.filePath || `blog_${req.params.id}.md`;
    const contentPath = path.join(BLOG_CONTENT_DIR, filePath);
    fs.writeFileSync(contentPath, content);
    draft.filePath = filePath;
    draft.wordCount = content.split(/\s+/).length;
    draft.lastModified = new Date().toISOString();
    saveStatus(currentStatus);
    io.emit('statusUpdate', currentStatus);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Draft not found' });
  }
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
  
  draft.comments = draft.comments || [];
  draft.comments.push(commentObj);
  draft.lastModified = new Date().toISOString();
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
  
  // Schedule the post for the next available slot
  const scheduledDate = getNextBlogScheduleDate();
  
  draft.status = 'approved';
  draft.approvedAt = new Date().toISOString();
  draft.scheduledPublishDate = scheduledDate;
  draft.lastModified = new Date().toISOString();
  currentStatus.lastUpdated = new Date().toISOString();
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  res.json({ message: 'Draft approved and scheduled', draft, scheduledDate });
});

// Add comment to blog draft
app.post('/api/blog-drafts/comment', (req, res) => {
  const { draftId, comment } = req.body;
  const draft = currentStatus.blogDrafts.find(d => d.id === draftId);
  
  if (!draft) {
    return res.status(404).json({ error: 'Draft not found' });
  }
  
  if (!draft.comments) {
    draft.comments = [];
  }
  
  draft.comments.push({
    author: 'Zero',
    text: comment,
    date: new Date().toISOString()
  });
  
  draft.lastModified = new Date().toISOString();
  currentStatus.lastUpdated = new Date().toISOString();
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  res.json({ message: 'Comment added', draft });
});

// Helper function to get next blog schedule date (every other day at 9 AM)
function getNextBlogScheduleDate() {
  const now = new Date();
  const scheduledDates = currentStatus.blogDrafts
    .filter(d => d.status === 'approved' && d.scheduledPublishDate)
    .map(d => new Date(d.scheduledPublishDate))
    .sort((a, b) => b - a);
  
  let nextDate = new Date();
  nextDate.setHours(9, 0, 0, 0);
  
  if (scheduledDates.length > 0) {
    // Start from the last scheduled date
    nextDate = new Date(scheduledDates[0]);
    nextDate.setDate(nextDate.getDate() + 2); // Every other day
  } else {
    // Start tomorrow
    nextDate.setDate(nextDate.getDate() + 1);
  }
  
  // If it's in the past, move to next available slot
  while (nextDate <= now) {
    nextDate.setDate(nextDate.getDate() + 2);
  }
  
  return nextDate.toISOString();
}

app.post('/api/blog-drafts/create', (req, res) => {
  const { title, content, author = 'System' } = req.body;
  const draft = {
    id: `draft-${Date.now()}`,
    title,
    content,
    status: 'draft',
    author,
    lastModified: new Date().toISOString(),
    wordCount: content ? content.split(/\s+/).length : 0,
    readTime: content ? Math.ceil(content.split(/\s+/).length / 200) + ' min' : '0 min',
    tags: [],
    comments: []
  };
  
  // Save content to file
  const filePath = `blog_${draft.id}.md`;
  const contentPath = path.join(BLOG_CONTENT_DIR, filePath);
  fs.writeFileSync(contentPath, content || '');
  draft.filePath = filePath;
  
  currentStatus.blogDrafts.push(draft);
  currentStatus.lastUpdated = new Date().toISOString();
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  res.json(draft);
});

// Social media API
app.post('/api/social-media-content/create', (req, res) => {
  const { platform, content, hashtags = [], mediaUrl = null } = req.body;
  const post = {
    id: `post-${Date.now()}`,
    platform,
    content,
    status: 'draft',
    scheduledDate: null,
    postedDate: null,
    engagement: null,
    hashtags,
    mediaUrl,
    createdAt: new Date().toISOString()
  };
  
  currentStatus.socialMediaContent = currentStatus.socialMediaContent || [];
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
  
  // Auto-schedule for next available slot
  const scheduledDate = getNextSocialScheduleDate();
  
  post.status = 'scheduled';
  post.scheduledDate = scheduledDate;
  post.lastModified = new Date().toISOString();
  currentStatus.lastUpdated = new Date().toISOString();
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  res.json({ message: 'Post approved and scheduled', post, scheduledDate });
});

// Helper function to get next social media schedule date
function getNextSocialScheduleDate() {
  const now = new Date();
  const scheduleTimes = [
    { hour: 9, minute: 0 },   // 9:00 AM
    { hour: 14, minute: 0 },  // 2:00 PM
    { hour: 18, minute: 0 }   // 6:00 PM
  ];
  
  // Get all scheduled dates
  const scheduledDates = currentStatus.socialMediaContent
    .filter(p => p.status === 'scheduled' && p.scheduledDate)
    .map(p => new Date(p.scheduledDate))
    .sort((a, b) => a - b);
  
  let nextDate = new Date(now);
  nextDate.setSeconds(0);
  nextDate.setMilliseconds(0);
  
  // Find next available slot
  let foundSlot = false;
  
  // Check today's remaining slots
  for (const time of scheduleTimes) {
    const slot = new Date(nextDate);
    slot.setHours(time.hour, time.minute, 0);
    
    if (slot > now) {
      // Check if this slot is already taken
      const slotTaken = scheduledDates.some(date => 
        date.getDate() === slot.getDate() && 
        date.getHours() === slot.getHours()
      );
      
      if (!slotTaken) {
        nextDate = slot;
        foundSlot = true;
        break;
      }
    }
  }
  
  // If no slot today, find next available day
  if (!foundSlot) {
    nextDate.setDate(nextDate.getDate() + 1);
    
    while (!foundSlot) {
      for (const time of scheduleTimes) {
        const slot = new Date(nextDate);
        slot.setHours(time.hour, time.minute, 0);
        
        const slotTaken = scheduledDates.some(date => 
          date.getDate() === slot.getDate() && 
          date.getHours() === slot.getHours() &&
          date.getMonth() === slot.getMonth()
        );
        
        if (!slotTaken) {
          nextDate = slot;
          foundSlot = true;
          break;
        }
      }
      
      if (!foundSlot) {
        nextDate.setDate(nextDate.getDate() + 1);
      }
    }
  }
  
  return nextDate.toISOString();
}

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

app.post('/api/social-media-content/publish', (req, res) => {
  const { postId } = req.body;
  const post = currentStatus.socialMediaContent.find(p => p.id === postId);
  
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }
  
  post.status = 'published';
  post.postedDate = new Date().toISOString();
  post.engagement = { likes: 0, retweets: 0, replies: 0, impressions: 0 };
  post.lastModified = new Date().toISOString();
  currentStatus.lastUpdated = new Date().toISOString();
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  res.json({ message: 'Post published', post });
});

// Projects API
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
      res.json({ message: 'Task updated', task, progress: currentStatus.projects[projectId].progress });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } else {
    res.status(404).json({ error: 'Project not found' });
  }
});

// Trading bot API
app.post('/api/trading-bot/toggle', (req, res) => {
  const { status } = req.body;
  currentStatus.tradingBot = currentStatus.tradingBot || {};
  currentStatus.tradingBot.status = status;
  currentStatus.lastUpdated = new Date().toISOString();
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  res.json({ status: currentStatus.tradingBot.status });
});

app.post('/api/trading-bot/config', (req, res) => {
  const { strategy, riskLevel } = req.body;
  currentStatus.tradingBot = currentStatus.tradingBot || {};
  currentStatus.tradingBot.strategy = strategy || currentStatus.tradingBot.strategy;
  currentStatus.tradingBot.riskLevel = riskLevel || currentStatus.tradingBot.riskLevel;
  currentStatus.lastUpdated = new Date().toISOString();
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  res.json(currentStatus.tradingBot);
});

// SaaS Tools API
app.post('/api/saas-tools/update', (req, res) => {
  const { toolId, updates } = req.body;
  const tool = currentStatus.saasTools.find(t => t.id === toolId);
  if (tool) {
    Object.assign(tool, updates);
    currentStatus.lastUpdated = new Date().toISOString();
    saveStatus(currentStatus);
    io.emit('statusUpdate', currentStatus);
    res.json(tool);
  } else {
    res.status(404).json({ error: 'Tool not found' });
  }
});

app.post('/api/saas-tools/deploy', (req, res) => {
  const { toolId } = req.body;
  const tool = currentStatus.saasTools.find(t => t.id === toolId);
  if (tool) {
    tool.status = 'operational';
    tool.deployedAt = new Date().toISOString();
    currentStatus.lastUpdated = new Date().toISOString();
    saveStatus(currentStatus);
    io.emit('statusUpdate', currentStatus);
    res.json({ message: 'Tool deployed', tool });
  } else {
    res.status(404).json({ error: 'Tool not found' });
  }
});

// Import Content Agent
const ContentAgent = require('../agents/content/content-agent');
const contentAgent = new ContentAgent();

// Content Generation API
app.post('/api/content/generate/twitter', (req, res) => {
  try {
    const post = contentAgent.generateTwitterPost();
    currentStatus.socialMediaContent = currentStatus.socialMediaContent || [];
    currentStatus.socialMediaContent.push(post);
    currentStatus.lastUpdated = new Date().toISOString();
    saveStatus(currentStatus);
    io.emit('statusUpdate', currentStatus);
    res.json({ message: 'Twitter post generated', post });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/content/generate/blog', (req, res) => {
  try {
    const draft = contentAgent.generateBlogPost();
    
    // Generate content for the blog
    const content = contentAgent.generateBlogContent(draft.title);
    const contentPath = path.join(BLOG_CONTENT_DIR, draft.filePath);
    fs.writeFileSync(contentPath, content);
    
    currentStatus.blogDrafts.push(draft);
    currentStatus.lastUpdated = new Date().toISOString();
    saveStatus(currentStatus);
    io.emit('statusUpdate', currentStatus);
    res.json({ message: 'Blog post generated', draft });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Twitter Bot API
app.get('/api/twitter/status', async (req, res) => {
  try {
    const status = twitterBot.getStatus();
    const followerCount = await twitterBot.getFollowerCount();
    res.json({
      ...status,
      followerCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/twitter/start', async (req, res) => {
  try {
    const started = await twitterBot.start();
    res.json({ started });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/twitter/stop', (req, res) => {
  twitterBot.stop();
  res.json({ stopped: true });
});

app.post('/api/twitter/post', async (req, res) => {
  try {
    const { content } = req.body;
    const tweet = await twitterBot.postImmediate(content);
    res.json({ posted: true, tweet });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Model Management API
app.post('/api/agents/switch-model', (req, res) => {
  const { agentId, modelId } = req.body;
  const agent = currentStatus.agents.find(a => a.id === agentId);
  const model = currentStatus.modelConfiguration?.availableModels?.find(m => m.id === modelId);
  
  if (!agent) {
    return res.status(404).json({ error: 'Agent not found' });
  }
  
  if (!model) {
    return res.status(404).json({ error: 'Model not found' });
  }
  
  // Update agent's model
  agent.currentModel = model.name;
  agent.provider = model.provider;
  agent.apiEndpoint = currentStatus.modelConfiguration?.apiConfiguration[model.provider.toLowerCase().replace('/', '')]?.endpoint || agent.apiEndpoint;
  agent.lastActivity = new Date().toISOString();
  
  currentStatus.lastUpdated = new Date().toISOString();
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  
  res.json({ 
    message: `Model switched successfully`, 
    agent,
    newModel: model 
  });
});

app.post('/api/config/update-api-key', (req, res) => {
  const { provider, key } = req.body;
  
  if (!provider || !key) {
    return res.status(400).json({ error: 'Provider and key are required' });
  }
  
  if (!currentStatus.modelConfiguration) {
    currentStatus.modelConfiguration = {};
  }
  if (!currentStatus.modelConfiguration.apiConfiguration) {
    currentStatus.modelConfiguration.apiConfiguration = {};
  }
  
  const config = currentStatus.modelConfiguration.apiConfiguration[provider];
  if (!config) {
    return res.status(404).json({ error: 'Provider not found' });
  }
  
  // Update key (store only last 4 chars for display)
  config.keyLast4 = key.slice(-4);
  config.status = 'connected'; // Assume valid key
  currentStatus.lastUpdated = new Date().toISOString();
  saveStatus(currentStatus);
  io.emit('statusUpdate', currentStatus);
  
  res.json({ 
    message: 'API key updated successfully', 
    provider,
    status: 'connected'
  });
});

app.post('/api/config/test-connection', (req, res) => {
  const { provider } = req.body;
  
  // Simulate connection test
  setTimeout(() => {
    const config = currentStatus.modelConfiguration?.apiConfiguration[provider];
    if (config) {
      config.status = 'connected';
      config.lastTested = new Date().toISOString();
      currentStatus.lastUpdated = new Date().toISOString();
      saveStatus(currentStatus);
      io.emit('statusUpdate', currentStatus);
      res.json({ success: true, message: 'Connection successful' });
    } else {
      res.status(404).json({ error: 'Provider not found' });
    }
  }, 1000);
});

// Get detailed agent info
app.get('/api/agents/:id', (req, res) => {
  const agent = currentStatus.agents.find(a => a.id === req.params.id);
  if (agent) {
    res.json(agent);
  } else {
    res.status(404).json({ error: 'Agent not found' });
  }
});

// Chat functionality
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('statusUpdate', currentStatus);
  
  // Handle chat messages
  socket.on('chatMessage', (data) => {
    console.log('Chat message received:', data);
    
    if (data.type === 'command') {
      // Handle commands
      switch(data.command) {
        case 'status':
          socket.emit('chatResponse', {
            message: `📊 System Status:\n` +
                    `• Website: ${currentStatus.website.status}\n` +
                    `• Twitter Bot: ${currentStatus.twitterBot?.isRunning ? 'Running' : 'Stopped'}\n` +
                    `• Buffer: ${currentStatus.socialMediaContent?.filter(p => p.status === 'draft').length || 0} posts waiting\n` +
                    `• Scheduled: ${currentStatus.socialMediaContent?.filter(p => p.status === 'scheduled').length || 0} posts`
          });
          break;
          
        case 'createTwitter':
          try {
            const post = contentAgent.generateTwitterPost();
            currentStatus.socialMediaContent = currentStatus.socialMediaContent || [];
            currentStatus.socialMediaContent.push(post);
            currentStatus.lastUpdated = new Date().toISOString();
            saveStatus(currentStatus);
            io.emit('statusUpdate', currentStatus);
            socket.emit('chatResponse', {
              message: `✅ Twitter post generated!\n\n"${post.content.substring(0, 100)}..."\n\nGo to the Social tab to approve and schedule it.`
            });
          } catch (error) {
            socket.emit('chatResponse', { message: '❌ Error: ' + error.message });
          }
          break;
          
        case 'createBlog':
          try {
            const draft = contentAgent.generateBlogPost();
            const content = contentAgent.generateBlogContent(draft.title);
            const contentPath = path.join(BLOG_CONTENT_DIR, draft.filePath);
            fs.writeFileSync(contentPath, content);
            
            currentStatus.blogDrafts.push(draft);
            currentStatus.lastUpdated = new Date().toISOString();
            saveStatus(currentStatus);
            io.emit('statusUpdate', currentStatus);
            socket.emit('chatResponse', {
              message: `✅ Blog post generated!\n\nTitle: "${draft.title}"\nLength: ${draft.wordCount} words\nRead time: ${draft.readTime}\n\nGo to the Blogs tab to approve and schedule it.`
            });
          } catch (error) {
            socket.emit('chatResponse', { message: '❌ Error: ' + error.message });
          }
          break;
          
        default:
          socket.emit('chatResponse', { message: 'Unknown command. Type /help for available commands.' });
      }
    } else {
      // Handle natural language messages
      const responses = [
        "I'm here to help! You can ask me to:\n• Create Twitter posts\n• Generate blog content\n• Check system status\n• Or just chat!",
        "Got it! Is there anything specific you'd like me to help you with regarding Zero Method?",
        "I'm processing that. Meanwhile, did you know you can type /status to check the system status?",
        "Thanks for reaching out! I'm your AI assistant. What would you like to work on today?"
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      socket.emit('chatResponse', { message: randomResponse });
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`🌀 Command Center v2.1 running on http://localhost:${PORT}`);
  console.log('Navigation: Home | Agents | Projects | Blogs | Social | SaaS | Trading | Chat');
  
  // Start Twitter Bot automatically
  console.log('🐦 Starting Twitter Bot...');
  twitterBot.start().then(success => {
    if (success) {
      console.log('✅ Twitter Bot started successfully');
    } else {
      console.log('⚠️ Twitter Bot failed to start - check credentials');
    }
  });
});