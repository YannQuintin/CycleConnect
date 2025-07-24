export interface Ride {
  _id: string;
  organizer: {
    _id: string;
    profile: {
      firstName: string;
      lastName: string;
      profileImage?: string;
    };
    cycling: {
      experienceLevel: string;
    };
  };
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
    confirmed: string[];
    pending: string[];
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
    messages: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRideData {
  title: string;
  description?: string;
  rideType: string;
  difficulty: string;
  route: {
    startPoint: {
      coordinates: [number, number];
      address: string;
    };
    endPoint?: {
      coordinates: [number, number];
      address: string;
    };
    distance?: number;
    elevation?: number;
  };
  schedule: {
    startTime: Date;
    endTime?: Date;
  };
  participants: {
    maxParticipants: number;
  };
  settings: {
    isPublic: boolean;
    requireApproval: boolean;
    allowWaitlist: boolean;
  };
}

export interface RideFilters {
  rideType?: string;
  difficulty?: string;
  status?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  limit?: number;
  page?: number;
}
