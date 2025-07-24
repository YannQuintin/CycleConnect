import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  DirectionsBike as BikeIcon,
  TrendingUp as TrendingIcon
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Mock data for demonstration
  const upcomingRides = [
    {
      id: 1,
      title: 'Morning Road Ride',
      date: new Date(2025, 6, 25, 8, 0),
      location: 'Golden Gate Park',
      participants: 5,
      maxParticipants: 8,
      difficulty: 'Intermediate',
      distance: '25 km'
    },
    {
      id: 2,
      title: 'Weekend Mountain Trail',
      date: new Date(2025, 6, 26, 9, 30),
      location: 'Marin Headlands',
      participants: 3,
      maxParticipants: 6,
      difficulty: 'Advanced',
      distance: '40 km'
    }
  ];

  const nearbyRides = [
    {
      id: 3,
      title: 'Evening City Tour',
      organizer: 'Sarah Chen',
      date: new Date(2025, 6, 24, 18, 0),
      participants: 2,
      maxParticipants: 10,
      difficulty: 'Beginner',
      distance: '15 km'
    },
    {
      id: 4,
      title: 'Sunrise Beach Ride',
      organizer: 'Mike Rodriguez',
      date: new Date(2025, 6, 25, 6, 30),
      participants: 7,
      maxParticipants: 12,
      difficulty: 'Intermediate',
      distance: '30 km'
    }
  ];

  const stats = {
    totalRides: 24,
    totalDistance: '850 km',
    averageSpeed: '22.5 km/h',
    friendsConnected: 18
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'primary';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome back, {user?.profile.firstName}! 🚴‍♂️
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ready for your next cycling adventure?
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <BikeIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6">{stats.totalRides}</Typography>
              <Typography variant="body2" color="text.secondary">
                Total Rides
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <TrendingIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
              <Typography variant="h6">{stats.totalDistance}</Typography>
              <Typography variant="body2" color="text.secondary">
                Distance Covered
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <ScheduleIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
              <Typography variant="h6">{stats.averageSpeed}</Typography>
              <Typography variant="body2" color="text.secondary">
                Average Speed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <PeopleIcon sx={{ fontSize: 40, color: 'info.main', mb: 1 }} />
              <Typography variant="h6">{stats.friendsConnected}</Typography>
              <Typography variant="body2" color="text.secondary">
                Friends Connected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Your Upcoming Rides */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Upcoming Rides
              </Typography>
              {upcomingRides.map((ride) => (
                <Card key={ride.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{ride.title}</Typography>
                      <Chip 
                        label={ride.difficulty} 
                        color={getDifficultyColor(ride.difficulty)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {ride.date.toLocaleDateString()} at {ride.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {ride.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Typography variant="body2">
                        {ride.participants}/{ride.maxParticipants} riders • {ride.distance}
                      </Typography>
                      <Button size="small" variant="outlined">
                        View Details
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Nearby Rides */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Nearby Rides
              </Typography>
              {nearbyRides.map((ride) => (
                <Card key={ride.id} variant="outlined" sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6">{ride.title}</Typography>
                      <Chip 
                        label={ride.difficulty} 
                        color={getDifficultyColor(ride.difficulty)}
                        size="small"
                      />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                        {ride.organizer.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      <Typography variant="body2" color="text.secondary">
                        Organized by {ride.organizer}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary">
                        {ride.date.toLocaleDateString()} at {ride.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                      <Typography variant="body2">
                        {ride.participants}/{ride.maxParticipants} riders • {ride.distance}
                      </Typography>
                      <Button size="small" variant="contained">
                        Join Ride
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="create ride"
        onClick={() => navigate('/rides/create')}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default Dashboard;
