import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Card, 
  CardContent,
  Stack
} from '@mui/material';
import { 
  DirectionsBike, 
  Group, 
  LocationOn, 
  Security,
  ChatBubble,
  EmojiEvents
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Welcome: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <DirectionsBike sx={{ fontSize: 40 }} />,
      title: 'Find Rides',
      description: 'Discover cycling routes and join group rides in your area.'
    },
    {
      icon: <Group sx={{ fontSize: 40 }} />,
      title: 'Connect with Cyclists',
      description: 'Meet like-minded cycling enthusiasts and build lasting friendships.'
    },
    {
      icon: <LocationOn sx={{ fontSize: 40 }} />,
      title: 'Location-based',
      description: 'Find rides and cyclists near you with our smart location features.'
    },
    {
      icon: <ChatBubble sx={{ fontSize: 40 }} />,
      title: 'Real-time Chat',
      description: 'Communicate with your group during rides with built-in messaging.'
    },
    {
      icon: <Security sx={{ fontSize: 40 }} />,
      title: 'Safe & Secure',
      description: 'Verified profiles and safety features for worry-free cycling.'
    },
    {
      icon: <EmojiEvents sx={{ fontSize: 40 }} />,
      title: 'Track Progress',
      description: 'Monitor your cycling achievements and celebrate milestones.'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
            Welcome to CycleConnect
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
            Connect with cyclists, discover amazing routes, and make every ride an adventure
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/register')}
              sx={{ 
                bgcolor: 'white', 
                color: 'primary.main',
                '&:hover': { bgcolor: 'grey.100' },
                px: 4,
                py: 1.5
              }}
            >
              Get Started
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => navigate('/login')}
              sx={{ 
                borderColor: 'white', 
                color: 'white',
                '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                px: 4,
                py: 1.5
              }}
            >
              Sign In
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          textAlign="center" 
          gutterBottom
          sx={{ mb: 6 }}
        >
          Why Choose CycleConnect?
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ color: 'primary.main', mb: 2 }}>
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
      <Box sx={{ bgcolor: 'grey.50', py: 6 }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to Start Your Cycling Journey?
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Join thousands of cyclists already using CycleConnect to discover new routes, 
            meet riding partners, and enhance their cycling experience.
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            onClick={() => navigate('/register')}
            sx={{ px: 4, py: 1.5 }}
          >
            Join CycleConnect Today
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Welcome;
