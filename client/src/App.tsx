import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box } from '@mui/material';
import { RootState } from './store/store';
import Header from './components/common/Header/Header';
import Navigation from './components/common/Navigation/Navigation';
import Home from './pages/Home/Home';
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
            {/* Public routes */}
            <Route 
              path="/login" 
              element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/register" 
              element={!isAuthenticated ? <Register /> : <Navigate to="/dashboard" />} 
            />
            <Route 
              path="/" 
              element={!isAuthenticated ? <Home /> : <Navigate to="/dashboard" />} 
            />

            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/rides/create" 
              element={isAuthenticated ? <CreateRide /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/rides" 
              element={isAuthenticated ? <RidesList /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/rides/:id" 
              element={isAuthenticated ? <RideDetails /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/profile" 
              element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
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
