import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, Link, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { verifyUser } from '../services/database';
import { styled, keyframes } from '@mui/system';

// 🌈 Gradient Animation
const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// 🎨 Styled Animated Title
const AnimatedTitle = styled(Typography)`
  background: linear-gradient(90deg, #ff0000, #00ff00, #0000ff, #ff0000);
  background-size: 300% 300%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ${gradientAnimation} 5s ease infinite;
  text-align: center;
`;

// 🔗 Reusable Navigation Button
const NavButton = ({ label, path }) => {
  const navigate = useNavigate();
  return (
    <Button variant="outlined" onClick={() => navigate(path)} sx={{ color: '#fff', borderColor: '#fff', textTransform: 'none' }}>
      {label}
    </Button>
  );
};

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { email, password } = formData;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }

    try {
      const result = await verifyUser(email.toLowerCase(), password);
      if (result.success) {
        const token = btoa(
          JSON.stringify({
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
          })
        );
        localStorage.setItem('token', token);
        navigate('/chat');
      } else {
        setError(result.error || 'Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1a1a1a, #2d2d2d)', color: '#fff' }}>
      {/* 🌐 Navigation Bar */}
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
          <NavButton label="Home" path="/home" />
          <NavButton label="About" path="/about" />
        </Toolbar>
      </AppBar>

      {/* 🔐 Login Form */}
      <Container maxWidth="xs">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper elevation={3} sx={{ p: 5, width: '110%', backgroundColor: '#333', color: '#fff' }}>
            <AnimatedTitle variant="h3" gutterBottom>
              Sign In
            </AnimatedTitle>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                margin="normal"
                required
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                InputLabelProps={{ style: { color: '#fff' } }}
                InputProps={{ style: { color: '#fff' } }}
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2, backgroundColor: '#42b883',fontSize: '1.2rem', '&:hover': { backgroundColor: '#005000' } }}>
                Sign In
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link href="#" onClick={() => navigate('/register')} sx={{ color: '#42b883' }}>
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

export default Login;
