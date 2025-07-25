import React, { useState, useEffect } from 'react';
import { getApiUrl } from '../../config/api';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Paper,
  CircularProgress,
  Alert,
  IconButton
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Schedule as ScheduleIcon,
  People as PeopleIcon,
  DirectionsBike as BikeIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface Ride {
  _id: string;
  title: string;
  description: string;
  organizer: {
    _id: string;
    profile: {
      firstName: string;
      lastName: string;
      profileImage?: string;
    };
  };
  rideType: string;
  difficulty: string;
  route: {
    startPoint: {
      address: string;
      coordinates: [number, number];
    };
    distance?: number;
    estimatedDuration?: number;
  };
  schedule: {
    startTime: string;
  };
  participants: {
    maxParticipants: number;
    currentCount: number;
  };
  settings: {
    isPublic: boolean;
  };
  status: string;
}

const RidesList: React.FC = () => {
  const navigate = useNavigate();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  // Filter states
  const [filters, setFilters] = useState({
    rideType: '',
    difficulty: '',
    maxDistance: [5, 100] as number[],
    dateRange: 'all',
    availableSpots: false,
    searchRadius: 25, // km radius for location search
    nearbyOnly: false
  });

  const rideTypes = [
    'Road Cycling',
    'Mountain Biking',
    'Gravel Riding',
    'City Tour',
    'Commute',
    'Training',
    'Social Ride',
    'Race/Competition'
  ];

  const difficulties = ['beginner', 'intermediate', 'advanced', 'expert'];

  useEffect(() => {
    fetchRides();
  }, []);

  useEffect(() => {
    fetchRides();
  }, [filters.nearbyOnly, filters.searchRadius]);

  const fetchRides = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url = getApiUrl('/api/rides');
      
      // If nearby search is enabled, try to get user's location and fetch nearby rides
      if (filters.nearbyOnly) {
        if (navigator.geolocation) {
          try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            
            const { latitude, longitude } = position.coords;
            url = `${getApiUrl('/api/rides')}/nearby?lat=${latitude}&lng=${longitude}&radius=${filters.searchRadius}`;
          } catch (geoError) {
            console.warn('Geolocation failed, falling back to all rides');
          }
        }
      }
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch rides');
      }

      const ridesData = await response.json();
      setRides(ridesData);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch rides');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      case 'expert': return 'secondary';
      default: return 'primary';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const handleJoinRide = async (rideId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${getApiUrl('/api/rides')}/${rideId}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to join ride');
      }

      // Refresh rides list
      fetchRides();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to join ride');
    }
  };

  const toggleFavorite = (rideId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(rideId)) {
        newFavorites.delete(rideId);
      } else {
        newFavorites.add(rideId);
      }
      return newFavorites;
    });
  };

  const filteredRides = rides.filter(ride => {
    // Search term filter
    if (searchTerm && !ride.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !ride.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !ride.route.startPoint.address.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // Ride type filter
    if (filters.rideType && ride.rideType !== filters.rideType) {
      return false;
    }

    // Difficulty filter
    if (filters.difficulty && ride.difficulty !== filters.difficulty) {
      return false;
    }

    // Distance filter
    if (ride.route.distance && (ride.route.distance < filters.maxDistance[0] || 
        ride.route.distance > filters.maxDistance[1])) {
      return false;
    }

    // Available spots filter
    if (filters.availableSpots && ride.participants.currentCount >= ride.participants.maxParticipants) {
      return false;
    }

    return true;
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Discover Rides
        </Typography>
        <Button
          variant="contained"
          startIcon={<BikeIcon />}
          onClick={() => navigate('/rides/create')}
        >
          Create Ride
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Search and Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search rides by title, description, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
            }}
          />
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>
        </Box>

        {showFilters && (
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Ride Type</InputLabel>
                <Select
                  value={filters.rideType}
                  label="Ride Type"
                  onChange={(e) => setFilters(prev => ({ ...prev, rideType: e.target.value }))}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {rideTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={filters.difficulty}
                  label="Difficulty"
                  onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
                >
                  <MenuItem value="">All Levels</MenuItem>
                  {difficulties.map(diff => (
                    <MenuItem key={diff} value={diff}>
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Distance Range (km)</Typography>
              <Slider
                value={filters.maxDistance}
                onChange={(_event, value) => setFilters(prev => ({ ...prev, maxDistance: value as number[] }))}
                valueLabelDisplay="on"
                min={5}
                max={200}
                marks={[
                  { value: 5, label: '5km' },
                  { value: 50, label: '50km' },
                  { value: 100, label: '100km' },
                  { value: 200, label: '200km' }
                ]}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant={filters.availableSpots ? 'contained' : 'outlined'}
                onClick={() => setFilters(prev => ({ ...prev, availableSpots: !prev.availableSpots }))}
              >
                Available Spots
              </Button>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button
                fullWidth
                variant={filters.nearbyOnly ? 'contained' : 'outlined'}
                onClick={() => setFilters(prev => ({ ...prev, nearbyOnly: !prev.nearbyOnly }))}
                startIcon={<LocationIcon />}
              >
                Nearby Rides
              </Button>
            </Grid>
            {filters.nearbyOnly && (
              <Grid item xs={12} md={3}>
                <Typography gutterBottom>Search Radius (km)</Typography>
                <Slider
                  value={filters.searchRadius}
                  onChange={(_event, value) => setFilters(prev => ({ ...prev, searchRadius: value as number }))}
                  valueLabelDisplay="auto"
                  min={5}
                  max={100}
                  marks={[
                    { value: 5, label: '5km' },
                    { value: 25, label: '25km' },
                    { value: 50, label: '50km' },
                    { value: 100, label: '100km' }
                  ]}
                />
              </Grid>
            )}
          </Grid>
        )}
      </Paper>

      {/* Rides Grid */}
      <Grid container spacing={3}>
        {filteredRides.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <BikeIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No rides found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Try adjusting your search criteria or create a new ride
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/rides/create')}
              >
                Create Your First Ride
              </Button>
            </Paper>
          </Grid>
        ) : (
          filteredRides.map((ride) => (
            <Grid item xs={12} md={6} lg={4} key={ride._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="h3" sx={{ flex: 1 }}>
                      {ride.title}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => toggleFavorite(ride._id)}
                      color={favorites.has(ride._id) ? 'error' : 'default'}
                    >
                      {favorites.has(ride._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Avatar
                      sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}
                      src={ride.organizer.profile.profileImage}
                    >
                      {ride.organizer.profile.firstName[0]}{ride.organizer.profile.lastName[0]}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary">
                      {ride.organizer.profile.firstName} {ride.organizer.profile.lastName}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <ScheduleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(ride.schedule.startTime)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {ride.route.startPoint.address}
                    </Typography>
                  </Box>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip label={ride.rideType} size="small" />
                      <Chip 
                        label={ride.difficulty} 
                        size="small" 
                        color={getDifficultyColor(ride.difficulty)}
                      />
                      {ride.route.distance && (
                        <Chip 
                          label={`${ride.route.distance}km`} 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                      {ride.route.estimatedDuration && (
                        <Chip 
                          label={formatDuration(ride.route.estimatedDuration)} 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                    </Box>                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {ride.description.length > 100 
                      ? `${ride.description.substring(0, 100)}...` 
                      : ride.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PeopleIcon sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {ride.participants.currentCount}/{ride.participants.maxParticipants} riders
                    </Typography>
                  </Box>

                  {/* Tags removed for now since they're not in the backend model */}
                </CardContent>

                <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/rides/${ride._id}`)}
                    sx={{ flex: 1 }}
                  >
                    View Details
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => handleJoinRide(ride._id)}
                    disabled={ride.participants.currentCount >= ride.participants.maxParticipants}
                    sx={{ flex: 1 }}
                  >
                    {ride.participants.currentCount >= ride.participants.maxParticipants ? 'Full' : 'Join'}
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default RidesList;
