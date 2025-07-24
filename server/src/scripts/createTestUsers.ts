import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../models/User';
import Ride from '../models/Ride';
import dotenv from 'dotenv';

dotenv.config();

const createTestUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cycleconnect');
    console.log('Connected to MongoDB');

    // Clear existing test data
    await User.deleteMany({ email: { $in: ['alice@test.com', 'bob@test.com', 'charlie@test.com'] } });
    await Ride.deleteMany({});
    console.log('Cleared existing test data');

    // Create test users
    const users = [
      {
        email: 'alice@test.com',
        password: await bcrypt.hash('password123', 10),
        profile: {
          firstName: 'Alice',
          lastName: 'Johnson',
          bio: 'Passionate mountain biker who loves exploring new trails. Weekend warrior with 5+ years of experience.',
          verified: true,
          profileImage: 'https://i.pravatar.cc/150?img=1'
        },
        cycling: {
          experienceLevel: 'advanced',
          preferredRideTypes: ['Mountain Biking', 'Gravel Riding', 'Training']
        },
        location: {
          coordinates: [-122.4194, 37.7749], // San Francisco
          address: 'San Francisco, CA',
          radius: 25
        }
      },
      {
        email: 'bob@test.com',
        password: await bcrypt.hash('password123', 10),
        profile: {
          firstName: 'Bob',
          lastName: 'Smith',
          bio: 'Road cycling enthusiast and commuter. Love long distance rides and group cycling events.',
          verified: true,
          profileImage: 'https://i.pravatar.cc/150?img=2'
        },
        cycling: {
          experienceLevel: 'intermediate',
          preferredRideTypes: ['Road Cycling', 'Social Ride', 'Commute']
        },
        location: {
          coordinates: [-122.4594, 37.7849], // San Francisco (slightly different location)
          address: 'San Francisco, CA',
          radius: 20
        }
      },
      {
        email: 'charlie@test.com',
        password: await bcrypt.hash('password123', 10),
        profile: {
          firstName: 'Charlie',
          lastName: 'Davis',
          bio: 'Beginner cyclist looking to join friendly groups and learn from experienced riders.',
          verified: false,
          profileImage: 'https://i.pravatar.cc/150?img=3'
        },
        cycling: {
          experienceLevel: 'beginner',
          preferredRideTypes: ['City Tour', 'Social Ride', 'Training']
        },
        location: {
          coordinates: [-122.4094, 37.7649], // San Francisco (third location)
          address: 'San Francisco, CA',
          radius: 15
        }
      }
    ];

    const createdUsers = await User.insertMany(users);
    console.log('Created test users:', createdUsers.map(u => ({ id: u._id, email: u.email, name: `${u.profile.firstName} ${u.profile.lastName}` })));

    // Create test rides
    const rides = [
      {
        title: 'Golden Gate Bridge Morning Ride',
        description: 'Beautiful morning ride across the iconic Golden Gate Bridge with stunning views of the bay. Perfect for intermediate to advanced riders.',
        organizer: createdUsers[0]._id, // Alice
        rideType: 'Road Cycling',
        difficulty: 'intermediate',
        route: {
          startPoint: {
            address: 'Crissy Field, San Francisco, CA',
            coordinates: [-122.4661, 37.8024]
          },
          endPoint: {
            address: 'Sausalito, CA',
            coordinates: [-122.4852, 37.8590]
          },
          distance: 15.5,
          estimatedDuration: 75
        },
        schedule: {
          startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
          estimatedDuration: 90
        },
        participants: {
          organizer: createdUsers[0]._id,
          maxParticipants: 8,
          currentCount: 2,
          members: [createdUsers[0]._id, createdUsers[1]._id]
        },
        settings: {
          isPublic: true,
          allowJoinRequests: true,
          requireApproval: false
        },
        status: 'upcoming'
      },
      {
        title: 'Twin Peaks Climb Challenge',
        description: 'Challenging climb up Twin Peaks for experienced riders. Great workout and amazing city views at the top!',
        organizer: createdUsers[1]._id, // Bob
        rideType: 'Training',
        difficulty: 'advanced',
        route: {
          startPoint: {
            address: 'Market Street, San Francisco, CA',
            coordinates: [-122.4194, 37.7749]
          },
          endPoint: {
            address: 'Twin Peaks, San Francisco, CA',
            coordinates: [-122.4477, 37.7516]
          },
          distance: 8.2,
          estimatedDuration: 45
        },
        schedule: {
          startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
          estimatedDuration: 60
        },
        participants: {
          organizer: createdUsers[1]._id,
          maxParticipants: 6,
          currentCount: 1,
          members: [createdUsers[1]._id]
        },
        settings: {
          isPublic: true,
          allowJoinRequests: true,
          requireApproval: false
        },
        status: 'upcoming'
      },
      {
        title: 'Beginner-Friendly Bay Trail Tour',
        description: 'Easy-paced ride along the bay trail, perfect for beginners and those looking for a relaxed cycling experience.',
        organizer: createdUsers[0]._id, // Alice organizing for beginners
        rideType: 'City Tour',
        difficulty: 'beginner',
        route: {
          startPoint: {
            address: 'Embarcadero, San Francisco, CA',
            coordinates: [-122.3959, 37.7955]
          },
          endPoint: {
            address: 'Aquatic Park, San Francisco, CA',
            coordinates: [-122.4194, 37.8077]
          },
          distance: 5.8,
          estimatedDuration: 30
        },
        schedule: {
          startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
          estimatedDuration: 45
        },
        participants: {
          organizer: createdUsers[0]._id,
          maxParticipants: 10,
          currentCount: 2,
          members: [createdUsers[0]._id, createdUsers[2]._id]
        },
        settings: {
          isPublic: true,
          allowJoinRequests: true,
          requireApproval: false
        },
        status: 'upcoming'
      },
      {
        title: 'Weekend Warriors Group Ride',
        description: 'Social group ride for weekend cyclists. Mixed terrain with stops for coffee and photos. All levels welcome!',
        organizer: createdUsers[2]._id, // Charlie
        rideType: 'Social Ride',
        difficulty: 'intermediate',
        route: {
          startPoint: {
            address: 'Golden Gate Park, San Francisco, CA',
            coordinates: [-122.4545, 37.7694]
          },
          endPoint: {
            address: 'Ocean Beach, San Francisco, CA',
            coordinates: [-122.5096, 37.7590]
          },
          distance: 12.3,
          estimatedDuration: 90
        },
        schedule: {
          startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          estimatedDuration: 120
        },
        participants: {
          organizer: createdUsers[2]._id,
          maxParticipants: 12,
          currentCount: 3,
          members: [createdUsers[2]._id, createdUsers[0]._id, createdUsers[1]._id]
        },
        settings: {
          isPublic: true,
          allowJoinRequests: true,
          requireApproval: false
        },
        status: 'upcoming'
      }
    ];

    const createdRides = await Ride.insertMany(rides);
    console.log('Created test rides:', createdRides.map(r => ({ id: r._id, title: r.title, organizer: r.organizer })));

    console.log('\n🎉 Test data created successfully!');
    console.log('\n📧 Test User Credentials:');
    console.log('1. Email: alice@test.com | Password: password123 | Level: Advanced');
    console.log('2. Email: bob@test.com | Password: password123 | Level: Intermediate');
    console.log('3. Email: charlie@test.com | Password: password123 | Level: Beginner');
    
    console.log('\n🚴‍♂️ Created Rides:');
    createdRides.forEach((ride, index) => {
      const organizer = createdUsers.find(u => (u._id as any).toString() === (ride.organizer as any).toString());
      console.log(`${index + 1}. "${ride.title}" - ${ride.difficulty} level - Organized by ${organizer?.profile.firstName}`);
    });

  } catch (error) {
    console.error('Error creating test data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
};

// Run the script
createTestUsers();
