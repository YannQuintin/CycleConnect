#!/bin/bash

echo "🔍 MongoDB Atlas URI Finder"
echo "==========================="
echo ""
echo "Let's find your MongoDB URI step by step:"
echo ""

echo "1. 🌐 Opening MongoDB Atlas..."
open "https://cloud.mongodb.com/v2#/overview"

echo ""
echo "2. 📋 Follow these steps in the browser:"
echo ""
echo "   a) Sign in to MongoDB Atlas"
echo "   b) Select your project (or create one)"
echo "   c) Look for your cluster on the overview page"
echo ""
echo "   If you see a cluster:"
echo "   ✅ Click 'Connect' button"
echo "   ✅ Choose 'Connect your application'"
echo "   ✅ Copy the connection string"
echo ""
echo "   If you DON'T see a cluster:"
echo "   🆕 Click 'Build a Database'"
echo "   🆕 Choose 'M0 FREE' (shared cluster)"
echo "   🆕 Keep default settings and click 'Create'"
echo ""

echo "3. 🔐 Database User Setup:"
echo "   - Username: cycleconnect"
echo "   - Password: (auto-generate or use: password123)"
echo "   - Save the password!"
echo ""

echo "4. 🌍 Network Access:"
echo "   - Add IP: 0.0.0.0/0 (allow from anywhere)"
echo ""

echo "5. 📝 Your connection string will look like:"
echo "   mongodb+srv://cycleconnect:PASSWORD@cluster0.xxxxx.mongodb.net/cycleconnect"
echo ""

echo "6. 🧪 Test it with our helper:"
echo "   ./atlas-connection-helper.sh"
echo ""

echo "Need help? The browser should be open now ⬆️"
