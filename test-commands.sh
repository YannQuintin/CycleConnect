#!/bin/bash

# CycleConnect API Testing with curl
# Easy copy-paste commands for manual testing

API_BASE="http://localhost:5000"

echo "🚀 CycleConnect API Testing Commands"
echo "======================================"
echo ""

echo "📋 1. HEALTH CHECK"
echo "-------------------"
echo "curl -X GET $API_BASE/health"
echo ""

echo "📋 2. USER REGISTRATION"
echo "------------------------"
echo "# Register Alice"
echo 'curl -X POST $API_BASE/api/auth/register \
  -H "Content-Type: application/json" \
  -d '"'"'{
    "email": "alice@test.com",
    "password": "password123",
    "profile": {
      "firstName": "Alice",
      "lastName": "Johnson",
      "bio": "Love cycling in the mountains!"
    },
    "cycling": {
      "experienceLevel": "intermediate",
      "preferredDistance": 50,
      "preferredTerrain": ["mountain", "road"]
    },
    "location": {
      "type": "Point",
      "coordinates": [-74.006, 40.7128]
    }
  }'"'"''
echo ""

echo "# Register Bob"
echo 'curl -X POST $API_BASE/api/auth/register \
  -H "Content-Type: application/json" \
  -d '"'"'{
    "email": "bob@test.com",
    "password": "password456",
    "profile": {
      "firstName": "Bob",
      "lastName": "Smith",
      "bio": "Urban cycling enthusiast"
    },
    "cycling": {
      "experienceLevel": "beginner",
      "preferredDistance": 20,
      "preferredTerrain": ["road", "city"]
    },
    "location": {
      "type": "Point",
      "coordinates": [-73.935242, 40.730610]
    }
  }'"'"''
echo ""

echo "📋 3. USER LOGIN"
echo "-----------------"
echo "# Login Alice"
echo 'curl -X POST $API_BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '"'"'{
    "email": "alice@test.com",
    "password": "password123"
  }'"'"''
echo ""

echo "# Login Bob"
echo 'curl -X POST $API_BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '"'"'{
    "email": "bob@test.com",
    "password": "password456"
  }'"'"''
echo ""

echo "📋 4. TOKEN REFRESH"
echo "-------------------"
echo "# Replace YOUR_TOKEN with actual token from login"
echo 'curl -X POST $API_BASE/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '"'"'{
    "token": "YOUR_TOKEN"
  }'"'"''
echo ""

echo "📋 5. PROTECTED ENDPOINTS"
echo "-------------------------"
echo "# Get user profile (replace YOUR_TOKEN)"
echo 'curl -X GET $API_BASE/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"'
echo ""

echo "# Get all rides"
echo 'curl -X GET $API_BASE/api/rides \
  -H "Authorization: Bearer YOUR_TOKEN"'
echo ""

echo "📋 6. INVALID SCENARIOS (for testing error handling)"
echo "-----------------------------------------------------"
echo "# Invalid email format"
echo 'curl -X POST $API_BASE/api/auth/register \
  -H "Content-Type: application/json" \
  -d '"'"'{
    "email": "invalid-email",
    "password": "password123",
    "profile": {"firstName": "Test", "lastName": "User"},
    "location": {"type": "Point", "coordinates": [0, 0]}
  }'"'"''
echo ""

echo "# Wrong password"
echo 'curl -X POST $API_BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '"'"'{
    "email": "alice@test.com",
    "password": "wrongpassword"
  }'"'"''
echo ""

echo "# No token provided"
echo 'curl -X GET $API_BASE/api/users/profile'
echo ""

echo "# Invalid token"
echo 'curl -X GET $API_BASE/api/users/profile \
  -H "Authorization: Bearer invalid-token"'
echo ""

echo "📋 7. USEFUL TIPS"
echo "-----------------"
echo "# Pretty print JSON responses:"
echo "curl ... | jq"
echo ""
echo "# Save token to variable:"
echo 'TOKEN=$(curl -s -X POST $API_BASE/api/auth/login \
  -H "Content-Type: application/json" \
  -d '"'"'{"email": "alice@test.com", "password": "password123"}'"'"' | jq -r .token)'
echo ""
echo "# Use saved token:"
echo 'curl -X GET $API_BASE/api/users/profile \
  -H "Authorization: Bearer $TOKEN"'
echo ""

echo "💡 Pro tip: Install 'jq' for better JSON formatting:"
echo "   brew install jq   # on macOS"
echo "   apt install jq    # on Ubuntu"
