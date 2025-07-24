#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

// Test registration flow
const testRegistration = async () => {
  console.log('\n🔐 Testing User Registration Flow...\n'.cyan);
  
  const testUser = {
    email: `test_${Date.now()}@example.com`, // Unique email
    password: 'testPassword123!',
    profile: {
      firstName: 'Test',
      lastName: 'User',
      phone: '555-0123',
      dateOfBirth: '1990-01-01',
      gender: 'other',
      cyclingExperience: 'intermediate'
    }
  };

  try {
    console.log('📝 Attempting to register user with data:');
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Name: ${testUser.profile.firstName} ${testUser.profile.lastName}`);
    console.log(`   Experience: ${testUser.profile.cyclingExperience}`);

    const response = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
    
    if (response.status === 201 || response.status === 200) {
      console.log('✅ Registration successful!'.green);
      console.log('📄 Response data:');
      console.log(`   User ID: ${response.data.user._id}`);
      console.log(`   Email: ${response.data.user.email}`);
      console.log(`   Token provided: ${response.data.token ? 'Yes' : 'No'}`);
      console.log(`   Profile created: ${response.data.user.profile ? 'Yes' : 'No'}`);
      
      return {
        success: true,
        user: response.data.user,
        token: response.data.token,
        testUser: testUser
      };
    }
  } catch (error) {
    console.log('❌ Registration failed!'.red);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return { success: false, error: error.message };
  }
};

// Test login flow
const testLogin = async (email, password) => {
  console.log('\n🔑 Testing User Login Flow...\n'.cyan);
  
  try {
    console.log('📝 Attempting to login with:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${'*'.repeat(password.length)}`);

    const response = await axios.post(`${BASE_URL}/api/auth/login`, {
      email,
      password
    });
    
    if (response.status === 200) {
      console.log('✅ Login successful!'.green);
      console.log('📄 Response data:');
      console.log(`   User ID: ${response.data.user._id}`);
      console.log(`   Email: ${response.data.user.email}`);
      console.log(`   Name: ${response.data.user.profile.firstName} ${response.data.user.profile.lastName}`);
      console.log(`   Token provided: ${response.data.token ? 'Yes' : 'No'}`);
      console.log(`   Token length: ${response.data.token?.length || 0} characters`);
      
      return {
        success: true,
        user: response.data.user,
        token: response.data.token
      };
    }
  } catch (error) {
    console.log('❌ Login failed!'.red);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return { success: false, error: error.message };
  }
};

// Test profile retrieval with token
const testProfileRetrieval = async (token) => {
  console.log('\n👤 Testing Profile Retrieval with Token...\n'.cyan);
  
  try {
    console.log('📝 Making authenticated request to /api/auth/profile');
    console.log(`   Using token: ${token.substring(0, 20)}...`);

    const response = await axios.get(`${BASE_URL}/api/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.status === 200) {
      console.log('✅ Profile retrieval successful!'.green);
      console.log('📄 Profile data:');
      console.log(`   User ID: ${response.data._id}`);
      console.log(`   Email: ${response.data.email}`);
      console.log(`   Name: ${response.data.profile.firstName} ${response.data.profile.lastName}`);
      console.log(`   Experience: ${response.data.cycling.experienceLevel}`);
      console.log(`   Verified: ${response.data.profile.verified}`);
      
      return { success: true, profile: response.data };
    }
  } catch (error) {
    console.log('❌ Profile retrieval failed!'.red);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Error: ${JSON.stringify(error.response.data, null, 2)}`);
    } else {
      console.log(`   Error: ${error.message}`);
    }
    return { success: false, error: error.message };
  }
};

// Test with existing user
const testExistingUserLogin = async () => {
  console.log('\n🔄 Testing Login with Existing Test User...\n'.cyan);
  
  return await testLogin('alice@test.com', 'password123');
};

// Main test function
const runAuthTests = async () => {
  console.log('🧪 CycleConnect Authentication Flow Verification'.rainbow.bold);
  console.log('=====================================================\n');

  try {
    // Test 1: Registration
    const registrationResult = await testRegistration();
    
    if (registrationResult.success) {
      // Test 2: Login with newly registered user
      const loginResult = await testLogin(
        registrationResult.testUser.email, 
        registrationResult.testUser.password
      );
      
      if (loginResult.success) {
        // Test 3: Profile retrieval
        await testProfileRetrieval(loginResult.token);
      }
    }
    
    // Test 4: Login with existing user
    const existingUserResult = await testExistingUserLogin();
    
    if (existingUserResult.success) {
      await testProfileRetrieval(existingUserResult.token);
    }

    console.log('\n🎉 Authentication testing completed!'.rainbow.bold);
    console.log('=====================================================');

  } catch (error) {
    console.log('\n❌ Test suite failed:'.red.bold);
    console.log(error);
  }
};

// Check server connectivity first
const checkServerHealth = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Server is running and healthy'.green);
    console.log(`   Database status: ${response.data.database}`);
    return true;
  } catch (error) {
    console.log('❌ Cannot connect to server!'.red.bold);
    console.log('💡 Make sure the backend server is running:'.yellow);
    console.log('   cd server && npm run dev'.yellow);
    return false;
  }
};

// Start the tests
const startTests = async () => {
  console.log('🔍 Checking server connectivity...\n');
  
  if (await checkServerHealth()) {
    await runAuthTests();
  }
};

startTests();
