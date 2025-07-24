import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Alert,
  CircularProgress,
  Grid,
  Paper
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  Group,
  DirectionsBike,
  AccessTime
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import RideChat from '../../components/chat/RideChat';

interface Ride {
  _id: string;
  title: string;
  description: string;
  schedule: {
    startTime: string;
    estimatedDuration: number;
  };
  route: {
    startPoint: {
      address: string;
      coordinates: [number, number];
    };
    endPoint: {
      address: string;
      coordinates: [number, number];
    };
    distance: number;
  };
  difficulty: 'easy' | 'moderate' | 'hard';
  participants: {
    organizer: string;
    currentCount: number;
    maxParticipants: number;
    members: string[];
  };
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

const RideDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ride, setRide] = useState<Ride | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/rides/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch ride details');
        }

        const rideData = await response.json();
        setRide(rideData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load ride');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRide();
    }
  }, [id]);

  const handleJoinRide = async () => {
    if (!ride || !user) return;

    setJoining(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/rides/${ride._id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to join ride');
      }

      const updatedRide = await response.json();
      setRide(updatedRide);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join ride');
    } finally {
      setJoining(false);
    }
  };

  const handleLeaveRide = async () => {
    if (!ride || !user) return;

    setJoining(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/rides/${ride._id}/leave`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to leave ride');
      }

      const updatedRide = await response.json();
      setRide(updatedRide);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave ride');
    } finally {
      setJoining(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'moderate': return 'warning';
      case 'hard': return 'error';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !ride) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error || 'Ride not found'}</Alert>
        <Button onClick={() => navigate('/rides')} sx={{ mt: 2 }}>
          Back to Rides
        </Button>
      </Box>
    );
  }

  const isParticipant = user && ride.participants.members.includes(user._id);
  const isOrganizer = user && ride.participants.organizer === user._id;
  const isFull = ride.participants.currentCount >= ride.participants.maxParticipants;

  return (
    <Box sx={{ p: 3 }}>
      <Button onClick={() => navigate('/rides')} sx={{ mb: 2 }}>
        ← Back to Rides
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h4" component="h1">
                  {ride.title}
                </Typography>
                <Chip
                  label={ride.difficulty}
                  color={getDifficultyColor(ride.difficulty) as any}
                  variant="outlined"
                />
              </Box>

              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {ride.description}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarToday sx={{ mr: 1 }} />
                      <Typography variant="h6">Schedule</Typography>
                    </Box>
                    <Typography variant="body2">
                      {formatDate(ride.schedule.startTime)}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <AccessTime sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">
                        Duration: {ride.schedule.estimatedDuration} minutes
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Paper sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <LocationOn sx={{ mr: 1 }} />
                      <Typography variant="h6">Route</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Start:</strong> {ride.route.startPoint.address}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>End:</strong> {ride.route.endPoint.address}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DirectionsBike sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">
                        Distance: {ride.route.distance} km
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Group sx={{ mr: 1 }} />
                  <Typography variant="h6">
                    Participants ({ride.participants.currentCount}/{ride.participants.maxParticipants})
                  </Typography>
                </Box>

                {!isOrganizer && !isParticipant && (
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleJoinRide}
                    disabled={isFull || joining}
                    sx={{ mb: 2 }}
                  >
                    {joining ? <CircularProgress size={24} /> : isFull ? 'Ride Full' : 'Join Ride'}
                  </Button>
                )}

                {isParticipant && !isOrganizer && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    onClick={handleLeaveRide}
                    disabled={joining}
                    sx={{ mb: 2 }}
                  >
                    {joining ? <CircularProgress size={24} /> : 'Leave Ride'}
                  </Button>
                )}

                {isOrganizer && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    You are the organizer of this ride
                  </Alert>
                )}

                <List>
                  {ride.participants.members.map((memberId, index) => (
                    <React.Fragment key={memberId}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar>
                            {memberId === ride.participants.organizer ? 'O' : 'M'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={memberId === ride.participants.organizer ? 'Organizer' : 'Member'}
                          secondary={memberId === user?._id ? 'You' : memberId}
                        />
                      </ListItem>
                      {index < ride.participants.members.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Card>

            {/* Chat Component */}
            <RideChat rideId={ride._id} isParticipant={isParticipant || isOrganizer} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RideDetails;
