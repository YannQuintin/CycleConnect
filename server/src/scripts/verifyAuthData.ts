import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const verifyDatabaseData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cycleconnect');
    console.log('✅ Connected to MongoDB for verification\n');

    // Check total user count
    const totalUsers = await User.countDocuments();
    console.log(`📊 Total users in database: ${totalUsers}`);

    // Get all users and display their info
    const users = await User.find({}).select('-password'); // Exclude password field
    
    console.log('\n👥 Users in database:');
    console.log('=====================');
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User ID: ${user._id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.profile.firstName} ${user.profile.lastName}`);
      console.log(`   Experience: ${user.cycling.experienceLevel}`);
      console.log(`   Verified: ${user.profile.verified}`);
      console.log(`   Created: ${(user as any).createdAt ? new Date((user as any).createdAt).toLocaleDateString() : 'N/A'}`);
      
      if (user.profile.bio) {
        console.log(`   Bio: ${user.profile.bio.substring(0, 50)}${user.profile.bio.length > 50 ? '...' : ''}`);
      }
      
      if (user.cycling.preferredRideTypes && user.cycling.preferredRideTypes.length > 0) {
        console.log(`   Preferred rides: ${user.cycling.preferredRideTypes.join(', ')}`);
      }
      
      if (user.location && user.location.address) {
        console.log(`   Location: ${user.location.address}`);
      }
    });

    // Check for test users specifically
    console.log('\n🧪 Test Users Status:');
    console.log('====================');
    
    const testEmails = ['alice@test.com', 'bob@test.com', 'charlie@test.com'];
    
    for (const email of testEmails) {
      const user = await User.findOne({ email }).select('-password');
      if (user) {
        console.log(`✅ ${email} - Found (${user.profile.firstName} ${user.profile.lastName})`);
      } else {
        console.log(`❌ ${email} - Not found`);
      }
    }

    // Check for any users created in the last hour (recent registrations)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentUsers = await User.find({ 
      createdAt: { $gte: oneHourAgo } 
    }).select('-password');
    
    console.log(`\n🕐 Users created in the last hour: ${recentUsers.length}`);
    
    if (recentUsers.length > 0) {
      console.log('Recent registrations:');
      recentUsers.forEach((user, index) => {
        console.log(`   ${index + 1}. ${user.email} - ${user.profile.firstName} ${user.profile.lastName} (${new Date((user as any).createdAt).toLocaleTimeString()})`);
      });
    }

    // Database health check
    console.log('\n🏥 Database Health Check:');
    console.log('========================');
    console.log(`Database connection state: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
    console.log(`Database name: ${mongoose.connection.name}`);
    console.log(`Database host: ${mongoose.connection.host}`);
    
    // Check indexes
    const userIndexes = await User.collection.getIndexes();
    console.log(`User collection indexes: ${Object.keys(userIndexes).length}`);

    console.log('\n🎉 Database verification complete!');
    
  } catch (error) {
    console.error('❌ Database verification failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📤 Disconnected from MongoDB');
  }
};

// Add a function to watch for real-time changes
const watchForChanges = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cycleconnect');
    console.log('👀 Watching for real-time database changes...');
    console.log('   Register a new user in the frontend to see this in action!');
    console.log('   Press Ctrl+C to stop watching\n');

    const changeStream = User.watch();
    
    changeStream.on('change', (change) => {
      const timestamp = new Date().toLocaleTimeString();
      
      switch (change.operationType) {
        case 'insert':
          console.log(`🆕 [${timestamp}] New user registered!`);
          if (change.fullDocument) {
            console.log(`   Email: ${change.fullDocument.email}`);
            console.log(`   Name: ${change.fullDocument.profile.firstName} ${change.fullDocument.profile.lastName}`);
          }
          break;
          
        case 'update':
          console.log(`📝 [${timestamp}] User updated: ${change.documentKey._id}`);
          break;
          
        case 'delete':
          console.log(`🗑️ [${timestamp}] User deleted: ${change.documentKey._id}`);
          break;
      }
    });

    // Keep the process running
    process.on('SIGINT', async () => {
      console.log('\n👋 Stopping database monitoring...');
      await changeStream.close();
      await mongoose.disconnect();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error setting up database monitoring:', error);
  }
};

// Main execution
const args = process.argv.slice(2);

if (args.includes('--watch')) {
  watchForChanges();
} else {
  verifyDatabaseData();
}
