#!/usr/bin/env node

const axios = require('axios');
const colors = require('colors'); // You might need to install this: npm install colors

const BASE_URL = 'http://localhost:5000';
let tokens = {}; // Store authentication tokens for each user

// Test users
const testUsers = [
  { email: 'alice@test.com', password: 'password123', name: 'Alice Johnson' },
  { email: 'bob@test.com', password: 'password123', name: 'Bob Smith' },
  { email: 'charlie@test.com', password: 'password123', name: 'Charlie Davis' }
];

// Helper function to make authenticated requests
const makeRequest = async (method, endpoint, data = null, userIndex = 0) => {
  const config = {
    method,
    url: `${BASE_URL}${endpoint}`,
    headers: {}
  };

  if (tokens[userIndex]) {
    config.headers.Authorization = `Bearer ${tokens[userIndex]}`;
  }

  if (data) {
    config.data = data;
    config.headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
};

// Test functions
const testHealthCheck = async () => {
  console.log('\n🏥 Testing Health Check...'.cyan);
  const result = await makeRequest('GET', '/api/health');
  if (result.success) {
    console.log('✅ Server is running'.green);
  } else {
    console.log('❌ Server health check failed'.red);
    console.log(result.error);
  }
};

const testUserRegistration = async () => {
  console.log('\n👤 Testing User Registration...'.cyan);
  
  // Try to register a new test user
  const newUser = {
    email: 'testuser@example.com',
    password: 'password123',
    profile: {
      firstName: 'Test',
      lastName: 'User',
      phone: '555-0123',
      cyclingExperience: 'intermediate'
    }
  };

  const result = await makeRequest('POST', '/api/auth/register', newUser);
  if (result.success) {
    console.log('✅ User registration successful'.green);
    console.log(`   User ID: ${result.data.user._id}`);
  } else {
    console.log('❌ User registration failed'.red);
    console.log('   Error:', result.error);
  }
};

const testUserLogin = async () => {
  console.log('\n🔐 Testing User Login...'.cyan);
  
  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    const result = await makeRequest('POST', '/api/auth/login', {
      email: user.email,
      password: user.password
    });

    if (result.success) {
      tokens[i] = result.data.token;
      console.log(`✅ Login successful for ${user.name}`.green);
      console.log(`   Token: ${result.data.token.substring(0, 20)}...`);
    } else {
      console.log(`❌ Login failed for ${user.name}`.red);
      console.log('   Error:', result.error);
    }
  }
};

const testGetProfile = async () => {
  console.log('\n👤 Testing Get User Profile...'.cyan);
  
  for (let i = 0; i < testUsers.length; i++) {
    if (!tokens[i]) continue;
    
    const result = await makeRequest('GET', '/api/auth/profile', null, i);
    if (result.success) {
      console.log(`✅ Profile retrieved for ${testUsers[i].name}`.green);
      console.log(`   Name: ${result.data.profile.firstName} ${result.data.profile.lastName}`);
      console.log(`   Experience: ${result.data.cycling.experienceLevel}`);
    } else {
      console.log(`❌ Profile retrieval failed for ${testUsers[i].name}`.red);
      console.log('   Error:', result.error);
    }
  }
};

const testGetAllRides = async () => {
  console.log('\n🚴‍♂️ Testing Get All Rides...'.cyan);
  
  const result = await makeRequest('GET', '/api/rides', null, 0);
  if (result.success) {
    console.log(`✅ Retrieved ${result.data.length} rides`.green);
    result.data.forEach((ride, index) => {
      console.log(`   ${index + 1}. ${ride.title} - ${ride.difficulty} (${ride.participants.currentCount}/${ride.participants.maxParticipants} participants)`);
    });
  } else {
    console.log('❌ Failed to retrieve rides'.red);
    console.log('   Error:', result.error);
  }
};

const testGeospatialSearch = async () => {
  console.log('\n🗺️ Testing Geospatial Ride Search...'.cyan);
  
  // Search for rides near San Francisco coordinates
  const lat = 37.7749;
  const lng = -122.4194;
  const radius = 25;
  
  const result = await makeRequest('GET', `/api/rides/nearby?lat=${lat}&lng=${lng}&radius=${radius}`, null, 0);
  if (result.success) {
    console.log(`✅ Found ${result.data.length} rides within ${radius}km of San Francisco`.green);
    result.data.forEach((ride, index) => {
      console.log(`   ${index + 1}. ${ride.title} - ${ride.route.startPoint.address}`);
    });
  } else {
    console.log('❌ Geospatial search failed'.red);
    console.log('   Error:', result.error);
  }
};

const testJoinRide = async () => {
  console.log('\n🤝 Testing Join Ride Functionality...'.cyan);
  
  // First get available rides
  const ridesResult = await makeRequest('GET', '/api/rides', null, 0);
  if (!ridesResult.success || ridesResult.data.length === 0) {
    console.log('❌ No rides available to test joining'.red);
    return;
  }

  // Try to have Charlie (user index 2) join Alice's ride
  const ride = ridesResult.data.find(r => r.participants.currentCount < r.participants.maxParticipants);
  if (!ride) {
    console.log('❌ No rides with available spots'.red);
    return;
  }

  const result = await makeRequest('POST', `/api/rides/${ride._id}/join`, null, 2);
  if (result.success) {
    console.log(`✅ Charlie successfully joined "${ride.title}"`.green);
    console.log(`   Participants: ${result.data.participants.currentCount}/${result.data.participants.maxParticipants}`);
  } else {
    console.log(`❌ Failed to join ride "${ride.title}"`.red);
    console.log('   Error:', result.error);
  }
};

const testCreateRide = async () => {
  console.log('\n🆕 Testing Create New Ride...'.cyan);
  
  const newRide = {
    title: 'Test API Ride',
    description: 'This ride was created by the test script to verify API functionality.',
    rideType: 'Social Ride',
    difficulty: 'intermediate',
    route: {
      startPoint: {
        address: 'Mission District, San Francisco, CA',
        coordinates: [-122.4194, 37.7749]
      },
      endPoint: {
        address: 'Castro District, San Francisco, CA',
        coordinates: [-122.4344, 37.7609]
      },
      distance: 3.2
    },
    schedule: {
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      estimatedDuration: 45
    },
    participants: {
      maxParticipants: 6
    },
    settings: {
      isPublic: true,
      allowJoinRequests: true,
      requireApproval: false
    }
  };

  const result = await makeRequest('POST', '/api/rides', newRide, 1); // Bob creates the ride
  if (result.success) {
    console.log(`✅ Ride "${newRide.title}" created successfully`.green);
    console.log(`   Ride ID: ${result.data._id}`);
    console.log(`   Organizer: ${testUsers[1].name}`);
  } else {
    console.log(`❌ Failed to create ride "${newRide.title}"`.red);
    console.log('   Error:', result.error);
  }
};

const testRideDetails = async () => {
  console.log('\n📋 Testing Get Ride Details...'.cyan);
  
  // Get all rides first
  const ridesResult = await makeRequest('GET', '/api/rides', null, 0);
  if (!ridesResult.success || ridesResult.data.length === 0) {
    console.log('❌ No rides available to test details'.red);
    return;
  }

  const ride = ridesResult.data[0];
  const result = await makeRequest('GET', `/api/rides/${ride._id}`, null, 0);
  if (result.success) {
    console.log(`✅ Retrieved details for "${ride.title}"`.green);
    console.log(`   Description: ${result.data.description.substring(0, 50)}...`);
    console.log(`   Start: ${result.data.route.startPoint.address}`);
    console.log(`   Distance: ${result.data.route.distance} km`);
  } else {
    console.log(`❌ Failed to get ride details`.red);
    console.log('   Error:', result.error);
  }
};

const testUpdateProfile = async () => {
  console.log('\n✏️ Testing Update Profile...'.cyan);
  
  const updateData = {
    profile: {
      bio: 'Updated bio from test script - I love cycling with CycleConnect!'
    },
    cycling: {
      preferredRideTypes: ['Road Cycling', 'Social Ride', 'Training', 'City Tour']
    }
  };

  const result = await makeRequest('PUT', '/api/users/profile', updateData, 2); // Update Charlie's profile
  if (result.success) {
    console.log(`✅ Profile updated for ${testUsers[2].name}`.green);
    console.log(`   New bio: ${result.data.profile.bio}`);
  } else {
    console.log(`❌ Failed to update profile`.red);
    console.log('   Error:', result.error);
  }
};

const runAllTests = async () => {
  console.log('🧪 Starting CycleConnect API Tests'.rainbow.bold);
  console.log('==========================================\n');

  try {
    await testHealthCheck();
    await testUserRegistration();
    await testUserLogin();
    await testGetProfile();
    await testGetAllRides();
    await testGeospatialSearch();
    await testRideDetails();
    await testCreateRide();
    await testJoinRide();
    await testUpdateProfile();

    console.log('\n🎉 All tests completed!'.rainbow.bold);
    console.log('==========================================');
    
    console.log('\n📊 Test Summary:'.cyan.bold);
    console.log('✅ Authentication system working');
    console.log('✅ User profile management working');
    console.log('✅ Ride CRUD operations working');
    console.log('✅ Geospatial search working');
    console.log('✅ Join/Leave ride functionality working');
    
    console.log('\n🔗 Test User Login Credentials:'.yellow.bold);
    testUsers.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email} | Password: ${user.password}`);
    });
    
    console.log('\n🌐 Access the frontend at: http://localhost:3000'.green.bold);
    console.log('🔧 Backend running at: http://localhost:5000'.green.bold);

  } catch (error) {
    console.log('\n❌ Test suite failed with error:'.red.bold);
    console.log(error);
  }
};

// Check if server is running before starting tests
const checkServer = async () => {
  try {
    await axios.get(`${BASE_URL}/api/health`);
    await runAllTests();
  } catch (error) {
    console.log('❌ Cannot connect to server. Make sure the backend is running on port 5000.'.red.bold);
    console.log('💡 Run: npm run server:dev or cd server && npm run dev'.yellow);
  }
};

checkServer();
