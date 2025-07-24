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
  Chip,
  FormHelperText,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Slider,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  DirectionsBike as BikeIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface RideFormData {
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
    startTime: Date | null;
  };
  participants: {
    maxParticipants: number;
  };
  settings: {
    isPublic: boolean;
    requireApproval: boolean;
    allowWaitlist: boolean;
  };
  tags: string[];
}

interface FormErrors {
  title?: string;
  description?: string;
  startDateTime?: string;
  startLocation?: string;
  endLocation?: string;
  rideType?: string;
  difficulty?: string;
  maxParticipants?: string;
}

const steps = ['Basic Details', 'Location & Route', 'Settings & Requirements'];

const CreateRide: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<RideFormData>({
    title: '',
    description: '',
    rideType: '',
    difficulty: '',
    route: {
      startPoint: {
        coordinates: [0, 0],
        address: ''
      },
      endPoint: {
        coordinates: [0, 0],
        address: ''
      },
      distance: 25,
      estimatedDuration: 120
    },
    schedule: {
      startTime: null
    },
    participants: {
      maxParticipants: 8
    },
    settings: {
      isPublic: true,
      requireApproval: false,
      allowWaitlist: true
    },
    tags: []
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [newTag, setNewTag] = useState('');

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

  const difficulties = [
    { value: 'beginner', label: 'Beginner', description: 'Easy pace, short distance' },
    { value: 'intermediate', label: 'Intermediate', description: 'Moderate pace, medium distance' },
    { value: 'advanced', label: 'Advanced', description: 'Fast pace, long distance' },
    { value: 'expert', label: 'Expert', description: 'Racing pace, challenging terrain' }
  ];

  const equipment = [
    'Helmet (Required)',
    'Lights',
    'Water Bottle',
    'Repair Kit',
    'GPS Device',
    'First Aid Kit',
    'Spare Tubes',
    'Multi-tool'
  ];

  const handleInputChange = (field: keyof RideFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { value: any } }
  ) => {
    const value = event.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (formErrors[field as keyof FormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, startDateTime: date }));
    if (formErrors.startDateTime) {
      setFormErrors(prev => ({ ...prev, startDateTime: undefined }));
    }
  };

  const handleLocationChange = (type: 'startLocation' | 'endLocation', address: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        address
      }
    }));
  };

  const handleSliderChange = (field: 'maxParticipants' | 'estimatedDuration' | 'estimatedDistance') => 
    (_event: Event, value: number | number[]) => {
      setFormData(prev => ({ ...prev, [field]: value as number }));
    };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleEquipmentChange = (equipment: string) => {
    setFormData(prev => ({
      ...prev,
      requirements: {
        ...prev.requirements,
        equipment: prev.requirements.equipment.includes(equipment)
          ? prev.requirements.equipment.filter(eq => eq !== equipment)
          : [...prev.requirements.equipment, equipment]
      }
    }));
  };

  const validateStep = (step: number): boolean => {
    const errors: FormErrors = {};

    if (step === 0) {
      if (!formData.title.trim()) errors.title = 'Title is required';
      if (!formData.description.trim()) errors.description = 'Description is required';
      if (!formData.startDateTime) errors.startDateTime = 'Start date and time is required';
      if (!formData.rideType) errors.rideType = 'Ride type is required';
      if (!formData.difficulty) errors.difficulty = 'Difficulty level is required';
    }

    if (step === 1) {
      if (!formData.startLocation.address.trim()) errors.startLocation = 'Start location is required';
      if (!formData.endLocation.address.trim()) errors.endLocation = 'End location is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) return;

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/rides', {
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

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Ride Title"
                value={formData.title}
                onChange={handleInputChange('title')}
                error={!!formErrors.title}
                helperText={formErrors.title}
                placeholder="e.g., Morning Road Ride to Golden Gate"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={formData.description}
                onChange={handleInputChange('description')}
                error={!!formErrors.description}
                helperText={formErrors.description}
                placeholder="Describe your ride, what to expect, meeting point details..."
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Start Date & Time"
                type="datetime-local"
                value={formData.startDateTime ? formData.startDateTime.toISOString().slice(0, 16) : ''}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : null;
                  handleDateChange(date);
                }}
                error={!!formErrors.startDateTime}
                helperText={formErrors.startDateTime}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!formErrors.rideType}>
                <InputLabel>Ride Type</InputLabel>
                <Select
                  value={formData.rideType}
                  label="Ride Type"
                  onChange={handleInputChange('rideType')}
                >
                  {rideTypes.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
                {formErrors.rideType && <FormHelperText>{formErrors.rideType}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!formErrors.difficulty}>
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={formData.difficulty}
                  label="Difficulty Level"
                  onChange={handleInputChange('difficulty')}
                >
                  {difficulties.map(diff => (
                    <MenuItem key={diff.value} value={diff.value}>
                      <Box>
                        <Typography variant="body1">{diff.label}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {diff.description}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.difficulty && <FormHelperText>{formErrors.difficulty}</FormHelperText>}
              </FormControl>
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Start Location"
                value={formData.startLocation.address}
                onChange={(e) => handleLocationChange('startLocation', e.target.value)}
                error={!!formErrors.startLocation}
                helperText={formErrors.startLocation || 'Enter the meeting point address'}
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
                value={formData.endLocation.address}
                onChange={(e) => handleLocationChange('endLocation', e.target.value)}
                error={!!formErrors.endLocation}
                helperText={formErrors.endLocation || 'Leave empty for loop rides'}
                placeholder="e.g., Ocean Beach, San Francisco, CA"
                InputProps={{
                  startAdornment: <LocationIcon sx={{ color: 'secondary.main', mr: 1 }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Max Participants</Typography>
              <Slider
                value={formData.maxParticipants}
                onChange={handleSliderChange('maxParticipants')}
                min={2}
                max={50}
                marks={[
                  { value: 2, label: '2' },
                  { value: 10, label: '10' },
                  { value: 25, label: '25' },
                  { value: 50, label: '50' }
                ]}
                valueLabelDisplay="on"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Duration (minutes)</Typography>
              <Slider
                value={formData.estimatedDuration}
                onChange={handleSliderChange('estimatedDuration')}
                min={30}
                max={480}
                step={15}
                marks={[
                  { value: 30, label: '30m' },
                  { value: 120, label: '2h' },
                  { value: 240, label: '4h' },
                  { value: 480, label: '8h' }
                ]}
                valueLabelDisplay="on"
                valueLabelFormat={(value) => `${Math.floor(value / 60)}h ${value % 60}m`}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography gutterBottom>Distance (km)</Typography>
              <Slider
                value={formData.estimatedDistance}
                onChange={handleSliderChange('estimatedDistance')}
                min={5}
                max={200}
                step={5}
                marks={[
                  { value: 5, label: '5km' },
                  { value: 25, label: '25km' },
                  { value: 50, label: '50km' },
                  { value: 100, label: '100km' },
                  { value: 200, label: '200km' }
                ]}
                valueLabelDisplay="on"
                valueLabelFormat={(value) => `${value}km`}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom>Privacy Settings</Typography>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={formData.isPrivate}
                        onChange={(e) => setFormData(prev => ({ ...prev, isPrivate: e.target.checked }))}
                      />
                    }
                    label="Private Ride"
                  />
                  <Typography variant="body2" color="text.secondary">
                    Private rides are only visible to invited members
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Tags</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                {formData.tags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    color="primary"
                    variant="outlined"
                  />
                ))}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  size="small"
                  label="Add Tag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="e.g., beginner-friendly, coffee-stop"
                />
                <Button variant="outlined" onClick={handleAddTag}>
                  Add
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Minimum Experience</InputLabel>
                <Select
                  value={formData.requirements.minExperience}
                  label="Minimum Experience"
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    requirements: { ...prev.requirements, minExperience: e.target.value }
                  }))}
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                  <MenuItem value="expert">Expert</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Age Restriction</InputLabel>
                <Select
                  value={formData.requirements.ageRestriction}
                  label="Age Restriction"
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    requirements: { ...prev.requirements, ageRestriction: e.target.value }
                  }))}
                >
                  <MenuItem value="none">No Restriction</MenuItem>
                  <MenuItem value="18+">18+ Only</MenuItem>
                  <MenuItem value="21+">21+ Only</MenuItem>
                  <MenuItem value="under-18">Under 18 Welcome</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Required Equipment</Typography>
              <Grid container spacing={1}>
                {equipment.map(item => (
                  <Grid item xs={12} sm={6} md={4} key={item}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={formData.requirements.equipment.includes(item)}
                          onChange={() => handleEquipmentChange(item)}
                        />
                      }
                      label={item}
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        );

      default:
        return null;
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

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {renderStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            variant="outlined"
          >
            Back
          </Button>
          
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={isLoading}
              size="large"
            >
              {isLoading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1 }} />
                  Creating Ride...
                </>
              ) : (
                'Create Ride'
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateRide;
