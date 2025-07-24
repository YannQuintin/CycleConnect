import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  currentPage: string;
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
  isMapFullscreen: boolean;
  loading: {
    global: boolean;
    rides: boolean;
    auth: boolean;
  };
}

const initialState: UIState = {
  sidebarOpen: true,
  currentPage: 'dashboard',
  notifications: [],
  isMapFullscreen: false,
  loading: {
    global: false,
    rides: false,
    auth: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPage = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<UIState['notifications'][0], 'id' | 'timestamp'>>) => {
      const notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: Date.now(),
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setMapFullscreen: (state, action: PayloadAction<boolean>) => {
      state.isMapFullscreen = action.payload;
    },
    setLoading: (state, action: PayloadAction<{ key: keyof UIState['loading']; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
  },
});

export const {
  setSidebarOpen,
  setCurrentPage,
  addNotification,
  removeNotification,
  clearNotifications,
  setMapFullscreen,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
