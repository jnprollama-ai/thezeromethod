#!/usr/bin/env python3
"""
Zero Command Center - Python Flask Edition
Live, interactive, with SQLite persistence
"""

from flask import Flask, render_template, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import sqlite3
import json
from datetime import datetime
from threading import Thread
import time
import os

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')

# Database setup
DB_PATH = 'command_center.db'

def init_db():
    """Initialize SQLite database with persistence"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Agents table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS agents (
            id TEXT PRIMARY KEY,
            name TEXT,
            pokemon TEXT,
            number INTEGER,
            role TEXT,
            type TEXT,
            status TEXT,
            task TEXT,
            hp INTEGER DEFAULT 100,
            max_hp INTEGER DEFAULT 100,
            level INTEGER DEFAULT 1,
            x REAL DEFAULT 350,
            y REAL DEFAULT 250,
            last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Projects table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY,
            name TEXT,
            status TEXT,
            progress INTEGER DEFAULT 0,
            team TEXT,
            description TEXT,
            revenue REAL DEFAULT 0,
            visitors INTEGER DEFAULT 0
        )
    ''')
    
    # Revenue tracking
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS revenue (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT,
            source TEXT,
            amount REAL,
            notes TEXT
        )
    ''')
    
    # Trading positions
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS trading_positions (
            id TEXT PRIMARY KEY,
            symbol TEXT,
            type TEXT,
            quantity INTEGER,
            entry_price REAL,
            current_price REAL,
            timestamp TEXT,
            status TEXT DEFAULT 'open'
        )
    ''')
    
    # Logs
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp TEXT,
            level TEXT,
            message TEXT
        )
    ''')
    
    # Initialize default data if empty
    cursor.execute('SELECT COUNT(*) FROM agents')
    if cursor.fetchone()[0] == 0:
        agents = [
            ('zero', 'Zero', 'Mewtwo', 150, 'Commander', 'Psychic', 'active', 'Coordinating operations', 100, 100, 50, 350, 250),
            ('research', 'Research', 'Alakazam', 65, 'Analyst', 'Psychic', 'busy', 'Market research', 85, 100, 45, 100, 250),
            ('content', 'Content', 'Rapidash', 78, 'Creator', 'Fire', 'active', 'Website content', 90, 100, 42, 600, 250),
            ('seo', 'SEO', 'Porygon', 137, 'Optimizer', 'Digital', 'active', 'SEO analysis', 95, 100, 38, 220, 120),
            ('social', 'Social', 'Jigglypuff', 39, 'Engager', 'Fairy', 'active', 'Social media', 80, 100, 35, 480, 120)
        ]
        cursor.executemany('''
            INSERT INTO agents (id, name, pokemon, number, role, type, status, task, hp, max_hp, level, x, y)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', agents)
    
    cursor.execute('SELECT COUNT(*) FROM projects')
    if cursor.fetchone()[0] == 0:
        projects = [
            (1, 'Zero Method Website', 'live', 95, 'zero,content,seo', 'AI Productivity Suite with Stripe checkout', 0, 0),
            (2, 'Trading Dashboard', 'active', 25, 'research,zero', 'Real-time trading analytics', 0, 0),
            (3, 'Zero SaaS Suite', 'planning', 10, 'research,content', '7-tool productivity suite', 0, 0)
        ]
        cursor.executemany('''
            INSERT INTO projects (id, name, status, progress, team, description, revenue, visitors)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', projects)
    
    conn.commit()
    conn.close()
    print("✅ Database initialized")

def get_data():
    """Get all current data from database"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    # Get agents
    cursor.execute('SELECT * FROM agents')
    agents = [dict(row) for row in cursor.fetchall()]
    
    # Get projects
    cursor.execute('SELECT * FROM projects')
    projects = [dict(row) for row in cursor.fetchall()]
    
    # Get total revenue
    cursor.execute('SELECT COALESCE(SUM(amount), 0) FROM revenue')
    total_revenue = cursor.fetchone()[0]
    
    # Get revenue by source
    cursor.execute('''
        SELECT source, COALESCE(SUM(amount), 0) as total 
        FROM revenue 
        GROUP BY source
    ''')
    revenue_by_source = {row[0]: row[1] for row in cursor.fetchall()}
    
    # Get logs
    cursor.execute('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100')
    logs = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    
    return {
        'agents': agents,
        'projects': projects,
        'revenue': {
            'current': total_revenue,
            'target': 500,
            'by_source': revenue_by_source
        },
        'logs': logs,
        'timestamp': datetime.now().isoformat()
    }

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/status')
def status():
    return jsonify(get_data())

@app.route('/api/agents/<agent_id>/update', methods=['POST'])
def update_agent(agent_id):
    data = request.json
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE agents 
        SET task = ?, status = ?, hp = ?, last_updated = CURRENT_TIMESTAMP
        WHERE id = ?
    ''', (data.get('task'), data.get('status'), data.get('hp'), agent_id))
    
    conn.commit()
    conn.close()
    
    # Broadcast update
    socketio.emit('data_update', get_data())
    return jsonify({'success': True})

@app.route('/api/revenue/add', methods=['POST'])
def add_revenue():
    data = request.json
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO revenue (date, source, amount, notes)
        VALUES (?, ?, ?, ?)
    ''', (datetime.now().isoformat(), data.get('source'), data.get('amount'), data.get('notes')))
    
    conn.commit()
    conn.close()
    
    # Log it
    log_event('success', f"Revenue added: ${data.get('amount')} from {data.get('source')}")
    
    socketio.emit('data_update', get_data())
    return jsonify({'success': True})

@app.route('/api/trading/position', methods=['POST'])
def add_position():
    data = request.json
    import uuid
    
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO trading_positions (id, symbol, type, quantity, entry_price, current_price, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (str(uuid.uuid4()), data.get('symbol'), data.get('type'), 
          data.get('quantity'), data.get('price'), data.get('price'),
          datetime.now().isoformat()))
    
    conn.commit()
    conn.close()
    
    log_event('info', f"Trading position opened: {data.get('symbol')} {data.get('type')}")
    socketio.emit('data_update', get_data())
    return jsonify({'success': True})

def log_event(level, message):
    """Add log entry"""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('INSERT INTO logs (timestamp, level, message) VALUES (?, ?, ?)',
                   (datetime.now().isoformat(), level, message))
    conn.commit()
    conn.close()

@socketio.on('connect')
def handle_connect():
    print(f'Client connected: {datetime.now()}')
    emit('initial_data', get_data())

@socketio.on('disconnect')
def handle_disconnect():
    print(f'Client disconnected: {datetime.now()}')

@socketio.on('chat_message')
def handle_chat(data):
    msg = data.get('message', '')
    log_event('info', f'Chat: {msg}')
    
    # Broadcast to all clients
    socketio.emit('chat_broadcast', {
        'sender': 'user',
        'message': msg,
        'timestamp': datetime.now().isoformat()
    })

def simulation_loop():
    """Background simulation - agents move, markets update"""
    while True:
        time.sleep(5)
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            
            # Random agent movement
            cursor.execute('SELECT id, x, y FROM agents')
            agents = cursor.fetchall()
            for agent in agents:
                import random
                new_x = max(50, min(700, agent[1] + (random.random() - 0.5) * 20))
                new_y = max(50, min(350, agent[2] + (random.random() - 0.5) * 20))
                cursor.execute('UPDATE agents SET x = ?, y = ? WHERE id = ?',
                             (new_x, new_y, agent[0]))
            
            conn.commit()
            conn.close()
            
            # Broadcast update
            socketio.emit('data_update', get_data())
        except Exception as e:
            print(f"Simulation error: {e}")

if __name__ == '__main__':
    print("Initializing...")
    init_db()
    
    # Start simulation thread
    sim_thread = Thread(target=simulation_loop, daemon=True)
    sim_thread.start()
    
    print("""
╔════════════════════════════════════════════════════════════════╗
║                                                               ║
║     ◈ ZERO COMMAND CENTER - PYTHON EDITION v1.0              ║
║                                                               ║
║     🐍 Flask + SQLite + SocketIO                              ║
║     💾 Data persists to SQLite database                        ║
║     🔄 Real-time updates via WebSocket                        ║
║                                                               ║
║     URL: http://localhost:3456                                 ║
║                                                               ║
╚════════════════════════════════════════════════════════════════╝
    """)
    
    # Run server
    socketio.run(app, host='0.0.0.0', port=3456, debug=False, use_reloader=False)
