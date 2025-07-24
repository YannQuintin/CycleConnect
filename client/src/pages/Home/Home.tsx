import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent,
  AppBar,
  Toolbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import GroupIcon from '@mui/icons-material/Group';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SecurityIcon from '@mui/icons-material/Security';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <LocationOnIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Location-Based Discovery',
      description: 'Find rides within your local area using smart geolocation features.'
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Connect with Cyclists',
      description: 'Join a community of passionate cyclists and make new riding partners.'
    },
    {
      icon: <DirectionsBikeIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'All Ride Types',
      description: 'Road, mountain, gravel, commute - find rides that match your style.'
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Safety First',
      description: 'Built-in safety features including emergency alerts and ride tracking.'
    }
  ];

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar>
          <DirectionsBikeIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            CycleConnect
          </Typography>
          <Button 
            color="primary" 
            onClick={() => navigate('/login')}
            sx={{ mr: 1 }}
          >
            Login
          </Button>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => navigate('/register')}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2e7d32 0%, #1976d2 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Connect with Fellow Cyclists
          </Typography>
          <Typography variant="h5" paragraph sx={{ mb: 4, opacity: 0.9 }}>
            Discover, organize, and join cycling rides in your local area. 
            Build connections with cyclists who share your passion.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{
              px: 4,
              py: 1.5,
              fontSize: '1.2rem',
              backgroundColor: 'white',
              color: 'primary.main',
              '&:hover': {
                backgroundColor: 'grey.100'
              }
            }}
          >
            Get Started Free
          </Button>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom>
          Why Choose CycleConnect?
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Everything you need to find and join amazing cycling adventures
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  textAlign: 'center', 
                  p: 2,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ backgroundColor: 'grey.50', py: 8 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Start Cycling Together?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph>
            Join thousands of cyclists already using CycleConnect to find their next adventure.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}
          >
            Create Your Account
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ backgroundColor: 'grey.900', color: 'white', py: 4 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" textAlign="center">
            © 2025 CycleConnect. Built for cyclists, by cyclists.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
