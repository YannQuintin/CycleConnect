import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    profileImage?: string;
    bio?: string;
    dateOfBirth: Date;
    phoneNumber?: string;
    verified: boolean;
  };
  cycling: {
    experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    preferredRideTypes: string[];
    avgSpeed?: number;
    maxDistance?: number;
    fitnessApps?: {
      platform: string;
      profileId: string;
    }[];
  };
  location?: {
    type: 'Point';
    coordinates: number[];
    address?: string;
    radius: number;
  };
  preferences: {
    notifications: {
      newRides: boolean;
      messages: boolean;
      rideReminders: boolean;
    };
    privacy: {
      showLocation: boolean;
      showProfile: boolean;
    };
  };
  subscription: {
    plan: 'free' | 'premium';
    startDate?: Date;
    endDate?: Date;
  };
  ratings: {
    average: number;
    count: number;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  profile: {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    profileImage: String,
    bio: { type: String, maxlength: 500 },
    dateOfBirth: Date,
    phoneNumber: String,
    verified: { type: Boolean, default: false }
  },
  cycling: {
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'intermediate'
    },
    preferredRideTypes: [{
      type: String,
      enum: ['road', 'mountain', 'gravel', 'commute', 'leisure']
    }],
    avgSpeed: { type: Number, min: 0, max: 100 },
    maxDistance: { type: Number, min: 0, max: 500 },
    fitnessApps: [{
      platform: { type: String, enum: ['strava', 'garmin', 'fitbit'] },
      profileId: String
    }]
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: function() { return this.location && this.location.coordinates && this.location.coordinates.length > 0; }
    },
    coordinates: {
      type: [Number],
      validate: {
        validator: function(v: number[] | undefined) {
          // Allow undefined or valid coordinate pair
          if (!v || v.length === 0) return true;
          return Array.isArray(v) && v.length === 2;
        },
        message: 'Coordinates must be [longitude, latitude]'
      }
    },
    address: String,
    radius: { type: Number, min: 1, max: 100, default: 50 }
  },
  preferences: {
    notifications: {
      newRides: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      rideReminders: { type: Boolean, default: true }
    },
    privacy: {
      showLocation: { type: Boolean, default: true },
      showProfile: { type: Boolean, default: true }
    }
  },
  subscription: {
    plan: { type: String, enum: ['free', 'premium'], default: 'free' },
    startDate: Date,
    endDate: Date
  },
  ratings: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 }
  }
}, {
  timestamps: true
});

// Indexes for performance
// userSchema.index({ location: '2dsphere' }, { sparse: true }); // Temporarily disabled for registration testing
userSchema.index({ email: 1 });
userSchema.index({ 'profile.firstName': 1, 'profile.lastName': 1 });
userSchema.index({ 'cycling.experienceLevel': 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Clean up location field if it has empty coordinates
userSchema.pre('save', function(next) {
  if (this.location && this.location.coordinates && Array.isArray(this.location.coordinates) && this.location.coordinates.length === 0) {
    // Remove the entire location field if coordinates are empty
    this.location = undefined;
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model<IUser>('User', userSchema);
