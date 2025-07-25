#!/bin/bash

# MongoDB Atlas Connection Tester
echo "🔧 MongoDB Atlas Connection Helper"
echo "=================================="
echo ""

echo "Let's create a new database user and test the connection:"
echo ""

echo "1. 📝 Please create a new user in MongoDB Atlas:"
echo "   - Go to Database Access"
echo "   - Click 'Add New Database User'"
echo "   - Username: cycleconnect"
echo "   - Password: Use 'Autogenerate Secure Password'"
echo "   - Privileges: 'Read and write to any database'"
echo ""

echo "2. 🔗 Get your connection string:"
echo "   - Go to Clusters"
echo "   - Click 'Connect' on your cluster"
echo "   - Choose 'Connect your application'"
echo "   - Copy the connection string"
echo ""

echo "3. 🧪 Test the connection:"
echo "   Paste your connection string here and we'll test it"
echo ""

read -p "Enter your MongoDB Atlas connection string: " ATLAS_URI

if [ -z "$ATLAS_URI" ]; then
    echo "❌ No connection string provided"
    exit 1
fi

echo ""
echo "🧪 Testing connection..."

# Test the connection
if mongosh "$ATLAS_URI" --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ Connection successful!"
    echo ""
    echo "📝 Add this to your .env file:"
    echo "MONGODB_URI=$ATLAS_URI"
    echo ""
    echo "🔄 To update your app:"
    echo "1. Update server/.env with the new MONGODB_URI"
    echo "2. Restart your development server"
    echo "3. Your app will now use MongoDB Atlas"
else
    echo "❌ Connection failed"
    echo ""
    echo "Common issues:"
    echo "• Password contains special characters (use URL encoding)"
    echo "• IP not whitelisted (add 0.0.0.0/0)"
    echo "• Cluster still provisioning (wait 1-2 minutes)"
    echo "• Incorrect cluster name"
fi
