import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  profile: any | null;
  preferences: {
    notifications: boolean;
    darkMode: boolean;
  };
  location: {
    coordinates: [number, number] | null;
    address: string | null;
  };
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  preferences: {
    notifications: true,
    darkMode: false,
  },
  location: {
    coordinates: null,
    address: null,
  },
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<any>) => {
      state.profile = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    updatePreferences: (state, action: PayloadAction<Partial<UserState['preferences']>>) => {
      state.preferences = { ...state.preferences, ...action.payload };
    },
    setLocation: (state, action: PayloadAction<{ coordinates: [number, number]; address: string }>) => {
      state.location = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setProfile,
  updatePreferences,
  setLocation,
  setLoading,
  setError,
  clearError,
} = userSlice.actions;

export default userSlice.reducer;
