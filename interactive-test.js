#!/usr/bin/env node

/**
 * Interactive CycleConnect API Tester
 * Step-by-step guided testing
 */

const readline = require('readline');

const API_BASE = 'http://localhost:5000';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
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

async function showMenu() {
  console.clear();
  log('🚀 CycleConnect Interactive API Tester', 'cyan');
  log('=========================================', 'cyan');
  console.log();
  log('Available Tests:', 'yellow');
  log('1. Health Check', 'white');
  log('2. Register New User', 'white');
  log('3. Login User', 'white');
  log('4. Refresh Token', 'white');
  log('5. Test Protected Endpoint', 'white');
  log('6. Test Invalid Scenarios', 'white');
  log('7. Quick Full Test', 'white');
  log('8. Exit', 'white');
  console.log();
}

async function testHealthCheck() {
  log('🏥 Testing Health Check...', 'blue');
  
  const result = await makeRequest('GET', '/health');
  
  if (result.success) {
    log(`✅ Server is healthy! Status: ${result.status}`, 'green');
    console.log('Response:', JSON.stringify(result.data, null, 2));
  } else {
    log(`❌ Health check failed! Status: ${result.status}`, 'red');
    console.log('Error:', result.error || JSON.stringify(result.data, null, 2));
  }
  
  await question('\nPress Enter to continue...');
}

async function registerUser() {
  log('👤 User Registration', 'blue');
  console.log();
  
  const email = await question('Email: ');
  const password = await question('Password: ');
  const firstName = await question('First Name: ');
  const lastName = await question('Last Name: ');
  const bio = await question('Bio (optional): ');
  
  const userData = {
    email,
    password,
    profile: {
      firstName,
      lastName,
      ...(bio && { bio })
    },
    location: {
      type: 'Point',
      coordinates: [-74.006, 40.7128] // Default to NYC
    }
  };
  
  log('\n📤 Sending registration request...', 'yellow');
  
  const result = await makeRequest('POST', '/api/auth/register', userData);
  
  if (result.success) {
    log('✅ Registration successful!', 'green');
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    if (result.data.token) {
      log(`\n🔑 Token: ${result.data.token}`, 'cyan');
    }
  } else {
    log(`❌ Registration failed! Status: ${result.status}`, 'red');
    console.log('Error:', JSON.stringify(result.data, null, 2));
  }
  
  await question('\nPress Enter to continue...');
}

async function loginUser() {
  log('🔐 User Login', 'blue');
  console.log();
  
  const email = await question('Email: ');
  const password = await question('Password: ');
  
  log('\n📤 Sending login request...', 'yellow');
  
  const result = await makeRequest('POST', '/api/auth/login', { email, password });
  
  if (result.success) {
    log('✅ Login successful!', 'green');
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    if (result.data.token) {
      log(`\n🔑 Token: ${result.data.token}`, 'cyan');
      log('💾 Copy this token for protected endpoint tests!', 'yellow');
    }
  } else {
    log(`❌ Login failed! Status: ${result.status}`, 'red');
    console.log('Error:', JSON.stringify(result.data, null, 2));
  }
  
  await question('\nPress Enter to continue...');
}

async function refreshToken() {
  log('🔄 Token Refresh', 'blue');
  console.log();
  
  const token = await question('Enter token to refresh: ');
  
  log('\n📤 Sending refresh request...', 'yellow');
  
  const result = await makeRequest('POST', '/api/auth/refresh', { token });
  
  if (result.success) {
    log('✅ Token refresh successful!', 'green');
    console.log('Response:', JSON.stringify(result.data, null, 2));
    
    if (result.data.token) {
      log(`\n🔑 New Token: ${result.data.token}`, 'cyan');
    }
  } else {
    log(`❌ Token refresh failed! Status: ${result.status}`, 'red');
    console.log('Error:', JSON.stringify(result.data, null, 2));
  }
  
  await question('\nPress Enter to continue...');
}

async function testProtectedEndpoint() {
  log('🛡️  Protected Endpoint Test', 'blue');
  console.log();
  
  const token = await question('Enter your token: ');
  
  log('\n📤 Testing /api/users/profile...', 'yellow');
  
  const result = await makeRequest('GET', '/api/users/profile', null, token);
  
  if (result.success) {
    log('✅ Protected endpoint accessible!', 'green');
    console.log('Response:', JSON.stringify(result.data, null, 2));
  } else {
    log(`❌ Protected endpoint failed! Status: ${result.status}`, 'red');
    console.log('Error:', JSON.stringify(result.data, null, 2));
  }
  
  await question('\nPress Enter to continue...');
}

async function testInvalidScenarios() {
  log('🚫 Invalid Scenarios Test', 'blue');
  console.log();
  
  log('Testing various invalid inputs...', 'yellow');
  
  // Invalid email
  log('\n1. Testing invalid email format...', 'white');
  let result = await makeRequest('POST', '/api/auth/register', {
    email: 'invalid-email',
    password: 'password123',
    profile: { firstName: 'Test', lastName: 'User' },
    location: { type: 'Point', coordinates: [0, 0] }
  });
  
  if (!result.success && result.status === 400) {
    log('✅ Invalid email properly rejected', 'green');
  } else {
    log('❌ Invalid email should have been rejected', 'red');
  }
  
  // Wrong password
  log('\n2. Testing wrong password...', 'white');
  result = await makeRequest('POST', '/api/auth/login', {
    email: 'alice@test.com',
    password: 'wrongpassword'
  });
  
  if (!result.success && result.status === 401) {
    log('✅ Wrong password properly rejected', 'green');
  } else {
    log('❌ Wrong password should have been rejected', 'red');
  }
  
  // No token
  log('\n3. Testing protected endpoint without token...', 'white');
  result = await makeRequest('GET', '/api/users/profile');
  
  if (!result.success && result.status === 401) {
    log('✅ Request without token properly rejected', 'green');
  } else {
    log('❌ Request without token should have been rejected', 'red');
  }
  
  // Invalid token
  log('\n4. Testing invalid token...', 'white');
  result = await makeRequest('GET', '/api/users/profile', null, 'invalid-token');
  
  if (!result.success && (result.status === 401 || result.status === 403)) {
    log('✅ Invalid token properly rejected', 'green');
  } else {
    log('❌ Invalid token should have been rejected', 'red');
  }
  
  await question('\nPress Enter to continue...');
}

async function quickFullTest() {
  log('⚡ Quick Full Test', 'blue');
  console.log();
  
  const testUser = {
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    profile: {
      firstName: 'Quick',
      lastName: 'Test'
    },
    location: {
      type: 'Point',
      coordinates: [-74.006, 40.7128]
    }
  };
  
  log('1. Testing health check...', 'white');
  let result = await makeRequest('GET', '/health');
  log(result.success ? '✅ Health check passed' : '❌ Health check failed', result.success ? 'green' : 'red');
  
  log('\n2. Testing registration...', 'white');
  result = await makeRequest('POST', '/api/auth/register', testUser);
  log(result.success ? '✅ Registration passed' : '❌ Registration failed', result.success ? 'green' : 'red');
  
  log('\n3. Testing login...', 'white');
  result = await makeRequest('POST', '/api/auth/login', {
    email: testUser.email,
    password: testUser.password
  });
  log(result.success ? '✅ Login passed' : '❌ Login failed', result.success ? 'green' : 'red');
  
  if (result.success && result.data.token) {
    const token = result.data.token;
    
    log('\n4. Testing token refresh...', 'white');
    result = await makeRequest('POST', '/api/auth/refresh', { token });
    log(result.success ? '✅ Token refresh passed' : '❌ Token refresh failed', result.success ? 'green' : 'red');
    
    log('\n5. Testing protected endpoint...', 'white');
    result = await makeRequest('GET', '/api/users/profile', null, token);
    log(result.success ? '✅ Protected endpoint passed' : '❌ Protected endpoint failed', result.success ? 'green' : 'red');
  }
  
  log('\n🎉 Quick test completed!', 'cyan');
  await question('\nPress Enter to continue...');
}

async function main() {
  // Check if fetch is available
  if (typeof fetch === 'undefined') {
    log('❌ This script requires Node.js 18+ or node-fetch', 'red');
    rl.close();
    return;
  }
  
  while (true) {
    await showMenu();
    
    const choice = await question('Choose an option (1-8): ');
    
    switch (choice) {
      case '1':
        await testHealthCheck();
        break;
      case '2':
        await registerUser();
        break;
      case '3':
        await loginUser();
        break;
      case '4':
        await refreshToken();
        break;
      case '5':
        await testProtectedEndpoint();
        break;
      case '6':
        await testInvalidScenarios();
        break;
      case '7':
        await quickFullTest();
        break;
      case '8':
        log('👋 Goodbye!', 'cyan');
        rl.close();
        return;
      default:
        log('❌ Invalid choice. Please try again.', 'red');
        await question('Press Enter to continue...');
    }
  }
}

main().catch(console.error);
