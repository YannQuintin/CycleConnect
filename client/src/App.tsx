import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { RootState } from './store/store';
import Header from './components/common/Header/Header';
import Navigation from './components/common/Navigation/Navigation';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute';
import Welcome from './pages/Welcome/Welcome';
import Dashboard from './pages/Dashboard/Dashboard';
import RideDetails from './pages/RideDetails/RideDetails';
import CreateRide from './pages/Rides/CreateRideSimple';
import RidesList from './pages/Rides/RidesList';
import Profile from './pages/Profile/Profile';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const isLoading = useSelector((state: RootState) => state.auth.isLoading);

  if (isLoading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height="100vh"
      >
        Loading...
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {isAuthenticated && <Header />}
      
      <Box sx={{ display: 'flex', flex: 1 }}>
        {isAuthenticated && <Navigation />}
        
        <Box 
          component="main" 
          sx={{ 
            flex: 1, 
            p: isAuthenticated ? 3 : 0,
            marginLeft: isAuthenticated ? '240px' : 0,
            marginTop: isAuthenticated ? '64px' : 0 
          }}
        >
          <Routes>
            {/* Public routes - only accessible when NOT authenticated */}
            <Route 
              path="/login" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Login />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Register />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/" 
              element={
                <ProtectedRoute requireAuth={false}>
                  <Welcome />
                </ProtectedRoute>
              } 
            />

            {/* Protected routes - only accessible when authenticated */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/rides/create" 
              element={
                <ProtectedRoute>
                  <CreateRide />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/rides" 
              element={
                <ProtectedRoute>
                  <RidesList />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/rides/:id" 
              element={
                <ProtectedRoute>
                  <RideDetails />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />

            {/* Catch all route */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default App;
