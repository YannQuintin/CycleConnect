import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import ridesSlice from './slices/ridesSlice';
import userSlice from './slices/userSlice';
import uiSlice from './slices/uiSlice';
import { authApi } from './api/authApi';
import { ridesApi } from './api/ridesApi';
import { usersApi } from './api/usersApi';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    rides: ridesSlice,
    user: userSlice,
    ui: uiSlice,
    [authApi.reducerPath]: authApi.reducer,
    [ridesApi.reducerPath]: ridesApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(
      authApi.middleware,
      ridesApi.middleware,
      usersApi.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
