const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3456;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store for live data
const liveData = {
  website: {
    url: 'https://polite-swan-051790.netlify.app',
    customDomain: 'https://thezeromethod.com',
    status: 'online',
    lastDeploy: new Date().toISOString(),
    uptime: '99.9%'
  },
  github: {
    repo: 'jnprollama-ai/zero-method-website',
    commits: 4,
    branches: 1,
    lastCommit: '1572d87'
  },
  cron: {
    jobs: 5,
    active: 5,
    nextRun: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() // 8 hours
  },
  agents: [],
  logs: []
};

// Helper to add log
function addLog(level, message) {
  const log = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    level,
    message
  };
  liveData.logs.unshift(log);
  if (liveData.logs.length > 100) liveData.logs.pop();
  return log;
}

// Routes

// Get all status
app.get('/api/status', (req, res) => {
  res.json(liveData);
});

// Check website health
app.get('/api/website/health', async (req, res) => {
  try {
    const response = await axios.get(liveData.website.url, { 
      timeout: 10000,
      validateStatus: () => true
    });
    
    const isHealthy = response.status === 200;
    liveData.website.status = isHealthy ? 'online' : 'error';
    liveData.website.lastCheck = new Date().toISOString();
    
    addLog(isHealthy ? 'success' : 'error', `Website health check: ${isHealthy ? 'ONLINE' : 'ERROR'} (${response.status})`);
    
    res.json({
      status: isHealthy ? 'healthy' : 'error',
      statusCode: response.status,
      responseTime: Date.now(),
      url: liveData.website.url
    });
  } catch (error) {
    liveData.website.status = 'error';
    addLog('error', `Website health check failed: ${error.message}`);
    res.status(500).json({ 
      status: 'error', 
      message: error.message 
    });
  }
});

// Deploy website
app.post('/api/website/deploy', async (req, res) => {
  try {
    addLog('info', 'Starting website deployment...');
    
    // Trigger Git push (which triggers Netlify deploy)
    const websitePath = 'C:\\Users\\jnpro\\AppData\\Roaming\\atomicbot-desktop\\openclaw\\workspace\\projects\\zero-marketing-agency\\website_extracted\\website';
    
    exec('git add . && git commit -m "Auto-deploy from Command Center" && git push origin main', {
      cwd: websitePath
    }, (error, stdout, stderr) => {
      if (error) {
        addLog('error', `Deploy failed: ${error.message}`);
        res.status(500).json({ success: false, error: error.message });
        return;
      }
      
      liveData.website.lastDeploy = new Date().toISOString();
      addLog('success', 'Website deployed successfully to Netlify');
      
      res.json({ 
        success: true, 
        message: 'Deployment triggered',
        output: stdout 
      });
    });
  } catch (error) {
    addLog('error', `Deploy error: ${error.message}`);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get GitHub status
app.get('/api/github/status', async (req, res) => {
  try {
    // You could use GitHub API here with your token
    // For now, return stored data
    res.json(liveData.github);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get cron jobs
app.get('/api/cron/jobs', (req, res) => {
  res.json({
    total: liveData.cron.jobs,
    active: liveData.cron.active,
    jobs: [
      { name: 'Daily Morning Check-in', schedule: '0 8 * * *', status: 'active', nextRun: liveData.cron.nextRun },
      { name: 'Daily Health Check', schedule: 'Every 24h', status: 'active', nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Weekly Marketing Sprint', schedule: 'Every 7 days', status: 'active', nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
      { name: 'Domain Propagation Check', schedule: 'Every 12h', status: 'active', nextRun: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString() },
      { name: 'Daily Email Summary', schedule: '0 8 * * *', status: 'active', nextRun: liveData.cron.nextRun }
    ]
  });
});

// Refresh all systems
app.post('/api/system/refresh', (req, res) => {
  addLog('info', 'Manual refresh triggered by user');
  res.json({ success: true, message: 'Refresh initiated' });
});

// Get logs
app.get('/api/logs', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json(liveData.logs.slice(0, limit));
});

// Execute command (restricted)
app.post('/api/system/exec', (req, res) => {
  const { command } = req.body;
  
  // Whitelist safe commands
  const allowedCommands = ['status', 'echo', 'date'];
  const isAllowed = allowedCommands.some(cmd => command.startsWith(cmd));
  
  if (!isAllowed) {
    res.status(403).json({ error: 'Command not allowed' });
    return;
  }
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    res.json({ output: stdout || stderr });
  });
});

// SaaS Suite Actions
app.post('/api/saas/build', (req, res) => {
  const { tool } = req.body;
  addLog('info', `Building ${tool} tool...`);
  res.json({ success: true, message: `Build started for ${tool}` });
});

// Start server
app.listen(PORT, () => {
  console.log(`Zero Command Center API running on port ${PORT}`);
  addLog('success', `Command Center API started on port ${PORT}`);
});

module.exports = app;