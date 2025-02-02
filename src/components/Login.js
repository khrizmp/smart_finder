import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, Link, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { verifyUser } from '../services/database';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!formData.password) {
      setError('Password is required');
      return;
    }

    try {
      const result = await verifyUser(formData.email.toLowerCase(), formData.password);

      if (result.success) {
        // Create session token
        const token = btoa(JSON.stringify({
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
        }));

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
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* 🌐 Top Navigation Bar */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/home')}>
            Home
          </Button>
          <Button variant="outlined" onClick={() => navigate('/about')}>
            About
          </Button>
        </Toolbar>
      </AppBar>

      {/* 🗂️ Login Form */}
      <Container maxWidth="xs">
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
            <Typography variant="h5" align="center" gutterBottom>
              Sign In
            </Typography>

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
              />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
                Sign In
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link href="#" onClick={() => navigate('/register')}>
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
