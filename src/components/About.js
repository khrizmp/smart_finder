import React from 'react';
import { Container, Typography, Box, Button, AppBar, Toolbar, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { styled, keyframes } from '@mui/system';

const slideIn = keyframes`
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AnimatedPaper = styled(Paper)`
  animation: ${slideIn} 1s ease-out;
  background: linear-gradient(90deg, #ff0000, #00ff00, #0000ff, #ff0000);
  background-size: 300% 300%;
  animation: ${slideIn} 1s ease-out, ${gradientAnimation} 5s ease infinite;
`;

function About() {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)',
        color: '#ffffff'
      }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/home')}
            sx={{ color: '#ffffff', borderColor: '#ffffff' }}
          >
            Home
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => navigate('/login')}
            sx={{ color: '#ffffff', borderColor: '#ffffff' }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md">
        <Box sx={{ mt: 8 }}>
          <AnimatedPaper elevation={3} sx={{ 
            p: 4,
            color: '#ffffff'
          }}>
            <Typography variant="h3" component="h1" gutterBottom>
              About Smart Finder
            </Typography>
            <Typography variant="body1" paragraph>
            Our Website Scourer Agent is designed to mine data from the web with precision and efficiency. 
            By analyzing user instructions, identifying key topics, and applying relevant data labels, 
            the Agent conducts targeted searches to extract clean, well-structured, and labeled data from across the internet. 
            It systematically scans web pages, articles, reports, forums, and code repositories to gather high-quality information 
            that can be used for training models or supporting research. Whether working with provided data labels or generating them dynamically, 
            the Agent ensures the collected data is accurate, relevant, and ready for analysis, making it an essential tool for data-driven projects.
            </Typography>
            <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
              Key Features
            </Typography>
            <Typography variant="body1" component="ul" sx={{ pl: 2 }}>
              <li>Enable retrieval-augmented generation (RAG) tasks by orchestrating multiple specialized 
                AI agents for diverse data-handling and question-answering processes.</li>
              <li>Dynamically query Google (or similar search endpoints) to fetch targeted information,
                 ensuring more accurate and contextually relevant search results.</li>
              <li>Efficiently insert and retrieve vectorized data by integrating Pinecone Vector Store to build and maintain a robust knowledge base, 
                enabling fast and context-rich information access .</li>
            </Typography>
          </AnimatedPaper>
        </Box>
      </Container>
    </Box>
  );
}

export default About;