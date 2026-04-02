#!/bin/bash

# Command Center Production Deployment Script
set -e

echo "🚀 Deploying Command Center v4.0..."

# Check environment
if [ -z "$JWT_SECRET" ]; then
    echo "❌ JWT_SECRET not set"
    exit 1
fi

# Pull latest code
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Build React client (if exists)
if [ -d "client" ]; then
    cd client
    npm ci
    npm run build
    cd ..
fi

# Create data directory
mkdir -p data

# Start with Docker Compose
echo "🐳 Starting Docker containers..."
docker-compose down
docker-compose up -d --build

# Health check
echo "🏥 Health check..."
sleep 5
if curl -s http://localhost:3456/api/health > /dev/null; then
    echo "✅ Command Center deployed successfully!"
    echo "🔗 URL: https://command.thezeromethod.com"
else
    echo "❌ Health check failed"
    exit 1
fi
