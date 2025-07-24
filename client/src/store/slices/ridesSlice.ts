import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Ride {
  _id: string;
  title: string;
  organizer: {
    _id: string;
    profile: {
      firstName: string;
      lastName: string;
    };
  };
  rideType: string;
  difficulty: string;
  schedule: {
    startTime: string;
  };
  participants: {
    currentCount: number;
    maxParticipants: number;
  };
}

interface RidesState {
  rides: Ride[];
  currentRide: Ride | null;
  nearbyRides: Ride[];
  userRides: Ride[];
  isLoading: boolean;
  error: string | null;
  filters: {
    rideType?: string;
    difficulty?: string;
    radius?: number;
  };
}

const initialState: RidesState = {
  rides: [],
  currentRide: null,
  nearbyRides: [],
  userRides: [],
  isLoading: false,
  error: null,
  filters: {
    radius: 25,
  },
};

const ridesSlice = createSlice({
  name: 'rides',
  initialState,
  reducers: {
    setRides: (state, action: PayloadAction<Ride[]>) => {
      state.rides = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setCurrentRide: (state, action: PayloadAction<Ride>) => {
      state.currentRide = action.payload;
    },
    setNearbyRides: (state, action: PayloadAction<Ride[]>) => {
      state.nearbyRides = action.payload;
    },
    setUserRides: (state, action: PayloadAction<Ride[]>) => {
      state.userRides = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    updateFilters: (state, action: PayloadAction<Partial<RidesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setRides,
  setCurrentRide,
  setNearbyRides,
  setUserRides,
  setLoading,
  setError,
  updateFilters,
  clearError,
} = ridesSlice.actions;

export default ridesSlice.reducer;
