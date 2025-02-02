import React from 'react';
import { Container, Typography, Box, Button, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/login')}>
            Login
          </Button>
          <Button variant="outlined" onClick={() => navigate('/about')}>
            About
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md">
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h2" component="h1" gutterBottom>
            Welcome to AI Chat
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph>
            Experience the future of conversation with our AI-powered chat application.
          </Typography>
          <Box sx={{ mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/login')}
              sx={{ mr: 2 }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/about')}
            >
              Learn More
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;