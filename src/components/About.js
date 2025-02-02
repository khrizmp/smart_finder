import React from 'react';
import { Container, Typography, Box, Button, AppBar, Toolbar, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function About() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/home')}>
            Home
          </Button>
          <Button variant="outlined" onClick={() => navigate('/login')}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md">
        <Box sx={{ mt: 8 }}>
          <Paper elevation={3} sx={{ p: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              About AI Chat
            </Typography>
            <Typography variant="body1" paragraph>
              AI Chat is an innovative platform that leverages cutting-edge artificial intelligence 
              to provide meaningful and engaging conversations. Our application combines modern 
              technology with an intuitive user interface to deliver a seamless chat experience.
            </Typography>
            <Typography variant="body1" paragraph>
              Whether you're looking to practice conversation skills, seek information, or simply 
              enjoy an intelligent discussion, our AI-powered chat system is here to help.
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Key Features
            </Typography>
            <Typography variant="body1" component="ul" sx={{ pl: 2 }}>
              <li>Advanced AI conversation capabilities</li>
              <li>Secure user authentication</li>
              <li>Intuitive user interface</li>
              <li>Responsive design for all devices</li>
            </Typography>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default About;