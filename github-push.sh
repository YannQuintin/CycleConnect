#!/bin/bash

echo "🚀 CycleConnect GitHub Push Script"
echo "=================================="

# Check if repository exists
if [ ! -d ".git" ]; then
    echo "❌ Not a git repository. Initializing..."
    git init
    git add .
    git commit -m "Initial commit: Complete CycleConnect cycling social network application"
fi

# Set remote
echo "📡 Setting up GitHub remote..."
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/YannQuintin/CycleConnect.git

# Try to push
echo "📤 Attempting to push to GitHub..."
echo "When prompted, enter:"
echo "Username: YannQuintin"
echo "Password: [Your Personal Access Token]"
echo ""

git push -u origin main

echo "✅ Done! Check https://github.com/YannQuintin/CycleConnect"
