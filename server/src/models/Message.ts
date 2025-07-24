import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  rideId: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  type: 'text' | 'location' | 'system';
  metadata?: {
    location?: {
      type: 'Point';
      coordinates: [number, number];
    };
    systemType?: string;
  };
  readBy: {
    user: mongoose.Types.ObjectId;
    readAt: Date;
  }[];
}

const messageSchema = new Schema<IMessage>({
  rideId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Ride', 
    required: true 
  },
  sender: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  type: {
    type: String,
    enum: ['text', 'location', 'system'],
    default: 'text'
  },
  metadata: {
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    },
    systemType: {
      type: String,
      enum: ['join', 'leave', 'update', 'start', 'complete', 'cancel']
    }
  },
  readBy: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    readAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes
messageSchema.index({ rideId: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

export default mongoose.model<IMessage>('Message', messageSchema);
