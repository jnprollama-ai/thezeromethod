const express = require('express');
const CodingAgent = require('./coding-agent');
const path = require('path');

const app = express();
const port = 3457;

app.use(express.json());
app.use(express.static('public'));

let codingAgent = new CodingAgent();

// Initialize the coding agent
(async () => {
  await codingAgent.initialize();
})();

// Routes
app.get('/api/status', (req, res) => {
  res.json(codingAgent.getStatus());
});

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, language } = req.body;
    const code = await codingAgent.generateCode(prompt, language);
    res.json({ code });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/review', async (req, res) => {
  try {
    const { code, language } = req.body;
    const review = await codingAgent.reviewCode(code, language);
    res.json({ review });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/refactor', async (req, res) => {
  try {
    const { code, instructions, language } = req.body;
    const refactoredCode = await codingAgent.refactorCode(code, instructions, language);
    res.json({ code: refactoredCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/explain', async (req, res) => {
  try {
    const { code, language } = req.body;
    const explanation = await codingAgent.explainCode(code, language);
    res.json({ explanation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/write-file', async (req, res) => {
  try {
    const { filepath, content } = req.body;
    const fullPath = await codingAgent.writeFile(filepath, content);
    res.json({ path: fullPath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/read-file', async (req, res) => {
  try {
    const { filepath } = req.query;
    const content = await codingAgent.readFile(filepath);
    res.json({ content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`👨‍💻 Coding Agent API running on http://localhost:${port}`);
  console.log(`📊 Status: http://localhost:${port}/api/status`);
});