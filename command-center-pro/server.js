const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const PORT = 3456;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'client', 'public')));

// Pokemon GIF URLs
const POKEMON_GIFS = {
    150: 'https://play.pokemonshowdown.com/sprites/gen5ani/mewtwo.gif',
    65: 'https://play.pokemonshowdown.com/sprites/gen5ani/alakazam.gif',
    78: 'https://play.pokemonshowdown.com/sprites/gen5ani/rapidash.gif',
    137: 'https://play.pokemonshowdown.com/sprites/gen5ani/porygon.gif',
    39: 'https://play.pokemonshowdown.com/sprites/gen5ani/jigglypuff.gif'
};

// Live Data Store
const liveData = {
    agents: [
        { id: 'zero', name: 'Zero', pokemon: 'Mewtwo', number: 150, role: 'Commander', type: 'Psychic', status: 'active', task: 'Coordinating operations', hp: 100, maxHp: 100, level: 50, x: 350, y: 250, direction: 'down', isMoving: false, message: null },
        { id: 'research', name: 'Research', pokemon: 'Alakazam', number: 65, role: 'Analyst', type: 'Psychic', status: 'busy', task: 'Market research', hp: 85, maxHp: 100, level: 45, x: 100, y: 250, direction: 'down', isMoving: false, message: null },
        { id: 'content', name: 'Content', pokemon: 'Rapidash', number: 78, role: 'Creator', type: 'Fire', status: 'active', task: 'Website redesign', hp: 90, maxHp: 100, level: 42, x: 600, y: 250, direction: 'down', isMoving: false, message: null },
        { id: 'seo', name: 'SEO', pokemon: 'Porygon', number: 137, role: 'Optimizer', type: 'Digital', status: 'active', task: 'SEO analysis', hp: 95, maxHp: 100, level: 38, x: 220, y: 120, direction: 'down', isMoving: false, message: null },
        { id: 'social', name: 'Social', pokemon: 'Jigglypuff', number: 39, role: 'Engager', type: 'Fairy', status: 'active', task: 'Social media', hp: 80, maxHp: 100, level: 35, x: 480, y: 120, direction: 'down', isMoving: false, message: null }
    ],
    projects: [
        { 
            id: 1, 
            name: 'Zero Method Website', 
            status: 'live', 
            progress: 95, 
            team: ['zero', 'content', 'seo'], 
            desc: 'AI Productivity Suite landing page with Stripe checkout, Discord integration, and automated deployment.',
            details: {
                startDate: '2024-03-01',
                deadline: '2024-04-15',
                budget: '$0',
                revenue: '$0',
                tech: ['Astro', 'Netlify', 'Stripe', 'Discord API'],
                milestones: [
                    { name: 'Design', complete: true },
                    { name: 'Development', complete: true },
                    { name: 'Integration', complete: true },
                    { name: 'Launch', complete: true }
                ]
            },
            proposal: {
                title: 'Phase 2 Enhancement',
                description: 'Add user authentication, dashboard, and analytics tracking',
                cost: '$500',
                timeline: '2 weeks',
                approved: null
            }
        },
        { 
            id: 2, 
            name: 'SaaS Suite - 7 Tools', 
            status: 'planning', 
            progress: 15, 
            team: ['research', 'content', 'seo'], 
            desc: 'PDF tools, Image editor, QR generator, URL shortener, JSON formatter, Dev tools, File converter.',
            details: {
                startDate: '2024-04-01',
                deadline: '2024-06-01',
                budget: '$33/month',
                revenue: '$262/month (projected)',
                tech: ['Node.js', 'Sharp', 'PDF-lib', 'React'],
                milestones: [
                    { name: 'Research', complete: true },
                    { name: 'Architecture', complete: false },
                    { name: 'PDF Tools', complete: false },
                    { name: 'Image Tools', complete: false },
                    { name: 'Launch', complete: false }
                ]
            },
            proposal: {
                title: 'SaaS Suite MVP Launch',
                description: 'Build and deploy first 3 tools: PDF, Image, and QR generator with freemium model',
                cost: '$100',
                timeline: '4 weeks',
                approved: null
            }
        },
        { 
            id: 3, 
            name: 'Command Center PRO', 
            status: 'active', 
            progress: 85, 
            team: ['zero'], 
            desc: 'Full-stack dashboard with React, live Pokemon office, chat system, and Kanban board.',
            details: {
                startDate: '2024-04-01',
                deadline: '2024-04-10',
                budget: '$0',
                revenue: '$0',
                tech: ['React', 'Socket.io', 'Express', 'WebGL'],
                milestones: [
                    { name: 'React Setup', complete: true },
                    { name: 'Pokemon Office', complete: true },
                    { name: 'Chat System', complete: true },
                    { name: 'Kanban Board', complete: false },
                    { name: 'Deploy', complete: false }
                ]
            },
            proposal: {
                title: 'AI-Powered Command Center',
                description: 'Integrate GPT-4 for automated task assignment and predictive analytics',
                cost: '$200',
                timeline: '3 weeks',
                approved: null
            }
        }
    ],
    cronJobs: [
        { id: 'cron-1', name: 'Daily Morning Check-in', schedule: '0 8 * * *', status: 'active', lastRun: '2024-04-01 08:00', nextRun: '2024-04-02 08:00', description: 'Send daily summary to Discord/email' },
        { id: 'cron-2', name: 'Website Health Check', schedule: '*/15 * * * *', status: 'active', lastRun: '2024-04-01 23:45', nextRun: '2024-04-02 00:00', description: 'Monitor website uptime every 15 minutes' },
        { id: 'cron-3', name: 'Weekly Marketing Sprint', schedule: '0 8 * * 1', status: 'active', lastRun: '2024-04-01 08:00', nextRun: '2024-04-08 08:00', description: 'Run marketing research and content planning' },
        { id: 'cron-4', name: 'Domain Propagation Check', schedule: '0 */12 * * *', status: 'active', lastRun: '2024-04-01 12:00', nextRun: '2024-04-02 00:00', description: 'Check DNS propagation status' },
        { id: 'cron-5', name: 'Daily Email Summary', schedule: '0 8 * * *', status: 'active', lastRun: '2024-04-01 08:00', nextRun: '2024-04-02 08:00', description: 'Send email digest to jnprollama@gmail.com' }
    ],
    kanban: {
        columns: [
            { id: 'todo', title: '📋 To Do', color: '#ff9500', tasks: [
                { id: 't1', title: 'Design SaaS landing page', assignee: 'content', priority: 'high', tags: ['design', 'ui'] },
                { id: 't2', title: 'Research competitors', assignee: 'research', priority: 'medium', tags: ['research'] },
                { id: 't3', title: 'Setup Stripe webhooks', assignee: 'zero', priority: 'high', tags: ['backend'] }
            ]},
            { id: 'progress', title: '🔄 In Progress', color: '#00d4ff', tasks: [
                { id: 't4', title: 'Build Pokemon Office animations', assignee: 'zero', priority: 'high', tags: ['frontend', 'animation'] },
                { id: 't5', title: 'SEO optimization', assignee: 'seo', priority: 'medium', tags: ['seo'] }
            ]},
            { id: 'review', title: '👀 Review', color: '#b829dd', tasks: [
                { id: 't6', title: 'Test payment flow', assignee: 'zero', priority: 'high', tags: ['testing'] }
            ]},
            { id: 'done', title: '✅ Done', color: '#00ff88', tasks: [
                { id: 't7', title: 'Setup Discord notifications', assignee: 'social', priority: 'medium', tags: ['integration'] },
                { id: 't8', title: 'Deploy v1.0', assignee: 'zero', priority: 'high', tags: ['deploy'] }
            ]}
        ]
    },
    chat: [
        { id: 1, sender: 'system', agent: null, message: 'Welcome to Pokemon Command Center PRO! 🎮', timestamp: new Date().toISOString() },
        { id: 2, sender: 'agent', agent: 'zero', message: 'Greetings! I\'m Zero (Mewtwo), your commander. How can I assist you today?', timestamp: new Date().toISOString() }
    ],
    logs: []
};

// Simulate Pokemon movement
function simulateMovement() {
    liveData.agents.forEach(agent => {
        if (Math.random() > 0.6) {
            // Random movement
            const moveX = (Math.random() - 0.5) * 30;
            const moveY = (Math.random() - 0.5) * 30;
            agent.x = Math.max(50, Math.min(700, agent.x + moveX));
            agent.y = Math.max(50, Math.min(350, agent.y + moveY));
            agent.isMoving = true;
            agent.direction = moveX > 0 ? 'right' : 'left';
        } else {
            agent.isMoving = false;
        }
        
        // Regenerate HP slowly
        if (agent.hp < agent.maxHp && Math.random() > 0.8) {
            agent.hp = Math.min(agent.maxHp, agent.hp + 1);
        }
    });
}

// Simulate agent talking
function simulateAgentChat() {
    if (Math.random() > 0.95) {
        const talkingAgent = liveData.agents[Math.floor(Math.random() * liveData.agents.length)];
        const messages = [
            `${talkingAgent.name}: Task completed! ⚡`,
            `${talkingAgent.name}: Ready for next assignment! 💪`,
            `${talkingAgent.name}: Analyzing data... 🧠`,
            `${talkingAgent.name}: HP at ${talkingAgent.hp}%! 💚`
        ];
        
        const agentMessage = messages[Math.floor(Math.random() * messages.length)];
        talkingAgent.message = agentMessage;
        
        // Clear message after 5 seconds
        setTimeout(() => {
            talkingAgent.message = null;
            io.emit('data', liveData);
        }, 5000);
    }
}

// Serve static
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'public', 'index.html'));
});

// Socket.io
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Send initial data
    socket.emit('data', liveData);
    
    // Handle chat messages
    socket.on('chat-message', (message) => {
        const newMessage = {
            id: Date.now(),
            sender: 'user',
            agent: null,
            message: message,
            timestamp: new Date().toISOString()
        };
        
        liveData.chat.push(newMessage);
        
        // Simulate agent response
        setTimeout(() => {
            const respondingAgent = liveData.agents[Math.floor(Math.random() * liveData.agents.length)];
            const responses = [
                `Roger that! I'll handle that right away! ⚡`,
                `Copy that, Commander! ${respondingAgent.pokemon} is on it! 🎯`,
                `Task acknowledged! My ${respondingAgent.type} abilities are ready! 💪`,
                `Consider it done! I'm at ${respondingAgent.hp}% HP and ready to roll! 🚀`
            ];
            
            liveData.chat.push({
                id: Date.now(),
                sender: 'agent',
                agent: respondingAgent.id,
                message: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date().toISOString()
            });
            
            io.emit('data', liveData);
        }, 1000);
        
        io.emit('data', liveData);
    });
    
    // Handle task assignment
    socket.on('assign-task', ({ agentId, taskTitle }) => {
        const agent = liveData.agents.find(a => a.id === agentId);
        if (agent) {
            agent.task = taskTitle;
            agent.status = 'busy';
            
            liveData.chat.push({
                id: Date.now(),
                sender: 'system',
                message: `Task "${taskTitle}" assigned to ${agent.name}!`,
                timestamp: new Date().toISOString()
            });
            
            io.emit('data', liveData);
        }
    });
    
    // Handle Kanban moves
    socket.on('move-task', ({ taskId, fromColumn, toColumn }) => {
        const fromCol = liveData.kanban.columns.find(c => c.id === fromColumn);
        const toCol = liveData.kanban.columns.find(c => c.id === toColumn);
        const task = fromCol.tasks.find(t => t.id === taskId);
        
        if (task && fromCol && toCol) {
            fromCol.tasks = fromCol.tasks.filter(t => t.id !== taskId);
            toCol.tasks.push(task);
            
            liveData.logs.push({
                time: new Date().toISOString(),
                level: 'info',
                message: `Task "${task.title}" moved from ${fromCol.title} to ${toCol.title}`
            });
            
            io.emit('data', liveData);
        }
    });
    
    // Handle proposal approval
    socket.on('approve-proposal', (projectId) => {
        const project = liveData.projects.find(p => p.id === projectId);
        if (project && project.proposal) {
            project.proposal.approved = true;
            
            liveData.logs.push({
                time: new Date().toISOString(),
                level: 'success',
                message: `Proposal "${project.proposal.title}" for ${project.name} APPROVED!`
            });
            
            io.emit('data', liveData);
        }
    });
    
    socket.on('reject-proposal', (projectId) => {
        const project = liveData.projects.find(p => p.id === projectId);
        if (project && project.proposal) {
            project.proposal.approved = false;
            
            liveData.logs.push({
                time: new Date().toISOString(),
                level: 'warning',
                message: `Proposal "${project.proposal.title}" for ${project.name} rejected`
            });
            
            io.emit('data', liveData);
        }
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start simulation loops
setInterval(() => {
    simulateMovement();
    io.emit('data', liveData);
}, 2000);

setInterval(() => {
    simulateAgentChat();
    io.emit('data', liveData);
}, 5000);

// Periodic logging
setInterval(() => {
    const messages = [
        'System heartbeat - All Pokemon operational',
        `${liveData.agents.filter(a => a.status === 'active').length} agents currently active`,
        'Task queue processed successfully',
        'Cron scheduler - Next job in 15 minutes',
        'Pokemon office running smoothly'
    ];
    
    liveData.logs.push({
        time: new Date().toISOString(),
        level: 'info',
        message: messages[Math.floor(Math.random() * messages.length)]
    });
    
    if (liveData.logs.length > 50) {
        liveData.logs = liveData.logs.slice(-50);
    }
}, 8000);

// Start server
server.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║     ◈ ZERO COMMAND CENTER PRO v3.0 - React Edition            ║
║                                                                ║
║     🎮 Live Pokemon Office with Animated GIFs                   ║
║     💬 Real-time Chat System                                  ║
║     📋 Interactive Kanban Board                               ║
║     📊 Project Management with Proposals                      ║
║     ⏰ Cron Job Scheduler                                      ║
║                                                                ║
║     Server: http://localhost:${PORT}                           ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
    `);
});

module.exports = { app, server, io };