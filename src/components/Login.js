import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (storedUser.email === formData.email) {
      localStorage.setItem('isLoggedIn', true);
      navigate('/chat');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography variant="h5" align="center" gutterBottom>Sign In</Typography>

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
  );
}

export default Login;
