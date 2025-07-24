import mongoose, { Schema, Document } from 'mongoose';

export interface IRide extends Document {
  organizer: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  rideType: 'road' | 'mountain' | 'gravel' | 'commute' | 'leisure';
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  route: {
    startPoint: {
      type: 'Point';
      coordinates: [number, number];
      address: string;
    };
    endPoint?: {
      type: 'Point';
      coordinates: [number, number];
      address: string;
    };
    waypoints?: {
      type: 'Point';
      coordinates: [number, number];
      description?: string;
    }[];
    distance?: number;
    elevation?: number;
    estimatedDuration?: number;
  };
  schedule: {
    startTime: Date;
    endTime?: Date;
    timezone?: string;
  };
  participants: {
    confirmed: mongoose.Types.ObjectId[];
    pending: mongoose.Types.ObjectId[];
    maxParticipants: number;
    currentCount: number;
  };
  settings: {
    isPublic: boolean;
    requireApproval: boolean;
    allowWaitlist: boolean;
  };
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  chat: {
    enabled: boolean;
    messages: mongoose.Types.ObjectId[];
  };
}

const rideSchema = new Schema<IRide>({
  organizer: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  description: { 
    type: String,
    maxlength: 1000
  },
  rideType: {
    type: String,
    enum: ['road', 'mountain', 'gravel', 'commute', 'leisure'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: true
  },
  route: {
    startPoint: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: { 
        type: [Number], 
        required: true,
        validate: {
          validator: function(v: number[]) {
            return v.length === 2;
          },
          message: 'Coordinates must be [longitude, latitude]'
        }
      },
      address: { type: String, required: true }
    },
    endPoint: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number],
      address: String
    },
    waypoints: [{
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number],
      description: String
    }],
    distance: { type: Number, min: 0 },
    elevation: { type: Number, min: 0 },
    estimatedDuration: { type: Number, min: 0 }
  },
  schedule: {
    startTime: { type: Date, required: true },
    endTime: Date,
    timezone: { type: String, default: 'UTC' }
  },
  participants: {
    confirmed: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    pending: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    maxParticipants: { 
      type: Number, 
      default: 10,
      min: 2,
      max: 50
    },
    currentCount: { type: Number, default: 1 }
  },
  settings: {
    isPublic: { type: Boolean, default: true },
    requireApproval: { type: Boolean, default: false },
    allowWaitlist: { type: Boolean, default: true }
  },
  status: {
    type: String,
    enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  chat: {
    enabled: { type: Boolean, default: true },
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
  }
}, {
  timestamps: true
});

// Indexes for performance
rideSchema.index({ 'route.startPoint': '2dsphere' });
rideSchema.index({ 'schedule.startTime': 1 });
rideSchema.index({ organizer: 1 });
rideSchema.index({ status: 1 });
rideSchema.index({ rideType: 1 });
rideSchema.index({ difficulty: 1 });

// Compound indexes for common queries
rideSchema.index({ status: 1, 'schedule.startTime': 1 });
rideSchema.index({ rideType: 1, difficulty: 1 });

// Update current count when participants change
rideSchema.pre('save', function(next) {
  this.participants.currentCount = this.participants.confirmed.length + 1; // +1 for organizer
  next();
});

export default mongoose.model<IRide>('Ride', rideSchema);
