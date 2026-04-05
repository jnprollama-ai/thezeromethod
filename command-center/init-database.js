const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Ensure data directory exists
if (!fs.existsSync('data')) {
 fs.mkdirSync('data');
}

// Create database
const db = new Database('data/command-center.db', {
 verbose: process.env.DEBUG ? console.log : null
});

// Enable WAL mode for concurrent reads
db.pragma('journal_mode = WAL');

// Create tables
db.exec(`
 CREATE TABLE IF NOT EXISTS agents (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 pokemon TEXT,
 role TEXT,
 function TEXT,
 status TEXT DEFAULT 'idle',
 current_model TEXT DEFAULT 'Claude-4.6-Sonnet',
 provider TEXT DEFAULT 'OpenRouter',
 api_endpoint TEXT,
 tokens_in INTEGER DEFAULT 0,
 tokens_out INTEGER DEFAULT 0,
 cost_estimate TEXT DEFAULT '$0.00',
 last_activity TEXT,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT DEFAULT CURRENT_TIMESTAMP
 );

 CREATE TABLE IF NOT EXISTS projects (
 id TEXT PRIMARY KEY,
 name TEXT NOT NULL,
 status TEXT DEFAULT 'planning',
 progress INTEGER DEFAULT 0,
 revenue REAL DEFAULT 0,
 description TEXT,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 updated_at TEXT DEFAULT CURRENT_TIMESTAMP
 );

 CREATE TABLE IF NOT EXISTS blog_drafts (
 id TEXT PRIMARY KEY,
 title TEXT NOT NULL,
 body TEXT,
 meta_description TEXT,
 tags TEXT, -- JSON array
 status TEXT DEFAULT 'draft', -- draft/in_review/approved/published/archived
 author TEXT DEFAULT 'Zero',
 word_count INTEGER DEFAULT 0,
 read_time TEXT,
 file_path TEXT,
 slug TEXT,
 live_url TEXT,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP,
 approved_at TEXT,
 published_at TEXT,
 archived_at TEXT
 );

 CREATE TABLE IF NOT EXISTS social_posts (
 id TEXT PRIMARY KEY,
 platform TEXT NOT NULL,
 content TEXT NOT NULL,
 status TEXT DEFAULT 'draft', -- draft/scheduled/posted/archived
 hashtags TEXT, -- JSON array
 scheduled_at TEXT,
 posted_at TEXT,
 media_url TEXT,
 engagement TEXT, -- JSON object
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
 );

 CREATE TABLE IF NOT EXISTS activity_log (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 type TEXT NOT NULL,
 message TEXT,
 data TEXT, -- JSON
 agent_id TEXT,
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
 );

 CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY,
 username TEXT UNIQUE NOT NULL,
 password_hash TEXT NOT NULL,
 role TEXT DEFAULT 'operator', -- operator/admin
 created_at TEXT DEFAULT CURRENT_TIMESTAMP
 );
`);

// Insert default users (password will be hashed in real auth setup)
const insertUser = db.prepare(`
 INSERT OR IGNORE INTO users (id, username, password_hash, role) 
 VALUES (?, ?, ?, ?)
`);

insertUser.run('admin-1', 'jon', '$2b$10$placeholderhash', 'admin');
insertUser.run('operator-1', 'zero', '$2b$10$placeholderhash', 'operator');

// Insert default agents
const agents = [
 { id: 'zero', name: 'Zero', pokemon: 'Mewtwo', role: 'Commander', function: 'Strategic oversight and coordination', status: 'active', model: 'Claude-4.6-Sonnet', provider: 'OpenRouter' },
 { id: 'research', name: 'Research Agent', pokemon: 'Alakazam', role: 'Analyst', function: 'Market research and competitor analysis', status: 'idle', model: 'Claude-4.6-Sonnet', provider: 'OpenRouter' },
 { id: 'content', name: 'Content Agent', pokemon: 'Rapidash', role: 'Creator', function: 'Blog posts and marketing content', status: 'active', model: 'Claude-4.6-Sonnet', provider: 'OpenRouter' },
 { id: 'seo', name: 'SEO Agent', pokemon: 'Porygon', role: 'Optimizer', function: 'SEO optimization and keyword research', status: 'idle', model: 'GPT-4', provider: 'OpenRouter' },
 { id: 'social', name: 'Social Agent', pokemon: 'Jigglypuff', role: 'Engager', function: 'Social media management and engagement', status: 'active', model: 'Claude-4.6-Sonnet', provider: 'OpenRouter' },
 { id: 'trading', name: 'Trading Bot', pokemon: 'Gyarados', role: 'Trader', function: 'Automated trading strategies', status: 'idle', model: 'GPT-4', provider: 'OpenRouter' },
 { id: 'pdf-designer', name: 'PDF-Design-Expert', pokemon: 'Alakazam', role: 'Document Specialist', function: 'Creates professional PDF documents', status: 'completed', model: 'Claude-4.6-Sonnet', provider: 'OpenRouter' },
 { id: 'coding-expert', name: 'Coding-Expert', pokemon: 'Porygon', role: 'Code Specialist', function: 'Code review and optimization', status: 'completed', model: 'Claude-4.6-Sonnet', provider: 'OpenRouter' }
];

const insertAgent = db.prepare(`
 INSERT OR IGNORE INTO agents (id, name, pokemon, role, function, status, current_model, provider, tokens_in, tokens_out, cost_estimate, last_activity)
 VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0, '$0.00', CURRENT_TIMESTAMP)
`);

agents.forEach(agent => {
 insertAgent.run(agent.id, agent.name, agent.pokemon, agent.role, agent.function, agent.status, agent.model, agent.provider);
});

// Migrate existing JSON data if it exists
const statusFile = path.join(__dirname, 'data', 'status.json');
if (fs.existsSync(statusFile)) {
 console.log('Migrating existing data from status.json...');
 const data = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
 
 // Migrate projects
 if (data.projects) {
 const insertProject = db.prepare(`
 INSERT OR REPLACE INTO projects (id, name, status, progress, revenue, description)
 VALUES (?, ?, ?, ?, ?, ?)
 `);
 
 Object.entries(data.projects).forEach(([key, project]) => {
 insertProject.run(key, project.name, project.status, project.progress || 0, project.revenue || 0, project.description || '');
 });
 }
 
 // Migrate blog drafts
 if (data.blogDrafts) {
 const insertDraft = db.prepare(`
 INSERT OR REPLACE INTO blog_drafts (id, title, body, status, author, word_count, read_time, tags, created_at, approved_at)
 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
 `);
 
 data.blogDrafts.forEach(draft => {
 insertDraft.run(
 draft.id,
 draft.title,
 draft.body || '',
 draft.status,
 draft.author,
 draft.wordCount || 0,
 draft.readTime || '',
 JSON.stringify(draft.tags || []),
 draft.lastModified || new Date().toISOString(),
 draft.approvedAt || null
 );
 });
 }
 
 console.log('Migration complete');
}

console.log('✅ Database initialized successfully');
console.log('📁 Database: data/command-center.db');
console.log('👤 Users: jon (admin), zero (operator)');
console.log(`🤖 Agents: ${agents.length} agents configured`);

db.close();