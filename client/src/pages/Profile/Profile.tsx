import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Grid,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tab,
  Tabs,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Email,
  LocationOn,
  DirectionsBike,
  EmojiEvents,
  Settings,
  Edit,
  Group,
  CalendarToday
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { getApiUrl } from '../../config/api';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../store/slices/authSlice';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Profile: React.FC = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [editDialog, setEditDialog] = useState(false);
  const [editData, setEditData] = useState<{
    firstName: string;
    lastName: string;
    bio: string;
    experienceLevel: string;
    preferredRideTypes: string[];
  }>({
    firstName: '',
    lastName: '',
    bio: '',
    experienceLevel: '',
    preferredRideTypes: []
  });

  // Update edit data when user data changes or dialog opens
  const openEditDialog = () => {
    setEditData({
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      bio: user?.profile?.bio || '',
      experienceLevel: user?.cycling?.experienceLevel || '',
      preferredRideTypes: user?.cycling?.preferredRideTypes || []
    });
    setEditDialog(true);
  };

  // Update edit form when user data changes
  useEffect(() => {
    if (user && editDialog) {
      setEditData({
        firstName: user?.profile?.firstName || '',
        lastName: user?.profile?.lastName || '',
        bio: user?.profile?.bio || '',
        experienceLevel: user?.cycling?.experienceLevel || '',
        preferredRideTypes: user?.cycling?.preferredRideTypes || []
      });
    }
  }, [user, editDialog]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleEditSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      console.log('Updating profile with data:', editData);
      
      const response = await fetch(getApiUrl('/api/users/profile'), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profile: {
            firstName: editData.firstName,
            lastName: editData.lastName,
            bio: editData.bio
          },
          cycling: {
            experienceLevel: editData.experienceLevel,
            preferredRideTypes: editData.preferredRideTypes
          }
        })
      });

      console.log('Profile update response status:', response.status);
      
      if (response.ok) {
        const updatedUser = await response.json();
        console.log('Profile updated successfully:', updatedUser);
        
        // Update localStorage with the new user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update Redux store with the new user data
        dispatch(updateUser(updatedUser));
        
        setEditDialog(false);
      } else {
        const errorData = await response.text();
        console.error('Failed to update profile:', response.status, errorData);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Please log in to view your profile.</Typography>
      </Box>
    );
  }

  const mockStats = {
    totalRides: 25,
    totalDistance: 450,
    avgSpeed: 22.5,
    favoriteTerrain: 'Mountain',
    joinDate: '2023-06-15'
  };

  const mockRecentRides = [
    { id: 1, title: 'Morning Mountain Loop', date: '2024-01-20', distance: 35 },
    { id: 2, title: 'City Explorer', date: '2024-01-18', distance: 15 },
    { id: 3, title: 'Coastal Cruise', date: '2024-01-15', distance: 42 }
  ];

  return (
    <Box sx={{ p: 3 }}>
      {/* Profile Header */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar 
                sx={{ width: 120, height: 120 }}
                src={user.profile?.profileImage}
              >
                {user.profile?.firstName?.[0]}{user.profile?.lastName?.[0]}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" component="h1" gutterBottom>
                {user.profile?.firstName} {user.profile?.lastName}
                {user.profile?.verified && (
                  <Chip 
                    label="Verified" 
                    color="primary" 
                    size="small" 
                    sx={{ ml: 1 }}
                  />
                )}
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                {user.profile?.bio || 'No bio provided yet.'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip 
                  label={user.cycling?.experienceLevel || 'Not specified'} 
                  color="primary" 
                  variant="outlined" 
                />
                {(user.cycling?.preferredRideTypes || []).map((type: string) => (
                  <Chip 
                    key={type} 
                    label={type} 
                    variant="outlined" 
                    size="small" 
                  />
                ))}
              </Box>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<Edit />}
                onClick={openEditDialog}
              >
                Edit Profile
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Profile Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <DirectionsBike sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
            <Typography variant="h4">{mockStats.totalRides}</Typography>
            <Typography variant="body2" color="text.secondary">Total Rides</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4">{mockStats.totalDistance} km</Typography>
            <Typography variant="body2" color="text.secondary">Total Distance</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h4">{mockStats.avgSpeed} km/h</Typography>
            <Typography variant="body2" color="text.secondary">Avg Speed</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <EmojiEvents sx={{ fontSize: 40, color: 'gold', mb: 1 }} />
            <Typography variant="h4">3</Typography>
            <Typography variant="body2" color="text.secondary">Achievements</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="About" />
            <Tab label="Recent Rides" />
            <Tab label="Settings" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Contact Information</Typography>
              <List>
                <ListItem>
                  <ListItemIcon><Email /></ListItemIcon>
                  <ListItemText primary={user.email} secondary="Email" />
                </ListItem>
                {user.location?.address && (
                  <ListItem>
                    <ListItemIcon><LocationOn /></ListItemIcon>
                    <ListItemText primary={user.location?.address} secondary="Location" />
                  </ListItem>
                )}
                <ListItem>
                  <ListItemIcon><CalendarToday /></ListItemIcon>
                  <ListItemText 
                    primary={new Date(mockStats.joinDate).toLocaleDateString()} 
                    secondary="Member since" 
                  />
                </ListItem>
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>Cycling Preferences</Typography>
              <List>
                <ListItem>
                  <ListItemIcon><DirectionsBike /></ListItemIcon>
                  <ListItemText 
                    primary={user.cycling?.experienceLevel || 'Not specified'} 
                    secondary="Experience Level" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Group /></ListItemIcon>
                  <ListItemText 
                    primary={(user.cycling?.preferredRideTypes || []).join(', ') || 'None specified'} 
                    secondary="Preferred Ride Types" 
                  />
                </ListItem>
              </List>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>Recent Rides</Typography>
          <List>
            {mockRecentRides.map((ride, index) => (
              <React.Fragment key={ride.id}>
                <ListItem>
                  <ListItemIcon><DirectionsBike /></ListItemIcon>
                  <ListItemText
                    primary={ride.title}
                    secondary={`${new Date(ride.date).toLocaleDateString()} • ${ride.distance} km`}
                  />
                </ListItem>
                {index < mockRecentRides.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>Account Settings</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400 }}>
            <Button variant="outlined" startIcon={<Settings />}>
              Privacy Settings
            </Button>
            <Button variant="outlined" startIcon={<Settings />}>
              Notification Preferences
            </Button>
            <Button variant="outlined" startIcon={<Settings />}>
              Account Security
            </Button>
            <Divider sx={{ my: 1 }} />
            <Button variant="outlined" color="error">
              Delete Account
            </Button>
          </Box>
        </TabPanel>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="First Name"
                value={editData.firstName}
                onChange={(e) => setEditData(prev => ({ ...prev, firstName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={editData.lastName}
                onChange={(e) => setEditData(prev => ({ ...prev, lastName: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Bio"
                value={editData.bio}
                onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Experience Level</InputLabel>
                <Select
                  value={editData.experienceLevel}
                  label="Experience Level"
                  onChange={(e) => setEditData(prev => ({ ...prev, experienceLevel: e.target.value }))}
                >
                  <MenuItem value="beginner">Beginner</MenuItem>
                  <MenuItem value="intermediate">Intermediate</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                  <MenuItem value="expert">Expert</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
