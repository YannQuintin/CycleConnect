#!/bin/bash

echo "🚴‍♂️ CycleConnect Test Setup"
echo "=========================="

# Check if MongoDB is running
echo "📊 Checking MongoDB..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   brew services start mongodb/brew/mongodb-community"
    echo "   OR"
    echo "   sudo systemctl start mongod"
    exit 1
else
    echo "✅ MongoDB is running"
fi

# Check if Node.js is installed
echo "📊 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
else
    echo "✅ Node.js $(node --version) found"
fi

# Install dependencies if needed
echo "📦 Installing dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing root dependencies..."
    npm install
fi

if [ ! -d "server/node_modules" ]; then
    echo "Installing server dependencies..."
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "Installing client dependencies..."
    cd client && npm install && cd ..
fi

# Create test data
echo "🌱 Creating test data..."
cd server && npm run seed && cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Test Users Created:"
echo "   1. alice@test.com   | password123 | Advanced"
echo "   2. bob@test.com     | password123 | Intermediate" 
echo "   3. charlie@test.com | password123 | Beginner"
echo ""
echo "🚀 To start the application:"
echo "   npm run dev          # Start both server and client"
echo "   npm run server:dev   # Start only server"
echo "   npm run client:dev   # Start only client"
echo ""
echo "🧪 To run API tests:"
echo "   node test-api.js     # Test all API endpoints"
echo ""
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo "   Health:   http://localhost:5000/api/health"
