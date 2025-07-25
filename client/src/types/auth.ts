export interface User {
  _id: string;
  email: string;
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
    coordinates: [number, number];
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
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  profile: {
    firstName: string;
    lastName: string;
  };
  cycling: {
    experienceLevel: string;
    preferredRideTypes: string[];
  };
  location: {
    coordinates: [number, number];
    address: string;
  };
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
