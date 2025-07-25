import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Container,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  DirectionsBike as BikeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getApiUrl } from '../../config/api';

interface CreateRideData {
  title: string;
  description: string;
  rideType: string;
  difficulty: string;
  route: {
    startPoint: {
      coordinates: [number, number];
      address: string;
    };
    endPoint?: {
      coordinates: [number, number];
      address: string;
    };
    distance?: number;
    estimatedDuration?: number;
  };
  schedule: {
    startTime: string;
  };
  participants: {
    maxParticipants: number;
  };
  settings: {
    isPublic: boolean;
    requireApproval: boolean;
    allowWaitlist: boolean;
  };
}

const CreateRideSimple: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateRideData>({
    title: '',
    description: '',
    rideType: '',
    difficulty: '',
    route: {
      startPoint: {
        coordinates: [-122.4194, 37.7749], // Default to SF
        address: ''
      },
      endPoint: {
        coordinates: [-122.4194, 37.7749],
        address: ''
      },
      distance: 25,
      estimatedDuration: 120
    },
    schedule: {
      startTime: ''
    },
    participants: {
      maxParticipants: 8
    },
    settings: {
      isPublic: true,
      requireApproval: false,
      allowWaitlist: true
    }
  });

  const rideTypes = ['road', 'mountain', 'gravel', 'commute', 'leisure'];
  const difficulties = ['beginner', 'intermediate', 'advanced', 'expert'];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(getApiUrl('/api/rides'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create ride');
      }

      const ride = await response.json();
      navigate(`/rides/${ride._id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create ride');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <BikeIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h4" component="h1">
            Create New Ride
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ride Title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Morning Road Ride to Golden Gate"
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your ride..."
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Ride Type</InputLabel>
                <Select
                  value={formData.rideType}
                  label="Ride Type"
                  onChange={(e) => setFormData(prev => ({ ...prev, rideType: e.target.value }))}
                >
                  {rideTypes.map(type => (
                    <MenuItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={formData.difficulty}
                  label="Difficulty Level"
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                >
                  {difficulties.map(diff => (
                    <MenuItem key={diff} value={diff}>
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date & Time"
                type="datetime-local"
                value={formData.schedule.startTime}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  schedule: { ...prev.schedule, startTime: e.target.value }
                }))}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Max Participants"
                value={formData.participants.maxParticipants}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  participants: { ...prev.participants, maxParticipants: parseInt(e.target.value) }
                }))}
                inputProps={{ min: 2, max: 50 }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Start Location"
                value={formData.route.startPoint.address}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  route: {
                    ...prev.route,
                    startPoint: { ...prev.route.startPoint, address: e.target.value }
                  }
                }))}
                placeholder="e.g., Golden Gate Park, San Francisco, CA"
                InputProps={{
                  startAdornment: <LocationIcon sx={{ color: 'primary.main', mr: 1 }} />
                }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="End Location (Optional)"
                value={formData.route.endPoint?.address || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  route: {
                    ...prev.route,
                    endPoint: { 
                      coordinates: [-122.4194, 37.7749], 
                      address: e.target.value 
                    }
                  }
                }))}
                placeholder="Leave empty for loop rides"
                InputProps={{
                  startAdornment: <LocationIcon sx={{ color: 'secondary.main', mr: 1 }} />
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Estimated Distance (km)"
                value={formData.route.distance}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  route: { ...prev.route, distance: parseInt(e.target.value) }
                }))}
                inputProps={{ min: 1, max: 500 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Estimated Duration (minutes)"
                value={formData.route.estimatedDuration}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  route: { ...prev.route, estimatedDuration: parseInt(e.target.value) }
                }))}
                inputProps={{ min: 30, max: 720 }}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Ride Settings
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.settings.isPublic}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, isPublic: e.target.checked }
                    }))}
                  />
                }
                label="Public Ride"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.settings.requireApproval}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, requireApproval: e.target.checked }
                    }))}
                  />
                }
                label="Require Approval"
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.settings.allowWaitlist}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, allowWaitlist: e.target.checked }
                    }))}
                  />
                }
                label="Allow Waitlist"
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isLoading}
                  size="large"
                >
                  {isLoading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1 }} />
                      Creating...
                    </>
                  ) : (
                    'Create Ride'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateRideSimple;
