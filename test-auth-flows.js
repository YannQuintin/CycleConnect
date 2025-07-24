#!/usr/bin/env node

/**
 * CycleConnect API Testing Script
 * Easy local testing for authentication flows
 */

const API_BASE = 'http://localhost:5000';

// Test data
const testUsers = [
  {
    email: 'alice@test.com',
    password: 'password123',
    profile: {
      firstName: 'Alice',
      lastName: 'Johnson',
      bio: 'Love cycling in the mountains!'
    },
    cycling: {
      experienceLevel: 'intermediate',
      preferredDistance: 50,
      preferredTerrain: ['mountain', 'road']
    },
    location: {
      type: 'Point',
      coordinates: [-74.006, 40.7128] // NYC
    }
  },
  {
    email: 'bob@test.com',
    password: 'password456',
    profile: {
      firstName: 'Bob',
      lastName: 'Smith',
      bio: 'Urban cycling enthusiast'
    },
    cycling: {
      experienceLevel: 'beginner',
      preferredDistance: 20,
      preferredTerrain: ['road', 'city']
    },
    location: {
      type: 'Point',
      coordinates: [-73.935242, 40.730610] // Brooklyn
    }
  }
];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(`📋 ${title}`, 'cyan');
  console.log('='.repeat(60));
}

function logTest(test) {
  log(`🧪 ${test}`, 'yellow');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

async function makeRequest(method, endpoint, data = null, token = null) {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    ...(data && { body: JSON.stringify(data) })
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    return {
      status: response.status,
      success: response.ok,
      data: result
    };
  } catch (error) {
    return {
      status: 0,
      success: false,
      error: error.message
    };
  }
}

async function testHealthCheck() {
  logSection('Health Check');
  logTest('Testing server health endpoint');
  
  const result = await makeRequest('GET', '/health');
  
  if (result.success) {
    logSuccess(`Server is healthy! Status: ${result.status}`);
    logInfo(`Response: ${JSON.stringify(result.data, null, 2)}`);
  } else {
    logError(`Health check failed! Status: ${result.status}`);
    logError(`Error: ${result.error || JSON.stringify(result.data)}`);
  }
  
  return result.success;
}

async function testRegistration() {
  logSection('User Registration Tests');
  
  const results = [];
  
  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    logTest(`Registering user: ${user.email}`);
    
    const result = await makeRequest('POST', '/api/auth/register', user);
    
    if (result.success) {
      logSuccess(`User ${user.email} registered successfully!`);
      logInfo(`Token received: ${result.data.token ? 'Yes' : 'No'}`);
      results.push({
        email: user.email,
        token: result.data.token,
        user: result.data.user
      });
    } else {
      logError(`Registration failed for ${user.email}`);
      logError(`Status: ${result.status}`);
      logError(`Error: ${JSON.stringify(result.data, null, 2)}`);
    }
  }
  
  return results;
}

async function testLogin() {
  logSection('User Login Tests');
  
  const results = [];
  
  for (const user of testUsers) {
    logTest(`Logging in user: ${user.email}`);
    
    const result = await makeRequest('POST', '/api/auth/login', {
      email: user.email,
      password: user.password
    });
    
    if (result.success) {
      logSuccess(`User ${user.email} logged in successfully!`);
      logInfo(`Token received: ${result.data.token ? 'Yes' : 'No'}`);
      results.push({
        email: user.email,
        token: result.data.token,
        user: result.data.user
      });
    } else {
      logError(`Login failed for ${user.email}`);
      logError(`Status: ${result.status}`);
      logError(`Error: ${JSON.stringify(result.data, null, 2)}`);
    }
  }
  
  return results;
}

async function testTokenRefresh(tokens) {
  logSection('Token Refresh Tests');
  
  for (const tokenData of tokens) {
    if (!tokenData.token) continue;
    
    logTest(`Refreshing token for: ${tokenData.email}`);
    
    const result = await makeRequest('POST', '/api/auth/refresh', {
      token: tokenData.token
    });
    
    if (result.success) {
      logSuccess(`Token refreshed successfully for ${tokenData.email}!`);
      logInfo(`New token received: ${result.data.token ? 'Yes' : 'No'}`);
    } else {
      logError(`Token refresh failed for ${tokenData.email}`);
      logError(`Status: ${result.status}`);
      logError(`Error: ${JSON.stringify(result.data, null, 2)}`);
    }
  }
}

async function testProtectedEndpoint(tokens) {
  logSection('Protected Endpoint Tests');
  
  for (const tokenData of tokens) {
    if (!tokenData.token) continue;
    
    logTest(`Testing protected endpoint with token for: ${tokenData.email}`);
    
    const result = await makeRequest('GET', '/api/users/profile', null, tokenData.token);
    
    if (result.success) {
      logSuccess(`Protected endpoint accessible for ${tokenData.email}!`);
      logInfo(`Profile data received: ${result.data.email || 'No email'}`);
    } else {
      logError(`Protected endpoint failed for ${tokenData.email}`);
      logError(`Status: ${result.status}`);
      logError(`Error: ${JSON.stringify(result.data, null, 2)}`);
    }
  }
}

async function testInvalidScenarios() {
  logSection('Invalid Scenarios Tests');
  
  // Test invalid registration
  logTest('Testing registration with invalid email');
  let result = await makeRequest('POST', '/api/auth/register', {
    email: 'invalid-email',
    password: 'password123',
    profile: { firstName: 'Test', lastName: 'User' },
    location: { type: 'Point', coordinates: [0, 0] }
  });
  
  if (!result.success && result.status === 400) {
    logSuccess('Invalid email properly rejected');
  } else {
    logError('Invalid email should have been rejected');
  }
  
  // Test login with wrong password
  logTest('Testing login with wrong password');
  result = await makeRequest('POST', '/api/auth/login', {
    email: testUsers[0].email,
    password: 'wrongpassword'
  });
  
  if (!result.success && result.status === 401) {
    logSuccess('Wrong password properly rejected');
  } else {
    logError('Wrong password should have been rejected');
  }
  
  // Test protected endpoint without token
  logTest('Testing protected endpoint without token');
  result = await makeRequest('GET', '/api/users/profile');
  
  if (!result.success && result.status === 401) {
    logSuccess('Request without token properly rejected');
  } else {
    logError('Request without token should have been rejected');
  }
  
  // Test with invalid token
  logTest('Testing with invalid token');
  result = await makeRequest('GET', '/api/users/profile', null, 'invalid-token');
  
  if (!result.success && (result.status === 401 || result.status === 403)) {
    logSuccess('Invalid token properly rejected');
  } else {
    logError('Invalid token should have been rejected');
  }
}

async function runAllTests() {
  log('🚀 Starting CycleConnect API Tests', 'bright');
  log(`📍 API Base URL: ${API_BASE}`, 'blue');
  
  try {
    // Health check
    const healthOk = await testHealthCheck();
    if (!healthOk) {
      logError('Server health check failed. Make sure the server is running!');
      return;
    }
    
    // Registration tests
    const registeredUsers = await testRegistration();
    
    // Login tests
    const loggedInUsers = await testLogin();
    
    // Token refresh tests
    if (loggedInUsers.length > 0) {
      await testTokenRefresh(loggedInUsers);
    }
    
    // Protected endpoint tests
    if (loggedInUsers.length > 0) {
      await testProtectedEndpoint(loggedInUsers);
    }
    
    // Invalid scenarios
    await testInvalidScenarios();
    
    logSection('Test Summary');
    logSuccess('All tests completed!');
    logInfo(`Registered users: ${registeredUsers.length}`);
    logInfo(`Successfully logged in: ${loggedInUsers.length}`);
    
  } catch (error) {
    logError(`Test suite failed: ${error.message}`);
  }
}

// Check if fetch is available (Node 18+)
if (typeof fetch === 'undefined') {
  console.error('❌ This script requires Node.js 18+ or you need to install node-fetch');
  console.log('💡 Try: npm install node-fetch@2');
  process.exit(1);
}

// Run tests if called directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runAllTests,
  testHealthCheck,
  testRegistration,
  testLogin,
  testTokenRefresh,
  testProtectedEndpoint,
  testInvalidScenarios
};
