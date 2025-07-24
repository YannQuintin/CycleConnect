# 🧪 CycleConnect API Testing Guide

## Quick Start

Make sure your development server is running:
```bash
npm run dev
```

## Testing Methods

### 1. 🚀 Automated Test Suite
Run comprehensive tests automatically:
```bash
npm run test:auth
# or
node test-auth-flows.js
```

**Features:**
- Tests all authentication flows
- Validates error handling
- Checks protected endpoints
- Color-coded output
- Detailed logging

### 2. 🎮 Interactive Testing
Step-by-step guided testing:
```bash
npm run test:interactive
# or
node interactive-test.js
```

**Features:**
- Interactive menu
- Custom input prompts
- Real-time feedback
- Great for manual testing

### 3. 📋 Copy-Paste Commands
Get ready-to-use curl commands:
```bash
npm run test:commands
# or
cat test-commands.sh
```

**Features:**
- Ready-to-copy curl commands
- All major endpoints covered
- Examples for error scenarios

### 4. 🔌 VS Code REST Client
Use the `api-tests.http` file with the REST Client extension:

1. Install "REST Client" extension in VS Code
2. Open `api-tests.http`
3. Click "Send Request" above any request
4. View responses inline

### 5. 🌐 Browser Testing
Access the frontend at:
- **Frontend**: http://localhost:3000
- **Backend Health**: http://localhost:5000/health

## Test Scenarios Covered

### ✅ Registration Tests
- Valid user registration
- Duplicate email handling
- Invalid email format
- Missing required fields
- Password validation

### ✅ Login Tests
- Valid credentials
- Invalid email
- Wrong password
- Non-existent user

### ✅ Token Management
- Token generation
- Token refresh
- Expired tokens
- Invalid tokens
- Malformed tokens

### ✅ Protected Endpoints
- With valid token
- Without token
- With invalid token
- Token expiration

### ✅ Error Handling
- Validation errors
- Authentication errors
- Server errors
- Network errors

## Sample Test Users

The automated tests create these users:

**Alice (Intermediate Cyclist)**
- Email: alice@test.com
- Password: password123
- Location: NYC

**Bob (Beginner Cyclist)**
- Email: bob@test.com
- Password: password456
- Location: Brooklyn

## Expected Server Responses

### Successful Registration
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "alice@test.com",
    "profile": {
      "firstName": "Alice",
      "lastName": "Johnson"
    }
  }
}
```

### Successful Login
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "alice@test.com",
    "profile": {
      "firstName": "Alice",
      "lastName": "Johnson"
    }
  }
}
```

### Error Response
```json
{
  "error": "Validation failed",
  "message": "Please check your input data",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Monitoring Server Logs

Watch the server terminal for detailed logging:
- 🔐 Authentication attempts
- ✅ Successful operations
- ❌ Failed operations
- ⚠️ Warnings
- ℹ️ Informational messages

## Troubleshooting

### Server Not Running
```bash
# Check if MongoDB is running
brew services list | grep mongodb

# Start MongoDB if needed
brew services start mongodb-community@7.0

# Restart development server
npm run dev
```

### Port Conflicts
- Backend: http://localhost:5000
- Frontend: http://localhost:3000
- MongoDB: localhost:27017

### Token Issues
1. Copy token from login response
2. Use in Authorization header: `Bearer YOUR_TOKEN`
3. Tokens expire after 7 days by default

### Common Errors
- **401 Unauthorized**: Invalid or missing token
- **400 Bad Request**: Validation errors
- **500 Internal Server Error**: Server/database issues

## Advanced Testing

### Using jq for JSON formatting
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@test.com", "password": "password123"}' | jq
```

### Saving tokens in variables
```bash
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "alice@test.com", "password": "password123"}' | jq -r .token)

curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

## Performance Testing

For load testing, consider tools like:
- **Artillery**: `npm install -g artillery`
- **k6**: Load testing tool
- **Apache Bench**: `ab -n 100 -c 10 http://localhost:5000/health`

## Next Steps

1. Run the automated test suite first
2. Use interactive testing for edge cases
3. Test frontend integration
4. Check error handling thoroughly
5. Verify authentication flows work end-to-end

Happy testing! 🎉
