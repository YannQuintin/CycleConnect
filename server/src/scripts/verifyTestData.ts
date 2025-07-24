import mongoose from 'mongoose';
import User from '../models/User';
import Ride from '../models/Ride';
import dotenv from 'dotenv';

dotenv.config();

const verifyTestData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cycleconnect');
    console.log('✅ Connected to MongoDB');

    // Check test users
    const users = await User.find({ 
      email: { $in: ['alice@test.com', 'bob@test.com', 'charlie@test.com'] } 
    });
    
    console.log(`\n👥 Found ${users.length} test users:`);
    users.forEach(user => {
      console.log(`   - ${user.profile.firstName} ${user.profile.lastName} (${user.email}) - ${user.cycling.experienceLevel}`);
    });

    // Check test rides
    const rides = await Ride.find({}).populate('organizer', 'profile.firstName profile.lastName');
    console.log(`\n🚴‍♂️ Found ${rides.length} rides:`);
    rides.forEach((ride, index) => {
      console.log(`   ${index + 1}. "${ride.title}" - ${ride.difficulty}`);
      console.log(`      Organizer: ${(ride.organizer as any)?.profile?.firstName || 'Unknown'}`);
      console.log(`      Participants: ${ride.participants.currentCount}/${ride.participants.maxParticipants}`);
    });

    console.log('\n🎉 Test data verification complete!');
    
  } catch (error) {
    console.error('❌ Error verifying test data:', error);
  } finally {
    await mongoose.disconnect();
  }
};

verifyTestData();
