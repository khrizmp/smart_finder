import React from 'react';
import { Container, Typography, Box, Button, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled, keyframes } from '@mui/system';

// 🎨 Animations
const slideIn = keyframes`
  from { transform: translateX(-100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const gradientAnimation = keyframes`
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
`;

// ✨ Animated Title
const AnimatedTitle = styled(Typography)`
  background: linear-gradient(90deg, #ff0000, #00ff00, #0000ff);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  color: transparent;
  animation: ${slideIn} 1s ease-out, ${gradientAnimation} 5s ease infinite;
`;

// 🔗 Navigation Button Component
const NavButton = ({ label, path }) => {
  const navigate = useNavigate();
  return (
    <Button
      variant="outlined"
      onClick={() => navigate(path)}
      sx={{ color: '#fff', borderColor: '#fff', textTransform: 'none' }}
    >
      {label}
    </Button>
  );
};

function Home() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)', color: '#fff' }}>
      
      {/* 🌐 Navigation Bar */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'flex-end', gap: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/login')}
            sx={{ 
              color: '#fff',
              borderColor: '#fff',
              borderWidth: '2px',
              padding: '6px 16px',
              fontSize: '1.1rem',
              textTransform: 'none',
              '&:hover': {
                borderWidth: '2px',
                borderColor: '#42b883',
                color: '#42b883',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/about')}
            sx={{ 
              color: '#fff',
              borderColor: '#fff',
              borderWidth: '2px',
              padding: '6px 16px',
              fontSize: '1.1rem',
              textTransform: 'none',
              '&:hover': {
                borderWidth: '2px',
                borderColor: '#42b883',
                color: '#42b883',
                backgroundColor: 'rgba(255, 255, 255, 0.05)'
              }
            }}
          >
            About
          </Button>
        </Toolbar>
      </AppBar>

      {/* 📢 Centered Main Content */}
      <Container
        maxWidth="md"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 64px)',
          mt: -10, // Adjusting for AppBar height
          textAlign: 'center',
        }}
      >
        <AnimatedTitle variant="h2" gutterBottom>
          Welcome to Smart Finder
        </AnimatedTitle>

        <Typography variant="h5" sx={{ maxWidth: 800, mb: 4 }}>
          Our Agent mines the web for clean, labeled data for research and AI models.
        </Typography>

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/login')}
            sx={{
              backgroundColor: '#42b883',
              padding: '15px 45px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#005000' },
            }}
          >
            Get Started
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/about')}
            sx={{
              color: '#fff',
              borderColor: '#fff',
              padding: '15px 45px',
              fontSize: '1.2rem',
              textTransform: 'none',
              borderWidth: '2px',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
            }}
          >
            Learn More
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
